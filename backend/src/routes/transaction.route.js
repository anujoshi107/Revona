import { Router } from "express";

import {
  bulkDeleteTransactionController,
  bulkTransactionController,
  createTransactionController,
  deleteTransactionController,
  getAllTransactionController,
  getTransactionByIdController,
  scanReceiptController,
  updateTransactionController,
} from "../controllers/transaction.controller.js";

import { upload } from "../config/cloudinary.config.js";

const transactionRoutes = Router();

transactionRoutes.post("/create", createTransactionController);

transactionRoutes.post(
  "/scan-receipt",
  upload.single("receipt"),
  scanReceiptController
);

transactionRoutes.post("/bulk-transaction", bulkTransactionController);

transactionRoutes.put("/update/:id", updateTransactionController);

transactionRoutes.get("/all", getAllTransactionController);
transactionRoutes.get("/:id", getTransactionByIdController);

transactionRoutes.delete("/delete/:id", deleteTransactionController);
transactionRoutes.delete("/bulk-delete", bulkDeleteTransactionController);

export default transactionRoutes;