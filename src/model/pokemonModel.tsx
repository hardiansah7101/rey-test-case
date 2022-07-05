import axios from "axios"
import { URL } from "../helpers/constants";
import { PokemonAbility } from "./pokemonAbilityModel";
import { PokemonType } from "./pokemonTypeModel";

export class Pokemon {

  async getData(url: string): Promise<any> {
    const responseJson = await axios.get(url);
    let data = responseJson.data
    for (let i = 0; i < data.results.length; i++) {
      const res = data.results[i];
      const responseJsonDetail = await this.getDataByIdOrName(res.name)
      data.results[i].detail = responseJsonDetail
    }
    return responseJson.data
  }

  async getDataByIdOrName(param: any): Promise<any> {
    const responseJson = await axios.get(`${URL}/pokemon/${param}`);
    let data = responseJson.data
    
    const pokemonType = new PokemonType
    for (let i = 0; i < data.types.length; i++) {
      const res = data.types[i];
      const responseJsonDetailType = await pokemonType.getDataByIdOrName(res.type.name)
      data.types[i].detail = responseJsonDetailType
    }
    
    const pokemonAbility = new PokemonAbility
    for (let i = 0; i < data.abilities.length; i++) {
      const res = data.abilities[i];
      const responseJsonDetailType = await pokemonAbility.getDataByIdOrName(res.ability.name)
      data.abilities[i].detail = responseJsonDetailType
    }

    return data
  }

}