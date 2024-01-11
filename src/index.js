const express = require("express");
const cloudinary = require("cloudinary").v2;
const logger = require("morgan");

const cors = require("cors");
require("dotenv").config();
require("./utils/db/conn");

cloudinary.config({
    cloud_name: process.env.CloudinaryName,
    api_key: process.env.CloudinaryApiKey,
    api_secret: process.env.CloudinaryApiSecret,
  });

  const evisaRoutes = require("./routes/evisa");
  const evisaCategoryRoutes = require("./routes/evisa");


const app = express();
app.use(logger("dev"));

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 9000;




app.listen(port, () => {
    console.log(`App is running on port # ${port}`);
  });
  