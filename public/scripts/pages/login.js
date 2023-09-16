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
        contentElement.textContent = 'By clicking "Confirm," you will create a user account in Emergency Social Network.';
        contentElement.style.width = '300px';

        const register = () => {
            // call register api

            // if success, show welcome modal
            this.showWelcomeModal()
        }

        const cancel = () => { }

        new Modal(contentElement, register, cancel)
    }

    showWelcomeModal() {
        const contentElement = document.createElement('div');
        contentElement.classList.add('welcome-modal');
        contentElement.textContent = 'Welcome to Emergency Social Network. Please review the status categories below:';

        // Create a table to display status information
        const statusTable = document.createElement('table');
        statusTable.classList.add('status-table');

        // Define the table headers
        const tableHeader = `
            <thead>
                <tr>
                    <th>Status</th>
                    <th>Explanation</th>
                    <th>Color Code</th>
                    <th>Icon</th>
                </tr>
            </thead>
        `;

        // Define the table rows for each status
        const tableRows = `
            <tbody>
                <tr>
                    <td>OK</td>
                    <td>I am OK; I do not need help.</td>
                    <td style="background-color: green;"></td>
                    <td>✅</td>
                </tr>
                <tr>
                    <td>Help</td>
                    <td>I need help, but this is not a life-threatening emergency.</td>
                    <td style="background-color: yellow;"></td>
                    <td>⚠️</td>
                </tr>
                <tr>
                    <td>Emergency</td>
                    <td>I need help now; this is a life-threatening emergency!</td>
                    <td style="background-color: red;"></td>
                    <td>🆘</td>
                </tr>
                <tr>
                    <td>Undefined</td>
                    <td>The user has not provided any status info.</td>
                    <td style="background-color: gray;"></td>
                    <td>❓</td>
                </tr>
            </tbody>
        `;

        statusTable.innerHTML = tableHeader + tableRows;
        const tableContainer = document.createElement('div');
        tableContainer.classList.add('table-container');
        tableContainer.appendChild(statusTable);
        contentElement.appendChild(tableContainer);

        const redirectToHome = () => {
            this.app.isLoggedIn = true
            this.app.route.redirectTo('home')
        }

        new Modal(contentElement, redirectToHome);
    }


}

export default LoginPage;