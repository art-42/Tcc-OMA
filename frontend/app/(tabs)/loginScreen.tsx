import Button from "@/components/Button";
import InputText from "@/components/InputText";
import { userService } from "@/services/userService";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function LoginScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    if(email === '' || password === ''){
      alert('Preencha todos os campos')
    } else {
      userService.loginUser({
        email,
        password
      }).then(resp => {
        var user = resp.user;
        alert(`login concluído: \n nome:${user.name} \n email:${user.email} \n`)
      }).catch(()=> {
        alert(`Erro ao fazer login`)
      })
    }
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: '5%'
      }}
    >
      <View style={styles.topTextContainer}>
        <Text style={styles.topText}>Bem vindo</Text>
        <Text style={styles.topText}>Faça o Login ou crie uma nova conta</Text>
      </View>
     
      <View style={styles.inputInfoContainer}>
        <InputText placeholder="email" textValue={email} onChangeText={setEmail}></InputText>

        <InputText placeholder="senha" textValue={password} onChangeText={setPassword}></InputText>

        <Button label="entrar" onClick={login}></Button>
      </View>

      <Button label="Criar Nova Conta" href={'/signinScreen'}></Button>

    </View>
  );
}

const styles = StyleSheet.create({
  topTextContainer:{
    flex: 15,
    gap: '20%',
    width: '60%',
  },
  topText:{
    fontSize: 20,
    textAlign: 'center'
  },
  inputInfoContainer:{
    flex: 18,
    gap: '8%',
  },
});
