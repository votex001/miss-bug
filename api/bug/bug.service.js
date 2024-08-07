import fs from "fs";
import { makeId, readJsonFile } from "../../services/util.service.js";

const bugs = readJsonFile("data/bugs.json");

export const bugService = {
  query,
  getById,
  remove,
  save,
};

async function query() {
  try {
    return bugs;
  } catch (err) {
    console.log("Couldn't find bugs", err);
    throw err;
  }
}

async function getById(bugId) {
  try {
    const bug = bugs.find((bug) => bug._id === bugId);
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
    const bugIdx = bugs.findIndex((bug) => bug._id === bugId);
    if (bugIdx < 0) {
      throw `Couldn't remove bug with id ${bugId}`;
    }
    bugs.splice(bugIdx, 1);
    return _saveBugsToFile();
  } catch (err) {
    console.log("Couldn't find bug", err);
    throw err;
  }
}

async function save(bugToSave) {
  try {
    if (bugToSave._id) {
      const bugIdx = bugs.findIndex((bug) => bug._id === bugToSave._id);
      if (bugIdx < 0) {
        throw `Couldn't update bug with id ${bugId}`;
      }
      bugs[bugIdx] = bugToSave;
    } else {
      bugToSave._id = makeId();
      bugs.push(bugToSave);
    }
    _saveBugsToFile();
    return bugToSave;
  } catch (err) {
    console.log("Couldn't find bug", err);
    throw err;
  }
}

function _saveBugsToFile(path = "data/bugs.json") {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 4);
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
