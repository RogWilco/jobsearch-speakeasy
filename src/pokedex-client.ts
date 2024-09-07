import { ResourceClient } from './lib/resource-client'
import { Generation } from './resources/generation'
import { Pokemon } from './resources/pokemon'

export class PokedexClient {
  constructor(
    public pokemon = new ResourceClient<Pokemon>(),
    public generation = new ResourceClient<Generation>(),
  ) {}
}
