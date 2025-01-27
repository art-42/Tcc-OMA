import Button from "@/components/Button";
import InputText from "@/components/InputText";
import { userService } from "@/services/userService";
import { useState } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAuth } from "../context/AuthContext";
import PasswordInput from "@/components/PasswordInput";

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // Controle de visibilidade da senha
  const router = useRouter(); 
  const { login } = useAuth();

  const loginUser = async () => {
    if (email === '' || password === '') {
      Alert.alert('Erro','Preencha todos os campos');
      return;
    }

    try {
      const resp = await userService.loginUser({ email, password });
      const { user, token } = resp;

      if (token) {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('idUser', user.id);
        login(token, user);
        router.push('/(tabs)/home');
      } else {
        Alert.alert('Erro','Erro ao obter o token. Tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro','Erro ao fazer login. Tente novamente.');
    }
  };

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible); // Alternar visibilidade da senha

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

        {}
        <PasswordInput
          placeholder="senha"
          textValue={password}
          onChangeText={setPassword}
          isPasswordVisible={passwordVisible}
          togglePasswordVisibility={togglePasswordVisibility}
        />

        <Button label="entrar" onClick={loginUser} />
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
    textAlign: 'center',
  },
  inputInfoContainer: {
    flex: 18,
    gap: '8%',
    textAlign: 'center',
  },
});
