import { ObjectId } from "mongodb";
import { loggerService } from "../../services/logger.service.js";
import { authService } from "../auth/auth.service.js";
import { userService } from "./user.service.js";

export async function checkUser(req, res) {
  try {
    const user = authService.validateToken(req.cookies.loginToken);
    const existUser = user ? await userService.getById(user.id) : null;

    if (!existUser) {
      res.send();
    } else {
      res.status(200).send(user);
    }

    res.send();
  } catch (err) {
    console.log(err);
    res.status(401).send({ err: "Failed to check" });
  }
}
export async function userById(req, res) {
  const { id } = req.params;
  try {
    const existUser = await userService.getById(id);
    if (!existUser) res.status(400).send("Couldn't get user");
    const existingObjectId = new ObjectId(existUser._id)
      .getTimestamp()
      .getTime();

    const userParams = {
      username: existUser.username,
      email: existUser.email,
      createdAt: existingObjectId,
      isAdmin: existUser.isAdmin,
      foundBugs:existUser.foundBugs
    };
    res.send(userParams);
  } catch (err) {
    loggerService.error("Couldn't get user", err);
    res.status(400).send("Couldn't get user");
  }
}
