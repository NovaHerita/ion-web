# ION Website — Claude Code CLI Build Guide
**Integrative Opus Neuroscience · ionbiofeedback.com rebuild**

---

## How to Use This File

1. Open this file alongside your terminal
2. Run `claude` in your project folder to start Claude Code
3. Paste the **Setup Prompt** first — once only
4. Then paste each **Section Prompt** in order, one at a time
5. After each section, review the output before continuing

**Project structure Claude Code will create:**
```
ion-website/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── assets/
    └── (placeholder for images/SVGs)
```

---

## Design System Reference

Keep this open — reference it in any prompt if something looks off.

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#edf0f3` | Page background (light blue-gray) |
| Primary text | `#0d1b2a` | Headings, body |
| Secondary text | `#6b7a8d` | Subtext, eyebrows, captions |
| Accent/teal | `#2a6b8a` | Links, tags, icon strokes |
| Button fill | `#0d1b2a` | Dark CTA buttons |
| Button text | `#ffffff` | Text on dark buttons |
| Card background | `#ffffff` | All cards and callout boxes |
| Card radius | `12px` | All cards |
| Card shadow | `0 2px 16px rgba(13,27,42,0.07)` | Subtle lift |
| Heading font | `'Playfair Display', serif` (Google Fonts) | All headings |
| Body font | `'DM Sans', sans-serif` (Google Fonts) | All body text |
| Max content width | `1200px` | Centered container |
| Section padding | `100px 0` | Vertical breathing room |
| Interstitial padding | `140px 0` | Journey pause sections |

**Google Fonts import (include in `<head>`):**
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

---

## SETUP PROMPT
*Paste this first — once only*

```
I'm rebuilding a website for ION (Integrative Opus Neuroscience), a neurofeedback and biofeedback clinic. 

Create the project scaffold: index.html, css/styles.css, and js/main.js.

In styles.css, set up these CSS variables and global styles:
- Background: #edf0f3 (light blue-gray)
- Primary text: #0d1b2a (dark navy)
- Secondary text: #6b7a8d
- Accent: #2a6b8a (teal)
- Heading font: 'Playfair Display', serif
- Body font: 'DM Sans', sans-serif
- Max container width: 1200px
- Section padding: 100px 0
- Card style: white background, border-radius 12px, box-shadow 0 2px 16px rgba(13,27,42,0.07)
- Dark button: background #0d1b2a, color white, border-radius 8px, padding 14px 28px, font-size 15px
- Outline button: border 1.5px solid #0d1b2a, background transparent, same padding

In index.html, include the Google Fonts link for Playfair Display and DM Sans, link the CSS and JS files, and leave a placeholder comment for each of the 14 sections I'll be adding.

Don't build any sections yet — just the scaffold.
```

---

## SECTION 1 — Navbar + Hero
*The first impression. Sets the entire visual tone.*

```
Add Section 1 to index.html: the Navbar and Hero.

NAVBAR:
- Fixed/sticky top, white background with very subtle bottom border
- Left: ION logo — a small brain icon (use an inline SVG of a simple brain outline, ~28px) followed by "ION" in Playfair Display, bold, dark navy
- Right: nav links (Approach, Philosophy, Team, Journals, Contact) in DM Sans 14px, color #6b7a8d, hover color #0d1b2a
- Far right: "Book Consultation" button — dark navy fill, white text, border-radius 8px

HERO:
- Full-viewport-height centered section, background #edf0f3
- Add a subtle decorative background: small scattered dots and thin connecting lines (like a neural constellation) using an SVG or CSS — very low opacity (~0.15), color #2a6b8a
- Center column, max-width 700px, text-align center
- Large ION logo mark (same brain SVG, ~56px) + "ION" text beneath in Playfair Display 18px, letter-spacing 0.15em
- Small eyebrow text: "INTEGRATIVE OPUS NEUROSCIENCE" in DM Sans 11px, letter-spacing 0.2em, color #6b7a8d, margin-top 24px
- Main headline: "Advanced Neurofeedback & Biofeedback for Nervous System Regulation" — Playfair Display, ~56px, dark navy, line-height 1.15
- Subheadline: "Evidence-informed neurotechnology to support emotional stability, cognitive performance, and resilience." — DM Sans 18px, color #6b7a8d, margin-top 16px
- Body text: "At ION, we use advanced neurofeedback and biofeedback to help the brain and nervous system regulate more effectively. Our personalised approach supports individuals experiencing anxiety, burnout, attention difficulties, sensory sensitivities, and nervous system dysregulation." — DM Sans 16px, color #6b7a8d, max-width 560px, centered
- Two buttons side by side, margin-top 40px: "Book a Consultation" (dark fill) and "Join the Newsletter" (outline style)
- Small down-arrow indicator at very bottom of hero
```

---

## SECTION 2 — Brain Adapting Interstitial
*First journey pause. Creates emotional resonance before the problem section.*

```
Add Section 2 to index.html after the hero: the Brain Adapting interstitial.

- Full-width section, background #edf0f3, padding 140px 0
- Centered content, max-width 600px, text-align center
- At the top: a sketch-style brain illustration — create this as an inline SVG (~120px wide). Draw a simple side-profile brain using thin curved paths, stroke color #8a9ab0, stroke-width 1, no fill. Add small scattered dots around it to suggest neural activity dispersing
- Below the illustration (margin-top 32px): a single centered statement in two parts:
  - "Your brain is constantly adapting." — Playfair Display, italic, 26px, color #0d1b2a, font-weight 600
  - " Here's what happens when it becomes dysregulated." — same size but color #8a9ab0, font-weight 400, continuing on same line or wrapping naturally
- Below the text (margin-top 40px): a thin downward arrow SVG, ~20px, color #b0bcc8, centered
```

---

## SECTION 3 — Understanding the Challenge
*The problem statement. Two-column layout with condition list.*

```
Add Section 3 to index.html: Understanding the Challenge.

Two-column layout (50/50 split), max-width 1100px, centered, padding 100px 40px, gap 80px. Columns align at the top.

LEFT COLUMN:
- Small eyebrow: "UNDERSTANDING THE CHALLENGE" — DM Sans 11px, letter-spacing 0.18em, color #6b7a8d
- Large heading (margin-top 12px): "When the Nervous System Struggles to Regulate" — Playfair Display, ~40px, dark navy, line-height 1.2

RIGHT COLUMN:
- Body paragraph: "Many challenges — from anxiety and burnout to attention difficulties and sensory overwhelm — are linked to how the nervous system regulates itself. When the brain becomes stuck in patterns of hyper-arousal or instability, symptoms can emerge across mood, cognition, energy, sleep, and physical wellbeing." — DM Sans 16px, color #6b7a8d, line-height 1.7
- Bold label (margin-top 32px): "Neurofeedback supports individuals experiencing:" — DM Sans 15px, color #0d1b2a, font-weight 500
- Bullet list (margin-top 16px, no default list style), each item DM Sans 15px, color #6b7a8d, padding 10px 0, border-bottom 1px solid #e8ecf0:
  • Chronic anxiety or stress
  • Burnout and emotional exhaustion
  • ADHD and attentional difficulties
  • Sleep disturbances
  • Sensory and Information Processing Disorders
  • Mood instability
  • Cognitive fatigue or brain fog
  • Chronic Pain and Fibromyalgia
  Each bullet point has a small filled circle (•) in color #2a6b8a before it
- Dark button (margin-top 32px): "Learn about Our Approach"
```

---

## SECTION 4 — Dysregulation Interstitial
*Second journey pause. Pivots from problem to hope.*

```
Add Section 4 to index.html: the Dysregulation/Hope interstitial.

- Full-width section, background #edf0f3, padding 140px 0
- Centered content, max-width 600px, text-align center
- At the top: a top-down brain illustration — create as an inline SVG (~130px wide). Draw a symmetrical brain viewed from above: two rounded hemispheres side by side with a central dividing line, and delicate tree/branch-like neural paths spreading inward from the edges. Use stroke color #8a9ab0, stroke-width 0.8, no fill. Add small dots at branch endpoints
- Below (margin-top 36px): statement in two parts:
  - "Dysregulation isn't permanent." — Playfair Display, italic, 26px, color #0d1b2a, font-weight 600
  - " With the right approach, your brain can learn to find its way back to balance." — same style but color #8a9ab0
- Small down arrow below (same style as Section 2)
```

---

## SECTION 5 — Our Approach + Quote Card
*Establishes clinical credibility. Serif quote creates gravitas.*

```
Add Section 5 to index.html: Our Approach with quote card.

- Centered section, max-width 800px, padding 100px 40px
- Eyebrow: "OUR APPROACH" — DM Sans 11px, letter-spacing 0.18em, color #6b7a8d, text-align center
- Heading (margin-top 12px): "A Personalised Approach to Nervous System Regulation" — Playfair Display 40px, dark navy, text-align center, line-height 1.2

- Quote card (margin-top 64px): white background, border-radius 16px, padding 56px 64px, box-shadow 0 2px 24px rgba(13,27,42,0.08), border 1px solid #e8ecf0
  - Quote text (italic, Playfair Display, 20px, color #0d1b2a, line-height 1.7, text-align center):
    "Personalised Medicine, a term used mostly in reference to using the individual genome to guide intervention, applies equally to neurofeedback. We are never treating the diagnosis; we are treating its manifestations, or more precisely, the manifestations of early history in this individual nervous system."
  - Attribution (margin-top 32px, text-align center): "— Sebern Fisher, " in DM Sans 14px, color #6b7a8d, followed by italic "Neurofeedback In The Treatment of Developmental Trauma" in the same size
```

---

## SECTION 6 — 2×2 Technology Cards
*The service offerings. Clean grid with icons.*

```
Add Section 6 to index.html: the 2x2 technology/service cards.

- Full-width section, background #edf0f3, padding 100px 40px
- No section heading needed — cards stand alone
- 2x2 CSS Grid, max-width 1100px, centered, gap 24px

Each card: white background, border-radius 12px, padding 40px, box-shadow 0 2px 16px rgba(13,27,42,0.07)

CARD 1 — ILF Neurofeedback:
- Icon: simple brain outline SVG, ~24px, stroke color #2a6b8a, stroke-width 1.5
- Title: "ILF Neurofeedback" — Playfair Display 26px, dark navy, margin-top 16px
- Body: "Neurofeedback is a non-invasive process that helps the brain improve its self-regulation. Infra-Low Frequency Neurofeedback targets the brain's foundational regulatory systems — supporting stability across emotional, cognitive and physiological domains." — DM Sans 15px, color #6b7a8d, margin-top 12px, line-height 1.7
- Link text at bottom: "Targeting infra-low frequencies below 0.01 Hz" — DM Sans 14px, color #2a6b8a, margin-top 20px

CARD 2 — Frequency Band Training:
- Icon: simple waveform/pulse SVG (~24px, same teal stroke)
- Title: "Frequency Band Training"
- Body: "Classical neurofeedback involves frequency band training, a non-invasive form of neurofeedback that uses operant conditioning to strengthen specific mental states, such as focus or relaxation. By rewarding your brain for producing healthier EEG patterns, it promotes long-term self-regulation and peak cognitive performance."
- Link: "Operant conditioning for EEG optimisation"

CARD 3 — Biofeedback:
- Icon: simple heart outline SVG (~24px, same teal stroke)
- Title: "Biofeedback"
- Body: "Physiological Biofeedback measures signals such as heart rate variability (HRV) to support regulation of the autonomic nervous system."
- Link: "HRV-guided autonomic regulation"

CARD 4 — Future Technologies:
- Icon: simple CPU/chip outline SVG (~24px, same teal stroke)
- Title: "Future Technologies"
- Body: "ION is building towards incorporating additional advanced brain-computer interface technologies in alignment with our values of growth, innovation, and holistic health."
- Link: "Next-generation brain-computer interfaces"
```

---

## SECTION 7 — Science/Philosophy Interstitial
*Third journey pause. Transitions from technology to values.*

```
Add Section 7 to index.html: the Science/Philosophy interstitial.

- Full-width section, background #edf0f3, padding 140px 0
- Centered, max-width 600px, text-align center
- Illustration: create an inline SVG (~200px wide, ~100px tall) showing multiple overlapping sine-wave/EEG-style lines — 3-4 horizontal wave paths with slightly different frequencies, all in stroke color #b0bcc8, stroke-width 0.8, no fill. Overlay a thin vertical crosshair line and 3-4 small filled dots where it intersects the waves, dot color #8a9ab0, radius 3
- Statement (margin-top 36px):
  - "Science guides the process." — Playfair Display italic 26px, color #0d1b2a
  - " But it's the philosophy behind it that makes the difference." — same style, color #8a9ab0
- Small down arrow below
```

---

## SECTION 8 — Philosophy: 3-Card Layout
*The "why we're different" section. Numbered principles.*

```
Add Section 8 to index.html: Our Philosophy with 3 numbered cards.

- Centered section, max-width 1100px, padding 100px 40px
- Eyebrow: "OUR PHILOSOPHY" — standard eyebrow style
- Heading: "A Dynamic View of the Brain" — Playfair Display 44px, centered
- Subtext (margin-top 20px, max-width 640px, centered): "At ION, we view the brain as a dynamic regulatory system. Rather than targeting isolated symptoms, our approach focuses on strengthening the brain's capacity for stability, flexibility and resilience." — DM Sans 16px, color #6b7a8d, line-height 1.7

3-column card grid (margin-top 56px, gap 24px):

Each card: white bg, border-radius 12px, padding 40px, box-shadow subtle. Layout inside card: icon badge top-left, large number top-right.

CARD 1 — Regulation First:
- Icon badge: small rounded square (#edf0f3 bg), shield icon in #2a6b8a, ~20px
- Large number "01" — Playfair Display 64px, color #d0d8e4, float/position top-right
- Title: "Regulation First" — Playfair Display 22px, dark navy, margin-top 24px
- Body: "The brain must stabilise before higher-order change can occur. We prioritise foundational nervous system regulation as the essential first step." — DM Sans 15px, color #6b7a8d, line-height 1.7

CARD 2 — Technology with Clinical Insight:
- Icon: small CPU/chip icon badge
- Number: "02"
- Title: "Technology with Clinical Insight"
- Body: "Advanced neurotechnology guided by clinical neuroscience. Every protocol is informed by evidence and tailored to the individual."

CARD 3 — Long-Term Brain Health:
- Icon: small upward trending arrow icon badge
- Number: "03"
- Title: "Long-Term Brain Health"
- Body: "Training the nervous system to regulate more efficiently and independently — building lasting resilience, not temporary relief."
```

---

## SECTION 9 — Meet the Team Carousel
*Human face of the clinic. Horizontal scroll with JS.*

```
Add Section 9 to index.html: the Meet the Team carousel.

- Full-width section, padding 100px 0 100px 40px
- Top row: left-aligned "OUR TEAM" eyebrow + "Meet the Team" heading in Playfair Display 36px. Far right: two circular prev/next arrow buttons (40px diameter, border 1.5px solid #d0d8e4, background white, hover background #edf0f3)

Carousel container: horizontal overflow scroll (hidden scrollbar), display flex, gap 24px, padding-right 40px

5 team member cards (min-width 260px each, card height flexible):
- Photo area: rounded-12px rectangle, ~260x340px, background #e8ecf0. If no photo: centered initial letter in Playfair Display 48px, color #b0bcc8
- Name: Playfair Display 20px, dark navy, margin-top 16px
- Role: DM Sans 11px, letter-spacing 0.15em, color #2a6b8a, uppercase, margin-top 4px
- Bio: DM Sans 14px, color #6b7a8d, line-height 1.6, margin-top 10px

Team members:
1. Kasia | NEUROFEEDBACK CLINICIAN | "Specialising in ILF neurofeedback and nervous system regulation, Kasia brings a deep understanding of clinical neuroscience to every session." | has photo placeholder
2. Dr. Lorna | CLINICAL RESEARCHER | "With a background in neuroscience research, Dr. Lorna bridges the gap between clinical practice and emerging evidence in brain health." | initial D
3. Fiona | BIOFEEDBACK SPECIALIST | "Fiona focuses on physiological biofeedback and HRV training, supporting autonomic regulation and stress resilience." | initial F
4. Anna V. | CLIENT EXPERIENCE | "Anna ensures every client journey is supported with care, clarity, and professionalism from first consultation to ongoing sessions." | initial A
5. Dr. Nistor | CLINICAL ADVISOR | "Dr. Nistor provides clinical oversight and guidance, integrating neurofeedback within a broader framework of neurological care." | initial D

Prev/next buttons scroll the carousel left/right by one card width using JS. No auto-scroll.
```

---

## SECTION 10 — Journals: 3-Column Articles
*Thought leadership. Establishes clinical authority.*

```
Add Section 10 to index.html: the Journals section.

- Full-width section, padding 100px 40px
- Left-aligned header block, max-width 500px:
  - Eyebrow: "KNOWLEDGE"
  - Heading: "Journals" — Playfair Display 52px
  - Subtitle: "As frontiers in nervous system regulation, we offer a collection of reflections, research insights, and clinical perspectives on brain health and neurofeedback." — DM Sans 16px, color #6b7a8d, line-height 1.7, margin-top 12px

3-column article card grid (margin-top 56px, gap 24px):
Each card: white bg, border-radius 12px, padding 36px, box-shadow subtle, display flex flex-direction column

CARD 1:
- Category tag: "RESEARCH" — DM Sans 11px, letter-spacing 0.15em, color #2a6b8a
- Title: "The Neurobiology of Selective Mutism: Trauma, Language, and the Social Brain" — Playfair Display 22px, dark navy, margin-top 10px, line-height 1.3
- Summary: "Selective mutism reframed as a disruption in the integration of emotional and language networks — where heightened limbic activation inhibits the cortical systems necessary for speech and social engagement." — DM Sans 14px, color #6b7a8d, margin-top 12px, line-height 1.6, flex-grow 1
- "Read here →" — DM Sans 14px, color #2a6b8a, margin-top 24px

CARD 2:
- Category: "HISTORICAL INSIGHT"
- Title: "From Trauma to Transformation: How Early Neurofeedback Pioneers Changed the Way We Think About the Brain"
- Summary: "A technique born from repairing damaged brains may hold the key to optimising every brain. Tracing neurofeedback's roots from mid-20th century brain electrical activity studies to modern neurotherapeutics."
- "Read here →"

CARD 3:
- Category: "CLINICAL INSIGHT"
- Title: "Understanding Brain Injury Through a Glial and Regulatory Lens"
- Summary: "Brain injury is not solely a neuronal event — it is a disruption of the brain's regulatory ecosystem, in which glial mechanisms play a central role. Rethinking recovery beyond traditional symptom frameworks."
- "Read here →"

Below the grid (margin-top 40px, centered): outlined pill button "View all articles →" — border 1.5px solid #0d1b2a, border-radius 24px, DM Sans 14px, padding 12px 28px
```

---

## SECTION 11 — Webinars
*Video content. Embedded YouTube-style thumbnails.*

```
Add Section 11 to index.html: Webinars section.

- Full-width section, padding 80px 40px
- Left-aligned heading: "Webinars" — Playfair Display 36px, dark navy

2-column grid (margin-top 32px, gap 24px, max-width 1100px):

Each video card:
- Thumbnail container: aspect-ratio 16/9, border-radius 12px, overflow hidden, background #1a1a2e, position relative
- Inside: a YouTube play button overlay (centered red circle ~56px with white triangle)
- For video 1 thumbnail: dark background with subtle text "ION" centered in it (placeholder)
- For video 2 thumbnail: dark background (placeholder for actual thumbnail)
- Video title below thumbnail (margin-top 12px): DM Sans 15px, color #0d1b2a
  1. "Introduction to Neurofeedback — Webinar"
  2. "Understanding Your Nervous System — Webinar"

Make the play button a styled div (not an actual embed) — clicking it could open a modal or link to YouTube. For now just style it.
```

---

## SECTION 12 — Educational Resources
*Ebook CTA. Split layout.*

```
Add Section 12 to index.html: Educational Resources.

Two-column layout, max-width 1100px, centered, padding 80px 40px, gap 80px, align-items center.

LEFT:
- Eyebrow: "EDUCATIONAL RESOURCES"
- Heading: "Educational Resources" — Playfair Display 36px
- Body: "Additional educational materials will be released through ION. Our featured resource provides a comprehensive introduction to neurofeedback and nervous system regulation." — DM Sans 16px, color #6b7a8d, line-height 1.7, margin-top 16px
- Dark button (margin-top 28px): "Purchase Ebook"

RIGHT:
- White card, border-radius 16px, padding 56px 40px, text-align center, box-shadow 0 2px 24px rgba(13,27,42,0.08), min-width 280px
- Book open icon SVG (~40px, stroke #2a6b8a, stroke-width 1.5)
- "Featured Ebook" — Playfair Display 20px, dark navy, margin-top 20px
- "A guide to neurofeedback & nervous system regulation" — DM Sans 14px, color #6b7a8d, margin-top 8px
```

---

## SECTION 13 — Newsletter Signup
*Community CTA. Email capture.*

```
Add Section 13 to index.html: Newsletter section.

- Centered section, max-width 760px, padding 120px 40px, text-align center
- Eyebrow: "NEWSLETTER"
- Heading: "Be Part of the Dialogue" — Playfair Display 48px, dark navy
- Paragraph 1 (margin-top 20px): "Join our growing community. Receive a monthly newsletter including complementary educational resources, the latest news in social neuroscience, and updates from ION." — DM Sans 16px, color #6b7a8d, line-height 1.7
- Paragraph 2: "Newsletter subscribers receive early access and discounts to all social and educational events. Pricing information and service updates are also shared with subscribers." — same style, margin-top 12px

- Email form (margin-top 40px): flex row, gap 0, centered
  - Input: "Your email address" placeholder, DM Sans 15px, padding 14px 20px, border 1.5px solid #d0d8e4, border-radius 8px 0 0 8px, background white, min-width 300px, outline none, focus border-color #2a6b8a
  - Button: "Join the Community" — dark navy fill, white text, border-radius 0 8px 8px 0, padding 14px 24px, DM Sans 15px, no border
```

---

## SECTION 14 — Book a Consultation + Footer
*Final CTA and site close. Dark footer is a hard visual break.*

```
Add Section 14 (Contact) and the Footer to index.html.

--- SECTION 14: BOOK A CONSULTATION ---

Two-column layout, max-width 1100px, centered, padding 100px 40px, gap 80px, align-items flex-start.

LEFT COLUMN:
- Eyebrow: "GET IN TOUCH"
- Heading: "Book a Consultation" — Playfair Display 44px, dark navy
- Body: "If you are interested in neurofeedback training, or would like to discuss whether it may be appropriate for you or a loved one, schedule an initial consultation below." — DM Sans 16px, color #6b7a8d, line-height 1.7, margin-top 16px, max-width 420px

Contact details (margin-top 36px), each row: flex, align-items flex-start, gap 14px, margin-bottom 20px
- Row 1: map-pin SVG icon (20px, stroke #2a6b8a) + "Clinic Location" bold label + "ION Neurofeedback Clinic" below in color #6b7a8d
- Row 2: envelope SVG icon + "Email" + "info@ion-neuroscience.com" (color #2a6b8a)
- Row 3: phone SVG icon + "Phone & WhatsApp" + "Contact us for details"

RIGHT COLUMN:
White card, border-radius 16px, padding 44px, box-shadow 0 2px 24px rgba(13,27,42,0.08):
- "Complimentary Consultation — 30 minutes" — DM Sans 15px, color #0d1b2a, font-weight 500
- Body (margin-top 16px): "Your consultation is an opportunity for us to hear your story — to understand your struggles, your current environment, and what brought you here. We'll walk you through how neurofeedback works, answer any questions you may have, and give you the chance to see the space where your training would take place." — DM Sans 15px, color #6b7a8d, line-height 1.7
- Operating row (margin-top 24px): "OPERATING DAYS" label (DM Sans 11px, letter-spacing 0.15em, color #2a6b8a) + "Mon · Wed · Fri, 8 AM – 7 PM" (DM Sans 14px, color #0d1b2a, margin-left 12px)
- "Schedule Consultation" button (margin-top 32px, full width) — dark navy fill, white text

--- FOOTER ---

Full-width section, background #0d1b2a (dark navy), padding 80px 40px.
4-column layout (or flex with space-between), max-width 1200px, centered:

COL 1 (left):
- White ION logo mark (brain SVG in white) + "ION" in Playfair Display white
- Tagline below: "ION — Advancing Nervous System Regulation" — Playfair Display italic 14px, color rgba(255,255,255,0.5), margin-top 12px

COL 2:
- Label: "NAVIGATION" — DM Sans 11px, letter-spacing 0.15em, color rgba(255,255,255,0.4)
- Links (margin-top 16px, each DM Sans 14px, color rgba(255,255,255,0.65), hover white, display block, margin-bottom 10px):
  Approach, Philosophy, Team, Journals, Bookings

COL 3:
- Label: "CONNECT"
- Links: Instagram, YouTube, LinkedIn, Facebook

COL 4:
- Label: "LEGAL"
- Links: Privacy Policy, Terms of Service

Bottom bar (margin-top 64px, padding-top 24px, border-top 1px solid rgba(255,255,255,0.1)):
- "© 2025 ION Neuroscience. All rights reserved." — DM Sans 13px, color rgba(255,255,255,0.35)
```

---

## FINISHING TOUCHES PROMPT
*Run this after all sections are built*

```
Now that all sections are built, make these polish passes across the whole site:

1. SCROLL ANIMATIONS: Add a subtle fade-up animation (translateY 20px → 0, opacity 0 → 1, duration 0.6s ease) to all section headings and cards using IntersectionObserver in main.js. Stagger delays on grid items (0ms, 100ms, 200ms).

2. SMOOTH SCROLL: Add smooth scroll behavior to all anchor nav links.

3. ACTIVE NAV: Highlight the current section's nav link as the user scrolls using IntersectionObserver.

4. MOBILE RESPONSIVE: Add a hamburger menu for mobile (breakpoint 768px). Stack all two-column layouts to single column. Reduce heading sizes (hero headline to 36px, section headings to 28px). Make the team carousel swipeable on touch.

5. HOVER STATES: 
   - All cards: subtle translateY(-2px) and slightly deeper shadow on hover (transition 0.2s ease)
   - All CTA buttons: lighten background by ~10% on hover
   - Nav links: smooth color transition

6. TYPOGRAPHY TIGHTENING: Check all sections for consistent spacing. Section eyebrows should always be 11px, letter-spacing 0.18em, color #6b7a8d. Section headings should feel generous — check margins aren't too tight on mobile.

7. CONSTELLATION BACKGROUND: If not already done, make the hero constellation pattern a subtle animated SVG where dots very slowly drift (CSS animation, 20s duration, very low movement). Keep it imperceptible — it should only be noticed on close inspection.
```

---

## QUICK REFERENCE — Common Issues

**Fonts not loading?**
Check the Google Fonts `<link>` is in `<head>` before your CSS link.

**Section feels too cramped?**
Add `padding: 120px 40px` instead of `100px`. The interstitials (2, 4, 7) should always be `140px 0`.

**Cards looking flat?**
Use `box-shadow: 0 2px 16px rgba(13,27,42,0.07)` and ensure card background is `#ffffff`, not the page bg.

**Buttons inconsistent?**
Dark button: `background: #0d1b2a; color: #fff; border: none; border-radius: 8px; padding: 14px 28px; font-family: 'DM Sans'; font-size: 15px; cursor: pointer;`
Outline button: same but `background: transparent; border: 1.5px solid #0d1b2a; color: #0d1b2a;`

**Footer text hard to read?**
Body text in footer should be `rgba(255,255,255,0.65)`, labels `rgba(255,255,255,0.4)`, headings/links `rgba(255,255,255,0.9)`.

**Serif font looks wrong size?**
Playfair Display runs slightly larger than most serifs — if a heading looks big, reduce by 4-6px.

---

*Build guide prepared for ION website rebuild · ionbiofeedback.com*
