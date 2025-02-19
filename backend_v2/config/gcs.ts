import env from '#start/env'
import * as fs from 'node:fs'
import { dirname, join } from 'node:path'

export const getServiceAccount = () => {
  const jsonFilename = env.get('SERVICE_ACCOUNT_JSON_FILENAME')
  const serviceAccountPath = join(dirname(import.meta.filename), '..', jsonFilename)

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      `Service account file not found at root path. Please create a service account file and place it in the root directory.`
    )
  }

  const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8')
  return JSON.parse(serviceAccountData) as [any]
}
