import { useState, useEffect, useCallback } from "react";
import { useAuth, useReservations } from "@/hooks";
import {ReservationModalDeletion} from "@/components/reservation";
import client from "@/client";

export const UserReservationPage = () => {
  const [reservationPagination, setReservationPagination] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { token } = useAuth();
  const { reservationToDelete, setReservationToDelete } = useReservations();

  const loadUserReservations =  useCallback(async (page = 0, limit = 10) => {
    if (loading) return;
    if (!loading) setLoading(true);
    try {
      const response = await client.get(
        `users/my-reservations?page=${page}&limit=${limit}`,
        token.access_token
      );
      const reservations = [];

      for (const element of response.reservations) {
        const reservation = element;
        reservation.can_be_deleted =
          new Date(reservation.end_date) > new Date();

        reservation.start_date = new Date(
          reservation.start_date
        ).toLocaleDateString(undefined, {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
        reservation.end_date = new Date(
          reservation.end_date
        ).toLocaleDateString(undefined, {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });

        reservations.push(reservation);
      }

      setReservationPagination({
        reservations,
        total: response.total,
        page: response.page,
        limit: response.limit,
      });
    } catch (error) {
      setError(error.message);
      setReservationPagination([]);
    }
    setLoading(false);
  }, [])

  // // Load user details on component mount
  useEffect(() => {
    if(reservationToDelete === null)
    loadUserReservations();
  }, [token, reservationToDelete, loadUserReservations]);

  return (
    <div className="container">
      {error && (
        <div className="notification is-danger">
          <button
            className="delete"
            onClick={() => setError(false)}></button>
          {error}.
        </div>
      )}
      {loading && (
        <progress
          className="progress is-small is-primary"
          max="100">
          15%
        </progress>
      )}
      <h2>My Reservations</h2>
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Room Name</th>
            <th>Reservation start</th>
            <th>Reservation end</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reservationPagination?.reservations?.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.room.name}</td>
              <td>{reservation.start_date}</td>
              <td>{reservation.end_date}</td>
              <td>
                <button
                  disabled={!reservation.can_be_deleted}
                  className="button is-danger"
                  onClick={() => setReservationToDelete(reservation)}>
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {reservationPagination.total === 0 && <div>No reservations found</div>}

      <div className="pagination is-flex is-justify-content-center gap-2">
        {reservationPagination.page > 0 && (
          <button
            className="button"
            onClick={() =>
              loadUserReservations(
                reservationPagination.page - 1,
                reservationPagination.limit
              )
            }>
            Previous
          </button>
        )}
        <div>
          {reservationPagination.page + 1} /{" "}
          {Math.ceil(reservationPagination.total / reservationPagination.limit)}
        </div>
        {reservationPagination.total >
          (reservationPagination.page + 1) * reservationPagination.limit && (
          <button
            className="button"
            onClick={() =>
              loadUserReservations(
                reservationPagination.page + 1,
                reservationPagination.limit
              )
            }
            disabled={
              reservationPagination.page * reservationPagination.limit >=
              reservationPagination.total
            }>
            Next
          </button>
        )}
      </div>

      <ReservationModalDeletion />
    </div>
  );
};
