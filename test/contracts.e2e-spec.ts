import 'jest-extended'
import 'jest-json-schema'
import nock from 'nock'
import { PokedexClient } from '../src'
import * as contracts from './contracts'

describe('API Contracts', () => {
  let mockApi: nock.Scope
  let client: PokedexClient

  beforeEach(() => {
    mockApi = nock('https://pokeapi.co/api/v2')
    client = new PokedexClient()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe.each(['Pokemon', 'Generation'])(`%s`, resource => {
    const r = resource.toLowerCase() as keyof typeof client

    describe('getOne(:id)', () => {
      it('should populate a Resource with the expected values', async () => {
        const contract = contracts.api[r as keyof typeof contracts.api].getOne
        const expected = contracts.sdk[r as keyof typeof contracts.sdk].getOne

        mockApi.get(`/${r}/${expected.id}`).reply(200, contract)

        const result = await client[r].getOne(expected.id)

        expect(result).toBeDefined()
        expect(result).toMatchObject(expected)
      })

      it('should throw an error when the API returns an unexpected response', async () => {
        mockApi.get(`/${r}/1`).reply(200, {
          unexpected: 'json',
        })

        await expect(client.pokemon.getOne(1)).rejects.toThrow(Error)
      })
    })

    describe('getMany()', () => {
      it('should populate a Resource with the expected values', async () => {
        const contract = contracts.api[r].getMany
        const expected = contracts.sdk[r].getMany

        mockApi.get(`/${r}?limit=20&offset=0`).reply(200, contract)

        const result = await client[r].getMany()

        expect(result).toBeDefined()
        expect(result).toHaveLength(expected.length)
        expect(result).toIncludeSameMembers(expected)
      })

      it('should throw an error when the API returns an unexpected response', async () => {
        mockApi.get(`/${r}?limit=20&offset=0`).reply(200, {
          unexpected: 'json',
        })

        await expect(client.pokemon.getMany()).rejects.toThrow(Error)
      })
    })
  })
})
