import { useRouter } from "expo-router";
import { Pressable, View, Text, StyleSheet } from "react-native";

export type CardProps = {
    id?: string;
    title?: string;
    categoryId?: string;
    categoryName?: string;
    date?: string;
    time?: string;
}

export default function GroupCard(prop : CardProps) {

  const router = useRouter();

  const onPress = () => {
    router.push({pathname: "/(tabs)/groupPage", params: {id: prop.id, name: prop.title, category: prop.categoryId}})
  }

  return (
    <View>
      <Pressable style={styles.container} onPress={onPress}>
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
            {prop.categoryName}
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