/** @type {import('tailwindcss').Config} */
module.exports = {
	corePlugins: {
		preflight: false,
	},
	content: ["./src/**/*.{vue,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#121212",
				secondary: "#d9f9a5",
				third: "#d2d68d",
				fourth: "#81726a",
				fifth: "#ffffff",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
