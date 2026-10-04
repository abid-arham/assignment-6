import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
const generateInvoice = async (studentId, semesterId) => {
    const semester = await prisma.semester.findUnique({ where: { id: semesterId } });
    if (!semester)
        throw new AppError(404, "Semester not found");
    const enrollments = await prisma.enrollment.findMany({
        where: { studentId, status: "ENROLLED", section: { semesterId } },
        include: { section: { include: { course: true } } },
    });
    if (enrollments.length === 0) {
        throw new AppError(422, "No active enrollments for this semester");
    }
    const totalCredits = enrollments.reduce((sum, e) => sum + e.section.course.credits, 0);
    const amount = totalCredits * Number(semester.tuitionPerCredit);
    // upsert: regenerating after an add/drop recalculates instead of duplicating
    return prisma.invoice.upsert({
        where: { studentId_semesterId: { studentId, semesterId } },
        update: { totalCredits, amount },
        create: { studentId, semesterId, totalCredits, amount },
    });
};
const getMyInvoices = async (studentId) => {
    return prisma.invoice.findMany({
        where: { studentId },
        include: { semester: true },
        orderBy: { createdAt: "desc" },
    });
};
export const invoiceServices = { generateInvoice, getMyInvoices };
//# sourceMappingURL=invoice.service.js.map