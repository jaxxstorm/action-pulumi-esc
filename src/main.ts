import * as core from '@actions/core'
import { open } from './open'
import { read } from './read'
import { JSONPath } from 'jsonpath-plus'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const token: string = core.getInput('access-token')
    const org: string = core.getInput('organization')
    const environment: string = core.getInput('environment')
    const keys: string = core.getInput('keys')

    // open the session
    core.debug(`Opening environment for ${org}/${environment}`)
    const id = await open(token, org, environment)
    core.info(`Session opened: ${id}`)

    // read the session values
    core.debug(`Reading session values for ${org}/${environment}/${id}`)
    const response = await read(token, org, environment, id)
    core.debug(`Session values read: ${response}`)

    // Extract values using JSONPath
    const extractedValues = JSONPath({ path: keys, json: response })

    if (extractedValues && extractedValues.length > 0) {
      core.debug(
        `Extracted values using JSONPath: ${JSON.stringify(extractedValues)}`
      )
      core.setOutput('result', JSON.stringify(extractedValues))
    } else {
      core.setFailed(`No values found using the provided JSONPath.`)
    }
  } catch (error) {
    // Handle specific JSONPath errors (if any specific identification is needed)
    if (
      error instanceof Error &&
      error.message.includes('some substring specific to jsonpath errors')
    ) {
      core.setFailed(`JSONPath evaluation failed: ${error.message}`)
    } else if (error instanceof Error) {
      // Fail the workflow run for other errors
      core.setFailed(error.message)
    }
  }
}
