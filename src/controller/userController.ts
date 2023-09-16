import jwt from 'jsonwebtoken'
import { LoginCredentials, ESNUser } from '../model/types'
import UserCollection from '../database/userCollection'

export default class UserController {
    private userCollection: UserCollection

    constructor() {
        this.userCollection = new UserCollection()
    }

    private static createUserToken(id: string): string {
        return jwt.sign({ id }, 'esn', { expiresIn: '1h' })
    }

    private static isValidCredential(user: ESNUser): boolean {
        const { username, password } = user

        const isUsernameValid: boolean = username !== ''
        const isPasswordValid: boolean = password !== '' && password.length > 8

        return isUsernameValid && isPasswordValid
    }

    async register(user: ESNUser): Promise<LoginCredentials> {
        if (UserController.isValidCredential(user)) {
            const userCredentials: boolean =
                await this.userCollection.checkUserExits(user.username)

            if (userCredentials) {
                return {
                    status: 400,
                    message: 'Account Exists',
                }
            }

            const createdAccountStatus =
                await this.userCollection.createUser(user)
            const token: string =
                UserController.createUserToken(createdAccountStatus)
            return {
                status: 201,
                message: 'Account Created',
                token,
            }
        }

        return Promise.resolve({
            status: 400,
            message: 'Username and Password are required',
        })
    }
}
