import React from "react";
import { Text, Dimensions } from "react-native";
import { ListItem, Left, Right, Radio, List } from "native-base"
import { translate } from '../utils/I18N';

export const LanguageMenuItem = (props: any) => {
  return (
    <ListItem selected={props.selected}>
      <Left>
        <Text>
          {translate(props.languageCode, {})}
        </Text>
      </Left>
      <Right>
        <Radio
          color={"#f0ad4e"}
          selectedColor={"#5cb85c"}
          selected={props.selected}
          onPress={() => {
            props.handleSelect(props.languageCode)
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
        position: "relative",
        zIndex: 10
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
