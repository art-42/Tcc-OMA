import { View, Text, StyleSheet } from "react-native";
import Button, { ButtonProps } from "@/components/Button";

type HeaderProps = {
  leftIcons?: ButtonProps[];
  rightIcons?: ButtonProps[];
  text?: string;
};

export default function HeaderProps({ leftIcons, rightIcons, text }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.icons, styles.leftIcons]}>
        {leftIcons?.map((i, index) => (
          <Button 
            key={`left-${index}`} // Adicione uma `key` única
            label={i.label} 
            iconName={i.iconName} 
            href={i.href} 
            onClick={i.onClick}
          />
        ))}
      </View>
      <Text style={styles.text}>{text}</Text>
      <View style={[styles.icons, styles.rightIcons]}>
        {rightIcons?.map((i, index) => (
          <Button 
            key={`right-${index}`}
            label={i.label} 
            iconName={i.iconName} 
            href={i.href}
            onClick={i.onClick}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    width: "98%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    width: "60%",
  },
  icons: {
    width: "20%",
    flexDirection: "row",
  },
  leftIcons: {
    alignItems: "flex-start",
  },
  rightIcons: {
    justifyContent: "flex-end",
  },
});
