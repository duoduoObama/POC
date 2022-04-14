import "./style.css";
import "./src/components";
import { getTableData } from "./src/page/index";

(function () {
  setTimeout(() => {
    getTableData();
  }, 100);
})();
