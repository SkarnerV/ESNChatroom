import { Document } from 'mongoose'

export interface ESNUser extends Document {
    username: string
    password: string
}

export interface LoginCredentials {
    status: number
    message: string
    token?: string
}

export interface LoginAuthentication {
    userExists: boolean
    passwordMatch: boolean
}
