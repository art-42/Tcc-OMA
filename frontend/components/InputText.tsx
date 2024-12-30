import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

type InputTextProps = {
    label?: string;
    placeholder?: string;
    size?: string;
    position?: string;
    onChangeText: any;
    textValue: string;
    disabled?: boolean;
}

export default function InputText(inputProp : InputTextProps) {
  
  const handleTextChange = (text: string) => {
    if (inputProp.onChangeText) {
      inputProp.onChangeText(text);
    }
  };

  return(
    <View style={styles.container}>
      {
        inputProp.label &&
        <Text>
          {inputProp.label}
        </Text>
      }
      
      <TextInput
        style={[styles.inputBox, !inputProp.disabled && styles.border]}
        placeholder={inputProp.placeholder}
        textAlign={'center'}
        onChangeText={handleTextChange}
        value={inputProp.textValue}
        editable={!inputProp.disabled}
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
    borderRadius: 15,
    borderBottomWidth: 1,
    width:200
  },
  border:{
    borderWidth: 1
  }
});