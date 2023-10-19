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
    const jsonPath: string = core.getInput('json-Path')
    const key: string = core.getInput('key')
    const secret: boolean = core.getBooleanInput('secret')

    // open the session
    core.debug(`Opening environment for ${org}/${environment}`)
    const id = await open(token, org, environment)
    core.info(`Session opened: ${id}`)

    // read the session values
    core.debug(`Reading session values for ${org}/${environment}/${id}`)
    const response = await read(token, org, environment, id)
    core.debug(`Session values read: ${response}`)

    // use jsonPath to filter results
    if (jsonPath != '') {
      // Extract values using JSONPath
      // we need to reconvert to a JSON string to do this
      const extractedValues = JSONPath({ path: jsonPath, json: JSON.stringify(propertiesData) })

      if (extractedValues && extractedValues.length > 0) {
        core.debug(
          `Extracted values using JSONPath: ${JSON.stringify(extractedValues)}`
        )
        if (secret) {
          core.setSecret(extractedValues)
        }
        core.setOutput('result', JSON.stringify(extractedValues))
      } else {
        core.setFailed(`No values found using the provided JSONPath.`)
      }
    }

  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
