import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    form: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
    answers: { type: Map, of: mongoose.Schema.Types.Mixed }, // dynamic fields
  },
  { timestamps: true }
);

export default mongoose.model("Response", responseSchema);
