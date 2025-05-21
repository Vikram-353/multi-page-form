// // src/schemas/validationSchemas.js
// import { z } from "zod";

// // Personal Info Validation Schema
// export const personalInfoSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   email: z.string().email("Invalid email address"),
//   addressLine1: z.string().min(1, "Address Line 1 is required"),
//   addressLine2: z.string().optional(),
//   city: z.string().min(1, "City is required"),
//   state: z.string().min(1, "State is required"),
//   zipcode: z
//     .string()
//     .min(5, "Zipcode must be at least 5 characters")
//     .max(10, "Zipcode must not exceed 10 characters")
//     .regex(/^\d{5}(-\d{4})?$/, "Zipcode must be in format 12345 or 12345-6789"),
// });

// // Education Validation Schema
// export const educationSchema = z.object({
//   isStudying: z.boolean(),
//   studyingAt: z
//     .string()
//     .optional()
//     .refine(
//       (val, ctx) => {
//         // studyingAt is required only when isStudying is true
//         if (ctx.parent.isStudying && (!val || val.trim() === "")) {
//           return false;
//         }
//         return true;
//       },
//       {
//         message: "Please specify where you are studying",
//       }
//     ),
// });

// // Project Validation Schema
// export const projectSchema = z.object({
//   projectName: z.string().min(1, "Project name is required"),
//   projectDescription: z.string().min(1, "Project description is required"),
// });

// // Projects Array Validation Schema
// export const projectsArraySchema = z
//   .array(projectSchema)
//   .min(1, "At least one project is required");

// import { z } from "zod";

// // Personal Info Validation Schema
// export const personalInfoSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   email: z.string().email("Invalid email address"),
//   addressLine1: z.string().min(1, "Address Line 1 is required"),
//   addressLine2: z.string().optional(),
//   city: z.string().min(1, "City is required"),
//   state: z.string().min(1, "State is required"),
//   zipcode: z
//     .string()
//     .min(5, "Zipcode must be at least 5 characters")
//     .max(10, "Zipcode must not exceed 10 characters")
//     .regex(/^\d{5}(-\d{4})?$/, "Zipcode must be in format 12345 or 12345-6789"),
// });

// // Education Validation Schema (fixed)
// export const educationSchema = z
//   .object({
//     isStudying: z.boolean(),
//     studyingAt: z.string().optional(),
//   })
//   .superRefine((data, ctx) => {
//     if (
//       data.isStudying &&
//       (!data.studyingAt || data.studyingAt.trim() === "")
//     ) {
//       ctx.addIssue({
//         path: ["studyingAt"],
//         code: z.ZodIssueCode.custom,
//         message: "Please specify where you are studying",
//       });
//     }
//   });

// // Project Validation Schema
// export const projectSchema = z.object({
//   projectName: z.string().min(1, "Project name is required"),
//   projectDescription: z.string().min(1, "Project description is required"),
// });

// // Projects Array Validation Schema
// export const projectsArraySchema = z
//   .array(projectSchema)
//   .min(1, "At least one project is required");
import { z } from "zod";

// Personal Info Validation Schema
export const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipcode: z
    .string()
    .length(6, "Zipcode must be exactly 6 digits")
    .regex(/^\d{6}$/, "Zipcode must contain only digits"),
});

// Education Validation Schema
export const educationSchema = z
  .object({
    isStudying: z.boolean(),
    studyingAt: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.isStudying &&
      (!data.studyingAt || data.studyingAt.trim() === "")
    ) {
      ctx.addIssue({
        path: ["studyingAt"],
        code: z.ZodIssueCode.custom,
        message: "Please specify where you are studying",
      });
    }
  });

// Single Project Validation Schema
export const projectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  projectDescription: z.string().min(1, "Project description is required"),
});

// Projects Array Validation Schema
export const projectsArraySchema = z.object({
  projects: z.array(projectSchema).min(1, "At least one project is required"),
});
