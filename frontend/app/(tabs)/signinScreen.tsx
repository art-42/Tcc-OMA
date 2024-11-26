import Button from "@/components/Button";
import InputText from "@/components/InputText";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function SigninScreen() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: '3%'
      }}
    >
      <View style={styles.topTextContainer}>
        <Text style={styles.topText}>Cadastro</Text>
        <Text style={styles.topText}>Preencha os dados abaixo para criar sua conta</Text>
      </View>
     
      <View style={styles.inputInfoContainer}>
        <InputText placeholder="nome" onChangeText={setName}></InputText>

        <InputText placeholder="email" onChangeText={setEmail}></InputText>

        <InputText placeholder="senha" onChangeText={setPassword}></InputText>

        <InputText placeholder="Confirmar senha" onChangeText={setConfirmPassword}></InputText>

      </View>

      <View style={styles.bottonButton}>
      <Button label="Cadastrar"></Button>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  topTextContainer:{
    flex: 12,
    gap: '20%',
    width: '60%',
  },
  topText:{
    fontSize: 20,
    textAlign: 'center'
  },
  inputInfoContainer:{
    flex: 18,
    gap: '5%',
  },

  bottonButton:{
    flex: 4,
    gap: '8%',
  },
});
