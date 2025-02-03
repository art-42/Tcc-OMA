import { Text, View, StyleSheet, TouchableOpacity, ScrollView, BackHandler, Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {Picker} from '@react-native-picker/picker';
import React from 'react';
import Header from "@/components/Header"
import Button from "@/components/Button";
import { groupService } from "@/services/groupService";
import GroupCard from "@/components/GroupCard";
import { useAuth } from "../../context/AuthContext";
import InputText from "@/components/InputText";
import { searchService } from "@/services/searchService";
import AnotationCard from "@/components/AnotationCard";


export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const [groups, setGroups] = useState<any[]>([]);
  const [searchedResults, setSearchedResults] = useState<any | undefined>(undefined);
  const [selectedView, setSelectedView] = useState('date');

  const [searchText, setSearchText] = useState('');
  
  const scrollViewRef = useRef<ScrollView>(null);

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
      setGroups(resp);
    }).catch(() => {
      Alert.alert('Erro',`Erro no cadastro de pessoa.`);
    });
  }

  function getMonthName(monthNumber: number) {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
  
    // Ensure the monthNumber is between 1 and 12 (inclusive)
    if (monthNumber >= 0 && monthNumber <= 12) {
      return months[monthNumber];  // Subtract 1 since the array is 0-based
    } else {
      return 'Mês inválido';  // Return an error message if the number is invalid
    }
  }

  function groupByYearMonthAndDay(data: any[]): any[] {
    const grouped: {
      [key: string]: {
        [key: string]: {
          [key: string]: {
            id: string;
            name: string;
            time: string;
            categoryName: string;
            categoryId: string;
          }[];
        };
      };
    } = {};
  
    // Sort the data by createdAt in descending order (newest first)
    const sortedData = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
    sortedData.forEach(item => {
      const date = new Date(item.createdAt);
      const year = date.getFullYear().toString(); // Get the year
      const monthName = getMonthName(date.getMonth()); // Get the month name
      const dayName = date.getDate().toString(); // Get the day as a string
  
      // Initialize year group if it doesn't exist
      if (!grouped[year]) {
        grouped[year] = {};
      }
  
      // Initialize month group within the year if it doesn't exist
      if (!grouped[year][monthName]) {
        grouped[year][monthName] = {};
      }
  
      // Initialize day group within the month if it doesn't exist
      if (!grouped[year][monthName][dayName]) {
        grouped[year][monthName][dayName] = [];
      }
  
      // Push the item into the correct year -> month -> day group
      grouped[year][monthName][dayName].push({
        id: item._id,
        name: item.name,
        time: item.createdAt,
        categoryId: item.categoryId,
        categoryName: item.categoryName
      });
    });
  
    // Sort the grouped data
    const sortedGroupedData = Object.keys(grouped)
      .sort((a, b) => parseInt(b) - parseInt(a)) // Sort years from newest to oldest
      .map(year => ({
        year: year,
        months: Object.keys(grouped[year])
          .sort((a, b) => b.localeCompare(a)) // Sort months from newest to oldest
          .map(month => ({
            monthName: month,
            days: Object.keys(grouped[year][month])
              .sort((a, b) => parseInt(b) - parseInt(a)) // Sort days from newest to oldest
              .map(day => ({
                dayName: day,
                data: grouped[year][month][day].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()) // Sort items by newest first
              }))
          }))
      }));
  
    return sortedGroupedData;
  }
  function formatToHHMM(dateString: string): string {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  function formatToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const year = date.getFullYear();
    
    return `${day}/${month}/${year} `;
  }

  function groupByCategory(data: any[]): any[] {
    const grouped: { [key: string]: { id: string, name: string, time: string, categoryId: string }[] } = {};
  
    data.forEach(item => {
      const categoryName = item.categoryName; // Group by categoryName
  
      // Initialize category group if it doesn't exist
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
  
      // Push the item into the correct category group
      grouped[categoryName].push({
        id: item._id,
        name: item.name,
        time: item.createdAt,
        categoryId: item.categoryId
      });
    });
  
    // Sort the categories by placing the one with null categoryId first, and the rest alphabetically
    const sortedCategories = Object.keys(grouped)
      .sort((a, b) => {
        if (a === 'null') return -1; // Ensure category with null categoryId is first
        if (b === 'null') return 1;
        return a.localeCompare(b); // Sort the rest alphabetically
      });
  
    // Format the grouped data as an array of categories with their items
    return sortedCategories.map(category => ({
      categoryName: category,
      data: grouped[category].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()) // Sort items by newest first
    }));
  }
  
  const groupedArray = selectedView === 'date' ? groupByYearMonthAndDay(groups) : groupByCategory(groups);
  
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

  const navigateToInfoScreen = () => {
    router.push("/infoScreen");
  };

  const rightIcons = [
    {
      iconName: "user-circle",
      onClick: () => {
        navigateToInfoScreen();
      }
    },
  ];

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    if(value !== ''){
      fetchResults(value);
    } else{
      setSearchedResults(undefined);
    }
  }

  const fetchResults = (value: string) => {
      searchService.search(value).then(resp => {
        setSearchedResults(resp);
    
      }).catch(() => {
        Alert.alert('Erro',`Erro ao encontrar resultado de pesquisa.`);
      });
  }

  const renderGroupedArray = selectedView === 'date' ? 
    groupedArray.map(year => (
      <View style={styles.list} key={year.year}>
        <View style={styles.textHeadContainer}>
          <Text style={styles.text}>{year.year}</Text>
        </View>

        {year.months.map((month: any) => (
          <View style={styles.list} key={month.monthName}>
            <View style={[styles.textHeadContainer, styles.monthHeader]}>
              <Text style={styles.text}>{month.monthName}</Text>
            </View>

            {month.days.map((day: { dayName: string, data: any[] }, index: number) => (
              <View style={styles.list} key={index}>
                <View style={[styles.textSubContainer, styles.dayHeader]}>
                  <Text style={styles.text}>{day.dayName}</Text>
                </View>

                {day.data.map(group => (
                  <View style={styles.AnotationContainer} key={group.id}>
                    <GroupCard
                      id={group.id}
                      categoryId={group.categoryId}
                      categoryName={group.categoryName}
                      title={group.name}
                      time={formatToHHMM(group.time)}
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
      </View>
    )) : 
    groupedArray.map(category => (
      <View style={styles.list} key={category.categoryName}>
        <View style={styles.list}>
          <View style={[styles.textSubContainer, styles.dayHeader]}>
            <Text style={styles.text}>{category.categoryName}</Text>
          </View>

          {category.data.map((data: any) => (
            <View style={styles.AnotationContainer} key={data.id}>
              <GroupCard
                id={data.id}
                categoryId={data.categoryId}
                categoryName={data.categoryName}
                title={data.name}
                date={formatToDDMMYYYY(data.time)}
                time={formatToHHMM(data.time)}
              />
            </View>
          ))}
        </View>
      </View>
    ));
  
  const renderSearchedResults = 
      <View style={styles.list}>
        {searchedResults?.groups?.length > 0 &&
          <View>
            <View style={styles.textHeadContainer}>
              <Text style={styles.text}>Grupos</Text>
            </View>

            <View style={styles.list}>
              {searchedResults?.groups?.map((group: any) => (
                <View style={styles.AnotationContainer} key={group._id}>
                  <GroupCard
                    id={group._id}
                    categoryId={group.categoryId}
                    categoryName={group.categoryName}
                    title={group.name}
                    date={formatToDDMMYYYY(group.createdAt)}
                    time={formatToHHMM(group.createdAt)}
                  />
                </View>
              ))}
            </View>
          </View>
        }
        {searchedResults?.notes?.length > 0 &&
          <View>
            <View style={styles.textHeadContainer}>
              <Text style={styles.text}>Anotações</Text>
            </View>

            <View style={styles.list}>
              {searchedResults?.notes?.map((note: any) => (
                <View style={styles.AnotationContainer} key={note._id}>
                  <AnotationCard id={note._id} groupId={note.groupId} title={note.title} type={note.type} fromHome="true"/>
                </View>
              ))}
            </View>
          </View>
        }
      </View>

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

      <View style = {{flex: 1}}>
        <InputText placeholder="Pesquisar" onChangeText={handleSearchChange} textValue={searchText}/>
      </View>

      <View style={styles.picker}>
        <Picker
          selectedValue={selectedView}
          onValueChange={(itemValue) =>{
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            setSelectedView(itemValue)
          }
        }>
          <Picker.Item label="Data" value={'date'} />
          <Picker.Item label="Categoria" value={'category'} />
        </Picker>
      </View>

      <View style={styles.scrollView}>
        <ScrollView ref={scrollViewRef} >
          {searchedResults && searchText ? renderSearchedResults : renderGroupedArray }
          
        </ScrollView>
      </View>

      <View style= {styles.buttonGroup}>
        <Button label="+ Grupo" href="/(tabs)/groupPage" />
        <Button label="+ Categoria" href="/(tabs)/categoryPage"/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView:{
    flex: 10,
    width: "90%"
  },
  list:{
    width: "100%",
    marginBottom: "2%"
  },
  picker:{
    width: "40%",
    marginRight: 15,
    alignSelf: "flex-end",
    borderBottomWidth: 1
  },
  textHeadContainer: {
    width: "50%",
    alignSelf: "flex-start",
    borderBottomWidth: 2,
    margin: 10,

  },
  textSubContainer: {
    width: "60%",
    alignSelf: "flex-start",
    borderBottomWidth: 2,
    
  },
  monthHeader: {
    marginLeft: 15,
  },
  dayHeader:{
    marginLeft: 30,
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
