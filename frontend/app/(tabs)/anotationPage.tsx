import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from 'react';
import Header from "@/components/Header"
import Button from "@/components/Button";
import InputText from "@/components/InputText";
import { noteService } from "@/services/noteService";

export default function AnotationPage() {

  const router = useRouter();

  var groupInfo = useLocalSearchParams<{ noteId: string, groupId: string }>();

  console.log(groupInfo)

  const [id, setId] = useState(groupInfo.noteId);
  
  const [edit, setEdit] = useState(!id);

  const rightIcons = [
    {
      iconName: "edit",
      onClick: () => {
        setEdit(true);
      }
    },
    {
      iconName: "trash"
    },
  ];

  const leftIcons = [
    {
      iconName: "arrow-left",
    },
  ];

  const [anotationTitle, setAnotationTitle] = useState('');
  const [anotationText, setAnotationText] = useState('');

  const [anotation, setAnotation] = useState<any>();

  const saveNote = () => {
    noteService.createNote({title: anotationTitle, content: anotationText, groupId: groupInfo.groupId })
      .then(resp => {
        alert(`Cadastro concluído: \n title: ${resp.title} \n`);
        
        setAnotation(resp);
        setEdit(false);
      })
      .catch((error) => {
        alert(`Erro no cadastro`);
      }); 
  }

  useEffect(() => {
    if(id){
      noteService.getNoteById(id).then(resp => {
        setAnotation(resp);
        console.log(resp)
  
      }).catch(()=> {
          alert(`Erro ao buscar anotação`)
      })
    }

    if(anotation){
      setAnotationTitle(anotation.title);
      setAnotationText(anotation.content)
    }
  }, []);
    

  return (
    <View
      style={{
        flex: 1,
      }}
    >

      {!edit ? 
        <View style={{
          flex: 1,
          alignItems: "center",
        }}>
          <Header rightIcons={rightIcons} text={anotation?.title} />
          <View style={styles.scrollView}>
            <ScrollView>
              <Text style={styles.text}>{anotation?.content}</Text>
            </ScrollView>
          </View>
        </View>

        :

        <View style={styles.containerTextInput}>
          <View style={styles.containerTitle}>
            <InputText placeholder="Título" textValue={anotationTitle} onChangeText={setAnotationTitle} />
          </View>

          <TextInput
            editable
            multiline
            numberOfLines={50}
            onChangeText={text => setAnotationText(text)}
            value={anotationText}
            style={styles.inputBox}
          />

          <View style= {styles.buttonGroup}>
            <Button label="Salvar" onClick={saveNote}></Button>
          </View>
        </View>

      }

    </View>
  );
}

const styles = StyleSheet.create({
  scrollView:{
    width: "90%",
    flex: 10,
  },
  text: {
    fontSize: 20,
    marginLeft: "auto",
    marginRight: "auto",
  },
  containerTextInput:{
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  inputBox:{
    flex:20,
    borderWidth: 1,
    borderRadius: 15,
    width: "90%",
    maxHeight: "80%",
    textAlignVertical: "top"
  },
  buttonGroup:{
    marginTop: "10%",
    flex: 4,
    width: "100%",
  },
  containerTitle:{
    marginVertical: "5%",
  },
});
