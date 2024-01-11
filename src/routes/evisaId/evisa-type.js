// @ts-check
const express = require('express')
const router = express.Router();

const {create,update,remove,list } = require('../../controllers/evisaId/evisa-type')

// adminmiddleware and superadminmiddleware required
router.post("/evisa-type/create", create)
router.get("/evisa-type", list)
router.put("/evisa-type/update/:id",update)
router.post("/evisa-type/remove", remove)

module.exports = router;