/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Panel,
} from "reactflow";
import "reactflow/dist/base.css";

import RouteNode from "./flow-nodes";
import {
  CloseIcon,
  ExternalLinkIcon,
  GithubLogo,
  RefreshIcon,
} from "./other-components";
import { NODE_WIDTH, NODE_HEIGHT, NODE_BORDER } from "./constants";

import styles from "./styles.module.css";

const nodeTypes = {
  routeNode: RouteNode,
};

const defaultEdgeOptions = {
  animated: true,
  type: "default",
};

interface FlowProps {
  initialNodes: Node<any>[];
  initialEdges: Edge<any>[];
}

const Flow = (props: FlowProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(props.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.initialEdges);
  const [selectedNodeID, setSelectedNodeID] = useState<string>();

  const refreshPage = () => {
    window.location.reload();
  };

  const closePanel = () => {
    setSelectedNodeID(undefined);
  };

  const getNodeSelected = (event: React.MouseEvent, node: Node) => {
    console.log(node);
    return selectedNodeID === node.id
      ? setSelectedNodeID(undefined)
      : setSelectedNodeID(node.id);
  };

  useEffect(() => {
    setSelectedNodeID(nodes[0].id);
  }, []);

  useEffect(() => {
    setNodes(
      props.initialNodes.map((node) => {
        return {
          ...node,
          data: {
            ...node.data,
            selected: node.id === selectedNodeID,
          },
        };
      })
    );
  }, [selectedNodeID, setNodes, props.initialNodes]);

  const nodeColor = (node: Node) => {
    return node?.data?.color || "#ccc";
  };

  const selectedNode = useMemo(() => {
    return nodes.find((node) => node.id === selectedNodeID);
  }, [selectedNodeID, nodes]);

  const includedFiles = useMemo(() => {
    return Object.keys(selectedNode?.data?.includedFiles ?? {});
  }, [selectedNode]);

  const validLink = useMemo(() => {
    if (!selectedNode?.data?.link) return "";
    const hasLink = includedFiles.map((file) => {
      return file.startsWith("page.") || file.startsWith("route.");
    });
    return hasLink.length ? selectedNode?.data?.link : "";
  }, [selectedNode, includedFiles]);

  return (
    <div
      className={styles.flow}
      data-menu={selectedNodeID !== undefined ? "true" : "false"}
    >
      <div className={styles.sideDashBoard}>
        <div className={styles.sideDashHeader}>
          <p>Route information</p>
          <div onClick={closePanel} style={{ cursor: "pointer" }}>
            {/* svf icon close */}
            <CloseIcon color="#ccc" />
          </div>
        </div>
        <div className={styles.sideDashGroup}>
          <p className={styles.sideDashGroupHeader}>Name:</p>
          <p className={styles.sideDashGroupItem}>{selectedNode?.data?.name}</p>
        </div>
        <div className={styles.sideDashGroup}>
          <p className={styles.sideDashGroupHeader}>Link:</p>
          <div className={styles.sideDashGroupItem}>
            <span
              className={styles.sideDashGroupLink}
              dangerouslySetInnerHTML={{
                __html: selectedNode?.data?.link
                  .replace(/\//g, "/<wbr>")
                  .replace(/\./g, ".<wbr>")
                  .replace(/\-/g, "-<wbr>"),
              }}
            />
            <a
              href={validLink}
              style={{ marginLeft: "auto" }}
              target="_blank"
              rel="noreferrer"
              className={styles.sideDashGroupLinkIcon}
            >
              <ExternalLinkIcon color={validLink !== "" ? "#000" : "#ccc"} />
            </a>
          </div>
        </div>
        <div className={styles.sideDashGroup}>
          <p className={styles.sideDashGroupHeader}>Path:</p>
          <p className={styles.sideDashGroupItem}>{selectedNode?.data?.path}</p>
        </div>
        <div className={styles.sideDashGroup}>
          <p className={styles.sideDashGroupHeader}>Type:</p>
          <p className={styles.sideDashGroupItem}>{selectedNode?.data?.type}</p>
        </div>
        <div className={styles.sideDashGroup}>
          <p className={styles.sideDashGroupHeader}>NextJS files:</p>
          {includedFiles.map((file) => {
            return (
              <p key={file} className={styles.sideDashGroupItem}>
                {file}
              </p>
            );
          })}
          {includedFiles.length === 0 ? (
            <p
              className={
                styles.sideDashGroupItem + " " + styles.sideDashGroupItemError
              }
            >
              None
            </p>
          ) : null}
        </div>
        <div className={styles.sidedashGithub}>
          <a href="https://github.com/DiiiaZoTe/next-route-visualizer">
            <span>Github</span>
            <GithubLogo />
          </a>
        </div>
      </div>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onNodeClick={getNodeSelected}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        zoomOnDoubleClick={false}
        fitView
        snapToGrid
        proOptions={{
          hideAttribution: true,
        }}
        className={styles.reactFlow}
      >
        <Background
          color="#fafafa"
          variant={BackgroundVariant.Lines}
          gap={[NODE_WIDTH, NODE_HEIGHT]}
          lineWidth={NODE_BORDER}
        />
        <MiniMap
          nodeColor={nodeColor}
          nodeStrokeWidth={3}
          zoomable
          pannable
          position="bottom-right"
        />
        <Panel position="top-left" className={styles.flowPanel}>
          <button
            type="button"
            onClick={refreshPage}
            className={styles.refreshButton}
          >
            <span className={styles.refreshIcon}>
              <RefreshIcon color="#000" />
            </span>
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default Flow;
