module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sand: "quicksand",
        tweb: "Titillium Web",
        inter: "Inter",
        barlow: "Barlow",
        roboto: "Roboto",
      },
      height: {
        100: "500px",
        "1p": "1px",
      },
      width: {
        100: "400px",
        200: "500px",
        300: "600px",
        400: "700px",
      },
      zIndex: {
        max: "2147483647 ",
      },
    },
  },
  variants: {
    extend: {},
  },
  // eslint-disable-next-line global-require
  plugins: [require("daisyui")],
};
