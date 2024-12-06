import { Octicons } from "@expo/vector-icons";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import React from 'react';
import Header from "@/components/Header"
import InputText from "@/components/InputText";
import Button from "@/components/Button";
import AnotationCard from "@/components/AnotatonCard";

export default function HomeScreen() {

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace("/(tabs)");
      }
    };
    checkAuth();
  }, []);

  const rightIcons = [
    {
      iconName: "user-circle"
    }
  ];

  const navigateToInfoScreen = () => {
    router.push('/infoScreen');
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
           <TouchableOpacity onPress={navigateToInfoScreen}>
        <Header rightIcons={rightIcons} text="Página Inicial" />
      </TouchableOpacity>

      <InputText placeholder="Pesquisar" ></InputText>
      
      <View style={styles.picker}> 
        <Picker style={styles.picker}>
          <Picker.Item label="Data" value="js" />
          <Picker.Item label="Categoria" value="java" />
        </Picker>
      </View>

      <View style={styles.textHeadContainer}> 
        <Text style={styles.text}> Junho </Text>
      </View>
      <View style={styles.textSubContainer}> 
        <Text style={styles.text}> 19 </Text>
      </View>

      <View style={styles.AnotationContainer}>
        <AnotationCard
          title="Titulo"
          category="Categoria"
          time="13:00"
        />
      </View>
      <View style= {styles.buttonGroup}>
        <Button label="+ Grupo" border={true}></Button>
        <Button label="+ Categoria" border={true}></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  picker:{
    width: "60%",
    margin: 4,
    alignSelf: "flex-end"
  },
  textHeadContainer:{
    width: "40%",
    alignSelf: "flex-start",
    borderBottomWidth: 2,
    margin: 15,

  },
  textSubContainer:{
    width: "20%",
    alignSelf: "flex-start",
    marginLeft: 25,
  },
  AnotationContainer:{
    width: "80%",
    marginTop: 10,
  },
  buttonGroup:{
    width: "100%",
    position: 'absolute',
    bottom: 20,
    gap: 5
  },
  text:{
    fontSize: 25
  }
});
