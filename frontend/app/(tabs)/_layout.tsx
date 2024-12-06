import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="homeScreen" options={{ headerShown: false }} />
      <Stack.Screen name="signinScreen" options={{ headerShown: false }} />
      <Stack.Screen name="infoScreen" options={{ headerShown: false }} />
      <Stack.Screen name="changePasswordScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
