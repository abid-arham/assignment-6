declare const generateInvoice: (studentId: string, semesterId: string) => Promise<{
    id: string;
    studentId: string;
    semesterId: string;
    totalCredits: number;
    amount: import("@prisma/client/runtime/library").Decimal;
    status: import("@prisma/client").$Enums.InvoiceStatus;
    paidAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
declare const getMyInvoices: (studentId: string) => Promise<({
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
    studentId: string;
    semesterId: string;
    totalCredits: number;
    amount: import("@prisma/client/runtime/library").Decimal;
    status: import("@prisma/client").$Enums.InvoiceStatus;
    paidAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
})[]>;
export declare const invoiceServices: {
    generateInvoice: typeof generateInvoice;
    getMyInvoices: typeof getMyInvoices;
};
export {};
//# sourceMappingURL=invoice.service.d.ts.map