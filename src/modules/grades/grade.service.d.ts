declare const submitGrade: (enrollmentId: string, instructorId: string, grade: string) => Promise<{
    id: string;
    studentId: string;
    sectionId: string;
    status: import("@prisma/client").$Enums.EnrollmentStatus;
    grade: string | null;
    gradePoint: import("@prisma/client/runtime/library").Decimal | null;
    enrolledAt: Date;
    droppedAt: Date | null;
    deletedAt: Date | null;
    updatedAt: Date;
}>;
declare const getTranscript: (studentId: string) => Promise<{
    gpa: number;
    totalCredits: number;
    courses: {
        courseCode: string;
        title: string;
        credits: number;
        grade: string | null;
        enrolledAt: Date;
        isCounted: boolean;
    }[];
}>;
export declare const gradeServices: {
    submitGrade: typeof submitGrade;
    getTranscript: typeof getTranscript;
};
export {};
//# sourceMappingURL=grade.service.d.ts.map