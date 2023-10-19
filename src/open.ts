import axios from 'axios'

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
