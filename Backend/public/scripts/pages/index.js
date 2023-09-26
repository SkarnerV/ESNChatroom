class Page {

    constructor(app, pageId) {
        this.app = app
        this.hideAllPages()
        document.getElementById(pageId).style.display = 'block'
    }

    hideAllPages() {
        document.getElementById('home-page').style.display = 'none'
        document.getElementById('login-page').style.display = 'none'
    }
}

export default Page