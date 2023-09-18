import Page from './index.js'
import Modal from '../components/modal.js'

import reservedUsernames from '../constants/reservedUsernames.js'

class LoginPage extends Page {
    constructor(app) {
        super(app, 'login-page')
        const loginForm = document.getElementById('login-form')
        loginForm.addEventListener('submit', this.hangleLoginFormSubmit)
    }

    hangleLoginFormSubmit = event => {
        event.preventDefault()
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value

        // check Username Rule, Password Rule, and Basic Security Rule
        if (!this.isUsernameValid(username)) return
        if (!this.isPasswordValid(password)) return

        // request to server to check if users can login
        fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then(response => {
                if (response.ok) {
                    // Successful response (status code 200-299)
                    return response.json()
                } else {
                    // Handle error response
                    throw new Error('HTTP error: ' + response.status)
                }
            })
            .then(data => {
                const status = data.status
                const message = data.message
                //const token = data.token

                // Iteration0-A1: if the user is already a community member
                // (the username already exists and the password is correct), then nothing happens
                if (status === 200) {
                    this.showWelcomeModal()
                    return
                }
                // if the username already exists but the password is incorrect (does not match the existing username),
                // the system informs the Citizen that he needs to re-enter the username and/or password.
                else if (status === 401) {
                    this.showError(message)
                    return
                }
                // user does not exist, show confirmation modal for user to start registration
                else {
                    this.showConfirmModal()
                }
            })
            .catch(error => {
                // Handle error during the API call
                this.showError(error)
            })
    }

    showConfirmModal() {
        const contentElement = document.createElement('div')
        contentElement.textContent =
            'By clicking "Confirm," you will create a user account in Emergency Social Network.'
        contentElement.style.width = '300px'
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value

        const register = () => {
            // request to server to register a user account
            fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            })
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        // Handle error response
                        throw new Error('HTTP error: ' + response.status)
                    }
                })
                .then(data => {
                    const status = data.status
                    const message = data.messagea

                    if (status === 201) {
                        // if success, show welcome modal
                        this.showWelcomeModal()
                    } else if (status === 400) {
                        this.showError(message)
                        return
                    }
                })
                .catch(error => {
                    // Handle error during the API call
                    this.showError(error)
                })
        }

        const cancel = () => {}

        new Modal(contentElement, register, cancel)
    }

    showWelcomeModal() {
        const contentElement = document.createElement('div')
        contentElement.classList.add('welcome-modal')
        contentElement.textContent =
            'Welcome to Emergency Social Network. Please review the status categories below:'

        // Create a table to display status information
        const statusTable = document.createElement('table')
        statusTable.classList.add('status-table')

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
        `

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
        `

        statusTable.innerHTML = tableHeader + tableRows
        const tableContainer = document.createElement('div')
        tableContainer.classList.add('table-container')
        tableContainer.appendChild(statusTable)
        contentElement.appendChild(tableContainer)

        const redirectToHome = () => {
            this.app.isLoggedIn = true
            this.app.route.redirectTo('home')
        }

        new Modal(contentElement, redirectToHome)
    }

    showError(errMsg) {
        // remove all error labels
        const errorLabels = document.querySelectorAll('.error-label')
        errorLabels.forEach(label => label.remove())

        // append error label
        const appendBelow = document.getElementById('password')
        const errorElement = document.createElement('label')
        errorElement.classList.add('error-label')
        errorElement.textContent = errMsg
        appendBelow.insertAdjacentElement('afterend', errorElement)
    }

    isUsernameValid(username) {
        username = username.toLowerCase()
        if (username.length < 3) {
            this.showError('Username must be at least 3 characters long.')
            return false
        }
        if (reservedUsernames.includes(username)) {
            this.showError('Username is not allowed.')
            return false
        }
        return true
    }

    isPasswordValid(password) {
        if (password.length < 4) {
            this.showError('Password must be at least 4 characters long.')
            return false
        }
        return true
    }
}

export default LoginPage
