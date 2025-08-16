import React, { useState } from "react";
import api from "../utils/api";

const FormBuilderPage = () => {
  const [questions, setQuestions] = useState([]);
  const [label, setLabel] = useState("");

  const addQuestion = () => {
    setQuestions([...questions, { label, type: "short_text" }]);
    setLabel("");
  };

  const saveForm = async () => {
    try {
      const res = await api.post("/forms/create", {
        baseId: "base123",   // replace with real Airtable base
        tableId: "tbl456",   // replace with real table
        questions,
      });
      alert("Form created: " + res.data._id);
    } catch (err) {
      console.error("Failed to save form", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Form Builder</h1>
      <div className="mt-4">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Question label"
          className="border p-2"
        />
        <button onClick={addQuestion} className="ml-2 px-4 py-2 bg-green-600 text-white">
          Add
        </button>
      </div>
      <ul className="mt-4">
        {questions.map((q, idx) => (
          <li key={idx}>{q.label}</li>
        ))}
      </ul>
      <button onClick={saveForm} className="mt-4 px-4 py-2 bg-blue-600 text-white">
        Save Form
      </button>
    </div>
  );
};

export default FormBuilderPage;
