import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "bulma-toast";
import { PropTypes } from "prop-types";

import client from "@/client";
import { ReservationContext } from "./ReservationContext";

const ReservationProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [reservationToDelete, setReservationToDelete] = useState(null);

  const [reservationValidationLoading, setReservationValidationLoading] =
    useState(false);
  const [reservationValidationError, setReservationValidationError] =
    useState(null);


  const removeReservationFromRoom = useCallback(async (roomId, reservationId) => {
    const newRooms = rooms.map((room) => {
      if (room.id === roomId) {
        room.reservations = room.reservations.filter(
          (reservation) => reservation.id !== reservationId
        );
      }
      return room;
    });
    setRooms(newRooms);
  }, [rooms]);

  const addReservationToRoom = useCallback(async (roomId, reservation) => {
    const newRooms = rooms.map((room) => {
      if (room.id === roomId) {
        room.reservations.push({
          ...reservation,
          user: {
            id: reservation.user.id,
            name: reservation.user.name,
          },
        });
      }
      return room;
    });
    setRooms(newRooms);
  }, [rooms]);

  const validateReservation = useCallback(async (reservation, token) => {
    setReservationValidationError(null);
    const url = `rooms/${reservation.id}/create-reservation?timezone=${
      Intl.DateTimeFormat().resolvedOptions().timeZone
    }`;

    const startHour = parseInt(reservation.startHour);
    const endHour = parseInt(reservation.endHour) + 1;
    if (startHour >= endHour) {
      setReservationValidationError("End hour must be greater than start hour");
      return;
    }
    // check if reservation intervale is available
    const notAvailableHours = reservation.unavailableHours.filter(
      (hour) => hour >= startHour && hour < endHour
    );

    if (notAvailableHours.length > 0) {
      setReservationValidationError(
        `The room is not available in the selected interval (hours not available: ${notAvailableHours
          .map(
            (hour) =>
              hour.toString().padStart(2, "0")+':00'
          )
          .join(", ")})`
      );
      return;
    }

    setReservationValidationLoading(true);

    const startDate = new Date(reservation.date);
    startDate.setHours(reservation.startHour);

    const endDate = new Date(reservation.date);

    endDate.setHours(parseInt(reservation.endHour) + 1);

    const requestData = {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    };
    try {
      const response = await client.post(url, requestData, token);
      setReservation(null);
      addReservationToRoom(reservation.id, response);
      setReservationValidationError(null);
      setReservationValidationLoading(false);

      toast({
        message: `<p class="p-2 mr-4">Reservation of the room <b>${response.room.name}</b> created successfully!<p>`,
        type: "is-success",
        position: "top-center",
        closeOnClick: true,
        dismissible: true,
      });

      return response;
    } catch (error) {
      setReservationValidationLoading(false);
      setReservationValidationError(error.message);
      console.error(error);
    }
  }, [addReservationToRoom]);

  const initReservation = (
    roomName,
    roomId,
    date,
    hour,
    endHour = null,
    unavailableHours = [],
    editable = true
  ) => {
    setReservation({
      name: roomName,
      id: roomId,
      date,
      startHour: hour,
      unavailableHours,
      endHour: endHour ?? hour,
      editable,
    });
  }

  const cancelReservationCreation = () => {
    setReservation(null);
  }

  useEffect(() => {
    if (reservation === null) {
      setReservationValidationError(null);
    }
  }, [reservation]);

  const value = useMemo(
    () => ({
      rooms,
      setRooms,
      reservation,
      reservationToDelete,
      reservationValidationLoading,
      reservationValidationError,
      setReservationToDelete,
      initReservation,
      cancelReservationCreation,
      validateReservation,
      removeReservationFromRoom,
    }),
    [rooms, reservation, reservationToDelete, reservationValidationLoading, reservationValidationError, validateReservation, removeReservationFromRoom]
  );
  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};

ReservationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export {
  ReservationProvider,
}