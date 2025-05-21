import { Outlet, useLocation } from "react-router-dom";
import { useFormData } from "../context/FormDataContext";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  BookOpen,
  Code,
  User,
  ArrowLeft,
  ArrowRight,
  Loader,
} from "lucide-react";

const FormLayout = () => {
  const { loading, error } = useFormData();
  const location = useLocation();
  const [animateProgress, setAnimateProgress] = useState(false);

  // Define steps with their data
  const steps = [
    { path: "/personal-info", label: "Personal Info", icon: User },
    { path: "/education", label: "Education", icon: BookOpen },
    { path: "/projects", label: "Projects", icon: Code },
    { path: "/completion", label: "Complete", icon: CheckCircle },
  ];

  // Calculate current step based on the route
  const getCurrentStep = () => {
    const index = steps.findIndex((step) => step.path === location.pathname);
    return index >= 0 ? index + 1 : 1;
  };

  const currentStep = getCurrentStep();
  const totalSteps = steps.length - 1; // Excluding completion step

  // Animate progress bar on step change
  useEffect(() => {
    setAnimateProgress(false);
    const timer = setTimeout(() => setAnimateProgress(true), 100);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const progressPercentage = Math.max(
    0,
    ((currentStep - 1) / (totalSteps - 1)) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 transition-all duration-300">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {currentStep <= totalSteps
            ? `Application Form - ${steps[currentStep - 1].label}`
            : "Application Complete"}
        </h1>

        {/* Progress Indicator */}
        {currentStep <= totalSteps && (
          <div className="mb-10">
            {/* Steps Indicators */}
            <div className="flex justify-between items-center mb-2">
              {steps.slice(0, totalSteps).map((step, index) => {
                const stepNum = index + 1;
                const StepIcon = step.icon;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;

                return (
                  <div
                    key={stepNum}
                    className="flex flex-col items-center relative"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all duration-300
                        ${
                          isActive
                            ? "bg-blue-600 text-white scale-110"
                            : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      <StepIcon size={20} />
                    </div>
                    <div
                      className={`text-sm font-medium mt-2 transition-all duration-300
                      ${
                        isActive
                          ? "text-blue-700"
                          : isCompleted
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="relative mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all ${
                  animateProgress ? "duration-700" : "duration-0"
                }`}
                style={{ width: `${progressPercentage}%` }}
                aria-label={`${Math.round(progressPercentage)}% complete`}
              ></div>
            </div>

            {/* Step Indicator Text */}
            <div className="mt-2 text-sm text-gray-500 text-center">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start">
            <div className="mr-3 flex-shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Loader size={20} className="text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="mt-4 text-blue-700 font-medium">Processing...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg transition-all duration-300">
            <Outlet />
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="max-w-3xl mx-auto mt-4 text-center text-sm text-gray-500">
        Need help? Contact support at support@example.com
      </div>
    </div>
  );
};

export default FormLayout;
