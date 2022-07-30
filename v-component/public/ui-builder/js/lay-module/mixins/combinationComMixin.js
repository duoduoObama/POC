(function () {
  const combinationCom = {
    watch: {
      seletComs: {
        handler(newValue, oldValue) {
          this.seletComsSeled = [];
          newValue.length &&
            newValue.map((it) => {
              this.seletComsSeled.push(it);
            });
          // 选中包含底部画布组件的时候不显示合并保存按钮
          this.isShowSelComs = this.noBottmComs();
        },
      },
    },
    data() {
      return { combinationComsTree: [], seletComs: [], seletComsSeled: [], isShowSelComs: false };
    },
    methods: {
      mergeChange(v, option) {
        this.seletComsSeled = v;
        this.seletComs.map((its) => {
          v.indexOf(its) === -1 && $(`#${its}`).removeClass("focus");
        });
        if (v.length <= 1) {
          comsCombination();
        }
      },
      async comsOption(e) {
        let newWrapDiv = $("#spotBox").children().clone();
        const { ldvArr, tdvArr, spotBoxh, spotBoxw, minlx, minty, unit } = JSON.parse(newWrapDiv.attr("data-data"));
        const id = createHashId();
        let attrObj = {
          id: id,
          name: "集合",
          type: "容器",
          width: spotBoxw,
          height: spotBoxh,
          x: minlx,
          y: minty,
          datatype: 1,
          options: [],
          description: "拖入设计区->右侧功能区->属性->options->填写text文本组件中需要显示的文字",
          paramList: [],
          componentName: "q-collection",
          targetId: id,
          targetRoot: "#inner-dropzone",
          style: `background-color: rgb(255, 255, 255); color: rgb(0, 0, 0); text-align: center; transform: translate(${minlx}px, ${minty}px); z-index: 41; width: ${spotBoxw}px; height: ${spotBoxh}px; position: absolute; cursor: move;`,
          alt: "容器",
          parent: "inner-dropzone",
          parentId: "inner-dropzone",
        };
        const element = createLocalElement(attrObj, minlx, minty);
        // $(newWrapDiv).addClass("can-drop wrapBox draggable2");
        // $(newWrapDiv).css("border", "none");
        // $(newWrapDiv).attr("data-data", JSON.stringify(attrObj));
        // $(newWrapDiv).attr("data-x", minlx);
        // $(newWrapDiv).attr("data-y", minty);
        // $(newWrapDiv).attr("id", id);
        // $(".focus").wrapInner(`<div></div>`);
        setTimeout(() => {
          // $(".focus").wrapInner($(`#${element}`));
          $(".focus").each((i, it) => {
            // 给这两个添加父ID
            let data = JSON.parse($(it).attr("data-data"));
            data.parentId = id;
            $(it).attr("data-data", JSON.stringify(data));
            $(it).remove();
            createLocalElement(data, minlx, minty);
            setTimeout(() => {
              const newDom = $(`#${data.id}`);
              newDom.addClass("focus");
              if (unit == "px") {
                newDom.css("transform", `translate(${ldvArr[i]}px,${tdvArr[i]}px)`);
              } else {
                newDom.css("left", `${ldvArr[i]}%`);
                newDom.css("top", `${tdvArr[i]}%`);
              }
            }, 500);
          });
        }, 500);
      },
      saveCombination() {},
      openCombinationComsModal() {
        this.$refs["combinationComs"].openModal();
      },
      deleteCombination(v) {
        this.$refs["combinationComs"].deleteComs(v);
      },
      noBottmComs() {
        if (!$(".focus").length) return false;
        return !$(".focus").filter((i, it) => {
          let data = JSON.parse($(it).attr("data-data"));
          return data.targetRoot === "#bottomcontent";
        }).length;
      },
    },
  };
  window.combinationComMixin = combinationCom;
})();
