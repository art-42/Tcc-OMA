import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
       <Tabs.Screen name="index" options={{ headerShown: false }} />
       <Tabs.Screen name="loginScreen" options={{ headerShown: false }} />
       <Tabs.Screen name="signinScreen" options={{ headerShown: false }} />
       <Tabs.Screen name="infoScreen" options={{ headerShown: false }} />
       <Tabs.Screen name="changePasswordScreen" options={{ headerShown: false }} />
    </Tabs>
  );
}

