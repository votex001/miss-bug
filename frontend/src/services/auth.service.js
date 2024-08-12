import Axios from "axios";
const axios = Axios.create({
  withCredentials: true,
});

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api/auth/"
    : "http://localhost:3030/api/auth/";
export const authService = {
  login,
  signUp,
  validateUser,
  logout,
};

async function login(credentials) {
  const url = BASE_URL + "login";
  try {
    const { data: user } = await axios.post(url, credentials);
    return user;
  } catch (err) {
    throw err;
  }
}

async function signUp(credentials) {
  const url = BASE_URL + "signup";
  try {
    const { data: user } = await axios.post(url, credentials);
    return user;
  } catch (err) {
    throw err;
  }
}

async function validateUser() {
  const url = BASE_URL + "checkToken";
  try {
    const { data: user } = await axios.post(url);
    return user;
  } catch (err) {
    throw err;
  }
}
async function logout() {
  const url = BASE_URL + "logout";
  try {
    const { data } = await axios.post(url);
    console.log(data);
  } catch (err) {
    throw err;
  }
}
