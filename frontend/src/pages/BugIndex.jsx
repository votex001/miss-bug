import { bugService } from "../services/bug.service.js";
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";
import { BugList } from "../cmps/BugList.jsx";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { utilService } from "../services/util.service.js";
import { EditBug } from "../cmps/EditBug.jsx";
import { useSearchParams } from "react-router-dom";

export function BugIndex({ user }) {
  const [bugs, setBugs] = useState([]);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [labelsArr, setLabelsArr] = useState([]);
  const labelRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedValue, setSelectedValue] = useState();
  const [searchFilter, setSearchFilter] = useState({
    txt: "",
    minSeverity: "",
    label: 0,
  });
  const [newBug, setNewBug] = useState({
    title: "",
    severity: "",
    labels: [],
    description: "",
  });
  useEffect(() => {
    const sortParams = searchParams.get("sortBy");
    const txt = searchParams.get("txt");
    const severity = searchParams.get("severity");
    const label = searchParams.get("label");
    if (sortParams) {
      setSelectedValue(sortParams);
    }
    setSearchFilter((prev) => {
      if (txt) prev.txt = txt;
      if (severity) prev.minSeverity = severity;
      if (label) prev.label = label;
      return prev;
    });
    const params = {
      sortBy: sortParams,
      txt,
      minSeverity: severity,
      label,
    };

    loadBugs(params);
  }, [searchParams]);

  async function loadBugs(params) {
    const bugs = await bugService.query(params);
    await getLabels();
    setBugs(bugs);
  }
  function onChange(e) {
    setNewBug((prev) => ({ ...prev, [e.target.className]: e.target.value }));
  }
  function onChangeSearch(e) {
    setSearchFilter((prev) => ({
      ...prev,
      [e.target.className]: e.target.value,
    }));
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
  function onSortBy(e) {
    setSelectedValue(e.target.value);
    setSearchParams((prev) => {
      prev.set("sortBy", e.target.value);
      return prev;
    });
  }
  function clearSearchBy() {
    setSearchParams((prev) => {
      prev.delete("txt");
      prev.delete("severity");
      prev.delete("label");
      return prev;
    });
  }
  function onSearchBy(e) {
    e?.preventDefault();
    setSearchParams((prev) => {
      prev.delete("txt");
      prev.delete("severity");
      prev.delete("label");
      if (searchFilter.txt) prev.set("txt", searchFilter.txt);
      if (searchFilter.minSeverity)
        prev.set("severity", searchFilter.minSeverity);
      if (searchFilter.label) prev.set("label", searchFilter.label);

      return prev;
    });
  }
  async function getLabels() {
    const bugs = await bugService.query();
    const labelsSet = new Set();
    bugs.forEach((item) => {
      item.labels?.forEach((label) => {
        labelsSet.add(label.name);
      });
    });
    setLabelsArr(Array.from(labelsSet));
  }

  return (
    <main className="bug-index">
      <h3>Bugs App</h3>
      <main>
        <section>
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
          <section>
            <span>Sort by:</span>
            <select
              defaultValue={"createdAt"}
              onChange={onSortBy}
              value={selectedValue}
            >
              <option value={"createdAt"}>By adding</option>
              <option value={"title"}>By title</option>
              <option value={"severity"}>By severity</option>
            </select>
          </section>
          <form onSubmit={onSearchBy}>
            <span>Search filter:</span>
            <section>
              <input
                className="txt"
                type="text"
                placeholder="Name"
                value={searchFilter.txt}
                onChange={onChangeSearch}
              />
              <input
                className="minSeverity"
                type="number"
                placeholder="Minimal severity"
                value={searchFilter.minSeverity}
                onChange={onChangeSearch}
              />
              {labelsArr && (
                <select
                  value={searchFilter?.label}
                  className="label"
                  onChange={onChangeSearch}
                >
                  <option value={0} disabled>
                    Select label
                  </option>
                  {labelsArr.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              )}
              <button>Search</button>
              <button
                type="button"
                onClick={() => {
                  setSearchFilter({
                    txt: "",
                    minSeverity: "",
                    label: 0,
                  });
                  clearSearchBy();
                }}
              >
                Clear
              </button>
            </section>
          </form>
        </section>

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
