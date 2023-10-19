import axios from 'axios'
import * as core from '@actions/core'

export async function read(
  token: string,
  org: string,
  environment: string,
  sessionId: string
): Promise<string> {
  try {
    const response = await axios.get(
      `https://api.pulumi.com/api/preview/environments/${org}/${environment}/open/${sessionId}`,
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

    return JSON.stringify(response.data)
  } catch (error) {
    // Check the type of error and handle accordingly
    if (error instanceof Error) {
      throw new Error(`Error sending request: ${error.message}`)
    } else {
      throw new Error('An unexpected error occurred while sending the request.')
    }
  }
}
