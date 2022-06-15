import "./style.scss";
import antd from "ant-design-vue/dist/antd";
import "ant-design-vue/dist/antd.css";
import { CheckOutlined, EditOutlined } from "@ant-design/icons-vue";
import { cloneDeep } from "lodash-es";
import {
  createApp,
  computed,
  defineComponent,
  reactive,
  ref,
  onMounted,
  defineProps,
  watch,
  toRefs,
  defineCustomElement,
} from "vue";
import { QRouter2 } from "./src/components/q-router/q-router2";
import { QRouterConfig } from "./src/components/q-router-config/q-router-config";
import { obEvents } from "./src/util/rx";
import { eventBusSubscribe } from "./src/util/eventbus";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons-vue";
import "./public-path.js";

const component = defineComponent({
  template: `
  <div>
    <a-button 
      class="editable-add-btn"
      style="margin-bottom: 8px"
      @click="handleAdd()"
      >Add</a-button
    >
    <a-table 
      bordered
      :data-source="dataSource"
      :columns="columns"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'name'">
          <div class="editable-cell">
            <div
              v-if="editableData[record.key]"
              class="editable-cell-input-wrapper"
            >
              <a-input
                v-model:value="editableData[record.key].name"
                @pressEnter="save(record.key)"
              ></a-input>
              <check-outlined
                class="editable-cell-icon-check"
                @click="save(record.key)"
              ></check-outlined>
            </div>
            <div v-else class="editable-cell-text-wrapper">
              {{ text || ' ' }}
              <edit-outlined
                class="editable-cell-icon"
                @click="edit(record.key)"
              ></edit-outlined>
            </div>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <a-popconfirm
            v-if="dataSource.length"
            title="Sure to delete?"
            @confirm="onDelete(record.key)"
          >
            <a>Delete</a>
          </a-popconfirm>
        </template>
      </template> 
    </a-table>
    </div>
  `,
  components: {
    CheckOutlined,
    EditOutlined,
  },
  props: ["user"],
  setup(props, context) {
    console.log(props);
    watch(
      () => props.user,
      (newVal) => {
        console.log(newVal);
      },
      { deep: true, immediate: true }
    );

    const columns = [
      {
        title: "name",
        dataIndex: "name",
        width: "30%",
      },
      {
        title: "age",
        dataIndex: "age",
      },
      {
        title: "address",
        dataIndex: "address",
      },
      {
        title: "email",
        dataIndex: "email",
      },
      {
        title: "operation",
        dataIndex: "operation",
      },
    ];
    const dataSource = ref([
      {
        key: "0",
        name: "Edward King 0",
        age: 32,
        email: "112@qq.com",
        address: "London, Park Lane no. 0",
      },
      {
        key: "1",
        name: "Edward King 1",
        age: 32,
        email: "119@qq.com",
        address: "London, Park Lane no. 1",
      },
    ]);
    const count = computed(() => dataSource.value.length + 1);
    const editableData = reactive({});

    /**
     * 接收数据
     */
    const receiveInfo = () => {
      const { id, text } = { id: "table", text: "table" };
      obEvents.currentSelectedPoint(id).subscribe((data) => {
        const { body } = cloneDeep(data);
        console.log(body);
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
        handleAdd(body);
      });
    };

    const edit = (key) => {
      editableData[key] = cloneDeep(
        dataSource.value.filter((item) => key === item.key)[0]
      );
    };

    const save = (key) => {
      Object.assign(
        dataSource.value.filter((item) => key === item.key)[0],
        editableData[key]
      );
      delete editableData[key];
    };

    const onDelete = (key) => {
      dataSource.value = dataSource.value.filter((item) => item.key !== key);
    };

    const handleAdd = (newVal) => {
      const newData = {
        key: `${count.value}`,
        name: `Edward King ${count.value}`,
        age: 32,
        address: `London, Park Lane no. ${count.value}`,
      };
      if (newVal && Object.keys(newVal).length) {
        Object.assign(newVal, { key: `${count.value}` });
      }
      dataSource.value.push(newVal || newData);
    };
    const current = ref(2);
    const value = ref("");

    onMounted(() => {
      receiveInfo();
    });

    return {
      current,
      value,
      columns,
      onDelete,
      handleAdd,
      dataSource,
      editableData,
      count,
      edit,
      save,
    };
  },
});

const QTable = {
  install(app) {
    app.component("q-table", component);
    customElements.define("q-table", defineCustomElement(component));
  },
};

const comonpent2 = defineComponent({
  components: {
    CheckOutlined,
    EditOutlined,
    LeftCircleOutlined,
    RightCircleOutlined,
  },
  setup() {
    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const validateMessages = {
      required: "${label} is required!",
      types: {
        email: "${label} is not a valid email!",
        number: "${label} is not a valid number!",
      },
      number: {
        range: "${label} must be between ${min} and ${max}",
      },
    };

    const current = ref(0);
    const addUser = reactive({});
    const formState = reactive({
      user: {
        name: "",
        age: undefined,
        email: "",
        website: "",
        address: "",
      },
    });

    /**
     * 接收数据
     */
    const receiveInfo = () => {
      const { id, text } = { id: "form", text: "form" };
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

        console.log(data);
      });
    };

    /**
     * 发送消息
     */
    const sendMessage = (e) => {
      const { type } = e;
      const message = {
        sender: "form",
        receiver: "eventBus",
        eventData: e,
      };
      obEvents.setSelectedPoint(message, { ...addUser });
    };

    const onFinish = (values) => {
      const { user } = values;

      Object.assign(addUser, user);
      sendMessage({ type: "info" });
      current.value = 1;
      location.hash = "#/edit";
      formState.user = {};
      console.log(formState.user);
    };

    const changeStepsHash = (values) => {
      switch (values) {
        case 0:
          location.hash = "#/add";
          break;
        case 1:
          location.hash = "#/edit";
          break;
      }
    };

    const changeStepsCurrent = (path) => {
      switch (path) {
        case "#/add":
          current.value = 0;
          break;
        case "#/edit":
          current.value = 1;
          break;
      }
    };

    onMounted(() => {
      changeStepsCurrent(location.hash);
      receiveInfo();
      eventBusSubscribe([{ id: "from" }, { id: "table" }]);
    });

    const randomNumber = ref(10);

    setInterval(() => {
      // randomNumber.value = Math.ceil(Math.random() * 10);
    }, 1000);

    return {
      addUser,
      current,
      formState,
      onFinish,
      layout,
      validateMessages,
      changeStepsHash,
      randomNumber,
    };
  },
});

function render(props = {}) {
  const { container } = props;
  const app = createApp(comonpent2);
  app.use(antd);
  app.use(QTable);

  app.mount("#poc-demo2");
  console.log(app);
}

// import {
//   renderWithQiankun,
//   qiankunWindow,
// } from "vite-plugin-qiankun/dist/helper";

// renderWithQiankun({
//   mount(props) {
//     console.log("viteapp mount");
//     render(props);
//   },
//   bootstrap() {
//     console.log("bootstrap");
//   },
//   unmount(props) {
//     console.log("viteapp unmount");
//     const { container } = props;
//     const mountRoot = container?.querySelector("#root");
//     ReactDOM.unmountComponentAtNode(
//       mountRoot || document.querySelector("#root")
//     );
//   },
//   update(props) {
//     console.log("viteapp update");
//     console.log(props);
//   },
// });

// if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
//   render({});
// }
render({});