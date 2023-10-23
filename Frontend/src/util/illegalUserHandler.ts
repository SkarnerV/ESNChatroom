export class IllegalUserActionHandler {
  static redirectToLogin(): void {
    if (localStorage.getItem("token") === null) {
      window.location.href = "/";
    }
  }
  static redirectToHome(): void {
    if (localStorage.getItem("token") !== null) {
      window.location.href = "/home.html";
    }
  }
}
