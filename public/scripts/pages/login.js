import Page from "./index.js";
import Modal from "../components/modal.js";

class LoginPage extends Page {
    
    constructor(app) {
        super(app, 'login-page');
        const loginForm = document.getElementById('login-form')
        loginForm.addEventListener('submit', this.hangleLoginFormSubmit)
    }

    hangleLoginFormSubmit = (event) => {
        event.preventDefault()
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value
    
        alert(username + ", " + password)
        // check rules
    
        // request to server
    
        // if already registered, redirect to home page
    
        // else show register modal
        this.showConfirmModal()

    }

    showConfirmModal() {
        const contentElement = document.createElement('div');
        contentElement.textContent = 'confirm creation of account';

        const register = () => {
            console.log('register')
            this.showWelcomeModal()
            delete this
        }

        const cancel = () => {
            console.log('cancel')
            delete this
        }

        new Modal(contentElement, register, cancel)
    }

    showWelcomeModal() {
        const contentElement = document.createElement('div');
        contentElement.textContent = 'this is welcome message';

        const redirectToHome = () => {
            this.app.isLoggedIn = true
            this.app.route.redirectTo('home')
        }

        new Modal(contentElement, redirectToHome)
    }
    
}

export default LoginPage;