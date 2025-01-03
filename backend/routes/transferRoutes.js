const express = require("express");
const TransferController = require("../controllers/transferController");

const router = express.Router();


router.post("/:id", TransferController.createTransfer);


router.get("/:id/transfer-summary", TransferController.getTransferSummary);

router.get("/:id/transactions", TransferController.getAllTransactions);

router.get("/:id/transaction/:transferId", TransferController.getTransferDetails);

module.exports = router;
