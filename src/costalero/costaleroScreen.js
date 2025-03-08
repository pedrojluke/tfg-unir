import { useNavigation, useRoute } from "@react-navigation/native";

import CostaleroForm from "./costaleroForm";
import React from "react";
import useCostalero from "./costaleroHook";

const CostaleroScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pasoId, costaleroId } = route.params || {};

  const { costalero, setCostalero, loading, isEditing, saveCostalero } =
    useCostalero(costaleroId, pasoId, navigation);

  return (
    <CostaleroForm
      costalero={costalero}
      setCostalero={setCostalero}
      saveCostalero={saveCostalero}
      loading={loading}
      isEditing={isEditing}
    />
  );
};

export default CostaleroScreen;
