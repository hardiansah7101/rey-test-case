import axios from "axios"
import { URL } from "../helpers/constants";

export class PokemonAbility {

  async getData(): Promise<any> {
    const responseJson = await axios.get(`${URL}/ability`);

    return responseJson.data
  }

  async getDataByIdOrName(param: any): Promise<any> {
      const responseJson = await axios.get(`${URL}/ability/${param}`);

      return responseJson.data
  }

}