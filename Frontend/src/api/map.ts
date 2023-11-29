import { fetchRequest } from "./util";
import { spotApi } from "./routes";

export const getAllSpot = async () => {
  const res = await fetchRequest(spotApi, "GET");
  return res.json();
}

export const addSpot = async (spot) => {
  const res = await fetchRequest(spotApi, "POST", spot);
  return res.json();
}

export const updateSpot = async (spot) => {
  const res = await fetchRequest(spotApi, "PUT", spot);
  return res.json();
}

export const deleteSpot = async (spot) => {
  const res = await fetchRequest(spotApi, "DELETE", spot);
  return res.json();
}
