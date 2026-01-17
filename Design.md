# NeighborGigs — MVP App Blueprint (v1)

## Product North Star

**Turn everyday errands into trusted, paid neighbor-to-neighbor help.**\
Helper-led. Trust-forward. No gig-economy weirdness.

---

## 1. App Entry & Onboarding

### Screen: Welcome / Entry

**Goal:** Set tone + teach behavior in 3 seconds.

**UI**

- App logo

- Headline:\
  **“Neighbors helping neighbors — while they’re already out.”**

- Subtext:\
  *Fast. Local. Trusted.*

**Primary CTA (Large, Full Width)**\
🟢 **I’m already going out**

**Secondary CTA (Smaller, Still Obvious)**\
🔵 **I need something**

**Footer**

- “How it works”

- “Safety & trust”

👉 This screen *educates by hierarchy*, not text.

---

### Screen: Signup

**Goal:** Minimal friction, immediate trust signal.

- Phone number (SMS verification)

- Upload profile photo (required)

- Name

- Zip code (used to anchor neighborhood)

Optional (skip allowed):

- ID verification (future unlocks badge)

- Ambassador invite code (if applicable)

No passwords. No email wall.

---

## 2. Home Screen (Post-Onboarding)

### Screen: Home / Neighborhood Feed

**Top Section**

- Neighborhood label:\
  *“Within 1.8 miles of you”*

- Radius control (1–3 miles slider)

**Primary CTA (Persistent)**\
🟢 **I’m already going out**

**Secondary CTA**\
🔵 **I need something**

---

### Feed Content Rules (Important)

Order of priority:

1. Active **Broadcasts** (helpers going out)

2. Contextual **Pending Requests** (only if relevant)

3. Ambassador broadcasts (slightly boosted)

No empty chaos feeds.

---

## 3. Primary Flow — “I’m Already Going Out” (Helper Flow)

### Screen: Create Broadcast

**Fields (Fast, One-Screen Flow)**

- Errand type (icons):

  - Grocery

  - Pharmacy

  - General Errand

- Time window:

  - “Leaving in” (15 / 30 / 60 min)

- Radius slider (1–3 miles)

- Optional note:\
  *“Can grab small items only”*

**CTA**\
🟢 **Broadcast my trip**

---

### Screen: Broadcast Live

**Header**

- Status: 🟢 Live

- Countdown timer

**Incoming Requests Section**

- Request cards slide in live

- Each card shows:

  - Requester photo

  - Item summary

  - Distance

  - Fixed price

**Actions**

- Accept

- Decline

Accepting **locks payment** (escrowed).

---

## 4. Secondary Flow — “I Need Something” (Requester Flow)

### Screen: Create Request

**Fields**

- What do you need? (text)

- Deadline

- Radius (1–3 miles)

- Suggested price:

  - $5 / $10 / $15 (radio buttons)

**UX Nudge (Subtle, Important)**

> “You’ll get faster results when a neighbor is already heading out.”

**CTA**\
🔵 **Submit request**

---

### What Happens Next (System Behavior)

- Request enters **pending pool**

- App:

  - Attaches it to relevant broadcasts

  - Notifies nearby helpers already active

No public begging board. Ever.

---

## 5. Task Detail (Shared by Helper & Requester)

### Screen: Task Detail

**Top**

- Task status:

  - Pending

  - Accepted

  - In progress

  - Completed

- Profile card:

  - Photo

  - Rating ⭐

  - Ambassador badge (if applicable)

**Middle**

- Chat (in-app only)

- Item list / notes

**Bottom (Contextual Actions)**

- Cancel

- Upload photo

- Mark complete

- Flag issue

---

## 6. Completion & Payment

### Screen: Proof of Completion (Helper)

- Upload photo (required)

- Optional note

- CTA: **Mark complete**

---

### Screen: Completion Confirmation (Requester)

- Photo preview

- “Looks good?” confirmation

- Tip buttons:

  - $2 / $5 / Custom

**CTA**\
🟢 **Confirm & release payment**

---

## 7. Ratings & Trust Loop

### Screen: Rating

- 1–5 stars

- Optional comment

- “Would you help/request again?” (Yes/No)

Ratings immediately affect:

- Feed visibility

- Ambassador eligibility (future)

---

## 8. Profile Screen

### Screen: User Profile

**Top**

- Photo

- Name

- Neighborhood


- ⭐ Rating

**Badges**

- Ambassador (gold)

- Verified (future)

**Stats**

- Tasks completed

- Reliability score (simple %)

No social clutter. Trust only.

---

## 9. Ambassador UX (v1 Lite)

Ambassadors are **trust amplifiers**, not admins.

**Ambassador Badge**

- Gold

- Tooltip:

  > “Background checked · NeighborGigs certified”

**Visibility Boost**

- Slight feed priority

- First suggested helper for new users

No moderation powers yet. Keep it simple.

---

## 10. Failure & Safety Flows

### Cancel Flow

- Reason required

- Auto refund if before acceptance

- Manual review if after acceptance

### Flag Flow

- Simple categories:

  - No show

  - Unsafe

  - Inappropriate

- Auto-pauses user if repeated

Clear, quiet, effective.

---

# What You Have Now

You now possess:

- A **clear MVP**

- A **single dominant behavior**

- A **design that teaches usage**

- A **marketplace that won’t implode early**

This is absolutely buildable in **30–45 days** with:

- Expo (React Native)

- Supabase

- Stripe Connect

- Mapbox