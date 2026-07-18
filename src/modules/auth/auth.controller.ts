import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { authService } from "./auth.service";

const loginUser = catchAsync(async (req : Request, res : Response, next: NextFunction ) => {
    const payload = req.body;
    const {accessToken, refreshToken } = await authService.loginUser(payload);
    
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 *24 //1d, 
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 *24 * 7 // 7d
    });

    sendResponse(res, {
        statusCode : 200,
        success : true,
        message : "User logged in successfully",
        data : {accessToken, refreshToken}
    });

})

export const authController = {
    loginUser
}