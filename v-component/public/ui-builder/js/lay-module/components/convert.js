(function () {
    const convert = {
        "q-swiper-pic": (data) => {
            return jsonParsOptions(data);
        },
        "q-list-text": (data) => {
            return jsonParsOptions(data);
        },
        "q-menu2": (data) => {
            jsonParsOptions(data);
            return setOptionsId(data);
        },
        "q-tabs": (data) => {
            jsonParsOptions(data);
            return data;
        },
        "q-float-menu": (data) => {
            return setOptionsId(data);
        },
        "q-collapse-menu": (data) => {
            jsonParsOptions(data);
            return setOptionsId(data);
        },
    };

    // 转换options数据
    const jsonParsOptions = (data) => {
        if (typeof data.options !== `object`) {
            data.options = JSON.parse(data.options);
        } 
        return data;
    };

    // 转换options设置独立ID
    const setOptionsId = (data) => {
        function getNodesName(dataInfo) {
            for (let item of dataInfo) {
                if (!item.id) {
                    item.id = createHashId();
                } else if(document.querySelector(`#${item.id}`)){
                    item.id = createHashId();
                }
                if (item.children && item.children.length) {
                    getNodesName(item.children);
                }
            }
        }
        getNodesName(data.options); 
        return data;
    };

    window.componentsConvert = convert;
})();
