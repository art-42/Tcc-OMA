import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Header from "@/components/Header"
import { Text, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { userService } from "@/services/userService";

export default function InfoScreen() {

  const id = '67521dff1b5b5e57511f521f'

  var leftIcons = [    
    {
      iconName: "arrow-left",
    }
  ]

  useEffect(() => {
    userService.getUser(id).then(resp => {
      var user = resp.user;
      setName(user.name)
      setEmail(user.email)
    }).catch(()=> {
      alert(`Erro no cadastro de pessoa`)
    })}, [id]);


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');


  const save = () => {
    if(email === '' || name === ''){
     alert('Todos os campos precisam estar preenchidos')
   } else {

     userService.updateUser({
       id: '67521dff1b5b5e57511f521f',
       name,
       email
     }).then(resp => {
       var user = resp.user;
       alert(`dados atualizados com sucesso: \n name:${user.name} \n email:${user.email}`)
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
        padding: '5%'
      }}
    >
      
      <View style={styles.headerContainer}>
        <Header leftIcons={leftIcons} text="Informações de cadastro"></Header>
      </View>
      <View style={styles.inputInfoContainer}>
        <InputText label="Nome" textValue={name} onChangeText={setName}></InputText>

        <InputText label="E-mail" textValue={email} onChangeText={setEmail}></InputText>

        <Button label="Salvar" onClick={save}></Button>

      </View>

        <Button label="Alterar a senha" href={'/changePasswordScreen'}></Button>


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
    gap: '10%',
  },
});
