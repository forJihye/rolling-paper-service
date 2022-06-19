import { createFirebaseCustomTokenHandler } from "@lowfront/firebase-adapter";
import { db } from "lib/firebase-admin";

export default createFirebaseCustomTokenHandler({
  db, // Cloud Firestore or Realtime Database Initialized with Firebase admin SDK
  // additionalClaims: (session) => ({}), // Additional data required by the database rule can be inserted : https://firebase.google.com/docs/auth/admin/create-custom-tokens#sign_in_using_custom_tokens_on_clients
});
