import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { COLOURS, FORM, TEXTS } from "./costaleroHelper";
import { ScrollView, View } from "react-native";

import React from "react";
import styles from "./costaleroStyles";

const CostaleroForm = ({
  costalero,
  setCostalero,
  saveCostalero,
  loading,
  isEditing,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{isEditing ? TEXTS.edit : TEXTS.add}</Text>

        <TextInput
          label={TEXTS.nombre}
          value={costalero.nombre}
          onChangeText={(text) =>
            setCostalero((prev) => ({ ...prev, nombre: text }))
          }
          style={styles.input}
          mode={FORM.outlined}
        />
        <TextInput
          label={TEXTS.apellidos}
          value={costalero.apellidos}
          onChangeText={(text) =>
            setCostalero((prev) => ({ ...prev, apellidos: text }))
          }
          style={styles.input}
          mode={FORM.outlined}
        />
        <TextInput
          label={TEXTS.telefono}
          value={costalero.telefono}
          onChangeText={(text) =>
            setCostalero((prev) => ({ ...prev, telefono: text }))
          }
          keyboardType={FORM.phoneType}
          style={styles.input}
          mode={FORM.outlined}
        />
        <TextInput
          label={TEXTS.altura}
          value={costalero.altura ? costalero.altura.toString() : ""}
          onChangeText={(text) =>
            setCostalero((prev) => ({ ...prev, altura: text }))
          }
          keyboardType={FORM.numeric}
          style={styles.input}
          mode={FORM.outlined}
        />
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <Button
          mode={FORM.contained}
          onPress={saveCostalero}
          disabled={loading}
          style={styles.saveButton}
          labelStyle={styles.buttonText}
        >
          {loading ? (
            <ActivityIndicator animating color={COLOURS.spinner} />
          ) : isEditing ? (
            TEXTS.update
          ) : (
            TEXTS.save
          )}
        </Button>
      </View>
    </View>
  );
};

export default CostaleroForm;
