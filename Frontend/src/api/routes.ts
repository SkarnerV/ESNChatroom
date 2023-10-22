export const endpoint = process.env.SERVICEENDPOINT || "http://localhost:3000";

export const registerApi = `${endpoint}/users/register`;
export const loginApi = `${endpoint}/users/login`;

export const getAllUserStatusApi = `${endpoint}/users/status`;
export const AllUserApi = `${endpoint}/users`;
export const messagesApi = `${endpoint}/messages/`;

export const putUserOnlineStatusApi = `${endpoint}/users/onlinestatus`;
