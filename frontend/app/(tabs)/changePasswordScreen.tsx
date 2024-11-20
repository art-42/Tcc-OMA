import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Header from "@/components/Header"
import { Text, View, StyleSheet } from "react-native";

export default function ChangePasswordScreen() {

  var leftIcons = [    
    {
      iconName: "arrow-left"
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
        <InputText label="Senha"></InputText>

        <InputText label="Confimar senha"></InputText>

      </View>

      <Button label="Salvar"></Button>

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
