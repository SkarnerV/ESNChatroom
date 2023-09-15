import Home from "./pages/home.js";
import Login from "./pages/login.js";

class Route {
    constructor(app) {
        this.app = app;
        this.redirectTo('home')
    }

    redirectTo(page) {
        if(!this.app.isLoggedIn) {
            this.page = new Login(this.app);
            return;
        }
        switch (page) {
            case 'home':
                this.page = new Home(this.app);
                break;
            case 'login':
                this.page = new Login(this.app);
                break;
            default:
                this.page = new Home(this.app);
                break;
        }
    }
}

export default Route;