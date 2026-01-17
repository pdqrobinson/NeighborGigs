# NeighborGigs — Task State Machine (v1)

## Core Principle

> **A task represents one request attached to one helper’s broadcast.**

Not a generic “job.”\
Not a long-lived ticket.\
A **short-lived, transactional unit** with a clear end.

---

## Canonical Task States

These are the **only valid states** in v1:

```markdown
DRAFT
→ PENDING_MATCH
→ OFFERED
→ ACCEPTED
→ IN_PROGRESS
→ COMPLETED
→ CONFIRMED
→ PAID
```

### Failure / Exit States

```markdown
CANCELLED
EXPIRED
DISPUTED
REFUNDED
```

No skipping. No shortcuts.

---

## State Definitions (Plain English)

### 1. `DRAFT`

- Requester is creating a request

- Not visible to anyone

- No payment intent

**Who can act:** Requester\
**Exit to:** `PENDING_MATCH`

---

### 2. `PENDING_MATCH`

- Request exists

- Waiting for a helper broadcast

- No helper assigned yet

**Who can see:** System + relevant helpers\
**Who can act:** System\
**Exit to:**

- `OFFERED`

- `EXPIRED`

- `CANCELLED`

---

### 3. `OFFERED`

- Task is attached to a helper’s broadcast

- Helper sees it as an incoming request

- Payment is **authorized but not captured**

**Who can act:** Helper\
**Exit to:**

- `ACCEPTED`

- `CANCELLED` (by requester)

- `EXPIRED`

---

### 4. `ACCEPTED`

- Helper accepted

- Escrow is locked

- Task is now exclusive

**Who can act:** Helper\
**Exit to:** `IN_PROGRESS`

Guard:

- Only **one helper** can ever reach this state

---

### 5. `IN_PROGRESS`

- Helper has started the errand

- Chat enabled

- Proof upload allowed

**Who can act:** Helper\
**Exit to:**

- `COMPLETED`

- `CANCELLED` (edge case)

---

### 6. `COMPLETED`

- Helper uploaded photo

- Helper marked task complete

- Payment still held

**Who can act:** Requester\
**Exit to:**

- `CONFIRMED`

- `DISPUTED`

---

### 7. `CONFIRMED`

- Requester accepts proof

- Tip added (optional)

**Who can act:** System\
**Exit to:** `PAID`

---

### 8. `PAID`

- Funds released to helper

- Ratings unlocked

- Task immutable

**Terminal state**

---

## Failure & Edge States

### `CANCELLED`

- Can happen before `ACCEPTED`

- Auto refund

- No penalty (unless abused)

Terminal

---

### `EXPIRED`

- No helper accepted before deadline

- Auto refund

- Quiet exit

Terminal

---

### `DISPUTED`

- Requester flags issue after `COMPLETED`

- Funds frozen

- Manual or rules-based resolution

Exit to:

- `REFUNDED`

- `PAID`

---

### `REFUNDED`

- Funds returned

- Helper rating impact applied

Terminal

---

## Transition Table (This Is What Devs Love)

| From | To | Trigger | Actor |
| --- | --- | --- | --- |
| DRAFT | PENDING_MATCH | Submit request | Requester |
| PENDING_MATCH | OFFERED | Helper broadcast | System |
| OFFERED | ACCEPTED | Accept | Helper |
| ACCEPTED | IN_PROGRESS | Start task | Helper |
| IN_PROGRESS | COMPLETED | Upload proof | Helper |
| COMPLETED | CONFIRMED | Approve | Requester |
| CONFIRMED | PAID | Auto | System |
| \* | CANCELLED | Cancel | User |
| \* | EXPIRED | Timeout | System |
| COMPLETED | DISPUTED | Flag issue | Requester |
| DISPUTED | REFUNDED | Resolution | System |
| DISPUTED | PAID | Resolution | System |

---

## UI + Backend Guards (Important)

### Hard Rules

- ❌ Cannot cancel after `IN_PROGRESS` without dispute

- ❌ Cannot edit task after `ACCEPTED`

- ❌ Cannot message after `PAID`

### Soft Rules

- Frequent cancellations reduce visibility

- Disputes reduce trust score

- Ambassadors get higher tolerance thresholds

---

## Payment Logic (Stripe-Friendly)

- `OFFERED` → create PaymentIntent (authorize)

- `ACCEPTED` → capture into escrow

- `CONFIRMED` → release payout

- `DISPUTED` → hold funds

- `REFUNDED` → reverse

This aligns cleanly with **Stripe Connect**.

---

## Why This State Machine Is Strong

- No ambiguous “half done” states

- Disputes are contained

- UI always knows what actions to show

- Easy to log + audit

- Easy to extend later (insurance, guarantees, subscriptions)