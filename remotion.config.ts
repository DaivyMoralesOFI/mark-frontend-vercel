import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";
import path from "path";

Config.overrideWebpackConfig((currentConfiguration) => {
  return enableTailwind({
    ...currentConfiguration,
    resolve: {
      ...currentConfiguration.resolve,
      alias: {
        ...(currentConfiguration.resolve?.alias ?? {}),
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
});
