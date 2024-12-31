import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Header from "@/components/Header";
import { Text, View, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";

export default function InfoScreen() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');


  useEffect(() => {
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    userService.getUser(user.id)
      .then(resp => {
        const fetchedUser = resp.user;
        setName(fetchedUser.name);
        setEmail(fetchedUser.email);
      })
      .catch(() => {
        Alert.alert("Erro", "Não foi possível carregar as informações do usuário");
      });
  }, [user]);

  // Validação simples de email
  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Salva as alterações no banco de dados
  const save = () => {
    if (name === '' || email === '') {
      Alert.alert("Erro", "Todos os campos precisam estar preenchidos");
      return;
    }

    if (!isEmailValid(email)) {
      Alert.alert("Erro", "Por favor, insira um email válido");
      return;
    }

    if (user) {
      userService.updateUser({ id: user.id, name, email })
        .then(resp => {
          const updatedUser = resp.user;
          Alert.alert(
            "Sucesso",
            `Dados atualizados com sucesso`
          );
        })
        .catch(() => {
          Alert.alert("Erro", "Não foi possível atualizar as informações do usuário");
        });
    }
  };

  const leftIcons = [
    {
      iconName: "arrow-left",
      href: "/home"
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header leftIcons={leftIcons} text="Informações de Cadastro" />
      </View>
      <View style={styles.inputInfoContainer}>
        <InputText label="Nome" textValue={name} onChangeText={setName} />
        <InputText label="E-mail" textValue={email} onChangeText={setEmail} />
        <Button label="Salvar" onClick={save} />
      </View>
      <Button label="Alterar a senha" href="/changePasswordScreen" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: "5%",
  },
  headerContainer: {
    flex: 8,
    width: "100%",
  },
  inputInfoContainer: {
    flex: 18,
    width: "100%",
    gap: 20,
  },
});
