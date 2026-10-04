declare const getAllSemesters: () => Promise<{
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    enrollmentOpen: boolean;
    tuitionPerCredit: import("@prisma/client/runtime/library").Decimal;
    createdAt: Date;
    updatedAt: Date;
}[]>;
declare const createSemester: (data: {
    name: string;
    startDate: Date;
    endDate: Date;
    tuitionPerCredit: number;
}) => Promise<{
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    enrollmentOpen: boolean;
    tuitionPerCredit: import("@prisma/client/runtime/library").Decimal;
    createdAt: Date;
    updatedAt: Date;
}>;
declare const updateSemester: (id: string, data: Partial<{
    name: string;
    startDate: Date;
    endDate: Date;
    enrollmentOpen: boolean;
    tuitionPerCredit: number;
}>) => Promise<{
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    enrollmentOpen: boolean;
    tuitionPerCredit: import("@prisma/client/runtime/library").Decimal;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const semesterServices: {
    getAllSemesters: typeof getAllSemesters;
    createSemester: typeof createSemester;
    updateSemester: typeof updateSemester;
};
export {};
//# sourceMappingURL=semester.service.d.ts.map