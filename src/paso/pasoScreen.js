import { ActivityIndicator, Button, Text } from "react-native-paper";
import { ScrollView, View } from "react-native";

import PasoForm from "./pasoForm";
import React from "react";
import { TEXTS } from "./pasoHelper";
import { styles } from "./pasoStyles";
import { usePaso } from "./usePaso";

const PasoScreen = () => {
  const {
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
  } = usePaso();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          {isEditing ? TEXTS.editPaso : TEXTS.addPaso}
        </Text>

        <PasoForm
          nombre={nombre}
          descripcion={descripcion}
          setNombre={setNombre}
          setDescripcion={setDescripcion}
          altura={altura}
          setAltura={setAltura}
          orden={orden}
          setOrden={setOrden}
          huecos={huecos}
          setHuecos={setHuecos}
          addTrabajadera={addTrabajadera}
          trabajaderas={trabajaderas}
          removeTrabajadera={removeTrabajadera}
          addingTrabajadera={addingTrabajadera}
        />
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <Button
          mode={TEXTS.contained}
          onPress={savePaso}
          disabled={loading}
          style={styles.createButton}
          labelStyle={styles.buttonText}
        >
          {loading ? (
            <ActivityIndicator animating={true} />
          ) : isEditing ? (
            TEXTS.updatePaso
          ) : (
            TEXTS.savePaso
          )}
        </Button>
      </View>
    </View>
  );
};

export default PasoScreen;
