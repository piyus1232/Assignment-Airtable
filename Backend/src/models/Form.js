import mongoose from "mongoose";

const conditionSchema = new mongoose.Schema({
  field: String,
  value: mongoose.Schema.Types.Mixed,
  showField: String,
});

const questionSchema = new mongoose.Schema({
  airtableFieldId: String,
  label: String,
  type: { 
    type: String, 
    enum: ["short_text", "long_text", "single_select", "multi_select", "attachment"] 
  },
  options: [String], // for select types
  conditions: [
    {
      field: String,   // id of the parent question
      value: mongoose.Schema.Types.Mixed, // expected answer
      showField: String, // field to reveal
    }
  ],
});
const formSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    baseId: String,
    tableId: String,
    title:String,
    questions: [questionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Form", formSchema);
