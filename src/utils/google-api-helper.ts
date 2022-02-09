import { VueGapi } from 'vue-gapi'
import { inject } from 'vue'

/**
 * This wraps the `inject('gapi')` for simplicity
 * 
 * @returns The instance of the Google API Client
 */
export const useGapi = (): VueGapi => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return inject('gapi')!
}

/**
 * 
 * @param gapi - The instance of the Google API Client
 * @returns The Spreadsheets resource.
 */
export const useGoogleSheets = async (gapi: VueGapi): Promise<gapi.client.sheets.SpreadsheetsResource> => {
  const { client } = await gapi.getGapiClient()

  return client.sheets.spreadsheets
}