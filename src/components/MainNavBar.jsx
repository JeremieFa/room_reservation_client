import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks";
import classNames from "classnames";

export const MainNavBar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  function navigateAndClose(path) {
    setActiveKey(null);
    navigate(path);
  }

  const [activeKey, setActiveKey] = useState(null);
  return (
    <div className="navbar is-dark">
      <div className="navbar-brand">
        <button
          className={classNames('navbar-burger', 'burger', {"is-active" :activeKey })}
          onClick={() => setActiveKey(!activeKey)}>
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className={classNames("navbar-menu",  {"is-active" :activeKey })}>
        <div className="navbar-start">
          {token && (
            <>
              <button
                className="navbar-item"
                onClick={() => navigateAndClose("/rooms-availabilities")}>
                Rooms availabilities
              </button>
              <button
                className="navbar-item"
                onClick={() => navigateAndClose("/quick-reservation")}>
                Quick reservation
              </button>
              <button
                className="navbar-item"
                onClick={() => navigateAndClose("/my-reservations")}>
                My Reservations
              </button>
            </>
          )}
        </div>
        <div className="navbar-end">
          {token && (
            <button
              className="navbar-item"
              onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
