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


const app = express();
app.use(logger("dev"));

app.use(cors());
app.use(express.json());

const evisaRoutes = require("./routes/evisa");
const evisaCategoryRoutes = require("./routes/evisaId/evisa-category");
const evisaTypeRoutes = require("./routes/evisaId/evisa-type");
const evisaDestinationRoutes = require("./routes/evisaId/evisa-destination");
const evisaDurationRoutes = require("./routes/evisaId/evisa-duration");

//routes
app.use("/api", evisaRoutes);
app.use("/api", evisaCategoryRoutes);
app.use("/api", evisaTypeRoutes);
app.use("/api", evisaDestinationRoutes);
app.use("/api", evisaDurationRoutes);


const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`App is running on port # ${port}`);
});
