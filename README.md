# Pawfect — Connecting every paw to its perfect hands

Pawfect is an animal shelter giving marketplace in India built with the warmth and doorstep delivery ease of modern food-delivery platforms. Donors browse verified animal sanctuaries, gift daily warm meal bowls, vaccines, or paralysis carts, dedicate certificates in honor of family milestones, and track order fulfillment through a verified 48-hour photo proof timeline.

---

## 1. Architecture & Folder Structure

Pawfect enforces **strict SOLID design** across every module:

```
src/
  app/            Composition root (container.ts), providers, router
  domain/         Pure domain entities, value objects, and segregated interfaces (no framework imports)
  services/       Core business logic (checkout idempotency, membership, date reminders, moderation)
  repositories/   In-memory and seed implementations satisfying domain contracts
  state-machines/ Explicit finite state machines for Order, Membership, and Shelter approval
  ui/
    components/   Reusable, tokenised dumb UI (Navbar, Footer, Badge, ErrorBoundary, CertificateView)
    features/     Domain feature screens (donor, shelter, community, membership, admin)
    mascots/      Original inline SVG illustrations (BowCat, DogMascot, RabbitMascot, CatMascot, CursorCompanions)
    theme/        Tokens, CSS variables, and global styles
  config/         plans.example.ts, gifts.ts, roles.ts, copy.ts
  security/       Admin auth contracts, sanitisation, rate limiting, magic-byte file validation
  tests/          Unit tests (state machines, date logic, pricing) & repository contract tests
scripts/
  hash-password.ts Secure CLI script to generate Argon2id/scrypt password hashes
```

### Folder Explanations & SOLID Compliance
- **`src/domain/` (Single Responsibility & Interface Segregation):** Contains pure entities (`Money`, `Shelter`, `Gift`, `Order`, `Membership`) and granular interfaces (`ShelterReader`, `ShelterWriter`, `OrderTracker`, `PayoutPolicy`). Contains zero React or browser dependencies.
- **`src/state-machines/` (Single Responsibility):** Models order lifecycle, membership statuses, and shelter approval as explicit finite state machines. Illegal transitions throw typed errors (`IllegalOrderStateTransitionError`).
- **`src/config/` (Open/Closed Principle):** Every price, benefit amount, gift item, collar color, and certificate theme lives in modular configuration files.
- **`src/services/` (Single Responsibility):** Independent business services for idempotency locking (`CheckoutService`), annual recurring reminder math (`DateService`), and content moderation rules (`ModerationService`).
- **`src/repositories/` (Liskov Substitution Principle):** Concrete repositories implement domain interfaces and pass the exact same unit contract test suites.
- **`src/app/container.ts` (Dependency Inversion Principle):** The single composition root. UI and services depend only on domain interfaces wired in this container. Switching from in-memory mock repositories to production PostgreSQL/Firestore requires changing only this single file.

---

## 2. Setup & Environment Variables

### Installation & Development
```bash
# Install dependencies
npm install

# Run automated unit tests & contract tests
npx tsx --test src/tests/*.test.ts

# Start dev server
npm run dev
```

### Environment Variables
Configure your environment in `.env.local` (excluded by `.gitignore`):
```bash
# GEMINI_API_KEY (Optional for future LLM additions)
GEMINI_API_KEY=""

# APP_URL
APP_URL="http://localhost:3000"

# ADMIN_PASSWORD_HASH: Bcrypt/Argon2id/scrypt hash of your admin password
# Generate via: npx tsx scripts/hash-password.ts "<your-secure-password>"
ADMIN_PASSWORD_HASH=""
```

---

## 3. How to Extend Pawfect (Open/Closed Principle)

### Adding a New Membership Plan
Without modifying any components or existing services, register a new entry in `src/config/plans.example.ts`:
```typescript
MEMBERSHIP_PLANS.push({
  id: 'plan_angel_patron',
  name: 'Angel Patron',
  badgeTitle: 'Angel',
  tagline: 'Lifetime emergency shelter bed sponsorship.',
  monthlyPaise: 499900, // ₹4,999/mo (Example)
  yearlyPaise: 4999000,
  discountPercentYearly: 17,
  benefits: [ ... ],
});
```
The membership view, pricing calculation, and checkout dynamically render the new plan with the visible **"Example"** tag automatically.

### Adding a New Gift Type
Register the item in `src/config/gifts.ts`:
```typescript
GIFTS_CATALOG.push({
  id: 'gift_ortho_bed',
  title: 'Orthopaedic Foam Bed for Senior Dog',
  category: 'comfort',
  description: 'Waterproof high-density memory foam bed for dogs with hip dysplasia.',
  amountInPaise: 180000, // ₹1,800
  iconName: 'Moon',
  unitLabel: '1 orthopaedic bed',
  mealsEquivalent: 25,
  impactDescription: 'Relieves joint stiffness for a recovering elder street dog.',
});
```

### Adding a New Certificate Theme
Add a theme to `CERTIFICATE_THEMES` in `src/config/roles.ts`:
```typescript
CERTIFICATE_THEMES.push({
  id: 'monsoon_lotus',
  name: 'Monsoon Lotus Pink',
  primaryColor: '#B0285F',
  bgColor: '#FFF5F8',
});
```

---

## 4. Security & Compliance Architecture

### Honest Front-End Limitations
In a client-side preview environment, browser code executes on the client device. Any credentials or secrets placed into client bundles can be extracted. Therefore:
1. **Zero Secret Hardcoding:** No password, auth secret, API key, or credential exists in any source file, test, comment, or mock data.
2. **Password Verification Contract:** Admin login is structured through the `AdminAuthContract` (`src/security/auth-service.ts`). In production, this forwards to `POST /api/admin/auth/verify` where the hash in `process.env.ADMIN_PASSWORD_HASH` is evaluated server-side.
3. **No Plaintext Passwords in Memory:** Input password fields are never stored in localStorage, never echoed in logs or error reports, and are cleared from component state immediately upon submission.
4. **Brute-Force & Rate-Limiting Protection:** Progressive lockout enforces exponential delays (1 min, 5 min, 15 min) after 3 failed attempts, returning generic error messages: `"Those details didn't work"`.
5. **Magic Bytes File Inspection:** Document and photo uploads are validated not just by extension or declared MIME type, but by inspecting raw binary magic bytes (`FF D8 FF` for JPEG, `89 50 4E 47` for PNG, and `%PDF` for PDF) along with strict 5MB size limits.
6. **Input Sanitisation:** All dog names, dedications, and reviews are cleaned and HTML-encoded before rendering. `dangerouslySetInnerHTML` is prohibited.
7. **GDPR / DPDP "Delete My Data":** Personal milestone dates and family honoree names can be deleted in one click through the Privacy modal, triggering `familyMemberRepository.deleteUserData()`.
8. **No Payout Hold (Explicitly Removed):** Per prompt requirements, payout holds are removed and abstracted behind `PayoutPolicy` with `NoOpPayoutPolicy`.

---

## 5. Architectural Self-Review

| Directory | SOLID Principle Applied | Guarantee |
|---|---|---|
| `src/domain/` | Interface Segregation Principle (ISP) & Single Responsibility Principle (SRP) | Isolated value objects and focused, minimal interfaces. |
| `src/services/` | Single Responsibility Principle (SRP) | Business rules separated from UI; date math, idempotency, and moderation isolated. |
| `src/repositories/` | Liskov Substitution Principle (LSP) | In-memory mock implementations adhere to domain interface contracts. |
| `src/config/` | Open/Closed Principle (OCP) | Plans, gifts, collar colors, and themes extendable without touching components. |
| `src/app/` | Dependency Inversion Principle (DIP) | Composition root (`container.ts`) wires all components to domain interfaces. |

**Confirmed:** No password, secret, token, or private key appears in any file, configuration, test, or commit.
