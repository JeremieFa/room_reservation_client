import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "bulma-toast";

import client from "@/client";
import {
  ReservationModalCreation,
  ReservationModalDeletion,
} from "@/components/reservation";
import { RoomAvailability } from "@/components/room";
import { dateToYYYYMMDD, getFirstDateAllowedToReserve } from "@/utils";
import { useAuth, useReservations } from "@/hooks";


export const RoomsAvailabilitiesPage = () => {
  const { token } = useAuth();
  const { rooms, setRooms } = useReservations();
  const [currentSelectedRoomId, setCurrentSelectedRoomId] = useState(null);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const firstDayAllowedToReserve = getFirstDateAllowedToReserve();
  const [date, setDate] = useState(dateToYYYYMMDD(firstDayAllowedToReserve));


  const filterRooms = useCallback(() => {
    if (currentSelectedRoomId) {
      setFilteredRooms(rooms.filter((room) => {
        return room.id === parseInt(currentSelectedRoomId)
      }));
    } else {
      setFilteredRooms(rooms);
    }
  }, [currentSelectedRoomId, rooms]) // Add an empty array as the second argument to useCallback

  const getRoomsAvailability = useCallback(async (date, token) => {
    let fetchedRooms = [];
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(0, 0, 0, 0);
    endDate.setDate(endDate.getDate() + 1);
    setLoading(true);
    try {
      fetchedRooms = await client.get(
        `rooms/all-rooms-reservations?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`,
        token
      );
    } catch (err) {
      toast({
        message: `<p class="p-2 mr-4">${err.message}<p>`,
        type: "is-danger",
        position: "top-center",
        closeOnClick: true,
        dismissible: true,
      });
    }
    setLoading(false);
    setRooms(fetchedRooms);
    filterRooms();
  }, []);

  function addDays(days) {
    return () => {
      const newDate = new Date(
        date ?? dateToYYYYMMDD(firstDayAllowedToReserve)
      );
      newDate.setDate(newDate.getDate() + days);
      setDate(dateToYYYYMMDD(newDate));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await getRoomsAvailability(date, token.access_token)
  }

  // launch getRoomsAvailability when auth (token) or date change
  useEffect(() => {
    if (token && date) {
      getRoomsAvailability(date, token.access_token);
    }
  }, [date, getRoomsAvailability, token]);

  // launch filterRooms when rooms or currentSelectedRoomId change
  useEffect(() => {
    filterRooms();
  }, [rooms, currentSelectedRoomId, filterRooms]);

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1>Reservation Page</h1>
      <form
        onSubmit={handleSubmit}
        className="is-flex is-flex-direction-column gap-2 mb-4">
        <div className="field">
          <div className="select">
            <select onChange={(e) => setCurrentSelectedRoomId(e.target.value)}>
              <option value="">Select a room</option>
              {rooms.map((room) => {
                return (
                  <option
                    key={room.id}
                    value={room.id}>
                    {room.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button"
              onClick={addDays(-1)}>
              <div className="icon">
                <i className="fas fa-chevron-left"></i>
              </div>
            </button>
          </div>
          <div className="control">
            <input
              className="input"
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="control">
            <button
              type="button"
              className="button"
              onClick={addDays(1)}>
              <div className="icon">
                <i className="fas fa-chevron-right"></i>
              </div>
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button"
              onClick={() => getRoomsAvailability(date, token.access_token)}>
              <div className="icon">
                <i className="fas fa-refresh"></i>
              </div>
            </button>
          </div>
        </div>
      </form>
      <ReservationModalCreation />
      <ReservationModalDeletion />

      {loading && (
        <progress className="progress is-small is-primary" max="100">
          15%
        </progress>
      )}

      <div className="room-reservations">
        {filteredRooms.map((room) => (
          <RoomAvailability
            key={room.id}
            date={date}
            roomData={room}
          />
        ))}
        {
        !loading && filteredRooms.length === 0 &&
        <div className="notification is-warning">
          No rooms available for this date
        </div>
      }
      </div>
    </div>
  );
};
