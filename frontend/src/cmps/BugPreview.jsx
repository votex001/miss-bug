export function BugPreview({ bug }) {
  return (
    <article>
      <h4>{bug.title}</h4>
      <h1>🐛</h1>
      <p>
        Severity: <span>{bug.severity}</span>
      </p>
      {bug.labels && (
        <section className="labels">
          {bug?.labels?.map((l) => (
            <span className="label" key={l.id}>
              {l.name}
            </span>
          ))}
        </section>
      )}
    </article>
  );
}
