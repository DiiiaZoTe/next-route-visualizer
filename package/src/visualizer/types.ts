export type RouteData = {
  id: string;
  name: string;
  path: string;
  type: string | 'Route' | 'Group' | 'Segment' | 'Root';
  link: string;
  depth: number;
  maxSpan?: number;
  spanSize?: number;
  directlySpanning: number;
  parentID?: string;
  nextFiles?: string[];
  otherFiles?: string[];
  childrenID?: string[];
  x?: number;
  y?: number;
}

export type Route = {
  data: RouteData;
  children?: Route[];
}
