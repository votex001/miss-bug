import { loggerService } from "../../services/logger.service.js";
import { getCollection } from "../../data/mongoDb.js";
import { ObjectId } from "mongodb";

export const userService = {
  save,
  getByUsername,
  getById,
};

async function getByUsername(username) {
  try {
    const users = await getCollection("users");

    const user = users.findOne({ username });
    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
async function getById(id) {
  try {
    const users = await getCollection("users");

    const user = await users
      .aggregate([
        { $match: { _id: ObjectId.createFromHexString(id) } },
        {
          $lookup: {
            localField: "_id",
            from: "bugs",
            foreignField: "ownerId",
            as: "foundBugs",
          },
        },
      ])
      .toArray();
    return user[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function save(user) {
  try {
    const users = await getCollection("users");
    users.insertOne(user);
    return user.username;
  } catch (err) {
    loggerService.error("userService[save] : ", err);
    throw err;
  }
}
