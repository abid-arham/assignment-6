import { Prisma } from "@prisma/client";
declare const enroll: (studentId: string, sectionId: string) => Promise<{
    id: string;
    studentId: string;
    sectionId: string;
    status: import("@prisma/client").$Enums.EnrollmentStatus;
    grade: string | null;
    gradePoint: Prisma.Decimal | null;
    enrolledAt: Date;
    droppedAt: Date | null;
    deletedAt: Date | null;
    updatedAt: Date;
}>;
declare const drop: (studentId: string, enrollmentId: string) => Promise<{
    id: string;
    studentId: string;
    sectionId: string;
    status: import("@prisma/client").$Enums.EnrollmentStatus;
    grade: string | null;
    gradePoint: Prisma.Decimal | null;
    enrolledAt: Date;
    droppedAt: Date | null;
    deletedAt: Date | null;
    updatedAt: Date;
}>;
declare const getMyEnrollments: (studentId: string) => Promise<({
    section: {
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
            tuitionPerCredit: Prisma.Decimal;
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
    };
} & {
    id: string;
    studentId: string;
    sectionId: string;
    status: import("@prisma/client").$Enums.EnrollmentStatus;
    grade: string | null;
    gradePoint: Prisma.Decimal | null;
    enrolledAt: Date;
    droppedAt: Date | null;
    deletedAt: Date | null;
    updatedAt: Date;
})[]>;
declare const getStudentsForSection: (sectionId: string, instructorId: string) => Promise<({
    student: {
        email: string;
        id: string;
        name: string;
        studentCode: string | null;
    };
} & {
    id: string;
    studentId: string;
    sectionId: string;
    status: import("@prisma/client").$Enums.EnrollmentStatus;
    grade: string | null;
    gradePoint: Prisma.Decimal | null;
    enrolledAt: Date;
    droppedAt: Date | null;
    deletedAt: Date | null;
    updatedAt: Date;
})[]>;
export declare const enrollmentServices: {
    enroll: typeof enroll;
    drop: typeof drop;
    getMyEnrollments: typeof getMyEnrollments;
    getStudentsForSection: typeof getStudentsForSection;
};
export {};
//# sourceMappingURL=enrollment.service.d.ts.map