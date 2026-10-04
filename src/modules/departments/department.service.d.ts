declare const getAllDepartments: () => Promise<{
    id: string;
    name: string;
    code: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}[]>;
declare const createDepartment: (data: {
    name: string;
    code: string;
}) => Promise<{
    id: string;
    name: string;
    code: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
declare const updateDepartment: (id: string, data: {
    name?: string;
    code?: string;
}) => Promise<{
    id: string;
    name: string;
    code: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
declare const softDeleteDepartment: (id: string) => Promise<{
    id: string;
    name: string;
    code: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const departmentServices: {
    getAllDepartments: typeof getAllDepartments;
    createDepartment: typeof createDepartment;
    updateDepartment: typeof updateDepartment;
    softDeleteDepartment: typeof softDeleteDepartment;
};
export {};
//# sourceMappingURL=department.service.d.ts.map