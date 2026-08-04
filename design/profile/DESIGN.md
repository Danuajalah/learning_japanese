---
name: Komorebi Learning
colors:
  surface: '#f7f9ff'
  surface-dim: '#c9dcf3'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf4ff'
  surface-container: '#e3efff'
  surface-container-high: '#d9eaff'
  surface-container-highest: '#d1e4fb'
  on-surface: '#091d2e'
  on-surface-variant: '#514345'
  inverse-surface: '#203243'
  inverse-on-surface: '#e8f2ff'
  outline: '#837375'
  outline-variant: '#d6c2c4'
  surface-tint: '#864e5a'
  primary: '#864e5a'
  on-primary: '#ffffff'
  primary-container: '#ffb7c5'
  on-primary-container: '#7b4551'
  inverse-primary: '#fbb3c1'
  secondary: '#ba002c'
  on-secondary: '#ffffff'
  secondary-container: '#df2842'
  on-secondary-container: '#fffbff'
  tertiary: '#516161'
  on-tertiary: '#ffffff'
  tertiary-container: '#bccecd'
  on-tertiary-container: '#485858'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9df'
  primary-fixed-dim: '#fbb3c1'
  on-primary-fixed: '#360c19'
  on-primary-fixed-variant: '#6b3743'
  secondary-fixed: '#ffdad9'
  secondary-fixed-dim: '#ffb3b3'
  on-secondary-fixed: '#400009'
  on-secondary-fixed-variant: '#920021'
  tertiary-fixed: '#d4e6e5'
  tertiary-fixed-dim: '#b8cac9'
  on-tertiary-fixed: '#0e1e1e'
  on-tertiary-fixed-variant: '#3a4a49'
  background: '#f7f9ff'
  on-background: '#091d2e'
  surface-variant: '#d1e4fb'
typography:
  display-jp:
    fontFamily: Noto Sans JP
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  kanji-card:
    fontFamily: Noto Sans JP
    fontSize: 64px
    fontWeight: '500'
    lineHeight: '1.1'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 20px
  gutter: 16px
  card-gap: 12px
---

## Brand & Style

This design system is built to facilitate a focused yet joyful language learning journey. The brand personality is **Encouraging, Methodical, and Vibrant**. It balances the discipline required for JLPT mastery with the "kawaii" approachability of modern Japanese digital products.

The visual style is a hybrid of **Minimalism** and **Tactile Gamification**. It uses ample whitespace to prevent cognitive overload during kanji study, while employing "squishy" interactive elements—inspired by soft skeuomorphism—to provide satisfying haptic-like feedback during quizzes. The interface should feel like a premium stationery set: clean, organized, and tactile.

## Colors

The palette draws directly from Japanese seasonal motifs and national identity.
- **Sakura Pink (#FFB7C5):** The primary driver for brand moments, primary buttons, and active learning states.
- **Imperial Red (#BC002D):** Reserved for high-impact accents, error states, and critical "Must Know" kanji highlights.
- **Mint & Blue:** Functional colors for "Success" (Mint) and "In-Progress" (Blue) states.
- **Surface Strategy:** Use the Off-white (#F9F9F9) as the base. Apply a subtle "Asanoha" (hemp leaf) pattern at 2% opacity on large background areas to provide texture without distracting from text.

## Typography

The system utilizes a dual-language typographic scale. **Montserrat** provides a geometric, energetic feel for headers and navigational cues, while **Inter** ensures maximum legibility for English definitions and grammatical explanations.

For Japanese characters (Kanji, Hiragana, Katakana), **Noto Sans JP** is mandatory. It offers the necessary stroke clarity for N5-N3 learners. Large-scale Kanji on flashcards should use the `kanji-card` token to ensure learners can see radical details clearly. Vertical rhythm is strictly enforced with a 4px baseline grid to keep complex scripts organized.

## Layout & Spacing

This design system follows a **Mobile-First Fluid Grid**. On mobile devices, use a 4-column layout with 20px outside margins. On desktop, transition to a 12-column centered layout with a maximum content width of 1140px.

Spacing is based on an 8px linear scale. For learning interfaces (quizzes), use "Concentration Padding" (wider 32px-40px gutters) to reduce visual noise. Navigation is docked to a bottom bar on mobile to ensure "thumb-friendly" interaction during commutes, featuring a floating Sakura-colored "Study Now" button in the center.

## Elevation & Depth

To achieve a "Friendly & Tactile" feel, this design system avoids harsh, dark shadows. Instead, it uses **Tonal Layers** and **Tinted Ambient Shadows**.

- **Level 0 (Base):** #F9F9F9 Off-white background.
- **Level 1 (Cards):** White surface with a 1px border of #E0E0E0.
- **Level 2 (Interactive):** 8px Y-offset shadow, 16px blur, using a 10% opacity version of the element's own color (e.g., a Pink button gets a soft pink shadow).
- **Press State:** When an element is pressed, it should "sink" by removing the shadow and applying a 2px downward transform, mimicking a physical button.

## Shapes

The shape language is consistently **Rounded**. This removes visual tension and makes the learning environment feel safe and inviting. 

- **Primary Cards/Inputs:** Use `rounded-lg` (16px) to create a soft, friendly frame.
- **Badges/Chips:** Use `rounded-xl` or full pill shapes for level indicators (e.g., "N3").
- **Icons:** Use a 2px stroke weight with rounded caps and joins to match the typography.

## Components

### Progress Cards
Cards feature a "Lesson Path" style. Locked lessons are rendered in 50% opacity with a solid Deep Red lock icon. Completed lessons show a Sakura Pink star icon with a subtle outer glow.

### Interactive Buttons
Primary buttons use the Sakura Pink background. Upon hover, they should scale 2% (1.02); upon click, they "squish" (scale 0.98). Secondary buttons use a thick 2px border of Sakura Pink with a transparent center.

### Gamified Badges
Badges are circular with a dual-ring border. The inner ring fills as the user progresses through a specific JLPT level. Use the Mint Green (#E0F2F1) for "Mastered" badges.

### Input Fields
Search bars and text inputs use a "Soft-Sunk" style—white background with a subtle inset shadow and a 1px border that turns Sakura Pink when focused.

### Bottom Navigation
A fixed-position blur-effect (glassmorphism) bar. Active icons use a "blob" background highlight in Sakura Pink to clearly indicate the current view.