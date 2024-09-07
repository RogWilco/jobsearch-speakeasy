import { PokedexClient } from '../src/pokedex-client'

describe('Pokedex Client', () => {
  it('should be able to fetch a single Pokemon', async () => {
    const client = new PokedexClient()
    const result = await client.pokemon.getOne(1)

    console.log(result)

    expect(result).toBeDefined()
    expect(result.name).toBe('bulbasaur')
  })

  it.todo('should be able to fetch a list of Pokemon')
})
