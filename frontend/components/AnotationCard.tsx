import { router } from "expo-router";
import { Pressable, View, Text, StyleSheet } from "react-native";

export type CardProps = {
    title?: string;
    type?: string;
}

export default function AnotationCard(prop : CardProps) {
  return (
    <View>
      <Pressable style={styles.container} onPress={() => router.push("/(tabs)/anotationPage")}>
        <View style={styles.titleDateRow}>
          <Text style={styles.text}>
            Título: {prop.title}
          </Text>
          <Text style={styles.text}>
            Tipo: {prop.type}
          </Text>
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    borderWidth: 1,
    marginHorizontal:"8%"
  },
  titleDateRow:{
    flexDirection: "column",  
    margin:"5%"  
  },
  categoryRow:{
    marginTop: 2,
    justifyContent: "flex-start"
  },
  text:{
    fontSize: 20,
    textAlign: "center",
    marginVertical: "5%"
  }
});