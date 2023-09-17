import express, { Router } from 'express'
import { createServer, Server as HttpServer } from 'http'
import bodyParser from 'body-parser'
import UserRouter from './src/router/userRouter'

class App {
    private app: express.Application
    private server: HttpServer

    constructor() {
        this.app = express()
        this.server = createServer(this.app)

    }

    private registerPortListener(): void {
        this.server.listen(3000, () => {
            console.log('listening on http://localhost:3000/')
        })
    }

    private registerBodyParser(): void {
        this.app.use(bodyParser.json())
    }

    private registerRoutes(): void {
        const userRouter: Router = new UserRouter().getRouter()
        this.app.use('/auth', userRouter)
    }

    private registerFrontend(): void {
        this.app.use(express.static('public'))
    }

    start(): void {
        this.registerPortListener()
        this.registerBodyParser()
        this.registerRoutes()
        this.registerFrontend()
    }
}

const application: App = new App()

application.start()
