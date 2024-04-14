const API_URL =
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === "production"
    ? "https://api.example.com/" // Production URL
    : "http://localhost:8000/";

export { API_URL };
