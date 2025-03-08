import { Button, TextInput } from "react-native-paper";

import React from "react";
import { TEXTS } from "./mainHelper";
import { View } from "react-native";

const MainForm = ({ paso, onSave, onCancel }) => {
  const [nombre, setNombre] = React.useState(paso ? paso.nombre : "");

  return (
    <View>
      <TextInput
        label={TEXTS.pasoNameLabel}
        value={nombre}
        onChangeText={setNombre}
      />
      <Button mode={TEXTS.contained} onPress={() => onSave({ nombre })}>
        Guardar Paso
      </Button>
      <Button mode={TEXTS.text} onPress={onCancel}>
        Cancelar
      </Button>
    </View>
  );
};

export default MainForm;
