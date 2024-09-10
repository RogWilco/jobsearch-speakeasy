import { BaseResource, Resource } from './resource'

describe('@Resource(:endpoint)', () => {
  it('should add metadata to the target class', () => {
    // Setup Mocks
    const mockDefineMetadata = (Reflect.defineMetadata = jest.fn())

    // Test Decorator
    @Resource('/test')
    class TestResource extends BaseResource {}

    expect(mockDefineMetadata).toHaveBeenCalledWith(
      'resource:path',
      '/test',
      TestResource,
    )
  })

  it('should fail if no endpoint path is provided', () => {
    // Setup Mocks
    const mockDefineMetadata = (Reflect.defineMetadata = jest.fn())

    // Test Decorator
    expect(() => {
      @Resource('')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class TestResource extends BaseResource {}
    }).toThrow()

    expect(mockDefineMetadata).not.toHaveBeenCalled()
  })
})

describe('BaseResource', () => {
  // Define ConcreteResource
  class ConcreteResource extends BaseResource {
    id!: number
    name!: string
  }

  describe('_.create(data)', () => {
    it('should initialize a new resource with the specified data', () => {
      // Test Method
      const data = { id: 1, name: 'test' }
      const resource = ConcreteResource.create(data)

      expect(resource).toBeInstanceOf(ConcreteResource)
      expect(resource).toEqual(data)
    })

    it('should initialize a new resource with partial data', () => {
      // Test Method
      const data = { id: 1 }
      const resource = ConcreteResource.create(data)

      expect(resource).toBeInstanceOf(ConcreteResource)
      expect(resource).toEqual(data)
    })

    it('should initialize a new resource with no data', () => {
      // Test Method
      const resource = ConcreteResource.create({})

      expect(resource).toBeInstanceOf(ConcreteResource)
      expect(resource).toEqual({})
    })
  })

  describe('.toString()', () => {
    it('should return a JSON string representation of the resource', () => {
      // Test Method
      const data = { id: 1, name: 'test' }
      const resource = ConcreteResource.create(data)

      expect(resource.toString()).toBe(JSON.stringify(data))
    })
  })
})
