import { View, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable, Text } from "react-native";
import { useEffect, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import React from 'react';
import Header from "@/components/Header"
import InputText from "@/components/InputText";
import Button from "@/components/Button";
import { categoryService } from "@/services/categoryService";

export default function CategoryPage() {

  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState('');
  const [currentCategoryName, setCurrentCategoryName] = useState('');

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const addCategory = () => {
    setCurrentCategoryName('')
    setModalVisible(true)
    setEdit(false)
  }

  const editCategory = (id: string, name:string) => {
    setCurrentCategoryName(name)
    setCurrentCategoryId(id)
    setModalVisible(true)
    setEdit(true)
  }

  const deleteGroup = () => {
    categoryService.deleteCategory(currentCategoryId)
      .then(resp => {
        alert(`deletado com sucesso`);  
        setModalVisible(false);
        fetchCategoryData();     
      })
      .catch((error) => {
        alert(`Erro na deleção`);
      }); 
  }

  const saveCategory = () => {
    (!edit ? categoryService.createCategory({name: currentCategoryName}) : 
             categoryService.updateCategory(currentCategoryId , {name: currentCategoryName}))
      .then(resp => {
        const category = resp.category;
        alert(`Cadastro concluído: \n nome: ${category.name} \n`);
        fetchCategoryData()
        setModalVisible(false)
      })
      .catch((error) => {
        console.log(error)
        alert(`Erro no cadastro`);
      }); 
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <TouchableOpacity style = {{flex: 2}}>
        <Header text="Categorias" />
      </TouchableOpacity>

      <View style={styles.scrollView}>
        <ScrollView>
          {categories.map(category => 
            <View style={styles.card} key={category._id}>
              <View>
                <Pressable style={styles.container} onPress={ () => editCategory(category._id, category.name)}
              >
                <View>
                  <Text style={styles.text}>
                    {category.name}
                  </Text>
                </View>
              </Pressable>
            </View>
            </View>
          )}
        </ScrollView>
      </View>

      <View style= {styles.buttonGroup}>
        <Button iconName="plus-circle" onClick={addCategory}></Button>
      </View>  

        <Modal
          animationType="fade"
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modal}>
              <View style={styles.inputInfoContainer}>
                <InputText placeholder="Nome da Categoria" textValue={currentCategoryName} onChangeText={setCurrentCategoryName} />
                <View style={{flexDirection: 'row', gap: '5%', justifyContent: 'center'}}>
                  <Button label="Salvar" onClick={saveCategory} />

                  {edit && 
                    <Button label="Excluir" onClick={deleteGroup} />
                  }
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
  );

  function fetchCategoryData() {
    categoryService.getCategories().then(resp => {
      setCategories(resp.categorias);

    }).catch(() => {
      alert(`Erro ao encontrar anotações do grupo`);
    });
  }
}

const styles = StyleSheet.create({
  scrollView:{
    flex: 15,
    width: "100%",
  },
  card:{
    marginBottom: "3%"
  },
  buttonGroup:{
    flex: 2,
    paddingTop: 15,
    alignItems: "center"
  },
  inputInfoContainer: {
    justifyContent: "center",
    flex: 5,
    gap: '10%',
  },
  headerCreateText: {
    flex: 2,
    paddingTop: 15,
    fontSize: 20
  },
  inputCreateInfoContainer: {
    alignItems:"center",
  },
  modalBackground:{
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal:{
    flex: 1,
    minWidth: '80%',
    maxHeight: '22%',
    margin: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: 15
  },
  container:{
    borderWidth: 1,
    marginHorizontal:"8%"
  },
  titleDateRow:{
    flexDirection: "column",  
  },
  categoryRow:{
    marginTop: 2,
    justifyContent: "flex-start"
  },
  text:{
    fontSize: 18,
    textAlign: "center",
    marginVertical: "5%"
  }
});
