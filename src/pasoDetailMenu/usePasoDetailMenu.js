import { useNavigation, useRoute } from "@react-navigation/native";

export const usePasoDetailMenu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pasoId, nombrePaso } = route.params;

  const handleNavigation = (screen, extraParams = {}) => {
    navigation.navigate(screen, { pasoId, ...extraParams });
  };

  return { navigation, pasoId, nombrePaso, handleNavigation };
};
