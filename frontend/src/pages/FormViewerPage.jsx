import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const FormViewerPage = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await api.get(`/forms/${id}`);
        setForm(res.data);
      } catch (err) {
        console.error("Failed to load form", err);
      }
    };
    fetchForm();
  }, [id]);

  const handleChange = (q, value) => {
    setAnswers({ ...answers, [q.label]: value });
  };

  const handleSubmit = async () => {
    try {
      await api.post(`/forms/${form.baseId}/${form.tableId}/submit`, {
        formId: form._id,
        answers,
      });
      alert("Response submitted!");
    } catch (err) {
      console.error("Failed to submit form", err);
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Fill Form</h1>
      <form className="mt-4">
        {form.questions.map((q) => (
          <div key={q._id} className="my-2">
            <label>{q.label}</label>
            <input
              className="border p-2 w-full"
              onChange={(e) => handleChange(q, e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-blue-600 text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormViewerPage;
