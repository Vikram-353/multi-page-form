// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useNavigate } from "react-router-dom";
// import { educationSchema } from "../schemas/validationSchemas";
// import { useFormData } from "../context/FormDataContext";
// import { useState, useEffect } from "react";

// const EducationForm = () => {
//   const { formData, updateFormSection } = useFormData();
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     reset,
//   } = useForm({
//     resolver: zodResolver(educationSchema),
//     defaultValues: formData.education,
//   });

//   const isStudying = watch("isStudying");

//   useEffect(() => {
//     reset(formData.education);
//   }, [formData.education, reset]);

//   const onSubmit = async (data) => {
//     try {
//       setIsSubmitting(true);
//       await updateFormSection("education", data);
//       navigate("/projects");
//     } catch (error) {
//       console.error("Failed to save education info:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBack = async () => {
//     // Save current form data before navigating back
//     try {
//       const formValues = {
//         isStudying: watch("isStudying"),
//         studyingAt: watch("studyingAt") || "",
//       };
//       await updateFormSection("education", formValues);
//     } catch (error) {
//       console.error("Failed to save current education info:", error);
//     }
//     navigate("/personal-info");
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6">Educational Status</h2>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="mb-6">
//           <div className="flex items-center">
//             <input
//               id="isStudying"
//               type="checkbox"
//               className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//               {...register("isStudying")}
//             />
//             <label className="ml-2 text-gray-700" htmlFor="isStudying">
//               Are you still studying?
//             </label>
//           </div>
//           {errors.isStudying && (
//             <p className="error-message">{errors.isStudying.message}</p>
//           )}
//         </div>

//         {isStudying && (
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2" htmlFor="studyingAt">
//               Where are you studying?
//             </label>
//             <input
//               id="studyingAt"
//               type="text"
//               className="form-input"
//               placeholder="Enter your school/university name"
//               {...register("studyingAt")}
//             />
//             {errors.studyingAt && (
//               <p className="error-message">{errors.studyingAt.message}</p>
//             )}
//           </div>
//         )}

//         <div className="flex justify-between mt-6">
//           <button type="button" className="btn-secondary" onClick={handleBack}>
//             Back
//           </button>
//           <button type="submit" className="btn-primary" disabled={isSubmitting}>
//             {isSubmitting ? "Saving..." : "Next: Projects"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EducationForm;

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { educationSchema } from "../schemas/validationSchemas";
import { useFormData } from "../context/FormDataContext";
import { useState, useEffect } from "react";
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Loader,
  School,
  Building,
} from "lucide-react";

const EducationForm = () => {
  const { formData, updateFormSection } = useFormData();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: formData.education || {
      isStudying: false,
      studyingAt: "",
      highestEducation: "",
      graduationYear: "",
      fieldOfStudy: "",
    },
    mode: "onChange",
  });

  const isStudying = watch("isStudying");
  const highestEducation = watch("highestEducation");

  useEffect(() => {
    if (formData.education) {
      reset(formData.education);
    }
  }, [formData.education, reset]);

  useEffect(() => {
    if (isDirty) {
      setFormTouched(true);
    }
  }, [isDirty]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await updateFormSection("education", data);
      navigate("/projects");
    } catch (error) {
      console.error("Failed to save education info:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = async () => {
    // Save current form data before navigating back
    if (formTouched) {
      try {
        const formValues = {
          isStudying: watch("isStudying"),
          studyingAt: watch("studyingAt") || "",
          highestEducation: watch("highestEducation") || "",
          graduationYear: watch("graduationYear") || "",
          fieldOfStudy: watch("fieldOfStudy") || "",
        };
        await updateFormSection("education", formValues);
      } catch (error) {
        console.error("Failed to save current education info:", error);
      }
    }
    navigate("/personal-info");
  };

  // Get current year for the graduation year dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const educationLevels = [
    { value: "", label: "Select highest education level" },
    { value: "high_school", label: "High School" },
    { value: "associate", label: "Associate Degree" },
    { value: "bachelor", label: "Bachelor's Degree" },
    { value: "master", label: "Master's Degree" },
    { value: "doctorate", label: "Doctorate" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="bg-white rounded-lg" id="education-form">
      <div className="flex items-center mb-6">
        <BookOpen className="text-blue-600 mr-3" size={26} />
        <h2 className="text-2xl font-bold text-gray-800">
          Educational Background
        </h2>
      </div>

      <p className="text-gray-600 mb-6">
        Please provide information about your educational background. This helps
        us understand your qualifications better.
      </p>

      <form
        id="current-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Current Education Status */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center mb-4">
            <School className="text-blue-600 mr-2" size={20} />
            <h3 className="text-lg font-medium text-gray-800">
              Current Education Status
            </h3>
          </div>

          <div className="mb-2">
            <label className="flex items-center p-2 bg-white rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                id="isStudying"
                type="checkbox"
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                {...register("isStudying")}
              />
              <span className="ml-2 text-gray-700 font-medium">
                I am currently a student
              </span>
            </label>
            {errors.isStudying && (
              <p className="mt-1 text-sm text-red-600">
                {errors.isStudying.message}
              </p>
            )}
          </div>

          {isStudying && (
            <div className="mt-4 pl-4 border-l-2 border-blue-200">
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="studyingAt"
                >
                  Where are you studying?
                </label>
                <div className="relative">
                  <Building
                    className="absolute top-3 left-3 text-gray-400"
                    size={18}
                  />
                  <input
                    id="studyingAt"
                    type="text"
                    className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your school/university name"
                    {...register("studyingAt")}
                  />
                </div>
                {errors.studyingAt && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.studyingAt.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          {" "}
          <button type="button" className="btn-secondary" onClick={handleBack}>
            Back{" "}
          </button>{" "}
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Next: Projects"}{" "}
          </button>{" "}
        </div>
      </form>
    </div>
  );
};

export default EducationForm;
