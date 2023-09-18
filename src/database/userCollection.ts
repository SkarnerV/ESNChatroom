import { ESNUser } from '../model/types'
import ESNDatabase from './ESNDatabase'
import { Schema } from 'mongoose'

export default class UserCollection extends ESNDatabase {
    private esnUserModel
    constructor() {
        super()
        const userSchema = new Schema({
            username: String,
            password: String,
        })

        this.esnUserModel = this.getDatabase().model('ESNUser', userSchema)
    }

    // Create user in the DB
    async createUser(esnUser: ESNUser): Promise<string> {
        const { username, password } = esnUser
        const user = new this.esnUserModel({ username, password })
        const savedUser = await user.save()
        return savedUser._id.toString()
    }

    // Check if user exist in the DB
    // considering removing below function
    async checkUserDuplication(username: string): Promise<boolean> {
        const user = await this.esnUserModel.exists({ username })

        return user ? true : false
    }

    async checkUserLogin(
        username: string,
        password: string,
    ): Promise<{ userExists: boolean; passwordMatch: boolean }> {
        const user = await this.esnUserModel.findOne({ username })
        if (user) {
            // User exists, check password
            const isPasswordMatch = user.password === password
            return { userExists: true, passwordMatch: isPasswordMatch }
        } else {
            // User does not exist
            return { userExists: false, passwordMatch: false }
        }
    }
}
