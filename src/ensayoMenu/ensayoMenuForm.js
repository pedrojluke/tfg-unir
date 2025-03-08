import { Button, TextInput } from "react-native-paper";
import { FORMAT, TEXTS } from "./ensayoMenuHelper";

import React from "react";
import { View } from "react-native";
import dayjs from "dayjs";

const EnsayoForm = ({ ensayo, onSave }) => {
  const [fecha, setFecha] = React.useState(ensayo ? ensayo.fecha : "");

  return (
    <View>
      <TextInput
        label={TEXTS.fecha}
        value={dayjs(fecha).format(FORMAT.dateMask)}
        onChangeText={setFecha}
      />
      <Button mode={FORMAT.contained} onPress={() => onSave({ fecha })}>
        {TEXTS.save}
      </Button>
    </View>
  );
};

export default EnsayoForm;
