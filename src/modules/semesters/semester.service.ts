import { prisma } from "../../config/prisma.js"
import { AppError } from "../../utils/AppError.js"

const getAllSemesters = async () => {
  return prisma.semester.findMany({ orderBy: { startDate: "desc" } })
}

const createSemester = async (data: {
  name: string
  startDate: Date
  endDate: Date
  tuitionPerCredit: number
}) => {
  if (data.endDate <= data.startDate) {
    throw new AppError(422, "endDate must be after startDate")
  }
  return prisma.semester.create({ data })
}

const updateSemester = async (
  id: string,
  data: Partial<{ name: string; startDate: Date; endDate: Date; enrollmentOpen: boolean; tuitionPerCredit: number }>
) => {
  const semester = await prisma.semester.findUnique({ where: { id } })
  if (!semester) throw new AppError(404, "Semester not found")

  const start = data.startDate ?? semester.startDate
  const end = data.endDate ?? semester.endDate
  if (end <= start) throw new AppError(422, "endDate must be after startDate")

  return prisma.semester.update({ where: { id }, data })
}

export const semesterServices = { getAllSemesters, createSemester, updateSemester }
