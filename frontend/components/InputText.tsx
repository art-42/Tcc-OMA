import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

type InputTextProps = {
    label?: string;
    placeholder?: string;
    size?: string;
    position?: string;
    onChangeText: any;
    textValue: string
}

export default function InputText({label, placeholder, onChangeText, textValue} : InputTextProps) {
  
  const handleTextChange = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    }
  };

  return(
    <View style={styles.container}>
      {
        label &&
        <Text>
          {label}
        </Text>
      }
      
      <TextInput
        style={styles.inputBox}
        placeholder={placeholder}
        textAlign={'center'}
        onChangeText={handleTextChange}
        value={textValue}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    justifyContent: "center",
    alignItems: "center",
  },
  inputBox:{
    borderWidth: 1,
    borderRadius: 15,
    width:200
  }
});