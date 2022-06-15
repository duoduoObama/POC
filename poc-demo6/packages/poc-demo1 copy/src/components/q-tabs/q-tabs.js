import { createApp, nextTick, defineComponent } from "vue";
import { cloneDeep } from "lodash-es";
import { obEvents } from "../../../../poc-demo1/src/util/rx";

export class QTabs extends HTMLElement {
  /**
   * 定义组件暴露参数为用户进行修改
   */
  static get observedAttributes() {
    return ["data-data"];
  }

  /**
   * 设置组件实例 属性为只读
   */
  set #componentInstance(instance) {
    this._instance = instance;
  }

  get componentInstance() {
    return this._instance;
  }

  /**
   * 隔离样式
   */
  styleText = `
    .focus {
      outline: var(--force-border);
      box-shadow: var(--force-box-shadow);
      box-sizing: border-box;
      overflow: hidden;
    }
    
    .focusBind {
      outline: 5px solid red;
      box-sizing: border-box;
      overflow: hidden;
    }
    .container {
      height: 100%;
      width: 100%;
    } 
    #container {
      height: 100%;
      width: 100%;
    } 
    #tabs {
      // overflow: hidden;
      width: 100%;
      margin: 0;
      padding: 0;
      list-style: none;
      height: 30px;
      display: flex;
    }
    #tabs li {
      cursor: pointer;
    }
    #tabs .add {
      font-size: 20px; 
      font-weight: 800;
      padding: 0 10px;
    }
    #tabs a {
      float: left;
      position: relative; 
      height: 0;
      line-height: 30px;
      text-transform: uppercase;
      text-decoration: none;
      color: #fff;
      /* border-right: 30px solid transparent; */
      /* border-bottom: 30px solid #3D3D3D; */
      border-bottom-color: #777;
      opacity: .3;
      filter: alpha(opacity=30);
      display: block;
      height: 30px;
      padding:0 20px;
      text-align: center;
      background-color: #3d3d3d;
    }
    #tabs a:hover,  #tabs a:focus {
      background-color: #2ac7e1;
      opacity: 1;
      filter: alpha(opacity=100);
    }
    #tabs a:focus {
      outline: 0;
    }
    #tabs #current { 
      border-bottom-color: #3d3d3d;
      opacity: 1;
      filter: alpha(opacity=100);
    } 
    #titleIcon {
      display: none;
      position: absolute;
      top: 0;
      right: 4px;
    }
    #titleIcon .iconMenu {
      width: 130px;
      display: none;
      position: absolute;
      top: 20px;
      left: -40px;
      background-color: #fff;
      box-shadow: 0 0 2px 2px #CACACA;
      z-index: 100;
    }

    #titleIcon .iconMenu > div:hover {
      background-color: #E9E9E9;
    }
    
    #content {
      border-top: 2px solid #3d3d3d; 
      height: calc(100% - 30px);
      border: 1px solid #e5e5e5;
    }
    
    }
    #content h2,  #content h3,  #content p {
      margin: 0 0 15px 0;
    }
    /* Demo page only */
    
    #about {
      color: #999;
      text-align: center;
      font: 0.9em Arial, Helvetica;
    }
    #about a {
      color: #777;
    }
    .content-panel{
      height: 100%;
      width: 100%;
      position: relative;
    }
    `;

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    // 组件内部隔离样式
    const style = document.createElement("style");
    const div = document.createElement("div");
    style.textContent = this.styleText;
    this.shadow.appendChild(style);
    this.shadow.appendChild(div);
  }

  /**
   * 元素首次被插入文档调用(创建)
   */
  connectedCallback() {
    console.log("Custom square element added to page.");
    this.componentInit();
  }

  /**
   * 元素从文档中被移除调用(组件销毁)
   */
  disconnectedCallback() {
    console.log("Custom square element removed from page.");
  }

  /**
   * 自定义元素被移动到新的文档中时调用
   */
  adoptedCallback() {
    console.log("Custom square element moved to new page.");
  }

  /**
   * 元素属性发生变化时调用
   * @param {*} name 属性
   * @param {*} oldValue 老数据
   * @param {*} newValue 新数据
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // console.log("Custom square element attributes changed.");
    this.loadInfo(this);
  }

  /**
   * vue组件实例定义(可在component实现vue的方法)
   * @param {*} data 传入组件data-data数据
   * @param {*} root 挂载到当前webcomponent节点
   */
  createComponentInstance(root) {
    const selfComponent = this;
    const component = {
      template: `  
        <div class="container">
            <ul id="tabs">
                <li v-for="(item,index) in options" :key="item.id">
                    <a href="#" @click.stop.prevent="clickTitle(index,$event,item)" @dblclick.stop.prevent="sendMessage($event,item,index)">
                      {{item.title}}
                    </a>
                </li>
            </ul>
            <div id="content"> 
              <div class="content-panel dropzone" 
                v-for="item in options"
                :key="item.id"
                :id="item.id">
              </div>
            </div>
        </div>
        `,
      created() {
        this.data = selfComponent.data;
      },
      data() {
        return {
          data: {},
          options: [],
        };
      },
      watch: {
        data: {
          handler(newValue) {
            this.options = cloneDeep(newValue.options);
          },
          deep: true,
        },
      },
      methods: {
        receiveInfo() {
          const { id, text } = selfComponent.data;
          obEvents.currentSelectedPoint(id).subscribe((data) => {
            const { body } = cloneDeep(data);
            if (
              data.replyStatus &&
              Array.isArray(data.reply) &&
              data.reply.length
            ) {
              const temp = cloneDeep(data);
              temp.eventData = { type: "reply" };
              temp.sender = data.receiver;
              temp.receiver = "eventBus";
              obEvents.setSelectedPoint(temp, JSON.parse(JSON.stringify(body)));
            }
            this.bindEvent(data);
            // const { body } = cloneDeep(data);
            // if (check(body)) {
            //   this.data.options = body;
            // selfComponent.dataset.data = JSON.stringify(this.data);
            //   return;
            // }
            // antd.message.warn(`${text}:接收数据与当前组件不匹配!`);
          });
        },
        menuStart(shadowDom) {
          const contentDIV = shadowDom.querySelector("#content").children;
          [...contentDIV].forEach((el) => {
            el.style.display = "none";
          });
          shadowDom.querySelector("#tabs li>a").id = "current";
          shadowDom.querySelector("#content > div").style.display = "block";
        },
        clickTitle(index, e, node) {
          if (!this.options[index]) return;
          const clickTab =
            root.querySelector("#tabs").children[index].children[0];
          function resetTabs() {
            root.querySelectorAll("#tabs a").forEach((el) => {
              el.id = "";
            });
            root.querySelectorAll(".content-panel").forEach((el) => {
              el.style.display = "none";
            });
          }
          resetTabs();
          root.querySelector(`#${this.options[index].id}`).style.display =
            "block";
          clickTab.id = "current";
          if (e && node) this.sendMessage(e, node, index);
        },
        addOptions() {
          this.options.push({
            title: "Tabs " + (this.options.length + 1),
            id: createHashId(),
          });
          selfComponent.data.options = this.options;
          selfComponent.dataset.data = JSON.stringify(selfComponent.data);
          return this.options;
        },
        copyTabs(index) {
          if (!this.options[index]) return;
          this.options.splice(index + 1, 0, {
            title: this.options[index].title + " 副本",
            id: createHashId(),
          });
          selfComponent.data.options = this.options;
          selfComponent.dataset.data = JSON.stringify(selfComponent.data);
          nextTick(() => {
            const contentDIV = root.querySelector("#content").children;
            let elData = getElementTree(contentDIV[index]);
            const treeData = (tree = [], parentId) => {
              const arr = [...tree];
              arr.forEach((element) => {
                element.parentId = parentId;
                element.id = createHashId();
                treeData(element.children, element.id);
              });
              return arr;
            };
            elData = treeData(elData, contentDIV[index + 1].id);
            this.reloadPageComponentRoot(
              elData,
              `#${contentDIV[index + 1].id}`
            );
          });
          return this.options;
        },
        deleteTabs(index) {
          if (!this.options[index]) return;
          const delTabsId = this.options[index].id;
          this.options.splice(index, 1);
          root.querySelector(`#${delTabsId}`).remove();
          selfComponent.data.options = this.options;
          selfComponent.dataset.data = JSON.stringify(selfComponent.data);
          getNewTreeData();
          return this.options;
        },
        addTabs(index) {
          if (!this.options[index]) return;
          this.options.splice(index + 1, 0, {
            title: "Tabs " + (this.options.length + 1),
            id: createHashId(),
          });
          selfComponent.data.options = this.options;
          selfComponent.dataset.data = JSON.stringify(selfComponent.data);
          return this.options;
        },
        /*
         * 数据驱动生成DOM
         * @param [*] componentInfo 组件数据
         * @param {*} root 根节点
         */
        reloadPageComponentRoot(componentInfo = []) {
          function createChild(nodes, element = {}) {
            if (!Array.isArray(nodes)) return;
            nodes.forEach(async (item, index) => {
              let { parentId } = item;
              const container = createDragElement(item, vm.percentOrabsolute);
              const component = createComponent(item);
              container.dataset.parentId = parentId;
              component.dataset.parentId = parentId;
              container.append(component);
              const targetNode = document.querySelector(`#${parentId}`);
              if (targetNode) {
                targetNode.append(container);
              } else {
                const refParent =
                  element && element.id === parentId
                    ? element
                    : element.querySelector(`#${parentId}`);
                // console.log(refParent);
                if (refParent) {
                  refParent.append(container);
                }
              }

              if (item.children.length) {
                // console.log(component);
                // 防止父级还未生成组件实例拿不到
                while (!component.componentInstance) {
                  // console.log("11111111111");
                  await awaitTime(500);
                }
                // console.log(parentId, component.componentInstance.$el); // ?????????????????????????
                createChild(item.children, component.componentInstance.$el);
                // createChild(item.children);
              }
            });
          }
          createChild(componentInfo, root);
          getNewTreeData(); // 更新treeData
        },
        bindEvent(data) {
          const ajv = new Ajv();
          let shchema = {};
          let check = null;
          const { header = {} } = data;
          const { dst = [] } = header;
          dst.forEach((item, index) => {
            switch (item) {
              case "changeOptions":
                shchema = {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string", minLength: 1 },
                      id: { type: "string", minLength: 17, maxLength: 17 },
                    },
                    required: ["title", "id"],
                  },
                };
                check = ajv.compile(shchema);
                if (check(data.body[index])) {
                  this.options = data.body[index];
                  selfComponent.data.options = this.options;
                  selfComponent.dataset.data = JSON.stringify(
                    selfComponent.data
                  );
                } else {
                  antd.message.error(
                    "(更改组件数据):接收数据与当前接收点不匹配!"
                  );
                }
                break;
              case "clickTitle":
                shchema = {
                  type: "number",
                };
                check = ajv.compile(shchema);
                if (check(data.body[index])) {
                  this.clickTitle(Number(data.body[index]) - 1);
                } else {
                  antd.message.error(
                    "(切换tab标签):接收数据与当前接收点不匹配!"
                  );
                }
                break;
              case "addOptions":
                this.addOptions();
                break;
              case "copyTabs":
                shchema = {
                  type: "number",
                };
                check = ajv.compile(shchema);
                if (check(data.body[index])) {
                  this.copyTabs(Number(data.body[index]) - 1);
                } else {
                  antd.message.error(
                    "(复制tab标签):接收数据与当前接收点不匹配!"
                  );
                }
                break;
              case "deleteTabs":
                shchema = {
                  type: "number",
                };
                check = ajv.compile(shchema);
                if (check(data.body[index])) {
                  this.deleteTabs(Number(data.body[index]) - 1);
                } else {
                  antd.message.error(
                    "(删除tab标签):接收数据与当前接收点不匹配!"
                  );
                }
                break;
              case "addTabs":
                shchema = {
                  type: "number",
                };
                check = ajv.compile(shchema);
                if (check(data.body[index])) {
                  this.addTabs(Number(data.body[index]) - 1);
                } else {
                  antd.message.error(
                    "(在某个tab标签后增加标签):接收数据与当前接收点不匹配!"
                  );
                }
                break;
              default:
                break;
            }
          });
        },
        sendMessage(e, node, index) {
          const { type } = e;
          const message = {
            sender: this.data.id,
            node: { ...node, index },
            receiver: "eventBus",
            type,
            eventData: e,
          };
          obEvents.setSelectedPoint(
            message,
            JSON.parse(JSON.stringify(this.data))
          );
        },
      },
      mounted() {
        console.log(123);
        this.receiveInfo();
        nextTick(() => {
          const style = document.createElement("style");
          style.textContent = selfComponent.styleText;
          console.log(root, this.data, this.$el, this.options);
          root.appendChild(style);
          this.menuStart(root);
        });
      },
    };
    console.log(root.children[1]);
    const app = createApp(defineComponent(component));
    console.log(app);
    app.mount(root.children[1]);
    this.#componentInstance = app;
  }

  /**
   * 加载组件数据
   * @param {*} elem 组件对象
   */
  loadInfo(elem) {
    this.shadow = elem.shadowRoot;
    this.data = JSON.parse(elem.dataset.data);

    if (this.componentInstance) {
      this.componentInstance.data = this.data;
    }
  }

  /**
   * 组件初始化
   */
  componentInit() {
    this.createComponentInstance(this.shadow);
  }
}

/**
 * 注册组件
 */
// customElements.define("q-tabs", QTabs);
