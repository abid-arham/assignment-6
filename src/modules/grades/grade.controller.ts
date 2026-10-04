import httpStatus from "http-status"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { sendSuccess } from "../../utils/sendResponse.js"
import { gradeServices } from "./grade.service.js"
import type { Request, Response } from "express"

const submitGrade = asyncHandler(async (req: Request, res: Response) => {
  const result = await gradeServices.submitGrade(req.params.id as string, req.user!.id, req.body.grade)
  sendSuccess(res, httpStatus.OK, "Grade submitted successfully", result)
})

const getTranscript = asyncHandler(async (req: Request, res: Response) => {
  const result = await gradeServices.getTranscript(req.user!.id)
  sendSuccess(res, httpStatus.OK, "Transcript retrieved successfully", result)
})

export const gradeController = { submitGrade, getTranscript }
