module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    backgroundColor: (theme) => ({
      ...theme("colors"),
      primary: "#97E490",
      gray: "#353840",
      light: "#97A6AE",
    }),
    fontFamily: {
      sans: ["Roboto Mono", "sans-serif"],
      display: ["Roboto Mono", "sans-serif"],
      body: ["Roboto Mono", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
};
