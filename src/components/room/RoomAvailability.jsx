import { PropTypes } from "prop-types";
import { useAuth, useReservations } from "@/hooks";
import className from "classnames";


export const RoomAvailability = ({ roomData, date }) => {
  const { initReservation, setReservationToDelete } = useReservations();
  const { token } = useAuth();
  function processHours(reservations) {
    const allHours = [];
    for (let i = 0; i < 24; i++) {
      allHours.push({
        hour: i,
        available: true,
        isUserReservation: false,
        reservation: null,
      });
    }

    reservations.forEach((reservation) => {
      // start_date and end_date are strings of date in UTC format
      const startDate = new Date(reservation.start_date);
      const endDate = new Date(reservation.end_date);
      // we take all the hours between the start and end date
      while (startDate < endDate) {
        const hour = startDate.getHours();
        if (new Date(date).getDay() === startDate.getDay()) {
          allHours[hour].available = false;
          allHours[hour].isUserReservation =
            reservation.user.id === token.user_id;
          allHours[hour].reservation = reservation;
        }

        startDate.setHours(startDate.getHours() + 1);
      }
    });
    return allHours;
  }

  function isHourDisabled(hour) {
    const dateAtHour = new Date(date);
    dateAtHour.setHours(hour);
    return dateAtHour < new Date();
  }
  const hours = processHours(roomData.reservations);
  const name = roomData.name;
  const id = roomData.id;

  return (
    <div className="room-reservation">
      <div className="room-name">{name}</div>

      <div className="room-reservation-line">
        {hours.map((hourObject) => (
          <button
            disabled={
              isHourDisabled(hourObject.hour) ||
              (!hourObject.available && !hourObject.isUserReservation)
            }
            data-hour={`${hourObject.hour}:00`}
            key={hourObject.hour}
            onClick={() =>
              hourObject.isUserReservation
                ? setReservationToDelete(hourObject.reservation)
                : initReservation(
                    name,
                    id,
                    date,
                    hourObject.hour,
                    hourObject.hour,
                    hours.filter((h) => !h.available).map((h) => h.hour)
                  )
            }
            className={className("hour-slot", {
              available: hourObject.available,
              unavailable:
                !hourObject.available && !hourObject.isUserReservation,
              reserved: hourObject.isUserReservation,
            })}></button>
        ))}
      </div>
    </div>
  );
};

RoomAvailability.propTypes = {
  roomData: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    reservations: PropTypes.array,
  }),
  date: PropTypes.string,
};