import { listBases, listTables, createRecord } from "../utils/airtableClient.js";
import Form from "../models/Form.js";
import Response from "../models/Response.js";
import mongoose from "mongoose";

export const getBases = async (req, res) => {
  try {
    const bases = await listBases();
    res.json(bases);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bases" });
  }
};

export const getTables = async (req, res) => {
  try {
    const tables = await listTables(req.params.baseId);
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tables" });
  }
};

export const createForm = async (req, res) => {
  try {
    console.log("📩 Incoming payload for createForm:", req.body);
    console.log("👤 Auth user:", req.user);

    const { baseId, tableId, questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "At least one question is required" });
    }

    const form = await Form.create({
      owner: req.user._id,   // 👈 required
      baseId: baseId || null,
      tableId: tableId || null,
      questions,
    });

    console.log("✅ Created form:", form);

    res.status(201).json(form);
  } catch (err) {
    console.error("❌ Failed to create form:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
export const getMyForms = async (req, res) => {
  try {
    console.log("👉 getMyForms user:", req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      console.warn("⚠️ Invalid ObjectId:", req.user._id);
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const forms = await Form.find({ owner: req.user._id });
    console.log("✅ Found forms:", forms);

    res.json(forms);
  } catch (error) {
  console.error("❌ Failed to fetch forms:", error); // full error object
  res.status(500).json({
    error: "Failed to fetch form",
    details: error.message, // include actual error reason
    stack: error.stack,     // temporary: shows where it failed
  });
}
};


export const getForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: "Form not found" });
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch form" });
  }
};
export const submitForm = async (req, res) => {
  try {
    const { id } = req.params; // now it’s route param
    const answers = req.body;

    const form = await Form.findById(id);
    if (!form) return res.status(404).json({ error: "Form not found" });

    const response = await Response.create({
      form: form._id,
      answers,
    });

    res.json({ success: true, response });
  } catch (error) {
    console.error("❌ Failed to submit response:", error);
    res.status(500).json({ error: "Failed to submit response" });
  }
};


export const getResponses = async (req, res) => {
  try {
    const { id } = req.params;
    const responses = await Response.find({ form: id });
    res.json(responses);
  } catch (error) {
    console.error("❌ Failed to fetch responses:", error);
    res.status(500).json({ error: "Failed to fetch responses" });
  }
};

