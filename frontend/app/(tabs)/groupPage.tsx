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
import { Picker } from "@react-native-picker/picker";
import { categoryService } from "@/services/categoryService";

export default function GroupPage() {

  const router = useRouter();

  var groupInfo = useLocalSearchParams<{ id: string}>();

  const [id, setId] = useState(groupInfo.id);
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [edit, setEdit] = useState(false);

  const [anotations, setAnotation] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchGroupData();
    fetchCategoryData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchGroupData();
    }, [])
  );

  const saveGroup = () => {
    groupService.createGroup({name, categoryId: selectedCategory})
      .then(resp => {
        const group = resp.group;
        alert(`Cadastro concluído: \n nome: ${group.name} \n`);
        
        setId(group._id);
      })
      .catch((error) => {

        alert(`Erro no cadastro`);
      }); 
  }

  const updateGroup = () => {
    groupService.updateGroup(id, {name, categoryId: selectedCategory})
      .then(resp => {
        const group = resp.group;
        alert(`Cadastro concluído: \n nome: ${group.name} \n`);
        setEdit(false);
        
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


  const rightIcons = !edit ? 
  [
    {
      iconName: "edit",
      onClick: () => {
        setEdit(true);
      }
    },
    {
      iconName: "trash",
      onClick: deleteGroup
    },
  ] : [
    {
      iconName: "check",
      onClick: () => {
        updateGroup();
      }
    },
  ];

  function fetchGroupData() {
    if (id) {
      groupService.getGroupById(id).then(resp => {
        setName(resp.group.name);
        setSelectedCategory(resp.group.categoryId);

      }).catch(() => {
        alert(`Erro ao encontrar grupo`);
      });
      noteService.getNotesByGroup(id).then(resp => {
        setAnotation(resp);

      }).catch(() => {
        alert(`Erro ao encontrar anotações do grupo`);
      });
    }
  }

  function fetchCategoryData() {
    categoryService.getCategories().then(resp => {
      setCategories(resp.categorias);

    }).catch(() => {
      alert(`Erro ao encontrar categorias`);
    });
  }

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
              <InputText placeholder="Título" disabled={!edit} textValue={name} onChangeText={setName} />
              <View style={[styles.categoryPicker, edit && styles.border]}>
                <Picker
                  selectedValue={selectedCategory}
                  enabled={edit}
                  onValueChange={(itemValue) =>
                    setSelectedCategory(itemValue)
                }>
                  <Picker.Item label="Sem categoria" value={''} style={{ color: '#707070' }} />
                  {
                    categories.map(category =>
                      <Picker.Item label={category.name} value={category._id} key={category._id}/>
                    )
                  }
                </Picker>
              </View>
            </View>

            <View style={styles.scrollView}>
              <ScrollView>
                {anotations?.map(anotation => 
                  <View style={styles.card} key={anotation._id}>
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
              <View style={[styles.categoryPicker, styles.border]}>
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={(itemValue) =>
                    setSelectedCategory(itemValue)
                }>
                  <Picker.Item label="Sem categoria" value={undefined}/>
                  {
                    categories.map(category =>
                      <Picker.Item label={category.name} value={category._id} key={category._id}/>
                    )
                  }
                </Picker>
              </View>
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
    alignContent: "center",
    flex: 5,
  },
  categoryPicker: {
    width: 200,
    marginTop: '5%',
    marginHorizontal: 'auto',
    borderBottomWidth: 1,
  },
  border: {
    borderWidth: 1,
    borderRadius:15
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
