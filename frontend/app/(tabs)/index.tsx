import Button from "@/components/Button";
import InputText from "@/components/InputText";
import { userService } from "@/services/userService";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();  // Move 'useRouter' here to prevent creating it multiple times

  const login = async () => {
    if (email === '' || password === '') {
      alert('Preencha todos os campos');
      return; // Exit early if fields are empty
    }

    try {
      const resp = await userService.loginUser({ email, password });
      const { user, token } = resp;

      // Armazenando o token no AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('idUser', user.id);

      // Exibe os dados do usuário
      alert(`Login concluído: \n nome: ${user.name} \n email: ${user.email}`);

      // Navegar para outra tela após o login
      router.push('/(tabs)/home');
    } catch (error) {
      // Tratar qualquer erro que ocorrer no login
      alert('Erro ao fazer login');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", padding: '5%' }}>
      <View style={styles.topTextContainer}>
        <Text style={styles.topText}>Bem-vindo</Text>
        <Text style={styles.topText}>Faça o Login ou crie uma nova conta</Text>
      </View>
     
      <View style={styles.inputInfoContainer}>
        <InputText
          placeholder="email"
          textValue={email}
          onChangeText={setEmail}
        />
        <InputText
          placeholder="senha"
          textValue={password}
          onChangeText={setPassword}
        />
        <Button label="entrar" onClick={login} />
      </View>

      <Button label="Criar Nova Conta" href={'/signinScreen'} />
    </View>
  );
}

const styles = StyleSheet.create({
  topTextContainer: {
    flex: 15,
    gap: '20%',
    width: '60%',
  },
  topText: {
    fontSize: 20,
    textAlign: 'center'
  },
  inputInfoContainer: {
    flex: 18,
    gap: '8%',
  },
});
