import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Event = {
  id: string;
  title: string;
  type: string;
  date: string;
  linked?: string;
};

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("/api/calendar/events")
      .then(res => res.json())
      .then(data => setEvents(data.events || []));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📅 Project Calendar</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map(ev => (
          <Card key={ev.id} className="p-4 shadow rounded-2xl">
            <h2 className="font-semibold">{ev.title}</h2>
            <p className="text-sm text-gray-600">{ev.type}</p>
            <p className="text-sm">📍 {new Date(ev.date).toLocaleString()}</p>
            {ev.linked && (
              <Button asChild className="mt-2">
                <a href={ev.linked} target="_blank" rel="noopener noreferrer">
                  View Linked Doc
                </a>
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
