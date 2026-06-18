const STATUS_STYLES = {
  New: "badge--new",
  Contacted: "badge--contacted",
  Converted: "badge--converted",
};

function StatusBadge({ status }) {
  return (
    <span className={`badge ${STATUS_STYLES[status] || "badge--new"}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
