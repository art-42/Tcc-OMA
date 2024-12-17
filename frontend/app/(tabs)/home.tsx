import { Text, View, StyleSheet, TouchableOpacity, Alert, BackHandler } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router"; // Dependendo da sua navegação, pode ser useNavigation do React Navigation
import { Picker } from "@react-native-picker/picker";
import React from "react";
import Header from "@/components/Header";
import InputText from "@/components/InputText";
import Button from "@/components/Button";
import AnotationCard from "@/components/AnotatonCard";
import { useAuth } from "../../context/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/"); // Redireciona para a página de login se não autenticado
    }

    // Checa se estamos na Home antes de adicionar o listener do back
    const backAction = () => {
      Alert.alert(
        "Confirmar Logout",
        "Você tem certeza que deseja sair?",
        [
          {
            text: "Cancelar",
            onPress: () => null, // Não faz nada, apenas fecha o alerta
            style: "cancel",
          },
          {
            text: "Sair",
            onPress: () => {
              logout(); // Faz o logout
              router.replace("/"); // Redireciona para a página de login
            },
          },
        ],
        { cancelable: false }
      );
      return true; // Impede o comportamento padrão de voltar
    };

    // Só adiciona o listener de back na tela Home
    // if (router.  === "/home") { // Confere se está na tela "Home"
    const backHandlerListener = BackHandler.addEventListener("hardwareBackPress", backAction);

    //   // Limpeza do listener quando o componente for desmontado
    //   return () => {
    //     backHandlerListener.remove();
    //   };
    // }
  }, [isAuthenticated, logout, router]);

  const rightIcons = [
    {
      iconName: "user-circle",
    },
  ];

  const navigateToInfoScreen = () => {
    router.push("/infoScreen");
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <TouchableOpacity onPress={navigateToInfoScreen}>
        <Header
          rightIcons={rightIcons}
          text={`Bem-vindo, ${user?.name || "usuário"}`}
        />
      </TouchableOpacity>

      <InputText placeholder="Pesquisar" onChangeText={undefined} textValue={""} />

      <View style={styles.picker}>
        <Picker style={styles.picker}>
          <Picker.Item label="Data" value="data" />
          <Picker.Item label="Categoria" value="categoria" />
        </Picker>
      </View>

      <View style={styles.textHeadContainer}>
        <Text style={styles.text}> Junho </Text>
      </View>
      <View style={styles.textSubContainer}>
        <Text style={styles.text}> 19 </Text>
      </View>

      <View style={styles.AnotationContainer}>
        <AnotationCard title="Título" category="Categoria" time="13:00" />
      </View>
      <View style={styles.buttonGroup}>
        <Button label="+ Grupo" border={true} />
        <Button label="+ Categoria" border={true} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    width: "60%",
    margin: 4,
    alignSelf: "flex-end",
  },
  textHeadContainer: {
    width: "40%",
    alignSelf: "flex-start",
    borderBottomWidth: 2,
    margin: 15,
  },
  textSubContainer: {
    width: "20%",
    alignSelf: "flex-start",
    marginLeft: 25,
  },
  AnotationContainer: {
    width: "80%",
    marginTop: 10,
  },
  buttonGroup: {
    width: "100%",
    position: "absolute",
    bottom: 20,
    gap: 5,
  },
  text: {
    fontSize: 25,
  },
});
