import { Pressable, View, Text, StyleSheet } from "react-native";

export type CardProps = {
    title?: string;
    category?: string;
    date?: string;
    time?: string;
}

export default function AnotationCard(prop : CardProps) {
  return (
    <View>
      <Pressable style={styles.container}>
        <View style={styles.titleDateRow}>
          <Text style={styles.text}>
            {prop.title}
          </Text>
          <Text style={styles.text}>
            {prop.time}
          </Text>
        </View>
        <View style={styles.categoryRow}>
          <Text style={styles.text}>
            {prop.category}
          </Text>
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    padding: 2,
    borderWidth: 1
  },
  titleDateRow:{
    flexDirection: "row",    
    justifyContent: "space-between"
  },
  categoryRow:{
    marginTop: 2,
    justifyContent: "flex-start"
  },
  text:{
    fontSize: 20
  }
});