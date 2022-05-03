import {initializeApp, apps, credential} from 'firebase-admin';
import serviceAccount from 'serviceAccountKey.json';

const firebaseAdmin = initializeApp({
  credential: credential.cert({
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    projectId: serviceAccount.project_id,
  }),
  databaseURL: 'https://your-rolling-paper.firebaseio.com',
});  

export { firebaseAdmin };
