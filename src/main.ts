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
    const secret: boolean = core.getInput('secret') === 'true'

    // open the session
    core.debug(`Opening environment for ${org}/${environment}`)
    const id = await open(token, org, environment)
    core.info(`Session opened: ${id}`)

    // read the session values
    core.debug(`Reading session values for ${org}/${environment}/${id}`)
    const response = await read(token, org, environment, id)
    core.debug(`Session values read: ${response}`)

    // Extract values using JSONPath
    const extractedValues = JSONPath({ path: keys, json: JSON.parse(response) })

    if (extractedValues && extractedValues.length > 0) {
      core.debug(
        `Extracted values using JSONPath: ${JSON.stringify(extractedValues)}`
      )
      if (secret) {
        core.setSecret(JSON.stringify(extractedValues))
      } else {
        core.setOutput('result', JSON.stringify(extractedValues))
      }
    } else {
      core.setFailed(`No values found using the provided JSONPath.`)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
