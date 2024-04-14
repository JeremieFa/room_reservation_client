# Room reservation (Test for beebryte)

## Disclaimer

This is a test project for a job application. It is not meant to be used in production, and it is not meant to be a complete solution. Moreover, i'm not used to use React.

## Description

This is a (really) simple room reservation app. It allows users to reserve rooms for a certain period of time (only between "round" hours). The project allows users to log in through JWT tokens and to create, read or delete reservations. The project is split into two parts: the frontend (this repository) and the backend (https://github.com/JeremieFa/room_reservation_server).

This project uses React with Vite, https://vitejs.dev/guide/

## Usage

To run the project, you need to have Node.js installed. You can then run the following commands:

```bash
npm install
npm run dev
```

For the project to work, you need to have the backend running. You can find the instructions to run the backend in the backend repository.

For building the project, you can run:

```bash
npm run build
```

⚠️ You need a web server to serve the builded files for example with python: `python -m http.server` in the `dist` folder. Be careful to the port used by the webserver, he must be the same as the one allowed by the backend. (see ALLOWED_HOSTS in the backend).

For testing the project, you can run:

```bash
npm run test
```

## Backend

The backend is available at https://github.com/JeremieFa/room_reservation_server
