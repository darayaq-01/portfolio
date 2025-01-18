/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
	  extend: {
		colors: {
		  primary: "#167DB7",
		  accent: "#FE5230",
		  "ij-black": "#212121",
		  "ij-red": "#FF421C",
		  "ij-green": "#00A550",
		  "ij-blue": "#E8F2F8",
		  "ij-yellow": "#EFA500",
		},
		backgroundImage: {
		  "hero-pattern":
			"linear-gradient(37deg, rgba(239,68,68,1) 4%, rgba(204,196,57,1) 50%, rgba(240,240,234,1) 94%);",
		},
		borderRadius: {
		  "4xl": "3rem",
		},
		backgroundSize: {
		  "auto-height": "auto 100%",
		},
		letterSpacing: {
		  separated: "0.35px",
		},
		padding: {
		  15: "60px",
		},
		transitionDuration: {
		  DEFAULT: "500ms",
		},
		screens: {
		  xs: "480px",
		},
		gridTemplateColumns: {
		  53: "repeat(53, minmax(10px, 1fr))",
		},
		
	  },
	},
	plugins: [
	  require('@tailwindcss/typography'),
	  ({ addUtilities }) => {
		const newUtilities = {
		  ".no-scrollbar::-webkit-scrollbar": {
			display: "none",
		  },
		  ".no-scrollbar": {
			"-ms-overflow-style": "none",
			"scrollbar-width": "none",
		  },
		};
  
		addUtilities(newUtilities);
	  },
	],
  };
  