import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import React from 'react';
import Header from "@/components/Header"
import Button from "@/components/Button";

export default function AnotationPage() {

  const router = useRouter();

  const [edit, setEdit] = useState(false);

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

  const [anotationText, setAnotationText] = useState('');

  const anotation = {
    title: "Anotação 1",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in massa viverra ligula lobortis hendrerit. Phasellus sagittis magna quis mauris dictum consectetur. Sed et commodo nunc. Aenean pharetra eu nunc eu efficitur Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in massa viverra ligula lobortis hendrerit. Phasellus sagittis magna quis mauris dictum consectetur. Sed et commodo nunc. Aenean pharetra eu nunc eu efficitur Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in massa viverra ligula lobortis hendrerit. Phasellus sagittis magna quis mauris dictum consectetur. Sed et commodo nunc. Aenean pharetra eu nunc eu efficitur Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in massa viverra ligula lobortis hendrerit. Phasellus sagittis magna quis mauris dictum consectetur. Sed et commodo nunc. Aenean pharetra eu nunc eu efficitur Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in massa viverra ligula lobortis hendrerit. Phasellus sagittis magna quis mauris dictum consectetur. Sed et commodo nunc. Aenean pharetra eu nunc eu efficitur Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in massa viverra ligula lobortis hendrerit. Phasellus sagittis magna quis mauris dictum consectetur. Sed et commodo nunc. Aenean pharetra eu nunc eu efficitur Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in massa viverra ligula lobortis hendrerit. Phasellus sagittis magna quis mauris dictum consectetur. Sed et commodo nunc. Aenean pharetra eu nunc eu efficitur Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in massa viverra ligula lobortis hendrerit. Phasellus sagittis magna quis mauris dictum consectetur. Sed et commodo nunc. Aenean pharetra eu nunc eu efficitur Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in massa viverra ligula lobortis hendrerit. Phasellus sagittis magna quis mauris dictum consectetur. Sed et commodo nunc. Aenean pharetra eu nunc eu efficitur Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in massa viverra ligula lobortis hendrerit. Phasellus sagittis magna quis mauris dictum consectetur. Sed et commodo nunc. Aenean pharetra eu nunc eu efficitur"
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <Header rightIcons={rightIcons} text={anotation.title} leftIcons={leftIcons} />

      {!edit ? 
        <View style={styles.scrollView}>
          <ScrollView>
            <Text style={styles.text}>{anotation.text}</Text>
          </ScrollView>
        </View>
        :

        <View style={styles.containerTextInput}>
          <TextInput
            editable
            multiline
            numberOfLines={50}
            onChangeText={text => setAnotationText(text)}
            value={anotationText}
            style={styles.inputBox}
          />

          <View style= {styles.buttonGroup}>
            <Button label="Salvar" border={true}></Button>
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
});
