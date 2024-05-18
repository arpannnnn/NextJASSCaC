import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({
            username:
                decodedUsername
        })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },{ status: 500 })
        }
        const isCodeValid = user.verifycode == code
        const isCodeNotExpired = new Date(user.
            verifyCodeExpiry) > new Date()
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success: true,
                    message: "account verified successfully"
                }, { status: 200 }
            )
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code is expired , try Afterwhile"
            }, { status: 400 }
            )
        } else {
            return Response.json({
                success: false,
                message: "Incorrect Code"
            }, { status: 400 })
        }
    } catch (error) {
        console.error("Error verifying user", error)
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, { status: 400 })

    }
}
