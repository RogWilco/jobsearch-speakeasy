import axios, { AxiosInstance } from 'axios'
import { NamedResource } from './named-resource'

export class ResourceClient<T extends NamedResource> {
  private _http: AxiosInstance
  private _config = {
    baseURL: 'https://pokeapi.co/api/v2/pokemon',
  }

  constructor(config?: {}) {
    this._http = axios.create(config)
  }

  async getOne(id: number): Promise<T>
  async getOne(name: string): Promise<T>
  async getOne(idOrName: string | number): Promise<T> {
    try {
      const response = await this._http.get(
        `${this._config.baseURL}/${idOrName}`,
      )

      return response.data as T
    } catch (error) {
      console.error('Error fetching resource:', error)
    }

    return Promise.resolve({} as T)
  }
}
