/**
 * 数据转换
 * @param source 元数据
 */

class DataSet {
  rows = [];
  errs = null;
  /*
   *  name 方法名称
   *  parent 父节点
   *  belongto 属于哪个tab
   *  options 配置 {
   *    funName 函数名称
   *    operation lodash 函数标识
   * }
   *    des 描述
   */
  static transfMapping = {
    tirm: {
      name: "trim",
      parent: "字符串",
      belongto: "pipe",
      options: {
        funName: "simpleHandel",
        operation: "_.trim",
      },
      des: "用于删除字符串的头尾空白符，空白符包括：空格、制表符 tab、换行符等其他空白符等。",
    },
    trimEnd: {
      name: "trimEnd",
      parent: "字符串",
      belongto: "pipe",
      options: {
        funName: "simpleHandel",
        operation: "_.trimEnd",
      },
      des: "用于删除字符串的尾空白符，空白符包括：空格、制表符 tab、换行符等其他空白符等。",
    },
    trimStart: {
      name: "trimStart",
      parent: "字符串",
      belongto: "pipe",
      options: {
        funName: "simpleHandel",
        operation: "_.trimStart",
      },
      des: "用于删除字符串的头空白符，空白符包括：空格、制表符 tab、换行符等其他空白符等。",
    },
    toLower: {
      name: "toLower",
      parent: "字符串",
      belongto: "pipe",
      options: {
        funName: "simpleHandel",
        operation: "_.toLower",
      },
      des: "用于把字符串转换为小写。",
    },
    toUpper: {
      name: "toUpper",
      parent: "字符串",
      belongto: "pipe",
      options: {
        funName: "simpleHandel",
        operation: "_.toUpper",
      },
      des: "用于把字符串转换为大写。",
    },
    push: {
      name: "push",
      parent: "数组",
      belongto: "pipe",
      options: {
        funName: "middleArray",
        handleObj: "",
        isEdit: true,
        setting: [{ label: "请输入对象", valueKey: "handleObj", disabled: true }],
        errorMsg: ["参数需为对象类型！"],
      },
      des: "将一个或多个元素添加到数组的末尾，并返回该数组的新长度。",
    },
    pop: {
      name: "pop",
      parent: "数组",
      belongto: "pipe",
      options: {
        funName: "simpleHandel",
        operation: "pop",
      },
      des: "从数组中删除最后一个元素，并返回该元素的值。此方法更改数组的长度",
    },
    shift: {
      name: "shift",
      parent: "数组",
      belongto: "pipe",
      options: {
        funName: "simpleHandel",
        operation: "shift",
      },
      des: "从数组中删除第一个元素，并返回该元素的值。此方法更改数组的长度。",
    },
    unshift: {
      name: "unshift",
      parent: "数组",
      belongto: "pipe",
      options: {
        funName: "middleArray",
        handleObj: "",
        isEdit: true,
        setting: [{ label: "请输入对象", valueKey: "handleObj", disabled: true }],
        errorMsg: ["参数需为对象类型！"],
      },
      des: "将一个或多个元素添加到数组的开头，并返回该数组的新长度(该方法修改原有数组)。",
    },
    uniq: {
      name: "uniq",
      parent: "数组",
      belongto: "pipe",
      options: {
        funName: "simpleHandel",
        operation: "_.uniq",
      },
      des: "数组去重，返回一个新的数组",
    },
    filter: {
      name: "数据过滤",
      parent: "静态方法",
      belongto: "fun",
      options: {
        funName: "filter",
        callback: ``,
        setting: [{ label: "过滤条件", valueKey: "callback" }],
      },
      des: `数据过滤 <br/> 输入：[
                { year: 1990, sales: 200 },
                { year: 1992, sales: 100 },
                { year: 1994, sales: 120 },
                { year: 1995, sales: 85 },
            ] <br/>参数：year < 100;} <br/>输出：{ year: 1995, sales: 85 })`,
    },
    map: {
      name: "数据加工",
      parent: "静态方法",
      belongto: "fun",
      options: {
        funName: "map",
        callback: ``,
        setting: [{ label: "加工条件", valueKey: "callback" }],
      },
      des: `数据加工 <br/> 输入：[
                { year: 1995, sales: 200 },
                { year: 1992, sales: 100 },
            ]  <br/>参数：z = 'z' // 为每条记录新添加一个 z 字段 <br/>输出：
                { year: 1995, sales: 200, z: "z" },
                { year: 1992, sales: 100, z: "z" }
            )`,
    },
    sort: {
      name: "数据排序",
      parent: "静态方法",
      belongto: "fun",
      options: {
        funName: "sort",
        callback: ``,
        sortType: 0,
        sortField: ``,
        setting: [
          { label: "排序字段", valueKey: "sortField" },
          {
            label: "排序规则",
            valueKey: "sortType",
            options: [
              { label: "升序", value: 0 },
              { label: "降序", value: 1 },
            ],
            type: "select",
          },
        ],
      },
      des: `数据排序 <br/> 输入：[
                { year: 1990, sales: 200 },
                { year: 1992, sales: 100 },
            ]  <br/>参数：year,降序 <br/>输出：{ year: 1995, sales: 200 }, { year: 1992, sales: 100 }`,
    },
    extract: {
      name: "数据提取",
      parent: "静态方法",
      belongto: "fun",
      options: {
        funName: "extract",
        key: "",
        index: "",
        setting: [
          { label: "提取字段", valueKey: "key" },
          { label: "数据索引", valueKey: "index" },
        ],
      },
      des: `数据提取 <br/> 输入：[
                { year: 1990, sales: 200 },
                { year: 1992, sales: 100 },
            ]  <br/>参数：year,0 <br/>参数说明：key 提取字段、index提取索引  <br/>输出：1990`,
    },
    max: {
      name: "max",
      parent: "数学",
      belongto: "pipe",
      options: {
        funName: "simpleHandel",
        operation: "_.max",
      },
      des: "参数为数组，返回最大值",
    },
    min: {
      name: "min",
      parent: "数学",
      belongto: "pipe",
      options: {
        funName: "simpleHandel",
        operation: "_.min",
      },
      des: "参数为数组，返回最大值",
    },
    ceil: {
      name: "ceil",
      parent: "数学",
      belongto: "pipe",
      options: {
        funName: "simpleHandel",
        operation: "_.ceil",
      },
      des: "参数为数组，返回最大值",
    },
  };

  delUtil(option) {
    if (!option) return;
    try {
      if (option.callback) {
        option.callback = new Function(`return ${option.callback}`)();
        this.rows = this.rows[option.funName](option.callback);
      }
    } catch (error) {
      this.errs = error.message;
    }
  }

  constructor(source) {
    this.rows = JSON.parse(JSON.stringify(source));
  }

  runeval(jscode) {
    try {
      eval(jscode);
      return this;
    } catch (error) {
      this.errs = error.message;
    }
  }

  /* 数据过滤 */
  filter(option) {
    new Promise((reslove, reject) => {
      // 解决只输入 = 为赋值操作
      if (option.callback.includes("=")) {
        const regArr = [/==/, /===/, />=/, /<=/, /!=/, /!==/];
        const result = regArr.map((it) => {
          return it.test(option.callback);
        });
        !result.includes(true) ? reject("请输入正确的表达式！") : reslove();
      } else {
        reslove();
      }
    })
      .then(() => {
        option.callback = `(row) => {return row.${option.callback}}`;
        this.delUtil(option);
      })
      .catch((err) => {
        this.errs = err;
      });

    return this;
  }

  /* 数据加工 */
  map(option) {
    option.callback = `(row) => {row.${option.callback}; return row;}`;
    this.delUtil(option);
    return this;
  }

  /* 数据排序 */
  sort(option) {
    const rule =
      option.sortType === 0
        ? `a.${option.sortField} - b.${option.sortField}`
        : `b.${option.sortField} - a.${option.sortField}`;
    option.callback = `(a, b) => {return ${rule};}`;
    this.delUtil(option);
    return this;
  }

  /* 数据提取 */
  extract(option) {
    if (!option.key || !option.index) throw new Error("缺少数据索引或提取字段参数！");
    if (typeof option.key !== "string" || typeof Number(option.index) !== "number")
      throw new Error("参数类型不匹配，数据索引应为数字类型、提取字段应为字符串类型");
    // const data = this.rows.length ? this.rows : this.origin;
    this.rows.map((it, i) => {
      if (i === Number(option.index)) this.rows = it[option.key] || "";
    });
    return this;
  }

  simpleHandel(arg) {
    arg = JSON.parse(arg);
    let option = this.rows;
    const operation = arg.options.operation;
    switch (arg.parent) {
      case "数组":
        if (!Array.isArray(option)) throw new Error(`当前数据类型${typeof option}不属于数组类型！`);
        break;
      case "字符串":
        if (typeof option !== "string") throw new Error(`当前数据类型${typeof option}不属于字符串类型！`);
        break;
      case "对象":
        break;
      case "数学":
        if (!Array.isArray(option)) throw new Error(`当前数据类型${typeof option}不属于数组类型！`);
        break;
    }
    if (operation.includes("_")) {
      const funName = operation.split(".")[1];
      this.rows = _[funName](option);
    } else {
      option[operation]();
      this.rows = option;
    }
    return this;
  }

  middleHandel(otpion, arg) {
    arg = JSON.parse(arg);
    let handleObj = arg.options[arg.options.setting[0]["valueKey"]];
    switch (option.key) {
      case "push":
      case "unshift":
        if (Object.prototype.toString.call(handleObj) !== "[object Object]")
          throw new Error(`当前参数类型不属于对象类型！`);
        otpion[arg.key](handleObj);
        this.rows = otpion;
        break;
    }
    return this;
  }

  /*  push unshift */
  middleArray(otpion, arg) {
    arg = JSON.parse(arg);
    let handleObj = arg.options[arg.options.setting[0]["valueKey"]];
    if (Object.prototype.toString.call(handleObj) !== "[object Object]")
      throw new Error(`当前参数类型不属于对象类型！`);
    otpion[arg.key](handleObj);
    this.rows = otpion;
    return this;
  }
}

/* 处理transform数据 */
const delTransf = (transfromData) => {
  let temp = typeof transfromData === "string" ? JSON.parse(transfromData) : transfromData;
  for (const key in temp) {
    if (Object.hasOwnProperty.call(temp, key)) {
      if (temp[key] === "[]") {
        temp[key] = [];
      } else if (temp[key] === "{}") {
        temp[key] = {};
      }
    }
  }
  return temp;
};
