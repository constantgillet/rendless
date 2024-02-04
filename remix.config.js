/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  postcss: true,
  serverModuleFormat: "esm",
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  serverDependenciesToBundle: ["@radix-ui/themes", "oslo"],
};
