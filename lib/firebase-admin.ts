import admin, { credential, ServiceAccount } from 'firebase-admin';
import { App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from 'serviceAccountKey';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: credential.cert({
      type: 'service_account',
      project_id: serviceAccount.project_id,
      private_key_id: serviceAccount.private_key_id,
      private_key: serviceAccount.private_key,
      client_email: serviceAccount.client_email,
      client_id: serviceAccount.client_id,
      auth_uri: serviceAccount.auth_uri,
      token_uri: serviceAccount.token_uri,
      auth_provider_x509_cert_url: serviceAccount.auth_provider_x509_cert_url,
      client_x509_cert_url: serviceAccount.client_x509_cert_url,
    } as ServiceAccount)
  });  
}

const app = admin.apps[0] as App;
const db = getFirestore(app);

export {app, db};




