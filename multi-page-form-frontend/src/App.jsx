// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import PersonalInfoForm from "./components/PersonalInfoForm";
import EducationForm from "./components/EducationForm";
import ProjectsForm from "./components/ProjectsForm";
import FormCompletion from "./components/FormCompletion";
import FormLayout from "./components/FormLayout";
import { FormDataProvider } from "./context/FormDataContext";

import axios from "axios";

// Set base URL for API calls
// axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.baseURL = import.meta.env.VITE_BACKENDURL;

function App() {
  return (
    <FormDataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<FormLayout />}>
            <Route index element={<Navigate to="/personal-info" replace />} />
            <Route path="personal-info" element={<PersonalInfoForm />} />
            <Route path="education" element={<EducationForm />} />
            <Route path="projects" element={<ProjectsForm />} />
            <Route path="completion" element={<FormCompletion />} />
          </Route>
        </Routes>
      </Router>
    </FormDataProvider>
  );
}

export default App;
