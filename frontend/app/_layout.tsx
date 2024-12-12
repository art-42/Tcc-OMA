import { Stack } from "expo-router";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        // Redireciona para a tela de login se não houver token de autenticação
        router.replace("/(tabs)");
      } else {
        // Redireciona para a tela principal (ou outra que você prefira)
        router.replace("/(tabs)");
      }
    };
    checkAuth();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
