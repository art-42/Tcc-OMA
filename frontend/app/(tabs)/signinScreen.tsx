import Button from "@/components/Button";
import InputText from "@/components/InputText";
import { userService } from "@/services/userService";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; // Para navegação

export default function SigninScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter(); // Navegação após cadastro

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    if (name === '' || email === '' || password === '' || confirmPassword === '') {
      alert('Preencha todos os campos');
      return false;
    }
    if (password !== confirmPassword) {
      alert('As senhas precisam ser iguais');
      return false;
    }
    if (!validateEmail(email)) {
      alert("Por favor, insira um email válido.");
      return false;
    }

    if (password.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres.");
      return false;
    }
    return true;
  };


  const save = () => {
     
    if (handleSubmit()){
      userService.createUser({ email, name, password })
        .then(resp => {
          const user = resp.user;
          alert(`Cadastro concluído: \n nome: ${user.name} \n email: ${user.email}`);
          
          router.push('/(tabs)'); 

        })
        .catch((error) => {

          alert(`Erro no cadastro: Email já cadastrado!`);
        });
        
    }

  };

  return (
    <View style={{ flex: 1, alignItems: "center", padding: '3%' }}>
      <View style={styles.topTextContainer}>
        <Text style={styles.topText}>Cadastro</Text>
        <Text style={styles.topText}>Preencha os dados abaixo para criar sua conta</Text>
      </View>

      <View style={styles.inputInfoContainer}>
        <InputText placeholder="nome" textValue={name} onChangeText={setName} />
        <InputText placeholder="email" textValue={email} onChangeText={setEmail} />
        <InputText placeholder="senha" textValue={password} onChangeText={setPassword} />
        <InputText placeholder="Confirmar senha" textValue={confirmPassword} onChangeText={setConfirmPassword} />
      </View>

      <View style={styles.bottonButton}>
        <Button label="Cadastrar" onClick={save} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topTextContainer: {
    flex: 12,
    gap: '20%',
    width: '60%',
  },
  topText: {
    fontSize: 20,
    textAlign: 'center',
  },
  inputInfoContainer: {
    flex: 18,
    gap: '5%',
  },
  bottonButton: {
    flex: 4,
    gap: '8%',
  },
});
