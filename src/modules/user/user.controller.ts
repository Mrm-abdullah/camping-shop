import { NextFunction, Request, Response } from "express";
import httpStatus, { status } from "http-status";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";


const registerUser = catchAsync(async (req : Request, res : Response) => {
    const payload = req.body;
    const user = await userService.registerUserIntDB(payload);

    sendResponse(res, {
        success : true,
        statusCode : httpStatus.CREATED,
        message : "User registration successful",
        data : { user }
    }); 
})

export const userController = {
    registerUser
}