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
				'text-shine': {
					'0%': { 
						transform: 'translateX(-100%)',
						opacity: '0'
					},
					'50%': {
						opacity: '1'
					},
					'100%': { 
						transform: 'translateX(100%)',
						opacity: '0'
					}
				},
				// Enhanced Video Transition Keyframes
				'video-fade-out-smooth': {
					'0%': { 
						opacity: '1',
						filter: 'blur(0px) brightness(1)',
						transform: 'translate3d(0, 0, 0) scale(1)'
					},
					'30%': { 
						opacity: '0.8',
						filter: 'blur(0.5px) brightness(0.95)',
						transform: 'translate3d(0, 0, 0) scale(1.005)'
					},
					'70%': { 
						opacity: '0.3',
						filter: 'blur(1px) brightness(0.9)',
						transform: 'translate3d(0, 0, 0) scale(1.01)'
					},
					'100%': { 
						opacity: '0',
						filter: 'blur(1.5px) brightness(0.85)',
						transform: 'translate3d(0, 0, 0) scale(1.015)'
					}
				},
				'video-fade-in-smooth': {
					'0%': { 
						opacity: '0',
						filter: 'blur(1.5px) brightness(0.85)',
						transform: 'translate3d(0, 0, 0) scale(0.985)'
					},
					'30%': { 
						opacity: '0.3',
						filter: 'blur(1px) brightness(0.9)',
						transform: 'translate3d(0, 0, 0) scale(0.99)'
					},
					'70%': { 
						opacity: '0.8',
						filter: 'blur(0.5px) brightness(0.95)',
						transform: 'translate3d(0, 0, 0) scale(0.995)'
					},
					'100%': { 
						opacity: '1',
						filter: 'blur(0px) brightness(1)',
						transform: 'translate3d(0, 0, 0) scale(1)'
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
				'iosBottomSheetEnter': {
					"0%": {
						transform: "translateY(100%) scale(0.97)",
						opacity: "0"
					},
					"60%": {
						transform: "translateY(-2%) scale(0.99)",
						opacity: "0.9"
					},
					"100%": {
						transform: "translateY(0%) scale(1)",
						opacity: "1"
					}
				},
				'iosBottomSheetExit': {
					"0%": {
						transform: "translateY(0%) scale(1)",
						opacity: "1"
					},
					"100%": {
						transform: "translateY(100%) scale(0.97)",
						opacity: "0"
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
						backgroundPosition: '15% 15%, 85% 15%, 85% 85%, 15% 85%',
						backgroundSize: '140% 140%, 130% 130%, 150% 150%, 135% 135%'
					},
					'25%': { 
						backgroundPosition: '35% 5%, 95% 35%, 75% 95%, 5% 75%',
						backgroundSize: '160% 160%, 145% 145%, 140% 140%, 155% 155%'
					},
					'50%': { 
						backgroundPosition: '25% 25%, 75% 5%, 95% 75%, 5% 95%',
						backgroundSize: '150% 150%, 160% 160%, 130% 130%, 145% 145%'
					},
					'75%': { 
						backgroundPosition: '5% 35%, 65% 25%, 85% 65%, 25% 85%',
						backgroundSize: '135% 135%, 140% 140%, 165% 165%, 130% 130%'
					},
					'100%': { 
						backgroundPosition: '15% 15%, 85% 15%, 85% 85%, 15% 85%',
						backgroundSize: '140% 140%, 130% 130%, 150% 150%, 135% 135%'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'text-shine': 'text-shine 0.5s ease-out forwards',
				'fade-in': 'fadeIn 0.4s ease-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'gradient-shift': 'gradient-shift 15s ease-in-out infinite',
				'ios-entrance': 'ios-entrance 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
				'logo-entrance': 'logo-entrance 1s ease-out forwards',
				'fade-entrance': 'fade-entrance 0.3s ease-out forwards',
				'gradient-flow': 'gradient-flow 20s ease-in-out infinite',
				'ios-bottom-sheet-enter': 'iosBottomSheetEnter 0.4s cubic-bezier(0.2, 0.0, 0, 1.0) forwards',
				'ios-bottom-sheet-exit': 'iosBottomSheetExit 0.35s cubic-bezier(0.4, 0.0, 1, 1.0) forwards',
				// Enhanced Video Transitions with Staggered Timing
				'video-fade-out-smooth': 'video-fade-out-smooth 750ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
				'video-fade-in-smooth': 'video-fade-in-smooth 750ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
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
				'video-crossfade': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'video-blend': 'cubic-bezier(0.23, 1, 0.32, 1)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
