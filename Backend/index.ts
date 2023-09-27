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

    private registerCORS(): void {
        this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*')
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept',
            )
            res.header(
                'Access-Control-Allow-Methods',
                'GET, POST, PUT, DELETE, OPTIONS',
            )
            res.header('Access-Control-Allow-Credentials', 'true')
            next()
        })
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
        this.app.use('/users', userRouter)
    }

    start(): void {
        this.registerCORS()
        this.registerPortListener()
        this.registerBodyParser()
        this.registerRoutes()
    }
}

const application: App = new App()

application.start()
