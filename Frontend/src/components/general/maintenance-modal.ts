import { maintenanceModalTemplate } from "../../templates/general/maintenance-modal-template";

class MainTenanceModal extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = maintenanceModalTemplate;
  }
}

customElements.define("maintenance-modal", MainTenanceModal);
