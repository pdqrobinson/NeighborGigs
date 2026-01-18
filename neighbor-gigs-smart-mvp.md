# What You Can Control via NeighborGigs (Smart MVP)

Think of your app as:

A secure consent + audit system, not a pharmacy replacement.

## 1. Prescription Pickup Task Template (Structured)

When someone posts:

"I need someone to pick up my prescription"

You force structured inputs (not free text):

**Required fields**
• Pharmacy name + location
• Patient first name (last name optional initially)
• Patient DOB (masked after match)
• Pickup window (time-based validity)
• Medication type selector:
• ☐ Regular
• ☐ Possibly controlled (warning shown)

**UX trick:**
If they select "controlled," you flag:

"Helper may be rejected at pharmacy. No refund if denied."

---

## 2. In-App Consent + Authorization (This Is the Key)

Before a helper is matched, the requester must:

✅ Check a box:

"I authorize a NeighborGigs helper to pick up my prescription on my behalf."

Then:
• App generates a Pickup Authorization Record
• Timestamped
• Helper-specific
• One-time use
• Expires after X hours

This protects you, not Walgreens.

---

## 3. QR Code = Proof of Assignment (Not Pharmacy Auth)

The QR code should NOT be presented as:

"Scan this to get the meds"

Instead, it represents:
• Task ID
• Helper ID
• Patient initials
• Expiration timestamp

Used for:
• Helper proves to the patient they're the assigned runner
• In-app verification
• Dispute resolution
• Fraud prevention

At Walgreens, the helper still says:

"I'm picking up a prescription for John D, DOB 3/14/82"

The QR never leaves your ecosystem.

---

## 4. Controlled Info Reveal (Critical Design Pattern)

You don't give the helper everything upfront.

**Before acceptance**
• Pharmacy location
• Pickup window
• Task payout

**After acceptance**
• Patient first name
• DOB
• Authorization statement
• QR code
• Optional patient photo (opt-in)

This prevents scraping and fishing.

---

## 5. Proof of Attempt / Completion Flow

This is where you win.

**If pickup succeeds:**
• Photo of bag (no label visible)
• "Picked up" button
• Optional receipt upload

**If pickup fails:**
• Helper selects reason:
• ☐ Pharmacy denied third-party pickup
• ☐ Medication not ready
• ☐ ID required
• Photo of pharmacy receipt or counter sign (optional)

Now you can:
• Auto-release partial payment
• Protect both sides
• Avoid chargebacks

---

## 🧠 Advanced (Post-MVP, If You're Feeling Dangerous)

### Option A: "Pharmacy Call Assist"

Add a button:

"Call pharmacy to confirm"
• App displays a script
• Logs the attempt
• Adds credibility to the helper

### Option B: Stored Pickup Profiles

Users can save:
• "My prescriptions are usually okay for pickup"
• "This pharmacy always asks for ID"

This becomes network intelligence over time.