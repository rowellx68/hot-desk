import { ComposeOption } from 'echarts/core'
import { TooltipComponentOption, GeoComponentOption } from 'echarts/components'
import colors from 'tailwindcss/colors'

type MapChartOptions = ComposeOption<TooltipComponentOption | GeoComponentOption>

const createSelectedRegions = (values: string[]): any[] => {
  const selected: any[] = []

  values.forEach((val, i) => {
    if (val.length > 0) {
      selected.push({
        name: `${i + 1}`,
        itemStyle: {
          color: colors.red[500],
        },
        tooltip: {
          formatter: (value: any) => 'Desk # ' + value.name + '. ' + val,
        },
        emphasis: {
          itemStyle: {
            color: colors.red[500],
          },
        },
      })
    }
  })

  return selected
}

export const createChartOptions = (values: string[]): MapChartOptions => {
  return {
    tooltip: {},
    geo: {
      map: 'seats',
      roam: true,
      // layoutCenter: ['80%', '80%'],
      layoutSize: '100%',
      tooltip: {
        show: true,
        formatter: (val) => 'Desk # ' + val.name,
      },
      itemStyle: {
        color: '#fff',
        borderColor: undefined,
      },
      emphasis: {
        itemStyle: {
          color: colors.lime[500],
        },
        label: {
          show: false,
        },
      },
      select: {
        itemStyle: {
          color: colors.lime[500],
        },
        label: {
          show: false,
          textBorderColor: '#fff',
          textBorderWidth: 2,
        },
      },
      regions: createSelectedRegions(values),
    },
  }
}