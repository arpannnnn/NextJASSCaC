import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, email, password } = await request.json()
        const existingUserVerifiedByUsername = await
            UserModel.findOne({
                username,
                isVerified: true
            })
        if (existingUserVerifiedByUsername) {
            return Response.json({

                success: false,
                message: "Username is Already taken"

            }, { status: 400 })
        }
        const existingUserBYEmail = await UserModel.findOne({
            email
        })
        const verifyCode = Math.floor(1000 + Math.random()
            * 900000).toString()
        if (existingUserBYEmail) {
            if (existingUserBYEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                }, { status: 500 })
            } else {
                const hasedPassword = await bcrypt.hash
                    (password, 10)
                existingUserBYEmail.password = hasedPassword;
                existingUserBYEmail.verifycode = verifyCode;
                existingUserBYEmail.verifyCodeExpiry = new
                    Date(Date.now() + 3600000)
                await existingUserBYEmail.save()


            }
        } else {
            const hasedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: []


            })
            await newUser.save()
        }

        //send Verification email

        const emailResponse = await sendVerificationEmail(
            email, username,
            verifyCode
        )
        if (!emailResponse.success) {
            return Response.json({
                success: true,
                message: emailResponse.message
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "user registered successfully. Please Verify your email "
        }, { status: 201 })

    } catch (error) {
        console.error("error registering User", error)
        return Response.json(
            {
                success: false,
                message: "error registering user"
            },
            {
                status: 300
            }
        )
    }
}