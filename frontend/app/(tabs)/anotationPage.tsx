import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, BackHandler } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from 'react';
import Header from "@/components/Header"
import Button from "@/components/Button";
import InputText from "@/components/InputText";
import { noteService } from "@/services/noteService";

export default function AnotationPage() {

  const router = useRouter();

  var params = useLocalSearchParams<{ noteId: string, groupId: string, fromHome: string }>();

  const [id, setId] = useState(params.noteId);
  
  const [edit, setEdit] = useState(!id);

  const rightIcons = [
    {
      iconName: "edit",
      onClick: () => {
        enterEditMode();
      }
    },
    {
      iconName: "trash",
      onClick: () => {
        deleteNote();
      }
    },
  ];

  const [anotationTitle, setAnotationTitle] = useState('');
  const [anotationText, setAnotationText] = useState('');

  const [anotation, setAnotation] = useState<any>();

  const saveNote = () => {
    (!id? noteService.createNote({title: anotationTitle, content: anotationText, groupId: params.groupId })
      : noteService.updateNote(id ,{title: anotationTitle, content: anotationText, groupId: params.groupId }))
      .then(resp => {
        alert(`Cadastro concluído: \n title: ${resp.title} \n`);
        
        setAnotation(resp);
        setEdit(false);
      })
      .catch((error) => {
        alert(`Erro no cadastro`);
      }); 
  }

  const deleteNote = () => {
      noteService.deleteNote(id)
        .then(resp => {
          alert(`deletado com sucesso`);
          router.back();
          
        })
        .catch((error) => {
          alert(`Erro na deleção`);
        }); 
    }

  const enterEditMode = () => {
    setAnotationTitle(anotation.title)
    setAnotationText(anotation.content)
    setEdit(true);
  }

  useEffect(() => {
    if(id){
      noteService.getNoteById(id).then(resp => {
        setAnotation(resp);
  
      }).catch(()=> {
          alert(`Erro ao buscar anotação`)
      })
    }
  }, []);

  useEffect(() => {
    const handleBackPress = () => {
      if(!id){
        return false;
      }
      if(edit){
        setEdit(false);
        return true;
      } 
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [edit]);

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
          {params.fromHome === 'true' && 
            <View style={{flex: 1}}>
              <Button label="Abrir Grupo" onClick={() => router.push({pathname: "/(tabs)/groupPage", params: {id: params.groupId}})}/>
            </View>
          }
          
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
