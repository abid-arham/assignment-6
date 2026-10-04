import { Request, Response } from "express"
import httpStatus from "http-status"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { sendSuccess } from "../../utils/sendResponse.js"
import { courseServices } from "./course.service.js"

const getAllCourses = asyncHandler(async (req: Request, res: Response) => {
  const { items, meta } = await courseServices.getAllCourses(req.query as any)
  sendSuccess(res, httpStatus.OK, "Courses retrieved successfully", items, meta)
})

const getCourseById = asyncHandler(async (req: Request, res: Response) => {
  const result = await courseServices.getCourseById(req.params.id as string)
  sendSuccess(res, httpStatus.OK, "Course retrieved successfully", result)
})

const createCourse = asyncHandler(async (req: Request, res: Response) => {
  const result = await courseServices.createCourse(req.body)
  sendSuccess(res, httpStatus.CREATED, "Course created successfully", result)
})

const updateCourse = asyncHandler(async (req: Request, res: Response) => {
  const result = await courseServices.updateCourse(req.params.id as string, req.body)
  sendSuccess(res, httpStatus.OK, "Course updated successfully", result)
})

const deleteCourse = asyncHandler(async (req: Request, res: Response) => {
  await courseServices.softDeleteCourse(req.params.id as string)
  sendSuccess(res, httpStatus.OK, "Course deleted successfully", null)
})

const addPrerequisite = asyncHandler(async (req: Request, res: Response) => {
  const result = await courseServices.addPrerequisite(req.params.id as string, req.body.prerequisiteId)
  sendSuccess(res, httpStatus.CREATED, "Prerequisite added successfully", result)
})

const removePrerequisite = asyncHandler(async (req: Request, res: Response) => {
  await courseServices.removePrerequisite(req.params.id as string, req.params.prereqId as string)
  sendSuccess(res, httpStatus.OK, "Prerequisite removed successfully", null)
})

export const courseController = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addPrerequisite,
  removePrerequisite,
}
