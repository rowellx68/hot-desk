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

/**
 * Converts the row ID and Column ID into a cell ID.
 * 
 * @param rowId - Row ID
 * @param colId - Column ID
 * @returns A cell ID with the expected offset
 * 
 * @example
 * 
 * ```ts
 * const cellId = toCellId(0, 0) // will return B2
 * ```
 */
export const toCellId = (rowId: number, colId: number): string => {
  const columns = ['B', 'C', 'D', 'E', 'F']

  return `${columns[colId]}${rowId + 2}`
}