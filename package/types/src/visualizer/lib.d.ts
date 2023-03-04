import type { Route } from './types';
/**
 * Get the routes from a path. If no path is provided, it will try to find the app directory
 * @param path - path to get routes from
 * @returns
 */
export declare const getRoutes: (path?: string, baseURL?: string) => Route;
/**
 * Get all routes from a path recursively
 * @param path
 * @return route
 */
export declare const getRoutesHelper: (path: string, link: string, depth?: number, parentID?: string) => Route;
/**
 * Is the path a directory
 * @param path
 * @returns boolean
 */
export declare const isDirectory: (path: string) => boolean;
/**
 * Is the path an allowed file
 * @param path
 * @returns boolean
 */
export declare const isAllowedFile: (path: string) => boolean;
/**
 * Create the nodes and edges for the react flow component
 * @param route
 * @returns
 */
export declare const createNodesAndEdges: (route: Route) => {
    nodes: {
        id: string;
        data: {
            name: string;
            path: string;
            link: string;
            parentID: string;
            type: string;
            color: string;
            borderColor: string;
            childrenID: string[];
            includedFiles: {
                [key: string]: boolean;
            };
        };
        type: string;
        position: {
            x: number;
            y: number;
        };
        deleteable: boolean;
        draggable: boolean;
        style: {
            width: number;
            height: number;
            backgroundColor: string;
            border: string;
            borderRadius: number;
            borderColor: string;
            display: string;
        };
    }[];
    edges: any;
};
