import { Route } from "../types";
import { NODE_HEIGHT, NODE_SPACING_X, NODE_SPACING_Y, NODE_WIDTH } from "../constants";

/**
 * position the tree nodes x and y coordinates.
 * @param root 
 * @returns 
 */
export const positionTree = (root: Route) => {
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
    route.data.x =
      parentX
      - (parentSpan / 2)
      + siblingsCurrentSpan
      + (route.data.spanSize / 2)
      + (NODE_SPACING_X * currentIndex);
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