import React, { Fragment } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import { reduxActions, ReduxState } from "../redux/redux";
import Firstload from "../pages/firstload";
import Home from "../pages/home";
import PagePokemonDetail from "../pages/home/pokemon-detail";
import Type from "../pages/type";
import Settings from "../pages/settings";
import PagePokemonDetailMore from "../pages/home/pokemon-detail-more";

const Stack = createStackNavigator()

export default function Route() {
  const activeMenu = useSelector((state: ReduxState) => state.activeMenu)
  const dispatch = useDispatch()

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <Stack.Navigator initialRouteName="app-firstload" screenOptions={({ navigation }: any) => ({
        headerTitle: "",
        headerShadowVisible: false,
        headerLeft: () => (
          <Image source={require('../assets/images/logo.png')} style={{ height: "80%", width: 100, marginHorizontal: 10 }} resizeMode="contain" />
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: "center" }}>
            <TouchableOpacity activeOpacity={0.8} style={{ paddingHorizontal: 20 }} onPress={() => navigation.navigate('app-settings')}>
              <FontAwesome5Icon name={"cog"} color={"grey"} size={20} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={{ paddingHorizontal: 20 }} onPress={() => dispatch(activeMenu ? reduxActions.disableMenu() : reduxActions.activatedMenu())}>
              <FontAwesome5Icon name={activeMenu ? "times" : "bars"} color={"grey"} size={20} />
            </TouchableOpacity>
          </View>
        ),
        ...TransitionPresets.SlideFromRightIOS,
      })}>
        <Stack.Screen name="app-firstload" component={Firstload} options={{
          headerShown: false,
        }} />
        <Stack.Screen name="app-home" component={Home} />
        <Stack.Screen name="app-settings" component={Settings} options={{
          headerRight: () => null
        }} />
        <Stack.Screen name="app-type" component={Type} options={{
          ...TransitionPresets.RevealFromBottomAndroid,
          gestureDirection: 'horizontal',
        }} />
        <Stack.Screen name="app-pokemon-detail" component={PagePokemonDetail} options={{
          headerShown: false,
          ...TransitionPresets.ModalPresentationIOS,
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }} />
        <Stack.Screen name="app-pokemon-detail-more" component={PagePokemonDetailMore} options={({ navigation }: any) => ({
          headerShown: false,
          headerShadowVisible: false,
          headerRight: () => null,
          headerLeft: () => (
            <TouchableOpacity activeOpacity={0.8} style={{ paddingHorizontal: 20 }} onPress={() => navigation.goBack()}>
              <FontAwesome5Icon name="arrow-left" color={'white'} size={20} />
            </TouchableOpacity>
          )
        })} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}