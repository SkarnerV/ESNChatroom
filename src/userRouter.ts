import { Request, Response } from 'express'
import userDB from './db/user'

class userRouter {
    private users: userDB

    //Initiate the DB
    constructor() {
        this.users = new userDB()
    }

    /**** 
    This function has the features:
      - Check if both username and password field are non-empty
      - Find if a user is already in the db (using all lower case)
      - If it is a new user add the username(all lower case) along with password to the db
      ## Each action will return a message with json to the client to indicate the status
    ****/
    async register(req: Request, res: Response): Promise<void> {
        // Here password will need to add encryption
        const { username, password } = req.body
        if (!username || !password) {
            res.status(400).json({
                message: 'Username and Password are required',
            })
        }
        if (this.users.findUser(username.toLowerCase()) != null) {
            res.status(400).json({ message: 'Username already exist' })
        }
        try {
            this.users.createUser(username.toLowerCase(), password)
            res.status(201).json({ message: 'User registered complete' })
        } catch (error) {
            res.status(500).json({ message: 'Server error' })
        }
    }
}

export default userRouter
