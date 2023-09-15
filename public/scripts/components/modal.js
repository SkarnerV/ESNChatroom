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
        this.modal.classList.add('modal')

        this.modal.appendChild(contentHTML);

        const modalFooter = document.createElement('div')
        modalFooter.classList.add('modal-footer')

        if (onCancel) {
            const cancelButton = document.createElement('button')
            cancelButton.textContent = 'Cancel'
            cancelButton.addEventListener('click', () => {
                onCancel()
                this.modal.remove()
            })
            modalFooter.appendChild(cancelButton)
        }

        const confirmButton = document.createElement('button')
        confirmButton.textContent = 'Confirm'
        confirmButton.addEventListener('click', ()=>{
            onConfirm()
            this.modal.remove()
        })
        modalFooter.appendChild(confirmButton)

        this.modal.appendChild(modalFooter)

        document.body.appendChild(this.modal)
    }
}

export default Modal