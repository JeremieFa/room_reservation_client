import { useEffect, useState } from "react";
import { useAuth, useReservations } from "@/hooks";


export const ReservationModalCreation = () => {
  const { token } = useAuth();
  const {
    reservation,
    cancelReservationCreation,
    validateReservation,
    reservationValidationLoading,
    reservationValidationError,
  } = useReservations();

  // form datas
  const [startHour, setStartHour] = useState(
    reservation ? reservation.startHour : 0
  );

  const [endHour, setEndHour] = useState(reservation ? reservation.endHour : 0);
  const [currentDate, setCurrentDate] = useState(new Date());
  useEffect(() => {
    if (reservation) {
      setStartHour(reservation.startHour);
      setEndHour(reservation.endHour);
      setCurrentDate(new Date(reservation.date));
    }
  }, [reservation]);

  const disponibleHours = Array.from({ length: 24 }, (_, i) => {
    const dateAtHour = new Date(currentDate);
    dateAtHour.setHours(i);

    return {
      value: i,
      label: i.toString().padStart(2, "0") + (i > 12 ? " PM" : " AM"),
      available:
        reservation?.unavailableHours?.indexOf(i) === -1 &&
        dateAtHour > new Date(),
    };
  });

  const handleClose = () => {
    if (reservationValidationLoading) return;
    cancelReservationCreation(null);
  };
  const handleSubmit = () => {
    //  check if the start hour is less than the end hour
    if (reservationValidationLoading) return;
    validateReservation(
      {
        ...reservation,
        ...{
          startHour,
          endHour,
        },
      },
      token.access_token
    );
  };

  function setStart(e) {
    setStartHour(e.target.value);
    reservation.startHour = e.target.value;
  }

  function setEnd(e) {
    setEndHour(e.target.value);
    reservation.endHour = e.target.value;
  }

  return (
    <div className={reservation !== null ? "modal is-active" : "modal"}>
      <button
        className="modal-background is-not-clickable-cursor"
        onClick={handleClose}></button>
      <div className="modal-card">
        <header className="modal-card-head">
          <div className="modal-card-title">Create reservation</div>
          <button
            onClick={handleClose}
            className="delete"
            aria-label="close"></button>
        </header>
        <section className="modal-card-body">
          {reservationValidationError && (
            <div className="notification is-danger mb-4">
              {reservationValidationError}
            </div>
          )}
          {reservationValidationLoading && (
            <progress
              className="progress is-small is-primary"
              max="100">
              15%
            </progress>
          )}
          {!reservationValidationLoading && reservation && (
            <>
              <p>
                Reservartion of the room{" "}
                <span className="has-text-weight-bold">{reservation.name}</span>{" "}
                on{" "}
                <span className="has-text-weight-bold">
                  {currentDate.toLocaleDateString()}
                </span>{" "}
                .
              </p>
              <form>
                <div className="field">
                  {reservation.editable && (
                    <label
                      className="label"
                      htmlFor="start-hour-input">
                      Select your hours range (end hour is included)
                    </label>
                  )}
                  <div className="control pt-4">
                    <div className="select mr-2 mb-4 is-fullwidth-mobile">
                      <select
                        id="start-hour-input"
                        disabled={!reservation.editable}
                        defaultValue={reservation?.startHour}
                        onChange={(e) => setStart(e)}>
                        {disponibleHours.map((hour) => (
                          <option
                            disabled={!hour.available}
                            key={hour.value}
                            value={hour.value}>
                            {hour.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="select is-fullwidth-mobile">
                      <select
                        disabled={!reservation.editable}
                        defaultValue={reservation?.endHour}
                        onChange={(e) => setEnd(e)}>
                        {disponibleHours.map((hour) => (
                          <option
                            disabled={!hour.available}
                            key={hour.value}
                            value={hour.value}>
                            {hour.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}
        </section>
        <footer className="modal-card-foot">
          <div className="buttons">
            <button
              disabled={reservationValidationLoading}
              onClick={handleSubmit}
              className={
                "button is-primary " +
                (reservationValidationLoading && "is-loading")
              }>
              Validate the reservation
            </button>
            <button
              disabled={reservationValidationLoading}
              onClick={handleClose}
              className="button">
              Cancel
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
