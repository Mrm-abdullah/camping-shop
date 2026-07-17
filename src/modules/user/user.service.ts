import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import httpStatus from "http-status";
import { IUser } from "./user.interface";

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

export const userService = {
    registerUserIntDB
}