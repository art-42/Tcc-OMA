import React from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

type PasswordInputProps = {
  placeholder: string;
  textValue: string;
  onChangeText: (text: string) => void;
  isPasswordVisible: boolean;
  togglePasswordVisibility: () => void;
};

export default function PasswordInput({ placeholder, textValue, onChangeText, isPasswordVisible, togglePasswordVisibility }: PasswordInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputBox}
        placeholder={placeholder}
        value={textValue}
        onChangeText={onChangeText}
        secureTextEntry={!isPasswordVisible}  // Controla a visibilidade da senha
      />
      <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconButton}>
        <FontAwesome name={isPasswordVisible ? 'eye-slash' : 'eye'} size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: 15,
    width: 200,
    height: 40,
    paddingRight: 40, // Espaço para o ícone
  },
  iconButton: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
});
