import { View, Text, StyleSheet } from "react-native";
import Button, { ButtonProps } from "@/components/Button";

type HeaderProps = {
    leftIcons?: ButtonProps[];
    rightIcons?: ButtonProps[];
    text?: string;
}

export default function HeaderProps({leftIcons, rightIcons, text} : HeaderProps) {

  return(
    <View style={styles.container}>
      <View style={[styles.icons, styles.leftIcons]}>
        {
          leftIcons?.map(i => 
            <Button label={i.label} iconName={i.iconName} href={i.href}/>
          )
        }
      </View>
      <Text style={styles.text}>{text}</Text>
      <View style={[styles.icons, styles.rightIcons]}>
        {
          rightIcons?.map(i => 
            <Button label={i.label} iconName={i.iconName} href={i.href}/>
          )
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    margin: 15,
    width: "98%",
    flexDirection: "row",    
    justifyContent: "space-between"

  },
  text:{
    fontSize: 20,
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto"
  },
  icons:{
    width: "20%",
    flexDirection: "row",
  },
  leftIcons:{
    alignItems: 'flex-start'
  },
  rightIcons:{
    justifyContent: 'flex-end'
  }
});