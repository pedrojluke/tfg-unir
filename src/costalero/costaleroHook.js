import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { collections, db } from "../service/firebase";
import { useCallback, useEffect, useState } from "react";

import { TEXTS } from "./costaleroHelper";

const useCostalero = (costaleroId, pasoId, navigation) => {
  const [costalero, setCostalero] = useState({
    nombre: TEXTS.empty,
    apellidos: TEXTS.empty,
    telefono: TEXTS.empty,
    altura: TEXTS.empty,
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (costaleroId) {
      loadCostaleroData();
    }
  }, [costaleroId]);

  const loadCostaleroData = async () => {
    setLoading(true);
    try {
      const costaleroRef = doc(db, collections.usuarios.name, costaleroId);
      const costaleroSnap = await getDoc(costaleroRef);
      if (costaleroSnap.exists()) {
        setCostalero(costaleroSnap.data());
        setIsEditing(true);
      }
    } catch (error) {
      console.error(TEXTS.errorGettingData, error);
    } finally {
      setLoading(false);
    }
  };

  const saveCostalero = useCallback(async () => {
    if (
      !costalero.nombre ||
      !costalero.apellidos ||
      !costalero.telefono ||
      !costalero.altura ||
      loading
    )
      return;
    setLoading(true);
    try {
      if (isEditing) {
        const costaleroRef = doc(db, collections.usuarios.name, costaleroId);
        await updateDoc(costaleroRef, {
          ...costalero,
          altura: parseInt(costalero.altura),
        });
      } else {
        await addDoc(collection(db, collections.usuarios.name), {
          ...costalero,
          altura: parseInt(costalero.altura),
          pasoId,
          rol: collections.usuarios.rol,
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error(TEXTS.errorSavingData, error);
    } finally {
      setLoading(false);
    }
  }, [costalero, isEditing, loading, navigation, pasoId, costaleroId]);

  return { costalero, setCostalero, loading, isEditing, saveCostalero };
};

export default useCostalero;
