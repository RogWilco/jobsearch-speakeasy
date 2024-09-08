import { CreateAxiosDefaults } from 'axios'
import { ResourceClient } from './lib/resource-client'
import { Generation } from './resources/generation'
import { Pokemon } from './resources/pokemon'

class PokemonClient extends ResourceClient(Pokemon) {}
class GenerationClient extends ResourceClient(Generation) {}

export class PokedexClient {
  private readonly _configDefaults = {
    baseURL: 'https://pokeapi.co/api/v2',
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
