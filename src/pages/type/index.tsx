import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NavbarMenu from "../../components/navbar-menu";
import { useHeaderHeight } from '@react-navigation/elements';
import { hp, pxRatio, wp } from "../../helpers/size";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/redux";
import Select2 from "../../helpers/select2";
import { Pokemon } from "../../model/pokemonModel";
import { fontFamily, URL } from "../../helpers/constants";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { color } from "../../helpers/colors";

export default function Type({ navigation, route }: any) {
  const language = useSelector((state: ReduxState) => state.language)
  const headerHeight = useHeaderHeight()
  const height = hp(100) - headerHeight

  const nameLanguage = route.params.detail?.names?.filter((item: any) => item.language?.name === language)
  const name = nameLanguage.length > 0 && nameLanguage[0].language?.name === language ? nameLanguage[0].name : route.params.name

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [dataPokemon, setDataPokemon] = useState<any | []>([])
  const [perPage, setPerPage] = useState<any>([9])
  const [page, setPage] = useState<any>(1)

  const pageTotal: number = Math.floor(route.params.detail.pokemon.length / perPage[0]) + ((route.params.detail.pokemon.length / perPage[0]).toString().split('.').length > 1 ? 1 : 0)


  const getDataPokemon = async () => {
    setIsLoading(true)
    const pokemon = new Pokemon
    try {
      let data: any = []

      for (let res of route.params.detail.pokemon.slice((page - 1) * perPage[0], ((page - 1) * perPage[0]) + perPage[0])) {
        const responseJson = await pokemon.getDataByIdOrName(res.pokemon.name)
        data.push(responseJson)
      }

      setDataPokemon(data)
    } catch (error) {
      console.log((error))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    getDataPokemon()
  }, [perPage])

  useEffect(() => {
    getDataPokemon()
  }, [page])

  const handleTypePress = (res: any) => {
    navigation.goBack()
    navigation.navigate('app-type', res)
  }

  const renderPokemonItem = ({ item, index }: any) => {
    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.btnItem} onPress={() => navigation.navigate('app-pokemon-detail-more', {
        name: item.name,
        url: `${URL}/pokemon/${item.id}`,
        detail: item
      })}>
        <Image source={item.sprites?.front_default ? { uri: item.sprites?.front_default } : require('../../assets/images/no-img.png')} style={styles.imgItem} resizeMode="contain" />
        <View style={styles.textItem}>
          <Text style={styles.textItemId} numberOfLines={1}>#{item.base_experience}</Text>
          <Text style={styles.textItemName} numberOfLines={2}>{item.name}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {item.types?.map((res: any, index: number) => {
              const nameLanguage = res.detail?.names?.filter((res: any) => res.language?.name === language)
              const name = nameLanguage.length > 0 && nameLanguage[0].language?.name === language ? nameLanguage[0].name : res.type?.name

              return (
                <TouchableOpacity key={String(index)} activeOpacity={0.8} style={[styles.typeItem, { backgroundColor: color(parseInt(res.detail.id)) }]} onPress={() => handleTypePress(res)}>
                  <Text style={styles.typeItemText}>{name}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={[circleStyles(height).circleOuter, {
        backgroundColor: color(parseInt(route.params.detail.id)),
        top: 0,
        right: - wp(45)
      }]} >
        <View style={circleStyles(height).circleInner} />
      </View>
      <View style={[circleStyles(height).circleOuter, {
        backgroundColor: color(parseInt(route.params.detail.id)),
        bottom: 0,
        left: - wp(45)
      }]} >
        <View style={circleStyles(height).circleInner} />
      </View>
      <View style={{ flex: 1, padding: pxRatio(10) }}>
        <Text style={styles.pageTitle} numberOfLines={2}>Pokemon with</Text>
        <Text style={styles.pageTitle} numberOfLines={2}>{name}</Text>

        <View style={styles.container}>
          <View style={styles.containerItem}>
            {isLoading ? (
              <ActivityIndicator color={color(parseInt(route.params.detail.id))} style={{ alignSelf: "center", marginVertical: pxRatio(10) }} />
            ) : (
              <FlatList<any>
                showsVerticalScrollIndicator={false}
                data={dataPokemon}
                keyExtractor={(_, index: number) => String(index)}
                renderItem={renderPokemonItem}
              />
            )}
          </View>
          <View>
            <View style={styles.pageInfo}>
              <View style={styles.perPage}>
                <Text style={[styles.perPageText, { color: color(parseInt(route.params.detail.id)) }]}>Per Page </Text>
                <View style={{ width: pxRatio(20) }}>
                  <Select2
                    isSelectSingle
                    style={styles.perPageSelect}
                    colorTheme={color(parseInt(route.params.detail.id))}
                    popupTitle="Per Page"
                    title="Per Page"
                    showSearchBox={false}
                    data={[
                      { id: 1, name: "1" },
                      { id: 2, name: "2" },
                      { id: 3, name: "3" },
                      { id: 4, name: "4" },
                      { id: 5, name: "5" },
                      { id: 6, name: "6" },
                      { id: 7, name: "7" },
                      { id: 8, name: "8" },
                      { id: 9, name: "9" },
                      { id: 10, name: "10" },
                      { id: 15, name: "15" },
                      { id: 20, name: "20" },
                    ]}
                    value={perPage}
                    onSelect={(data: any) => {
                      setPerPage(data)
                    }}
                  />
                </View>
              </View>
              <Text style={[styles.perPageText, { color: color(parseInt(route.params.detail.id)) }]}>Total Data : {route.params.detail.pokemon.length}</Text>
            </View>
            <View style={[styles.pageInfo]}>
              <TouchableOpacity activeOpacity={0.7} style={[styles.paginationButton, { borderColor: color(parseInt(route.params.detail.id)) }]} onPress={() => page > 1 ? setPage(page - 1) : {}}>
                <FontAwesome5Icon name="arrow-left" color={color(parseInt(route.params.detail.id))} size={pxRatio(4)} />
              </TouchableOpacity>
              <View style={styles.paginationPage}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {Array(pageTotal).fill(null).map((_, index: number) => (
                    <View key={String(index)} style={{ paddingHorizontal: pxRatio(2) }}>
                      <TouchableOpacity activeOpacity={0.7} style={[styles.paginationButton, { borderColor: color(parseInt(route.params.detail.id)), minWidth: pxRatio(10), backgroundColor: page == index + 1 ? color(parseInt(route.params.detail.id)) : 'whitesmoke' }]} onPress={() => setPage(index + 1)}>
                        <Text style={[styles.paginationPageNumber, { color: page == index + 1 ? 'white' : color(parseInt(route.params.detail.id)) }]}>{index + 1}</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
              <TouchableOpacity activeOpacity={0.7} style={[styles.paginationButton, { borderColor: color(parseInt(route.params.detail.id)) }]} onPress={() => page < pageTotal ? setPage(page + 1) : {}}>
                <FontAwesome5Icon name="arrow-right" color={color(parseInt(route.params.detail.id))} size={pxRatio(4)} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.perPageText, { color: color(parseInt(route.params.detail.id)), marginTop: pxRatio(3), marginBottom: pxRatio(10) }]}>Current Page : {page} of {pageTotal}</Text>
          </View>
        </View>
      </View>
      <NavbarMenu />
    </View>
  )
}

const circleStyles: any = (height: number) => ({
  circleOuter: {
    height: height * .45,
    width: height * .45,
    borderRadius: height * .45,
    position: 'absolute',
    justifyContent: "center",
    alignItems: "center",
  },
  circleInner: {
    height: height * .22,
    width: height * .22,
    borderRadius: height * .22,
    backgroundColor: 'white'
  },
})

const styles = StyleSheet.create({
  pageTitle: {
    fontFamily: fontFamily.bold,
    fontSize: pxRatio(10),
    textTransform: 'capitalize'
  },
  container: {
    flex: 1,
    marginTop: pxRatio(6),
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(1,1,1,0.1)",
    paddingHorizontal: pxRatio(6)
  },
  containerItem: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    marginBottom: pxRatio(3),
    paddingBottom: pxRatio(3)
  },
  btnItem: {
    paddingVertical: pxRatio(6),
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    flexDirection: "row"
  },
  imgItem: {
    height: pxRatio(30),
    width: pxRatio(30),
    alignSelf: "center"
  },
  textItem: {
    flex: 1,
    paddingLeft: pxRatio(6),
    borderLeftWidth: 1,
    borderLeftColor: "lightgrey",
  },
  textItemId: {
    fontFamily: fontFamily.bold,
    fontSize: pxRatio(4.5)
  },
  textItemName: {
    fontFamily: fontFamily.bold,
    fontSize: pxRatio(5.5),
    textTransform: 'capitalize'
  },
  typeItem: {
    paddingHorizontal: pxRatio(3),
    paddingVertical: pxRatio(1),
    margin: pxRatio(1),
    borderRadius: pxRatio(10)
  },
  typeItemText: {
    fontSize: pxRatio(5),
    fontFamily: fontFamily.bold,
    textTransform: 'capitalize',
    color: 'white'
  },
  pageInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: pxRatio(1)
  },
  perPage: {
    flexDirection: "row",
    alignItems: "center"
  },
  perPageText: {
    fontSize: pxRatio(5),
    fontFamily: fontFamily.bold
  },
  perPageSelect: {
    borderRadius: 10,
    backgroundColor: "whitesmoke",
    minHeight: pxRatio(10),
    width: pxRatio(30),
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: 0
  },
  paginationButton: {
    backgroundColor: 'whitesmoke',
    padding: pxRatio(2),
    borderRadius: 10,
    borderWidth: 2
  },
  paginationPage: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: pxRatio(1),
    marginHorizontal: pxRatio(2),
    borderLeftWidth: 1,
    borderLeftColor: 'grey',
    borderRightWidth: 1,
    borderRightColor: 'grey'
  },
  paginationPageNumber: {
    fontFamily: fontFamily.bold,
    fontSize: pxRatio(3),
    textAlign: "center",
  },
})