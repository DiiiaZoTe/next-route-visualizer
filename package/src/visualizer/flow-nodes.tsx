"use client";

import { memo, FC, CSSProperties, useMemo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import {
  HANDLE_SIZE,
  NODE_WIDTH,
  NODE_HEIGHT,
  NODE_BORDER,
  NODE_BORDER_RADIUS,
} from "./constants";
import {
  FilesPageIcon,
  FilesErrorIcon,
  FilesLayoutIcon,
  FilesLoadingIcon,
  FilesRouteIcon,
} from "./other-components";

import styles from "./styles.module.css";

const SELECTION_BOX = 50;

const HandleCommonStyle: CSSProperties = {
  minWidth: "0px",
  minHeight: "0px",
  width: `${HANDLE_SIZE}px`,
  height: `${HANDLE_SIZE}px`,
  background: "transparent",
};

const Box: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "center",
  flexGrow: 1,
  width: `${NODE_WIDTH}px`,
  height: `${NODE_HEIGHT}px`,
  padding: "1rem",
  fontSize: "1.2rem",
  boxSizing: "border-box",
};

const titleStyle: CSSProperties = {
  textAlign: "center",
  fontWeight: "bolder",
};

const SelectedBox: CSSProperties = {
  position: "absolute",
  top: `-${SELECTION_BOX / 2}px`,
  left: `-${SELECTION_BOX / 2}px`,
  width: `calc(100% + ${SELECTION_BOX}px)`,
  height: `calc(100% + ${SELECTION_BOX}px)`,
  border: `${NODE_BORDER * 2}px solid #000`,
  borderRadius: `${NODE_BORDER_RADIUS + 5}px`,
};

const RouteNode: FC<NodeProps> = ({ id, data, xPos, yPos }) => {
  return (
    <>
      <div style={Box}>
        <p
          style={{ color: data.borderColor, ...titleStyle }}
          className={styles.truncateText}
        >
          {data.name}
        </p>
        <div className={styles.nodeIconsContainer}>
          {data.nextFiles?.find((file) => file.startsWith("page.")) ? (
            <FilesPageIcon color={data.borderColor} />
          ) : null}
          {data.nextFiles?.find(
            (file) => file.startsWith("error.") || file.startsWith("error.")
          ) ? (
            <FilesErrorIcon color={data.borderColor} />
          ) : null}
          {data.nextFiles?.find(
            (file) => file.startsWith("layout.") || file.startsWith("template.")
          ) ? (
            <FilesLayoutIcon color={data.borderColor} />
          ) : null}
          {data.nextFiles?.find((file) => file.startsWith("route.")) ? (
            <FilesRouteIcon color={data.borderColor} />
          ) : null}
          {data.nextFiles?.find((file) => file.startsWith("loading.")) ? (
            <FilesLoadingIcon color={data.borderColor} />
          ) : null}
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        style={{ ...HandleCommonStyle, top: `${-HANDLE_SIZE}px` }}
        id="Normal"
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ ...HandleCommonStyle, right: `${-HANDLE_SIZE}px` }}
        id="Group"
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ ...HandleCommonStyle, left: `${-HANDLE_SIZE}px` }}
        id="Group"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ ...HandleCommonStyle, bottom: `${-HANDLE_SIZE}px` }}
        id="Normal"
      />
      <div
        style={{ ...SelectedBox, borderColor: data.borderColor }}
        className={styles.nodeSelected}
        data-selected={data.selected ? "true" : "false"}
      />
    </>
  );
};

export default memo(RouteNode);
