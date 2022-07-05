import axios from "axios"
import { URL } from "../helpers/constants";
import { Pokemon } from "./pokemonModel";

export class PokemonEvolution {

  async getData(url: string): Promise<any> {
    const responseJson = await axios.get(url);
    
    let data = responseJson.data


    const pokemon = new Pokemon
    data.chain.detail = await pokemon.getDataByIdOrName(data.chain.species.name)
    data.chain.evolves_to = await this.getChain(data.chain.evolves_to)
    
    return data
  }
  
  async getChain(evolves_to: any) {
    const pokemon = new Pokemon
    let data = evolves_to
    
    for (let index = 0; index < data.length; index++) {
      const res = data[index]
      data[index].detail = await pokemon.getDataByIdOrName(res.species.name)
      data[index].evolves_to = await this.getChain(res.evolves_to)
    }

    return data
  }

}