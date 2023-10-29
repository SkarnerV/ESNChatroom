export class IllegalUserActionHandler {
  static async redirectToLogin(): Promise<void> {
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
