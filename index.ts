import express from 'express'
import { createServer, Server as HttpServer } from 'http'
import bodyParser from 'body-parser'
import userRouter from './src/userRouter'

class App {
    private app: express.Application
    private server: HttpServer
    private router: userRouter

    constructor() {
        this.app = express()
        this.server = createServer(this.app)
        this.router = new userRouter()
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
        this.app.use(express.static(__dirname + '/public'))
        this.app.get('/')

        // Handles register action
        this.app.post('/auth/register', this.router.register)
    }

    start(): void {
        this.registerPortListener()
        this.registerBodyParser()
        this.registerRoutes()
    }
}

const application: App = new App()

application.start()
