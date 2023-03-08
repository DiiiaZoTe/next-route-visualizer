import { VisualizerProps } from "../types";
import { postorderTraversal } from "../utils";
import { createNodesEdges } from "./createNodesEdges";
import { getRoutes } from "./getRoutes";
import { hideColocating } from "./hideColocating";
import { positionTree } from "./positionTree";

/**
 * main entry point for getting the nodes and edges
 * @param props 
 * @returns 
 */
export const getNodesEdges = (props: VisualizerProps) => {
  const { path, baseURL, displayColocating } = props;
  // initialize the tree of routes
  let route = getRoutes(path, baseURL);
  // hide colocation if the option is set
  if (!displayColocating) route = postorderTraversal(route, hideColocating);
  // position the tree nodes
  route = positionTree(route);
  // create the nodes and edges
  return createNodesEdges(route);
}