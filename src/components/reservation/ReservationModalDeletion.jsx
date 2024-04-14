import { useState } from "react";
import { useAuth, useReservations } from "@/hooks";

import client from "@/client";
import { toast } from "bulma-toast";

export const ReservationModalDeletion = () => {
  const { token } = useAuth();
  const {
    reservationToDelete,
    setReservationToDelete,
    removeReservationFromRoom,
  } = useReservations();
  const [loading, setLoading] = useState(false);
  function handleClose() {
    setReservationToDelete(null);
  }

  async function handleSubmit() {
    if (loading) return;
    setLoading(true);
    try {
      await client.delete(
        "room-reservations/" + reservationToDelete.id,
        token.access_token
      );
      toast({
        message: `<p class="p-2 mr-4">Reservation deleted</p>`,
        type: "is-success",
        position: "top-center",
        dismissible: true,
        pauseOnHover: true,
      });
      removeReservationFromRoom(
        reservationToDelete.room.id,
        reservationToDelete.id
      );
      handleClose();
    } catch (error) {
      toast({
        position: "top-center",
        message: `<p class="p-2 mr-4">${error.message}</p>`,
        type: "is-danger",
        dismissible: true,
        pauseOnHover: true,
      });
      console.error(error);
    }
    setLoading(false);
  }

  const startDate = new Date(
    reservationToDelete?.start_date
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  const endDate = new Date(reservationToDelete?.end_date).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }
  );

  return (
    <div className={reservationToDelete !== null ? "modal is-active" : "modal"}>
      <button
        className="modal-background is-not-clickable-cursor"
        onClick={handleClose}></button>
      <div className="modal-card">
        <header className="modal-card-head">
          <div className="modal-card-title">Cancel reservation</div>
          <button
            onClick={handleClose}
            className="delete"
            aria-label="close"></button>
        </header>
        <section className="modal-card-body">
          {loading && (
            <progress
              className="progress is-small is-primary"
              max="100">
              15%
            </progress>
          )}
          <div className="notification is-danger mb-4">
            <p>Are you sure you want to delete the following reservation?</p>
            <p>
              <strong>Room:</strong> {reservationToDelete?.room?.name}
            </p>
            <p>
              <strong>Start date:</strong> {startDate}
            </p>
            <p>
              <strong>End date:</strong> {endDate}
            </p>
          </div>
        </section>
        <footer className="modal-card-foot">
          <div className="buttons">
            <button
              onClick={handleSubmit}
              className={"button is-danger " + (loading && "is-loading")}>
              Cancel the reservation
            </button>
            <button
              disabled={loading}
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
