import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";

const ResponsesPage = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formRes, responsesRes] = await Promise.all([
          api.get(`/forms/${id}`),
          api.get(`/forms/${id}/responses`),
        ]);
        setForm(formRes.data);
        setResponses(responsesRes.data);
      } catch (err) {
        console.error("❌ Failed to load data", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const exportCSV = () => {
    if (!responses.length) return;
    const headers = ["#", "Submitted At", ...form.questions.map((q) => q.label)];
    const rows = responses.map((res, idx) => [
      idx + 1,
      new Date(res.createdAt).toLocaleString(),
      ...form.questions.map((q) => res.answers[q._id] || "-"),
    ]);

    let csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${form.title || "form"}-responses.csv`;
    link.click();
  };

  if (loading) return <p className="p-6 text-gray-600">Loading responses...</p>;
  if (!form) return <p className="p-6 text-red-500">Form not found</p>;
  if (responses.length === 0)
    return (
      <div className="p-6 flex flex-col items-center justify-center text-gray-600">
        <p className="text-lg">📭 No responses yet.</p>
        <p className="text-sm text-gray-400">Share your form link to collect responses.</p>
      </div>
    );

  return (
    <div className="p-6">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h1 className="text-2xl font-bold text-gray-800">
          📊 Responses for {form.title}
        </h1>
        <div className="flex gap-3">
          <Link
            to="/dashboard"
            className="bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-300 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            + Create Form
          </Link>
          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
          >
            ⬇️ Export CSV
          </button>
        </div>
      </div>

      {/* Responses Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="border px-4 py-2 text-left">#</th>
              <th className="border px-4 py-2 text-left">Submitted At</th>
              {form.questions.map((q) => (
                <th key={q._id} className="border px-4 py-2 text-left">
                  {q.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responses.map((res, idx) => (
              <tr
                key={res._id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border px-4 py-2">{idx + 1}</td>
                <td className="border px-4 py-2">
                  {new Date(res.createdAt).toLocaleString()}
                </td>
                {form.questions.map((q) => (
                  <td key={q._id} className="border px-4 py-2">
                    {res.answers[q._id] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponsesPage;
