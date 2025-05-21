// // src/components/ProjectsForm.jsx
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useNavigate } from "react-router-dom";
// import { projectsArraySchema } from "../schemas/validationSchemas";
// import { useFormData } from "../context/FormDataContext";
// import { useState, useEffect } from "react";

// const ProjectsForm = () => {
//   const { formData, updateFormSection } = useFormData();
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const {
//     register,
//     control,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: zodResolver(projectsArraySchema),
//     defaultValues: {
//       projects:
//         formData.projects.length > 0
//           ? formData.projects
//           : [{ projectName: "", projectDescription: "" }],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "projects",
//   });

//   // Reset form with formData when it changes
//   useEffect(() => {
//     if (formData.projects.length > 0) {
//       reset({ projects: formData.projects });
//     }
//   }, [formData.projects, reset]);

//   const onSubmit = async (data) => {
//     console.log("Submitting projects:", data || 0); // <-- Add this

//     try {
//       setIsSubmitting(true);
//       await updateFormSection("projects", data.projects);
//       navigate("/completion");
//     } catch (error) {
//       console.error("Failed to save projects:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBack = async () => {
//     // Save current form state before navigating back
//     try {
//       const formValues = control._formValues.projects;
//       await updateFormSection("projects", formValues);
//     } catch (error) {
//       console.error("Failed to save current projects:", error);
//     }
//     navigate("/education");
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6">Projects</h2>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         {fields.map((field, index) => (
//           <div
//             key={field.id}
//             className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Project {index + 1}</h3>
//               {fields.length > 1 && (
//                 <button
//                   type="button"
//                   className="p-1 text-red-600 hover:text-red-800"
//                   onClick={() => remove(index)}
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>

//             <div className="mb-4">
//               <label
//                 className="block text-gray-700 mb-2"
//                 htmlFor={`projects.${index}.projectName`}
//               >
//                 Project Name
//               </label>
//               <input
//                 id={`projects.${index}.projectName`}
//                 type="text"
//                 className="form-input"
//                 placeholder="Enter project name"
//                 {...register(`projects.${index}.projectName`)}
//               />
//               {errors.projects?.[index]?.projectName && (
//                 <p className="error-message">
//                   {errors.projects[index].projectName.message}
//                 </p>
//               )}
//             </div>

//             <div className="mb-2">
//               <label
//                 className="block text-gray-700 mb-2"
//                 htmlFor={`projects.${index}.projectDescription`}
//               >
//                 Project Description
//               </label>
//               <textarea
//                 id={`projects.${index}.projectDescription`}
//                 className="form-input min-h-[100px]"
//                 placeholder="Enter project description"
//                 {...register(`projects.${index}.projectDescription`)}
//               ></textarea>
//               {errors.projects?.[index]?.projectDescription && (
//                 <p className="error-message">
//                   {errors.projects[index].projectDescription.message}
//                 </p>
//               )}
//             </div>
//           </div>
//         ))}

//         {errors.projects && !Array.isArray(errors.projects) && (
//           <p className="error-message mb-4">{errors.projects.message}</p>
//         )}

//         <button
//           type="button"
//           className="w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-md mb-6 hover:bg-blue-50"
//           onClick={() => append({ projectName: "", projectDescription: "" })}
//         >
//           + Add Another Project
//         </button>

//         <div className="flex justify-between mt-6">
//           <button type="button" className="btn-secondary" onClick={handleBack}>
//             Back
//           </button>
//           <button type="submit" className="btn-primary" disabled={isSubmitting}>
//             {isSubmitting ? "Saving..." : "Complete Form"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProjectsForm;

// src/components/ProjectsForm.jsx
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { projectsArraySchema } from "../schemas/validationSchemas";
import { useFormData } from "../context/FormDataContext";
import { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Briefcase,
  FileText,
  GripVertical,
  Flag,
} from "lucide-react";

const ProjectsForm = () => {
  const { formData, updateFormSection } = useFormData();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedProject, setExpandedProject] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(projectsArraySchema),
    defaultValues: {
      projects:
        formData.projects.length > 0
          ? formData.projects
          : [{ projectName: "", projectDescription: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  const watchedProjects = watch("projects");

  // Reset form with formData when it changes
  useEffect(() => {
    if (formData.projects.length > 0) {
      reset({ projects: formData.projects });
    }
  }, [formData.projects, reset]);

  // Update form validity
  useEffect(() => {
    // Check if there's at least one project with valid name and description
    const hasValidProject = watchedProjects?.some(
      (project) => project.projectName && project.projectDescription
    );
    setIsFormValid(hasValidProject && isValid);
  }, [watchedProjects, isValid]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await updateFormSection("projects", data.projects);
      navigate("/completion");
    } catch (error) {
      console.error("Failed to save projects:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = async () => {
    // Save current form state before navigating back
    try {
      const formValues = control._formValues.projects;
      await updateFormSection("projects", formValues);
    } catch (error) {
      console.error("Failed to save current projects:", error);
    }
    navigate("/education");
  };

  const toggleProjectExpansion = (index) => {
    setExpandedProject(expandedProject === index ? null : index);
  };

  const projectHasErrors = (index) => {
    return (
      errors.projects?.[index]?.projectName ||
      errors.projects?.[index]?.projectDescription
    );
  };

  const projectIsComplete = (index) => {
    const project = watchedProjects[index];
    return (
      project?.projectName &&
      project?.projectDescription &&
      !projectHasErrors(index)
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Portfolio Projects</h2>
        <p className="text-gray-600">
          Showcase your work experiences and achievements
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          {fields.map((field, index) => {
            const isExpanded = expandedProject === index;
            const hasErrors = projectHasErrors(index);
            const isComplete = projectIsComplete(index);

            return (
              <div
                key={field.id}
                className={`mb-4 border rounded-lg transition-all duration-300 ${
                  hasErrors
                    ? "border-red-300 bg-red-50"
                    : isComplete
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200 bg-white hover:border-blue-300"
                }`}
              >
                {/* Project Header - Always visible */}
                <div
                  className={`flex justify-between items-center p-4 cursor-pointer group ${
                    isExpanded ? "border-b border-gray-200" : ""
                  }`}
                  onClick={() => toggleProjectExpansion(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 group-hover:text-gray-600">
                      <GripVertical size={18} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase size={18} className="text-blue-600" />
                      <h3 className="font-medium">
                        {watchedProjects[index]?.projectName ||
                          `Project ${index + 1}`}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasErrors && (
                      <span className="text-red-500">
                        <AlertCircle size={16} />
                      </span>
                    )}
                    {isComplete && (
                      <span className="text-green-500">
                        <CheckCircle size={16} />
                      </span>
                    )}

                    {fields.length > 1 && (
                      <button
                        type="button"
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(index);
                        }}
                        aria-label="Remove project"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Project Details - Only visible when expanded */}
                <div className={`p-4 ${isExpanded ? "block" : "hidden"}`}>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor={`projects.${index}.projectName`}
                    >
                      Project Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <Flag size={16} />
                      </div>
                      <input
                        id={`projects.${index}.projectName`}
                        type="text"
                        className={`form-input w-full py-2 pl-10 pr-3 rounded-lg border ${
                          errors.projects?.[index]?.projectName
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        } focus:border-transparent focus:ring-2 transition duration-200`}
                        placeholder="Enter project name"
                        {...register(`projects.${index}.projectName`)}
                      />
                    </div>
                    {errors.projects?.[index]?.projectName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.projects[index].projectName.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-2">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor={`projects.${index}.projectDescription`}
                    >
                      Project Description{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 text-gray-500 pointer-events-none">
                        <FileText size={16} />
                      </div>
                      <textarea
                        id={`projects.${index}.projectDescription`}
                        className={`form-input w-full py-2 pl-10 pr-3 rounded-lg border min-h-[120px] ${
                          errors.projects?.[index]?.projectDescription
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        } focus:border-transparent focus:ring-2 transition duration-200`}
                        placeholder="Describe your project, technologies used, and outcomes achieved"
                        {...register(`projects.${index}.projectDescription`)}
                      ></textarea>
                    </div>
                    {errors.projects?.[index]?.projectDescription && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.projects[index].projectDescription.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {errors.projects && !Array.isArray(errors.projects) && (
          <p className="text-sm text-red-500 mb-4">{errors.projects.message}</p>
        )}

        <button
          type="button"
          className="w-full py-3 px-4 border border-blue-500 text-blue-600 rounded-lg mb-6 hover:bg-blue-50 flex items-center justify-center gap-2 transition-colors"
          onClick={() => {
            append({ projectName: "", projectDescription: "" });
            // Expand the newly added project
            setTimeout(() => {
              setExpandedProject(fields.length);
            }, 0);
          }}
        >
          <PlusCircle size={18} />
          <span>Add Another Project</span>
        </button>

        {/* Project count indicator */}
        <div className="text-center mb-6 text-gray-600">
          <span className="font-medium">{fields.length}</span> project
          {fields.length !== 1 ? "s" : ""} added
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center gap-2"
            onClick={handleBack}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <button
            type="submit"
            className={`py-2 px-6 rounded-lg flex items-center gap-2 transition duration-200 ${
              isFormValid && !isSubmitting
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-300 text-white cursor-not-allowed"
            }`}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Complete Form"}
            {!isSubmitting && <ArrowRight size={16} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectsForm;
