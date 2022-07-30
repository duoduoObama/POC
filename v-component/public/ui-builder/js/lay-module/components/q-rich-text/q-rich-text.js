/**
 * 视频容器
 */
Vue.component("q-rich-text", {
  template: ` 
          <div class="draggable2" :id="data.id" :index="index" 
           style="background-color:#fff;" 
           :style="data.style"
           :data-data="JSON.stringify(data)" :data-x="data.x||0" :data-y="data.y||0"> 
           <link href="${location.origin}/ui-builder/js/lay-module/components/q-rich-text/q-rich-text.css" rel="stylesheet">     
            <q-modal class="modal-box" title="富文本编辑" width="80%" v-if="showMenuModal" :visible.sync="showMenuModal" @ok="updateTree" @cancel="recoverNode">
            <template slot="modalBody">
            <div class="q-rich-body">
                <div :id="data.id+'editor'" class="editor-container"> 
                </div>
            </div>  
            </template>
          </q-modal> 
            <div class="q-rich-text-content" >
            <div class="ql-editor" data-gramm="false" v-html="data.options" :contenteditable="showMenuModal" data-placeholder="请输入..."></div>
            </div>
          </div> 
        `,
  props: {
    data: Object,
    index: Number,
  },
  watch: {
    data: {
      handler(newValue, oldValue) {
        try {
          const { style } = newValue;
          this.style = style;
        } catch (error) {
          console.log(error);
        }
      },
      deep: true,
    },
    curMenu(val) {
      if (this.data.id !== this.$root.curComponent.id) {
        return;
      }
      this.handleMenuClick(val);
    },
    showMenuModal(val) {
      if (val) {
        this.createQuill();
      }
    },
  },
  data() {
    return {
      x: this.data.x || 0,
      y: this.data.y || 0,
      id: this.data.id,
      options: this.data.options || "",
      style: this.data.style,
      showMenuModal: false,
      tempNodes: null,
      quill: null,
    };
  },
  methods: {
    updateTree() {
      this.data.options = this.quill.root.innerHTML;
    },
    recoverNode() {
      this.tempNodes = JSON.parse(JSON.stringify(this.options));
    },
    createQuill() {
      setTimeout(() => {
        this.quill = new Quill(`#${this.data.id}editor`, {
          theme: "snow",
          modules: {
            toolbar: [
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              [{ header: 1 }, { header: 2 }],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ direction: "rtl" }],
              [{ size: ["small", false, "large", "huge"] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ["clean"],
              ["link"],
            ],
          },
          placeholder: "请输入...",
          readOnly: false,
        });
        this.quill.root.innerHTML = this.data.options;
      }, 500);
    },
    handleMenuClick(e) {
      switch (e.key) {
        case "1":
          this.showMenuModal = true;
          break;
      }
    },
    bindScrollEvents() {
      // 文字列表监听滚动条
      $("#inner-dropzone,#bottomcontent").on("mouseover mousemove", ".q-rich-text-content", (event) => {
        if ($(event.currentTarget).parent().hasClass("draggable-grid") || this.$root.editMode === `read`) return;
        const { left, top } = $(event.currentTarget).parent().offset();
        const { clientX, clientY } = event;
        const width = $(event.currentTarget).parent().width();
        const height = $(event.currentTarget).parent().height();
        if (clientX + 6 > left + width) {
          $(event.currentTarget).parent().removeClass("draggable-disable").addClass("draggable2");
          return;
        }
        if (clientX > left + width - 30) {
          $(event.currentTarget).parent().removeClass("draggable2").addClass("draggable-disable");
          return;
        }
        $(event.currentTarget).parent().removeClass("draggable-disable").addClass("draggable2");
      });

      $("#inner-dropzone,#bottomcontent").on("mouseleave", ".q-rich-text-content", (event) => {
        if ($(event.currentTarget).parent().hasClass("draggable-grid") || this.$root.editMode === `read`) return;
        $(event.currentTarget).parent().removeClass("draggable-disable").addClass("draggable2");
      });
    },
    receiveInfo() {
      const { id, name } = this.data;
      const ajv = new Ajv();
      const shchema = {
        type: "string",
      };
      const check = ajv.compile(shchema);
      obEvents.currentSelectedPoint(id).subscribe((data) => {
        const { body } = data;
        if (check(body)) {
          this.data.options = body;
          this.options = this.data.options;
          return;
        }
        antd.message.warn(`${name}:接收数据与当前组件不匹配!`);
      });
    },
  },
  mounted() {
    this.bindScrollEvents();
    this.receiveInfo();
  },
  updated() {
    try {
      this.options = this.data.options;
    } catch (error) {
      console.log(error);
    }
  },
  computed: {
    ...mapState(["curMenu"]),
  },
});
