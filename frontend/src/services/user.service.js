import Axios from "axios";
const axios = Axios.create({
  withCredentials: true,
});
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api/user/"
    : "http://localhost:3030/api/user/";

export const userService = {
  validateUser,
  getUser
};

async function validateUser() {
  const url = BASE_URL + "checkToken";
  try {
    const { data: user } = await axios.post(url);
    return user;
  } catch (err) {
    throw err;
  }
}

async function getUser(userId) {
  const url = BASE_URL + `${userId}`;

  try {
    const { data: user } = await axios.get(url);
    return user;
  } catch {
    throw err;
  }
}
