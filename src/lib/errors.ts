/**
 * Custom error classes for the API client.
 */
export type ApiClientError = new (
  message: string,
  originalError: Error,
) => Error

/**
 * Mixin that returns a custom error class for the specified error name.
 *
 * @param errorName the desired name of the error class
 *
 * @returns the custom error class
 */
export function ApiClientError(errorName: string): ApiClientError {
  class ApiClientErrorMixin extends Error {
    constructor(
      message: string,
      public originalError?: Error,
    ) {
      super(message)
      this.name = errorName
    }
  }

  return ApiClientErrorMixin
}

/**
 * Thrown when a request is successfully sent but no response is received.
 */
export class NetworkError extends ApiClientError('NetworkError') {}

/**
 * Thrown when a request fails due to a problem with the request.
 */
export class RequestError extends ApiClientError('ClientError') {}

/**
 * Thrown when a request fails due to a problem with the server.
 */
export class ServerError extends ApiClientError('ServerError') {}
