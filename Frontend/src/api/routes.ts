export const endpoint = process.env.SERVICEENDPOINT || "http://localhost:3000";

export const registerApi = `${endpoint}/api/users/register`;
export const loginApi = `${endpoint}/api/users/login`;

export const getAllUserStatusApi = `${endpoint}/api/users/status`;
export const AllUserApi = `${endpoint}/api/users`;
export const messagesApi = `${endpoint}/api/messages/`;

export const speedTestApi = `${endpoint}/api/speedtests`;
export const searchApi = `${endpoint}/api/search`;


export const likesApi = `${endpoint}/api/messages/likes`;

export const scheduleApi = `${endpoint}/api/schedules/`;

