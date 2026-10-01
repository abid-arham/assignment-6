import httpStatus from "http-status"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { sendSuccess } from "../../utils/sendResponse.js"
import { semesterServices } from "./semester.service.js"
import type { Request, Response } from "express"

const getAllSemesters = asyncHandler(async (req: Request, res: Response) => {
  const result = await semesterServices.getAllSemesters()
  sendSuccess(res, httpStatus.OK, "Semesters retrieved successfully", result)
})

const createSemester = asyncHandler(async (req: Request, res: Response) => {
  const result = await semesterServices.createSemester(req.body)
  sendSuccess(res, httpStatus.CREATED, "Semester created successfully", result)
})

const updateSemester = asyncHandler(async (req: Request, res: Response) => {
  const result = await semesterServices.updateSemester(req.params.id as string, req.body)
  sendSuccess(res, httpStatus.OK, "Semester updated successfully", result)
})

export const semesterController = { getAllSemesters, createSemester, updateSemester }
