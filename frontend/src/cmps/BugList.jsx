import { Link } from "react-router-dom";
import { BugPreview } from "./BugPreview";

export function BugList({ bugs, onRemoveBug, onEditBug, user }) {
  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          {user && (user.id === bug.ownerId || user.isAdmin) && (
            <div>
              <button
                onClick={() => {
                  onRemoveBug(bug._id);
                }}
              >
                x
              </button>
              <button
                onClick={() => {
                  onEditBug(bug);
                }}
              >
                Edit
              </button>
            </div>
          )}
          <Link to={`/bug/${bug._id}`}>Details</Link>
          <Link to={`http://localhost:3030/api/bug/${bug._id}/download`}>
            Download
          </Link>
        </li>
      ))}
    </ul>
  );
}
