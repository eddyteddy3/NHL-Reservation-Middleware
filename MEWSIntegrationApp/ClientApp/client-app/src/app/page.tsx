"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Reservation {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  status: string;
  email: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    fetch("/mockReservationData.json")
        .then((res) => res.json())
        .then((data) => setReservations(data));
  }, []);

  return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Reservations</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservations.map((res) => (
              <Card key={res.id} className="shadow-lg">
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold">{res.guestName}</h2>
                  <p>Room: {res.roomType}</p>
                  <p>Check-in: {res.checkIn}</p>
                  <p>Check-out: {res.checkOut}</p>
                  <p>Status: {res.status}</p>
                </CardContent>
              </Card>
          ))}
        </div>
      </div>
  );
}