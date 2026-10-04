import { Request, Response } from "express";
import httpStatus from "http-status";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/sendResponse.js";
import { sectionServices } from "./section.service.js";
const getAllSections = asyncHandler(async (req, res) => {
    const result = await sectionServices.getAllSections(req.query);
    sendSuccess(res, httpStatus.OK, "Sections retrieved successfully", result);
});
const getSectionById = asyncHandler(async (req, res) => {
    const result = await sectionServices.getSectionById(req.params.id);
    sendSuccess(res, httpStatus.OK, "Section retrieved successfully", result);
});
const createSection = asyncHandler(async (req, res) => {
    const result = await sectionServices.createSection(req.body);
    sendSuccess(res, httpStatus.CREATED, "Section created successfully", result);
});
const updateSection = asyncHandler(async (req, res) => {
    const result = await sectionServices.updateSection(req.params.id, req.body);
    sendSuccess(res, httpStatus.OK, "Section updated successfully", result);
});
const getMySections = asyncHandler(async (req, res) => {
    const result = await sectionServices.getSectionsForInstructor(req.user.id);
    sendSuccess(res, httpStatus.OK, "Your sections retrieved successfully", result);
});
export const sectionController = { getAllSections, getSectionById, createSection, updateSection, getMySections };
//# sourceMappingURL=section.controller.js.map