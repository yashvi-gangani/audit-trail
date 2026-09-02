import EventCard from "./EventCard";

const EventTimeline = ({ events = [], loading = false }) => {
  if (loading) {
    return (
      <div className="empty">
        Loading event history...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="empty">
        No events available for this shipment.
      </div>
    );
  }

  return (
    <div className="event-timeline">
      {events.map((event) => (
        <EventCard
          key={`${event.aggregateId}-${event.version}`}
          event={event}
        />
      ))}
    </div>
  );
};

export default EventTimeline;