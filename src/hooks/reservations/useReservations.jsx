import { useContext } from "react";
import { ReservationContext } from "./ReservationContext";
const useReservations = () => {
  return useContext(ReservationContext);
};

export { useReservations };