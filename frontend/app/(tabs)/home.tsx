import { Octicons } from "@expo/vector-icons";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, BackHandler, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import React from 'react';
import Header from "@/components/Header"
import Button from "@/components/Button";
import { groupService } from "@/services/groupService";
import GroupCard from "@/components/GroupCard";
import { useAuth } from "../../context/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    fetchHomeData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchHomeData();
    }, [])
  );


  function fetchHomeData() {
    groupService.getGroups().then(resp => {
      setGroups(resp.groups);
      console.log(groups);

    }).catch(() => {
      alert(`Erro no cadastro de pessoa`);
    });
  }

  function getMonthName(monthNumber: number) {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
  
    // Ensure the monthNumber is between 1 and 12 (inclusive)
    if (monthNumber >= 1 && monthNumber <= 12) {
      return months[monthNumber];  // Subtract 1 since the array is 0-based
    } else {
      return 'Mês inválido';  // Return an error message if the number is invalid
    }
  }

  function groupByMonthAndDay(data: any[]): any[] {
    const grouped: { [key: string]: { [key: string]: { id: string, name: string, time: string }[] } } = {};
  
    data.forEach(item => {
      const date = new Date(item.createdAt);
      const monthName = getMonthName(date.getMonth());
      const dayName = date.getDate().toString(); // Get the day as a string
  
      if (!grouped[monthName]) {
        grouped[monthName] = {};
      }
      
      if (!grouped[monthName][dayName]) {
        grouped[monthName][dayName] = [];
      }
  
      grouped[monthName][dayName].push({ id: item._id, name: item.name, time: item.createdAt });
    });
  
    return Object.keys(grouped).map(month => ({
      monthName: month,
      days: Object.keys(grouped[month]).map(day => ({
        daysName: day,
        data: grouped[month][day]
      }))
    }));
  }

  function formatToHHMM(dateString: string): string {
    const date = new Date(dateString);
    const adjustedDate = new Date(date.getTime() - 3 * 60 * 60 * 1000);
    const hours = String(adjustedDate.getHours()).padStart(2, '0');
    const minutes = String(adjustedDate.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  const groupedArray = groupByMonthAndDay(groups);

  console.log(groupedArray);
  
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

  // const months = [
  //   {
  //     name: "Julho",
  //     days: [{
  //       name: "19",
  //       anotations: [{
  //         title: "Trigonometria",
  //         time: "13:00"
  //       },{
  //         title: "Trigonometria",
  //         time: "13:00"
  //       }]
  //     }]
  //   },
  //   {
  //     name: "Agosto",
  //     days: [{
  //       name: "20",
  //       anotations: [{
  //         title: "Equações diferenciais",
  //         time: "13:00"
  //       },{
  //         title: "Equações diferenciais",
  //         time: "13:00"
  //       },{
  //         title: "Equações diferenciais",
  //         time: "13:00"
  //       }]

  //     }]
  //   },
  // ]

  const navigateToInfoScreen = () => {
    router.push("/infoScreen");
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
        <ScrollView>
          {groupedArray.map(month => 
            <View style={styles.list}>
               <View style={styles.textHeadContainer}> 
                <Text style={styles.text}> {month.monthName} </Text>
               </View>
                {month.days.map((day: { daysName: string, data: any[]; }) => 
                  <View style={styles.list}>
                    <View style={styles.textSubContainer}> 
                      <Text style={styles.text}> {day.daysName} </Text>
                    </View>
                    {day.data.map(anotation => 
                      <View style={styles.AnotationContainer}>
                        <GroupCard
                          id={anotation.id}
                          title={anotation.name}
                          time={formatToHHMM(anotation.time)}
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
        <Button label="+ Grupo" href="/(tabs)/groupPage" border={true}></Button>
        {/* <Button label="+ Categoria" border={true}></Button> */}
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
    alignSelf: "flex-end",
  },
  textHeadContainer: {
    width: "40%",
    alignSelf: "flex-start",
    borderBottomWidth: 2,
    margin: 10,

  },
  textSubContainer: {
    width: "20%",
    alignSelf: "flex-start",
    borderBottomWidth: 2,
    marginLeft: 25,
  },
  AnotationContainer: {
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
  text: {
    fontSize: 25,
  },
});
