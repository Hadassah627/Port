# Faculty Portfolio Website

React + Firebase faculty portfolio for Dr. Abduru Sankara Rao, Ph.D.

## Stack

- React 18
- React Router DOM
- Firebase Auth, Firestore, Storage
- Tailwind CSS
- Framer Motion
- React Icons
- React Query
- React Hook Form

## Setup

1. Copy `.env.example` to `.env` and fill in the Firebase project values.
2. Install dependencies with `npm install`.
3. Start the app with `npm run dev`.

## Firebase collections

- `users`: admin role records keyed by Firebase Auth UID.
- `profile`: single document with ID `main`.
- `research`: research project documents.
- `publications`: publication documents.
- `teaching`: course documents.
- `gallery`: gallery image documents.
- `achievements`: statistic cards.
- `messages`: contact form submissions.
- `settings`: single document with ID `main`.

## Admin access

- Sign in with Firebase Authentication.
- Create a matching `users/{uid}` document with `role: 'admin'`.
- The dashboard only opens when that Firestore user record is present.

## Deployment

- Build: `npm run build`
- Host on Firebase Hosting using `firebase.json`
- Deploy: `firebase deploy`
