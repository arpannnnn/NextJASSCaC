import mongoose, { Schema, Document } from "mongoose"


export interface Message extends Document {
    content: string;
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifycode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/.+\@.+\..+/, 'please use a valid email address']
    },
    password: {
        type: String,
        required: [true, "password is required"],

    },
    verifycode: {
        type: String,
        required: [true, "Verify Code  is required"],

    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code Expery is required"],

    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,


    },
    isVerified: {
        type: Boolean,
        default: false,


    },
    messages: [MessageSchema]
})


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel; 