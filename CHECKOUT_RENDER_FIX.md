# Checkout Page Render Error Fix

## Issue
React error: "Cannot update a component (`Router`) while rendering a different component (`CheckoutPage`)"

## Root Cause
The checkout page was calling `router.push("/menu")` directly during the render phase (lines 22-24):

```typescript
// ❌ WRONG - Calling router.push during render
if (items.length === 0) {
    router.push("/menu");  // This causes the error
    return null;
}
```

**Why this is wrong:**
- React's render phase must be pure (no side effects)
- Navigation is a side effect
- Side effects must be in `useEffect` or event handlers
- Calling `router.push()` during render violates React's rules

## Solution Applied

Moved the redirect logic to `useEffect`:

```typescript
// ✅ CORRECT - Navigation in useEffect
useEffect(() => {
    if (items.length === 0) {
        router.push("/menu");
    }
}, [items.length, router]);

// Show loading while redirecting
if (items.length === 0) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
    );
}
```

## Changes Made

### File: `frontend/app/checkout/page.tsx`

1. **Added useEffect import**:
   ```typescript
   import { useState, useEffect } from "react";
   ```

2. **Moved redirect to useEffect**:
   ```typescript
   useEffect(() => {
       if (items.length === 0) {
           router.push("/menu");
       }
   }, [items.length, router]);
   ```

3. **Added loading state**:
   ```typescript
   if (items.length === 0) {
       return (
           <div className="min-h-screen flex items-center justify-center">
               <Loader2 className="animate-spin text-blue-500" size={32} />
           </div>
       );
   }
   ```

## Why This Works

### Before (Broken)
```
1. Component renders
2. During render: router.push() called ❌
3. React error: "Cannot update component during render"
```

### After (Fixed)
```
1. Component renders with loading state
2. useEffect runs after render
3. Navigation happens in effect ✅
4. Clean transition to menu page
```

## React Rules Followed

1. **Pure Render**: Render phase has no side effects
2. **Effects for Side Effects**: Navigation happens in useEffect
3. **Proper Dependencies**: useEffect depends on items.length and router
4. **Loading State**: User sees feedback during transition

## Testing

### Test Empty Cart Redirect
```bash
# 1. Open checkout with empty cart
open http://localhost:3000/checkout

# 2. Should see loading spinner briefly
# 3. Should redirect to /menu
# 4. No console errors
```

### Test Normal Checkout
```bash
# 1. Add items to cart
# 2. Go to checkout
# 3. Should see checkout form
# 4. Should be able to submit order
```

## Related Best Practices

### ✅ DO
- Use `useEffect` for navigation
- Use `useEffect` for side effects
- Show loading states during transitions
- Keep render phase pure

### ❌ DON'T
- Call `router.push()` during render
- Call `setState()` during render
- Make API calls during render
- Perform side effects during render

## Similar Patterns to Watch For

```typescript
// ❌ WRONG - All of these are render-time side effects
if (condition) {
    router.push("/somewhere");  // Navigation
    setState(value);            // State update
    localStorage.setItem();     // Storage
    fetch("/api");              // API call
}

// ✅ CORRECT - Use useEffect
useEffect(() => {
    if (condition) {
        router.push("/somewhere");
        setState(value);
        localStorage.setItem();
        fetch("/api");
    }
}, [condition]);
```

## Additional Notes

- This is a common React mistake
- Next.js router must be used in effects or handlers
- Always check for render-time side effects
- Use ESLint rules to catch these issues

---

**Status**: ✅ Fixed
**Date**: November 19, 2025
**Impact**: Resolves React render error in checkout page
