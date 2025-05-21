// // src/context/FormDataContext.jsx
// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const FormDataContext = createContext();

// export const useFormData = () => useContext(FormDataContext);

// export const FormDataProvider = ({ children }) => {
//   const [formId, setFormId] = useState(null);
//   const [formData, setFormData] = useState({
//     personalInfo: {
//       name: "",
//       email: "",
//       addressLine1: "",
//       addressLine2: "",
//       city: "",
//       state: "",
//       zipcode: "",
//     },
//     education: {
//       isStudying: false,
//       studyingAt: "",
//     },
//     projects: [],
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Initialize or retrieve existing form data
//   useEffect(() => {
//     const savedFormId = localStorage.getItem("formId");

//     if (savedFormId) {
//       setFormId(savedFormId);
//       fetchFormData(savedFormId);
//     } else {
//       createNewForm();
//     }
//   }, []);

//   const createNewForm = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.post("/forms");
//       const { _id } = response.data;

//       setFormId(id);
//       localStorage.setItem("formId", _id);
//       setLoading(false);
//     } catch (err) {
//       setError("Failed to create a new form");
//       setLoading(false);
//       console.error("Error creating new form:", err);
//     }
//   };

//   const fetchFormData = async (id) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`/forms/${id}`);

//       setFormData({
//         personalInfo: response.data.personalInfo || formData.personalInfo,
//         education: response.data.education || formData.education,
//         projects: response.data.projects || formData.projects,
//       });

//       setLoading(false);
//     } catch (err) {
//       // If form not found, create a new one
//       if ((err.response && err.response.status === 404) || 500) {
//         createNewForm();
//       } else {
//         setError("Failed to fetch form data");
//         setLoading(false);
//         console.error("Error fetching form data:", err);
//       }
//     }
//   };

//   const updateFormSection = async (section, data) => {
//     try {
//       setLoading(true);

//       // Update local state first
//       setFormData((prev) => ({
//         ...prev,
//         [section]: data,
//       }));

//       // Then update on server
//       await axios.patch(`/forms/${formId}`, {
//         section,
//         data,
//       });

//       setLoading(false);
//     } catch (err) {
//       setError(`Failed to update ${section}`);
//       setLoading(false);
//       console.error(`Error updating ${section}:`, err);
//     }
//   };

//   const value = {
//     formId,
//     formData,
//     loading,
//     error,
//     updateFormSection,
//   };

//   return (
//     <FormDataContext.Provider value={value}>
//       {children}
//     </FormDataContext.Provider>
//   );
// };

// export default FormDataContext;

// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const FormDataContext = createContext();

// export const useFormData = () => useContext(FormDataContext);

// export const FormDataProvider = ({ children }) => {
//   const [formId, setFormId] = useState(null);
//   const [formData, setFormData] = useState({
//     personalInfo: {
//       name: "",
//       email: "",
//       addressLine1: "",
//       addressLine2: "",
//       city: "",
//       state: "",
//       zipcode: "",
//     },
//     education: {
//       isStudying: false,
//       studyingAt: "",
//     },
//     projects: [],
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const savedFormId = localStorage.getItem("formId");

//     if (savedFormId && savedFormId !== "undefined") {
//       setFormId(savedFormId);
//       fetchFormData(savedFormId);
//     } else {
//       createNewForm();
//     }
//   }, []);

//   const createNewForm = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.post("/forms");
//       const { _id } = response.data.id;

//       setFormId(_id); // ✅ Corrected here
//       localStorage.setItem("formId", _id);
//       setLoading(false);
//     } catch (err) {
//       setError("Failed to create a new form");
//       setLoading(false);
//       console.error("Error creating new form:", err);
//     }
//   };

//   const fetchFormData = async (id) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`/forms/${id}`);

//       setFormData({
//         personalInfo: response.data.personalInfo || formData.personalInfo,
//         education: response.data.education || formData.education,
//         projects: response.data.projects || formData.projects,
//       });

//       setLoading(false);
//     } catch (err) {
//       if (err.response && err.response.status === 404) {
//         createNewForm(); // Only retry on 404
//       } else {
//         setError("Failed to fetch form data");
//         setLoading(false);
//         console.error("Error fetching form data:", err);
//       }
//     }
//   };

//   const updateFormSection = async (section, data) => {
//     if (!formId) {
//       setError("Cannot update: formId is missing");
//       return;
//     }

//     try {
//       setLoading(true);

//       // Update local state
//       setFormData((prev) => ({
//         ...prev,
//         [section]: data,
//       }));

//       // Update server
//       await axios.patch(`/forms/${formId}`, {
//         section,
//         data,
//       });

//       setLoading(false);
//     } catch (err) {
//       setError(`Failed to update ${section}`);
//       setLoading(false);
//       console.error(`Error updating ${section}:`, err);
//     }
//   };

//   const value = {
//     formId,
//     formData,
//     loading,
//     error,
//     updateFormSection,
//   };

//   return (
//     <FormDataContext.Provider value={value}>
//       {children}
//     </FormDataContext.Provider>
//   );
// };

// export default FormDataContext;

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const FormDataContext = createContext();

export const useFormData = () => useContext(FormDataContext);

export const FormDataProvider = ({ children }) => {
  const [formId, setFormId] = useState(null);
  const [formData, setFormData] = useState({
    personalInfo: {
      name: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipcode: "",
    },
    education: {
      isStudying: false,
      studyingAt: "",
    },
    projects: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedFormId = localStorage.getItem("formId");
    if (savedFormId && savedFormId !== "undefined") {
      setFormId(savedFormId);
      fetchFormData(savedFormId);
    } else {
      createNewForm();
    }
    // eslint-disable-next-line
  }, []);

  // Create a new form with initial data
  const createNewForm = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/forms", formData); // send initial formData
      const { id, personalInfo, education, projects } = response.data;
      setFormId(id);
      localStorage.setItem("formId", id);
      setFormData({
        personalInfo: personalInfo || formData.personalInfo,
        education: education || formData.education,
        projects: projects || [],
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to create a new form");
      setLoading(false);
      console.error("Error creating new form:", err);
    }
  };

  // Fetch form data by ID
  const fetchFormData = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`/forms/${id}`);
      const { personalInfo, education, projects } = response.data;
      setFormData({
        personalInfo: personalInfo || formData.personalInfo,
        education: education || formData.education,
        projects: projects || [],
      });
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // If not found, create a new form
        createNewForm();
      } else {
        setError("Failed to fetch form data");
        setLoading(false);
        console.error("Error fetching form data:", err);
      }
    }
  };

  // Update a section of the form
  const updateFormSection = async (section, data) => {
    if (!formId) {
      setError("Cannot update: formId is missing");
      return;
    }
    try {
      setLoading(true);
      // Update local state
      setFormData((prev) => ({
        ...prev,
        [section]: data,
      }));
      // Update server
      await axios.patch(`/forms/${formId}`, {
        section,
        data,
      });
      setLoading(false);
    } catch (err) {
      // Try to extract validation errors from backend
      const backendErrors = err.response?.data?.errors;
      if (backendErrors && Array.isArray(backendErrors)) {
        setError(
          backendErrors.map((e) => `${e.field}: ${e.message}`).join(", ")
        );
      } else {
        setError(`Failed to update ${section}`);
      }
      setLoading(false);
      console.error(`Error updating ${section}:`, err);
    }
  };

  const value = {
    formId,
    formData,
    loading,
    error,
    updateFormSection,
  };

  return (
    <FormDataContext.Provider value={value}>
      {children}
    </FormDataContext.Provider>
  );
};

export default FormDataContext;
