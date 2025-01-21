import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";

export type ButtonProps = {
    label?: string;
    iconName?: any;
    iconColor?: string;
    iconSize?: number;
    border?: boolean;
    onClick?: () => void;
    href?: any;
}

export default function Button({label, iconName, iconColor, iconSize, border, onClick, href} : ButtonProps) {
  const content = (
    <Pressable
      style={!iconName ? styles.containerText : styles.pressableContainer}
      onPress={ onClick ? () => onClick() : null}
    >
      {iconName && 
        <FontAwesome
          size={iconSize ?? 30}
          name={iconName}
          color={iconColor}
        />
      }
      {href ?
          <Link href={href} asChild>
              <Text style={styles.label}>{label}</Text>
          </Link>
          :
          label && <Text style={styles.label}>{label}</Text>  
      }
        
      </Pressable>  
  )

  return (
    <View>
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
  containerText:{
    width: "auto",
    alignSelf:"center",
    borderColor: '#000000',
    borderWidth: 2,
    borderRadius: 10
  },
  label:{
    textAlign: "center",
    paddingHorizontal: "3%",
    margin: 6
  },
  pressableContainer:{
    minWidth: 30, 
    minHeight: 30, 
    justifyContent: 'center', 
    alignItems: 'center'
  }
});