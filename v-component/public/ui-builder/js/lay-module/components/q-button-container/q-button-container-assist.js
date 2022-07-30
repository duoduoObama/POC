function comButton() {
    var isEnd = true;
    var len = 0;
    $("[title=按钮容器]")
        .off()
        .on("click", async function (e) {
            var data = JSON.parse($(e.currentTarget).attr("data-data"));
            try {
                if (!data.paramList) return;
                var paramList = [];
                if (typeof data.paramList === `string`) {
                    paramList = JSON.parse(data.paramList);
                } else {
                    paramList = data.paramList;
                }
                if (paramList.length > 0 && isEnd) {
                    var bindObj = paramList.find(function (c) {
                        return c.key === "bindId";
                    });
                    if (!bindObj.default) return;
                    bindObj.default
                        .split(",")
                        .filter((id) => id)
                        .forEach((id) => {
                            console.log($(`#${id}`));
                            $(`#${id}`).click();
                        });
                }
            } catch (error) {
                console.log(error);
            }
        });
}
comButton();
