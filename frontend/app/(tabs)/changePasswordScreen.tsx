import Button from "@/components/Button";
import Header from "@/components/Header";
import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { userService } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";  // Importando o hook useAuth
import PasswordInput from "@/components/PasswordInput";  
import { useRouter } from "expo-router";

export default function ChangePasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const { user } = useAuth();  // Pegando o usuário autenticado do contexto

  const handleSubmit = () => {
   
    if (password !== confirmPassword) {
      alert('As senhas precisam ser iguais');
      return false;
    }

    if (password.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres.");
      return false;
    }
    return true;
  };


  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const save = async () => {
    if (handleSubmit()){


    if (!user?.id) {
      alert('Usuário não encontrado');
      return;
    }

    try {
      setLoading(true);
      
      const response = await userService.updateUser({
        id: user.id,
        password
      });

      if (response.user) {
        alert(`Senha trocada com sucesso`);
        router.push('/(tabs)/home'); 
      } else {
        alert('Erro ao alterar a senha');
      }

    } catch (error) {
      alert('Erro ao alterar a senha. Tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  };

  const leftIcons = [
    {
      iconName: "arrow-left",
      href: "/infoScreen"
    }
  ];

  return (
    <View style={{ flex: 1, alignItems: "center", padding: '5%' }}>
      <View style={styles.headerContainer}>
        <Header leftIcons={leftIcons} text="Alterar senha" />
      </View>
      <View style={styles.inputInfoContainer}>
        <PasswordInput
          placeholder="Senha"
          textValue={password}
          onChangeText={setPassword}
          isPasswordVisible={passwordVisible}
          togglePasswordVisibility={togglePasswordVisibility}
        />
        <PasswordInput
          placeholder="Confirmar Senha"
          textValue={confirmPassword}
          onChangeText={setConfirmPassword}
          isPasswordVisible={passwordVisible}
          togglePasswordVisibility={togglePasswordVisibility}
        />
      </View>

      <Button label="Salvar" onClick={save}  />
      
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 8
  },
  inputInfoContainer: {
    flex: 18,
    gap: '20%',
  },
});
