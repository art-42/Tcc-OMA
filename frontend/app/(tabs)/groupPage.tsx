import { Octicons } from "@expo/vector-icons";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import React from 'react';
import Header from "@/components/Header"
import InputText from "@/components/InputText";
import Button from "@/components/Button";
import GroupCard from "@/components/GroupCard";
import AnotationCard from "@/components/AnotationCard";

export default function GroupPage() {

  const router = useRouter();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

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

  const anotations = [{
    title: "Anotação 1",
    type: "texto"
  },
  {
    title: "Anotação 2",
    type: "texto"
  },
  {
    title: "Anotação 3",
    type: "texto"
  },
  {
    title: "Anotação 1",
    type: "texto"
  },
  {
    title: "Anotação 2",
    type: "texto"
  },
  {
    title: "Anotação 3",
    type: "texto"
  }]


  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <TouchableOpacity style = {{flex: 2}}>
        <Header rightIcons={rightIcons} />
      </TouchableOpacity>

      <View style={styles.inputInfoContainer}>
        <InputText placeholder="Título" textValue={title} onChangeText={setTitle} />
        <InputText placeholder="Data" textValue={date} onChangeText={setDate} />
      </View>

      <View style={styles.scrollView}>
        <ScrollView>
          {anotations.map(anotation => 
            <View style={styles.card}>
              <AnotationCard  title={anotation.title} type={anotation.type}/>
            </View>
          )}
        </ScrollView>
      </View>

      <View style= {styles.buttonGroup}>
        <Button iconName="plus-circle"></Button>
      </View>
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
    flex: 4,
    gap: '5%',
  },
});
