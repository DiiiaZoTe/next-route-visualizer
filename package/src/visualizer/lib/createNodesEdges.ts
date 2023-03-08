import { NodeData, Route } from "../types";
import { getNodeColorsByType, routeToArray } from "../utils";
import { NODE_BORDER, NODE_BORDER_RADIUS, NODE_HEIGHT, NODE_WIDTH } from "../constants";
import { Node, Edge } from "reactflow";

/**
 * Create the nodes and edges for the react flow component
 * @param route
 * @returns 
 */
export const createNodesEdges = (route: Route) => {
  const routesArray = routeToArray(route);

  let nodes: Node[] = [];
  let edges: Edge[] = [];

  routesArray.forEach((current) => {
    // get colors
    const { color, borderColor } = getNodeColorsByType(current.type);

    //! create node
    nodes.push({
      id: current.id,
      data: {
        name: current.name,
        path: current.path,
        link: current.link,
        parentID: current.parentID,
        type: current.type,
        color: color,
        borderColor: borderColor,
        childrenID: current.childrenID,
        nextFiles: current.nextFiles,
        otherFiles: current.otherFiles,
      } as NodeData,
      type: 'routeNode',
      position: { x: current.x ?? 0, y: current.y ?? 0 },
      deletable: false,
      draggable: false,
      style: {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        backgroundColor: color,
        border: `${NODE_BORDER}px solid ${borderColor}`,
        borderRadius: NODE_BORDER_RADIUS,
        borderColor: borderColor,
        display: 'flex',
      }
    });

    //! create edges for children
    current.childrenID?.map((childID) => {
      // get the child node
      const childNode = routesArray.find(node => node.id === childID);

      const { color: childColor, borderColor: childBorderColor } = getNodeColorsByType(childNode?.type ?? 'Route');
      edges.push({
        id: `${current.id}-${childID}`,
        source: current.id,
        target: childID,
        deletable: false,
        markerEnd: {
          type: "arrow" as any,
          width: 10,
          height: 10,
          strokeWidth: 2,
          color: `${childBorderColor}`,
        },
        style: {
          strokeWidth: NODE_BORDER * 1.5,
          stroke: `${childBorderColor}`,
        },
        sourceHandle: childNode?.type === 'Group' ? 'Group' : 'Normal',
        targetHandle: childNode?.type === 'Group' ? 'Group' : 'Normal',
      });
    });
  });

  return { nodes, edges };
};