import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack initialRouteName="home">
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="infoScreen" options={{ headerShown: false }} />
      <Stack.Screen name="changePasswordScreen" options={{ headerShown: false }} />
    </Stack>
  );
}

