import React from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  const handleLogin = () => {
    window.location.href = "https://assignment-airtable-k8ol.onrender.com/airtable/login";
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-xl rounded-2xl p-10 w-[90%] max-w-md flex flex-col items-center gap-6"
      >
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome Back 👋
        </h1>
        <p className="text-gray-500 text-center">
          Sign in with your Airtable account to continue
        </p>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md transition"
        >
          <img
            src="https://static.airtable.com/images/favicon/beta/favicon-32x32.png"
            alt="Airtable"
            className="w-6 h-6"
          />
          Login with Airtable
        </button>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm font-medium"
          >
            OAuth failed, please try again.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
