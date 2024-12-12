import { Octicons } from "@expo/vector-icons";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import React from 'react';
import Header from "@/components/Header"
import InputText from "@/components/InputText";
import Button from "@/components/Button";
import AnotationCard from "@/components/GroupCard";

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

  const months = [
    {
      name: "Julho",
      days: [{
        name: "19",
        anotations: [{
          title: "Trigonometria",
          time: "13:00"
        },{
          title: "Trigonometria",
          time: "13:00"
        }]
      }]
    },
    {
      name: "Agosto",
      days: [{
        name: "20",
        anotations: [{
          title: "Equações diferenciais",
          time: "13:00"
        },{
          title: "Equações diferenciais",
          time: "13:00"
        },{
          title: "Equações diferenciais",
          time: "13:00"
        }]

      }]
    },
  ]

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
      <TouchableOpacity style = {{flex: 1}} onPress={navigateToInfoScreen}>
        <Header rightIcons={rightIcons} text="Página Inicial" />
      </TouchableOpacity>

      <View style={styles.scrollView}>
      < ScrollView>
          {months.map(month => 
            <View style={styles.list}>
              <View style={styles.textHeadContainer}> 
                <Text style={styles.text}> {month.name} </Text>
              </View>
              {month.days.map(day => 
              <View style={styles.list}>
                <View style={styles.textSubContainer}> 
                  <Text style={styles.text}> {day.name} </Text>
                </View>
                {day.anotations.map(anotation => 
                  <View style={styles.AnotationContainer}>
                    <AnotationCard
                      title={anotation.title}
                      time={anotation.time}
                    />
                </View>
                )}
              </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>

      <View style= {styles.buttonGroup}>
        <Button label="+ Grupo" border={true}></Button>
        <Button label="+ Categoria" border={true}></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView:{
    flex: 10,
  },
  list:{
    width: "100%",
    marginBottom: "2%"
  },
  picker:{
    width: "60%",
    margin: 4,
    alignSelf: "flex-end"
  },
  textHeadContainer:{
    width: "40%",
    alignSelf: "flex-start",
    borderBottomWidth: 2,
    margin: 10,

  },
  textSubContainer:{
    width: "20%",
    alignSelf: "flex-start",
    marginLeft: 25,
  },
  AnotationContainer:{
    width: "80%",
    marginTop: 10,
    marginLeft: "10%"
  },
  buttonGroup:{
    flex: 2,
    paddingTop: 15,
    width: "100%",
    gap: 5,
  },
  text:{
    fontSize: 25
  }
});
