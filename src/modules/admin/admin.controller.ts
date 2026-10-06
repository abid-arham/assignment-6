import type { Request, Response } from "express"
import httpStatus from "http-status"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { sendSuccess } from "../../utils/sendResponse.js"
import { adminServices } from "./admin.service.js"
import type { AuditLogListQuery, UserListQuery } from "./admin.validation.js"

const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const { items, meta } = await adminServices.listUsers(req.query as unknown as UserListQuery)
  sendSuccess(res, httpStatus.OK, "Users retrieved successfully", items, meta)
})

const changeRole = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminServices.changeRole(req.user!.id, req.params.id as string, req.body.role)
  sendSuccess(res, httpStatus.OK, "User role updated successfully", result)
})

const changeStatus = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminServices.changeStatus(req.user!.id, req.params.id as string, req.body.isActive)
  sendSuccess(res, httpStatus.OK, "User status updated successfully", result)
})

const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const result = await adminServices.getStats()
  sendSuccess(res, httpStatus.OK, "Dashboard stats retrieved successfully", result)
})

const listAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const { items, meta } = await adminServices.listAuditLogs(req.query as unknown as AuditLogListQuery)
  sendSuccess(res, httpStatus.OK, "Audit logs retrieved successfully", items, meta)
})

export const adminController = { listUsers, changeRole, changeStatus, getStats, listAuditLogs }
