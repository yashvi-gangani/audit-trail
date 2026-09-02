const formatDate = (date) => {
  if (!date) return "Unknown time";

  return new Date(date).toLocaleString();
};

const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      <div className="event-card-header">
        <strong>{event.eventType || "UNKNOWN EVENT"}</strong>

        <span>
          Version {event.version ?? "—"}
        </span>
      </div>

      <div className="event-card-time">
        {formatDate(event.createdAt || event.timestamp)}
      </div>

      {event.data && (
        <pre className="event-data">
          {JSON.stringify(event.data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default EventCard;