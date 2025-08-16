import express from "express";
import { getBases, getTables, submitForm, createForm, getForm,getMyForms,getResponses } from "../controllers/formController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/my", protect, getMyForms)

router.post("/:id/submit", submitForm);

router.route("/bases").get(protect, getBases);
router.get("/:id/responses", protect, getResponses);

router.route("/:id").get(getForm);
router.route("/:baseId/tables").get(protect, getTables);
router.route("/create").post(protect, createForm);


// IMPORTANT: put this before /:id
// routes/formRoutes.js






export default router;
