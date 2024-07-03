import { Chart } from 'chart.js'
import React, { Component } from 'react'

import { Axis, Dataset } from './interfaces'

interface Props {
  datasets: Dataset[]
  xAxes?: Axis[]
  yAxes?: Axis[]
  title?: string
  titleFontSize?: number
  titleFontColor?: string
  width?: string
  height?: string
}

class LineGraph extends Component<Props, Record<string, unknown>> {
  chartRef = React.createRef<HTMLCanvasElement>()
  graph: Chart | null = null

  componentDidMount() {
    const { datasets, xAxes, yAxes, title, titleFontSize, titleFontColor } = this.props
    const myChartRef = this.chartRef.current?.getContext('2d')

    if (myChartRef) {
      this.graph = new Chart(myChartRef, {
        type: 'line',
        data: {
          datasets: datasets.map((dataset) => ({
            label: dataset.label,
            data: dataset.data.map((dataPoint) => ({
              x: dataPoint.x,
              y: dataPoint.y,
            })),
            backgroundColor: dataset.backgroundColor,
            borderColor: dataset.borderColor,
          })),
        },
        options: {
          scales: {
            xAxes: xAxes?.map((axis) => ({
              type: axis.type,
              scaleLabel: {
                display: true,
                labelString: axis.label,
              },
              time: axis.type === 'time' ? {
                unit: axis.timeFormat,
                stepSize: axis.timeStepSize,
              } : undefined,
            })) || [],
            yAxes: yAxes?.map((axis) => ({
              type: axis.type,
              scaleLabel: {
                display: true,
                labelString: axis.label,
              },
            })) || [],
          },
          title: {
            display: !!title,
            text: title,
            fontSize: titleFontSize,
            fontColor: titleFontColor,
          },
        },
      })
    }
  }

  render() {
    const { width, height } = this.props
    return <canvas ref={this.chartRef} width={width} height={height} />
  }
}

export { LineGraph }
