/**
 * 生成hashid
 * @param {*} hashLength
 */
export function createHash(hashLength = 12) {
    // 默认长度 24
    return Array.from(Array(Number(hashLength) || 24), () => Math.floor(Math.random() * 36).toString(36)).join("");
}

/**
 * 生成onlyid
 * @param {*} hashLength
 * @param {*} key
 */
export function createHashId(hashLength = 12, key = `drag-`) {
    let probeId = `${key}${createHash(hashLength)}`;
    while (document.querySelectorAll(`#${probeId}`).length) {
        // dom存在即重新构成
        probeId = `${key}${createHash(hashLength)}`;
    }
    return probeId;
}


/**
 * 获取元素树
 * @param target 
 * @param param1 
 * @returns 
 */
export function getElementTree(target = document, { isEle = false } = {}) {
    if (!target || target.nodeName === "#text") return [];
    return [...target.querySelectorAll("[data-component]")].map((c: any) => {
        let { data, parentId } = c.dataset;
        const { x, y } = c.parentElement.dataset;
        const $el = c.componentInstance ? c.componentInstance.$el : null;
        data = JSON.parse(data);
        data.id = c.id;
        data.proxyInfo = c.data;
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

/**
 * 获取目标元素树
 * @param target 
 * @returns 
 */
export function getTargetElement(target = "") {
    if (!target) return null;

    const allElement = getElementTree(document, { isEle: true });

    const findTarget = (arr = [], targetId: string) => {
        let len = 0;
        let isBreak = true;
        let targetNode = null;
        while (arr[len] && isBreak) {
            const { id, children = [] } = arr[len];
            if (targetId === id) {
                targetNode = arr[len];
                isBreak = false;
                return targetNode;
            } else if (children && children.length) {
                const target = findTarget(children, targetId) as object;
                if (target) {
                    return target;
                }
            }
            len++;
        }
        return targetNode;
    };

    return findTarget(allElement as never[], target);
}