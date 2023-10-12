export const endpoint = process.env.SERVICEENDPOINT || "http://localhost:3000";

export const registerApi = `${endpoint}/users/register`;
export const loginApi = `${endpoint}/users/login`;

export const getAllUserStatusApi = `${endpoint}/users/status`;
export const getAllPublicMessagesApi = `${endpoint}/messages/public`;
export const postPublicMessageApi = `${endpoint}/messages/public_post`;
export const putUserOnlineStatusApi = `${endpoint}/users/onlinestatus`;
