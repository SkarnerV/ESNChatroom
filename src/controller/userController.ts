import jwt from 'jsonwebtoken'
import { LoginCredentials, ESNUser, LoginAuthentication } from '../model/types'
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
        const isPasswordValid: boolean = password !== '' && password.length >= 4

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
            // considering removing isDuplicatedUser

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

    /**
     * Check if the user is authenticated to login
     *
     * @param user The user that is trying to login
     * @returns a LoginCrednetials message that shows the current request status
     */
    async loginUser(user: ESNUser): Promise<LoginCredentials> {
        const isExistingUser: LoginAuthentication =
            await this.userCollection.checkUserLogin(
                user.username,
                user.password,
            )

        // If both conditions are true, it generates a token and returns a successful login response.
        if (isExistingUser.userExists && isExistingUser.passwordMatch) {
            const userId = await this.userCollection.getUserId(user.username)
            if (userId !== '') {
                const token: string = UserController.createUserToken(userId)
                return ResponseGenerator.getLoginResponse(
                    200,
                    'User Logined',
                    token,
                )
            }
        } else if (isExistingUser.userExists && !isExistingUser.passwordMatch) {
            return ResponseGenerator.getLoginResponse(
                401,
                'Re-enter the username and/or password',
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
