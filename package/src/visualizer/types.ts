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
  displayColocating?: boolean;
};

export type File = {
  name: string;
  extension: string;
  path: string;
  isClient: boolean;
}

export type RouteData = {
  id: string;
  name: string;
  path: string;
  type: string | 'Route' | 'Group' | 'Segment' | 'Root' | 'Colocating';
  link: string;
  depth: number;
  maxSpan: number;
  spanSize: number;
  directlySpanning: number;
  parentID?: string;
  nextFiles?: File[];
  otherFiles?: File[];
  childrenID?: string[];
  x?: number;
  y?: number;
}

export type Route = {
  data: RouteData;
  children?: Route[];
}

export type NodeData = {
  name: string;
  path: string;
  link: string;
  parentID: string;
  type: string;
  color: string;
  borderColor: string;
  childrenID: string[];
  nextFiles: File[];
  otherFiles: File[];
  selected?: boolean;
}