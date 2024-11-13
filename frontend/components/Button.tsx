import { FontAwesome } from "@expo/vector-icons";
import { Pressable, View, Text, StyleSheet } from "react-native";

export type ButtonProps = {
    label?: string;
    iconName?: any;
    border?: boolean;
}

export default function Button({label, iconName, border} : ButtonProps) {
  return iconName ? 
(
    <Pressable
      onPress={() => alert("Pressionou um botão")}
    >
      
      <FontAwesome
        size={30}
        name={iconName}
      />
    </Pressable>
  ) : (
    <Pressable
      onPress={() => alert("Pressionou um botão")}
      style={[styles.container, border ? styles.containerBorder : {}]}
    >
      
      <Text
        style={styles.label}
      >{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container:{
    width: "50%",
    justifyContent:"center"
  },
  containerBorder:{
    alignSelf:"center",
    borderColor: '#000000',
    borderWidth: 2,
    borderRadius: 10
  },
  label:{
    textAlign: "center",
    margin: 6
  }
});