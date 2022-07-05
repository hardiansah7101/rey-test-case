import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NavbarMenu from "../../components/navbar-menu";
import { hp, pxRatio, wp } from "../../helpers/size";
import { useHeaderHeight } from '@react-navigation/elements';
import { Pokemon } from "../../model/pokemonModel";
import { URL } from "../../helpers/constants";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/redux";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { fontFamily } from '../../helpers/constants'
import { color } from "../../helpers/colors";


export default function Home({ navigation, route }: any) {
  const headerHeight = useHeaderHeight()
  const homeHeight = hp(100) - headerHeight
  const language = useSelector((state: ReduxState) => state.language)
  const flatlistRef = useRef<FlatList>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [dataPokemon, setDataPokemon] = useState<any[]>([])
  const [count, setCount] = useState<number>(0)
  const [urlNext, setUrlNext] = useState<string | null>(null)

  const initialdata = async (url: string | null = null) => {
    setIsLoading(true)
    try {
      const pokedex = new Pokemon
      const responseJson = await pokedex.getData(url ?? `${URL}/pokemon?offset=0&limit=4`)
      setDataPokemon(!url ? responseJson.results : old => [...old, ...responseJson.results])
      setCount(responseJson.count)
      setUrlNext(responseJson.next)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    initialdata()
  }, [])

  const handleCheckPokemonPress = () => {
    if (dataPokemon.length > 0) {
      flatlistRef.current?.scrollToIndex({ index: 0, animated: true })
    }
  }

  const renderPokemon = ({ item, index }: { item: any, index: number }) => {
    return (
      <View style={{ backgroundColor: 'transparent', alignItems: "center" }}>
        {index == 0 && (
          <View style={{ padding: pxRatio(10) }}>
            <Text style={styles.pokedexText}>Pokemon</Text>
            <Text style={styles.pokedexDescription}>All Generation totaling {count} Pokemon</Text>
          </View>
        )}
        <TouchableOpacity activeOpacity={0.8} style={styles.btnPokemonItem} onPress={() => navigation.navigate("app-pokemon-detail", item)}>
          <Image source={item.detail.sprites?.other?.home?.front_default ? { uri: item.detail.sprites?.other?.home?.front_default } : require('../../assets/images/no-img.png')} style={styles.pokemonItemImg} resizeMode="contain" />
          <View style={{ flex: 1, paddingVertical: wp(1) }}>
            <Text style={styles.pokemonItemId} numberOfLines={1}>#{item.detail.base_experience}</Text>
            <Text style={styles.pokemonItemName} numberOfLines={2}>{item.name}</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {item.detail.types?.map((res: any, index: number) => {
              const nameLanguage = res.detail?.names?.filter((res: any) => res.language?.name === language)
              const name = nameLanguage.length > 0 && nameLanguage[0].language?.name === language ? nameLanguage[0].name : res.type?.name

              return (
                <TouchableOpacity key={String(index)} activeOpacity={0.8} style={[styles.typeItem, { backgroundColor: color(parseInt(res.detail.id)) }]} onPress={() => navigation.navigate('app-type', res)}>
                  <Text style={styles.typeItemText}>{name}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.content}>
      <FlatList<any>
        ref={flatlistRef}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: 'white' }}
        contentContainerStyle={{ backgroundColor: '#FACB3C' }}
        data={dataPokemon}
        keyExtractor={(_, index: number) => String(index)}
        renderItem={renderPokemon}
        ListHeaderComponent={(
          <View style={{ backgroundColor: 'transparent' }}>
            <View style={[styles.containerHome, { minHeight: homeHeight, paddingVertical: homeHeight * .05 }]}>
              <View style={{ height: wp(70) }}>
                <Image source={require('../../assets/images/dino.png')} style={styles.dinoImg} resizeMode="contain" />
              </View>
              <Text style={styles.homeText}>All the Pokemon{'\n'}data you'll ever{'\n'}need in one{'\n'}place</Text>
              <Text style={styles.homeTextDescription}>Thousands of data compiled into one place</Text>
              <TouchableOpacity activeOpacity={0.8} style={styles.btnPokemon} onPress={handleCheckPokemonPress}>
                <Text style={styles.btnPokemonTitle}>Check Pokemon</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          (
            <View style={{ paddingBottom: pxRatio(10), alignItems: "center" }}>
              {!isLoading ? (
                urlNext && (
                  <TouchableOpacity activeOpacity={0.7} style={styles.btnFooter} onPress={async () => await initialdata(urlNext)}>
                    <Text style={styles.btnFooterText}>Load More  </Text>
                    <FontAwesome5Icon name="arrow-down" size={pxRatio(5)} color={'black'} />
                  </TouchableOpacity>
                )) : (
                <ActivityIndicator color={'darkcyan'} style={{ marginVertical: pxRatio(5) }} />
              )
              }
            </View>
          )
        }
        ListFooterComponentStyle={{ width: '100%' }}
      />
      <NavbarMenu />
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  containerHome: {
    paddingHorizontal: wp(4),
    backgroundColor: 'white',
  },
  dinoImg: {
    height: '100%',
    width: '100%',
  },
  homeText: {
    fontSize: wp(10),
    fontFamily: fontFamily.bold,
    paddingVertical: wp(2),
    color: 'black'

  },
  homeTextDescription: {
    fontSize: wp(4),
    fontFamily: fontFamily.regular,
    paddingVertical: wp(3),
  },
  btnPokemon: {
    alignSelf: 'flex-start',
    paddingVertical: wp(3),
    paddingHorizontal: wp(6),
    borderRadius: wp(3),
    backgroundColor: '#E6AB0A',
    marginTop: wp(5),
  },
  btnPokemonTitle: {
    fontSize: wp(4),
    fontFamily: fontFamily.bold,
    color: 'white',
  },
  pokedexText: {
    fontSize: wp(8),
    fontFamily: fontFamily.regular,
    textAlign: "center",
    fontWeight: 'bold',
  },
  pokedexDescription: {
    fontSize: wp(4.5),
    fontFamily: fontFamily.regular,
    textAlign: "center",
    marginTop: wp(3),
  },
  btnPokemonItem: {
    padding: wp(5),
    borderRadius: wp(5),
    backgroundColor: 'white',
    marginBottom: wp(10),
    width: wp(70)
  },
  pokemonItemImg: {
    height: wp(65),
    width: wp(65),
    alignSelf: "center"
  },
  pokemonItemId: {
    fontFamily: fontFamily.bold,
    fontSize: wp(4.5)
  },
  pokemonItemName: {
    fontFamily: fontFamily.bold,
    fontSize: wp(7),
    textTransform: 'capitalize'
  },
  typeItem: {
    paddingHorizontal: wp(3),
    paddingVertical: wp(1),
    margin: wp(1),
    borderRadius: wp(10)
  },
  typeItemText: {
    fontSize: wp(4),
    fontFamily: fontFamily.regular,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    color: 'white'
  },
  btnFooter: {
    flexDirection: 'row',
    padding: wp(5),
    alignItems: "center"
  },
  btnFooterText: {
    fontSize: wp(5),
    color: 'black',
    fontWeight: 'bold',
    fontFamily: fontFamily.regular
  }
})