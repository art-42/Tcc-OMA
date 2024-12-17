import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

// Definindo o tipo de InputTextProps
export type InputTextProps = {
    label?: string;
    placeholder?: string;
    size?: string;
    position?: string;
    onChangeText: (text: string) => void;  // Melhorando o tipo da função onChangeText
    textValue: string;
}

// Componente InputText
const InputText: React.FC<InputTextProps> = ({ label, placeholder, onChangeText, textValue }) => {

  const handleTextChange = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    }
  };

  return(
    <View style={styles.container}>
      {label && <Text>{label}</Text>}
      
      <TextInput
        style={styles.inputBox}
        placeholder={placeholder}
        textAlign={'center'}
        onChangeText={handleTextChange}
        value={textValue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: 15,
    width: 200,
  },
});

export default InputText;  // Exportando o componente
