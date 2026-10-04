import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
const getAllSemesters = async () => {
    return prisma.semester.findMany({ orderBy: { startDate: "desc" } });
};
const createSemester = async (data) => {
    if (data.endDate <= data.startDate) {
        throw new AppError(422, "endDate must be after startDate");
    }
    return prisma.semester.create({ data });
};
const updateSemester = async (id, data) => {
    const semester = await prisma.semester.findUnique({ where: { id } });
    if (!semester)
        throw new AppError(404, "Semester not found");
    const start = data.startDate ?? semester.startDate;
    const end = data.endDate ?? semester.endDate;
    if (end <= start)
        throw new AppError(422, "endDate must be after startDate");
    return prisma.semester.update({ where: { id }, data });
};
export const semesterServices = { getAllSemesters, createSemester, updateSemester };
//# sourceMappingURL=semester.service.js.map