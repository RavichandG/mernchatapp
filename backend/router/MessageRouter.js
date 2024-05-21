const express = require("express")
const protect = require("../middleware/authMiddleware")
const router = express.Router()
const {sendMessage, allMessages} = require("../controller/messageController")

router.route("/").post(protect,sendMessage).get((req,res)=>res.json({message:"hello"}))
router.route("/:chatId").get(protect,allMessages)

module.exports = router