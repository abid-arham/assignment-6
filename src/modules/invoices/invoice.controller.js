import { Request, Response } from "express";
import httpStatus from "http-status";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/sendResponse.js";
import { invoiceServices } from "./invoice.service.js";
const generateInvoice = asyncHandler(async (req, res) => {
    const result = await invoiceServices.generateInvoice(req.user.id, req.body.semesterId);
    sendSuccess(res, httpStatus.OK, "Invoice generated successfully", result);
});
const getMyInvoices = asyncHandler(async (req, res) => {
    const result = await invoiceServices.getMyInvoices(req.user.id);
    sendSuccess(res, httpStatus.OK, "Invoices retrieved successfully", result);
});
export const invoiceController = { generateInvoice, getMyInvoices };
//# sourceMappingURL=invoice.controller.js.map