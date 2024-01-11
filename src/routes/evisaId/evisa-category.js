// @ts-check
const express = require('express')
const router = express.Router();

const {create,update,remove,list } = require('../../controllers/evisaId/evisa-category')

// adminmiddleware and superadminmiddleware required
router.post("/evisa-category/create", create)
router.get("/evisa-category", list)
router.put("/evisa-category/update/:id",update)
router.post("/evisa-category/remove", remove)


module.exports = router;