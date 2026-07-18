import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { authService } from "./auth.service";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";

const registerUser = catchAsync(async (req : Request, res : Response) => {
    const payload = req.body;
    const user = await authService.registerUserIntDB(payload);
    sendResponse(res, {
        success : true,
        statusCode : httpStatus.CREATED,
        message : "User registration successful",
        data : { user }
    }); 
})

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

const getMyProfile = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    
    const profile = await authService.getMyProfileFromDB(req.user?.id as string);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User profile fetched successfully",
        data: { profile }
    })
})

export const authController = {
    registerUser,
    loginUser,
    getMyProfile
}