// this needs to be a server component or it will not fetch the routes

import React from "react";
import getNodesEdges from "./lib";
import Flow from "./components/flow/flow";
import { VisualizerProps } from "./types";

export const Visualizer = ({
  path,
  baseURL = "http://localhost:3000",
  displayColocating = false,
}: VisualizerProps) => {
  const { nodes, edges } = getNodesEdges({
    path,
    baseURL,
    displayColocating,
  });
  return (
    <>
      <Flow initialNodes={nodes} initialEdges={edges} />
    </>
  );
};
