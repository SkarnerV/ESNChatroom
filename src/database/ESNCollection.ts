import mongoose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export default class ESNDatabase {
    private db

    constructor() {
        const mongodbKey = process.env.MONGODB_KEY || ''
        mongoose.connect(mongodbKey, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)

        this.db = mongoose.connection
        this.db.on(
            'error',
            console.error.bind(console, 'MongoDB connection error:'),
        )
        this.db.once('open', () => {
            console.log('Connected to MongoDB database')
        })
    }

    getDatabase() {
        return this.db
    }
}
