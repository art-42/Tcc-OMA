import Button from "@/components/Button";
import InputText from "@/components/InputText";
import { userService } from "@/services/userService";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function SigninScreen() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const save = () => {
    if(name === '' || email === '' || password === '' || confirmPassword === '' ){
      alert('Preencha todos os campos')
    } else if(password !== confirmPassword){
      alert('As senhas precisão ser iguais')
    } else {

      userService.createUser({
        email,
        name,
        password
      }).then(resp => {
        var user = resp.user;
        alert(`Cadastro concluído: \n nome:${user.name} \n email:${user.email} \n`)
      }).catch(()=> {
        alert(`Erro no cadastro de pessoa`)
      })
    }
  }

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
        <InputText placeholder="nome" textValue={name} onChangeText={setName}></InputText>

        <InputText placeholder="email" textValue={email} onChangeText={setEmail}></InputText>

        <InputText placeholder="senha" textValue={password} onChangeText={setPassword}></InputText>

        <InputText placeholder="Confirmar senha" textValue={confirmPassword} onChangeText={setConfirmPassword}></InputText>

      </View>

      <View style={styles.bottonButton}>
        <Button label="Cadastrar" onClick={save}></Button>
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
