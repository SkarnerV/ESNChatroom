/*
 * This component can be used to display the information on a small block cover 
 * current page. The parameter contentHTML is a DOM element that will be displayed 
 * in the modal. And accept two callback functions onConfirm and onCancel for 
 * further actions.
 * If onCancel is not provided, the modal will not have a cancel button. 
 */
class Modal {
    // contentHTML: DOM element
    constructor(contentHTML, onConfirm, onCancel = null) {
        this.modal = document.createElement('div')
        this.modal.classList.add('modal-container')

        this.modal.innerHTML = `
            <div class="modal">
                ${contentHTML.outerHTML}
                <div class="modal-footer">
                    ${onCancel ? '<button class="cancel-button button--secondary">Cancel</button>' : ''}
                    <button class="confirm-button button--primary">Confirm</button>
                </div>
            </div>
        `

        const cancel = () => {
            onCancel()
            this.modal.remove()
        }

        const confirm = () => {
            onConfirm()
            this.modal.remove()
        }

        this.modal.querySelector('.cancel-button')?.addEventListener('click', cancel)

        this.modal.querySelector('.confirm-button').addEventListener('click', confirm)

        this.modal.addEventListener('click', cancel)

        document.body.appendChild(this.modal)
    }
}

export default Modal