const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const prisma = new PrismaClient();

const createForm = async (req, res) => {
  try {
    const { personalInfo, education, projects } = req.body;
    const newForm = await prisma.form.create({
      data: {
        personalInfo,
        education,
        projects,
      },
    });
    res.status(201).json(newForm);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to create form", message: error.message });
  }
};

const getDataById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID parameter is required" });
    }

    // Optional: Validate MongoDB ObjectId format (24 hex chars)
    if (!/^[a-f\d]{24}$/i.test(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const form = await prisma.form.findUnique({
      where: { id },
    });

    if (!form) {
      return res
        .status(404)
        .json({ error: "Form not found with the provided ID" });
    }

    res.json(form);
  } catch (error) {
    console.error("Error retrieving form:", error);

    res.status(500).json({
      error: "Failed to retrieve form",
      message: error.message,
    });
  }
};

const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { section, data } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID parameter is required" });
    }

    if (!section) {
      return res.status(400).json({ error: "Section is required" });
    }

    if (data === undefined || data === null) {
      return res.status(400).json({ error: "Data for update is required" });
    }

    // Validate ID format
    if (!/^[a-f\d]{24}$/i.test(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Validate data based on section
    let validationErrors = [];

    switch (section) {
      case "personalInfo":
        validationErrors = validatePersonalInfo(data);
        break;
      case "education":
        validationErrors = validateEducation(data);
        break;
      case "projects":
        validationErrors = validateProjects(data);
        break;
      default:
        return res.status(400).json({ error: "Invalid section" });
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Update form section
    const updatedForm = await prisma.form.update({
      where: { id },
      data: {
        [section]: data,
      },
    });

    res.json(updatedForm);
  } catch (error) {
    console.error("Error updating form:", error);

    if (error.code === "P2023") {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    if (error.code === "P2025") {
      // Prisma error: record not found
      return res
        .status(404)
        .json({ error: "Form not found with the provided ID" });
    }

    res.status(500).json({ error: "Failed to update form" });
  }
};

// Validation functions
function validatePersonalInfo(data) {
  const errors = [];

  if (!data.name || data.name.trim() === "") {
    errors.push({ field: "name", message: "Name is required" });
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: "email", message: "Valid email is required" });
  }

  if (!data.addressLine1 || data.addressLine1.trim() === "") {
    errors.push({
      field: "addressLine1",
      message: "Address Line 1 is required",
    });
  }

  if (!data.city || data.city.trim() === "") {
    errors.push({ field: "city", message: "City is required" });
  }

  if (!data.state || data.state.trim() === "") {
    errors.push({ field: "state", message: "State is required" });
  }

  if (!data.zipcode || !/^\d{6}$/.test(data.zipcode)) {
    errors.push({
      field: "zipcode",
      message: "Valid zipcode is required (123456)",
    });
  }

  return errors;
}

function validateEducation(data) {
  const errors = [];

  if (typeof data.isStudying !== "boolean") {
    errors.push({
      field: "isStudying",
      message: "isStudying must be a boolean",
    });
  }

  if (data.isStudying && (!data.studyingAt || data.studyingAt.trim() === "")) {
    errors.push({
      field: "studyingAt",
      message: "Please specify where you are studying",
    });
  }

  return errors;
}

function validateProjects(data) {
  const errors = [];

  if (!Array.isArray(data) || data.length === 0) {
    errors.push({
      field: "projects",
      message: "At least one project is required",
    });
    return errors;
  }

  data.forEach((project, index) => {
    if (!project.projectName || project.projectName.trim() === "") {
      errors.push({
        field: `projects[${index}].projectName`,
        message: "Project name is required",
      });
    }

    if (
      !project.projectDescription ||
      project.projectDescription.trim() === ""
    ) {
      errors.push({
        field: `projects[${index}].projectDescription`,
        message: "Project description is required",
      });
    }
  });

  return errors;
}

module.exports = {
  createForm,
  getDataById,
  updateData,
};
