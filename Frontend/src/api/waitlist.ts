import { waitlistApi } from "./routes";
import { fetchRequest } from "./util";

export const getCitizenInfoByUsername = async (username: string) => {
  return await fetchRequest(waitlistApi + `/${username}`, "GET").then(
    async (response) => {
      return await response.json();
    }
  );
};

export const getALLCitizenInfo = async () => {
  return await fetchRequest(waitlistApi + `allCitizens`, "GET").then(
    async (response) => {
      return await response.json();
    }
  );
};

export const updateWaitlistStatus = async (
  username: string,
  foodDonor: string
) => {
  return await fetchRequest(waitlistApi + `${username}`, "PUT", {
    username: username,
    foodDonor: foodDonor,
  }).then((response) => {
    return response.json();
  });
};

export const joinWaitlist = async (username: string, foodComments: string) => {
  return await fetchRequest(waitlistApi, "POST", {
    username: username,
    foodComments: foodComments,
  }).then(async (response) => {
    return await response.json();
  });
};

export const deleteCitizenFromWaitlist = async (username: string) => {
  return await fetchRequest(waitlistApi + `${username}`, "DELETE");
};
