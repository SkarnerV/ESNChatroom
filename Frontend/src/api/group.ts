import { fetchRequest } from "./util";
import { groupApi } from "./routes";

export const getAllGroups = async () => {
  const res = await fetchRequest(groupApi, "GET");
  return res.json();
};

export const createGroup = async (name: string, description: string) => {
  return await fetchRequest(groupApi, "POST", {
    name: name,
    description: description,
  }).then((response) => {
    console.log(response);
    return response.json();
  });
};
export const updateGroup = async (
  curName: string,
  newName: string,
  newDescription: string
) => {
  console.log(curName, newName, newDescription);
  return await fetchRequest(groupApi, "PUT", {
    curname: curName,
    name: newName,
    description: newDescription,
  }).then((response) => {
    return response.json();
  });
};

export const deleteGroup = async (name: string) => {
  return await fetchRequest(groupApi, "DELETE", {
    name: name,
  }).then((response) => {
    console.log(response);
    return response.json();
  });
};
