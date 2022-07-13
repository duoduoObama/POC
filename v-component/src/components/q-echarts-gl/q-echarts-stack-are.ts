import { html, css, PropertyValueMap } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import * as echarts from 'echarts';
import { Component } from '../../types/Component';
import { cloneDeep, isObject } from 'lodash-es';
import { domAssemblyCustomEvents } from '../../util/base-method';
import { IDOMEventMeta, IWatchSetting } from '../../types/IComponent';
import gl from './q-echarts-gl.json';
import { deepWatchModelProxy } from '../../util/utils';
// import "https://fastly.jsdelivr.net/npm/echarts@4.9.0/map/js/world.js" 

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('q-echarts-stack-are')
export class QEchartsStackAre extends Component {
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
    const div = document.createElement('div');
    div.id = 'chart-container';
    return div;
  }

  async initCharts(): Promise<void> {
    const dom = this.chartContainer;

    this.myChart || (this.myChart = echarts.init(dom));
    this.myChart.showLoading();
    const data = this.data;//await fetch(uploadedDataURL).then(res => res.json());

    this.myChart.hideLoading();
    this.myOptions = {
      title: {
        text: '堆叠面积图'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ["Income", "Life Expectancy", "Population", "Year"]
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ["Income", "Life Expectancy", "Population", "Year"]
        }
      ],
      dataset: {
        source: data
      },
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Income',
          type: 'line',
          seriesLayoutBy: 'row'
        },
        {
          name: 'Life Expectancy',
          type: 'line',
          seriesLayoutBy: 'row'
        },
        {
          name: 'Population',
          type: 'line',
          seriesLayoutBy: 'row'
        },
        {
          name: 'Year',
          type: 'line',
          seriesLayoutBy: 'row'
        }
      ]
    };
    this.myChart.setOption(this.myOptions);

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
      get schema() {
        return {
          eventSpecification: {
            inputEvent: [
              {
                text: "更改组件数据",
                eventType: "changeInfo",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputEvent: [
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
    'q-echarts-stack-are': QEchartsStackAre
  }
}

declare const navigation: any;