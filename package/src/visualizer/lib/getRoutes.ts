import fs from 'fs';
import { createHash } from "crypto";
import { FALLBACK_BASE_URL, NODE_WIDTH } from "../constants";
import { Route, RouteData, File } from "../types";
import {
  getFileNameExtension,
  isClientSide,
  isColocating,
  isDirectory,
  isNextFile,
  isRouteGroup,
  isRouteSegment,
  pathFromRoot,
  setRouteSpans
} from '../utils'

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
const getRoutesHelper = (path: string, link: string, depth: number = 0, parentID?: string) => {
  try {
    // Get all elements in the path and split them into folders and files
    const elements = fs.readdirSync(path);
    const [folders, nextFiles, otherFiles] = elements.reduce(
      (acc, element) => {
        const fullPath = `${path}/${element}`;
        if (isDirectory(fullPath)) {
          acc[0].push(element);
          return acc;
        }
        const isClient = isClientSide(fullPath);
        if (isNextFile(fullPath)) {
          acc[1].push({ ...getFileNameExtension(element), path: fullPath, isClient: isClient });
          return acc;
        }
        acc[2].push({ ...getFileNameExtension(element), path: fullPath, isClient: isClient, });
        return acc;
      },
      [[], [], []] as [string[], File[], File[]]
    );

    const isGroup = isRouteGroup(path)
    // if the path is a route group, the link should be the parent link
    if (isGroup) link = link.split('/').slice(0, -1).join('/')

    const isSegment = isRouteSegment(path)
    // if the path is a route segment, the link should be the parent link + a star
    if (isSegment) link = `${link.split('/').slice(0, -1).join('/')}/*`

    // create route data
    const routeID = createHash('sha256').update(path).digest('hex');
    const routeName = path.split('/')?.pop() ?? path;
    if (isGroup) depth = depth - 1;

    const data: RouteData = {
      id: routeID,
      name: routeName,
      path,
      link,
      depth,
      type: parentID === undefined ? 'Root' : isGroup ? 'Group' : isSegment ? 'Segment' : 'Route', // check Colocating later
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

    // create route
    let route: Route = {
      data,
      children,
    };

    // check colocating and set spans. Do this here to avoid traversing the tree later. 
    route = isColocating(route);
    route = setRouteSpans(route);

    return route;
  } catch (error: any) {
    throw new Error(`Path: ${path} is not a valid path \n${error}`);
  }
};