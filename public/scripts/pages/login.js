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
    
        // check Username Rule, Password Rule, and Basic Security Rule
    
        // request to server to check if already registered
    
        // if already registered, redirect to home page
    
        // else show register modal
        this.showConfirmModal()

    }

    showConfirmModal() {
        const contentElement = document.createElement('div');
        contentElement.textContent = 'confirm creation of account';

        const register = () => {
            // call register api

            // if success, show welcome modal
            this.showWelcomeModal()
        }

        const cancel = () => {}

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