/** @type {import('tailwindcss').Config} */

export default {
    darkMode: ["class"],
    content: [
        "./apps/web/src/app/**/*.{js,jsx,ts,tsx}",
        "./libs/**/*.{js,jsx,ts,tsx}",
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
            colors: {
                border: {
                    DEFAULT: 'hsl(var(--border))'
                },
                input: {
                    DEFAULT: 'hsl(var(--input))'
                },
                ring: {
                    DEFAULT: 'hsl(var(--ring))'
                },
                background: {
                    DEFAULT: 'hsl(var(--background))'
                },
                foreground: {
                    DEFAULT: 'hsl(var(--foreground))'
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
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            }
        }
    },
    plugins: [
        require("tailwindcss-animate"),
        // Add compatibility plugin for Tailwind v4
        function({ addUtilities, theme }) {
            const colorUtilities = {};
            const colors = theme('colors');

            // Create backwards-compatible utility classes
            Object.entries(colors).forEach(([colorName, value]) => {
                if (typeof value === 'object' && value.DEFAULT) {
                    // For colors with DEFAULT value
                    colorUtilities[`.bg-${colorName}`] = {
                        'background-color': value.DEFAULT
                    };
                    colorUtilities[`.text-${colorName}`] = {
                        'color': value.DEFAULT
                    };
                    colorUtilities[`.border-${colorName}`] = {
                        'border-color': value.DEFAULT
                    };

                    // For nested values
                    Object.entries(value).forEach(([shade, shadeValue]) => {
                        if (shade !== 'DEFAULT') {
                            colorUtilities[`.bg-${colorName}-${shade}`] = {
                                'background-color': shadeValue
                            };
                            colorUtilities[`.text-${colorName}-${shade}`] = {
                                'color': shadeValue
                            };
                            colorUtilities[`.border-${colorName}-${shade}`] = {
                                'border-color': shadeValue
                            };
                        }
                    });
                }
            });

            addUtilities(colorUtilities);
        }
    ],
}  ;
