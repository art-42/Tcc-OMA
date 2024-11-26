import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

type InputTextProps = {
    label?: string;
    placeholder?: string;
    size?: string;
    position?: string;
    onChangeText: any;
}

export default function InputText({label, placeholder, onChangeText} : InputTextProps) {
  const [text, setText] = React.useState('');  
  
  const handleTextChange = (text: React.SetStateAction<string>) => {
    setText(text);
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
        value={text}
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