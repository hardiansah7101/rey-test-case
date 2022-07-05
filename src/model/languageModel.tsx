import axios from "axios"
import { URL } from "../helpers/constants";

export class Language {

  async getData(): Promise<any> {
    const responseJson = await axios.get(`${URL}/language`);

    return responseJson.data
  }

}