import { useEffect, useState } from "react";
import { useAuth, useReservations } from "@/hooks";
import { ReservationModalCreation } from "@/components/reservation";
import client from "@/client";

import {
  getFirstDateAllowedToReserve,
  getFirstHourAllowedToReserve,
  dateToYYYYMMDD,
  getHoursSelectList,
} from "@/utils";

export const QuickReservationPage = () => {
  const { token } = useAuth();
  const { initReservation, reservation } = useReservations();
  const [date, setDate] = useState(
    dateToYYYYMMDD(getFirstDateAllowedToReserve())
  );
  const [firstHourAllowedToReserve, setFirstHourAllowedToReserve] = useState(getFirstHourAllowedToReserve(getFirstDateAllowedToReserve()));
  const [startHour, setStartHour] = useState(firstHourAllowedToReserve);
  const [endHour, setEndHour] = useState(firstHourAllowedToReserve);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hours = getHoursSelectList();

  async function searchRoom(e) {
    e.preventDefault();
    setError(null);
    const startDate = new Date(date);
    startDate.setHours(startHour);

    const endDate = new Date(date);
    endDate.setHours(parseInt(endHour) + 1);

    if (startDate >= endDate) {
      setError("End hour must be greater than start hour");
      setAvailableRooms([]);
      return;
    }

    setLoading(true);

    let response = null;
    try {
      response = await client.get(
        `rooms/availables?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`,
        token.access_token
      );
      setAvailableRooms(response);
    } catch (err) {
      setAvailableRooms([]);
      setError(err.message);
    }

    setLoading(false);
  }

  function initQuickCreation(room) {
    initReservation(room.name, room.id, date, startHour, endHour, [], false);
  }

  function updateDate(e) {
    setDate(e.target.value);

    const newFirstHourAllowedToReserve = getFirstHourAllowedToReserve(new Date(e.target.value));
    setFirstHourAllowedToReserve(newFirstHourAllowedToReserve);
    setStartHour(Math.max(newFirstHourAllowedToReserve, 8));
    setEndHour(Math.max(newFirstHourAllowedToReserve, 8));
  }

  useEffect(() => {
    // clean up list after reservation
    if (!reservation) {
      setAvailableRooms([]);
    }
  }, [reservation]);

  return (
    <div className="quick-reservation">
      <h1>Quick Reservation</h1>
      <p>
        This is a quick reservation page. You can use this page to quickly
        reserve a room for a specific date and time.
      </p>

      <form
        className="form"
        onSubmit={searchRoom}>
        {error && <div className="notification is-danger m-4">{error}</div>}
        <div className="field is-grouped is-flex is-flex-wrap-wrap">
          <label
            className="label"
            htmlFor="date-input">
            Date
          </label>
          <div className="control">
            <input
              min={new Date().toISOString().split("T")[0]}
              id="date-input"
              name="date-input"
              className="input"
              type="date"
              value={date}
              onChange={updateDate}
              required
            />
          </div>

          <label
            className="label"
            htmlFor="start-hour-input">
            Start Hour
          </label>
          <div className="control">
            <div className="select">
              <select
                id="start-hour-input"
                name="start-hour-input"
                value={startHour}

                onChange={(e) => setStartHour(e.target.value)}
                required>
                {hours.map((hour) => (
                  <option
                    disabled={firstHourAllowedToReserve > hour.value}
                    key={hour.value}
                    value={hour.value}>
                    {hour.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label
            className="label"
            htmlFor="end-hour-input">
            End Hour (inclusive)
          </label>
          <div className="control">
            <div className="select">
              <select
                id="end-hour-input"
                name="end-hour-input"
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
                required>
                {hours.map((hour) => (
                  <option
                    key={hour.value}
                    value={hour.value}>
                    {hour.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="control">
            <button className="button is-primary">Search a room</button>
          </div>
        </div>
      </form>

      {loading && <progress className="progress is-primary" />}

      <div className="quick-reservation-rooms">
        {availableRooms.map((room) => (
          <button
            onClick={() => initQuickCreation(room)}
            className="room"
            key={room.id}>
            {room.name}
          </button>
        ))}
      </div>

      <ReservationModalCreation />
    </div>
  );
};
