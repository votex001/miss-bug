import fs from "fs";
import { makeId, readJsonFile } from "../../services/util.service.js";

const bugs = readJsonFile("data/bugs.json");

export const bugService = {
  query,
  getById,
  remove,
  save,
};

async function query(filterBy) {
  try {
    let sortedBugs = bugs;
    if (filterBy.sortBy) {
      switch (filterBy.sortBy) {
        case "createdAt":
          sortedBugs = sortedBugs.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
        case "title":
          sortedBugs = sortedBugs.sort((a, b) =>
            a.title.localeCompare(b.title)
          );
          break;
        case "severity":
          sortedBugs = sortedBugs.sort((a, b) => a.severity - b.severity);
          break;
      }
    } else {
      sortedBugs = sortedBugs.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
    if (filterBy.txt) {
      const searchText = filterBy.txt.trim();
      const regex = new RegExp(searchText, "i");
      sortedBugs = sortedBugs.filter((bug) => regex.test(bug.title));
    }
    if (filterBy.minSeverity) {
      sortedBugs = sortedBugs.filter((bug) => {
        return bug.severity >= filterBy.minSeverity;
      });
    }
    if (filterBy.label) {
      sortedBugs = sortedBugs.filter((bug) => {
        return bug.labels.some((label) => label.name === filterBy.label);
      });
    }

    return sortedBugs;
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
      bugToSave.createdAt = Date.now();
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
