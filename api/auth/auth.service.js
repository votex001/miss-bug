import Cryptr from "cryptr";
import bcrypt from "bcrypt";

import { userService } from "../user/user.service.js";
import { loggerService } from "../../services/logger.service.js";

const cryptr = new Cryptr("Secret-Puk-1234");
export const authService = {
  getLoginToken,
  validateToken,
  login,
  signup,
};
async function login(username, password) {
  var user = await userService.getByUsername(username);
  if (!user) throw "Unknown username";

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw "Invalid username or password";

  const miniUser = {
    id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  };
  return miniUser;
}

function getLoginToken(user) {
  const str = JSON.stringify(user);
  const encryptedStr = cryptr.encrypt(str);
  return encryptedStr;
}

function validateToken(token) {
  try {
    const json = cryptr.decrypt(token);
    const loggedinUser = JSON.parse(json);
    return loggedinUser;
  } catch (err) {
    console.log("Invalid login token");
  }
  return null;
}

async function signup({ username, password, email }) {
  const saltRounds = 10;

  loggerService.debug(
    `auth.service - signup with username: ${username}, email: ${email}`
  );
  if (!username || !password || !email)
    throw "Missing required signup information";

  const userExist = await userService.getByUsername(username);
  if (userExist) throw "username already exists";

  const hash = await bcrypt.hash(password, saltRounds);
  return userService.save({ username, password: hash, email: email });
}
