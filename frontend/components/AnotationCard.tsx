import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, View, Text, StyleSheet } from "react-native";

export type CardProps = {
    id?: string;
    groupId?: string;
    title?: string;
    type?: string;
    fromHome?: string;
}

export default function AnotationCard(prop : CardProps) {
  return (
    <View>
      <Pressable style={styles.container} onPress={() => router.push({pathname: "/(tabs)/anotationPage", params: {noteId: prop.id, groupId: prop.groupId, fromHome: prop.fromHome}})}>
        <View style={styles.titleDateRow}>
          <Text style={styles.text}>
            {prop.title}
          </Text>
          <FontAwesome
            size={ 30 }
            name={
              prop.type === 'texto' ? 'align-justify' :
              prop.type === 'arquivo' ? 'file-o' :
              prop.type === 'foto' ? 'camera' :
              'paint-brush'
            }
          />
          {/* <Text style={styles.text}>
            Tipo: {prop.type}
          </Text> */}
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    borderWidth: 1,
    marginHorizontal:"5%"
  },
  titleDateRow:{
    flexDirection: "row",  
    marginHorizontal:"10%",  
    marginVertical: "8%",
    alignItems: 'center'
  },
  categoryRow:{
    marginTop: 2,
    justifyContent: "flex-start"
  },
  text:{
    fontSize: 20,
    textAlign: "center",
    margin: 'auto',
  }
});