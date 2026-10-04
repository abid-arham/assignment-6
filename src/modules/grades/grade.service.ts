
import { prisma } from "../../config/prisma.js"
import { AppError } from "../../utils/AppError.js"
import { GRADE_POINTS } from "./gradePoints.js"

const submitGrade = async (enrollmentId: string, instructorId: string, grade: string) => {
  const enrollment = await prisma.enrollment.findFirst({
    where: { id: enrollmentId, status: "ENROLLED" },
    include: { section: true },
  })
  if (!enrollment) throw new AppError(404, "Active enrollment not found")
  if (enrollment.section.instructorId !== instructorId) {
    throw new AppError(403, "You do not teach this section")
  }

  return prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { grade, gradePoint: GRADE_POINTS[grade]!, status: "COMPLETED" },
  })
}

// Retake policy: replacement, not averaging. Every completed attempt is
// listed (isCounted flags which one), but only the highest-gradePoint
// attempt per course contributes to GPA and totalCredits.
const getTranscript = async (studentId: string) => {
  const completed = await prisma.enrollment.findMany({
    where: { studentId, status: "COMPLETED" },
    include: { section: { include: { course: true } } },
    orderBy: { enrolledAt: "asc" },
  })

  const bestIdByCourse = new Map<string, string>()
  for (const e of completed) {
    const courseId = e.section.courseId
    const bestId = bestIdByCourse.get(courseId)
    const best = bestId ? completed.find((x) => x.id === bestId) : undefined
    if (!best || Number(e.gradePoint ?? 0) > Number(best.gradePoint ?? 0)) {
      bestIdByCourse.set(courseId, e.id)
    }
  }
  const bestIds = new Set(bestIdByCourse.values())

  let totalCredits = 0
  let totalPoints = 0
  for (const e of completed) {
    if (!bestIds.has(e.id)) continue
    const credits = e.section.course.credits
    totalCredits += credits
    totalPoints += credits * Number(e.gradePoint ?? 0)
  }

  return {
    gpa: totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0,
    totalCredits,
    courses: completed.map((e) => ({
      courseCode: e.section.course.code,
      title: e.section.course.title,
      credits: e.section.course.credits,
      grade: e.grade,
      enrolledAt: e.enrolledAt,
      isCounted: bestIds.has(e.id),
    })),
  }
}

export const gradeServices = { submitGrade, getTranscript }
