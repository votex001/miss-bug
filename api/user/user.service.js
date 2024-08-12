import fs from "fs";
import { makeId, readJsonFile } from "../../services/util.service.js";
import { loggerService } from "../../services/logger.service.js";

const users = readJsonFile("data/users.json");
export const userService = {
  save,
  getByUsername,
};

async function getByUsername(username) {
  try {
    const user = users.find((user) => user.username === username);
    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
async function save(user) {
  try {
    user._id = makeId();
    user.createdAt = Date.now();

    users.push(user);
    await _saveUsersToFile();
    return user.username;
  } catch (err) {
    loggerService.error("userService[save] : ", err);
    throw err;
  }
}

function _saveUsersToFile(path = "data/users.json") {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(users, null, 4);
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
