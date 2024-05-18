import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        //validate with ZOD
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result) //TODO: remove

        if (!result.success) {
            const UsernameErrors = result.error.format().username?._errors
                || []
            return Response.json({
                success: false,
                message: UsernameErrors?.length > 0
                    ? UsernameErrors.join(', ')
                    : 'Invalid query parameters',

            }, { status: 400 })
        }
        const { username } = result.data
        const existingVerifieduser = await UserModel.findOne({ username, isVerified: true })

        if (existingVerifieduser) {
            return Response.json({
                success: false,
                message: 'Username is already taken'
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message: 'Username is available'
        }, { status: 400 })


    } catch (error) {
        console.error("error checking username", error)
        return Response.json(
            {
                success: false,
                message: "error checking username"
            },
            { status: 500 }
        )

    }
}