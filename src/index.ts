import { CreateAxiosDefaults } from 'axios'
import * as PACKAGE from 'package.json'
import { ResourceClient } from './lib/resource-client'
import { Generation } from './resources/generation'
import { Pokemon } from './resources/pokemon'

class PokemonClient extends ResourceClient(Pokemon) {}
class GenerationClient extends ResourceClient(Generation) {}

export class PokedexClient {
  private readonly _configDefaults = {
    baseURL: 'https://pokeapi.co/api/v2',
    headers: {
      'User-Agent': PACKAGE.name,
      'X-API-Client-Name': PACKAGE.name,
      'X-API-Client-Version': PACKAGE.version,
    },
  }

  public pokemon: PokemonClient
  public generation: GenerationClient

  constructor(config?: CreateAxiosDefaults) {
    const resolvedConfig = {
      ...this._configDefaults,
      ...config,
    }

    this.pokemon = new PokemonClient(resolvedConfig)
    this.generation = new GenerationClient(resolvedConfig)
  }
}
