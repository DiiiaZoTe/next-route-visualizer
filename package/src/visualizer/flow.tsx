/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useMemo, useState } from "react";

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
  initialNodes: Node[];
  initialEdges: Edge[];
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

  const nodeColor = (node: Node): string => {
    return node?.data?.color || "#ccc";
  };

  const selectedNode = useMemo(() => {
    return nodes.find((node) => node.id === selectedNodeID);
  }, [selectedNodeID, nodes]);

  const validLink: string = useMemo(() => {
    if (!selectedNode?.data?.link) return "";
    const hasLink = selectedNode?.data?.nextFiles.some((file: string) => {
      return file.startsWith("page.") || file.startsWith("route.");
    });
    return hasLink ? selectedNode?.data?.link : "";
  }, [selectedNode]);

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
                __html:
                  validLink !== ""
                    ? selectedNode?.data?.link
                        .replace(/\//g, "/<wbr>")
                        .replace(/\./g, ".<wbr>")
                        .replace(/\-/g, "-<wbr>")
                    : "None",
              }}
            />
            <a
              href={validLink}
              style={{ marginLeft: "auto" }}
              target="_blank"
              rel="noreferrer"
              className={styles.sideDashGroupLinkIcon}
              data-valid={validLink !== "" ? "true" : "false"}
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
          {selectedNode?.data?.nextFiles?.map((file: string) => {
            return (
              <p key={file} className={styles.sideDashGroupItem}>
                {file}
              </p>
            );
          })}
          {selectedNode?.data?.nextFiles?.length === 0 ? (
            <p
              className={
                styles.sideDashGroupItem + " " + styles.sideDashGroupItemError
              }
            >
              None
            </p>
          ) : null}
        </div>
        <div className={styles.sideDashGroup}>
          <p className={styles.sideDashGroupHeader}>Other files:</p>
          {selectedNode?.data?.otherFiles?.map((file: string) => {
            return (
              <p key={file} className={styles.sideDashGroupItem}>
                {file}
              </p>
            );
          })}
          {selectedNode?.data?.otherFiles?.length === 0 ? (
            <p className={styles.sideDashGroupItem}>None</p>
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
