import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { collections, db } from "../service/firebase";
import { useCallback, useState } from "react";

import { TEXTS } from "./ensayoMenuHelper";
import { useFocusEffect } from "@react-navigation/native";

const useEnsayoMenu = (pasoId) => {
  const [ensayos, setEnsayos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnsayos = async () => {
    try {
      setLoading(true);
      const ensayosRef = collection(
        db,
        `${collections.pasos.name}/${pasoId}/${collections.ensayos.name}`
      );
      const q = query(
        ensayosRef,
        orderBy(collections.ensayos.fechaFilter, collections.ensayos.fechaOrder)
      );
      const ensayosSnap = await getDocs(q);
      const ensayosList = ensayosSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const ensayosPorFecha = ensayosList.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );

      setEnsayos(ensayosPorFecha);
    } catch (error) {
      console.error(TEXTS.errorGettingEnsayos, error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEnsayos();
    }, [])
  );

  return { ensayos, loading };
};

export default useEnsayoMenu;
