import { prisma } from "../../config/prisma.js"
import { AppError } from "../../utils/AppError.js"

const getAllDepartments = async () => {
  return prisma.department.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
  })
}

const createDepartment = async (data: { name: string; code: string }) => {
  return prisma.department.create({ data })
}

const updateDepartment = async (id: string, data: { name?: string; code?: string }) => {
  const dept = await prisma.department.findFirst({ where: { id, deletedAt: null } })
  if (!dept) throw new AppError(404, "Department not found")
  return prisma.department.update({ where: { id }, data })
}

const softDeleteDepartment = async (id: string) => {
  const dept = await prisma.department.findFirst({ where: { id, deletedAt: null } })
  if (!dept) throw new AppError(404, "Department not found")
  return prisma.department.update({ where: { id }, data: { deletedAt: new Date() } })
}

export const departmentServices = { getAllDepartments, createDepartment, updateDepartment, softDeleteDepartment }
