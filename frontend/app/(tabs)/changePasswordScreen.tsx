import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Header from "@/components/Header"
import { Text, View, StyleSheet } from "react-native";
import React from "react";

export default function ChangePasswordScreen() {

  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

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
        <InputText label="Senha" onChangeText={setPassword}></InputText>

        <InputText label="Confimar senha" onChangeText={setConfirmPassword}></InputText>

      </View>

      <Button label="Salvar" onClick={() => alert(`${password} ${confirmPassword}`)}></Button>

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
