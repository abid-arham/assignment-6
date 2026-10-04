import httpStatus from "http-status"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { sendSuccess } from "../../utils/sendResponse.js"
import { departmentServices } from "./department.service.js"
import type { Request, Response } from "express"

const getAllDepartments = asyncHandler(async (req: Request, res: Response) => {
  const result = await departmentServices.getAllDepartments()
  sendSuccess(res, httpStatus.OK, "Departments retrieved successfully", result)
})

const createDepartment = asyncHandler(async (req: Request, res: Response) => {
  const result = await departmentServices.createDepartment(req.body)
  sendSuccess(res, httpStatus.CREATED, "Department created successfully", result)
})

const updateDepartment = asyncHandler(async (req: Request, res: Response) => {
  const result = await departmentServices.updateDepartment(req.params.id as string, req.body)
  sendSuccess(res, httpStatus.OK, "Department updated successfully", result)
})

const deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
  await departmentServices.softDeleteDepartment(req.params.id as string)
  sendSuccess(res, httpStatus.OK, "Department deleted successfully", null)
})

export const departmentController = { getAllDepartments, createDepartment, updateDepartment, deleteDepartment }
