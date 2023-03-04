// this needs to be a server component or it will not fetch the routes

import { getRoutes, createNodesAndEdges } from './lib';
import Flow from './flow';

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
};

export const Visualizer = (props: VisualizerProps) => {
  const route = getRoutes(props.path, props.baseURL);
  const { nodes, edges } = createNodesAndEdges(route);
  return (
    <>
      <Flow initialNodes={nodes} initialEdges={edges} />
    </>
  );
};
