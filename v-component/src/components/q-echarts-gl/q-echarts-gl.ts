import { html, css, LitElement, PropertyValueMap } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import * as echarts from 'echarts';
// import "https://fastly.jsdelivr.net/npm/echarts@4.9.0/map/js/world.js" 

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('q-echarts-gl')
export class QEchartsGl extends LitElement {
  static styles = css`
    :host {
      display: block; 
      height: 100%;
      width: 100%;
    } 
    #chart-container {
      height: 100%;
      width: 100%;
    }
  `

  /**
   * The name to say "Hello" to.
   */
  @property({ type: Object, attribute: "data-data" })
  data: any = {}

  /**
   * The number of times the button has been clicked.
   */
  @query("#chart-container")
  chartContainer!: HTMLDivElement;

  myChart!: echarts.ECharts;

  render() {
    const { text } = this.data;
    return html`
      <div id="chart-container">${text}</div> 
    `
  }

  async initCharts(): Promise<void> {
    const dom = this.chartContainer;

    const ROOT_PATH =
      'https://fastly.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';

    this.myChart = echarts.init(dom);
    var option;

    var uploadedDataURL = ROOT_PATH + '/data/asset/data/life-expectancy-table.json';
    this.myChart.showLoading();
    const data = await fetch(uploadedDataURL).then(res => res.json());

    this.myChart.hideLoading();
    var sizeValue = '57%';
    var symbolSize = 2.5;
    option = {
      legend: {},
      tooltip: {},
      toolbox: {
        left: 'center',
        feature: {
          dataZoom: {}
        }
      },
      grid: [
        { right: sizeValue, bottom: sizeValue },
        { left: sizeValue, bottom: sizeValue },
        { right: sizeValue, top: sizeValue },
        { left: sizeValue, top: sizeValue }
      ],
      xAxis: [
        {
          type: 'value',
          gridIndex: 0,
          name: 'Income',
          axisLabel: { rotate: 50, interval: 0 }
        },
        {
          type: 'category',
          gridIndex: 1,
          name: 'Country',
          boundaryGap: false,
          axisLabel: { rotate: 50, interval: 0 }
        },
        {
          type: 'value',
          gridIndex: 2,
          name: 'Income',
          axisLabel: { rotate: 50, interval: 0 }
        },
        {
          type: 'value',
          gridIndex: 3,
          name: 'Life Expectancy',
          axisLabel: { rotate: 50, interval: 0 }
        }
      ],
      yAxis: [
        { type: 'value', gridIndex: 0, name: 'Life Expectancy' },
        { type: 'value', gridIndex: 1, name: 'Income' },
        { type: 'value', gridIndex: 2, name: 'Population' },
        { type: 'value', gridIndex: 3, name: 'Population' }
      ],
      dataset: {
        dimensions: [
          'Income',
          'Life Expectancy',
          'Population',
          'Country',
          { name: 'Year', type: 'ordinal' }
        ],
        source: data
      },
      series: [
        {
          type: 'scatter',
          symbolSize: symbolSize,
          xAxisIndex: 0,
          yAxisIndex: 0,
          encode: {
            x: 'Income',
            y: 'Life Expectancy',
            tooltip: [0, 1, 2, 3, 4]
          }
        },
        {
          type: 'scatter',
          symbolSize: symbolSize,
          xAxisIndex: 1,
          yAxisIndex: 1,
          encode: {
            x: 'Country',
            y: 'Income',
            tooltip: [0, 1, 2, 3, 4]
          }
        },
        {
          type: 'scatter',
          symbolSize: symbolSize,
          xAxisIndex: 2,
          yAxisIndex: 2,
          encode: {
            x: 'Income',
            y: 'Population',
            tooltip: [0, 1, 2, 3, 4]
          }
        },
        {
          type: 'scatter',
          symbolSize: symbolSize,
          xAxisIndex: 3,
          yAxisIndex: 3,
          encode: {
            x: 'Life Expectancy',
            y: 'Population',
            tooltip: [0, 1, 2, 3, 4]
          }
        }
      ]
    };
    this.myChart.setOption(option);

    option && this.myChart.setOption(option);
    window.addEventListener("resize", () => {
      this.myChart.resize();
    })

    this.myChart.resize();
    navigation.addEventListener("navigate", () => {
      setTimeout(() => {
        this.myChart.resize();
      })
    })
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.initCharts()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'q-echarts-gl': QEchartsGl
  }
}

declare const navigation: any;