import fs from 'fs';
import { createHash } from 'crypto';

import type { Route, RouteData } from './types';
import { routeToArray } from './utils';

import {
  ALLOWED_EXTENSIONS,
  NEXT_FILES,
  FALLBACK_BASE_URL,
  NODE_SPACING_X,
  NODE_SPACING_Y,
  NODE_WIDTH,
  NODE_HEIGHT,
  NODE_BORDER_RADIUS,
  NODE_BORDER
} from './constants';

import type { Node, Edge } from 'reactflow';

import type { VisualizerProps } from './visualizer';

export const getNodesAndEdges = (props: VisualizerProps) => {
  const { path, baseURL, hideColocation } = props;
  // initialize the tree of routes
  let route = getRoutes(path, baseURL);
  // hide colocation if the option is set
  if (hideColocation) route = postorderTraversal(route, hideColocationFn);
  // set the spans of the tree route (nodes)
  route = postorderTraversal(route, setRouteSpans);
  // position the tree nodes
  route = positionTree(route);
  // create the nodes and edges
  return createNodesAndEdges(route);
}

/**
 * Get the routes from a path. If no path is provided, it will try to find the app directory
 * @param path - path to get routes from
 * @returns 
 */
export const getRoutes = (path?: string, baseURL?: string,) => {
  baseURL = baseURL ?? FALLBACK_BASE_URL;
  if (!path || path === '') {
    try {
      isDirectory('./app');
      return getRoutesHelper('./app', baseURL);
    } catch (error) {
      // console.log('No ./app directory found')
    }
    try {
      isDirectory('./src/app');
      return getRoutesHelper('./src/app', baseURL);
    } catch (error) {
      // console.log('No ./src/app directory found')
    }
    throw new Error('No app directory found and no path provided');
  }
  try {
    const relativePath = `./app/${path}`
    if (!isDirectory(relativePath)) throw new Error('Path is valid for ./app')
    return getRoutesHelper(relativePath, `${baseURL}/${pathFromRoot(relativePath)}`);
  } catch (error) {
    // console.log(error)
  }
  try {
    const relativePath = `./src/app/${path}`
    if (!isDirectory(relativePath)) throw new Error('Path is valid for ./src/app')
    return getRoutesHelper(relativePath, `${baseURL}/${pathFromRoot(relativePath)}`);
  } catch (error) {
    // console.log(error)
  }
  return {} as Route;
};

/**
 * Get all routes from a path recursively
 * @param path
 * @return route
 */
export const getRoutesHelper = (path: string, link: string, depth: number = 0, parentID?: string) => {
  try {
    // Get all elements in the path and split them into folders and files
    const elements = fs.readdirSync(path);
    const [folders, files] = elements.reduce(
      (acc, element) => {
        const fullPath = `${path}/${element}`;
        if (isDirectory(fullPath)) {
          acc[0].push(element);
          return acc;
        }
        if (isAllowedFile(fullPath)) {
          acc[1].push(element);
          return acc;
        }
        return acc;
      },
      [[], []] as string[][],
    );

    const isGroup = isRouteGroup(path)
    // if the path is a route group, the link should be the parent link
    if (isGroup) link = link.split('/').slice(0, -1).join('/')

    const isSegment = isRouteSegment(path)
    // if the path is a route segment, the link should be the parent link + a star
    if (isSegment) link = `${link.split('/').slice(0, -1).join('/')}/*`
    // find the name's index in the link


    // create route data
    const routeID = createHash('sha256').update(path).digest('hex');
    const routeName = path.split('/')?.pop() ?? path;
    if (isGroup) depth = depth - 1;

    // use a reduce to seperate the files into next files and other files
    const { nextFiles, otherFiles } = files.reduce(
      (acc, file) => {
        const isNextFile = NEXT_FILES.some((nextFile) => file.startsWith(nextFile));
        if (isNextFile) acc.nextFiles.push(file);
        else acc.otherFiles.push(file);
        return acc;
      },
      { nextFiles: [], otherFiles: [] } as { nextFiles: string[]; otherFiles: string[] },
    );

    const data: RouteData = {
      id: routeID,
      name: routeName,
      path,
      link,
      depth,
      type: parentID === undefined ? 'Root' : isGroup ? 'Group' : isSegment ? 'Segment' : 'Route',
      parentID,
      maxSpan: 1,
      spanSize: NODE_WIDTH,
      directlySpanning: 0,
      nextFiles: nextFiles,
      otherFiles: otherFiles,
      childrenID: [
        ...folders.map((folder) =>
          createHash('sha256').update(`${path}/${folder}`).digest('hex'),
        ),
      ],
    };
    const children: Route[] = [
      ...folders.map((folder, index) => getRoutesHelper(`${path}/${folder}`, `${link}/${folder}`, depth + 1, routeID)),
    ];

    const route: Route = {
      data,
      children,
    };
    return route;
  } catch (error: any) {
    throw new Error(`Path: ${path} is not a valid path \n${error}`);
  }
};

/**
 * Is the path a directory
 * @param path 
 * @returns boolean
 */
export const isDirectory = (path: string) => {
  try {
    return fs.lstatSync(path).isDirectory();
  } catch (error) {
    return false
    // throw new Error(`Path ${path} is not a directory`);
  }
};

/**
 * Is the path an allowed file
 * @param path 
 * @returns boolean
 */
export const isAllowedFile = (path: string) => {
  try {
    // Check if file
    if (!fs.lstatSync(path).isFile()) return false;

    // File name processing
    // split path by / and get last element
    const fileName = path.split('/').pop();
    // extract file name and extension
    const fileNameSplit = fileName?.split('.');
    const fileNameWithoutExtension = fileNameSplit?.slice(0, -1).join('.');
    const fileExtension = fileNameSplit?.pop();

    // Check if file name is allowed
    if (!NEXT_FILES.includes(`${fileNameWithoutExtension}.`)) return false;
    // Check if file extension is allowed
    if (!ALLOWED_EXTENSIONS.includes(`.${fileExtension}`)) return false;
    return true;
  } catch (error) {
    return false;
    // throw new Error(`Path ${path} is not a next file or does not exist`);
  }
};

/**
 * Determines if the path is a route group
 * @param path 
 * @returns 
 */
const pathFromRoot = (path: string) => {
  const pathSplit = path.split('/');
  const rootIndex = pathSplit.findIndex((element) => element === 'app');
  // find all route groups and remove them from the path
  const pathNoGroups = pathSplit.filter((element) => !isRouteGroup(element));
  return pathNoGroups.slice(rootIndex + 1).join('/');
};

/**
 * Determines if the path is a route group
 * @param path 
 * @returns 
 */
const isRouteGroup = (path: string) => {
  const fileName = path.split('/').pop();
  // if file name start with ( and end with ) it is a route group
  if (fileName?.startsWith('(') && fileName?.endsWith(')')) return true;
  return false;
}

/**
 * Determines if the path is a route segment
 * @param path 
 * @returns 
 */
const isRouteSegment = (path: string) => {
  const fileName = path.split('/').pop();
  // if file name start with [ and end with ] it is a route segment
  if (fileName?.startsWith('[') && fileName?.endsWith(']')) return true;
  return false;
}

/**
 * position the tree nodes x and y coordinates
 * @param root 
 * @returns 
 */
const positionTree = (root: Route) => {
  // create a super root to handle the positioning of the root node and its groups
  const superRoot = {
    data: root.data,
    children: [root],
  }

  // create a stack to traverse the tree
  const stack = [] as { parentSpan: number, currentIndex: number, siblingSpan: number[], parentX: number, route: Route }[];

  // push the super root to the stack
  stack.push({ parentSpan: 0, currentIndex: 0, parentX: -NODE_WIDTH / 2, siblingSpan: [], route: superRoot });

  // traverse the tree
  while (stack.length) {
    // get the current node from the stack
    const stackValue = stack.pop();
    const { parentSpan, currentIndex, siblingSpan, parentX, route } = stackValue!;

    // logic to calculate the x and y coordinates of the node
    const siblingsCurrentSpan = siblingSpan.slice(0).reduce((acc, curr, index) => index < currentIndex ? acc + curr : acc, 0);
    route.data.x = parentX - (parentSpan / 2) + siblingsCurrentSpan + (route.data.spanSize / 2) + (NODE_SPACING_X * currentIndex);
    route.data.y = route.data.depth * (NODE_SPACING_Y + NODE_HEIGHT);

    //! below is the logic to keep traversing the tree
    // first get the children without the groups
    const childrenNotGroup = route?.children?.filter(child => child.data.type !== 'Group');
    if (childrenNotGroup === undefined) continue;

    // then get the groups from the groups you just got (since they are on the same depth)
    let childrenGroups: Route[] = [];
    childrenNotGroup.forEach(route => {
      const routeGroups = route.children?.filter(child => child.data.type === 'Group');
      routeGroups?.forEach(group => {
        childrenGroups.push(group);
      });
    });

    // merge the two arrays (children and groups)
    const children = [...childrenNotGroup, ...childrenGroups];

    // sort the array by the route data.path (to allow the groups to be next to their parent route)
    children.sort((a, b) => a.data.path.localeCompare(b.data.path));

    // reverse the array to get the correct order and push to the stack for traversal
    children.reverse();
    const childrenSpans = children.map(child => child.data.spanSize).reverse();
    children.forEach((child, index) =>
      stack.push({
        parentSpan: route.data.spanSize,
        currentIndex: children.length - index - 1,
        siblingSpan: childrenSpans,
        parentX: route.data.x!,
        route: child
      }));
  }
  return root;
}

/**
 * Create the nodes and edges for the react flow component
 * @param route
 * @returns 
 */
export const createNodesAndEdges = (route: Route) => {
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
      },
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

/**
 * Helper function to get the colors for the nodes
 * @param type 
 * @returns 
 */
const getNodeColorsByType = (type: string) => {
  switch (type) {
    case 'Route':
      //tailwind violet-100 and violet-500
      return { color: '#ede9fe', borderColor: '#8b5cf6' };
    case 'Group':
      //tailwind rose-100 and rose-500
      return { color: '#fce7f3', borderColor: '#ec4899' };
    case 'Segment':
      //tailwind green-100 and green-500
      return { color: '#ecfdf5', borderColor: '#059669' };
    case 'Root':
      //tailwind blue-100 and blue-500
      return { color: '#dbedff', borderColor: '#2563eb' };
    default:
      // like Route
      return { color: '#ede9fe', borderColor: '#8b5cf6' };
  }
};

/**
 * The best way to apply some modification to the route tree using a postorder traversal.
 * Or how I call it... the saving grace of my problems here! LOL
 * @param route 
 * @param modifierFn A function that takes a route and returns a route modified in some way
 * @returns Route
 */
const postorderTraversal = (route: Route, modifierFn: (route: Route) => Route) => {
  if (!route.children) {
    return modifierFn(route);
  }
  route.children = route.children.map((child) => postorderTraversal(child, modifierFn)).filter((child) => child !== null) as Route[];
  return modifierFn(route);
}

/**
 * 
 * @param route 
 * @returns 
 */
const hideColocationFn = (route: Route) => {
  // if no children, return route
  if (!route.children || route.children.length === 0) {
    return route;
  }

  //check if children have page or route files
  for (let i = 0; i < route.children.length; i++) {
    const child = route.children[i];

    // Check if any included file starts with "page." or "route."
    const hasPageOrRouteFile = child?.data?.nextFiles.some(
      fileName => fileName.startsWith('page.') || fileName.startsWith('route.')
    );

    // Delete child node if it doesn't have a page or route file and has no children
    if (!hasPageOrRouteFile && (!child.children || child.children.length === 0)) {
      route.children.splice(i, 1);
      i--;
    }
  }
  return route;
}

/**
 * Set the spans for the route and subroutes.
 * This is useful to calculate the x position of the nodes later
 * @param route 
 * @returns Route
 */
const setRouteSpans = (route: Route) => {
  //apply default if no children
  if (!route.children || route.children.length === 0) {
    route.data.maxSpan = 1;
    route.data.spanSize = NODE_WIDTH;
    route.data.directlySpanning = 0;
    return route;
  }
  // get the span
  const { maxSpan, spanning } = getSpan(route.children);
  route.data.maxSpan = maxSpan === 0 ? 1 : maxSpan;
  route.data.directlySpanning = spanning;
  route.data.spanSize = getSpanSize(route.data.maxSpan);

  return route;
}

/**
 * Get the span for all the children of the route.
 * Handles the groups of children too
 * @param routes 
 * @returns 
 */
const getSpan = (routes: Route[],) => {
  let routeGroupsSpan = 0;
  let routesSpan = 0;
  let numberOfGroups = 0;
  // filter out the groups from the routes (children)
  const childrenNotGroup = routes.filter((route) => route.data.type !== 'Group')

  childrenNotGroup.forEach(route => {
    // for each route, find the groups and add their maxSpan to the routeGroupsSpan
    const routeGroups = route.children?.filter(child => child.data.type === 'Group');
    routeGroups?.forEach(group => {
      numberOfGroups++;
      routeGroupsSpan += group.data.maxSpan;
    });
    // add the maxSpan of the route to the routesSpan
    routesSpan += route.data.maxSpan;
  });

  return {
    maxSpan: routeGroupsSpan + routesSpan,
    spanning: childrenNotGroup.length + numberOfGroups,
  }
}

/**
 * calculate the span size from the max span
 * @param span 
 * @returns 
 */
const getSpanSize = (span: number) => {
  return (span * NODE_WIDTH + (span - 1) * NODE_SPACING_X);
}
