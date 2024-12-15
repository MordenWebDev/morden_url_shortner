import express from "express";
import {
  generateShortUrl,
  editUserUrl,
  deleteUserUrl,
  redirect,
  getUserUrlsWithPagination,
} from "../controllers/urlController.js";
import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", authenticate, generateShortUrl);
router.get("/user/urls", authenticate, getUserUrlsWithPagination);
router.patch("/urls/:shortUrl", authenticate, editUserUrl); // Edit URL
router.delete("/urls/:shortUrl", authenticate, deleteUserUrl);
router.get("/redirect/:shortUrl", redirect);

export default router;
