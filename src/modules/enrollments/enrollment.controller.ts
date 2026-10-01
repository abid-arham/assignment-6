import httpStatus from "http-status"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { sendSuccess } from "../../utils/sendResponse.js"
import { enrollmentServices } from "./enrollment.service.js"
import type { Request, Response } from "express"

const enroll = asyncHandler(async (req: Request, res: Response) => {
  const result = await enrollmentServices.enroll(req.user!.id, req.body.sectionId)
  sendSuccess(res, httpStatus.CREATED, "Enrolled successfully", result)
})

const drop = asyncHandler(async (req: Request, res: Response) => {
  const result = await enrollmentServices.drop(req.user!.id, req.params.id as string)
  sendSuccess(res, httpStatus.OK, "Dropped successfully", result)
})

const getMyEnrollments = asyncHandler(async (req: Request, res: Response) => {
  const result = await enrollmentServices.getMyEnrollments(req.user!.id)
  sendSuccess(res, httpStatus.OK, "Enrollments retrieved successfully", result)
})

const getStudentsForSection = asyncHandler(async (req: Request, res: Response) => {
  const result = await enrollmentServices.getStudentsForSection(req.params.id as string, req.user!.id)
  sendSuccess(res, httpStatus.OK, "Students retrieved successfully", result)
})

export const enrollmentController = { enroll, drop, getMyEnrollments, getStudentsForSection }
