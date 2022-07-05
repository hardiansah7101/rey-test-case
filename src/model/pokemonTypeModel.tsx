import axios from "axios"
import { URL } from "../helpers/constants";

export class PokemonType {

  async getData(): Promise<any> {
    const responseJson = await axios.get(`${URL}/type`);
    let data = responseJson.data

    for (let i = 0; i < data.results.length; i++) {
      const res = data.results[i];
      const responseJsonDetailType = await this.getDataByUrl(res.url)
      data.results[i].detail = responseJsonDetailType
    }
    
    return data
  }

  async getDataByIdOrName(param: any): Promise<any> {
      const responseJson = await axios.get(`${URL}/type/${param}`);

      return responseJson.data
  }

  async getDataByUrl(url: string): Promise<any> {
      const responseJson = await axios.get(url);

      return responseJson.data
  }

}