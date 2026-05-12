import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LOLキャラタイプ診断 / LoL Character Type Quiz",
    short_name: "LOL Character Type",
    description: "Find the League of Legends champion that matches your personality and playstyle.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e1a",
    theme_color: "#0a0e1a",
    icons: [{ src: "/icon", sizes: "any", type: "image/png" }],
  };
}
