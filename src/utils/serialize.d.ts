import { User } from "@prisma/client";
export declare function toSafeUser(user: User): {
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
};
//# sourceMappingURL=serialize.d.ts.map