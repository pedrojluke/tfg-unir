import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { collections, db } from "../service/firebase";
import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import { TEXTS } from "./pasoHelper";

export const usePaso = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const pasoId = route.params?.pasoId || null;

  const [nombre, setNombre] = useState(TEXTS.empty);
  const [descripcion, setDescripcion] = useState(TEXTS.empty);
  const [trabajaderas, setTrabajaderas] = useState([]);
  const [altura, setAltura] = useState(TEXTS.empty);
  const [orden, setOrden] = useState(TEXTS.empty);
  const [huecos, setHuecos] = useState(TEXTS.empty);
  const [loading, setLoading] = useState(false);
  const [addingTrabajadera, setAddingTrabajadera] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (pasoId) {
      loadPasoData();
      loadTrabajaderas();
    }
  }, [pasoId]);

  const loadPasoData = async () => {
    setLoading(true);
    try {
      const pasoRef = doc(db, collections.pasos.name, pasoId);
      const pasoSnap = await getDoc(pasoRef);
      if (pasoSnap.exists()) {
        const data = pasoSnap.data();
        setNombre(data.nombre);
        setDescripcion(data.descripcion);
        setIsEditing(true);
      }
    } catch (error) {
      console.error(TEXTS.errorSaving, error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrabajaderas = async () => {
    try {
      const trabajaderasRef = collection(
        db,
        `${collections.pasos.name}/${pasoId}/${collections.pasos.trabajaderasField}`
      );
      const trabajaderasSnap = await getDocs(trabajaderasRef);
      const trabajaderasList = trabajaderasSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrabajaderas(trabajaderasList.sort((a, b) => a.orden - b.orden));
    } catch (error) {
      console.error(TEXTS.errorGetting, error);
    }
  };

  const addTrabajadera = () => {
    if (!altura || !huecos || !orden) return;
    setAddingTrabajadera(true);

    const newTrabajadera = {
      id: Date.now(),
      altura: parseInt(altura),
      orden: parseInt(orden),
      huecos: parseInt(huecos),
    };

    setTrabajaderas(
      [...trabajaderas, newTrabajadera].sort((a, b) => a.orden - b.orden)
    );
    setAltura(TEXTS.empty);
    setOrden(TEXTS.empty);
    setHuecos(TEXTS.empty);
    setAddingTrabajadera(false);
  };

  const removeTrabajadera = (id) => {
    setTrabajaderas(
      trabajaderas.filter((trabajadera) => trabajadera.id !== id)
    );
  };

  const savePaso = async () => {
    if (!nombre || !descripcion || loading) return;
    setLoading(true);
    try {
      let pasoRef;
      if (isEditing) {
        pasoRef = doc(db, collections.pasos.name, pasoId);
        await updateDoc(pasoRef, { nombre, descripcion });
      } else {
        pasoRef = await addDoc(collection(db, collections.pasos.name), {
          nombre,
          descripcion,
        });
      }

      for (const trabajadera of trabajaderas) {
        await addDoc(
          collection(
            db,
            `${collections.pasos.name}/${pasoRef.id}/${collections.pasos.trabajaderasField}`
          ),
          trabajadera
        );
      }

      navigation.goBack();
    } catch (error) {
      console.error(TEXTS.errorSaving, error);
    } finally {
      setLoading(false);
    }
  };

  return {
    nombre,
    descripcion,
    trabajaderas,
    isEditing,
    loading,
    setNombre,
    setDescripcion,
    addTrabajadera,
    removeTrabajadera,
    savePaso,
    altura,
    setAltura,
    orden,
    setOrden,
    huecos,
    setHuecos,
    addingTrabajadera,
  };
};
