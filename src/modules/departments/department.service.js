import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
const getAllDepartments = async () => {
    return prisma.department.findMany({
        where: { deletedAt: null },
        orderBy: { name: "asc" },
    });
};
const createDepartment = async (data) => {
    return prisma.department.create({ data });
};
const updateDepartment = async (id, data) => {
    const dept = await prisma.department.findFirst({ where: { id, deletedAt: null } });
    if (!dept)
        throw new AppError(404, "Department not found");
    return prisma.department.update({ where: { id }, data });
};
const softDeleteDepartment = async (id) => {
    const dept = await prisma.department.findFirst({ where: { id, deletedAt: null } });
    if (!dept)
        throw new AppError(404, "Department not found");
    return prisma.department.update({ where: { id }, data: { deletedAt: new Date() } });
};
export const departmentServices = { getAllDepartments, createDepartment, updateDepartment, softDeleteDepartment };
//# sourceMappingURL=department.service.js.map