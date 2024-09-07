export abstract class NamedResource {
  public id?: number
  public name?: string

  /**
   * Creates a new instance using the provided data.
   *
   * @param this the current subclass definition
   * @param data the data with which to initialize the resource
   *
   * @returns the created resource
   */
  static create<T extends NamedResource>(
    this: new () => T,
    data: Partial<T>,
  ): T {
    return Object.assign(new this(), data)
  }

  constructor(data: Partial<NamedResource>) {
    Object.assign(this, data)
  }
}
