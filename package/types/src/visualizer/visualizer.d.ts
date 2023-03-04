/// <reference types="react" />
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
export declare const Visualizer: (props: VisualizerProps) => JSX.Element;
