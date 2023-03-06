import Visualizer from "../../package/src/visualizer";

const env = process.env.NODE_ENV;

export default function Home() {
  return (
    <Visualizer
      baseURL={
        env === "production"
          ? "https://next-route-visualizer.vercel.app"
          : undefined
      }
      hideColocation
    />
  );
}
