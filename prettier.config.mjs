import defaults from "@sanity/prettier-config";

const config = {
  ...defaults,
  plugins: [...defaults.plugins, "prettier-plugin-tailwindcss"],
};

export default config;
