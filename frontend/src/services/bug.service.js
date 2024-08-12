import Axios from "axios";
const axios = Axios.create({
  withCredentials: true,
});
import { storageService } from "./async-storage.service.js";
import { utilService } from "./util.service.js";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api/bug"
    : "http://localhost:3030/api/bug";

export const bugService = {
  query,
  getById,
  save,
  remove,
};

async function query() {
  try {
    const { data: bugs } = await axios.get(BASE_URL);
    return bugs;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
async function getById(bugId) {
  const url = BASE_URL + `/${bugId}`;
  try {
    const { data: bug } = await axios.get(url);
    return bug;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function remove(bugId) {
  const url = BASE_URL + `/${bugId}`;
  try {
    await axios.delete(url);
  } catch (err) {
    console.log(err);
    throw err;
  }
}
async function save(bug) {
  try {
    const method = bug._id ? "put" : "post";
    const { data: savedBug } = await axios[method](BASE_URL, bug);
    return savedBug;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
