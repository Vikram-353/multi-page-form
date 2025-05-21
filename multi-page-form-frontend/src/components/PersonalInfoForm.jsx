// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useNavigate } from "react-router-dom";
// import { personalInfoSchema } from "../schemas/validationSchemas";
// import { useFormData } from "../context/FormDataContext";
// import { useState, useEffect, useMemo } from "react";
// import {
//   CheckCircle,
//   AlertCircle,
//   ArrowRight,
//   User,
//   Mail,
//   Home,
//   ArrowLeft,
// } from "lucide-react";

// const PersonalInfoForm = () => {
//   const { formData, updateFormSection } = useFormData();
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formProgress, setFormProgress] = useState(0);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid, dirtyFields },
//     reset,
//     getValues,
//   } = useForm({
//     resolver: zodResolver(personalInfoSchema),
//     defaultValues: formData.personalInfo,
//     mode: "onBlur",
//   });

//   // Reset form with formData when it changes
//   useEffect(() => {
//     reset(formData.personalInfo);
//   }, [formData.personalInfo, reset]);

//   // Calculate form progress more efficiently
//   useEffect(() => {
//     const totalFields = 6;
//     const dirtyFieldsCount = Object.keys(dirtyFields).length;

//     // Count filled fields from default values
//     let filledDefaultFields = 0;
//     if (formData.personalInfo) {
//       const fieldsToCheck = [
//         "name",
//         "email",
//         "addressLine1",
//         "city",
//         "state",
//         "zipcode",
//       ];
//       fieldsToCheck.forEach((field) => {
//         if (formData.personalInfo[field]?.trim()) {
//           filledDefaultFields++;
//         }
//       });
//     }

//     const progress = Math.min(
//       100,
//       ((dirtyFieldsCount + filledDefaultFields) / totalFields) * 100
//     );
//     setFormProgress(progress);
//   }, [dirtyFields, formData.personalInfo]);

//   const onSubmit = async (data) => {
//     try {
//       setIsSubmitting(true);
//       await updateFormSection("personalInfo", data);
//       navigate("/education");
//     } catch (error) {
//       console.error("Failed to save personal info:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const InputField = useMemo(() => {
//     return ({
//       id,
//       label,
//       type = "text",
//       placeholder,
//       icon,
//       required = true,
//     }) => (
//       <div className="mb-4">
//         <label className="block text-gray-700 font-medium mb-2" htmlFor={id}>
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
//             {icon}
//           </div>
//           <input
//             id={id}
//             type={type}
//             className={`form-input w-full py-2 pl-10 pr-3 rounded-lg border ${
//               errors[id]
//                 ? "border-red-500 focus:ring-red-500"
//                 : "border-gray-300 focus:ring-blue-500"
//             } focus:border-transparent focus:ring-2 transition duration-200`}
//             placeholder={placeholder}
//             {...register(id)}
//           />
//           {errors[id] ? (
//             <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-red-500">
//               <AlertCircle size={16} />
//             </div>
//           ) : getValues(id) ? (
//             <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-500">
//               <CheckCircle size={16} />
//             </div>
//           ) : null}
//         </div>
//         {errors[id] && (
//           <p className="mt-1 text-sm text-red-500">{errors[id].message}</p>
//         )}
//       </div>
//     );
//   }, [errors, register, getValues]);

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">
//           Personal Information
//         </h2>
//         <p className="text-gray-600">Please provide your contact details</p>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
//           <h3 className="text-lg font-medium text-gray-700 mb-3">
//             Contact Information
//           </h3>

//           <InputField
//             id="name"
//             label="Full Name"
//             placeholder="Enter your full name"
//             icon={<User size={16} />}
//           />

//           <InputField
//             id="email"
//             label="Email Address"
//             type="email"
//             placeholder="Enter your email address"
//             icon={<Mail size={16} />}
//           />
//         </div>

//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
//           <h3 className="text-lg font-medium text-gray-700 mb-3">
//             Mailing Address
//           </h3>

//           <InputField
//             id="addressLine1"
//             label="Address Line 1"
//             placeholder="Enter your street address"
//             icon={<Home size={16} />}
//           />

//           <InputField
//             id="addressLine2"
//             label="Address Line 2"
//             placeholder="Apartment, suite, unit, building, floor, etc."
//             required={false}
//             icon={<Home size={16} />}
//           />

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <InputField
//               id="city"
//               label="City"
//               placeholder="Enter your city"
//               icon={<span className="font-medium">🏙️</span>}
//             />

//             <InputField
//               id="state"
//               label="State"
//               placeholder="Enter your state"
//               icon={<span className="font-medium">🏛️</span>}
//             />

//             <InputField
//               id="zipcode"
//               label="Zipcode"
//               placeholder="Enter your zipcode"
//               icon={<span className="font-medium">📮</span>}
//             />
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
//           {/* Back Button */}
//           <button
//             type="button"
//             className="w-full sm:w-auto py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center justify-center gap-2"
//             onClick={() => navigate("/")}
//           >
//             <ArrowLeft size={16} />
//             <span className="hidden sm:inline">Back</span>
//           </button>

//           {/* Next Button */}
//           <button
//             type="submit"
//             className={`w-full sm:w-auto py-2 px-6 rounded-lg flex justify-center items-center gap-2 transition duration-200 ${
//               isValid && !isSubmitting
//                 ? "bg-blue-600 hover:bg-blue-700 text-white"
//                 : "bg-blue-300 text-white cursor-not-allowed"
//             }`}
//             disabled={!isValid || isSubmitting}
//           >
//             {isSubmitting ? (
//               "Saving..."
//             ) : (
//               <>
//                 <span className="hidden sm:inline">Next: Education</span>
//                 <ArrowRight size={16} />
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PersonalInfoForm;

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { personalInfoSchema } from "../schemas/validationSchemas";
import { useFormData } from "../context/FormDataContext";
import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle,
  AlertCircle,
  ArrowRight,
  User,
  Mail,
  Home,
  ArrowLeft,
} from "lucide-react";

const PersonalInfoForm = () => {
  const { formData, updateFormSection } = useFormData();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: formData.personalInfo,
    mode: "onBlur",
  });

  useEffect(() => {
    reset(formData.personalInfo);
  }, [formData.personalInfo, reset]);

  useEffect(() => {
    const totalFields = 6;
    const dirtyFieldsCount = Object.keys(dirtyFields).length;

    let filledDefaultFields = 0;
    if (formData.personalInfo) {
      const fieldsToCheck = [
        "name",
        "email",
        "addressLine1",
        "city",
        "state",
        "zipcode",
      ];
      fieldsToCheck.forEach((field) => {
        if (formData.personalInfo[field]?.trim()) {
          filledDefaultFields++;
        }
      });
    }

    const progress = Math.min(
      100,
      ((dirtyFieldsCount + filledDefaultFields) / totalFields) * 100
    );
    setFormProgress(progress);
  }, [dirtyFields, formData.personalInfo]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await updateFormSection("personalInfo", data);
      navigate("/education");
    } catch (error) {
      console.error("Failed to save personal info:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = useMemo(() => {
    return ({
      id,
      label,
      type = "text",
      placeholder,
      icon,
      required = true,
    }) => (
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2" htmlFor={id}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            {icon}
          </div>
          <input
            id={id}
            type={type}
            className={`form-input w-full py-2 pl-10 pr-3 rounded-lg border ${
              errors[id]
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            } focus:border-transparent focus:ring-2 transition duration-200`}
            placeholder={placeholder}
            {...register(id)}
          />
          {errors[id] ? (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-red-500">
              <AlertCircle size={16} />
            </div>
          ) : getValues(id) ? (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-500">
              <CheckCircle size={16} />
            </div>
          ) : null}
        </div>
        {errors[id] && (
          <p className="mt-1 text-sm text-red-500">{errors[id].message}</p>
        )}
      </div>
    );
  }, [errors, register, getValues]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Personal Information
        </h2>
        <p className="text-gray-600">Please provide your contact details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Contact Information
          </h3>

          <InputField
            id="name"
            label="Full Name"
            placeholder="Enter your full name"
            icon={<User size={16} />}
          />

          <InputField
            id="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            icon={<Mail size={16} />}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Mailing Address
          </h3>

          <InputField
            id="addressLine1"
            label="Address Line 1"
            placeholder="Enter your street address"
            icon={<Home size={16} />}
          />

          <InputField
            id="addressLine2"
            label="Address Line 2"
            placeholder="Apartment, suite, unit, building, floor, etc."
            required={false}
            icon={<Home size={16} />}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              id="city"
              label="City"
              placeholder="Enter your city"
              icon={<span className="font-medium">🏙️</span>}
            />

            <InputField
              id="state"
              label="State"
              placeholder="Enter your state"
              icon={<span className="font-medium">🏛️</span>}
            />

            <InputField
              id="zipcode"
              label="Zipcode"
              placeholder="Enter your zipcode"
              icon={<span className="font-medium">📮</span>}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full sm:w-auto py-2 px-6 rounded-lg flex justify-center items-center gap-2 transition duration-200 ${
              isValid && !isSubmitting
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-300 text-white cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <span className="hidden sm:inline">Next: Education</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
