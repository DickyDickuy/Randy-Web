# Mobile Layout Design Critique Snapshot

Target: `app/page.tsx` (Mobile Layout)

### Report Header
`⚠️ DEGRADED: single-context (no sub-agent tool exposed)`

### Design Health Score (Nielsen's 10 Heuristics)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Mobile WebGL canvas lacks touch gesture affordance/hint |
| 2 | Match System / Real World | 3 | Clear tone, but timestamp "-Randy, 2025" feels slightly static |
| 3 | User Control and Freedom | 2 | No mobile menu panel opens when tapping MENU button |
| 4 | Consistency and Standards | 2 | Hero uses `h-screen` & `w-screen` instead of mobile-safe `h-dvh` & `w-full` |
| 5 | Error Prevention | 3 | Basic form validation present, tap targets tight |
| 6 | Recognition Rather Than Recall | 3 | Clean 1-column stack, but no sticky mobile nav or progress |
| 7 | Flexibility and Efficiency | n/a | Persuade / Experience portfolio surface |
| 8 | Aesthetic and Minimalist Design | 3 | Strong visual contrast, but high text density in mobile stack |
| 9 | Error Recovery | 2 | Standard input error state handling |
| 10 | Help and Documentation | n/a | Persuade / Experience portfolio surface |
| **Total** | | **20/32** | **Acceptable** |

### Design Specificity Verdict

**LLM assessment**: The desktop design features a bold pixelated WebGL reveal and 50:50 split-screen sections. However, on mobile viewports (<1024px), the implementation falls back to generic linear stacking without dedicated mobile micro-interactions, mobile navigation drawer, or touch affordances. Using `w-screen` and `h-screen` in `Hero.tsx` causes mobile Safari browser bar jitter and horizontal overflow on iOS.

**Deterministic scan**: `detect.mjs` identified 3 warnings across files:
- `app/globals.css`: Overused font (`Inter`)
- `components/ui/LogoMarquee.tsx`: AI color palette (`text-purple-200`)
- `components/ui/TeamPortraitGrid.tsx`: AI color palette (`from-purple-500` gradient)

### Overall Impression
The desktop experience has strong creative energy, but the mobile layout feels like a raw collapse rather than an intentionally crafted mobile experience. Touch-target sizes, viewport units (`h-screen` vs `h-dvh`), and thumb-zone ergonomics need attention.

### What's Working
1. Clean 1-column collapse via Tailwind's `grid-cols-1 lg:grid-cols-2`.
2. Clean removal of GSAP pinning on mobile via `gsap.matchMedia('(min-width: 1024px)', ...)` preventing layout jumps.
3. Distinct full-width background color banding on mobile scroll.

### Priority Issues

- **[P0] Viewport Units & Safari Jitter in Hero**: `Hero.tsx` uses `w-screen h-screen` instead of `w-full h-dvh`. On mobile iOS Safari, dynamic browser URL bar show/hide causes vertical jump and horizontal scrollbar overflow.
  - *Why it matters*: Ruins hero presentation and causes jerky scrolling on mobile.
  - *Fix*: Replace `w-screen h-screen` with `w-full h-dvh` and ensure root container handles `overflow-x-hidden`.
  - *Suggested command*: `/impeccable adapt app/page.tsx`

- **[P1] Touch Target & Thumb Zone Ergonomics**: Mobile header MENU button and social links (`LINKEDIN / INSTAGRAM`) have tight tap targets (<44px) and are placed at the absolute top/bottom edges out of comfortable thumb reach.
  - *Why it matters*: Hard to tap on smaller mobile screens, frustrating mobile visitors.
  - *Fix*: Increase tap targets to minimum 44×44px with padding and position key mobile CTAs within comfortable thumb zone.
  - *Suggested command*: `/impeccable adapt components/Hero.tsx`

- **[P1] Mobile Navigation Drawer Missing**: Tapping "MENU" on mobile does not open a navigation overlay or drawer to jump to page sections.
  - *Why it matters*: Forces mobile users to scroll through long stacked sections without an easy way to jump to "Meet The Team" or "Contact".
  - *Fix*: Implement a clean full-screen mobile menu drawer with smooth section scroll links.
  - *Suggested command*: `/impeccable harden components/Hero.tsx`

- **[P2] High Visual Density & Padding in Mobile Stack**: In sections like `BespokeServices` and `MeetTheTeam`, content blocks stack vertically on mobile with high text density and default padding, making long scrolls fatigue-inducing.
  - *Why it matters*: High cognitive load for mobile visitors looking for quick executive overview.
  - *Fix*: Optimize mobile vertical spacing (`py-12 px-6`), typography scale, and add subtle scroll stagger reveals.
  - *Suggested command*: `/impeccable layout components/sections/BespokeServices.tsx`

### Persona Red Flags

**Casey (Distracted Mobile User)**: Hero section uses `h-screen` which resizes awkwardly when Safari's URL bar collapses. Tap target for "LET'S COLLABORATE" button is small on 375px screens. No mobile menu to jump straight to Contact.

**Jordan (First-Timer)**: On touch devices, the 3D WebGL pixel reveal in the hero has no visual indicator or "Swipe/Touch to reveal" hint, leaving first-timers unaware that the background is interactive.

**Executive Client Persona (CEO / Enterprise Client)**: Mobile view presents long, dense text blocks without a quick executive summary or floating sticky call-to-action to book a consult with CEO Randy.

### Minor Observations
- `Inter` font warning from detector in `globals.css`—could upgrade to a more bespoke typography pairing for a CEO agency site.
- `LogoMarquee` uses AI purple gradient fallback classes.

### Questions to Consider
- "Should we add a sticky floating 'Get in Touch' button for mobile visitors as they scroll down?"
- "Would a full-screen mobile menu drawer with quick jump anchors make executive navigation much faster?"
