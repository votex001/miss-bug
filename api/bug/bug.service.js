import { getCollection } from "../../data/mongoDb.js";
import { ObjectId } from "mongodb";

export const bugService = {
  query,
  getById,
  remove,
  save,
};

async function query(filterBy) {
  try {
    const bugs = await getCollection("bugs");
    let cursor = bugs.find();

    if (filterBy.sortBy) {
      switch (filterBy.sortBy) {
        case "createdAt":
          cursor = cursor.sort({ _id: -1 });
          break;
        case "title":
          cursor = cursor.sort({ title: 1 });
          break;
        case "severity":
          cursor = cursor.sort({ severity: -1 });
          break;
      }
    } else {
      cursor = cursor.sort({ _id: -1 });
    }
    if (filterBy.txt) {
      const searchText = filterBy.txt.trim();
      const regex = new RegExp(searchText, "i");
      cursor.filter({ title: regex });
    }
    if (filterBy.minSeverity) {
      cursor.filter({ severity: { $gte: filterBy.minSeverity } });
    }
    if (filterBy.label) {
      cursor.filter({ "labels.name": filterBy.label });
    }
    return await cursor.toArray();
  } catch (err) {
    console.log("Couldn't find bugs", err);
    throw err;
  }
}

async function getById(bugId) {
  try {
    const cursor = await getCollection("bugs");

    const bug = cursor.findOne({ _id: ObjectId.createFromHexString(bugId) });
    if (!bug) {
      throw `Couldn't find bug ${bugId}`;
    }

    return bug;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
async function remove(bugId) {
  try {
    const cursor = await getCollection("bugs");

    const result = cursor.deleteOne({
      _id: ObjectId.createFromHexString(bugId),
    });
    if (result.matchedCount === 0) {
      throw `Couldn't remove bug with id ${bugId}`;
    }
  } catch (err) {
    console.log("Couldn't find bug", err);
    throw err;
  }
}

async function save(bugToSave) {
  bugToSave.ownerId = new ObjectId(bugToSave.ownerId);

  try {
    const bugs = await getCollection("bugs");
    if (bugToSave._id) {
      const { _id, ...updateFields } = bugToSave;
      const result = await bugs.updateOne(
        {
          _id: ObjectId.createFromHexString(_id),
        },
        { $set: updateFields }
      );
      if (result.matchedCount === 0) {
        throw `Couldn't update bug with id ${_id}`;
      }
    } else {
      await bugs.insertOne(bugToSave);
    }

    return bugToSave;
  } catch (err) {
    console.log("Couldn't find bug", err);
    throw err;
  }
}
