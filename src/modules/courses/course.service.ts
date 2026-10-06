import { prisma } from "../../config/prisma.js"
import { AppError } from "../../utils/AppError.js"
import { getOrSetCache, invalidateCacheByPrefix } from "../../utils/cache.js"
import type { CourseListQuery } from "./course.validation.js"

const getAllCourses = async (query: CourseListQuery) => {
  const cacheKey = `courses:list:${JSON.stringify(query)}`
  return getOrSetCache(cacheKey, 60, async () => {
    const where = {
      deletedAt: null,
      ...(query.departmentId && { departmentId: query.departmentId }),
      ...(query.q && {
        OR: [
          { title: { contains: query.q, mode: "insensitive" as const } },
          { code: { contains: query.q, mode: "insensitive" as const } },
        ],
      }),
    }

    const [items, total] = await Promise.all([
      prisma.course.findMany({
        where,
        orderBy: { [query.sortBy]: "asc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.course.count({ where }),
    ])

    return { items, meta: { page: query.page, limit: query.limit, total } }
  })
}

const getCourseById = async (id: string) => {
  const course = await prisma.course.findFirst({
    where: { id, deletedAt: null },
    include: { prerequisites: { include: { prerequisite: true } } },
  })
  if (!course) throw new AppError(404, "Course not found")
  return course
}

const createCourse = async (data: {
  code: string
  title: string
  description?: string
  credits: number
  departmentId: string
}) => {
  const course = await prisma.course.create({ data })
  await invalidateCacheByPrefix("courses:list:")
  return course
}

const updateCourse = async (
  id: string,
  data: Partial<{ title: string; description: string; credits: number; departmentId: string }>
) => {
  const course = await prisma.course.findFirst({ where: { id, deletedAt: null } })
  if (!course) throw new AppError(404, "Course not found")
  const updated = await prisma.course.update({ where: { id }, data })
  await invalidateCacheByPrefix("courses:list:")
  return updated
}

const softDeleteCourse = async (id: string) => {
  const course = await prisma.course.findFirst({ where: { id, deletedAt: null } })
  if (!course) throw new AppError(404, "Course not found")
  await prisma.course.update({ where: { id }, data: { deletedAt: new Date() } })
  await invalidateCacheByPrefix("courses:list:")
}

const wouldCreateCycle = async (courseId: string, prerequisiteId: string): Promise<boolean> => {
  if (courseId === prerequisiteId) return true
  const chain = await prisma.coursePrerequisite.findMany({ where: { courseId: prerequisiteId } })
  for (const link of chain) {
    if (link.prerequisiteId === courseId) return true
    if (await wouldCreateCycle(courseId, link.prerequisiteId)) return true
  }
  return false
}

const addPrerequisite = async (courseId: string, prerequisiteId: string) => {
  const [course, prereq] = await Promise.all([
    prisma.course.findFirst({ where: { id: courseId, deletedAt: null } }),
    prisma.course.findFirst({ where: { id: prerequisiteId, deletedAt: null } }),
  ])
  if (!course || !prereq) throw new AppError(404, "Course not found")
  if (await wouldCreateCycle(courseId, prerequisiteId)) {
    throw new AppError(409, "This would create a circular prerequisite chain")
  }
  return prisma.coursePrerequisite.create({ data: { courseId, prerequisiteId } })
}

const removePrerequisite = async (courseId: string, prerequisiteId: string) => {
  await prisma.coursePrerequisite.delete({
    where: { courseId_prerequisiteId: { courseId, prerequisiteId } },
  })
}

export const courseServices = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  softDeleteCourse,
  addPrerequisite,
  removePrerequisite,
}
