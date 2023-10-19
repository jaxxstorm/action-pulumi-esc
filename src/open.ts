import axios from 'axios'
import * as core from '@actions/core'

export async function open(
  token: string,
  org: string,
  environment: string
): Promise<string> {
  try {
    const response = await axios.post(
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

    core.debug(`Received status code: ${response.status}`)
    core.debug(`Received response: ${JSON.stringify(response.data)}`)

    // Parse the returned JSON and extract the 'id' property
    const data: { id?: string } = response.data

    if (data.id) {
      return data.id
    } else {
      throw new Error('No session ID found in the response.')
    }
  } catch (error) {
    // Check the type of error and handle accordingly
    if (error instanceof Error) {
      throw new Error(`Error sending request: ${error.message}`)
    } else {
      throw new Error('An unexpected error occurred while sending the request.')
    }
  }
}
