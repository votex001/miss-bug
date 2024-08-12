import { bugService } from "../services/bug.service.js";
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";
import { BugList } from "../cmps/BugList.jsx";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { Modal } from "antd";
import { utilService } from "../services/util.service.js";
import { EditBug } from "../cmps/EditBug.jsx";

export function BugIndex({ user }) {
  const [bugs, setBugs] = useState([]);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const labelRef = useRef(null);
  const [newBug, setNewBug] = useState({
    title: "",
    severity: "",
    labels: [],
    description: "",
  });
  useEffect(() => {
    loadBugs();
  }, []);

  async function loadBugs() {
    const bugs = await bugService.query();
    setBugs(bugs);
  }
  function onChange(e) {
    setNewBug((prev) => ({ ...prev, [e.target.className]: e.target.value }));
  }
  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId);
      console.log("Deleted Succesfully!");
      setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId));
      showSuccessMsg("Bug removed");
    } catch (err) {
      console.log("Error from onRemoveBug ->", err);
      showErrorMsg("Cannot remove bug");
    }
  }

  async function onAddBug(e) {
    e.preventDefault();
    const bug = {
      ownerId: user.id,
      ...newBug,
    };
    console.log(bug);
    try {
      const savedBug = await bugService.save(bug);
      console.log("Added Bug", savedBug);
      if (!bug._id) {
        setBugs((prevBugs) => [...prevBugs, savedBug]);
        showSuccessMsg("Bug added");
      } else {
        setBugs((prevBugs) =>
          prevBugs.map((prevBug) => (prevBug._id === bug._id ? bug : prevBug))
        );
        showSuccessMsg("Bug updated");
      }
      onCancel();
    } catch (err) {
      if (bug._id) {
        console.log("Error from onEditBug ->", err);
        showErrorMsg("Cannot update bug");
      } else {
        console.log("Error from onAddBug ->", err);
        showErrorMsg("Cannot add bug");
      }
    }
  }
  function onAddLabel() {
    const newLabel = {
      id: utilService.makeId(),
      name: labelRef.current.value,
    };
    if (labelRef.current.value.length > 0) {
      setNewBug((prev) => {
        return { ...prev, labels: [...newBug.labels, newLabel] };
      });
    }
  }
  useEffect(() => {
    if (labelRef.current) {
      labelRef.current.value = "";
    }
  }, [newBug?.labels, labelRef]);

  async function onEditBug(bug) {
    setNewBug(bug);
    setAddIsOpen(true);
    setIsEdit(true);
  }
  function onCancel() {
    setAddIsOpen(false);
    setIsEdit(false);
    setNewBug({
      title: "",
      severity: "",
      labels: [],
      description: "",
    });
  }
  function deleteLabel(id) {
    setNewBug((prev) => ({
      ...prev,
      labels: prev.labels.filter((label) => label.id !== id),
    }));
  }
  return (
    <main className="bug-index">
      <h3>Bugs App</h3>
      <main>
        {user && (
          <button
            className="add-btn"
            onClick={() => {
              setAddIsOpen(true);
            }}
          >
            Add Bug ⛐
          </button>
        )}
        <BugList
          bugs={bugs}
          onRemoveBug={onRemoveBug}
          onEditBug={onEditBug}
          user={user}
        />
        {addIsOpen && (
          <EditBug
            onAddBug={onAddBug}
            newBug={newBug}
            onChange={onChange}
            labelRef={labelRef}
            onAddLabel={onAddLabel}
            deleteLabel={deleteLabel}
            onCancel={onCancel}
            isEdit={isEdit}
            onEdit={onEditBug}
          />
        )}
      </main>
    </main>
  );
}
