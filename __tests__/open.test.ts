/**
 * Unit tests for src/wait.ts
 */

import { open } from '../src/open'
import { expect } from '@jest/globals'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

describe('open.ts', () => {
  it('should send a POST request to the Pulumi API with the correct URL and headers', async () => {
    const sessionId = uuidv4()

    // Mock axios.post method
    const axiosPostMock = jest
      .spyOn(axios, 'post')
      .mockResolvedValueOnce({ status: 200, data: { id: sessionId } })

    const token = 'test-token'
    const org = 'test-org'
    const environment = 'test-environment'

    // Call the open function
    const result = await open(token, org, environment)

    // Verify axios.post method was called with the correct arguments
    expect(axiosPostMock).toHaveBeenCalledWith(
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

    // Verify the result is the session ID
    expect(result).toBe(sessionId)
  })

  it('should return the session ID extracted from the response JSON when the request is successful', async () => {
    const sessionId = uuidv4()
    jest
      .spyOn(axios, 'post')
      .mockResolvedValueOnce({ data: { id: sessionId }, status: 200 })
    const token = 'test-token'
    const org = 'test-org'
    const environment = 'test-environment'

    const result = await open(token, org, environment)

    expect(result).toBe(sessionId)
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
