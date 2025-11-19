# TapNOrder Design Tokens Reference

Quick reference guide for the design system used in TapNOrder.

## 🎨 Color Palette

### Frontend (Customer App)
```css
--primary: 25 95% 53%           /* Vibrant Orange #FF7A3D */
--primary-foreground: 0 0% 100% /* White */
--secondary: 262 83% 58%        /* Purple #A855F7 */
--accent: 142 76% 36%           /* Green #22C55E */
--background: 0 0% 99%          /* Off-white */
--foreground: 222 47% 11%       /* Dark gray */
--muted: 210 40% 96%            /* Light gray */
--destructive: 0 84% 60%        /* Red */
```

### Dashboard (Restaurant)
```css
--primary: 217 91% 60%          /* Blue #3B82F6 */
--secondary: 142 76% 36%        /* Green #22C55E */
--accent: 262 83% 58%           /* Purple #A855F7 */
--background: 220 14% 96%       /* Light gray-blue */
```

## 📐 Spacing Scale
- `xs`: 0.5rem (8px)
- `sm`: 0.75rem (12px)
- `md`: 1rem (16px)
- `lg`: 1.5rem (24px)
- `xl`: 2rem (32px)
- `2xl`: 3rem (48px)
- `3xl`: 4rem (64px)

## 🔤 Typography

### Font Sizes
- `xs`: 0.75rem (12px)
- `sm`: 0.875rem (14px)
- `base`: 1rem (16px)
- `lg`: 1.125rem (18px)
- `xl`: 1.25rem (20px)
- `2xl`: 1.5rem (24px)
- `3xl`: 1.875rem (30px)
- `4xl`: 2.25rem (36px)
- `5xl`: 3rem (48px)
- `6xl`: 3.75rem (60px)

### Font Weights
- `medium`: 500
- `semibold`: 600
- `bold`: 700
- `extrabold`: 800
- `black`: 900

## 🎭 Border Radius
- `sm`: 0.5rem (8px)
- `md`: 0.75rem (12px)
- `lg`: 1rem (16px)
- `xl`: 1.25rem (20px)
- `2xl`: 1.5rem (24px)
- `3xl`: 2rem (32px)
- `full`: 9999px (circle)

## 🌟 Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

## 🎬 Animations

### Durations
- Fast: 150ms
- Normal: 300ms
- Slow: 500ms

### Easing
- `ease-in-out`: Default
- `spring`: Framer Motion physics

### Custom Animations
```css
/* Float */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Pulse Soft */
@keyframes pulse-soft {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* Shimmer */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

## 🎨 Gradient Patterns

### Primary Gradient
```css
background: linear-gradient(135deg, #FF7A3D 0%, #FF8F5C 100%);
```

### Secondary Gradient
```css
background: linear-gradient(135deg, #A855F7 0%, #B46EF9 100%);
```

### Success Gradient
```css
background: linear-gradient(135deg, #22C55E 0%, #2DD46F 100%);
```

### Dashboard Primary
```css
background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);
```

## 🪟 Glassmorphism
```css
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

## 🎯 Component Patterns

### Button Primary
```tsx
className="bg-gradient-to-r from-orange-500 to-orange-600 text-white 
           px-8 py-4 rounded-2xl font-bold shadow-lg 
           hover:shadow-xl hover:scale-105 active:scale-95 
           transition-all duration-300"
```

### Card
```tsx
className="bg-white rounded-3xl shadow-md border border-gray-100 
           p-6 hover:shadow-xl hover:-translate-y-1 
           transition-all duration-300"
```

### Badge
```tsx
className="px-3 py-1.5 rounded-full text-xs font-bold 
           bg-gradient-to-r from-blue-100 to-blue-200 
           text-blue-800 border border-blue-300 shadow-sm"
```

### Input
```tsx
className="w-full p-4 border-2 border-gray-200 rounded-2xl 
           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
           outline-none transition-all bg-white/80 hover:bg-white"
```

## 📱 Responsive Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🎨 Status Colors

### Order Status
- **Pending**: Yellow (`#FCD34D`)
- **Accepted**: Blue (`#3B82F6`)
- **Cooking**: Orange (`#F97316`)
- **On the Way**: Purple (`#A855F7`)
- **Delivered**: Green (`#22C55E`)
- **Cancelled**: Red (`#EF4444`)

## 💡 Usage Examples

### Animated Button
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="btn-primary"
>
  Click Me
</motion.button>
```

### Card with Hover
```tsx
<div className="card-hover bg-white rounded-2xl p-6">
  Content
</div>
```

### Gradient Text
```tsx
<h1 className="bg-gradient-to-r from-orange-600 to-orange-500 
               bg-clip-text text-transparent">
  Kacchi King
</h1>
```

---

## 🔧 Utility Classes

### Custom Classes
- `.glass` - Glassmorphism effect
- `.gradient-primary` - Primary gradient background
- `.gradient-secondary` - Secondary gradient background
- `.card-hover` - Card hover animation
- `.animate-float` - Floating animation
- `.animate-pulse-soft` - Soft pulse animation
- `.no-scrollbar` - Hide scrollbar

---

**Note**: All HSL color values are used with Tailwind's `hsl()` function for consistency and easy theming.
