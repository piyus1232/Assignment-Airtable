import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const FormPage = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch form by ID
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await api.get(`/forms/${id}`);
        setForm(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch form", err.response?.data || err.message);
        setError("Failed to load form");
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  const handleChange = (fieldId, value) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  // ✅ Check if a question should be visible based on its conditions
  const shouldShowQuestion = (q) => {
    if (!q.conditions || q.conditions.length === 0) return true;

    return q.conditions.every((cond) => {
      const userAnswer = answers[cond.field];
      return userAnswer === cond.value;
    });
  };

  // ✅ Submit answers
  const handleSubmit = async (e) => {
    e.preventDefault();

    // only validate visible questions
    const visibleQuestions = form.questions.filter(shouldShowQuestion);

    if (Object.keys(answers).length < visibleQuestions.length) {
      alert("⚠️ Please answer all visible questions.");
      return;
    }

    try {
      await api.post(`/forms/${form._id}/submit`, answers);
      alert("✅ Response submitted!");
      setAnswers({});
    } catch (err) {
      console.error("❌ Failed to submit", err.response?.data || err.message);
      alert("Error submitting response");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        ⏳ Loading form...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        No form found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{form.title}</h1>
        <p className="text-gray-500 mb-6">Please fill out the form below</p>
        <hr className="mb-6" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.questions.map((q) =>
            shouldShowQuestion(q) ? (
              <div
                key={q._id}
                className="p-5 bg-gray-50 border rounded-xl shadow-sm hover:shadow-md transition"
              >
                <label className="font-semibold text-gray-700 block mb-3">
                  {q.label}
                </label>

                {/* Short Text */}
                {q.type === "short_text" && (
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 p-3 text-gray-800"
                    placeholder="Type your answer..."
                    value={answers[q._id] || ""}
                    onChange={(e) => handleChange(q._id, e.target.value)}
                  />
                )}

                {/* Long Text */}
                {q.type === "long_text" && (
                  <textarea
                    rows={4}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 p-3 text-gray-800"
                    placeholder="Write your detailed response..."
                    value={answers[q._id] || ""}
                    onChange={(e) => handleChange(q._id, e.target.value)}
                  />
                )}

                {/* Single Select */}
                {q.type === "single_select" && (
                  <select
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 p-3 text-gray-800"
                    value={answers[q._id] || ""}
                    onChange={(e) => handleChange(q._id, e.target.value)}
                  >
                    <option value="">Select an option</option>
                    {q.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {/* Multi Select */}
                {q.type === "multi_select" && (
                  <div className="flex flex-wrap gap-2">
                    {q.options?.map((opt) => {
                      const isSelected = (answers[q._id] || []).includes(opt);
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => {
                            const prev = answers[q._id] || [];
                            if (isSelected) {
                              handleChange(
                                q._id,
                                prev.filter((o) => o !== opt)
                              );
                            } else {
                              handleChange(q._id, [...prev, opt]);
                            }
                          }}
                          className={`px-4 py-2 rounded-full border transition ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Attachment */}
                {q.type === "attachment" && (
                  <input
                    type="file"
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 p-3"
                    onChange={(e) => handleChange(q._id, e.target.files[0])}
                  />
                )}
              </div>
            ) : null
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md transition text-lg"
          >
            ✅ Submit Response
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormPage;
