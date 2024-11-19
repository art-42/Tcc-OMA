import { View, Text, StyleSheet, TextInput } from "react-native";

type InputTextProps = {
    label?: string;
    placeholder?: string;
    size?: string;
    position?: string;
}

export default function InputText({label, placeholder} : InputTextProps) {
  return(
    <View style={styles.container}>
      {
        label &&
        <Text>
          {label}
        </Text>
      }
      
      <TextInput
        style={styles.inputBox}
        placeholder={placeholder}
        textAlign={'center'}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    justifyContent: "center",
    alignItems: "center",
  },
  inputBox:{
    borderWidth: 1,
    borderRadius: 15,
    width:200
  }
});