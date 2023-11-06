import { fetchRequest } from "./util";
import { searchApi } from "./routes";

export const searchInContext = async (
  context,
  criteria,
  sender = "",
  sendee = ""
) => {
  // Construct the query parameters
  const queryParams = new URLSearchParams({
    criteria,
    ...(sender && { sender }), // Only add sender if it's truthy
    ...(sendee && { sendee }), // Only add sendee if it's truthy
  }).toString(); // Convert the URLSearchParams object to a string
  try {
    const apicall = `${searchApi}/${context}?${queryParams}`;
    const response = await fetchRequest(apicall, "GET");
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error) {
    console.error("Search request failed:", error.message);
    throw error;
  }
};
