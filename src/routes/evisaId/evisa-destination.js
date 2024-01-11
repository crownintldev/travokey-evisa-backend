// @ts-check
const express = require('express')
const router = express.Router();

const {create,update,remove,list } = require('../../controllers/evisaId/evisa-destination')

// adminmiddleware and superadminmiddleware required
router.post("/evisa-destination/create", create)
router.get("/evisa-destination", list)
router.put("/evisa-destination/update/:id",update)
router.post("/evisa-destination/remove", remove)

module.exports = router;