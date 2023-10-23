import "../components/general/maintenance-modal.ts";

const headers = {
  "Content-Type": "application/json",
};

export const fetchRequest = (
  routes: string,
  method: string,
  body?: { [key: string]: string }
): Promise<Response> =>
  fetch(routes, {
    method: method,
    headers,
    body: JSON.stringify(body),
  }).then((res) => {
    // If get 503 status code, show maintenance modal
    if (res.status === 503) {
      const body = document.getElementsByTagName("body")[0];
      const maintenanceModal = document.createElement("maintenance-modal");
      if (document.getElementsByTagName("maintenance-modal").length === 0)
        body.appendChild(maintenanceModal);
    }
    return res;
  });
