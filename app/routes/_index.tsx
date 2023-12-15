import type { MetaFunction } from "@remix-run/node";
import { css, cx } from "styled-system/css";
import Moveable, { OnDrag, OnResize, OnScale } from "react-moveable";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  if (typeof document === "undefined") {
    return null;
  }

  return (
    <>
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          lineHeight: "1.8",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className={css({ w: 1200, h: 630, backgroundColor: "gray.300" })}>
          <div
            className={cx(
              "target",
              css({ w: 70, h: 70, backgroundColor: "red.300" })
            )}
          />

          <div
            className={cx(
              "target-2",
              css({ w: 70, h: 70, backgroundColor: "green.300" })
            )}
          />
        </div>
      </div>
      <Moveable
        target={document.querySelector(".target")}
        container={null}
        origin={true}
        /* Resize event edges */
        edge={false}
        /* draggable */
        draggable={true}
        throttleDrag={0}
        onDragStart={({ target, clientX, clientY }) => {
          console.log("onDragStart", target);
        }}
        onDrag={({
          target,
          beforeDelta,
          beforeDist,
          left,
          top,
          right,
          bottom,
          delta,
          dist,
          transform,
          clientX,
          clientY,
        }: OnDrag) => {
          console.log("onDrag left, top", left, top);
          // target!.style.left = `${left}px`;
          // target!.style.top = `${top}px`;
          console.log("onDrag translate", dist);
          target!.style.transform = transform;
        }}
        onDragEnd={({ target, isDrag, clientX, clientY }) => {
          console.log("onDragEnd", target, isDrag);
        }}
        /* When resize or scale, keeps a ratio of the width, height. */
        keepRatio={true}
        /* resizable*/
        /* Only one of resizable, scalable, warpable can be used. */
        resizable={true}
        throttleResize={0}
        onResizeStart={({ target, clientX, clientY }) => {
          console.log("onResizeStart", target);
        }}
        onResize={({
          target,
          width,
          height,
          dist,
          delta,
          direction,
          clientX,
          clientY,
        }: OnResize) => {
          console.log("onResize", target);
          delta[0] && (target!.style.width = `${width}px`);
          delta[1] && (target!.style.height = `${height}px`);
        }}
        onResizeEnd={({ target, isDrag, clientX, clientY }) => {
          console.log("onResizeEnd", target, isDrag);
        }}
        /* scalable */
        /* Only one of resizable, scalable, warpable can be used. */
        scalable={true}
        throttleScale={0}
        onScaleStart={({ target, clientX, clientY }) => {
          console.log("onScaleStart", target);
        }}
        onScale={({
          target,
          scale,
          dist,
          delta,
          transform,
          clientX,
          clientY,
        }: OnScale) => {
          console.log("onScale scale", scale);
          target!.style.transform = transform;
        }}
        onScaleEnd={({ target, isDrag, clientX, clientY }) => {
          console.log("onScaleEnd", target, isDrag);
        }}
        /* rotatable */
        throttleRotate={0}
        onRotateStart={({ target, clientX, clientY }) => {
          console.log("onRotateStart", target);
        }}
        // Enabling pinchable lets you use events that
        // can be used in draggable, resizable, scalable, and rotateable.
        pinchable={true}
        onPinchStart={({ target, clientX, clientY, datas }) => {
          // pinchStart event occur before dragStart, rotateStart, scaleStart, resizeStart
          console.log("onPinchStart");
        }}
        onPinch={({ target, clientX, clientY, datas }) => {
          // pinch event occur before drag, rotate, scale, resize
          console.log("onPinch");
        }}
        onPinchEnd={({ isDrag, target, clientX, clientY, datas }) => {
          // pinchEnd event occur before dragEnd, rotateEnd, scaleEnd, resizeEnd
          console.log("onPinchEnd");
        }}
      />
    </>
  );
}
