import { useNavigation, useRoute } from "@react-navigation/native";
import React, { Fragment, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import { fontFamily } from "../helpers/constants";
import { PokemonType } from "../model/pokemonTypeModel";
import { reduxActions, ReduxState } from "../redux/redux";

export default function NavbarMenu() {
  const activeMenu = useSelector((state: ReduxState) => state.activeMenu)
  const language = useSelector((state: ReduxState) => state.language)
  const dispatch = useDispatch()
  const navigation = useNavigation<any>()
  const route = useRoute()
  const params: any = route.params

  const [dataPokemonType, setDataPokemonType] = useState<any[] | []>([])

  const dataMenu = [
    {
      title: 'Home',
      active: route.name === 'app-home',
      onPress: () => {
        dispatch(reduxActions.disableMenu())
        navigation.navigate('app-home')
      }
    },
    {
      title: 'Pokemon Type',
      active: route.name !== 'app-home',
      children: dataPokemonType,
    }
  ]
  
  const getDataPokemonType = async () => {
    try {
      const type = new PokemonType
      const responseJson = await type.getData()
      let data: any = [];
      responseJson.results.forEach((res: any, index: number) => {
        data.push({
          title: res.name,
          active: route.name !== 'app-home' && params?.name == res.name,
          onPress: () => {
            dispatch(reduxActions.disableMenu())
            if (route.name !== 'app-home') {
              navigation.goBack()
            }
            navigation.navigate('app-type', res)
          },
          data: res,
        })
      });
      setDataPokemonType(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDataPokemonType()
  }, [])

  const renderMenuItem = (item: any, index: number) => {
    return (
      <View key={String(index)} style={{ backgroundColor: 'white' }}>
        <TouchableOpacity activeOpacity={0.95} style={styles.menuItem} onPress={item.onPress}>
          <Text style={[styles.menuTitle, { color: item.active ? 'orange' : 'black', textTransform: 'capitalize' }]}>{item.title}</Text>
        </TouchableOpacity>
        {item.children && (
          <View style={{ paddingLeft: 20 }}>
            {item.children.map(renderMenuTypeItem)}
          </View>
        )}
      </View>
    )
  }

  const renderMenuTypeItem = (item: any, index: number) => {
    const nameLanguage = item.data.detail?.names?.filter((item: any) => item.language?.name === language)
    const name = nameLanguage.length > 0 && nameLanguage[0].language?.name === language ? nameLanguage[0].name : item.title
    return (
      <View key={String(index)} style={{ backgroundColor: 'white' }}>
        <TouchableOpacity activeOpacity={0.95} style={styles.menuItem} onPress={item.onPress}>
          <Text style={[styles.menuTitle, { color: item.active ? 'blue' : 'black', textTransform: 'capitalize' }]}>{name}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <Fragment>
      <ReactNativeModal
        isVisible={activeMenu}
        onBackButtonPress={() => dispatch(reduxActions.disableMenu())}
        onSwipeComplete={() => dispatch(reduxActions.disableMenu())}
        animationIn="slideInDown"
        animationOut="slideOutUp"
        swipeDirection={"up"}
        coverScreen={false}
        propagateSwipe={true}
        style={{ margin: 0 }}
        animationInTiming={400}
        animationOutTiming={400}
        backdropTransitionInTiming={400}
        backdropTransitionOutTiming={400}
        backdropOpacity={0.1}

      >
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {dataMenu.map(renderMenuItem)}
          </ScrollView>
        </View>
      </ReactNativeModal>
      
    </Fragment>
  )
}

const styles = StyleSheet.create({
  menuItem: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  menuTitle: {
    width: '100%',
    fontSize: 18,
    fontFamily: fontFamily.bold,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingVertical: 12,
  }
})