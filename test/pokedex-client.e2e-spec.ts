import axios from 'axios'
import nock from 'nock'
import { PokedexClient } from '../src'
import { RequestError, ServerError } from '../src/lib/errors'

axios.defaults.adapter = 'http'

describe('Pokedex Client', () => {
  let mockApi: nock.Scope
  let client: PokedexClient

  beforeEach(() => {
    mockApi = nock('https://pokeapi.co/api/v2')
    client = new PokedexClient()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('Pokemon', () => {
    describe('getOne', () => {
      it('successfully fetches a single pokemon by ID', async () => {
        const result = await client.pokemon.getOne(1)

        expect(result).toBeDefined()
        expect(result).toMatchObject({
          id: 1,
          name: 'bulbasaur',
        })
      })

      it('successfully fetches a single pokemon by name', async () => {
        const result = await client.pokemon.getOne('bulbasaur')

        expect(result).toBeDefined()
        expect(result.id).toBe(1)
      })

      it('fails to fetch a single pokemon by invalid ID', async () => {
        await expect(client.pokemon.getOne(0)).rejects.toThrow(RequestError)
      })

      it('fails to fetch a single pokemon by invalid name', async () => {
        await expect(client.pokemon.getOne('invalid')).rejects.toThrow(
          RequestError,
        )
      })
    })

    describe('getMany', () => {
      it('successfully fetches the first 10 pokemon', async () => {
        const result = await client.pokemon.getMany(10)

        expect(result).toBeDefined()
        expect(result.length).toBe(10)
        expect(result[0].name).toBe('bulbasaur')
        expect(result[1].name).toBe('ivysaur')
        expect(result[2].name).toBe('venusaur')
        expect(result[3].name).toBe('charmander')
        expect(result[4].name).toBe('charmeleon')
        expect(result[5].name).toBe('charizard')
        expect(result[6].name).toBe('squirtle')
        expect(result[7].name).toBe('wartortle')
        expect(result[8].name).toBe('blastoise')
        expect(result[9].name).toBe('caterpie')
      })

      it('successfully fetches the next 20 pokemon', async () => {
        const result = await client.pokemon.getMany(20, 10)

        expect(result).toBeDefined()
        expect(result.length).toBe(20)
        expect(result[0].name).toBe('metapod')
        expect(result[1].name).toBe('butterfree')
        expect(result[2].name).toBe('weedle')
        expect(result[3].name).toBe('kakuna')
        expect(result[4].name).toBe('beedrill')
        expect(result[5].name).toBe('pidgey')
        expect(result[6].name).toBe('pidgeotto')
        expect(result[7].name).toBe('pidgeot')
        expect(result[8].name).toBe('rattata')
        expect(result[9].name).toBe('raticate')
        expect(result[10].name).toBe('spearow')
        expect(result[11].name).toBe('fearow')
        expect(result[12].name).toBe('ekans')
        expect(result[13].name).toBe('arbok')
        expect(result[14].name).toBe('pikachu')
        expect(result[15].name).toBe('raichu')
        expect(result[16].name).toBe('sandshrew')
        expect(result[17].name).toBe('sandslash')
        expect(result[18].name).toBe('nidoran-f')
        expect(result[19].name).toBe('nidorina')
      })

      it('successfully fetches the last 10 pokemon', async () => {
        const result = await client.pokemon.getMany(10, -10)

        expect(result).toBeDefined()
        expect(result.length).toBe(10)
        expect(result[0].name).toBe('miraidon-low-power-mode')
        expect(result[1].name).toBe('miraidon-drive-mode')
        expect(result[2].name).toBe('miraidon-aquatic-mode')
        expect(result[3].name).toBe('miraidon-glide-mode')
        expect(result[4].name).toBe('ursaluna-bloodmoon')
        expect(result[5].name).toBe('ogerpon-wellspring-mask')
        expect(result[6].name).toBe('ogerpon-hearthflame-mask')
        expect(result[7].name).toBe('ogerpon-cornerstone-mask')
        expect(result[8].name).toBe('terapagos-terastal')
        expect(result[9].name).toBe('terapagos-stellar')
      })
    })

    describe('getAll', () => {
      it('successfully fetches a list of all pokemon', async () => {
        const count = await client.pokemon.count()
        const result = await client.pokemon.getAll()

        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        expect(result.length).toBe(count)
      })
    })

    describe('count', () => {
      it('successfully fetches the total number of pokemon', async () => {
        const result = await client.pokemon.count()

        expect(result).toBeDefined()
        expect(result).toBeGreaterThan(0)
      })
    })
  })

  describe('Generation', () => {
    describe('getOne', () => {
      it('successfully fetches a single generation by ID', async () => {
        const result = await client.generation.getOne(1)

        expect(result).toBeDefined()
        expect(result.id).toBe(1)
        expect(result.name).toBe('generation-i')
      })

      it('successfully fetches a single generation by name', async () => {
        const result = await client.generation.getOne('generation-i')

        expect(result).toBeDefined()
        expect(result.id).toBe(1)
        expect(result.name).toBe('generation-i')
      })
    })

    describe('getMany', () => {
      it('successfully fetches a list of the first 3 generations', async () => {
        const result = await client.generation.getMany(3)

        expect(result).toBeDefined()
        expect(result.length).toBe(3)
        expect(result[0].name).toBe('generation-i')
        expect(result[1].name).toBe('generation-ii')
        expect(result[2].name).toBe('generation-iii')
      })

      it('successfully fetches a list of the next 5 generations', async () => {
        const result = await client.generation.getMany(5, 3)

        expect(result).toBeDefined()
        expect(result.length).toBe(5)
        expect(result[0].name).toBe('generation-iv')
        expect(result[1].name).toBe('generation-v')
        expect(result[2].name).toBe('generation-vi')
        expect(result[3].name).toBe('generation-vii')
        expect(result[4].name).toBe('generation-viii')
      })

      it('successfully fetches a list of the last 3 generations', async () => {
        const result = await client.generation.getMany(3, -3)

        expect(result).toBeDefined()
        expect(result.length).toBe(3)
        expect(result[0].name).toBe('generation-vii')
        expect(result[1].name).toBe('generation-viii')
        expect(result[2].name).toBe('generation-ix')
      })
    })

    describe('getAll', () => {
      it('successfully fetches a list of all generations', async () => {
        const count = await client.generation.count()
        const result = await client.generation.getAll()

        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        expect(result.length).toBe(count)
      })
    })

    describe('count', () => {
      it('successfully fetches the total number of generations', async () => {
        const result = await client.generation.count()

        expect(result).toBeDefined()
        expect(result).toBeGreaterThan(0)
      })
    })
  })

  describe('Errors', () => {
    it('throws a RequestError when the API responds with a HTTP-400 status', async () => {
      // Mock API Response
      mockApi.get(/\/pokemon\/.+/).reply(400)

      await expect(client.pokemon.getOne('bulbasaur')).rejects.toThrow(
        RequestError,
      )
    })

    it('throws a RequestError when the API responds with a HTTP-404 status', async () => {
      // Mock API Response
      mockApi.get(/\/generation\/.+/).reply(404)

      await expect(client.generation.getOne(3)).rejects.toThrow(RequestError)
    })

    it('throws a ServerError when the API responds with a HTTP-500 status', async () => {
      // Mock API Response
      mockApi.get(/\/pokemon\/.+/).reply(500)

      await expect(client.pokemon.getOne('bulbasaur')).rejects.toThrow(
        ServerError,
      )
    })

    // it("throws a NetworkError when the API doesn't respond", async () => {
    //   jest.mock('axios', () => ({
    //     create: jest.fn().mockImplementation(() => ({
    //       get: jest.fn().mockRejectedValue(new Error('Request timed out')),
    //     })),
    //   }))

    //   await expect(client.pokemon.getOne('bulbasaur')).rejects.toThrow(
    //     NetworkError,
    //   )

    //   jest.clearAllMocks()
    // })
  })
})
