import Constants from "expo-constants";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.firebase.apiKey,
  authDomain: Constants.expoConfig.extra.firebase.authDomain,
  projectId: Constants.expoConfig.extra.firebase.projectId,
  storageBucket: Constants.expoConfig.extra.firebase.storageBucket,
  messagingSenderId: Constants.expoConfig.extra.firebase.messagingSenderId,
  appId: Constants.expoConfig.extra.firebase.appId,
  measurementId: Constants.expoConfig.extra.firebase.measurementId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const collections = {
  usuarios: {
    name: "usuarios",
    rol: "costalero",
    rolField: "rol",
  },
  pasos: {
    name: "pasos",
    id: "pasoId",
    equals: "==",
    trabajaderasField: "trabajaderas",
  },
  ensayos: {
    name: "ensayos",
    fechaFilter: "fecha",
    fechaOrder: "asc",
  },
};

export { collections, db };
