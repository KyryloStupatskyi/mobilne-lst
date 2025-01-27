require("dotenv").config();

const express = require("express");
const router = require("./routes");
const sequelize = require("./dbConection");
const models = require("./models/models");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const error = require("./midlewares/error");

const app = express();

app.use(express.json());
app.use(fileUpload({}));
app.use(cors());
app.use("/api", router);

app.use(error);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(process.env.PORT, () => {
      console.log(`Server is working on PORT ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
