import jwt from 'jsonwebtoken'
import { LoginCredentials, ESNUser } from '../model/types'
import UserCollection from '../database/userCollection'
import ResponseGenerator from '../util/responseGenerator'

export default class UserController {
    private userCollection: UserCollection

    constructor() {
        this.userCollection = new UserCollection()
    }

    /**
     * generate a token for user id
     *
     * @param id user id that is used to generate a token
     * @return the generated token
     */
    private static createUserToken(id: string): string {
        return jwt.sign({ id }, 'esn', { expiresIn: '1h' })
    }

    /**
     * Validates the user information
     *
     * @param user The validated user information
     * @return False if the user provided is illegal
     *         True if the user provided is legal
     */
    private static isValidCredential(user: ESNUser): boolean {
        const { username, password } = user

        const isUsernameValid: boolean = username !== ''
        const isPasswordValid: boolean = password !== '' && password.length > 8

        return isUsernameValid && isPasswordValid
    }

    /**
     * After validating and performing duplication check, create a new user
     *
     * @param user The user that will be created
     * @return a LoginCrednetials message that shows the current request status
     */
    async createUser(user: ESNUser): Promise<LoginCredentials> {
        if (UserController.isValidCredential(user)) {
            const isDuplicatedUser: boolean =
                await this.userCollection.checkUserDuplication(user.username)

            if (isDuplicatedUser) {
                return ResponseGenerator.getLoginResponse(400, 'Account Exist')
            }

            const createdUserID: string =
                await this.userCollection.createUser(user)

            const token: string = UserController.createUserToken(createdUserID)

            return ResponseGenerator.getLoginResponse(
                201,
                'Account Created Successfully!',
                token,
            )
        }
        return Promise.resolve(
            ResponseGenerator.getLoginResponse(
                400,
                'Username and Password are required',
            ),
        )
    }
}
