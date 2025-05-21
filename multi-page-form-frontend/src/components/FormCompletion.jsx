import { useNavigate } from "react-router-dom";
import { useFormData } from "../context/FormDataContext";
import { useState, useRef } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

import {
  User,
  BookOpen,
  Code,
  Check,
  ChevronRight,
  Calendar,
  Mail,
  MapPin,
  Edit,
  Download,
  Printer,
  Share2,
  CheckCircle,
  Phone,
  Loader,
} from "lucide-react";

const FormCompletion = () => {
  const { formData, setFormData } = useFormData();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const summaryRef = useRef(null);

  const handleEditPersonalInfo = () => {
    navigate("/personal-info");
  };

  const handleEditEducation = () => {
    navigate("/education");
  };

  const handleEditProjects = () => {
    navigate("/projects");
  };

  // Function to trigger print dialog
  const handlePrint = () => {
    window.print();
  };

  // Improved PDF download function
  const handleDownload = async () => {
    const element = summaryRef.current;

    if (!element) {
      console.error("Summary element not found");
      return;
    }

    try {
      setIsGeneratingPDF(true);

      // Create a temporary clone of the element to modify for PDF export
      const clone = element.cloneNode(true);
      clone.style.width = "800px"; // Set fixed width for better PDF rendering
      clone.style.padding = "20px";
      clone.style.position = "absolute";
      clone.style.top = "-9999px";
      clone.style.left = "-9999px";
      document.body.appendChild(clone);

      // Generate canvas from the cloned element
      const canvas = await html2canvas(clone, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Clean up the clone
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      pdf.save("application_summary.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  //clean form

  const handleDoneClick = () => {
    // Reset form data
    setFormData({
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

    // Navigate to personalInfo or home
    navigate("../personal-info");
  };

  // Share using Web Share API with fallback
  const handleShare = async () => {
    const shareData = {
      title: "Application Summary",
      text: `Application Ref: ${submissionId} submitted on ${submissionDate}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Sharing failed:", error);
        // Fall back to clipboard if share fails
        fallbackShare(shareData);
      }
    } else {
      fallbackShare(shareData);
    }
  };

  // Fallback share method using clipboard
  const fallbackShare = async (shareData) => {
    try {
      await navigator.clipboard.writeText(
        `${shareData.title}: ${shareData.text}\n${shareData.url}`
      );
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Clipboard write failed:", error);
      alert("Sharing is not supported in your browser.");
    }
  };

  // For adding application/submission ID
  const submissionId = `APL-${Math.floor(100000 + Math.random() * 900000)}`;
  const submissionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="pb-8 max-w-4xl mx-auto">
      {/* Completion Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200 mb-8 text-center print:bg-white print:border-none">
        <div className="inline-flex justify-center items-center mb-4 w-16 h-16 bg-green-100 rounded-full">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Application Successfully Submitted!
        </h2>
        <p className="text-gray-600 max-w-lg mx-auto">
          Thank you for completing your application. Your information has been
          recorded and is now being processed.
        </p>
        <div className="mt-4 px-4 py-2 bg-white rounded-md shadow-sm inline-block border border-gray-200">
          <p className="text-sm">
            Reference Number:{" "}
            <span className="font-mono font-bold">{submissionId}</span>
          </p>
        </div>
      </div>

      {/* Action Bar - Hide when printing */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2 print:hidden">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Application Summary
          </h3>
          <p className="text-sm text-gray-500">Submitted on {submissionDate}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm transition-colors"
          >
            <Printer size={16} className="mr-1" />
            Print
          </button>
          <button
            onClick={handleDownload}
            disabled={isGeneratingPDF}
            className="flex items-center px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded text-blue-700 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? (
              <>
                <Loader size={16} className="mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download size={16} className="mr-1" />
                Download PDF
              </>
            )}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm transition-colors"
          >
            <Share2 size={16} className="mr-1" />
            Share
          </button>
        </div>
      </div>

      {/* Tab Navigation - Hide when printing */}
      <div className="flex border-b border-gray-200 mb-6 print:hidden overflow-x-auto">
        <button
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "all"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Information
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "personal"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("personal")}
        >
          Personal
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "education"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("education")}
        >
          Education
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "projects"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("projects")}
        >
          Projects
        </button>
      </div>

      {/* Main content - Referenced for PDF generation */}
      <div className="space-y-6" id="application-summary" ref={summaryRef}>
        {/* Print header - Only visible when printing */}
        <div className="hidden print:block print:mb-6 print:border-b print:border-gray-300 print:pb-4">
          <h2 className="text-2xl font-bold">Application Summary</h2>
          <div className="flex justify-between items-center mt-2">
            <p>
              Reference:{" "}
              <span className="font-mono font-medium">{submissionId}</span>
            </p>
            <p>Submitted: {submissionDate}</p>
          </div>
        </div>

        {/* Personal Information Summary */}
        {(activeTab === "all" || activeTab === "personal") && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow print:shadow-none print:border-gray-300">
            <div className="flex items-center border-b border-gray-100 p-4">
              <User className="text-blue-600 mr-3" size={20} />
              <h3 className="text-lg font-semibold text-gray-800 flex-grow">
                Personal Information
              </h3>
              <button
                type="button"
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors print:hidden"
                onClick={handleEditPersonalInfo}
              >
                <Edit size={14} className="mr-1" />
                Edit
              </button>
            </div>
            <div className="p-4 grid md:grid-cols-2 gap-4">
              <div className="flex">
                <div className="w-8 text-gray-400 flex-shrink-0">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">
                    {formData.personalInfo.name || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="w-8 text-gray-400 flex-shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">
                    {formData.personalInfo.email || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="flex">
                  <div className="w-8 text-gray-400 flex-shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {formData.personalInfo.addressLine1 ? (
                        <>
                          {formData.personalInfo.addressLine1}
                          <br />
                          {formData.personalInfo.addressLine2 && (
                            <>
                              {formData.personalInfo.addressLine2}
                              <br />
                            </>
                          )}
                          {formData.personalInfo.city},{" "}
                          {formData.personalInfo.state}{" "}
                          {formData.personalInfo.zipcode}
                        </>
                      ) : (
                        "Address not provided"
                      )}
                    </p>
                  </div>
                </div>
              </div>
              {formData.personalInfo.phone && (
                <div className="flex">
                  <div className="w-8 text-gray-400 flex-shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{formData.personalInfo.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Education Summary */}
        {(activeTab === "all" || activeTab === "education") && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow print:shadow-none print:border-gray-300">
            <div className="flex items-center border-b border-gray-100 p-4">
              <BookOpen className="text-blue-600 mr-3" size={20} />
              <h3 className="text-lg font-semibold text-gray-800 flex-grow">
                Educational Background
              </h3>
              <button
                type="button"
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors print:hidden"
                onClick={handleEditEducation}
              >
                <Edit size={14} className="mr-1" />
                Edit
              </button>
            </div>
            <div className="p-4">
              {formData.education?.isStudying !== undefined ? (
                <>
                  <div className="flex items-start mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      {formData.education.isStudying ? (
                        <Calendar className="text-blue-600" size={18} />
                      ) : (
                        <Check className="text-blue-600" size={18} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        Status:{" "}
                        {formData.education.isStudying
                          ? "Currently Studying"
                          : "Not Currently Studying"}
                      </p>
                      {formData.education.isStudying &&
                        formData.education.studyingAt && (
                          <p className="text-gray-700">
                            Attending:{" "}
                            <span className="font-medium">
                              {formData.education.studyingAt}
                            </span>
                          </p>
                        )}
                    </div>
                  </div>

                  {formData.education.highestEducation && (
                    <div className="pl-8 mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        Highest Level of Education
                      </p>
                      <p className="font-medium mb-2">
                        {formData.education.highestEducation
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>

                      <div className="grid md:grid-cols-2 gap-4 mt-2">
                        {formData.education.fieldOfStudy && (
                          <div>
                            <p className="text-sm text-gray-500">
                              Field of Study
                            </p>
                            <p className="font-medium">
                              {formData.education.fieldOfStudy}
                            </p>
                          </div>
                        )}

                        {formData.education.graduationYear && (
                          <div>
                            <p className="text-sm text-gray-500">
                              {formData.education.isStudying
                                ? "Expected Graduation"
                                : "Graduation Year"}
                            </p>
                            <p className="font-medium">
                              {formData.education.graduationYear}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 italic">
                  Educational information not provided
                </p>
              )}
            </div>
          </div>
        )}

        {/* Projects Summary */}
        {(activeTab === "all" || activeTab === "projects") && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow print:shadow-none print:border-gray-300">
            <div className="flex items-center border-b border-gray-100 p-4">
              <Code className="text-blue-600 mr-3" size={20} />
              <h3 className="text-lg font-semibold text-gray-800 flex-grow">
                Projects
              </h3>
              <button
                type="button"
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors print:hidden"
                onClick={handleEditProjects}
              >
                <Edit size={14} className="mr-1" />
                Edit
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {formData.projects && formData.projects.length > 0 ? (
                formData.projects.map((project, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-50 print:hover:bg-white"
                  >
                    <div className="flex">
                      <div className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs font-bold text-gray-600">
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-800">
                          {project.projectName || "Untitled Project"}
                        </p>
                        <p className="text-gray-600 mt-1">
                          {project.projectDescription ||
                            "No description provided"}
                        </p>

                        {project.projectUrl && (
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-2 text-sm print:after:content-['_(' attr(href) ')'] print:after:text-gray-600"
                          >
                            View Project{" "}
                            <ChevronRight
                              size={14}
                              className="ml-1 print:hidden"
                            />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No projects added
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Final Message & Next Steps */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 print:bg-white print:border print:border-gray-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          What Happens Next?
        </h3>
        <div className="space-y-4">
          <div className="flex">
            <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm font-medium text-blue-800 print:border print:border-blue-300 print:bg-white">
              1
            </div>
            <div>
              <p className="text-gray-700">
                Our team will review your application within 5 business days.
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm font-medium text-blue-800 print:border print:border-blue-300 print:bg-white">
              2
            </div>
            <div>
              <p className="text-gray-700">
                You'll receive an email confirmation at{" "}
                <span className="font-medium">
                  {formData.personalInfo.email || "your email address"}
                </span>
                .
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm font-medium text-blue-800 print:border print:border-blue-300 print:bg-white">
              3
            </div>
            <div>
              <p className="text-gray-700">
                If selected, we'll contact you to schedule the next steps.
              </p>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="py-2 px-6  mt-5 rounded-lg flex items-center gap-2 transition duration-200 bg-blue-600 hover:bg-blue-700 text-white"
        onClick={handleDoneClick}
      >
        Done
      </button>

      {/* Print footer - Only visible when printing */}
      <div className="hidden print:block print:mt-8 print:pt-4 print:border-t print:border-gray-300 print:text-center print:text-sm print:text-gray-500">
        <p>
          Application Reference: {submissionId} • Generated on {submissionDate}
        </p>
      </div>
    </div>
  );
};

export default FormCompletion;
