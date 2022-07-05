import { StackActions } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useSelector } from "react-redux";
import { color } from "../../helpers/colors";
import { fontFamily } from "../../helpers/constants";
import { hp, pxRatio, wp } from "../../helpers/size";
import { PokemonEvolution } from "../../model/pokemonEvolutionModel";
import { PokemonSpesies } from "../../model/pokemonSpesiesModel";
import { ReduxState } from "../../redux/redux";

const pokemonPageColor = (color: string) => {
  if (color == 'white') return 'grey'
  else if (color == 'black') return 'grey'
  else if (color == 'blue') return 'darkblue'
  else if (color == 'green') return 'darkgreen'
  else if (color == 'yellow') return 'orange'
  else if (color == 'red') return 'darkred'
  else return color
}

export default function PagePokemonDetailMore({ navigation, route }: any) {
  const language = useSelector((state: ReduxState) => state.language)
  const [dataSpecies, setDataSpecies] = useState<any>(null)
  const [dataEvolution, setDataEvolution] = useState<any>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const flatlistRef = useRef<FlatList>(null)

  const getDataSpecies = async () => {
    navigation.setOptions({
      headerShown: false,
    })
    setDataSpecies(null)
    try {
      const species = new PokemonSpesies
      const responseJson = await species.getData(route.params.detail.species.url)
      setDataSpecies(responseJson)
      getDataEvolution(responseJson.evolution_chain.url)
      navigation.setOptions({
        headerShown: true,
        headerStyle: { backgroundColor: pokemonPageColor(responseJson.color.name) }
      })
    } catch (error) {
      console.log(error)
      setDataSpecies('Something wrong :(')
    }
  }

  const getDataEvolution = async (url: string) => {
    try {
      const evolution = new PokemonEvolution
      const responseJson = await evolution.getData(url)

      setDataEvolution(responseJson)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDataSpecies()
  }, [route.params])

  useEffect(() => {
    flatlistRef.current?.scrollToIndex({ index: activeIndex, animated: true })
  }, [activeIndex])

  const renderEvolutionItem = (res: any, index: number) => {
    return (
      <View key={String(index)} style={styles.evolutionItem}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <FontAwesome5Icon name="arrow-down" color={'black'} size={wp(8)} style={{ marginTop: wp(10) }} />
          <TouchableOpacity activeOpacity={0.8} style={{ height: wp(30), width: '100%', justifyContent: "center" }} onPress={() => navigation.dispatch(StackActions.push('app-pokemon-detail-more', {
            name: res.detail.name,
            url: `${URL}/pokemon/${res.detail.id}`,
            detail: res.detail
          }))}>
            <Image source={res.detail.sprites?.other?.home?.front_default ? { uri: res.detail.sprites?.other?.home?.front_default } : require('../../assets/images/no-img.png')} style={{ height: '100%', width: '100%' }} resizeMode="contain" />
            <Text style={styles.evolutionItemName}>{res.detail.name}</Text>
          </TouchableOpacity>
          {res.evolves_to?.map(renderEvolutionItem)}
        </View>
      </View>
    )
  }

  const contents = [
    {
      title: 'About',
      content: (
        <View style={{ width: wp(100) }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ padding: wp(4) }}>
              <View style={styles.dataItem}>
                <Text style={styles.itemTitle}>Species :</Text>
                <Text style={styles.itemValue}>{route.params.detail?.species?.name ?? '-'}</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.itemTitle}>Weight :</Text>
                <Text style={styles.itemValue}>{route.params.detail.weight}</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.itemTitle}>Height :</Text>
                <Text style={styles.itemValue}>{route.params.detail.height}</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.itemTitle}>Abilities :</Text>
                <View style={{ flex: 1 }}>
                  {route.params.detail.abilities?.map((res: any, index: number) => {
                    const nameLanguage = res.detail?.names?.filter((res: any) => res.language?.name === language)
                    const name = nameLanguage.length > 0 && nameLanguage[0].language?.name === language ? nameLanguage[0].name : res.ability?.name

                    return (
                      <Text key={String(index)} style={styles.itemAbilities}>- {name} {res.is_hidden && '(hidden)'}</Text>
                    )
                  })}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )
    },
    {
      title: 'Evolution',
      content: (
        <View style={{ width: wp(100) }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ marginBottom: wp(30) }}>
              <View style={styles.evolutionItem}>
                <View style={{ flex: 1, alignItems: "center" }}>
                  <View style={{ height: wp(30), width: '100%' }}>
                    <Image source={route.params.detail.sprites?.other?.home?.front_default ? { uri: route.params.detail.sprites?.other?.home?.front_default } : require('../../assets/images/no-img.png')} style={{ height: '100%', width: '100%' }} resizeMode="contain" />
                    <Text style={styles.evolutionItemName}>{route.params.detail.name}</Text>
                  </View>
                </View>
              </View>
              {dataEvolution?.chain?.evolves_to?.map(renderEvolutionItem)}
            </View>
          </ScrollView>
        </View>
      )
    },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {dataSpecies == null ? (
        <View style={styles.page}>
          <ActivityIndicator color={'grey'} size={pxRatio(30)} />
          <Text style={{
            fontSize: pxRatio(7),
            fontFamily: fontFamily.regular,
            color: 'grey',
            marginVertical: pxRatio(10),
            textAlign: "center"
          }}>Loading</Text>
        </View>
      ) : typeof dataSpecies == 'string' ? (
        <View style={styles.page}>
          <Image source={require('../../assets/images/cry.png')} style={{
            height: pxRatio(40),
            width: pxRatio(40),
            alignSelf: "center",
            opacity: 0.4
          }} resizeMode="contain" />
          <Text style={{
            marginVertical: pxRatio(10),
            fontSize: pxRatio(7),
            color: 'grey',
            fontFamily: fontFamily.regular
          }}>{dataSpecies}</Text>
          <TouchableOpacity activeOpacity={0.8} style={{
            borderBottomWidth: 1,
            borderBottomColor: 'blue',
            marginVertical: pxRatio(2)
          }} onPress={getDataSpecies}>
            <Text style={{
              fontSize: pxRatio(5),
              color: 'blue',
              fontFamily: fontFamily.bold,
            }}>Reload</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={{
            borderBottomWidth: 1,
            borderBottomColor: 'red',
            marginVertical: pxRatio(2)
          }} onPress={() => navigation.goBack()}>
            <Text style={{
              fontSize: pxRatio(5),
              color: 'red',
              fontFamily: fontFamily.bold,
            }}>Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ backgroundColor: pokemonPageColor(dataSpecies.color.name), flex: 1 }}>
          <View style={{ zIndex: 1, paddingHorizontal: wp(5) }}>
            <View style={{ flexDirection: 'row', alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: wp(7), color: 'white', fontFamily: fontFamily.bold, textTransform: 'capitalize' }}>{route.params.name}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {route.params.detail.types?.map((res: any, index: number) => {
                    const nameLanguage = res.detail?.names?.filter((res: any) => res.language?.name === language)
                    const name = nameLanguage.length > 0 && nameLanguage[0].language?.name === language ? nameLanguage[0].name : res.type?.name

                    return (
                      <TouchableOpacity key={String(index)} activeOpacity={0.8} style={[styles.typeItem, { backgroundColor: color(parseInt(res.detail.id)) }]} onPress={() => navigation.navigate('app-type', res)}>
                        <Text style={styles.typeItemText}>{name}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
              <Text style={styles.typeItemText}>#{route.params.detail.base_experience}</Text>
            </View>
            <Image source={route.params.detail.sprites?.other?.home?.front_default ? { uri: route.params.detail.sprites?.other?.home?.front_default } : require('../../assets/images/no-img.png')} style={{ height: wp(60), width: '100%', marginBottom: -wp(8) }} resizeMode="contain" />
          </View>
          <View style={{ flex: 1, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 0 }}>
            <View style={{ flexDirection: 'row', marginTop: wp(10), borderBottomWidth: 1, borderBottomColor: 'lightgrey', paddingBottom: wp(2) }}>
              {contents.map((res: any, index: number) => (
                <TouchableOpacity key={String(index)} activeOpacity={0.8} style={{ flex: 1, alignItems: "center", padding: '1%', }} onPress={() => setActiveIndex(index)}>
                  <Text style={{ color: activeIndex == index ? (pokemonPageColor(dataSpecies.color.name)) : 'grey', fontWeight: activeIndex == index ? 'bold' : '400' }}>{res.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flex: 1, paddingTop: wp(1) }}>
              <FlatList<any>
                ref={flatlistRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                data={contents}
                pagingEnabled={true}
                keyExtractor={(_, index: number) => String(index)}
                renderItem={({ item }: any) => item.content}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: pxRatio(10)
  },
  typeItem: {
    paddingHorizontal: wp(3),
    paddingVertical: wp(1),
    margin: wp(1),
    borderRadius: wp(10)
  },
  typeItemText: {
    fontSize: wp(4),
    fontFamily: fontFamily.bold,
    textTransform: 'capitalize',
    color: 'white'
  },
  dataItem: {
    flexDirection: 'row',
    marginBottom: wp(6)
  },
  itemTitle: {
    flex: 0.5,
    fontSize: wp(5),
    fontFamily: fontFamily.bold,
  },
  itemValue: {
    flex: 1,
    fontSize: wp(5),
    fontFamily: fontFamily.regular,
    textTransform: 'capitalize'
  },
  itemAbilities: {
    fontSize: wp(5),
    fontFamily: fontFamily.regular,
    textTransform: 'capitalize'
  },
  evolutionItem: {
    flexDirection: 'row',
    justifyContent: "center"
  },
  evolutionItemName: {
    fontFamily: fontFamily.bold,
    color: 'black',
    fontSize: wp(3),
    textAlign: "center",
    textTransform: 'capitalize'
  },
})