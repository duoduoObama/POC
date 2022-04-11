(function () {
  checkCurrent();
})();

function checkCurrent() {
  let stepCurrent = 0;
  const stepElement = $("#drag-qammlu475hay")[0];
  if (stepElement) {
    const data = JSON.parse(stepElement.dataset.data);
    stepCurrent = data.options.current;
  }

  const setButton = (id, status) => {
    const buttonElement = $(`#${id}`)[0];
    if (buttonElement) {
      const data = JSON.parse(buttonElement.dataset.data);
      data.options.disabled = status;
      buttonElement.dataset.data = JSON.stringify(data);
    }
  };

  if (stepCurrent == 0) {
    setButton("drag-c32qheh3evp6", true);
  } else if (stepCurrent == 2) {
    setButton("drag-vwzbynxadx9w", true);
  } else {
    setButton("drag-c32qheh3evp6", false);
    setButton("drag-vwzbynxadx9w", false);
  }
}

function pageScript(eventName, eventInfo) {
  console.log(eventName, eventInfo);
  switch (eventInfo.id) {
    case "drag-vwzbynxadx9w":
      const stepElement1 = $("#drag-qammlu475hay")[0];
      const stepData1 = JSON.parse(stepElement1.dataset.data);
      if (stepData1.options.current < 2) {
        stepData1.options.current += 1;
      }
      stepElement1.dataset.data = JSON.stringify(stepData1);
      checkCurrent();
      break;
    case "drag-c32qheh3evp6":
      const stepElement2 = $("#drag-qammlu475hay")[0];
      const stepData2 = JSON.parse(stepElement2.dataset.data);
      if (stepData2.options.current > 0) {
        stepData2.options.current -= 1;
      }
      stepElement2.dataset.data = JSON.stringify(stepData2);
      checkCurrent();
      break;
  }
}
