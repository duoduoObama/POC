import { html, css, PropertyValueMap } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import * as echarts from 'echarts'; 
import { cloneDeep, isObject } from 'lodash-es';
import { domAssemblyCustomEvents } from '../../util/base-method'; 
import gl from './q-echarts-gl.json';
import { deepWatchModelProxy } from '../../util/utils'; 
import { IDOMEventMeta, IWatchSetting } from '../../types/runtime/IModelSchema';
import { Component } from '../../types/runtime/Component';
// import "https://fastly.jsdelivr.net/npm/echarts@4.9.0/map/js/world.js" 

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('q-echarts-gl')
export class QEchartsGl extends Component {
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
  data: any = Object.freeze(gl)

  /**
   * The number of times the button has been clicked.
   */
  @query("#chart-container")
  chartContainer!: HTMLDivElement;

  myChart!: echarts.ECharts;

  myOptions!: any;

  constructor() {
    super();
    this.initModel();
    domAssemblyCustomEvents(this, this.model.onDOMEvent);
  }

  render() {
    const { text } = this.data;
    return html`
      <div id="chart-container">${text}</div> 
    `
  }

  async initCharts(): Promise<void> {
    const dom = this.chartContainer; 

    this.myChart || (this.myChart = echarts.init(dom));
    this.myChart.showLoading();
    const data = gl;//await fetch(uploadedDataURL).then(res => res.json());

    this.myChart.hideLoading();
    var sizeValue = '57%';
    var symbolSize = 2.5;
    this.myOptions = {
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
          axisLabel: { rotate: 50, interval: 0 },
          xAxisIndex: 0,
        },
        {
          type: 'category',
          gridIndex: 1,
          name: 'Country',
          boundaryGap: false,
          axisLabel: { rotate: 50, interval: 0 },
          xAxisIndex: 1,
        },
        {
          type: 'value',
          gridIndex: 2,
          name: 'Income',
          axisLabel: { rotate: 50, interval: 0 },
          xAxisIndex: 2,
        },
        {
          type: 'value',
          gridIndex: 3,
          name: 'Life Expectancy',
          axisLabel: { rotate: 50, interval: 0 },
          xAxisIndex: 3,
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
    this.myChart.setOption(this.myOptions);

    this.myChart.on("datazoom", (params: any) => {
      const { batch = [] } = params;
      const [{ startValue: startValue1, endValue: endValue1 }, { startValue: startValue2, endValue: endValue2 }] = batch;

      const changeData = this.data.slice().filter((item: any) => {
        if (startValue1 < item[0] && endValue1 > item[0] || startValue2 < item[1] && endValue2 > item[1]) {
          return true;
        }
        return false;
      });
      changeData.unshift(['Income', 'Life Expectancy', 'Population', 'Country', 'Year']);


      this.sendMessage({
        header: {
          srcType: "datazoom",
          src: this.id,
          dst: "",
          dstType: "",
        },
        body: {
          changeData: cloneDeep(changeData),
        }
      })
    });

    this.myOptions && this.myChart.setOption(this.myOptions);
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
    this.initCharts();
  }

  initModel(): void {
    const self = this;

    this.model = deepWatchModelProxy({
      get id() {
        return cloneDeep(self.id);
      },
      get componentName() {
        return "q-echarts-gl";
      },
      get type() {
        return "图元";
      },
      get text() {
        return "gl图元";
      },
      get group() {
        return ["图元"];
      },
      get createTime() {
        return new Date();
      },
      get image() {
        return "";
      },
      _initStyle: "",
      get initStyle() {
        return cloneDeep(this._initStyle);
      },
      set initStyle(value) {
        this._initStyle = value;
      },
      get description() {
        return "图元组件,可以编写图元信息";
      },
      get options() {
        return cloneDeep(self.data);
      },
      get iovSchema() {
        return {
          eventSpecification: {
            inputMessage: [
              {
                text: "更改组件数据",
                eventType: "changeInfo",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "组件点击数据",
                eventType: "click",
                messageSchema: "",
                messageDemo: "文本数据1",
              },
            ],
          },
          optionsView: {
            list: [
              {
                type: "input",
                label: "输入框",
                options: {
                  type: "text",
                  width: "100%",
                  defaultValue: "",
                  placeholder: "请输入",
                  clearable: false,
                  maxLength: 0,
                  prepend: "",
                  append: "",
                  tooptip: "",
                  hidden: false,
                  disabled: false,
                  dynamicHide: false,
                  dynamicHideValue: "",
                },
                model: "text",
                key: "text",
                rules: [
                  { required: false, message: "必填项", trigger: ["blur"] },
                ],
              },
            ],
          },
        };
      },
      _onMessageMeta: {},
      _onDOMEvent: {},
      _onWatchSetting: {},
      get onMessageMeta() {
        return cloneDeep(this._onMessageMeta);
      },
      set onMessageMeta(value) {
        if (!isObject(value)) {
          return;
        }
        this._onMessageMeta = value;
      },
      get onDOMEvent() {
        return cloneDeep(this._onDOMEvent);
      },
      set onDOMEvent(value) {
        if (!isObject(value)) {
          return;
        }
        domAssemblyCustomEvents(self, value as IDOMEventMeta);
        this._onDOMEvent = value;
      },
      get onWatchSetting() {
        return cloneDeep(this._onWatchSetting);
      },
      set onWatchSetting(value: IWatchSetting) {
        if (!isObject(value)) {
          return;
        }
        this._onWatchSetting = value;
      },
      get data() {
        return cloneDeep(self.data);
      },
      set data(value) {
        self.data = value;
      },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'q-echarts-gl': QEchartsGl
  }
}

declare const navigation: any;