import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Header from "@/components/Header"
import { Text, View, StyleSheet } from "react-native";
import { useState } from "react";

export default function InfoScreen() {

  var leftIcons = [    
    {
      iconName: "arrow-left",
    }
  ]

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

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
        <InputText label="Nome" onChangeText={setName}></InputText>

        <InputText label="E-mail" onChangeText={setEmail}></InputText>

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
    gap: '20%',
  },
});
