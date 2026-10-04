export declare function getMe(userId: string): Promise<{
    id: string;
    name: string;
    email: string;
    role: import(".prisma/client").$Enums.Role;
    studentCode: string | null;
    departmentId: string | null;
    isActive: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function updateMe(userId: string, data: {
    name: string;
}): Promise<{
    id: string;
    name: string;
    email: string;
    role: import(".prisma/client").$Enums.Role;
    studentCode: string | null;
    departmentId: string | null;
    isActive: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=users.service.d.ts.map