import bcrypt from "bcryptjs";
import { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { ILoginUser, IUser } from "./auth.interface";

const registerUserIntDB = async (payload: IUser) => {
    const {name, email, password, role} = payload;
    const isUserExist = await prisma.user.findUnique({
        where : {email}
    })
    if(isUserExist) {
        throw new Error("User already exists");
    };

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
    const registerUser = await prisma.user.create({
        data : {
            name,
            email,
            role,
            password : hashedPassword
        }   
    });

    const user = await prisma.user.findUnique({
        where : {
            id : registerUser.id,
            email : registerUser.email || email
        },
        omit : {
            password : true
        }
    })

    return user;
}

const loginUser = async (payload : ILoginUser) => {
    const { email, password } = payload;
    const user = await prisma.user.findUniqueOrThrow({
        where : {email}
    })

    if (user.status === "SUSPENDED") {
        throw new Error("Your account has been blocked. Please contact support.");
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if(!isPasswordMatched){
        throw new Error("Password is incorrect");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }


    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );


    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );

    return {
        accessToken,
        refreshToken
    };
}

const getMyProfileFromDB = async (userId : string) => {
    console.log(userId)
    const user = await prisma.user.findUniqueOrThrow({
        where : {id : userId},
        omit : {
            password : true
        }
    });

    return user;
}

export const authService = {
    registerUserIntDB,
    loginUser,
    getMyProfileFromDB
}