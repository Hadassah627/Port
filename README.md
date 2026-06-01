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

## Seed an admin user

Use the helper script to create or update the admin profile record in Firestore:

```bash
npm install
set FIREBASE_PROJECT_ID=your-project-id
set GOOGLE_APPLICATION_CREDENTIALS=path\\to\\service-account.json
npm run seed:admin -- --uid=your-auth-uid --email=you@example.com --displayName="Admin"
```

You can also pass `ADMIN_UID`, `ADMIN_EMAIL`, and `ADMIN_DISPLAY_NAME` as environment variables.

## Deployment

- Build: `npm run build`
- Host on Firebase Hosting using `firebase.json`
- Deploy: `firebase deploy`
