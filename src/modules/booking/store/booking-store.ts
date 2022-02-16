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
      activeDay: 0 as 0 | 1 | 2 | 3 | 4,
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
    cellsForDay() {
      if (this.cells.length === 0) {
        return []
      }

      const day: string[] = this.cells.map(c => c[this.activeDay])

      return day
    },
    activeDayColumn() {
      const col = ['B', 'C', 'D', 'E', 'F'].at(this.activeDay)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return col!
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
          activeDay: 0,
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
    /**
     * This action updates the value of a cell and fetches the most up to date values
     * of all the cells.
     * 
     * @param resource - The `SpreadsheetsResource` from Google API Client 
     * @param spreadsheetId - The ID of the spreadsheet you want to read from/write to
     * @param sheet - This is the sheet name; i.e. `'W/C 31.01.2022'`
     * @param cell - The cell we will be writing to; i.e. `B2`
     * @param value - The value we want to write to the cell
     */
    async updateCell(
      resource: gapi.client.sheets.SpreadsheetsResource,
      spreadsheetId: string,
      sheet: string,
      cell: string,
      value: string,
    ) {
      try {
        const range = `${sheet}!${cell}`

        const { status } = await resource.values.update({
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