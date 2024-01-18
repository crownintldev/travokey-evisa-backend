
const { google } = require("googleapis");
const express = require('express')
const router = express.Router();

const {create,update,remove,list } = require('../controllers/evisa')

// adminmiddleware and superadminmiddleware required
router.post("/evisa/create", create)
router.get("/evisa/:query?", list)
router.put("/evisa/update/:id",update)
router.post("/evisa/remove", remove)  

module.exports = router;