// @ts-check
const express = require('express')
const router = express.Router();

const {create,update,remove,list } = require('../../controllers/evisaId/evisa-duration')

// adminmiddleware and superadminmiddleware required
router.post("/evisa-duration/create", create)
router.get("/evisa-duration", list)
router.put("/evisa-duration/update/:id",update)
router.post("/evisa-duration/remove", remove)

module.exports = router;