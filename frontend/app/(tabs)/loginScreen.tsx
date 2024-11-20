import Button from "@/components/Button";
import InputText from "@/components/InputText";
import { Text, View, StyleSheet } from "react-native";

export default function LoginScreen() {
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
        <InputText placeholder="email"></InputText>

        <InputText placeholder="senha"></InputText>

        <Button label="entrar"></Button>
      </View>

      <Button label="Criar Nova Conta"></Button>

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
