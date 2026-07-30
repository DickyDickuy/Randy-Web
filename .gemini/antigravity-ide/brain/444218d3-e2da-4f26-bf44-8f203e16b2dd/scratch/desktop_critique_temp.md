# Desktop Design & Menu Bar Critique Snapshot

Target: `app/page.tsx` (Desktop Layout & Menu Bar, Post-Hero)

### Report Header
`⚠️ DEGRADED: single-context (no sub-agent tool exposed)`

### Design Health Score (Nielsen's 10 Heuristics)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No persistent header or section progress indicator on desktop scroll past Hero |
| 2 | Match System / Real World | 4 | Clear executive tone, authoritative headlines, and structured case studies |
| 3 | User Control and Freedom | 2 | Navigation menu vanishes once user scrolls past Hero; no quick jump mechanism |
| 4 | Consistency and Standards | 3 | Consistent 50:50 split primitive, but sharp color palette jumps across sections |
| 5 | Error Prevention | 4 | Excellent form validation and honeypot protection |
| 6 | Recognition Rather Than Recall | 2 | Desktop user cannot see active section indicator or menu button while deep in section scroll |
| 7 | Flexibility and Efficiency | n/a | Persuade / Experience portfolio surface |
| 8 | Aesthetic and Minimalist Design | 3 | Strong grid layout, but overused Inter font and placeholder cards in case studies |
| 9 | Error Recovery | 3 | Clean form error states |
| 10 | Help and Documentation | n/a | Persuade / Experience portfolio surface |
| **Total** | | **23/32** | **Good** |

### Design Specificity Verdict

**LLM assessment**:
The 50:50 "Split-to-Stack" desktop layout primitive creates a striking visual presentation with pinned left headers and long scrolling right content blocks. However, the desktop user experience lacks persistent navigation: the "MENU" trigger is bound inside `Hero.tsx`, so as soon as a visitor scrolls down to post-hero sections, all navigation controls disappear. Furthermore, long pinned section scrolls lack a desktop progress rail or section indicator, leaving visitors without spatial context.

**Deterministic scan**:
`detect.mjs` identified 3 warnings across files:
- `app/globals.css`: Overused font (`Inter`)
- `components/ui/LogoMarquee.tsx`: AI color palette (`text-purple-200`)
- `components/ui/TeamPortraitGrid.tsx`: AI color palette (`from-purple-500` gradient)

### Overall Impression
The desktop layout has high impact and strong editorial energy, but navigation ergonomics drop significantly after leaving the Hero. Adding a global floating desktop header/pill and a subtle section progress rail will turn this into an award-winning executive experience.

### What's Working
1. **50:50 Pinned Split-Screen Rhythm**: Smooth GSAP ScrollTrigger pinning on desktop keeps key section headers fixed while right-hand content scrolls naturally.
2. **Bold Editorial Typography**: High-contrast display headlines (`ARCHITECTING FUTURE VISION`, `EXECUTIVE STUDIO`) establish clear visual hierarchy.
3. **Structured Case Studies & Services**: Clean grid cards and service list hover states create engaging desktop interactions.

### Priority Issues

- **[P0] Missing Persistent Desktop Navigation Header**: The "MENU" button lives inside `Hero.tsx`. When desktop visitors scroll down to `WhoWeAre`, `BespokeServices`, or `MeetTheTeam`, all navigation controls vanish.
  - *Why it matters*: Users lose navigation control during long section scrolls and cannot quickly jump to Contact or other sections.
  - *Fix*: Implement a global sticky/floating desktop navigation header (or pill) with smooth section jump links.
  - *Suggested command*: `/impeccable harden components/layout/Header.tsx`

- **[P1] Lack of Pinned Desktop Section Progress Rail**: In 50:50 split sections where the left column stays pinned while the right column scrolls, there is no visual indicator showing scroll progress or which section (01-05) is active.
  - *Why it matters*: Desktop visitors lose spatial orientation during deep section scrolling.
  - *Fix*: Add a subtle pinned desktop section counter / progress indicator.
  - *Suggested command*: `/impeccable layout components/layout/SplitScreenSection.tsx`

- **[P2] Visual Palette Jumps & Font Distinctiveness**: `WhoWeAre` is yellow-on-yellow, `BespokeServices` is dark-on-white, `About` is deep purple, and `MeetTheTeam` is sky blue. The color palette jumps sharply across sections without a unified visual thread, and `app/globals.css` uses generic `Inter` typography.
  - *Why it matters*: Fragmented hue transitions weaken executive brand cohesion; generic `Inter` font reduces visual authority.
  - *Fix*: Harmonies section background tokens into a unified executive palette and upgrade typography pairing.
  - *Suggested command*: `/impeccable typeset app/globals.css`

### Persona Red Flags

**Alex (Impatient Power User)**:
- *Red Flag*: Scrolling down 3 sections into Case Studies and wanting to jump directly to Contact requires manual upward scrolling back to Hero or long downward scrolling. No keyboard shortcuts or persistent nav.

**Jordan (First-Timer)**:
- *Red Flag*: In pinned desktop split-screen sections, Jordan isn't sure if the page is stuck or if the right column is supposed to scroll because there is no visual scroll indicator.

**Executive Client Persona (CEO / Enterprise Client)**:
- *Red Flag*: The sharp color jumps between sections (bright yellow to dark obsidian to deep purple to bright sky blue) feel like different template blocks rather than one cohesive executive studio.

### Minor Observations
- `LogoMarquee` and `TeamPortraitGrid` use placeholder gradient cards that can be elevated with richer visual media.
- `Inter` font warning from detector in `globals.css`.

### Questions to Consider
- "Should we introduce a sleek floating desktop header pill (e.g. top-right or centered) that appears smoothly as soon as you scroll past the Hero?"
- "Would a subtle side progress rail (`01 / 05`, `02 / 05`) clarify the desktop pinning mechanism for first-time visitors?"
