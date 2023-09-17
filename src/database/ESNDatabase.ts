import mongoose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export default class ESNDatabase {
    private database

    constructor() {
        const mongodbKey = process.env.MONGODB_KEY || ''
        mongoose.connect(mongodbKey, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)

        this.database = mongoose.connection
        this.registerErrorListener()
        this.registerSuccessConnectionListener()
    }

    private registerErrorListener() {
        this.database.on(
            'error',
            console.error.bind(console, 'MongoDB connection error:'),
        )
    }

    private registerSuccessConnectionListener() {
        this.database.once('open', () => {
            console.log('Connected to MongoDB database')
        })
    }

    getDatabase() {
        return this.database
    }
}
