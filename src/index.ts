import { ResourceClient } from './lib/resource-client'
import { Generation } from './resources/generation'
import { Pokemon } from './resources/pokemon'

class PokemonClient extends ResourceClient(Pokemon) {}
class GenerationClient extends ResourceClient(Generation) {}

export class PokedexClient {
  public pokemon: PokemonClient
  public generation: GenerationClient

  constructor(config?: {}) {
    this.pokemon = new PokemonClient(config)
    this.generation = new GenerationClient(config)
  }
}
