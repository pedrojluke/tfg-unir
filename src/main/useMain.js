import { collection, getDocs } from "firebase/firestore";
import { collections, db } from "../service/firebase";
import { useCallback, useState } from "react";

import { TEXTS } from "./mainHelper";
import { useFocusEffect } from "@react-navigation/native";

const useMain = () => {
  const [pasos, setPasos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPasos = async () => {
    try {
      setLoading(true);
      const pasosCollection = collection(db, collections.pasos.name);
      const pasosSnapshot = await getDocs(pasosCollection);
      const pasosList = pasosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPasos(pasosList);
    } catch (error) {
      console.error(TEXTS.error, error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPasos();
    }, [])
  );

  return { pasos, loading };
};

export default useMain;
