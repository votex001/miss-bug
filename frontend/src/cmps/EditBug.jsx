import { Modal } from "antd";

export function EditBug({
  onAddBug,
  newBug,
  onChange,
  labelRef,
  onAddLabel,
  deleteLabel,
  onCancel,
  isEdit,
}) {
  return (
    <Modal open closeIcon={false} footer="" className="form-modal reg">
      <section>
        <header>
          <h1>{isEdit ? "Edit" : "Add"} new bug</h1>
        </header>
        <main>
          <form onSubmit={onAddBug} className="add-form">
            <section>
              <p>Title:</p>
              <input
                type="text"
                className="title"
                required
                value={newBug?.title}
                onChange={onChange}
              />
            </section>
            <section>
              <p>Severity:</p>
              <input
                type="number"
                className="severity"
                required
                value={newBug?.severity}
                onChange={onChange}
              />
            </section>
            <section>
              <p>Label:</p>
              <input type="text" className="label" ref={labelRef} />
            </section>
            <button type="button" onClick={onAddLabel}>
            Add Label
            </button>
            {newBug?.labels && (
              <section className="labels">
                {newBug.labels.map((l) => (
                  <section key={l?.id}>
                    <span className="label">{l.name}</span>
                    <span className="delete" onClick={() => deleteLabel(l.id)}>
                      {" "}
                      X
                    </span>
                  </section>
                ))}
              </section>
            )}
            <section>
              <p>Description:</p>
              <textarea
                type="text"
                className="description"
                required
                value={newBug?.description}
                onChange={onChange}
                rows={4}
              />
            </section>
            <div>
              <button>{isEdit ? "Edit" : "Add"}</button>
              <button type="button" className="close-btn" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </form>
        </main>
      </section>
    </Modal>
  );
}
