// this needs to be a server component or it will not fetch the routes

import React from "react";
import { getNodesAndEdges } from "./lib";
import Flow from "./flow";

export type VisualizerProps = {
  /**
   * The relative path to the route from the app directory
   * We will look for the app directory within the project root or the src directory for you.
   */
  path?: string;
  /**
   * The base url of the application
   * @default string http://localhost:3000
   */
  baseURL?: string;
  /**
   * hide colocating folders in the visualizer
   * @default boolean false
   */
  displayColocation?: boolean;
};

export const Visualizer = ({
  path,
  baseURL = "http://localhost:3000",
  displayColocation = false,
}: VisualizerProps) => {
  const { nodes, edges } = getNodesAndEdges({
    path,
    baseURL,
    displayColocation,
  });
  return (
    <>
      <Flow initialNodes={nodes} initialEdges={edges} />
    </>
  );
};
