import * as core from '@actions/core'
import { open } from './open'
import { read } from './read'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const token: string = core.getInput('access-token')
    const org: string = core.getInput('organization')
    const environment: string = core.getInput('environment')

    // open the session
    core.debug(`Opening environment for ${org}/${environment}`)
    const id = await open(token, org, environment)
    core.info(`Session opened: ${id}`)

    // read the session values
    core.debug(`Reading session values for ${org}/${environment}/${id}`)
    const response = await read(token, org, environment, id)
    core.info(`Session values read: ${response}`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
