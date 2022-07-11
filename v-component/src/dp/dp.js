var tableInfo = {
  columns: [
    {
      title: "Full Name",
      width: 100,
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "Age",
      width: 100,
      dataIndex: "age",
      key: "age",
      fixed: "left",
    },
    { title: "Column 1", dataIndex: "address", key: "1", width: 150 },
    { title: "Column 2", dataIndex: "address", key: "2", width: 150 },
    { title: "Column 3", dataIndex: "address", key: "3", width: 150 },
    { title: "Column 4", dataIndex: "address", key: "4", width: 150 },
    { title: "Column 5", dataIndex: "address", key: "5", width: 150 },
    { title: "Column 6", dataIndex: "address", key: "6", width: 150 },
    { title: "Column 7", dataIndex: "address", key: "7", width: 150 },
    { title: "Column 8", dataIndex: "address", key: "8" },
    {
      title: "操作",
      key: "operation",
      dataIndex: "operation",
      fixed: "right",
      width: 200,
      name: "编辑",
    },
  ],
  dataSource: [
    { key: 0, name: "Edrward 0", age: 1, address: "London Park no. 0" },
    { key: 1, name: "Edrward 1", age: 2, address: "London Park no. 1" },
    { key: 2, name: "Edrward 2", age: 3, address: "London Park no. 2" },
    { key: 3, name: "Edrward 3", age: 4, address: "London Park no. 3" },
    { key: 4, name: "Edrward 4", age: 5, address: "London Park no. 4" },
    { key: 5, name: "Edrward 5", age: 6, address: "London Park no. 5" },
    { key: 6, name: "Edrward 6", age: 7, address: "London Park no. 6" },
    { key: 7, name: "Edrward 7", age: 8, address: "London Park no. 7" },
    { key: 8, name: "Edrward 8", age: 9, address: "London Park no. 8" },
    { key: 9, name: "Edrward 9", age: 10, address: "London Park no. 9" },
    { key: 10, name: "Edrward 10", age: 11, address: "London Park no. 10" },
    { key: 11, name: "Edrward 11", age: 12, address: "London Park no. 11" },
    { key: 12, name: "Edrward 12", age: 13, address: "London Park no. 12" },
    { key: 13, name: "Edrward 13", age: 14, address: "London Park no. 13" },
    { key: 14, name: "Edrward 14", age: 15, address: "London Park no. 14" },
    { key: 15, name: "Edrward 15", age: 16, address: "London Park no. 15" },
    { key: 16, name: "Edrward 16", age: 17, address: "London Park no. 16" },
    { key: 17, name: "Edrward 17", age: 18, address: "London Park no. 17" },
    { key: 18, name: "Edrward 18", age: 19, address: "London Park no. 18" },
    { key: 19, name: "Edrward 19", age: 20, address: "London Park no. 19" },
    { key: 20, name: "Edrward 20", age: 21, address: "London Park no. 20" },
    { key: 21, name: "Edrward 21", age: 22, address: "London Park no. 21" },
    { key: 22, name: "Edrward 22", age: 23, address: "London Park no. 22" },
    { key: 23, name: "Edrward 23", age: 24, address: "London Park no. 23" },
    { key: 24, name: "Edrward 24", age: 25, address: "London Park no. 24" },
    { key: 25, name: "Edrward 25", age: 26, address: "London Park no. 25" },
    { key: 26, name: "Edrward 26", age: 27, address: "London Park no. 26" },
    { key: 27, name: "Edrward 27", age: 28, address: "London Park no. 27" },
    { key: 28, name: "Edrward 28", age: 29, address: "London Park no. 28" },
    { key: 29, name: "Edrward 29", age: 30, address: "London Park no. 29" },
    { key: 30, name: "Edrward 30", age: 31, address: "London Park no. 30" },
    { key: 31, name: "Edrward 31", age: 32, address: "London Park no. 31" },
    { key: 32, name: "Edrward 32", age: 33, address: "London Park no. 32" },
    { key: 33, name: "Edrward 33", age: 34, address: "London Park no. 33" },
    { key: 34, name: "Edrward 34", age: 35, address: "London Park no. 34" },
    { key: 35, name: "Edrward 35", age: 36, address: "London Park no. 35" },
    { key: 36, name: "Edrward 36", age: 37, address: "London Park no. 36" },
    { key: 37, name: "Edrward 37", age: 38, address: "London Park no. 37" },
    { key: 38, name: "Edrward 38", age: 39, address: "London Park no. 38" },
    { key: 39, name: "Edrward 39", age: 40, address: "London Park no. 39" },
    { key: 40, name: "Edrward 40", age: 41, address: "London Park no. 40" },
    { key: 41, name: "Edrward 41", age: 42, address: "London Park no. 41" },
    { key: 42, name: "Edrward 42", age: 43, address: "London Park no. 42" },
    { key: 43, name: "Edrward 43", age: 44, address: "London Park no. 43" },
    { key: 44, name: "Edrward 44", age: 45, address: "London Park no. 44" },
    { key: 45, name: "Edrward 45", age: 46, address: "London Park no. 45" },
    { key: 46, name: "Edrward 46", age: 47, address: "London Park no. 46" },
    { key: 47, name: "Edrward 47", age: 48, address: "London Park no. 47" },
    { key: 48, name: "Edrward 48", age: 49, address: "London Park no. 48" },
    { key: 49, name: "Edrward 49", age: 50, address: "London Park no. 49" },
    { key: 50, name: "Edrward 50", age: 51, address: "London Park no. 50" },
    { key: 51, name: "Edrward 51", age: 52, address: "London Park no. 51" },
    { key: 52, name: "Edrward 52", age: 53, address: "London Park no. 52" },
    { key: 53, name: "Edrward 53", age: 54, address: "London Park no. 53" },
    { key: 54, name: "Edrward 54", age: 55, address: "London Park no. 54" },
    { key: 55, name: "Edrward 55", age: 56, address: "London Park no. 55" },
    { key: 56, name: "Edrward 56", age: 57, address: "London Park no. 56" },
    { key: 57, name: "Edrward 57", age: 58, address: "London Park no. 57" },
    { key: 58, name: "Edrward 58", age: 59, address: "London Park no. 58" },
  ],
};

var config = {
  componentsArray: [
    {
      id: "q-router-config-741zj09abdcs",
      componentName: "q-router-config",
      type: "数据源",
      text: "路由配置",
      group: ["数据源"],
      createTime: "2022-06-20T07:49:43.975Z",
      image: "",
      initStyle:
        "position: absolute; top: 140px; width: 30%;height:30%;background-color: #fff;",
      options: {
        router: {
          "q-text-ka5ue9mx5qd7": {
            title: "text1-text2",
            target: "q-text-ka5ue9mx5qd7",
            trigger: ["click"],
            receive: [
              {
                source: "q-text-dvoly35smyer",
                event: ["changeInfo"],
                script: "function(data) { return data.node; }",
                replyStatus: false,
                reply: [],
              },
            ],
          },
          "q-text-dvoly35smyer": {
            title: "text1-text2",
            target: "q-text-dvoly35smyer",
            trigger: ["click"],
            receive: [
              {
                source: "q-text-ka5ue9mx5qd7",
                event: ["changeInfo"],
                script: "function(data) { return data.node; }",
                replyStatus: false,
                reply: [],
              },
            ],
          },
        },
      },
    },
    {
      initStyle:
        "position: absolute; z-index: -1; width: 100vw; height: 100vh; overflow: hidden;",
      options: {
        src: "http://192.168.21.92:3000/v-component/src/assets/bg.png",
      },
      model: {},
      default: null,
      id: "drag-ouky34zcvhun",
    },
    {
      componentName: "q-text",
      createTime: "2022-06-20T07:49:43.975Z",
      default: null,
      description: "",
      group: ["文本"],
      id: "q-text-ka5ue9mx5qd7",
      image: "",
      initStyle: "position: absolute; top: 0px; width: 100%;",
      options: {
        text: "数据可视化显示系统",
      },
      schema: {
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
                {
                  required: false,
                  message: "必填项",
                  trigger: ["blur"],
                },
              ],
            },
          ],
        },
      },
      text: "文本",
      type: "文本",
      model: {
        data: { text: "数据可视化显示系统" },
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
                {
                  required: false,
                  message: "必填项",
                  trigger: ["blur"],
                },
              ],
            },
          ],
        },
        onMessageMeta: {
          changeInfo: [
            function (e) {
              console.log(e, this);
              this.data = { text: String(e.body) };
            },
          ],
        },
        onDOMEvent: {
          onclick: [
            (e) => {
              console.log(e);
            },
          ],
        },
        onWatchSetting: {
          data: [
            (newVal, oldVal, component) => {
              console.log(newVal, oldVal, component);
            },
          ],
          initStyle: [
            (newVal, oldVal, component) => {
              console.log(newVal, oldVal, component);
            },
          ],
        },
      },
    },
    {
      componentName: "q-text",
      createTime: "2022-06-20T07:49:43.975Z",
      default: null,
      description: "",
      group: ["文本"],
      id: "q-text-dvoly35smyer",
      image: "",
      initStyle:
        "position: absolute; overflow: hidden; border: 2px solid rgb(3, 61, 55); top: 10%; left: 5%; color: rgb(8, 170, 153); z-index: 1;",
      options: {
        text: "疫情曲线",
      },
      schema: {
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
                {
                  required: false,
                  message: "必填项",
                  trigger: ["blur"],
                },
              ],
            },
          ],
        },
      },
      text: "文本",
      type: "文本",
      model: {
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
                {
                  required: false,
                  message: "必填项",
                  trigger: ["blur"],
                },
              ],
            },
          ],
        },
        onMessageMeta: {
          changeInfo: [
            function (e) {
              console.log(e, this);
              this.data = { text: String(e.body) };
            },
          ],
        },
        onDOMEvent: {
          onclick: [
            (e) => {
              console.log(e);
            },
          ],
        },
        onWatchSetting: {
          data: [
            (newVal, oldVal, component) => {
              console.log(newVal, oldVal, component);
            },
          ],
          initStyle: [
            (newVal, oldVal, component) => {
              console.log(newVal, oldVal, component);
            },
          ],
        },
      },
    },
    {
      initStyle:
        "height: 24%; width: 16%; position: absolute; overflow: hidden; border: 2px solid rgb(3, 61, 55); top: 10%; left: 5%;",
      options: {
        src: "http://192.168.21.92:3000/v-component/src/assets/1654829140850.jpg",
      },
      model: {},
      default: null,
      id: "drag-y3md2bby3y37",
    },
    {
      componentName: "q-text",
      createTime: "2022-06-20T07:49:43.975Z",
      default: null,
      description: "",
      group: ["文本"],
      id: "q-text-3wgumvizrx6r",
      image: "",
      initStyle:
        "position: absolute; overflow: hidden; border: 2px solid rgb(3, 61, 55); top: 40%; left: 5%; color: rgb(8, 170, 153); z-index: 1;",
      options: {
        text: "图谱分析",
      },
      schema: {
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
                {
                  required: false,
                  message: "必填项",
                  trigger: ["blur"],
                },
              ],
            },
          ],
        },
      },
      text: "文本",
      type: "文本",
      model: {
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
                {
                  required: false,
                  message: "必填项",
                  trigger: ["blur"],
                },
              ],
            },
          ],
        },
        onMessageMeta: [
          {
            changeInfo: [
              (e) => {
                console.log(e);
                this.data = { text: String(e.body) };
              },
            ],
          },
        ],
        onDOMEvent: {
          onclick: [
            (e) => {
              console.log(e);
            },
          ],
        },
        onWatchSetting: [
          {
            data: (newVal, oldVal, component) => {
              console.log(newVal, oldVal, component);
            },
          },
        ],
      },
    },
    {
      initStyle:
        "height: 24%; width: 16%; position: absolute; overflow: hidden; border: 2px solid rgb(3, 61, 55); top: 40%; left: 5%;",
      options: {
        src: "http://192.168.21.92:3000/v-component/src/assets/1654829578132.jpg",
      },
      model: {},
      default: null,
      id: "drag-yfs1wndkejkl",
    },
    {
      componentName: "q-text",
      createTime: "2022-06-20T07:49:43.975Z",
      default: null,
      description: "",
      group: ["文本"],
      id: "q-text-he2cuh2mchr0",
      image: "",
      initStyle:
        "position: absolute; overflow: hidden; border: 2px solid rgb(3, 61, 55); top: 71%; left: 5%; color: rgb(8, 170, 153); z-index: 1;",
      options: {
        text: "离散分析",
      },
      schema: {
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
                {
                  required: false,
                  message: "必填项",
                  trigger: ["blur"],
                },
              ],
            },
          ],
        },
      },
      text: "文本",
      type: "文本",
      model: {
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
                {
                  required: false,
                  message: "必填项",
                  trigger: ["blur"],
                },
              ],
            },
          ],
        },
        onMessageMeta: [
          {
            changeInfo: [
              (e) => {
                console.log(e);
                this.data = { text: String(e.body) };
              },
            ],
          },
        ],
        onDOMEvent: {
          onclick: [
            (e) => {
              console.log(e);
            },
          ],
        },
        onWatchSetting: [
          {
            data: (newVal, oldVal, component) => {
              console.log(newVal, oldVal, component);
            },
          },
        ],
      },
    },
    {
      initStyle:
        "height: 24%; width: 16%; position: absolute; overflow: hidden; border: 2px solid rgb(3, 61, 55); top: 71%; left: 5%;",
      options: {
        src: "http://192.168.21.92:3000/v-component/src/assets/1654829505010.jpg",
      },
      model: {},
      default: null,
      id: "drag-pmku7p087gwi",
    },
    {
      initStyle:
        "position: absolute; overflow: hidden; border: 2px solid rgb(3, 61, 55); top: 10%; right: 4.5%; color: rgb(8, 170, 153); z-index: 1;",
      options: {
        text: "告警数据已更新,请注意查收!!!",
      },
      model: {},
      default: null,
      id: "drag-hsrhgh7gcb6k",
    },
    {
      componentName: "q-tabs",
      createTime: "2022-06-20T07:49:43.975Z",
      default: null,
      description: "",
      group: ["容器"],
      id: "q-tabs-oq8hj6jg0w61",
      image: "",
      initStyle:
        "height: 84.8%; width: 22.8%; position: absolute; left: 22%; top: 10%;",
      options: {
        tabs: [
          {
            title: "正态分布",
            id: "test1",
          },
          {
            title: "GIS动态",
            id: "test2",
          },
        ],
      },
      schema: {
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
              text: "切换选项卡",
              eventType: "switchTAB",
              messageSchema: "",
              messageDemo: "",
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
              model: "title",
              key: "title",
              rules: [
                {
                  required: false,
                  message: "必填项",
                  trigger: ["blur"],
                },
              ],
            },
            {
              type: "textarea",
              label: "文本框",
              options: {
                width: "100%",
                maxLength: 0,
                defaultValue: "",
                rows: 4,
                clearable: false,
                tooptip: "",
                hidden: false,
                disabled: false,
                placeholder: "请输入",
                dynamicHide: false,
                dynamicHideValue: "",
              },
              model: "id",
              key: "id",
              rules: [
                {
                  required: false,
                  message: "必填项",
                  trigger: ["blur"],
                },
              ],
            },
          ],
        },
      },
      text: "选项卡",
      type: "容器",
      model: {
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
              text: "切换选项卡",
              eventType: "switchTAB",
              messageSchema: "",
              messageDemo: "",
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
              model: "title",
              key: "title",
              rules: [
                {
                  required: false,
                  message: "必填项",
                  trigger: ["blur"],
                },
              ],
            },
            {
              type: "textarea",
              label: "文本框",
              options: {
                width: "100%",
                maxLength: 0,
                defaultValue: "",
                rows: 4,
                clearable: false,
                tooptip: "",
                hidden: false,
                disabled: false,
                placeholder: "请输入",
                dynamicHide: false,
                dynamicHideValue: "",
              },
              model: "id",
              key: "id",
              rules: [
                {
                  required: false,
                  message: "必填项",
                  trigger: ["blur"],
                },
              ],
            },
          ],
        },
      },
    },
    {
      initStyle: "height: 100%; border: 2px solid rgb(3, 61, 55);",
      options: {
        src: "http://192.168.21.92:3000/v-component/src/assets/1655104783919.jpg",
      },
      model: {},
      default: null,
      id: "drag-hke0o1cj9liz",
    },
    {
      initStyle: "height: 100%; border: 2px solid rgb(3, 61, 55);",
      options: {
        src: "http://192.168.21.92:3000/v-component/src/assets/1654853215692.png",
      },
      model: {},
      default: null,
      id: "drag-8e24nd8l8ap9",
    },
    {
      componentName: "q-tabs",
      createTime: "2022-06-20T07:49:43.975Z",
      default: null,
      description: "",
      group: ["容器"],
      id: "q-tabs-vmid2ibz6k9r",
      image: "",
      initStyle:
        "height: 30%; width: 50%; position: absolute; right: 4.5%; top: 10%;",
      options: {
        tabs: [
          {
            title: "桑基划分",
            id: "test1",
          },
          {
            title: "GIS动态",
            id: "test2",
          },
        ],
      },
      schema: {
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
              text: "切换选项卡",
              eventType: "switchTAB",
              messageSchema: "",
              messageDemo: "",
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
              model: "title",
              key: "title",
              rules: [
                {
                  required: false,
                  message: "必填项",
                  trigger: ["blur"],
                },
              ],
            },
            {
              type: "textarea",
              label: "文本框",
              options: {
                width: "100%",
                maxLength: 0,
                defaultValue: "",
                rows: 4,
                clearable: false,
                tooptip: "",
                hidden: false,
                disabled: false,
                placeholder: "请输入",
                dynamicHide: false,
                dynamicHideValue: "",
              },
              model: "id",
              key: "id",
              rules: [
                {
                  required: false,
                  message: "必填项",
                  trigger: ["blur"],
                },
              ],
            },
          ],
        },
      },
      text: "选项卡",
      type: "容器",
      model: {
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
              text: "切换选项卡",
              eventType: "switchTAB",
              messageSchema: "",
              messageDemo: "",
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
              model: "title",
              key: "title",
              rules: [
                {
                  required: false,
                  message: "必填项",
                  trigger: ["blur"],
                },
              ],
            },
            {
              type: "textarea",
              label: "文本框",
              options: {
                width: "100%",
                maxLength: 0,
                defaultValue: "",
                rows: 4,
                clearable: false,
                tooptip: "",
                hidden: false,
                disabled: false,
                placeholder: "请输入",
                dynamicHide: false,
                dynamicHideValue: "",
              },
              model: "id",
              key: "id",
              rules: [
                {
                  required: false,
                  message: "必填项",
                  trigger: ["blur"],
                },
              ],
            },
          ],
        },
      },
    },
    {
      initStyle: "height: 100%; border: 2px solid rgb(3, 61, 55);",
      options: {
        src: "http://192.168.21.92:3000/v-component/src/assets/1654840806851.jpg",
      },
      model: {},
      default: null,
      id: "drag-kv0byj7aro7p",
    },
    {
      initStyle: "height: 100%; border: 2px solid rgb(3, 61, 55);",
      options: {
        src: "http://192.168.21.92:3000/v-component/src/assets/1654853215692.png",
      },
      model: {},
      default: null,
      id: "drag-l209tsce62zm",
    },
  ],
  dynamicHTML: `
  <div
  style="
    position: absolute;
    z-index: -1;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  "
>
  <q-image
    data-data='{"src":"http://192.168.21.92:3000/v-component/src/assets/bg.png"}'
    id="q-image-ouky34zcvhun"
  ></q-image>
</div>
<div style="position: absolute; top: 0; width: 100%">
  <q-text
    data-data='{"text":"数据可视化显示系统"}'
    style="
      text-align: center;
      font-size: 30px;
      color: white;
      line-height: 66px;
    "
    id="q-text-ka5ue9mx5qd7"
  ></q-text>
</div>
<div
  style="
    position: absolute;
    overflow: hidden;
    border: 2px solid #033d37;
    top: 10%;
    left: 5%;
    color: #08aa99;
    z-index: 1;
  "
>
  <q-text
    data-data='{"text":"疫情曲线"}'
    id="q-text-dvoly35smyer"
  ></q-text>
</div>
<div
  style="
    height: 24%;
    width: 16%;
    position: absolute;
    overflow: hidden;
    border: 2px solid #033d37;
    top: 10%;
    left: 5%;
  "
>
  <q-image
    data-data='{"src":"http://192.168.21.92:3000/v-component/src/assets/1654829140850.jpg"}'
    id="q-image-y3md2bby3y37"
  ></q-image>
</div>
<div
  style="
    position: absolute;
    overflow: hidden;
    border: 2px solid #033d37;
    top: 40%;
    left: 5%;
    color: #08aa99;
    z-index: 1;
  "
>
  <q-text
    data-data='{"text":"图谱分析"}'
    id="q-text-3wgumvizrx6r"
  ></q-text>
</div>
<div
  style="
    height: 24%;
    width: 16%;
    position: absolute;
    overflow: hidden;
    border: 2px solid #033d37;
    top: 40%;
    left: 5%;
  "
>
  <q-image
    data-data='{"src":"http://192.168.21.92:3000/v-component/src/assets/1654829578132.jpg"}'
    id="q-image-yfs1wndkejkl"
  ></q-image>
</div>
<div
  style="
    position: absolute;
    overflow: hidden;
    border: 2px solid #033d37;
    top: 71%;
    left: 5%;
    color: #08aa99;
    z-index: 1;
  "
>
  <q-text
    data-data='{"text":"离散分析"}'
    id="q-text-he2cuh2mchr0"
  ></q-text>
</div>
<div
  style="
    height: 24%;
    width: 16%;
    position: absolute;
    overflow: hidden;
    border: 2px solid #033d37;
    top: 71%;
    left: 5%;
  "
>
  <q-image
    data-data='{"src":"http://192.168.21.92:3000/v-component/src/assets/1654829505010.jpg"}'
    id="q-image-pmku7p087gwi"
  ></q-image>
</div>
<div
  style="
    position: absolute;
    overflow: hidden;
    border: 2px solid #033d37;
    top: 10%;
    right: 4.5%;
    color: #08aa99;
    z-index: 1;
  "
>
  <q-marquee-text
    data-data='{"text":"告警数据已更新,请注意查收!!!"}'
    id="q-marquee-text-hsrhgh7gcb6k"
  ></q-marquee-text>
</div>
<div
  style="
    height: 84.8%;
    width: 22.8%;
    position: absolute;
    left: 22%;
    top: 10%;
  "
>
  <q-tabs
    id="q-tabs-oq8hj6jg0w61"
    data-data='{"tabs":[{"title":"正态分布","id":"test1"},{"title":"GIS动态","id":"test2"}]}'
  >
    <div slot="test1" style="height: 100%; border: 2px solid #033d37">
      <q-image
        data-data='{"src":"http://192.168.21.92:3000/v-component/src/assets/1655104783919.jpg"}'
        id="drag-hke0o1cj9liz"
      ></q-image>
    </div>
    <div slot="test2" style="height: 100%; border: 2px solid #033d37">
      <q-image
        data-data='{"src":"http://192.168.21.92:3000/v-component/src/assets/1654853215692.png"}'
        id="drag-8e24nd8l8ap9"
      ></q-image>
    </div>
  </q-tabs>
</div>
<div
  style="
    height: 30%;
    width: 50%;
    position: absolute;
    right: 4.5%;
    top: 10%;
  "
>
  <q-tabs
    id="q-tabs-vmid2ibz6k9r"
    data-data='{"tabs":[{"title":"桑基划分","id":"test1"},{"title":"GIS动态","id":"test2"}]}'
  >
    <div slot="test1" style="height: 100%; border: 2px solid #033d37">
      <q-image
        data-data='{"src":"http://192.168.21.92:3000/v-component/src/assets/1654840806851.jpg"}'
        id="q-image-kv0byj7aro7p"
      ></q-image>
    </div>
    <div slot="test2" style="height: 100%; border: 2px solid #033d37">
      <q-image
        slot="test2"
        data-data='{"src":"http://192.168.21.92:3000/v-component/src/assets/1654853215692.png"}'
        id="q-image-l209tsce62zm"
      ></q-image>
    </div>
  </q-tabs>
</div>
<div
  style="
    height: 54%;
    width: 50%;
    position: absolute;
    right: 4.5%;
    top: 41%;
    border: 2px solid #033d37;
  "
>
  <q-echarts-gl id="q-echarts-gl-jx345jn55ug2"></q-echarts-gl>
</div>
<q-router-config
data-component="true"
id="q-router-config-741zj09abdcs"
data-parent-id="inner-dropzone" 
data-data='{"router":{"q-text-ka5ue9mx5qd7":{"title":"text1-text2","src":"q-text-ka5ue9mx5qd7","trigger":["click"],"receive":[{"target":"q-text-dvoly35smyer","event":["changeInfo"],"script":"function (data) { return data.text; }"}]},"q-text-dvoly35smyer":{"title":"text1-text2","src":"q-text-dvoly35smyer","trigger":["click"],"receive":[{"target":"q-text-ka5ue9mx5qd7","event":["changeInfo"],"script":"function (data) {return data.text; }"}]}}}'
></q-router-config>
  `,
};
