const express = require("express")
const { RegisterUser, loginUser, getAllUsers } = require("../controller/userController")
const router = express.Router()
const protect = require("../middleware/authMiddleware")

router.route("/").post(RegisterUser).get(protect, getAllUsers)
router.post("/login",loginUser)

module.exports = router