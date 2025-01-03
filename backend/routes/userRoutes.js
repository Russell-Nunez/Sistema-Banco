const express = require("express");
const UserController = require("../controllers/userController");

const router = express.Router();


router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/:id", UserController.getUserById);


router.get("/:id/balance", UserController.getUserBalance);


router.get("/:id/transactions", UserController.getUserTransactions);

module.exports = router;
