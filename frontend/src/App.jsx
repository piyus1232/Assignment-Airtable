import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/DashBoard.jsx";
import FormBuilderPage from "./pages/FormBuilderPage";
import FormViewerPage from "./pages/FormViewerPage";
import React from "react";
import CreateForm from "./pages/CreateForm.jsx";
import FormPage from "./pages/FormPage.jsx";
import ResponsesPage from "./pages/ResponsesPage.jsx";

import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder" element={<FormBuilderPage />} />
        {/* <Route path="/form/:id" element={<FormViewerPage />} /> */}
         <Route path="/create" element={<CreateForm />} />
           <Route path="/form/:id" element={<FormPage />} /> {/* ⬅️ new */}
           <Route path="/form/:id/responses" element={<ResponsesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
