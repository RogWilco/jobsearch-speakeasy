import { CreateAxiosDefaults } from 'axios'
import * as PACKAGE from '../package.json'
import { ResourceClient } from './lib/resource-client'
import { Generation, Pokemon } from './resources'

export class PokemonClient extends ResourceClient(Pokemon) {}
export class GenerationClient extends ResourceClient(Generation) {}

/**
 * Client for interacting with the PokeAPI.
 */
export class PokedexClient {
  private readonly _configDefaults = {
    timeout: 1000,
    baseURL: 'https://pokeapi.co/api/v2',
    headers: {
      'User-Agent': PACKAGE.name,
      'X-API-Client-Name': PACKAGE.name,
      'X-API-Client-Version': PACKAGE.version,
    },
  }

  /**
   * Provides access to Pokemon resources.
   */
  public pokemon: PokemonClient

  /**
   * Provides access to Generation resources.
   */
  public generation: GenerationClient

  /**
   * Creates a new PokedexClient instance.
   *
   * @param config optional configuration overrides
   */
  constructor(config?: CreateAxiosDefaults) {
    const resolvedConfig = {
      ...this._configDefaults,
      ...config,
    }

    this.pokemon = new PokemonClient(resolvedConfig)
    this.generation = new GenerationClient(resolvedConfig)
  }
}
