# MASTER PROMPT — Creative Agency Clone: Content Sections (Post-Hero)

> **Scope:** Everything BELOW the Hero. The Hero section is already built and must never be regenerated or modified by any prompt derived from this document.
> **Purpose:** This is a reference document, not a one-shot code request. Feed it to your AI coding agent one section at a time using the templates in §7. The agent should treat every rule below as non-negotiable unless you explicitly override it in a specific request.

---

## 1. Agent Persona & Operating Rules

When this document is provided to an AI coding agent, the agent should operate under these rules:

1. **Role:** Act as a Senior Frontend Engineer specializing in scroll-driven, animation-heavy marketing sites (GSAP + ScrollTrigger production work), not a generic React tutorial writer.
2. **Generate one section/component at a time.** Never dump all five sections in a single response unless explicitly asked to.
3. **Never silently deviate** from the tech stack, layout system, or iOS safeguards below. If a request conflicts with this document, flag the conflict before writing code.
4. **Always output production-ready TypeScript**, typed props, no `any`, no placeholder `TODO` logic left unresolved.
5. **Assume the Hero section already owns** the Lenis instance and root GSAP/ScrollTrigger registration *unless* this is the first section being generated — in that case, the agent should scaffold the shared providers described in §3.6 and note that the Hero must be wired into them too.

---

## 2. Tech Stack Manifest

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) or Vite + React | Confirm which before first generation — the pinning/provider wiring differs slightly (`app/layout.tsx` vs `main.tsx`). Default assumption below is **Next.js App Router + TypeScript**. |
| Styling | Tailwind CSS | Utility-first; no CSS Modules/SCSS for this project unless a component needs a keyframe animation Tailwind can't express cleanly. |
| Animation | GSAP + ScrollTrigger | No Framer Motion. No `position: sticky` for the split-screen pin — see §3.5. |
| Smooth scroll | Lenis (Studio Freight / `lenis` npm package) | See §3.6 for sync wiring. |
| Language | TypeScript, strict mode | |

---

## 3. Global Layout System: "Split-to-Stack"

This is the single most important architectural rule in this document. Every content section below the Hero (except Contact) follows it.

### 3.1 Concept
Each section is logically two blocks of content — a "Left" block and a "Right" block — each with **its own background color**. On desktop they sit side-by-side as a pinned 50:50 split. On mobile the split is fully disabled and they become two full-width stacked blocks, Left on top, Right below, each keeping its own background so the page reads as a sequence of distinct color bands while scrolling.

### 3.2 Desktop Behavior (≥1024px)
- Two-column CSS Grid, `grid-template-columns: 1fr 1fr`.
- **Left column is pinned** via GSAP ScrollTrigger for the duration that the Right column's content scrolls past it.
- Pin is scoped **per-section** — each section pins independently against its own Right column height. Never use one global pin for the whole page; that causes cross-section bleed and broken end-triggers.
- The pin releases exactly when the Right column's content is exhausted (`endTrigger` = the Right column of that same section).

### 3.3 Mobile Behavior (<1024px)
- Grid collapses to a single column (`grid-template-columns: 1fr` or just remove the grid, use `flex flex-col`).
- **No pinning at all.** The ScrollTrigger instance responsible for pinning must not exist below the breakpoint — see §3.5, this is handled via `gsap.matchMedia()`, not just a visual CSS override, because a pin that's visually hidden but still active will still hijack scroll/layout math.
- DOM order = visual order on mobile: Left block first, Right block second. If your JSX currently has Right before Left for some visual/desktop reason, use CSS `order` only within the desktop grid — never rely on `order` to fix mobile, structure the DOM so mobile's natural top-to-bottom order is already correct.

### 3.4 Reusable Primitive: `<SplitScreenSection />`
Don't hand-roll the pin logic four separate times (Who We Are, Bespoke Dev Services, About, Team). Build one shared layout primitive and have each section compose it:

```tsx
// components/layout/SplitScreenSection.tsx
interface SplitScreenSectionProps {
  id: string;
  leftBg: string;   // tailwind class, e.g. "bg-yellow-400"
  rightBg: string;
  left: React.ReactNode;
  right: React.ReactNode;
  pinLeft?: boolean; // default true; set false for a section that shouldn't pin
}
```

The component owns: the grid/stack markup, the `data-*` attributes ScrollTrigger needs to find its trigger/endTrigger elements, and nothing else. Content (headings, images, copy) is passed in as children from each specific section component — keeps this primitive dumb and reusable.

### 3.5 GSAP `matchMedia` Pinning Pattern (reference)

This is the correct idiomatic way to make pinning conditional and responsive-safe — it auto-cleans-up when the breakpoint crosses, which plain `window.innerWidth` checks in `useEffect` do not handle well on resize/orientation change.

```ts
const mm = gsap.matchMedia();

mm.add("(min-width: 1024px)", () => {
  const pin = ScrollTrigger.create({
    trigger: leftRef.current,
    start: "top top",
    endTrigger: rightRef.current,
    end: "bottom bottom",
    pin: true,
    pinSpacing: false,
  });

  // returning a cleanup fn is required — matchMedia calls it
  // automatically when the media query stops matching
  return () => pin.kill();
});

// on unmount:
return () => mm.revert();
```

Each `SplitScreenSection` instance should create and own its own `matchMedia` context, scoped with refs local to that section — not a single shared instance for the whole page.

### 3.6 Lenis + ScrollTrigger Sync (root-level, set up once)

```ts
// app/providers/SmoothScrollProvider.tsx
const lenis = new Lenis({
  // do NOT enable syncTouch / smoothTouch — leave touch on native
  // iOS rubber-band scrolling, per §4 rule 3
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

> **Version check:** Lenis's touch API has changed across major versions (older releases used a boolean `smoothTouch`; newer 1.x releases use an opt-in `syncTouch`, defaulted off). Whoever generates this provider should check the installed `lenis` version and use whichever option name applies — the *behavior* required (native touch scroll preserved, no forced smoothing on touch) is the fixed rule, not the exact option name.

---

## 4. iOS / Safari Safeguard Checklist (MANDATORY — verify against every generated component)

1. **Never `100vh`.** Always `100dvh` for any pinned/full-height column. If you need a fallback for older browsers, use `@supports (height: 100dvh)`.
2. **`ScrollTrigger.config({ ignoreMobileResize: true })`** — set exactly once, globally, in the root smooth-scroll/GSAP provider (§3.6). Do not repeat this per-component.
3. **Lenis stays off smooth-touch.** Native rubber-band scrolling must be preserved on touch devices — see version note in §3.6.
4. **`overflow-x: hidden` is scoped to the outermost page wrapper only.** Never apply it to a section that contains a pinned column's trigger/endTrigger ancestry — it creates a new containing block that breaks ScrollTrigger's pin math on Safari specifically.
5. **Call `ScrollTrigger.refresh()` after images load**, not just on mount. Late-loading images (especially the collage in §5.2 and the portrait grid in §5.4) shift layout height *after* ScrollTrigger has already measured pin start/end distances — if you don't refresh post-load, the pin will release early or late on first paint. Use `next/image` with explicit `width`/`height` (or `fill` + a sized parent) to minimize this, and still refresh defensively.

---

## 5. Section Specifications

### 5.1 Who We Are
| | Desktop Left (pinned) | Desktop Right (scrolls) |
|---|---|---|
| Background | Yellow | Yellow (same — this section doesn't split color) |
| Content | Giant heading + 3D graphic | Paragraph copy |

Mobile stack order: heading/graphic block → paragraph block. Single background, so this section is really about the pin/scroll choreography rather than a color transition — confirm with the agent whether "3D graphic" means a `<canvas>`/Three.js element or a static illustration before generating, since that changes the component's dependency list.

### 5.2 Bespoke Development Services
| | Desktop Left (pinned) | Desktop Right (scrolls) |
|---|---|---|
| Background | Dark | White |
| Content | "Bespoke Development Services" heading in bright yellow-green + image collage | List of services (AR, VR, Native Mobile Apps, Interactive Installations, Mini Games, AI Integration, 360° Tours), large vertical gaps between items |

Mobile stack order: dark block (heading + collage) → white block (service list).
Optional enhancement (confirm before building): stagger-reveal each service list item on scroll into view, since the brief calls out large gaps between items — this reads well with a simple opacity/translateY GSAP stagger, but it's an addition beyond the literal spec, not a requirement.

### 5.3 About Cheese & Pixels
| | Desktop Left (pinned) | Desktop Right (scrolls) |
|---|---|---|
| Background | Purple | White |
| Content | "About Cheese & Pixels" giant heading + client logo grid/carousel | Descriptive paragraphs |

Mobile stack order: purple block on top, white block below (note in your brief: desktop left/right mapping may visually reverse, but the mobile stacking order — purple first — is the fixed requirement).
Client logo treatment: if it should loop infinitely (marquee-style), duplicate the logo list in the DOM and animate via `translateX` `@keyframes` or a GSAP infinite timeline with `overflow: hidden` on the track — don't rely on a discrete carousel library unless one is already in the project's dependencies.

### 5.4 Meet The Team
| | Desktop Left (pinned) | Desktop Right (scrolls) |
|---|---|---|
| Background | Cyan/Blue | White |
| Content | "Meet The Team" heading + portrait image grid | Team member descriptions |

**Assumption flagged:** the brief says "4x4 portrait images" but only 4 team members are listed elsewhere in this project's content (Ben, Jamie, Andy, Marcell). Confirm whether this means a literal 4×4 (16-image) grid, or a 2×2 grid of the 4 members — generating against the wrong assumption here wastes a full round-trip, so resolve this explicitly in the section-request prompt (see §7 template) rather than letting the agent guess.

### 5.5 Get In Touch (Contact) — not a split section
Full-width, dark background. This section does **not** use `<SplitScreenSection />` — it's a standalone form section.

**Desktop:** 2-column CSS Grid. Row 1 is split (Full Name / Company Name side by side). All subsequent fields (Email, Message) span the full 2-column width. Submit button full width or right-aligned — confirm preference when generating.

**Mobile:** strict single column, all fields stacked in this order: Full Name → Company Name → Email → Message (textarea) → Submit button.

**Honeypot field (spam protection) — implementation rule:**
Do not use `display: none` or `visibility: hidden` for the honeypot input — sufficiently modern spam bots skip fields hidden that way. Instead:
- Position it off-screen (`position: absolute; left: -9999px` or a Tailwind sr-only-style utility that still keeps the field in the accessibility tree removed via `aria-hidden="true"` and `tabIndex={-1}`)
- Add `autoComplete="off"` and a name a bot is likely to auto-fill, e.g. `name="website"` or `name="company_url"`
- On submit, reject silently (fake success) if the honeypot has any value — never tell the bot it was caught.

---

## 6. Component & File Naming Conventions

```
components/
  layout/
    SplitScreenSection.tsx        # shared pin/stack primitive, §3.4
    SmoothScrollProvider.tsx      # Lenis + ScrollTrigger sync, §3.6
  sections/
    WhoWeAre.tsx
    BespokeServices.tsx
    AboutCheeseAndPixels.tsx
    MeetTheTeam.tsx
    ContactSection.tsx
  ui/
    HoneypotField.tsx
    ServiceListItem.tsx
    LogoMarquee.tsx
    TeamPortraitGrid.tsx
```

Each section component's prop contract should be minimal and content-driven (headings/copy/image sources passed as props or imported from a local `content.ts`), not hardcoded — this keeps the section swappable/testable in isolation, consistent with how `SplitScreenSection` itself stays dumb.

---

## 7. Step-by-Step Generation Workflow

Don't request all sections at once. Use one message per section, referencing this document explicitly so the agent doesn't have to re-derive the rules:

```
Generate the code for Section 5.2 — Bespoke Development Services —
following masterprompt-agency-clone-sections.md, specifically:
§3 (Split-to-Stack layout, using <SplitScreenSection />)
§4 (iOS safeguards — apply all 5)
§5.2 (content/background spec)

Confirm assumption: [answer the flagged assumption if this section has one]
Output: components/sections/BespokeServices.tsx + any new files under components/ui/ it needs.
```

Recommended build order (dependency-first):
1. `SmoothScrollProvider.tsx` + `SplitScreenSection.tsx` (§3.4–3.6) — everything else depends on these.
2. `WhoWeAre.tsx` — simplest section, validates the pin pattern works end-to-end.
3. `BespokeServices.tsx`
4. `AboutCheeseAndPixels.tsx`
5. `MeetTheTeam.tsx` — resolve the 4×4 assumption (§5.4) before requesting this one.
6. `ContactSection.tsx` — standalone, no pin logic, can technically be built in parallel with 2–5.

---

## 8. QA / Acceptance Checklist (per section, before marking it done)

- [ ] Pin engages and releases cleanly at the exact top/bottom of the Right column at ≥1024px.
- [ ] At <1024px, no ScrollTrigger pin instance exists at all (check via `ScrollTrigger.getAll()` in devtools console — should be empty for this section below the breakpoint).
- [ ] Resizing the window across the 1024px boundary (no reload) correctly creates/destroys the pin without jump or duplicate instances.
- [ ] Tested on a real iOS Safari device (not just Chrome's device-toolbar emulation) — address bar show/hide does not shift the pinned column.
- [ ] `ScrollTrigger.refresh()` confirmed to fire after all images in the section finish loading.
- [ ] Honeypot field is invisible to sighted users, present in DOM, not reachable by Tab key.
- [ ] Mobile DOM order matches the visual order with no reliance on CSS `order` to fix it.