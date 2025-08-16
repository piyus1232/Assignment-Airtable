import express from "express";
import { loginWithAirtable, airtableCallback } from "../controllers/authController.js";

const router = express.Router();

router.route("/airtable/login").get(loginWithAirtable);
router.route("/airtable/callback").get(airtableCallback);

export default router;
