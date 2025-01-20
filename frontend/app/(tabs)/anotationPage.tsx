import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, BackHandler, Pressable } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from 'react';
import Header from "@/components/Header"
import Button from "@/components/Button";
import InputText from "@/components/InputText";
import { noteService } from "@/services/noteService";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from 'expo-document-picker';
import { Camera, CameraView } from 'expo-camera'; // Importing the Camera component
import SignatureScreen, { SignatureViewRef } from 'react-native-signature-canvas';
import { Note } from "@/interfaces/Note";
import { Image } from 'react-native';
import { utils } from "@/utils/utils";


export default function AnotationPage() {

  const router = useRouter();

  var params = useLocalSearchParams<{ noteId: string, groupId: string, fromHome: string }>();

  const [id, setId] = useState(params.noteId);

  const [selectedNoteType, setSelectedNoteType] = useState<"arquivo"|"foto"|"texto">('texto');
  
  const [edit, setEdit] = useState(!id);

  const [file, setFile] = useState<any>();

  const [anotationTitle, setAnotationTitle] = useState('');
  const [anotationText, setAnotationText] = useState('');

  const [anotation, setAnotation] = useState<any>();

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const [fileUri, setFileUri] = useState<string | null>(null);

  const [drawMode, setDrawMode] = useState<"d"|"e">('d');
  const [drawColor, setDrawColor] = useState<string>('black');
  const [drawWidth, setDrawWidth] = useState<number>(3);

  const cameraRef = useRef<CameraView | null>(null);

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

  //campos de desenho
  const signatureRef = useRef<SignatureViewRef>(null);

  const pickerColorRef = useRef<Picker<string>|null>(null);
  const pickerWidthRef = useRef<Picker<number>|null>(null);

  const handleColorChange = (color: string) => {
    signatureRef.current?.changePenColor(color);
    setDrawColor(color);
  }

  const handleWidthChange = (width: number) => {
    signatureRef.current?.changePenSize(width - 0.5, width + 0.5);
    setDrawWidth(width);
  }


  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = (signature: any) => {
    console.log(signature);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
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
        noteData.fileUri = file?.uri; 
        noteData.fileName = file?.name; 
      } else if (noteData.type === "texto" && anotationText) {
        noteData.text = anotationText; // Passa o texto diretamente
      } else if (noteData.type === "foto" && photoUri) {
        noteData.fileUri = photoUri; // Passa o texto diretamente
      } else {
        throw new Error("Dados inválidos para o campo content.");
      }

      console.log(noteData);
    
      const response = !id
        ? await noteService.createNote(noteData)
        : await noteService.updateNote(id, noteData); 

      setAnotation(response);
      setId(response._id)
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

  const downloadNoteFile = () => {
    noteService.downloadNoteFile(anotation.content)
      .then(resp => {
        setFileUri(resp);
      })
      .catch((error) => {
        alert(error);
      }); 
  }

  const openNoteFile = () => {
    if(anotation.content){
      noteService.viewNoteFile(anotation.content);
    }
  }

  const enterEditMode = () => {
    setAnotationTitle(anotation.title)
    setAnotationText(anotation.content)
    setEdit(true);
  }

  useEffect(() => {
    if(id){
      console.log(id)
      noteService.getNoteById(id).then(async resp => {
        setAnotation(resp);
        setSelectedNoteType(resp.type);

        if(resp.type === 'foto'){
          setPhotoUri(await noteService.getFileUri(resp.content))
        }
  
      }).catch((error)=> {
          alert(error)
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
              console.log(fileAsset)
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
              {file?.name && <Text style={{textAlign:'center'}}>Arquivo Selecionado: {file?.name}</Text>}
              
              <Button label="Escolha o arquivo" onClick={pickFile} />
            </View>
        );

        case 'foto':

          const takePicture = async () => {
            if (cameraRef.current) {
              const photo = await cameraRef.current.takePictureAsync();
              if(photo){
                setPhotoUri(photo.uri);
                console.log(photo?.uri);
              }
            }
          };

          return (

            <View style={{ flex: 22, justifyContent: 'center' }}>
              {photoUri ? (
                <View style={{ gap: '2%'}}>
                    <Text style={styles.imgText}>(Clique na imagem para expandir)</Text>
                    <Pressable onPress={() => noteService.openNoteFile(photoUri, true)}>
                      <Image source={{ uri: photoUri }} style={{ width: 350, height: 400 }} resizeMode="contain" />
                    </Pressable>
                  <Button 
                    label="Tirar Outra" 
                    onClick={() => setPhotoUri(null)} 
                  />
                </View>
              ) : (
                <View style={{ gap: '2%'}}>
                  <CameraView
                    style={styles.camera}
                    ref={cameraRef}
                  />
                  <Button label="Tirar Foto" onClick={() => takePicture()} />
                </View>
              )}
            </View>
          );
        case 'desenho':  

          const style = `.m-signature-pad--footer {displau: none} .m-signature-pad {height: 100vh}`;

      
          return (
            <View style={styles.drawContainer}>
              <View style={styles.drawActions}>
                <Button 
                  iconName={'rotate-left'}
                  onClick={() => signatureRef.current?.undo()}
                />
                <Button 
                  iconName={'rotate-right'}
                  onClick={() => signatureRef.current?.redo()}
                />

                <Button 
                  iconName={drawMode === "d" ? "pencil" : "eraser"}
                  onClick={() => {
                    if(drawMode === "d"){
                      setDrawMode("e")
                      signatureRef.current?.erase()

                    } else {
                      setDrawMode("d")
                      signatureRef.current?.draw()
                    }
                  }}
                />

                <Button 
                  iconName={'paint-brush'}
                  iconColor={drawColor}
                  onClick={() => pickerColorRef.current?.focus()}
                />

                <Button 
                  iconName={'circle'}
                  iconSize={drawWidth + 5}
                  onClick={() => pickerWidthRef.current?.focus()}
                />

                <Picker
                  style={{display: 'none'}}
                  ref={pickerColorRef}
                  selectedValue={drawColor}
                  onValueChange={(itemValue) => handleColorChange(itemValue)}
                >
                  <Picker.Item label="Preto" value="black"  color="black" />
                  <Picker.Item label="Azul" value="blue" color="blue"/>
                  <Picker.Item label="Vermelho" value="red" color="red"/>
                  <Picker.Item label="Verde" value="green" color="green"/>
                </Picker>
                <Picker
                  style={{display: 'none'}}
                  ref={pickerWidthRef}
                  selectedValue={drawWidth}
                  onValueChange={(itemValue) => handleWidthChange(itemValue)}
                >
                  <Picker.Item label="Pequeno" value={3}/>
                  <Picker.Item label="Médio" value={5}/>
                  <Picker.Item label="Grande" value={10}/>
                  <Picker.Item label="Extra grande" value={20}/>
                </Picker>
              </View>
              <SignatureScreen
                ref={signatureRef}
                onOK={handleOK}
                webStyle={style}
                minWidth={3}
              />
            </View>
          );
      default:
        return;
    }
  }

  const renderViewNoteType = (param: string) => {
    switch(param) {
      case 'texto':
        return (
          <View style={styles.scrollView}>
            <ScrollView>
              <Text style={styles.text}>{anotation?.content}</Text>
            </ScrollView>
          </View>
        );
      case 'arquivo':
        return (
            <View style={{ gap: '5%', flex: 20, justifyContent: 'center' }}>
              <Text style={{textAlign: 'center'}}>Arquivo adicionado: </Text>              
              <Text style={{textAlign: 'center'}}>{anotation.fileName}</Text>              
              <Button label="Visualizar" onClick={openNoteFile} />
              <Button label="Baixar" onClick={downloadNoteFile} />
            </View>
        );

        case 'foto':
          return (
            <View style={{ flex: 0.8, justifyContent: 'center' }}>
              {photoUri ? (
                <View style={{ gap: '2%'}}>
                    <Text style={styles.imgText}>(Clique na imagem para expandir)</Text>
                    <Pressable onPress={() => noteService.openNoteFile(photoUri, true)}>
                      <Image source={{ uri: photoUri }} style={{ width: 350, height: 400 }} resizeMode="contain" />
                    </Pressable>
                </View>
              ) : (
                <Text>
                  Sem imagem disponível para ser visualizada
                </Text>
              )}
            </View>
           
          );
          
        case 'desenho':        
          
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

          {renderViewNoteType(selectedNoteType)}

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
              <Picker.Item label="desenho" value={'desenho'}/>
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
  imgText:{
    textAlign: 'center'
  },
  camera: {
    flex: 1,
    width: 300,
    height: 400,
  },
  drawContainer: {
    flex: 30,
     justifyContent: 'center',
    alignItems: 'center', 
    width: '95%'
  },
  drawActions: {
    flexDirection: 'row', 
    columnGap: '5%', 
    alignSelf: 'flex-end',
    marginBottom: '2%'
  }
});
