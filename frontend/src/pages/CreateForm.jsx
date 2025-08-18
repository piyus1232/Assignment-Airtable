import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const CreateForm = () => {
  const [title, setTitle] = useState("");
  const [baseId, setBaseId] = useState("");
  const [tableId, setTableId] = useState("");
  const [fields, setFields] = useState([
    { label: "", type: "text", required: false, options: [], conditions: [] },
  ]);

  const handleFieldChange = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const addOption = (fieldIndex) => {
    const updated = [...fields];
    updated[fieldIndex].options.push("");
    setFields(updated);
  };

  const updateOption = (fieldIndex, optIndex, value) => {
    const updated = [...fields];
    updated[fieldIndex].options[optIndex] = value;
    setFields(updated);
  };

  const addField = () => {
    setFields([
      ...fields,
      { label: "", type: "text", required: false, options: [], conditions: [] },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const questions = fields.map((f, idx) => ({
      airtableFieldId: `field_${idx}`,
      label: f.label,
      type:
        f.type === "text"
          ? "short_text"
          : f.type === "longtext"
          ? "long_text"
          : f.type === "email"
          ? "short_text"
          : f.type === "multi_select"
          ? "multi_select"
          : f.type === "file"
          ? "attachment"
          : "short_text",
      options: f.options,
      required: f.required,
      conditions: f.conditions || [],
    }));

    try {
      const res = await api.post("/forms/create", {
        title,
        baseId,
        tableId,
        questions,
      });
      alert("✅ Form created successfully!");
      console.log("Created form:", res.data);
    } catch (err) {
      console.error("❌ Failed to create form", err.response?.data || err.message);
      alert("Error creating form");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 shadow-md flex flex-col sm:flex-row justify-between items-center gap-3">
        <h1 className="text-xl font-bold">📋 Create Form</h1>
        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/create" className="hover:underline">Create Form</Link>
          <Link to="/login" className="hover:underline">Logout</Link>
        </div>
      </nav>

      {/* ✅ Main Content */}
      <div className="flex justify-center items-start py-10 px-4">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
            Create New Form
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Form Title
              </label>
              <input
                type="text"
                placeholder="Enter form title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 p-2"
                required
              />
            </div>

            {/* Base + Table IDs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base ID
                </label>
                <input
                  type="text"
                  value={baseId}
                  onChange={(e) => setBaseId(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Table ID
                </label>
                <input
                  type="text"
                  value={tableId}
                  onChange={(e) => setTableId(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 p-2"
                  required
                />
              </div>
            </div>

            {/* Fields */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Fields</h2>
              {fields.map((field, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 border rounded-lg mb-3 shadow-sm"
                >
                  {/* Label */}
                  <input
                    type="text"
                    placeholder="Field Label"
                    value={field.label}
                    onChange={(e) =>
                      handleFieldChange(index, "label", e.target.value)
                    }
                    className="w-full rounded-lg border-gray-300 p-2 mb-3 focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Type */}
                  <select
                    value={field.type}
                    onChange={(e) =>
                      handleFieldChange(index, "type", e.target.value)
                    }
                    className="w-full rounded-lg border-gray-300 p-2 mb-3 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text">Short Text</option>
                    <option value="longtext">Long Text</option>
                    <option value="email">Email</option>
                    <option value="multi_select">Multi-Select</option>
                    <option value="file">File Upload</option>
                  </select>

                  {/* Options for multi-select */}
                  {field.type === "multi_select" && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Options</h3>
                      {field.options.map((opt, i) => (
                        <input
                          key={i}
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            updateOption(index, i, e.target.value)
                          }
                          placeholder={`Option ${i + 1}`}
                          className="w-full rounded-lg border-gray-300 p-2 mb-2 focus:ring-2 focus:ring-blue-500"
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(index)}
                        className="px-3 py-1 bg-gray-200 rounded text-sm"
                      >
                        ➕ Add Option
                      </button>
                    </div>
                  )}

                  {/* Required */}
                  <label className="flex items-center text-sm text-gray-700 mt-2">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) =>
                        handleFieldChange(index, "required", e.target.checked)
                      }
                      className="mr-2"
                    />
                    Required
                  </label>
                </div>
              ))}

              <button
                type="button"
                onClick={addField}
                className="mt-2 inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
              >
                ➕ Add Field
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition"
            >
              🚀 Create Form
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
