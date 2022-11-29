import admin, { credential, ServiceAccount } from 'firebase-admin';
import { App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from 'serviceAccountKey.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: credential.cert(serviceAccount as ServiceAccount)
  });  
}

const app = admin.apps[0] as App;
const db = getFirestore(app);

export {app, db};




