import Route from './route.js'

class App {
    constructor() {
        this.isLoggedIn = this.getLoginStatus()
        this.route = new Route(this)
    }

    getLoginStatus() {
        return false
    }

}

export default App
