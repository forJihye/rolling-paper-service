import admin, {initializeApp, apps, credential, ServiceAccount} from 'firebase-admin';
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from 'firebase/firestore';
import serviceAccount from 'serviceAccountKey.json';

if (!admin.apps.length) {
  initializeApp({
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

export const app = admin.apps[0];
export const auth = getAuth();
export const db = getFirestore();



