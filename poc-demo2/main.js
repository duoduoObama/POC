// import "./style.css";
import antd from "ant-design-vue/dist/antd";
import "ant-design-vue/dist/antd.css";
import { CheckOutlined, EditOutlined } from "@ant-design/icons-vue";
import { cloneDeep } from "lodash-es";
import { createApp, computed, defineComponent, reactive, ref } from "vue";

const component = defineComponent({
  components: {
    CheckOutlined,
    EditOutlined,
  },
  setup() {
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
        title: "operation",
        dataIndex: "operation",
      },
    ];
    const dataSource = ref([
      {
        key: "0",
        name: "Edward King 012312312",
        age: 32,
        address: "London, Park Lane no. 0",
      },
      {
        key: "1",
        name: "Edward King 1",
        age: 32,
        address: "London, Park Lane no. 1",
      },
    ]);
    const count = computed(() => dataSource.value.length + 1);
    const editableData = reactive({});

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

    const handleAdd = () => {
      const newData = {
        key: `${count.value}`,
        name: `Edward King ${count.value}`,
        age: 32,
        address: `London, Park Lane no. ${count.value}`,
      };
      dataSource.value.push(newData);
    };
    const current = ref(2);
    const value = ref("");

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

const app = createApp(component);
app.use(antd);
app.mount("#app");
