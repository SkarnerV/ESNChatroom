import { authFromStatic } from "../static/auth-form-static";

class AuthForm extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = authFromStatic;
  }
}

// Define the custom element
customElements.define("auth-form", AuthForm);
