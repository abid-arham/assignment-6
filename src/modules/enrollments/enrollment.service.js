import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
const enroll = async (studentId, sectionId) => {
    return prisma.$transaction(async (tx) => {
        const section = await tx.section.findFirst({
            where: { id: sectionId, deletedAt: null },
            include: { course: { include: { prerequisites: true } } },
        });
        if (!section)
            throw new AppError(404, "Section not found");
        const existing = await tx.enrollment.findUnique({
            where: { studentId_sectionId: { studentId, sectionId } },
        });
        if (existing) {
            if (existing.status === "ENROLLED")
                throw new AppError(409, "Already enrolled in this section");
            if (existing.status === "COMPLETED")
                throw new AppError(409, "Course already completed");
            // DROPPED → reactivate the same row instead of inserting a second one
        }
        for (const prereq of section.course.prerequisites) {
            const passed = await tx.enrollment.findFirst({
                where: {
                    studentId,
                    status: "COMPLETED",
                    section: { courseId: prereq.prerequisiteId },
                    gradePoint: { gt: 0 },
                },
            });
            if (!passed)
                throw new AppError(422, `Missing prerequisite: ${prereq.prerequisiteId}`);
        }
        // Atomic capacity check — Prisma can't compare two columns in `where`,
        // so a raw conditional UPDATE is what makes this safe under concurrency.
        const updated = await tx.$executeRaw `
      UPDATE "Section" SET "enrolledCount" = "enrolledCount" + 1
      WHERE id = ${sectionId} AND "enrolledCount" < capacity`;
        if (updated === 0)
            throw new AppError(409, "Section is full");
        if (existing) {
            return tx.enrollment.update({
                where: { id: existing.id },
                data: { status: "ENROLLED", droppedAt: null, enrolledAt: new Date() },
            });
        }
        try {
            return await tx.enrollment.create({ data: { studentId, sectionId } });
        }
        catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                throw new AppError(409, "Already enrolled in this section");
            }
            throw e;
        }
    });
};
const drop = async (studentId, enrollmentId) => {
    return prisma.$transaction(async (tx) => {
        const enrollment = await tx.enrollment.findFirst({
            where: { id: enrollmentId, studentId, status: "ENROLLED" },
        });
        if (!enrollment)
            throw new AppError(404, "Active enrollment not found");
        await tx.$executeRaw `
      UPDATE "Section" SET "enrolledCount" = "enrolledCount" - 1
      WHERE id = ${enrollment.sectionId} AND "enrolledCount" > 0`;
        return tx.enrollment.update({
            where: { id: enrollmentId },
            data: { status: "DROPPED", droppedAt: new Date() },
        });
    });
};
const getMyEnrollments = async (studentId) => {
    return prisma.enrollment.findMany({
        where: { studentId },
        include: { section: { include: { course: true, semester: true } } },
        orderBy: { enrolledAt: "desc" },
    });
};
const getStudentsForSection = async (sectionId, instructorId) => {
    const section = await prisma.section.findFirst({ where: { id: sectionId, instructorId, deletedAt: null } });
    if (!section)
        throw new AppError(403, "You do not teach this section");
    return prisma.enrollment.findMany({
        where: { sectionId, status: { in: ["ENROLLED", "COMPLETED"] } },
        include: { student: { select: { id: true, name: true, email: true, studentCode: true } } },
    });
};
export const enrollmentServices = { enroll, drop, getMyEnrollments, getStudentsForSection };
//# sourceMappingURL=enrollment.service.js.map