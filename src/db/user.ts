import Database from './database'
import { Schema, Model } from 'mongoose'

interface IUser {
    username: string
    password: string
}

class User {
    private userModel: Model<IUser>

    constructor() {
        const userSchema = new Schema({
            username: String,
            password: String,
        })
        const my_db = Database.getInstance().getDB()
        this.userModel = my_db.model('User', userSchema)
    }

    //Create user in the DB
    async createUser(username: string, password: string): Promise<IUser> {
        const user = new this.userModel({ username, password })
        return await user.save()
    }

    //Check if user exist in the DB
    async findUser(username: string): Promise<IUser | null> {
        return await this.userModel.findOne({ username })
    }

    public getUserDB(): Model<IUser> {
        return this.userModel
    }
}

export default User
