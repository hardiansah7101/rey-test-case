import axios from "axios"
import { URL } from "../helpers/constants";

export class PokemonSpesies {

  async getData(url: string): Promise<any> {
    const responseJson = await axios.get(url);

    return responseJson.data
  }

  async getDataByIdOrName(param: any): Promise<any> {
      const responseJson = await axios.get(`${URL}/pokemon-species/${param}`);

      return responseJson.data
  }

}