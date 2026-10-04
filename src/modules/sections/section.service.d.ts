interface ListQuery {
    semesterId?: string;
    courseId?: string;
    instructorId?: string;
}
declare const getAllSections: (query: ListQuery) => Promise<({
    course: {
        id: string;
        code: string;
        title: string;
        description: string | null;
        credits: number;
        departmentId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    };
    instructor: {
        id: string;
        name: string;
    };
    semester: {
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
        enrollmentOpen: boolean;
        tuitionPerCredit: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: string;
    courseId: string;
    semesterId: string;
    instructorId: string;
    sectionCode: string;
    capacity: number;
    enrolledCount: number;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
})[]>;
declare const getSectionById: (id: string) => Promise<{
    course: {
        id: string;
        code: string;
        title: string;
        description: string | null;
        credits: number;
        departmentId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    };
    instructor: {
        id: string;
        name: string;
    };
    semester: {
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
        enrollmentOpen: boolean;
        tuitionPerCredit: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: string;
    courseId: string;
    semesterId: string;
    instructorId: string;
    sectionCode: string;
    capacity: number;
    enrolledCount: number;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
declare const createSection: (data: {
    courseId: string;
    semesterId: string;
    instructorId: string;
    sectionCode: string;
    capacity: number;
}) => Promise<{
    id: string;
    courseId: string;
    semesterId: string;
    instructorId: string;
    sectionCode: string;
    capacity: number;
    enrolledCount: number;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
declare const updateSection: (id: string, data: Partial<{
    instructorId: string;
    capacity: number;
}>) => Promise<{
    id: string;
    courseId: string;
    semesterId: string;
    instructorId: string;
    sectionCode: string;
    capacity: number;
    enrolledCount: number;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
declare const getSectionsForInstructor: (instructorId: string) => Promise<({
    course: {
        id: string;
        code: string;
        title: string;
        description: string | null;
        credits: number;
        departmentId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    };
    semester: {
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
        enrollmentOpen: boolean;
        tuitionPerCredit: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: string;
    courseId: string;
    semesterId: string;
    instructorId: string;
    sectionCode: string;
    capacity: number;
    enrolledCount: number;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
})[]>;
export declare const sectionServices: {
    getAllSections: typeof getAllSections;
    getSectionById: typeof getSectionById;
    createSection: typeof createSection;
    updateSection: typeof updateSection;
    getSectionsForInstructor: typeof getSectionsForInstructor;
};
export {};
//# sourceMappingURL=section.service.d.ts.map