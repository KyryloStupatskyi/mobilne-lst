const path = require("path");
const fs = require("fs");
const fileService = require("../services/createDir");
const { File, User } = require("../models/models");
const { Sequelize } = require("sequelize");

class FileController {
  async createDir(req, res) {
    try {
      const { parentFileId, name } = req.body;

      let file = File.build({ name, type: "dir", userId: req.user.userId });

      if (!parentFileId) {
        file.path = name;
      } else {
        const parentFile = await File.findOne({ where: { id: parentFileId } });
        file.parentId = parentFileId;
        file.path = `${parentFile.path}\\${name}`;
      }

      const isCreationSuccess = fileService.createDir(file);

      if (isCreationSuccess) {
        await file.save();
        return res.json({ file });
      }
    } catch (error) {
      return res.json({ message: error.message });
    }
  }

  async uploadFile(req, res) {
    try {
      const file = req.files.file;
      const { parent } = req.body;

      if (+req.user.usedSpace + file.size > +req.user.diskSpace) {
        return res.json({
          message: "There is no available space for this file",
        });
      }

      const user = await User.findOne({ where: { id: req.user.userId } });

      let filePath;
      const fileType = file.name.split(".")[1];
      user.usedSpace = +user.usedSpace + file.size;

      const uploadFile = File.build({
        name: file.name,
        type: fileType,
        size: file.size,
        userId: user.id,
      });

      if (parent) {
        const parentFile = await File.findOne({ where: { id: parent } });

        filePath = path.resolve(
          __dirname,
          "..",
          "files",
          user.id.toString(),
          parentFile.path,
          file.name
        );

        uploadFile.parentId = parent;
        uploadFile.path = parentFile.path + "\\" + file.name;
      } else {
        filePath = path.resolve(
          __dirname,
          "..",
          "files",
          user.id.toString(),
          file.name
        );
        uploadFile.path = file.name;
      }

      if (fs.existsSync(filePath)) {
        return res.status(409).json({
          message:
            "File this such name already exist, please change it and try again",
        });
      }

      file.mv(filePath);
      await uploadFile.save();
      await user.save();

      return res.json(uploadFile);
    } catch (error) {
      console.log(error);
    }
  }

  async getFiles(req, res) {
    const { parentId, sort } = req.query;
    console.log(parentId);

    let files;

    switch (sort) {
      case "type":
        files = await File.findAll({
          where: { userId: req.user.userId, parentId: parentId || 0 },
          order: [
            [
              Sequelize.literal(`CASE WHEN type = 'dir' THEN 0 ELSE 1 END`),
              "ASC",
            ],
            ["type", "ASC"],
          ],
        });
        break;
      case "date":
        files = await File.findAll({
          where: { userId: req.user.userId, parentId: parentId || 0 },
          order: [
            [
              Sequelize.literal(`CASE WHEN type = 'dir' THEN 0 ELSE 1 END`),
              "ASC",
            ],
            ["createdAt"],
          ],
        });
        break;
      default:
        files = await File.findAll({
          where: { userId: req.user.userId, parentId: parentId || 0 },
          order: [
            [
              Sequelize.literal(`CASE WHEN type = 'dir' THEN 0 ELSE 1 END`),
              "ASC",
            ],
            ["name"],
          ],
        });
        break;
    }

    res.json(files);
  }

  async downloadFile(req, res) {
    try {
      const { id } = req.query;

      const file = await File.findOne({
        where: { id, userId: req.user.userId },
      });

      const filePath = path.resolve(
        __dirname,
        "..",
        "files",
        req.user.userId.toString(),
        file.path
      );

      if (fs.existsSync(filePath)) {
        return res.download(filePath);
      }

      return res.json({ message: "Error download file, please try again!" });
    } catch (error) {
      res.json({ message: error.message });
    }
  }

  async deleteFile(req, res) {
    try {
      const { id } = req.query;

      const file = await File.findOne({
        where: { id, userId: req.user.userId },
      });

      fileService.deleteFile(file);
      file.destroy();
      return res.json({ message: "File was successfuly deleted!" });
    } catch (error) {
      res
        .status(406)
        .json({ message: "Error deleting file, please try again!" });
    }
  }

  async updateFile(req, res) {
    try {
      const { id, newName } = req.body;

      if (!newName) {
        return res
          .status(400)
          .json({ message: "Update filename is required!" });
      }

      const file = await File.findOne({
        where: { id, userId: req.user.userId },
      });

      if (!file) {
        return res
          .status(404)
          .json({ message: "Server error please try again!" });
      }

      const oldPath = path.resolve(
        __dirname,
        "..",
        "files",
        req.user.userId.toString(),
        file.path
      );

      const newPath = path.resolve(
        __dirname,
        "..",
        "files",
        req.user.userId.toString(),
        file.path.replace(file.name, newName)
      );

      fs.renameSync(oldPath, newPath);

      file.name = newName;

      file.save();

      return res.json(file);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error updating file, please try again!" });
    }
  }
}

module.exports = new FileController();
