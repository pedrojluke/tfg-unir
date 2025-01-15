import Navigation from "./src/utils/Navigation"; // Importamos la configuración de navegación
import { NavigationContainer } from "@react-navigation/native";
import React from "react";

export default function App() {
  return (
    <NavigationContainer>
      <Navigation /> {/* Utilizamos el componente Navigation */}
    </NavigationContainer>
  );
}
