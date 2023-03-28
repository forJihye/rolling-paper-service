import admin, { ServiceAccount } from 'firebase-admin';
import { App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps.length) {
  admin.initializeApp({
    // https://firebase.google.com/docs/admin/setup#initialize-sdk
    credential: admin.credential.cert({
      type: process.env.FIREBASE_ADMIN_TYPE,
      project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
      private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
      private_key: (process.env.FIREBASE_ADMIN_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
      auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
      token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
    } as ServiceAccount),
  });
}
const app = admin.apps[0] as App
const db = getFirestore(app);
export { app, db };

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: credential.cert(serviceAccount as ServiceAccount)
//   });  
// }
// const app = admin.apps[0] as App;
// const db = getFirestore(app);
// export {app, db};