import React from "react";
import { Text, Dimensions, TouchableOpacity } from "react-native";
import { ListItem, Left, Right, Radio, List, Button } from "native-base"
import { translate } from '../utils/I18N';

export const LanguageMenuItem = (props: any) => {
  return (
    <ListItem
      selected={props.selected}
      onPress={(e) => {
        console.log("pressed");
        props.handleSelect(props.languageCode);
      }}
    >
      <Left>
        <Text
          style={{color: "white"}}
        >
          {translate(props.languageCode, {locale: props.langCode})}
        </Text>
      </Left>
      <Right>
        <Radio
          color={"#f0ad4e"}
          selectedColor={"#5cb85c"}
          selected={props.selected}
          onPress={(e) => {
            console.log("pressed radio");
            props.handleSelect(props.languageCode);
          }}
        />
      </Right>
    </ListItem>
  )

}
export default function LanguageMenu(props: any) {
  return (
    <List
      style={{
        minHeight: 20 * props.languageList.length,
        minWidth: Dimensions.get("window").width * 0.8,
        marginTop: 20,
        elevation: 10,
      }}
    >
      {props.languageList.map((value: {
        languageCode: string,
        selected: boolean
      }) => {
        return (
          <LanguageMenuItem
            languageCode={value.languageCode}
            selected={value.selected}
            handleSelect={props.changeLanguage}
          />
        )
      })}
    </List>
  )
}
