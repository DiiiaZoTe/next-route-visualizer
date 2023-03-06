<div align="center">
  <h1>next-route-visualizer</h1>
  <p>A package for visualizing Next.js app directory routes.</p>
  <a href="https://next-route-visualizer.vercel.app">
    <b>Demo website</b>
  </a>
</div>

---
**Next Route Visualizer** is designed to display the routes for the app directory of Next.js (starting at version 13) in a visual tree-like fashion.
This package aims to help developers better understand the routes in their Next.js app directory by providing a clear visual representation of the routes and their relationships.

This package can be useful if you are new to the app directory and need to visualize it.

<div align="center">
  <img src="https://next-route-visualizer.vercel.app/next-route-visualizer-preview.png" alt="Preview Next Route Visualizer" width="600"/>
</div>

---
## Usage

### Installation

You can install **`next-route-visualizer`** using npm:

```
npm install next-route-visualizer
```

### Importing

Once you've installed the package, you can import the **`Visualizer`** component into any page of your Next.js version 13 app directory.
For ease of use just import it in the root page for instance:


```jsx
import Visualizer from 'next-route-visualizer';

export default function Home() {
  return (
    <Visualizer />
  )
}
```

That's it! The **`Visualizer`** component will render a tree chart that displays the routes of your Next.js app directory.

### Visualizer props

| Prop name         | Type                 | Description
| ----------------- | -------------------- | ------------
| path              | String or undefined  |  <p>Path to the starting route (relative to the app directory).<br/>If not provided, the component will search for the app directory within the root folder or .src/ folder.</p>
| baseURL           | String or undefined  | <p>Base URL of your project.<br/>Default: http://localhost:3000</p>
| displayColocation | Boolean or undefined | <p>Display colocating folders<br/>Default: false</p>

---
## Example

The below example shows how to use the `path` and `baseURL` parameters.

```jsx
import Visualizer from 'next-route-visualizer';

export default function Home() {
  return (
    <Visualizer path="blog" baseURL="https://example.com" displayColocation/>
  )
}
```
Only the sub-routes of `blog` (blog included) will be displayed on the chart. This assumes that `blog` is a direct sub-route of the app root (i.e ./app/blog in your file system).

Since `displayColocation` was also provided, all the colocating files and folders will also be included on the chart.

---
## Features
Under the hood, **next-route-visualizer** utilizes **[ReactFlow](https://reactflow.dev/)** to build the chart.

- Starting route: You can start displaying at any route of your project.
- Side dashboard: Display information about a route
  - Name
  - Link
  - Path
  - Type
  - Next.js files
- Route selection: Select a Route from the chart to see its information
- Node type colors: The nodes in the chart have different colors based on the type of route:
  - Root: Entry point
  - Route: A normal route
  - Route group: folder that are marked in parenthesis e.g. (routeGroup)
  - Route segment: all the various slug options e.g
    - [slug]
    - [...slug]
    - [[...slug]]
- Preview the Next.js files included in the route with the following icons (files extensions: [.js, .jsx, .ts, .tsx])
  - <svg width="24" height="24" fill="grey" viewBox="0 0 16 16">
      <path d="M8.188 10H7V6.5h1.188a1.75 1.75 0 1 1 0 3.5z" />
      <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM7 5.5a1 1 0 0 0-1 1V13a.5.5 0 0 0 1 0v-2h1.188a2.75 2.75 0 0 0 0-5.5H7z" />
    </svg> for <b>page</b>
  - <svg width="24" height="24" fill="grey" viewBox="0 0 16 16">
      <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM5.884 6.68 8 9.219l2.116-2.54a.5.5 0 1 1 .768.641L8.651 10l2.233 2.68a.5.5 0 0 1-.768.64L8 10.781l-2.116 2.54a.5.5 0 0 1-.768-.641L7.349 10 5.116 7.32a.5.5 0 1 1 .768-.64z" />
    </svg> for <b>error</b> or <b>not-found</b>
  - <svg width="24" height="24" fill="grey" viewBox="0 0 16 16">
      <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM5.057 6h5.886L11 8h-.5c-.18-1.096-.356-1.192-1.694-1.235l-.298-.01v5.09c0 .47.1.582.903.655v.5H6.59v-.5c.799-.073.898-.184.898-.654V6.755l-.293.01C5.856 6.808 5.68 6.905 5.5 8H5l.057-2z" />
    </svg> for <b>layout</b> or <b>template</b>
  - <svg width="24" height="24" fill="grey" viewBox="0 0 16 16">
      <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-3 2v.634l.549-.317a.5.5 0 1 1 .5.866L7 7l.549.317a.5.5 0 1 1-.5.866L6.5 7.866V8.5a.5.5 0 0 1-1 0v-.634l-.549.317a.5.5 0 1 1-.5-.866L5 7l-.549-.317a.5.5 0 0 1 .5-.866l.549.317V5.5a.5.5 0 1 1 1 0zm-2 4.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zm0 2h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1z" />
    </svg> for <b>route</b>
  - <svg width="24" height="24" fill="grey" viewBox="0 0 16 16">
      <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-1 4v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 11.293V7.5a.5.5 0 0 1 1 0z" />
    </svg> for <b>loading</b>
- Display the colocating files and folders

---
## Limitations
In order for the component to work properly, the routes need to be retrievef server side, and rendered on the client using ReactFlow.

For that reason, **you must refresh the page** to see any changes that you applied to your routes, for them to take effect on the chart.

---
## Future work
This is only side project. The code is definitely a mess and I was too lazy to provide testing for it. I may be open to make a few changes on my free time if I feel like it.

On that note, please feel free to use and make any changes that you wish to include.

---
## Dependencies
- Next >= 13.2.3
- ReactFlow >= 11.5.6

Note: I didn't use tailwind or any other packages for the styles.

## License

Next Router Visualizer is ISC licensed.

<a href="https://www.buymeacoffee.com/alexvencel" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="60" /></a>
