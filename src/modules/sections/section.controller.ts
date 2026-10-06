import type { Request, Response } from "express"
import httpStatus from "http-status"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { sendSuccess } from "../../utils/sendResponse.js"
import { sectionServices } from "./section.service.js"
import type { SectionListQuery } from "./section.validation.js"

const getAllSections = asyncHandler(async (req: Request, res: Response) => {
  const result = await sectionServices.getAllSections(req.query as unknown as SectionListQuery)
  sendSuccess(res, httpStatus.OK, "Sections retrieved successfully", result)
})

const getSectionById = asyncHandler(async (req: Request, res: Response) => {
  const result = await sectionServices.getSectionById(req.params.id as string)
  sendSuccess(res, httpStatus.OK, "Section retrieved successfully", result)
})

const createSection = asyncHandler(async (req: Request, res: Response) => {
  const result = await sectionServices.createSection(req.body)
  sendSuccess(res, httpStatus.CREATED, "Section created successfully", result)
})

const updateSection = asyncHandler(async (req: Request, res: Response) => {
  const result = await sectionServices.updateSection(req.params.id as string, req.body)
  sendSuccess(res, httpStatus.OK, "Section updated successfully", result)
})

const getMySections = asyncHandler(async (req: Request, res: Response) => {
  const result = await sectionServices.getSectionsForInstructor(req.user!.id)
  sendSuccess(res, httpStatus.OK, "Your sections retrieved successfully", result)
})

export const sectionController = { getAllSections, getSectionById, createSection, updateSection, getMySections }
