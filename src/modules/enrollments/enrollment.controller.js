import httpStatus from "http-status";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/sendResponse.js";
import { enrollmentServices } from "./enrollment.service.js";
const enroll = asyncHandler(async (req, res) => {
    const result = await enrollmentServices.enroll(req.user.id, req.body.sectionId);
    sendSuccess(res, httpStatus.CREATED, "Enrolled successfully", result);
});
const drop = asyncHandler(async (req, res) => {
    const result = await enrollmentServices.drop(req.user.id, req.params.id);
    sendSuccess(res, httpStatus.OK, "Dropped successfully", result);
});
const getMyEnrollments = asyncHandler(async (req, res) => {
    const result = await enrollmentServices.getMyEnrollments(req.user.id);
    sendSuccess(res, httpStatus.OK, "Enrollments retrieved successfully", result);
});
const getStudentsForSection = asyncHandler(async (req, res) => {
    const result = await enrollmentServices.getStudentsForSection(req.params.id, req.user.id);
    sendSuccess(res, httpStatus.OK, "Students retrieved successfully", result);
});
export const enrollmentController = { enroll, drop, getMyEnrollments, getStudentsForSection };
//# sourceMappingURL=enrollment.controller.js.map