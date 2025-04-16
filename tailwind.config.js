/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				// Cores primárias (verde)
				primary: {
					DEFAULT: "#1c6e0c",
					light: "#2c8e1c",
					dark: "#165609",
				},
				// Cores secundárias (laranja)
				secondary: {
					DEFAULT: "#ed7f18",
					light: "#ff9736",
					dark: "#d16c0f",
				},
			},
		},
	},
	plugins: [],
};
