import "./style.css";

import Moveable from "moveable";
import Selecto from "selecto";

const moveable = new Moveable(document.body, {
  target: document.querySelector(".target"),
  // If the container is null, the position is fixed. (default: parentElement(document.body))
  // container: document.body,
  draggable: true,
  resizable: true,
  scalable: true,
  rotatable: true,
  warpable: true,
  // Enabling pinchable lets you use events that
  // can be used in draggable, resizable, scalable, and rotateable.
  pinchable: true, // ["resizable", "scalable", "rotatable"]
  origin: true,
  keepRatio: true,
  // Resize, Scale Events at edges.
  edge: false,
  throttleDrag: 0,
  throttleResize: 0,
  throttleScale: 0,
  throttleRotate: 0,
});

/* draggable */
moveable
  .on("dragStart", ({ target, clientX, clientY }) => {
    console.log("onDragStart", target);
  })
  .on(
    "drag",
    ({
      target,
      transform,
      left,
      top,
      right,
      bottom,
      beforeDelta,
      beforeDist,
      delta,
      dist,
      clientX,
      clientY,
    }) => {
      console.log("onDrag left, top", left, top);
      // target.style.left = `${left}px`;
      // target.style.top = `${top}px`;
      // target.style.position = "absolute";
      // console.log("onDrag translate", dist);
      target.style.transform = transform;
    }
  )
  .on("dragEnd", ({ target, isDrag, clientX, clientY }) => {
    console.log("onDragEnd", target, isDrag);
  });

/* resizable */
moveable
  .on("resizeStart", ({ target, clientX, clientY, stop }) => {
    console.log("onResizeStart", target);
    // stop();
  })
  .on("resize", (e) => {
    const { target, width, height, dist, delta, clientX, clientY, stop } = e;
    console.log("onResize", target, e);
    target.style.transform = `translate(${clientX}px, ${clientY}px)`;
    delta[0] && (target.style.width = `${width}px`);
    delta[1] && (target.style.height = `${height}px`);
  })
  .on("resizeEnd", ({ target, isDrag, clientX, clientY }) => {
    console.log("onResizeEnd", target, isDrag);
  });

/* scalable */
moveable
  .on("scaleStart", ({ target, clientX, clientY }) => {
    console.log("onScaleStart", target);
  })
  .on(
    "scale",
    ({ target, scale, dist, delta, transform, clientX, clientY }) => {
      console.log("onScale scale", scale);
      target.style.transform = transform;
    }
  )
  .on("scaleEnd", ({ target, isDrag, clientX, clientY }) => {
    console.log("onScaleEnd", target, isDrag);
  });

/* rotatable */
moveable
  .on("rotateStart", ({ target, clientX, clientY }) => {
    console.log("onRotateStart", target);
  })
  .on(
    "rotate",
    ({ target, beforeDelta, delta, dist, transform, clientX, clientY }) => {
      console.log("onRotate", dist);
      target.style.transform = transform;
    }
  )
  .on("rotateEnd", ({ target, isDrag, clientX, clientY }) => {
    console.log("onRotateEnd", target, isDrag);
  });

/* warpable */
let matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
moveable
  .on("warpStart", ({ target, clientX, clientY }) => {
    console.log("onWarpStart", target);
  })
  .on(
    "warp",
    ({ target, clientX, clientY, delta, dist, multiply, transform }) => {
      console.log("onWarp", target);
      // target.style.transform = transform;
      matrix = multiply(matrix, delta);
      target.style.transform = `matrix3d(${matrix.join(",")})`;
    }
  )
  .on("warpEnd", ({ target, isDrag, clientX, clientY }) => {
    console.log("onWarpEnd", target, isDrag);
  });

/* pinchable */
// Enabling pinchable lets you use events that
// can be used in draggable, resizable, scalable, and rotateable.
moveable
  .on("pinchStart", ({ target, clientX, clientY }) => {
    // pinchStart event occur before dragStart, rotateStart, scaleStart, resizeStart
    console.log("onPinchStart");
  })
  .on("pinch", ({ target, clientX, clientY, datas }) => {
    // pinch event occur before drag, rotate, scale, resize
    console.log("onPinch");
  })
  .on("pinchEnd", ({ isDrag, target, clientX, clientY, datas }) => {
    // pinchEnd event occur before dragEnd, rotateEnd, scaleEnd, resizeEnd
    console.log("onPinchEnd");
  });

const selecto = new Selecto({
  // The container to add a selection element
  container: document.body,
  // Selecto's root container (No transformed container. (default: null)
  rootContainer: null,
  // The area to drag selection element (default: container)
  dragContainer: window,
  // Targets to select. You can register a queryselector or an Element.
  selectableTargets: [".target"],
  // Whether to select by click (default: true)
  selectByClick: true,
  // Whether to select from the target inside (default: true)
  selectFromInside: true,
  // After the select, whether to select the next target with the selected target (deselected if the target is selected again).
  continueSelect: false,
  // Determines which key to continue selecting the next target via keydown and keyup.
  toggleContinueSelect: "shift",
  // The container for keydown and keyup events
  keyContainer: window,
  // The rate at which the target overlaps the drag area to be selected. (default: 100)
  hitRate: 100,
});

selecto.on("dragStart", ({ target, stop }) => {
  stop();
});
selecto.on("select", (e) => {
  e.added.forEach((el) => {
    el.classList.add("selected");
    console.log(el);
  });
  e.removed.forEach((el) => {
    el.classList.remove("selected");
  });
});
