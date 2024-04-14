import { useState } from "react";
import classNames from "classnames";
import { Navigate } from "react-router-dom";
import { toast } from "bulma-toast";

import { useAuth } from "@/hooks";
import client from "@/client";

export const LoginPage = () => {
  // auto redirect to reservations if user is already logged in
  const { login, token } = useAuth();

  // form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // loading state
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    let result = null;
    try {
      result = await client.post(
        "api/auth/",
        { email: email, password: password },
        false
      );
      login(result);
    } catch (err) {
      toast({
        position: "top-center",
        message: `<p class="mr-2 p-2">${err.message}</p>`,
        type: "is-danger",
        dismissible: true,
        pauseOnHover: true,
      });
      setError();
    }
    setLoading(false);
  }

  if (token !== null) {
    return <Navigate to="/rooms-availabilities" />;
  }

  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-5-tablet is-4-desktop is-3-widescreen card">
          <form
            onSubmit={handleSubmit}
            className="is-flex is-flex-direction-column gap-2">
            <div className="field">
              <label
                htmlFor="email"
                className="label">
                Email
              </label>
              <div className="control has-icons-left">
                <input
                  className={classNames("input", { "is-danger": error })}
                  type="email"
                  placeholder="Email"
                  value={email}
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-envelope"></i>
                </span>
              </div>
            </div>
            <div className="field">
              <label
                htmlFor="password"
                className="label">
                Password
              </label>
              <div className="control has-icons-left">
                <input
                  className={classNames("input", { "is-danger": error })}
                  type="password"
                  placeholder="Password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-lock"></i>
                </span>
              </div>
            </div>

            {error && <div className="notification is-danger">{error}</div>}
            <div className="field">
              <button
                disabled={loading}
                className={classNames(
                  "button",
                  "is-success",

                  {
                    "is-loading": loading,
                  }
                )}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
