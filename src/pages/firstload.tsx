import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions, useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { STORAGE_LANGUAGE } from "../helpers/constants";
import { reduxActions } from "../redux/redux";


export default function Firstload({ navigation }: any) {
  const dispatch = useDispatch()

  const initialData = async () => {
    const language = await AsyncStorage.getItem(STORAGE_LANGUAGE)
    if (!language) {
      await AsyncStorage.setItem(STORAGE_LANGUAGE, 'en')
    } else {
      dispatch(reduxActions.changeLanguage(language))
    }
  }

  useEffect(() => {
    setTimeout(async () => {
      await initialData()
      navigation.dispatch(StackActions.replace("app-home"))
    }, 2000)
  }, [])

  return (
    <View style={styles.content}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
      <View style={styles.footer}>
        <Text>Pokemon</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 50,
  },

})