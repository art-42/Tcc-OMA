import { Octicons } from "@expo/vector-icons";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import Header from "@/components/Header"
import InputText from "@/components/InputText";
import Button from "@/components/Button";
import GroupCard from "@/components/GroupCard";
import AnotationCard from "@/components/AnotationCard";
import { groupService } from "@/services/groupService";
import { noteService } from "@/services/noteService";

export default function GroupPage() {

  const router = useRouter();


  var groupInfo = useLocalSearchParams<{ id: string, name: string }>();

  const [id, setId] = useState(groupInfo.id);
  const [name, setName] = useState(groupInfo.name);
  const [date, setDate] = useState('');

  const [anotations, setAnotation] = useState<any[]>([]);

  useEffect(() => {
    if(id){
      noteService.getNotesByGroup(id).then(resp => {
        setAnotation(resp);
        console.log(anotations)
  
      }).catch(()=> {
        alert(`Erro ao encontrar anotações do grupo`)
      })
    }
  }, [id]);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Page is focused. Refreshing data...');
    }, [])
  );
  

  const saveGroup = () => {
    groupService.createGroup({name})
      .then(resp => {
        const group = resp.group;
        alert(`Cadastro concluído: \n nome: ${group.name} \n`);
        
        setId(group._id);
      })
      .catch((error) => {

        alert(`Erro no cadastro`);
      }); 
  }

  const deleteGroup = () => {
    groupService.deleteGroup(id)
      .then(resp => {
        const group = resp.group;
        alert(`deletado com sucesso`);
        router.push('/(tabs)/home');
        
      })
      .catch((error) => {
        alert(`Erro na deleção`);
      }); 
  }

  const addAnotation = () => {
    router.push({pathname: "/(tabs)/anotationPage", params: {groupId: id}})
  }


  const rightIcons = [
    {
      iconName: "edit"
    },
    {
      iconName: "trash",
      onClick: deleteGroup
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      {id ? 
        (
          <View>
            <TouchableOpacity style = {{flex: 2}}>
              <Header rightIcons={rightIcons} />
            </TouchableOpacity>

            <View style={styles.inputInfoContainer}>
              <InputText placeholder="Título" textValue={name} onChangeText={setName} />
              {/* <InputText placeholder="Data" textValue={date} onChangeText={setDate} /> */}
            </View>

            <View style={styles.scrollView}>
              <ScrollView>
                {anotations.map(anotation => 
                  <View style={styles.card}>
                    <AnotationCard id={anotation._id} groupId={id} title={anotation.title}/>
                  </View>
                )}
              </ScrollView>
            </View>

            <View style= {styles.buttonGroup}>
              <Button iconName="plus-circle" onClick={addAnotation}></Button>
            </View>
          </View>
        )
      :
        (
          <View style= {styles.inputCreateInfoContainer}>
              <Text style = {styles.headerCreateText} >
                Criar Novo Grupo
              </Text>

            <View style= {styles.inputInfoContainer}>
              <InputText placeholder="Título" textValue={name} onChangeText={setName} />
              {/* <InputText placeholder="Data" textValue={date} onChangeText={setDate} /> */}
            </View>

            <View style= {styles.buttonGroup}>
              <Button label="Salvar" onClick={saveGroup}></Button>
            </View>
          </View>
        )
      }      
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView:{
    flex: 15,
  },
  card:{
    marginBottom: "5%"
  },
  buttonGroup:{
    flex: 2,
    paddingTop: 15,
    alignItems: "center"
  },
  inputInfoContainer: {
    justifyContent: "center",
    flex: 5,
    gap: '5%',
  },
  headerCreateText: {
    flex: 2,
    paddingTop: 15,
    fontSize: 20
  },
  inputCreateInfoContainer: {
    alignItems:"center",
  },
});
