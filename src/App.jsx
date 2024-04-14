import { Routes, Route } from "react-router-dom";

import { LoginPage } from "@/pages/LoginPage";
import { UserReservationPage } from "@/pages/UserReservationPage";

import { AuthProvider, ReservationProvider } from "@/hooks";

import "./styles/App.sass";

import { MainNavBar } from "@/components/MainNavBar";
import { RoomsAvailabilitiesPage } from "@/pages/RoomsAvailabilitiesPage";
import { QuickReservationPage } from "@/pages/QuickReservationPage";

function App() {
  return (
    <AuthProvider>
      <MainNavBar />
      <ReservationProvider>
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={<LoginPage />}
            />
            <Route
              path="/quick-reservation"
              element={<QuickReservationPage />}
            />
            <Route
              path="/my-reservations"
              element={<UserReservationPage />}
            />
            <Route
              path="/rooms-availabilities"
              element={<RoomsAvailabilitiesPage />}
            />
          </Routes>
        </div>
      </ReservationProvider>
    </AuthProvider>
  );
}

export default App;
