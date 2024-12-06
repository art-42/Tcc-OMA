import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Header from "@/components/Header"
import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { userService } from "@/services/userService";

export default function ChangePasswordScreen() {

  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const save = () => {
     if(password !== confirmPassword){
      alert('As senhas precisão ser iguais')
    } else {

      userService.updateUser({
        id: '67521dff1b5b5e57511f521f',
        password
      }).then(resp => {
        var user = resp.user;
        alert(`senha trocada com sucesso: senha nova:${user.password} \n`)
      }).catch(()=> {
        alert(`Erro no cadastro de pessoa`)
      })
    }
  }

  var leftIcons = [    
    {
      iconName: "arrow-left",
      href: "/infoScreen"
    }
  ]

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: '5%'
      }}
    >
      
      <View style={styles.headerContainer}>
        <Header leftIcons={leftIcons} text="Alterar senha"></Header>
      </View>
      <View style={styles.inputInfoContainer}>
        <InputText label="Senha" textValue={password} onChangeText={setPassword}></InputText>

        <InputText label="Confimar senha" textValue={confirmPassword} onChangeText={setConfirmPassword}></InputText>

      </View>

      <Button label="Salvar" onClick={save}></Button>

    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer:{
    flex: 8
  },
  topText:{
    fontSize: 20,
    textAlign: 'center'
  },
  inputInfoContainer:{
    flex: 18,
    gap: '20%',
  },
});
