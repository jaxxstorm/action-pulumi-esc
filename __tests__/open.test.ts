/**
 * Unit tests for src/wait.ts
 */

import { open } from '../src/open'
import { expect } from '@jest/globals'
import axios from 'axios'

describe('open.ts', () => {
  it('should send a POST request to the Pulumi API with the provided token, org, and environment', async () => {
    const axiosMock = jest
      .spyOn(axios, 'post')
      .mockResolvedValueOnce({ data: 'response' })

    const token = 'test-token'
    const org = 'test-org'
    const environment = 'test-environment'

    await open(token, org, environment)

    expect(axiosMock).toHaveBeenCalledWith(
      `https://api.pulumi.com/api/preview/environments/${org}/${environment}/open`,
      {},
      {
        headers: {
          Accept: 'application/vnd.pulumi+8',
          'Content-Type': 'application/json',
          Authorization: `token ${token}`
        }
      }
    )
  })

  it('should return a stringified JSON response from the Pulumi API', async () => {
    const response = { data: 'response' }
    jest.spyOn(axios, 'post').mockResolvedValueOnce(response)

    const token = 'test-token'
    const org = 'test-org'
    const environment = 'test-environment'

    const result = await open(token, org, environment)

    expect(result).toEqual(JSON.stringify(response.data))
  })

  it('should handle and throw an error if the request fails due to network issues or invalid credentials', async () => {
    const error = new Error('Request failed')
    jest.spyOn(axios, 'post').mockRejectedValueOnce(error)

    const token = 'test-token'
    const org = 'test-org'
    const environment = 'test-environment'

    await expect(open(token, org, environment)).rejects.toThrow(
      `Error sending request: ${error.message}`
    )
  })

  it('should throw an error if the token parameter is an empty string', async () => {
    const token = ''
    const org = 'test-org'
    const environment = 'test-environment'

    await expect(open(token, org, environment)).rejects.toThrow(
      'Error sending request: Request failed with status code 401'
    )
  })

  it('should throw an error if the org parameter is an empty string', async () => {
    const token = 'test-token'
    const org = ''
    const environment = 'test-environment'

    await expect(open(token, org, environment)).rejects.toThrow(
      'Error sending request: Request failed with status code 401'
    )
  })

  it('should throw an error if the environment parameter is an empty string', async () => {
    const token = 'test-token'
    const org = 'test-org'
    const environment = ''

    await expect(open(token, org, environment)).rejects.toThrow(
      'Error sending request: Request failed with status code 401'
    )
  })
})
