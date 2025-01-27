const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { User, File } = require("../models/models");
const fileService = require("../services/createDir");
const sequelize = require("../dbConection");
const { authenticator } = require("otplib");

class AuthController {
  async registration(req, res, next) {
    try {
      const { email, password } = req.body;

      console.log(email, password);

      const transaction = await sequelize.transaction();

      const candidate = await User.findOne({ where: { email } });

      if (candidate) {
        await transaction.rollback();
        return res
          .status(409)
          .json({ message: "User with such email already exists" });
      }

      const salt = bcrypt.genSaltSync(5);

      const hashPassword = bcrypt.hashSync(password, salt);

      if (!hashPassword) {
        await transaction.rollback();
        return res.json({
          message: "Error creation an new user, please try again!",
        });
      }

      const user = await User.create({ email, password: hashPassword });
      const file = await File.create({
        name: user.id,
        type: "dir",
        userId: user.id,
        parentId: -1,
      });

      const isFileCreationSuccess = fileService.createDir(file);

      if (!isFileCreationSuccess) {
        await transaction.rollback();
        return res.json({
          message: "Error creation a new user, please try again!",
        });
      }

      await transaction.commit();

      const token = jsonwebtoken.sign(
        {
          userId: user.id,
          diskSpace: user.diskSpace,
          usedSpace: user.usedSpace,
          email: user.email,
        },
        process.env.JSONWEBTOKEN_SECRET_KEY,
        { expiresIn: "24h" }
      );

      return res.json({ token });
    } catch (error) {
      console.log(error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const candidate = await User.findOne({ where: { email } });

      if (!candidate) {
        return res.status(404).json({
          message: "A user with this email address was not found.",
        });
      }

      const isPasswordCorrect = bcrypt.compareSync(
        password,
        candidate.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: "Incorrect password has been entered. Please try again.",
        });
      }

      if (candidate.secret) {
        return res.json({ requires2FA: true });
      }

      const token = await jsonwebtoken.sign(
        {
          userId: candidate.id,
          diskSpace: candidate.diskSpace,
          usedSpace: candidate.usedSpace,
          email: candidate.email,
        },
        process.env.JSONWEBTOKEN_SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.json({ token });
    } catch (error) {
      console.log(error);
    }
  }

  async login2FA(req, res) {
    try {
      const { email, token } = req.body;

      const candidate = await User.findOne({ where: { email } });

      if (!candidate || !candidate.secret) {
        console.log("this2");
        return res.status(400).json({
          message:
            "A user with this email address was not found or 2FA is disabled.",
        });
      }

      console.log("this");
      const isValid = authenticator.check(token, candidate.secret);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid 2FA code." });
      }

      console.log("this3");

      const jwtToken = await jsonwebtoken.sign(
        {
          userId: candidate.id,
          diskSpace: candidate.diskSpace,
          usedSpace: candidate.usedSpace,
          email: candidate.email,
        },
        process.env.JSONWEBTOKEN_SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ jwtToken });
    } catch (error) {
      console.log(error);
    }
  }

  async enable2fa(req, res) {
    try {
      const { email, password } = req.body;

      const candidate = await User.findOne({ where: { email } });

      if (!candidate) {
        return res.status(400).json({
          message: "A user with this email address was not found.",
        });
      }

      const isPasswordCorrect = bcrypt.compareSync(
        password,
        candidate.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: "Incorrect password has been entered.",
        });
      }

      const secret = authenticator.generateSecret();
      await User.update(
        {
          tempSecret: secret,
          tempSecretExpires: new Date(Date.now() + 10 * 60 * 1000),
        },
        { where: { email } }
      );

      const otpAuthUrl = authenticator.keyuri(email, "MyCloud", secret);

      res.json({ otpAuthUrl });
    } catch (error) {
      console.log(error);
    }
  }

  async confirm2fa(req, res) {
    try {
      const { email, token } = req.body;

      const candidate = await User.findOne({ where: { email } });

      if (!candidate || !candidate.tempSecret) {
        return res.status(400).json({
          message:
            "A user with this email address was not found or have no pending 2fa request.",
        });
      }

      const isValid = authenticator.check(token, candidate.tempSecret);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid 2FA code." });
      }

      await User.update(
        {
          secret: candidate.tempSecret,
          tempSecret: null,
          tempSecretExpires: null,
        },
        { where: { email } }
      );

      return res.json({ success: true, message: "2FA enabled successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  async auth(req, res) {
    const token = jsonwebtoken.sign(
      {
        userId: req.user.userId,
        diskSpace: req.user.diskSpace,
        usedSpace: req.user.usedSpace,
        email: req.user.email,
      },
      process.env.JSONWEBTOKEN_SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log(token);

    return res.json({ token });
  }
}

module.exports = new AuthController();
