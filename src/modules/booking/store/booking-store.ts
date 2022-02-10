import { startOfWeek, addDays, format, parse } from 'date-fns'
import { defineStore } from 'pinia'

const currentWeek = startOfWeek(Date.now(), { weekStartsOn: 1 })

/**
 * This method ensures that there are 5 columns per row
 * and that there are 50 rows. This corresponds to the number
 * of working days in a week (columns) and tables (rows).
 * 
 * @param cellResults - The cells from Google Sheets API
 * @returns A tidied up version of the `cellResults`
 */
const tidyCellResults = (cellResults: string[][]): string[][] => {
  const cleaned: string[][] = []

  cellResults.forEach(row => {
    const rowPadded = row.concat('', '', '', '', '')
    rowPadded.length = 5

    cleaned.push(rowPadded)
  })

  for (let i = cleaned.length; i < 50; i++) {
    cleaned.push(['', '', '', '', ''])
  }
  cleaned.length = 50

  return cleaned
}

export const useBookingStore = defineStore('booking', {
  state: () => {
    return {
      sheets: [] as string[],
      selectedWeek: '',
      cells: [] as string[][],
    }
  },
  getters: {
    datesInWeek() {
      if (!this.selectedWeek) {
        return []
      }

      const wc = parse(this.selectedWeek, '\'W/C\' dd.MM.yyyy', Date.now())

      return [0, 1, 2, 3, 4].map(d => format(addDays(wc, d), 'do MMM'))
    },
  },
  actions: {
    /**
     * This action fetches all of the sheets in a given (`spreadsheetId`) Google Sheet.
     * 
     * @param resource - The `SpreadsheetsResource` from Google API Client 
     * @param spreadsheetId - The ID of the spreadsheet you want to read from/write to
     * 
     * @example
     * Example usage
     * 
     * ```ts
     * const sheets = await useGoogleSheets(gapi)
     * await store.getSheets(sheets, sheetId)
     * ```
     */
    async getSheets(
      resource: gapi.client.sheets.SpreadsheetsResource,
      spreadsheetId: string,
    ): Promise<void> {
      try {
        const { status, result } = await resource.get({ spreadsheetId })

        if (status !== 200) {
          return
        }

        const sheets = result.sheets
          ?.map(s => s.properties?.title)
          .filter(s => s !== undefined) ?? []
        const currentWeekToSelect = format(currentWeek, '\'W/C\' dd.MM.yyyy')
        const selectedWeek = sheets.includes(currentWeekToSelect)
          ? currentWeekToSelect
          : ''

        this.$patch({
          sheets,
          selectedWeek,
        })
      } catch (error) {
        error
      }
    },
    /**
     * 
     * @param resource - The `SpreadsheetsResource` from Google API Client 
     * @param spreadsheetId - The ID of the spreadsheet you want to read from/write to
     * @param sheet - This is the sheet name; i.e. `'W/C 31.01.2022'`
     * 
     * @example
     * Example usage
     * ```ts
     * const sheets = await useGoogleSheets(gapi)
     * await store.getCells(sheets, sheetId, store.selectedWeek)
     * ```
     */
    async getCells(
      resource: gapi.client.sheets.SpreadsheetsResource,
      spreadsheetId: string,
      sheet: string,
    ) {
      try {
        const { status, result } = await resource.values.get({
          spreadsheetId,
          range: `${sheet}!B2:F51`,
        })

        if (status !== 200) {
          return
        }

        const cells = tidyCellResults(result.values ?? [])

        this.$patch({
          cells,
        })
      } catch (error) {
        error
      }
    },
    async updateCell(
      resource: gapi.client.sheets.SpreadsheetsResource,
      spreadsheetId: string,
      sheet: string,
      cell: string,
      value: string,
    ) {
      try {
        const range = `${sheet}!${cell}`

        const { status, result } = await resource.values.update({
          spreadsheetId,
          range,
          valueInputOption: 'USER_ENTERED',
        }, {
          range,
          values: [[value]],
        })

        if (status !== 200) {
          return
        }

        await this.getCells(resource, spreadsheetId, sheet)
      } catch (error) {
        error
      }
    },
  },
})