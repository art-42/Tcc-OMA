import { router } from "expo-router";
import { Pressable, View, Text, StyleSheet } from "react-native";

export type CardProps = {
    id?: string;
    groupId?: string;
    title?: string;
    type?: string;
}

export default function AnotationCard(prop : CardProps) {
  return (
    <View>
      <Pressable style={styles.container} onPress={() => router.push({pathname: "/(tabs)/anotationPage", params: {noteId: prop.id, groupId: prop.groupId}})}>
        <View style={styles.titleDateRow}>
          <Text style={styles.text}>
            Título: {prop.title}
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