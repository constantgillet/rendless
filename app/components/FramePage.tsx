import React, {
  HTMLProps,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { css, cx } from "styled-system/css";
import { DATA_SCENA_ELEMENT_ID } from "~/utils/consts";
import { Tree, useEditorStore } from "./EditorStore";
import {
  Stage,
  Layer,
  Rect,
  Transformer,
  KonvaNodeComponent,
} from "react-konva";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { RectConfig } from "konva/lib/shapes/Rect";
import { v4 as uuidv4 } from "uuid";

type Props = HTMLProps<HTMLDivElement>;

const Rectangle = ({ shapeProps, onChange }: { shapeProps: RectConfig }) => {
  const shapeRef = useRef<Konva.Rect>();

  return (
    <Rect
      ref={shapeRef}
      {...shapeProps}
      name="rectangle"
      draggable
      onDragEnd={(e) => {
        onChange({
          ...shapeProps,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e) => {
        // transformer is changing scale of the node
        // and NOT its width or height
        // but in the store we have only width and height
        // to match the data better we will reset scale on transform end
        const node = shapeRef.current;
        const scaleX = node?.scaleX();
        const scaleY = node?.scaleY();

        // we will reset it back
        node?.scaleX(1);
        node?.scaleY(1);
        onChange({
          ...shapeProps,
          x: node?.x(),
          y: node?.y(),
          // set minimal value
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(node.height() * scaleY),
        });
      }}
    />
  );
};

export const FramePage = forwardRef<HTMLButtonElement, Props>(
  function FramePage(props, ref) {
    const tree = useEditorStore((state) => state.tree);
    const updateElement = useEditorStore((state) => state.updateElement);
    const addElement = useEditorStore((state) => state.addElement);
    const selectedTool = useEditorStore((state) => state.selectedTool);

    const [stageWidth, setStageWidth] = useState(1);
    const [stageHeight, setStageHeight] = useState(1);
    const stageContainer = useRef<HTMLDivElement>(null);
    const [selectedIds, selectShapes] = useState([]);

    const trRef = useRef<Konva.Transformer>(null);
    const layerRef = useRef<Konva.Layer>(null);
    const selectionRectRef = useRef<Konva.Rect>(null);

    const selection = useRef({
      visible: false,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    });

    const oldPos = useRef(null);

    useEffect(() => {
      const handleResize = () => {
        setStageWidth(stageContainer.current?.clientWidth || 1);
        setStageHeight(stageContainer.current?.clientHeight || 1);
      };

      handleResize();

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    useEffect(() => {
      const nodes = selectedIds.map((id) =>
        layerRef.current?.findOne("#" + id)
      );
      trRef.current?.nodes(nodes);
    }, [selectedIds]);

    if (typeof window === "undefined") {
      return null;
    }

    const checkDeselect = (e: KonvaEventObject<TouchEvent>) => {
      // deselect when clicked on empty area
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        selectShapes([]);
      }
    };

    const updateSelectionRect = () => {
      const node = selectionRectRef.current;

      if (!node) {
        return;
      }

      node.setAttrs({
        visible: selection.current.visible,
        x: Math.min(selection.current.x1, selection.current.x2),
        y: Math.min(selection.current.y1, selection.current.y2),
        width: Math.abs(selection.current.x1 - selection.current.x2),
        height: Math.abs(selection.current.y1 - selection.current.y2),
        fill: "rgba(0, 161, 255, 0.3)",
      });

      node.getLayer()?.batchDraw();
    };

    const onMouseDownSelectMode = (e: KonvaEventObject<MouseEvent>) => {
      const isElement = e.target.findAncestor(".elements-container");
      const isTransformer = e.target.findAncestor("Transformer");
      if (isElement || isTransformer) {
        return;
      }

      const pos = e.target.getStage().getPointerPosition();

      selection.current.visible = true;
      selection.current.x1 = pos.x;
      selection.current.y1 = pos.y;
      selection.current.x2 = pos.x;
      selection.current.y2 = pos.y;
      updateSelectionRect();
    };

    const onMouseDownDrawMode = (e: KonvaEventObject<MouseEvent>) => {
      const rect = e.target.getStage()?.getPointerPosition();

      if (selectedTool === "select" || !rect) {
        return;
      }

      const newElement: Tree = {
        id: uuidv4(),
        type: selectedTool,
        x: rect.x,
        y: rect.y,
        width: 74,
        height: 74,
      };

      addElement(newElement);
    };

    const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
      if (!selection.current.visible) {
        return;
      }
      const pos = e.target.getStage().getPointerPosition();
      selection.current.x2 = pos.x;
      selection.current.y2 = pos.y;
      updateSelectionRect();
    };

    const onMouseUp = () => {
      oldPos.current = null;
      selection.current.visible = false;
      const { x1, x2, y1, y2 } = selection.current;
      const moved = x1 !== x2 || y1 !== y2;
      if (!moved) {
        updateSelectionRect();
        return;
      }
      const selBox = selectionRectRef.current?.getClientRect();

      const elements = [];
      layerRef.current.find(".rectangle").forEach((elementNode) => {
        const elBox = elementNode.getClientRect();
        if (Konva.Util.haveIntersection(selBox, elBox)) {
          elements.push(elementNode);
        }
      });

      selectShapes(elements.map((el) => el.id()));
      updateSelectionRect();
    };

    const onClickTap = (e: KonvaEventObject<MouseEvent>) => {
      // if we are selecting with rect, do nothing
      const { x1, x2, y1, y2 } = selection.current;
      const moved = x1 !== x2 || y1 !== y2;
      if (moved) {
        return;
      }
      const stage = e.target.getStage();
      const layer = layerRef.current;
      const tr = trRef.current;

      // if click on empty area - remove all selections
      if (e.target === stage) {
        selectShapes([]);
        return;
      }

      // do nothing if clicked NOT on our rectangles
      if (!e.target.hasName("rectangle")) {
        return;
      }

      // do we pressed shift or ctrl?
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const isSelected = tr.nodes().indexOf(e.target) >= 0;

      if (!metaPressed && !isSelected) {
        // if no key pressed and the node is not selected
        // select just one
        selectShapes([e.target.id()]);
      } else if (metaPressed && isSelected) {
        // if we pressed keys and node was selected
        // we need to remove it from selection:
        selectShapes((oldShapes) => {
          return oldShapes.filter((oldId) => oldId !== e.target.id());
        });
      } else if (metaPressed && !isSelected) {
        // add the node into selection
        selectShapes((oldShapes) => {
          return [...oldShapes, e.target.id()];
        });
      }
      layer?.draw();
    };

    return (
      <div
        ref={stageContainer}
        className={cx(
          css({
            flex: 1,
            // padding: "var(--space-8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          })
        )}
      >
        <Stage
          width={stageWidth}
          height={stageHeight}
          onMouseDown={
            selectedTool === "select"
              ? onMouseDownSelectMode
              : onMouseDownDrawMode
          }
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onTouchStart={checkDeselect}
          onClick={onClickTap}
          onTap={onClickTap}
        >
          <Layer ref={layerRef}>
            {tree?.chilren?.map((node) => {
              return (
                <Rectangle
                  key={node.id}
                  getKey={node.id}
                  shapeProps={{
                    x: node.x,
                    y: node.y,
                    width: node.width,
                    height: node.height,
                    fill: "blue",
                    id: node.id,
                  }}
                  onChange={(newAttrs) => {
                    //Update node in tree
                    const newElement: Tree = {
                      ...node,
                      ...newAttrs,
                    };
                    updateElement(newElement);

                    // const rects = rectangles.slice();
                    // rects[node.id] = newAttrs;
                    // setRectangles(rects);
                  }}
                />
              );
            })}

            <Transformer
              // ref={trRef.current[getKey]}
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => {
                // limit resize
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
            <Rect fill="rgba(0,0,255,0.5)" ref={selectionRectRef} />
          </Layer>
        </Stage>
      </div>
    );
  }
);
