import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../utils/api";

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [searchParams] = useSearchParams();

  // Step 1: Store user_id from URL into localStorage and clean up URL
  useEffect(() => {
    const userId = searchParams.get("user_id");
    if (userId) {
      localStorage.setItem("user_id", userId);
      console.log("💾 Stored user_id in localStorage:", userId);

      // Clean the URL to remove ?user_id=...
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  // Step 2: Wait for user_id before making API request
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      console.warn("🚫 No user_id in localStorage. Skipping API call.");
      return;
    }

    const fetchForms = async () => {
      try {
        const res = await api.get("/forms/my");
        setForms(res.data);
      } catch (err) {
        console.error("❌ Failed to load forms", err.response?.data || err.message);
      }
    };

    fetchForms();
  }, [searchParams]); // Rerun if query param changes

  // UI Rendering
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          📋 My Forms
        </h1>

        {forms.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600">You haven’t created any forms yet.</p>
            <Link
              to="/create"
              className="mt-4 inline-block px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
            >
              ➕ Create Your First Form
            </Link>
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-6">
            {forms.map((form) => (
              <li
                key={form._id}
                className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition"
              >
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {form.title || "Untitled Form"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Questions: {form.questions.length}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/form/${form._id}`}
                    className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Open
                  </Link>
                  <Link
                    to={`/form/${form._id}/responses`}
                    className="flex-1 text-center py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Responses
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
