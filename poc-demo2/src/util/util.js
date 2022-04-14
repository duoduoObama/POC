function getElementTree(target = document, { isEle = false } = {}) {
  if (!target || target.nodeName === "#text") return [];
  return [...target.querySelectorAll("[data-component]")].map((c) => {
    let { data, parentId } = c.dataset;
    const { x, y } = c.parentElement.dataset;
    const $el = c.componentInstance ? c.componentInstance.$el : null;
    data = JSON.parse(data);
    data.parentId = parentId;
    data.style = c.parentElement.style.cssText;
    data.parentClass = c.parentElement.classList.value;
    data.x = x;
    data.y = y;
    data.children = $el ? getElementTree($el, { isEle }) : [];
    if (isEle) {
      data.$el = $el;
      data.componentInstance = c.componentInstance;
      data.shadowRoot = c.shadowRoot;
      data.srcElement = c;
      data.parentElement = c.parentElement;
    }
    return data;
  });
}

export { getElementTree };
