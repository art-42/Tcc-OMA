import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, BackHandler } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from 'react';
import Header from "@/components/Header"
import Button from "@/components/Button";
import InputText from "@/components/InputText";
import { noteService } from "@/services/noteService";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker'; // Import expo-image-picker for photo functionality
import { Note } from "@/interfaces/Note";
import { Image } from 'react-native';


export default function AnotationPage() {

  const router = useRouter();

  var params = useLocalSearchParams<{ noteId: string, groupId: string, fromHome: string }>();

  const [id, setId] = useState(params.noteId);

  const [selectedNoteType, setSelectedNoteType] = useState<"arquivo"|"foto"|"texto">('texto');
  
  const [edit, setEdit] = useState(!id);

  const [file, setFile] = useState<any>();

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

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    // Request camera permission when the component mounts
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const saveNote = async () => {
    try {
      // Montar os dados da nota com base no tipo selecionado
      const noteData: Note = {
        title: anotationTitle,
        groupId: params.groupId,
        type: selectedNoteType,
      };
  
      if (noteData.type === "arquivo" && file?.uri) {
        noteData.fileUri = file?.uri; // Passa o URI do arquivo como objeto
      } else if (noteData.type === "texto" && anotationText) {
        noteData.text = anotationText; // Passa o texto diretamente
      } else if (noteData.type === "foto" && photoUri) {
        noteData.fileUri = photoUri; // Passa o texto diretamente
      } else {
        throw new Error("Dados inválidos para o campo content.");
      }
  
      console.log("Dados enviados ao serviço:", noteData);
  
      // Selecionar a função apropriada do serviço
      const response = !id
        ? await noteService.createNote(noteData) // Envia os dados ao backend para criação
        : await noteService.updateNote(id, noteData); // Atualiza a nota existente
  
      // Sucesso: notificar o usuário e atualizar estado
      alert(`Cadastro concluído: \nTítulo: ${response.title}`);
      setAnotation(response);
      setEdit(false);
    } catch (error) {
      // Falha: notificar o usuário
      console.error("Erro ao salvar a nota:", error);
      alert("Erro no cadastro. Por favor, tente novamente.");
    }
  };
  

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

  const renderEditNoteType = (param: string) => {
    switch(param) {
      case 'texto':
        return (
            <TextInput
              editable
              multiline
              numberOfLines={50}
              onChangeText={text => setAnotationText(text)}
              value={anotationText}
              style={styles.inputBox}
            />
        );
      case 'arquivo':
        const pickFile = async () => {
          console.log('Arquivo selecionado:', file);
          try {
            const result = await DocumentPicker.getDocumentAsync({
              type: '*/*', 
            });

            console.log('Resultado do DocumentPicker:', result); 
      
            if (result.canceled) {
              console.log('File picking cancelled');
              return;
            }
      
            const fileAsset = result.assets ? result.assets[0] : null;
            if (fileAsset) {
              setFile(fileAsset); 
            } else {
              console.log('No file selected');
            }
            
          } catch (error) {
            console.error('Error picking file', error);
          }
        };
        
      
        return (
            <View style={{ gap: '10%', flex: 20, justifyContent: 'center' }}>
              {file?.name && <Text>File picked: {file?.name}</Text>}
              
              <Button label="Escolha o arquivo" onClick={pickFile} />
            </View>
        );

        case 'foto':
          const takePhoto = async () => {
            if (hasPermission) {
              let result = await ImagePicker.launchCameraAsync({
                mediaTypes: "images",
                allowsEditing: true,
                quality: 1,
              });

              if (!result.canceled) {
                setPhotoUri(result.assets[0].uri); // Store the URI of the captured media
              } else {
                console.log('User cancelled the action');
              }
            } else {
              alert('Camera permission is required');
            }
          };

          return (
            <View style={{ flex: 20, justifyContent: 'center' }}>
              {photoUri ? (
                <View style={styles.imgContainer}>
                  <Text style={styles.imgText}>Foto ou vídeo capturado:</Text>
                  <Image source={{ uri: photoUri }} style={{ width: 500, height: 200 }} resizeMode="contain" />
                  <Button 
                    label="Tirar Outra" 
                    onClick={takePhoto} 
                  />
                </View>
              ) : (
                <>
                  <Button 
                    label="Tirar Foto" 
                    onClick={takePhoto} 
                  />
                </>
              )}
            </View>
          );
      default:
        return;
    }
  }

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
          <Header rightIcons={rightIcons} text={anotation?.title}/>
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

            <Picker
              selectedValue={selectedNoteType}
              onValueChange={(itemValue) =>{
                setSelectedNoteType(itemValue)
              }
            }>
              <Picker.Item label="Texto" value={'texto'}/>
              <Picker.Item label="Arquivo" value={'arquivo'}/>
              <Picker.Item label="Foto" value={'foto'}/>
            </Picker>
          </View>

          {renderEditNoteType(selectedNoteType)}

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
  imgContainer:{
    gap: '5%',
  },
  imgText:{
    textAlign: 'center'
  }
});
