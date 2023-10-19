import * as core from '@actions/core'
import { open } from './open'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const token: string = core.getInput('access-token')
    const org: string = core.getInput('org')
    const environment: string = core.getInput('environment')

    core.debug(`Opening environment for ${org}/${environment}`)
    await open(token, org, environment)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
