import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'header': ['Manrope', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
				'body': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
				'lato': ['Lato', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				// Brand colors
				'primary-glow': 'hsl(var(--primary-glow))',
				'primary-light': 'hsl(var(--primary-light))',
				'secondary-light': 'hsl(var(--secondary-light))',
				
				// Extended gray palette
				gray: {
					50: 'hsl(var(--gray-50))',
					100: 'hsl(var(--gray-100))',
					200: 'hsl(var(--gray-200))',
					300: 'hsl(var(--gray-300))',
					400: 'hsl(var(--gray-400))',
					500: 'hsl(var(--gray-500))',
					600: 'hsl(var(--gray-600))',
					700: 'hsl(var(--gray-700))',
					800: 'hsl(var(--gray-800))',
					900: 'hsl(var(--gray-900))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				fadeIn: {
					from: { opacity: '0', transform: 'scale(0.95)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				slideUp: {
					from: { opacity: '0', transform: 'translateY(20px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'gradient-shift': {
					'0%': { 
						opacity: '0.2'
					},
					'50%': { 
						opacity: '0.4'
					},
					'100%': { 
						opacity: '0.2'
					}
				},
				'ios-entrance': {
					"0%": { 
						opacity: "0", 
						transform: "translateY(20px) scale(0.95)" 
					},
					"80%": { 
						opacity: "1", 
						transform: "translateY(-2px) scale(1.02)" 
					},
					"100%": { 
						opacity: "1", 
						transform: "translateY(0) scale(1)" 
					}
				},
				'logo-entrance': {
					"0%": { 
						opacity: "0", 
						transform: "translateX(-50%) scale(1.2)" 
					},
					"100%": { 
						opacity: "1", 
						transform: "translateX(-50%) scale(1)" 
					}
				},
				'fade-entrance': {
					"0%": { 
						opacity: "0", 
						transform: "translateY(10px)" 
					},
					"100%": { 
						opacity: "1", 
						transform: "translateY(0)" 
					}
				},
				'gradient-flow': {
					'0%': { 
						backgroundPosition: '0% 50%, 100% 50%, 0% 100%, 100% 0%',
						backgroundSize: '120% 120%, 110% 110%, 130% 130%, 115% 115%'
					},
					'25%': { 
						backgroundPosition: '25% 25%, 75% 75%, 10% 90%, 90% 10%',
						backgroundSize: '125% 125%, 115% 115%, 125% 125%, 120% 120%'
					},
					'50%': { 
						backgroundPosition: '50% 0%, 50% 100%, 25% 75%, 75% 25%',
						backgroundSize: '130% 130%, 120% 120%, 120% 120%, 125% 125%'
					},
					'75%': { 
						backgroundPosition: '75% 75%, 25% 25%, 90% 10%, 10% 90%',
						backgroundSize: '115% 115%, 125% 125%, 135% 135%, 110% 110%'
					},
					'100%': { 
						backgroundPosition: '0% 50%, 100% 50%, 0% 100%, 100% 0%',
						backgroundSize: '120% 120%, 110% 110%, 130% 130%, 115% 115%'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.4s ease-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'gradient-shift': 'gradient-shift 15s ease-in-out infinite',
				'ios-entrance': 'ios-entrance 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
				'logo-entrance': 'logo-entrance 1s ease-out forwards',
				'fade-entrance': 'fade-entrance 0.3s ease-out forwards',
				'gradient-flow': 'gradient-flow 25s ease-in-out infinite',
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-hero': 'var(--gradient-hero)',
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'medium': 'var(--shadow-medium)',
				'strong': 'var(--shadow-strong)',
			},
			transitionTimingFunction: {
				'smooth': 'var(--transition-smooth)',
				'spring': 'var(--transition-spring)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
