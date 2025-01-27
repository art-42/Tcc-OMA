import { View, Text, StyleSheet, ScrollView, TextInput, BackHandler, Pressable, Modal, Alert } from "react-native";
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

export default function AnotationPage() {

  const [tags, setTags] = useState<string[]>([]);

  const [modalTagVisible, setModalTagVisible] = useState(false);

  const [addTagText, setAddTagText] = useState('');

  const router = useRouter();

  var params = useLocalSearchParams<{ noteId: string, groupId: string, fromHome: string }>();

  const [id, setId] = useState(params.noteId);

  const [selectedNoteType, setSelectedNoteType] = useState<"arquivo"|"foto"|"texto"|"desenho">('texto');
  
  const [edit, setEdit] = useState(!id);

  const [file, setFile] = useState<any>();

  const [anotationTitle, setAnotationTitle] = useState('');
  const [anotationText, setAnotationText] = useState('');

  const [anotation, setAnotation] = useState<any>();

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [drawUri, setDrawUri] = useState<string | null>(null);
  const [, setHasPermission] = useState<boolean>(false);

  const [, setFileUri] = useState<string | null>(null);

  const [drawMode, setDrawMode] = useState<"d"|"e">('d');
  const [drawColor, setDrawColor] = useState<string>('black');
  const [drawWidth, setDrawWidth] = useState<number>(3);

  const [drawBase64, setDrawBase64] = useState<string|null>(null);

  const cameraRef = useRef<CameraView | null>(null);

  const rightIcons = [
    {
      iconName: "edit",
      onClick: () => {
        enterEditMode();
      }
    },
    {
      iconName: "trash-o",
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


  const handleOK = (signature: any) => {
    setDrawBase64(signature);
  };

  const handleEnd = () => {
    signatureRef.current?.readSignature();
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const saveNote = async () => {
    if(!anotationTitle){
      Alert.alert('Erro',`Título deve ser preenchido.`);
      return;
    }
    try {
      const noteData: Note = {
        title: anotationTitle,
        tag: tags.join("|"),
        groupId: params.groupId,
        type: selectedNoteType,
      };

      if (noteData.type === "arquivo" && !file?.uri) {
        Alert.alert('Erro',`Arquivo deve ser selecionado.`);
        return;
      } else if (noteData.type === "texto" && !anotationText) {
        Alert.alert('Erro',`Descrição de anotação deve estar preenchida.`);
        return;
      } else if (noteData.type === "foto" && !photoUri) {
        Alert.alert('Erro',`Foto não foi tirada.`);
        return;
      } else if (noteData.type === "desenho" && !drawBase64) {
        Alert.alert('Erro',`Desenho em branco.`);
        return;
      }
  
      if (noteData.type === "arquivo" && file?.uri) {
        noteData.fileUri = file?.uri; 
        noteData.fileName = file?.name; 
      } else if (noteData.type === "texto" && anotationText) {
        noteData.text = anotationText; 
      } else if (noteData.type === "foto" && photoUri) {
        noteData.fileUri = photoUri; 
      } else if (noteData.type === "desenho" && drawBase64) {
        noteData.base64 = drawBase64; 
      }
    
      const response = !id
        ? await noteService.createNote(noteData)
        : await noteService.updateNote(id, noteData); 

      setAnotation(response);
      setSelectedNoteType(response.type);
      setId(response._id)

      if(response.type === "foto"){
        setPhotoUri(await noteService.getFileUri(response.content))
      } else if(response.type === "desenho"){
        setDrawUri(await noteService.getFileUri(response.content))
      }

      setEdit(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro',"Erro no cadastro. Por favor, tente novamente.");
    }
  };

  const deleteNote = () => {
    Alert.alert('Deletar', 'Deseja deletar a anotação?', [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sim', 
          onPress: () => {
            noteService.deleteNote(id)
            .then(resp => {
              Alert.alert('Sucesso',`Deletado com sucesso.`);
              router.back();
              
            })
            .catch((error) => {
              Alert.alert('Erro',`Erro na deleção.`);
            }); 
          }
        },
      ]
    );
  }

  const downloadNoteFile = () => {
    noteService.downloadNoteFile(anotation.content, anotation.fileName)
      .then(resp => {
        setFileUri(resp);
      })
      .catch((error) => {
        Alert.alert('Erro',"Erro Ao fazer download.");
      }); 
  }

  const openNoteFile = () => {
    if(anotation.content){
      noteService.viewNoteFile(anotation.content);
    }
  }

  const enterEditMode = () => {
    setEdit(true);
    setAnotationTitle(anotation.title)
    setAnotationText(anotation.type === "texto" ? anotation.content : "")
    if(selectedNoteType === "desenho"){
      setDrawMode("d");
      setDrawColor("black");
      setDrawWidth(3);
    }
    if(selectedNoteType === "arquivo"){
      setFile(anotation.content);
    }
  }

  useEffect(() => {
    if(id){
      noteService.getNoteById(id).then(async resp => {
        setAnotation(resp);
        setSelectedNoteType(resp.type);
        setTags(resp.tag ? resp.tag?.split("|") : [])

        if(resp.type === "foto"){
          setPhotoUri(await noteService.getFileUri(resp.content))
        } else if(resp.type === "desenho"){
          setDrawUri(await noteService.getFileUri(resp.content))
        }
  
      }).catch((error)=> {
          Alert.alert('Erro',"Erro ao buscar nota.")
      })
    }
  }, [id]);

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
  }, [edit, id]);

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
          try {
            const result = await DocumentPicker.getDocumentAsync({
              type: '*/*', 
            });

      
            if (result.canceled) {
              return;
            }
      
            const fileAsset = result.assets ? result.assets[0] : null;
            if (fileAsset) {
              setFile(fileAsset);
            } else {
              console.log('No file selected');
            }
            
          } catch (error) {
            console.log('Error picking file', error);
          }
        };

        const fileName = file?.name ?? anotation?.fileName;
        
        return (
            <View style={{ gap: '10%', flex: 20, justifyContent: 'center' }}>
              {fileName && <Text style={{textAlign:'center'}}>Arquivo Selecionado: {fileName}</Text>}
              <Button label="Escolha o arquivo" onClick={pickFile} />
            </View>
        );

        case 'foto':

          const takePicture = async () => {
            if (cameraRef.current) {
              const photo = await cameraRef.current.takePictureAsync();
              if(photo){
                setPhotoUri(photo.uri);
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
                      signatureRef.current?.changePenColor("white")

                    } else {
                      setDrawMode("d")
                      signatureRef.current?.changePenColor(drawColor)
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
                style={{boxShadow: "0 3px 10px 2px rgba(0, 0, 0, 0.2)"}}
                backgroundColor="white"
                dataURL={anotation?.content}
                ref={signatureRef}
                onLoadEnd={handleEnd}
                onOK={handleOK}
                onEnd={handleEnd}
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
            <View style={{ gap: '5%', flex: 20, justifyContent: 'center', width: '90%' }}>
              <Text style={{textAlign: 'center'}}>Arquivo adicionado: </Text>              
              <Text style={{textAlign: 'center'}}>{anotation.fileName}</Text>              
              <Button label="Visualizar" onClick={openNoteFile} />
              <Button label="Baixar" onClick={downloadNoteFile} />
            </View>
        );

        case 'foto':
        case 'desenho':
          const uri = param === 'foto' ? photoUri : drawUri;
          return (
            <View style={{ flex: 0.8, justifyContent: 'center' }}>
              {uri ? (
                <View style={{ gap: '2%'}}>
                    <Text style={styles.imgText}>(Clique na imagem para expandir)</Text>
                    <Pressable onPress={() => noteService.openNoteFile(uri, true)}>
                      <Image source={{ uri }} style={{ width: 350, height: 400 }} resizeMode="contain" />
                    </Pressable>
                </View>
              ) : (
                <Text>
                  Sem imagem disponível para ser visualizada
                </Text>
              )}
            </View>
           
          );
                    
      default:
        return;
    }
  }

  const tagsList = 
    (edit || tags.length > 0) && <Pressable style={styles.containerTags} onPress={() => setModalTagVisible(true)}>
      {tags.length === 0 && <Text style={{textAlign: 'center', width:'100%'}}>Clique para adicionar tags</Text>}
      {tags.map((val, index) => index < 5 && <View key={`opt-${index}`} style={styles.tag}>
        <Text>{val}</Text>
      </View>
      )}
      {tags.length > 5 && <Text style={{ fontSize: 20 }}>...</Text>}
    </Pressable>

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Modal
        animationType="fade"
        visible={modalTagVisible}
        transparent={true}
        onRequestClose={() => {
          setModalTagVisible(!modalTagVisible);
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.modal}>
            {edit && <View style={styles.addTag}>
              <InputText placeholder="Adicionar Tag" textValue={addTagText} onChangeText={setAddTagText}/>
              <Button 
                iconName="plus-circle" 
                onClick={() => {
                  if(addTagText !== ''){
                    setTags([ addTagText ,...tags]);
                    setAddTagText('')
                  }
                }}
              />
            </View>}
            {!edit && 
              <Text style={{textAlign: 'center', fontSize: 20, marginBottom: 10}}>Tags</Text>
            }
            <ScrollView>
              {tags.map((tag, index) => 
                <View style={styles.card} key={`card-${index}`}>
                  <View style={{flexDirection: 'row', alignItems:'center'}}>
                      <Text style={styles.cardText}>
                        {tag}
                      </Text>
                      {edit && 
                        <Button iconName='trash-o' onClick={() => {
                          const updatedTags = tags.filter((_, i) => i !== index);
                          setTags(updatedTags); 
                        }}/>
                      }
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {!edit ? 
        <View style={{
          flex: 1,
          alignItems: "center",
        }}>
          <Header rightIcons={rightIcons} text={anotation?.title}/>

          <Picker
            style={{width: "40%"}}
            enabled={false}
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

          {tagsList}

          {renderViewNoteType(selectedNoteType)}

          {params.fromHome === 'true' && 
            <View style={styles.buttonGroup}>
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

          {tagsList}

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
    height: "70%",
    padding:10,
    boxShadow: "0 3px 10px 2px rgba(0, 0, 0, 0.2)"
  },
  text: {
    width: "100%",
    fontSize: 20,
    textAlign: 'justify',
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
    height: "10%",
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
  },
  containerTags:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '90%',
    gap: 5,
    marginBottom: '5%'
  },
  tag:{
    padding: 5,
    borderWidth: 1,
    borderRadius: 10
  },
  modalBackground:{
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal:{
    flex: 1,
    minWidth: '80%',
    maxHeight: '60%',
    margin: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20
  },
  card:{
    marginBottom: "4%",
    padding: 5,
    borderWidth: 1,
  },
  cardText:{
    textAlign:"center",
    fontSize:25,
    margin: 'auto',
    width: '65%',
  },
  addTag: {
    flexDirection: 'row', 
    justifyContent: "center",
    alignItems: "center",
    gap: "2%",
    marginBottom:"5%"}
});
