import { Octicons } from "@expo/vector-icons";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import Header from "@/components/Header"
import InputText from "@/components/InputText";
import Button from "@/components/Button";
import GroupCard from "@/components/GroupCard";
import AnotationCard from "@/components/AnotationCard";
import { groupService } from "@/services/groupService";

export default function GroupPage() {

  const router = useRouter();

  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const save = () => {
    groupService.createGroup({name, categoryId: "676dd3208ef78e9739363744"})
      .then(resp => {
        const group = resp.group;
        alert(`Cadastro concluído: \n nome: ${group.name} \n`);
        
        router.push('/(tabs)'); 

      })
      .catch((error) => {

        alert(`Erro no cadastro`);
      }); 
  }

  const groupInfo = useLocalSearchParams<{ id: string }>();

  const rightIcons = [
    {
      iconName: "edit"
    },
    {
      iconName: "share-alt"
    },
    {
      iconName: "trash"
    },
  ];

  const anotations: {id: string, name: string, type: string}[] = []

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      {groupInfo.id ? 
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
                    <AnotationCard  title={groupInfo.id} type={anotation.type}/>
                  </View>
                )}
              </ScrollView>
            </View>

            <View style= {styles.buttonGroup}>
              <Button iconName="plus-circle"></Button>
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
              <Button label="Salvar" onClick={save}></Button>
            </View>
          </View>
        )
      }      
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView:{
    width: "100%",
    flex: 15,
  },
  card:{
    marginBottom: "5%"
  },
  buttonGroup:{
    flex: 2,
    paddingTop: 15,
  },
  inputInfoContainer: {
    justifyContent: "center",
    flex: 8,
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
