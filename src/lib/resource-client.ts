import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios'
import { Constructor } from './interfaces/utility-types'
import { NamedResource } from './named-resource'
import { BaseResourceType } from './resource'
import { ResourceTransformer, Transformable } from './resource-transformer'

export const DEFAULT_LIMIT = 20

/**
 * A resource-derived client supporting the retrieval of both individual and
 * collections of resources.
 */
export interface ResourceClient<T extends NamedResource> {
  /**
   * Retrieves a single resource by its id attribute.
   *
   * @param id the identifier of the resource to retrieve
   *
   * @returns the resource with the specified id
   */
  getOne(id: number): Promise<T>

  /**
   * Retrieves a single resource by its name attribute.
   *
   * @param name the name of the resource to retrieve
   *
   * @returns the resource matching the specified name
   */
  getOne(name: string): Promise<T>

  /**
   * Retrieves a paginated collection of resources.
   */

  /**
   * Retrieves a paginated collection of resources.
   *
   * @param limit the maximum number of resources to retrieve
   * @param offset the index at which to start retrieving resources
   *
   * @returns a collection of resources
   */
  getMany(limit?: number, offset?: number): Promise<T[]>

  /**
   * Retrieves all resources, merging the results of multiple paginated
   * requests if necessary.
   */
  getAll(): Promise<T[]>

  /**
   * Retrieves the total number of resources available.
   *
   * @returns the total number of resources
   */
  count(): Promise<number>
}

/**
 * Mixin that returns a ResourceClient for the specified Resource class.
 *
 * @example
 * ```
 * class PokemonClient extends ResourceClient(Pokemon) {}
 * ```
 *
 * @param ResourceType the resource class used by this client
 *
 * @returns the ResourceClient for the given Resource
 */
export function ResourceClient<T extends NamedResource>(
  ResourceType: BaseResourceType<T>,
): Constructor<ResourceClient<T>> {
  class ResourceClientMixin implements ResourceClient<T> {
    private _http: AxiosInstance
    private _path: string

    /**
     * Initializes a new resource client with the specified configuration.
     *
     * @param config the configuration for the resource client
     */
    constructor(config?: CreateAxiosDefaults) {
      this._path = Reflect.getMetadata('resource:path', ResourceType)

      this._http = axios.create(config)
    }

    async getOne(idOrName: string | number): Promise<T> {
      try {
        // Fetch the resource data from the API
        const response = await this._http.get(`${this._path}/${idOrName}`)

        // Transform the response data to match the Resource class
        return ResourceTransformer.transform(response.data)
          .from('getOne')
          .to(ResourceType)
      } catch (error) {
        // TODO: implement real error handling
        throw new Error('Error fetching resource')
      }
    }

    async getMany(limit = DEFAULT_LIMIT, offset = 0): Promise<T[]> {
      try {
        // Fetch the resource data from the API
        const response = await this._http.get(this._path, {
          params: {
            limit,
            offset,
          },
        })

        // Transform the response data to match the Resource class
        return response.data.results.map((result: Transformable) =>
          ResourceTransformer.transform(result)
            .from('getMany')
            .to(ResourceType),
        )
      } catch (error) {
        // TODO: implement real error handling
        throw new Error('Error fetching resources')
      }
    }

    async getAll(): Promise<T[]> {
      let offset = 0
      let results: T[] = []

      do {
        const batch = await this.getMany(DEFAULT_LIMIT, offset)
        results = results.concat(batch)
        offset += DEFAULT_LIMIT
      } while (results.length % DEFAULT_LIMIT === 0)

      return results
    }

    async count(): Promise<number> {
      try {
        const response = await this._http.get(this._path, {
          params: {
            limit: -1,
            offset: -1,
          },
        })

        return response.data.count
      } catch (error) {
        // TODO: implement real error handling
        throw new Error('Error fetching resource count')
      }
    }
  }

  return ResourceClientMixin
}
