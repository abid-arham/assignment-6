import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
const getAllSections = async (query) => {
    return prisma.section.findMany({
        where: {
            deletedAt: null,
            ...(query.semesterId && { semesterId: query.semesterId }),
            ...(query.courseId && { courseId: query.courseId }),
            ...(query.instructorId && { instructorId: query.instructorId }),
        },
        include: { course: true, semester: true, instructor: { select: { id: true, name: true } } },
    });
};
const getSectionById = async (id) => {
    const section = await prisma.section.findFirst({
        where: { id, deletedAt: null },
        include: { course: true, semester: true, instructor: { select: { id: true, name: true } } },
    });
    if (!section)
        throw new AppError(404, "Section not found");
    return section;
};
const createSection = async (data) => {
    const instructor = await prisma.user.findFirst({ where: { id: data.instructorId, role: "INSTRUCTOR", deletedAt: null } });
    if (!instructor)
        throw new AppError(422, "instructorId must belong to an active instructor");
    return prisma.section.create({ data });
};
const updateSection = async (id, data) => {
    const section = await prisma.section.findFirst({ where: { id, deletedAt: null } });
    if (!section)
        throw new AppError(404, "Section not found");
    if (data.capacity !== undefined && data.capacity < section.enrolledCount) {
        throw new AppError(422, `capacity cannot drop below current enrollment (${section.enrolledCount})`);
    }
    if (data.instructorId) {
        const instructor = await prisma.user.findFirst({ where: { id: data.instructorId, role: "INSTRUCTOR", deletedAt: null } });
        if (!instructor)
            throw new AppError(422, "instructorId must belong to an active instructor");
    }
    return prisma.section.update({ where: { id }, data });
};
const getSectionsForInstructor = async (instructorId) => {
    return prisma.section.findMany({
        where: { instructorId, deletedAt: null },
        include: { course: true, semester: true },
    });
};
export const sectionServices = { getAllSections, getSectionById, createSection, updateSection, getSectionsForInstructor };
//# sourceMappingURL=section.service.js.map