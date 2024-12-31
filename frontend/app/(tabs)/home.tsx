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
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  const groupedArray = groupByMonthAndDay(groups);
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/"); // Redireciona para a página de login se não autenticado
    }
    

  }, [isAuthenticated, logout, router]);
  
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert(
          "Sair",
          "Deseja se deslogar?",
          [
            {
              text: "Cancelar",
              onPress: () => null,
              style: "cancel",
            },
            {
              text: "Sim",
              onPress: () => {
                logout(); // Função de logout
                router.replace("/"); // Redireciona para a página de login
              },
            },
          ],
          { cancelable: true }
        );
        return true; // Previne o comportamento padrão de voltar
      };
  
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
  
      // Limpeza do listener ao sair da tela
      return () => backHandler.remove();
    }, [logout, router])
  );
  const rightIcons = [
    {
      iconName: "user-circle",
    },
  ];

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
            <View style={styles.list} key={month.monthName}>
               <View style={styles.textHeadContainer}> 
                <Text style={styles.text}> {month.monthName} </Text>
               </View>
                {month.days.map((day: { daysName: string, data: any[]; }, index: number) => 
                  <View style={styles.list} key={index}>
                    <View style={styles.textSubContainer}> 
                      <Text style={styles.text}> {day.daysName} </Text>
                    </View>
                    {day.data.map(anotation => 
                      <View style={styles.AnotationContainer} key={anotation.id}>
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
