import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { color } from "../../helpers/colors";
import { pxRatio, wp } from "../../helpers/size";
import { ReduxState } from "../../redux/redux";
import { fontFamily } from "../../helpers/constants";

export default function PagePokemonDetail({ navigation, route }: any) {
  const language = useSelector((state: ReduxState) => state.language)

  return (
    <View style={styles.container}>
      <View style={styles.headerDownScroll} />
      <View style={{ flex: 1, padding: pxRatio(10) }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title} numberOfLines={2}>{route.params.name}</Text>
          <Image source={route.params.detail.sprites?.front_default ? { uri: route.params.detail.sprites?.front_default } : require('../../assets/images/no-img.png')} style={styles.image} resizeMode="contain" />
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
          <View style={styles.dataItem}>
            <Text style={styles.itemTitle}>Type :</Text>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
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
          <TouchableOpacity activeOpacity={0.7} style={styles.btnMore} onPress={() => navigation.navigate('app-pokemon-detail-more', route.params)}>
            <Text style={styles.textMore}>More Details</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  headerDownScroll: {
    width: wp(20), borderBottomWidth: 2, borderBottomColor: 'grey', alignSelf: "center",
    marginVertical: 10
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: pxRatio(10),
    textTransform: 'capitalize'
  },
  image: {
    height: pxRatio(65),
    width: pxRatio(65),
    alignSelf: "center"
  },
  dataItem: {
    flexDirection: 'row',
    marginBottom: pxRatio(6)
  },
  itemTitle: {
    flex: 0.5,
    fontSize: pxRatio(5),
    fontFamily: fontFamily.bold,
  },
  itemValue: {
    flex: 1,
    fontSize: pxRatio(5),
    fontFamily: fontFamily.regular,
  },
  itemAbilities: {
    fontSize: pxRatio(5),
    fontFamily: fontFamily.regular,
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
  btnMore: {
    paddingHorizontal: pxRatio(5),
    paddingVertical: pxRatio(3),
    borderRadius: pxRatio(4),
    backgroundColor: '#E6AB0A',
    alignSelf: "center",
    marginVertical: pxRatio(20)
  },
  textMore: {
    fontSize: pxRatio(6),
    fontFamily: fontFamily.regular,
    fontWeight: 'bold',
    color: 'white',
  },
})