import express, { Request, Response, Router } from 'express'
import { ESNUser, LoginCredentials } from '../model/types'
import UserController from '../controller/userController'

export default class UserRouter {
    private router: Router
    private controller: UserController

    constructor() {
        this.controller = new UserController()
        this.router = express.Router()
        this.init()
    }

    private init(): void {
        this.router.post(
            '/register',
            async (request: Request, response: Response) => {
                const user: ESNUser = request.body
                const message: LoginCredentials =
                    await this.controller.createUser(user)
                response.send(message)
            },
        )
    }

    getRouter(): Router {
        return this.router
    }
}
