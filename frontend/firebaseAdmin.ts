import {initializeApp, apps, credential} from 'firebase-admin';
import { App } from 'firebase-admin/app';
import serviceAccount from 'serviceAccountKey.json';

// let firebaseAdmin: App;
// if (!apps.length) {
const firebaseAdmin = initializeApp({
  credential: credential.cert({
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    projectId: serviceAccount.project_id,
  }),
  databaseURL: 'https://your-rolling-paper.firebaseio.com',
});  
// }

export { firebaseAdmin };
