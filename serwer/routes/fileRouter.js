const Router = require("express");
const router = new Router();

const fileController = require("../controllers/fileController");
const authMidleware = require("../midlewares/authMidleware");

router.get("/getFiles", authMidleware, fileController.getFiles);
router.get("/downloadFile", authMidleware, fileController.downloadFile);
router.post("/createDir", authMidleware, fileController.createDir);
router.post("/uploadFile", authMidleware, fileController.uploadFile);
router.delete("/deleteFile", authMidleware, fileController.deleteFile);

module.exports = router;
