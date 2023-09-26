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
  });
