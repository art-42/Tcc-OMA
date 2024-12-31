import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";

export type ButtonProps = {
    label?: string;
    iconName?: any;
    border?: boolean;
    onClick?: () => void;
    href?: any;
}

export default function Button({label, iconName, border, onClick, href} : ButtonProps) {
  const content = (
    <Pressable
      onPress={ onClick ? () => onClick() : null}
    >
      {iconName && 
        <FontAwesome
          size={30}
          name={iconName}
        />
      }
      {href ?
          <Link href={href} asChild>
              <Text style={styles.label}>{label}</Text>
          </Link>
          :
          <Text style={styles.label}>{label}</Text> 
      }
        
      </Pressable>  
  )

  return (
    <View style={!iconName ? [styles.container, styles.containerBorder] : [styles.container]}>
      {href ?
        <Link href={href} asChild>
            {content}
        </Link>
        :
        content      
      }
    </View>
    
  )
}

const styles = StyleSheet.create({
  container:{
    width: "auto",
    paddingHorizontal: "5%",
    justifyContent:"center",
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