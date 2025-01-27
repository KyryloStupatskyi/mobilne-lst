const Router = require("express")
const router = new Router()

const authRouter = require("./authRouter")
const fileRouter = require("./fileRouter")

router.use("/authRoute", authRouter)
router.use("/fileRoute", fileRouter)

module.exports = router