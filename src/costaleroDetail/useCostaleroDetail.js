import { collection, getDocs, query, where } from "firebase/firestore";
import { collections, db } from "../service/firebase";
import { useCallback, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";

const useCostaleroDetail = (pasoId) => {
  const [costaleros, setCostaleros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCostaleros = async () => {
    try {
      setLoading(true);
      const costalerosRef = collection(db, collections.usuarios.name);
      const q = query(
        costalerosRef,
        where(collections.pasos.id, collections.pasos.equals, pasoId),
        where(
          collections.usuarios.rolField,
          collections.pasos.equals,
          collections.usuarios.rol
        )
      );
      const costalerosSnap = await getDocs(q);
      let costalerosList = costalerosSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      costalerosList = costalerosList.sort((a, b) => a.altura - b.altura);
      setCostaleros(costalerosList);
    } catch (error) {
      console.error(TEXTS.error, error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCostaleros();
    }, [])
  );

  const filteredCostaleros = costaleros.filter((costalero) =>
    `${costalero.nombre} ${costalero.apellidos}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return {
    costaleros,
    loading,
    searchQuery,
    setSearchQuery,
    filteredCostaleros,
  };
};

export default useCostaleroDetail;
