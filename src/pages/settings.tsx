import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import { fontFamily } from "../helpers/constants";
import { pxRatio, wp } from "../helpers/size";
import { Language } from "../model/languageModel";
import { reduxActions, ReduxState } from "../redux/redux";

export default function Settings() {
  const dispatch = useDispatch()
  const [activeChangeLanguage, setActiveChangeLanguage] = useState<boolean>(false)
  const language = useSelector((state: ReduxState) => state.language)
  const [dataLanguage, setDataLanguage] = useState<any[] | []>([])

  const getDataLanguage = async () => {
    try {
      const language = new Language
      const responseJson = await language.getData()
      setDataLanguage(responseJson.results)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDataLanguage()
  }, [])

  const handleChangeLanguage = async (languageName: string) => {
    dispatch(reduxActions.changeLanguage(languageName))
    setActiveChangeLanguage(false)
  }

  const renderLanguageItem = (item: any, index: number) => {
    return (
      <TouchableOpacity key={String(index)} activeOpacity={0.95} style={styles.langItem} onPress={() => handleChangeLanguage(item.name)}>
        <Text style={[styles.langTitle, { color: item.name == language ? 'orange' : 'black' }]}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: pxRatio(6) }}>
          <Text style={{ fontFamily: fontFamily.bold, fontSize: wp(6), textTransform: 'capitalize' }} numberOfLines={2}>Settings</Text>
          <View style={{ paddingVertical: wp(4) }}>
            <TouchableOpacity activeOpacity={0.7} style={styles.btnItem} onPress={() => setActiveChangeLanguage(true)}>
              <Text style={styles.btnItemTitle}>Language</Text>
              <Text style={styles.btnItemValue}>{language}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <ReactNativeModal
        isVisible={activeChangeLanguage}
        onBackButtonPress={() => setActiveChangeLanguage(false)}
        onSwipeComplete={() => setActiveChangeLanguage(false)}
        onBackdropPress={() => setActiveChangeLanguage(false)}
        swipeDirection={"down"}
        coverScreen={false}
        propagateSwipe={true}
        animationInTiming={400}
        animationOutTiming={400}
        backdropTransitionInTiming={400}
        backdropTransitionOutTiming={400}
        backdropOpacity={0.1}
      >
        <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 20, overflow: 'hidden' }}>
          <Text style={{ fontSize: wp(5), textAlign: "center", paddingVertical: wp(5) }}>Language</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {dataLanguage.map(renderLanguageItem)}
          </ScrollView>
        </View>
      </ReactNativeModal>
    </View>
  )
}

const styles = StyleSheet.create({
  langItem: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  langTitle: {
    width: '100%',
    fontSize: 18,
    fontFamily: fontFamily.bold,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingVertical: 12,
    textAlign: 'center',
  },
  btnItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingVertical: wp(3)
  },
  btnItemTitle: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: wp(4)
  },
  btnItemValue: {
    fontFamily: fontFamily.bold,
    fontSize: wp(4),
  },
})