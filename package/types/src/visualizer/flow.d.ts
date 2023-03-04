/// <reference types="react" />
import { Node, Edge } from "reactflow";
import "reactflow/dist/base.css";
interface FlowProps {
    initialNodes: Node<any>[];
    initialEdges: Edge<any>[];
}
declare const Flow: (props: FlowProps) => JSX.Element;
export default Flow;
