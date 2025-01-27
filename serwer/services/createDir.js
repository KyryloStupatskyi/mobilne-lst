const path = require("path")
const fs = require("fs")

class FileService {
  async createDir(file) {
    try {
      const filePath = path.resolve(__dirname, "..", "files", file.userId.toString(), file.path)

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath)
        return 1
      } else {
        throw new Error("File with such name is already exist, please change it!")
      }
    } catch (error) {
      throw error
    }
  }

  async deleteFile(file) {
    try {
      const filePath = path.resolve(__dirname, '..', 'files', file.userId.toString(), file.path)

      if (file.type === "dir") {
        fs.rmdirSync(filePath)
      } else {
        fs.unlinkSync(filePath)
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = new FileService()