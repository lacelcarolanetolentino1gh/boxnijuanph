const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, Table, TableRow, TableCell, WidthType,
  BorderStyle, ShadingType, UnderlineType,
} = require("docx");
const fs = require("fs");
const path = require("path");

// ── Helpers ──────────────────────────────────────────────────────
const color = { green: "5F8F72", dark: "2D2D2D", gray: "6B7280", lightGreen: "EAF2ED", red: "DC2626" };

function h1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: color.green, space: 4 } },
  });
}

function h2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
  });
}

function h3(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 160, after: 60 },
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 22, color: opts.color || color.dark, bold: opts.bold || false, italics: opts.italic || false })],
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    text,
    bullet: { level },
    spacing: { before: 30, after: 30 },
    indent: { left: 360 * (level + 1) },
    children: [new TextRun({ text, size: 21 })],
  });
}

function checkItem(text, indent = 0) {
  return new Paragraph({
    spacing: { before: 30, after: 30 },
    indent: { left: 360 + (360 * indent) },
    children: [
      new TextRun({ text: "\u25A1  " + text, size: 21 }),
    ],
  });
}

function sectionLabel(text) {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    shading: { type: ShadingType.SOLID, color: color.lightGreen },
    children: [
      new TextRun({ text: "  " + text + "  ", bold: true, size: 21, color: color.green }),
    ],
  });
}

function badge(text) {
  return new Paragraph({
    spacing: { before: 80, after: 60 },
    children: [
      new TextRun({ text: "  \u2728 RECENTLY ADDED: " + text + "  ", bold: true, size: 20, color: "FFFFFF", shading: { type: ShadingType.SOLID, color: color.green } }),
    ],
  });
}

function divider() {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB", space: 1 } },
    children: [new TextRun({ text: "" })],
  });
}

function note(text) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    indent: { left: 360 },
    children: [new TextRun({ text: "\u2139\uFE0F  " + text, size: 20, italics: true, color: color.gray })],
  });
}

// ── Document ─────────────────────────────────────────────────────
const doc = new Document({
  creator: "BoxNiJuanPH",
  title: "BoxNiJuanPH — Feature List & QA Test Checklist",
  description: "Recently added features + complete group QA checklist",
  styles: {
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        run: { bold: true, size: 32, color: color.dark },
        paragraph: { spacing: { before: 320, after: 120 } },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        run: { bold: true, size: 26, color: color.green },
        paragraph: { spacing: { before: 240, after: 80 } },
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        run: { bold: true, size: 23, color: color.dark },
        paragraph: { spacing: { before: 160, after: 60 } },
      },
    ],
  },
  sections: [
    {
      properties: { page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
      children: [

        // ── COVER ──────────────────────────────────────────────
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 480, after: 120 },
          children: [new TextRun({ text: "BoxNiJuanPH", bold: true, size: 56, color: color.green })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 60 },
          children: [new TextRun({ text: "Feature List & QA Test Checklist", size: 36, color: color.gray })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 60 },
          children: [new TextRun({ text: "BSITOUMN COMP 047 — PUP Open University System", size: 22, color: color.gray, italics: true })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 480 },
          children: [new TextRun({ text: "June 2026", size: 22, color: color.gray })],
        }),
        divider(),

        // ── PART 1: RECENTLY ADDED FEATURES ───────────────────
        h1("PART 1 — Recently Added Features"),
        body("The following features were implemented during the final development sprint. These are the items your group should be most focused on verifying during QA.", { italic: true }),

        // 1. Product Detail Modal – Products page
        h2("1. Product Detail Modal (Products Page)"),
        badge("New Feature"),
        body("A full-detail popup modal that appears when a user clicks any product card on the /products page."),
        bullet("Triggered by clicking a product card or the 'View Details →' button"),
        bullet("Displays: product image, Local/Eco badges, name, brand, category"),
        bullet("Sections: About, Best For, Contents, Available Variants, Nutrition Facts (if applicable)"),
        bullet("'Add to My Box →' button navigates to /plans"),
        bullet("Closes via: X button, backdrop click, or ESC key"),

        // 2. Loading state on Edit My Box
        h2("2. Edit My Box — Loading State"),
        badge("UX Improvement"),
        body("Prevents user confusion when the 'Edit My Box' button is clicked and there is a navigation delay."),
        bullet("Button shows 'Loading…' text + disabled state immediately on click"),
        bullet("Prevents double-clicking while navigating to /builder"),
        bullet("Restores full opacity when navigation completes"),

        // 3. Builder page ⓘ info modal
        h2("3. Product Info Modal in Box Builder"),
        badge("New Feature"),
        body("A quick-view modal accessible from the ⓘ button on each product card in the /builder page. Solves the mobile UX gap where hover tooltips don't work."),
        bullet("ⓘ button appears on bottom-right of each product card (desktop + mobile)"),
        bullet("Clicking ⓘ opens a full detail modal (same content as Products page modal)"),
        bullet("stopPropagation prevents triggering card selection when tapping ⓘ"),
        bullet("Closes via: 'Got it — back to building' button, backdrop click, ESC key"),

        // 4. Independent Payment Method section
        h2("4. Independent Payment Method Edit Section (Profile)"),
        badge("UX Improvement"),
        body("Separated the Default Payment Method card from Account Details so it can be edited independently."),
        bullet("Payment method section has its own Edit ✏️ button"),
        bullet("Radio group for GCash, Maya, Credit/Debit Card, Cash on Delivery is locked unless in edit mode"),
        bullet("'Save ✓' and 'Cancel' buttons appear inside the card when editing"),
        bullet("'Payment preference saved!' confirmation message shows on successful save"),
        bullet("Editing payment does NOT affect Personal Information editing state"),

        // 5. PH Phone validation
        h2("5. Philippine Phone Number Validation"),
        badge("New Validation"),
        body("Validates PH phone format on both checkout and profile pages."),
        bullet("Accepted formats: 09XXXXXXXXX (11 digits) or +639XXXXXXXXX"),
        bullet("Spaces, dashes, and parentheses are stripped before validation"),
        bullet("Inline error shown below phone field when format is invalid"),
        bullet("Error triggers on field blur AND on form submit"),
        bullet("Applied on: Checkout page (Delivery Information), Profile (Personal Information)"),

        // 6. Address form validation
        h2("6. Address Form Validation (Profile & Checkout)"),
        badge("New Validation"),
        body("All address fields now have inline validation with specific error messages."),
        bullet("Street / Barangay: required, minimum 5 characters"),
        bullet("City / Municipality: required, minimum 2 characters"),
        bullet("ZIP Code: required, must be exactly 4 digits"),
        bullet("Errors appear below each field in red text"),
        bullet("Errors clear as user types a correction"),
        bullet("Applied on: Profile address book add/edit, Checkout delivery form"),

        // 7. Profile Personal Info validation
        h2("7. Profile Personal Information Validation"),
        badge("New Validation"),
        body("Display Name and Phone Number are now required fields with validation in the Profile tab."),
        bullet("Display Name: required, minimum 2 characters"),
        bullet("Phone Number: required, valid PH format"),
        bullet("Both fields marked with red asterisk (*)"),
        bullet("Save button blocked until all fields are valid"),
        bullet("Inline error messages shown below each field"),

        // 8. Checkout field validation
        h2("8. Checkout Required Field Validation"),
        badge("New Validation"),
        body("All checkout fields are validated simultaneously on submit, showing all errors at once."),
        bullet("Fields validated: Full Name, Email, Phone, Address (if new entry), City, ZIP"),
        bullet("'Place Order' button disabled until all fields are valid"),
        bullet("Red border + inline error message per invalid field"),
        bullet("Errors clear as user types corrections"),

        // 9. Save/Cancel per profile section
        h2("9. Per-Section Save/Cancel Buttons (Profile)"),
        badge("UX Improvement"),
        body("Save and Cancel buttons are now inside each card section rather than floating at the bottom."),
        bullet("Personal Information card: its own Edit/Save/Cancel"),
        bullet("Default Payment Method card: its own Edit/Save/Cancel"),
        bullet("Editing one section does not affect the other"),
        bullet("'Personal saved successfully!' and 'Payment preference saved!' confirmations per section"),

        // 10. Unlimited → Up to 12 items
        h2("10. Terminology Fix — 'Unlimited' → 'Up to 12 items'"),
        badge("Copy Fix"),
        body("Removed all instances of 'Unlimited' to accurately describe the Custom plan."),
        bullet("Fixed in: My Box subscription card"),
        bullet("Fixed in: FAQ (Plans & Products section)"),
        bullet("Fixed in: ChatWidget bot response for Custom plan"),
        bullet("Fixed in: Homepage Plans Preview section"),

        // 11. Testimonials section
        h2("11. Testimonials Section (Homepage)"),
        badge("New Section"),
        body("Added a social proof section to the homepage showing 6 subscriber testimonials."),
        bullet("Placed between Plans Preview and CSR sections on homepage"),
        bullet("6 testimonial cards in a 3-column grid"),
        bullet("Each card: star rating, quote, avatar initial, name, location, plan type"),
        bullet("Header: '4.9 out of 5 · 200+ subscribers'"),
        bullet("Cards have hover shadow effect"),
        note("These are sample testimonials for prototype demonstration purposes."),

        // 12. Savings badge – Plans page
        h2("12. Subscription Savings Badge (Plans Page)"),
        badge("New Feature"),
        body("Each plan card now shows a savings comparison vs. buying one-time."),
        bullet("Strikethrough one-time price shown (e.g. '₱549/mo one-time')"),
        bullet("Green 'Save ₱X' pill badge shows the savings amount"),
        bullet("Savings per plan: Basic (₱150), Standard (₱200), Premium (₱300), Custom (₱500)"),

        // 13. Loyalty perks strip
        h2("13. Loyalty Perks Strip (Plans Page)"),
        badge("New Section"),
        body("Added a perks strip below plan cards highlighting subscriber benefits."),
        bullet("4 perks: Birthday Box Voucher, Loyalty Points, Subscriber-Only Deals, Pause Anytime"),
        bullet("Green background (#EAF2ED), icon + label + description per perk"),

        // 14. Wellness Quiz
        h2("14. Wellness Quiz (Homepage)"),
        badge("New Feature"),
        body("An interactive 3-question quiz on the homepage that recommends the best plan for the user."),
        bullet("Question 1: How active is your lifestyle? (Light / Moderate / Very Active)"),
        bullet("Question 2: What's your main wellness goal? (Recovery / Nutrition / Skincare / All-Around)"),
        bullet("Question 3: How many items do you want each month? (Just a few / A good mix / Load me up / I'll pick everything)"),
        bullet("Progress indicator (dots) shows current step"),
        bullet("Result screen: recommended plan name, price, reason, 'Get This Plan →' button"),
        bullet("'Retake Quiz' button resets to step 1"),
        bullet("Placed between How It Works and Video sections on homepage"),
        bullet("Dark theme section (#2D2D2D background) for visual contrast"),

        // 15. Refund / Return Process
        h2("15. Refund / Return Process (Multi-Page Coverage)"),
        badge("UX Improvement"),
        body("The refund and return process is now clearly surfaced across four areas of the app so users always know how to request help."),
        bullet("Confirmation page — amber notice card: 'Not satisfied with your box? Request a refund or replacement within 7 days of delivery.' Links to /faq#returns and includes support email."),
        bullet("My Box (Manage section) — new '↩️ Report an Issue' button that opens /contact?topic=refund"),
        bullet("Contact page — Topic dropdown auto-selects 'Refund or Replacement' when ?topic=refund is in the URL (implemented with useSearchParams + Suspense)"),
        bullet("ChatBot — improved refund reply now includes: 7-day window, required info (order number + photo), response time (1–2 days), refund processing time (5–7 days), and links to /contact and /faq#returns"),

        divider(),

        // ── PART 2: QA TEST CHECKLIST ──────────────────────────
        h1("PART 2 — QA Test Checklist"),
        body("Use the checkboxes below to test every feature of the BoxNiJuanPH prototype. Test as a group — assign sections to each member. Mark each checkbox as you verify it. Note any bugs or issues found."),
        body("Live site: boxnijuanph.vercel.app", { bold: true }),
        note("Use incognito / private browsing for the cleanest test state. Clear localStorage between test users if needed."),

        // SECTION A: Homepage
        sectionLabel("A — HOMEPAGE  (/)"),
        h3("A1. Hero Section"),
        checkItem("Background image loads correctly"),
        checkItem("'Build Your Box' button navigates to /plans"),
        checkItem("'How It Works' button smoothly scrolls to the How It Works section"),
        checkItem("3 trust badges display: Secure checkout, Free delivery, Cancel anytime"),

        h3("A2. Stats Strip"),
        checkItem("4 stats display: 20+ Products, 4 Plans, 100% Filipino Brands, UN SDG 12"),

        h3("A3. How It Works"),
        checkItem("4 steps display with correct icons and descriptions"),

        h3("A4. Wellness Quiz"),
        checkItem("Quiz section visible below 'How It Works'"),
        checkItem("Question 1 shows 3 options (Light, Moderate, Very Active) — click each"),
        checkItem("Clicking an option advances to Question 2"),
        checkItem("Question 2 shows 4 options (Recovery, Nutrition, Skincare, All-Around)"),
        checkItem("Question 3 shows 4 options (Just a few, A good mix, Load me up, I'll pick everything)"),
        checkItem("Progress dots update correctly (dots fill left to right)"),
        checkItem("Result screen shows plan name, price, and reason after Q3"),
        checkItem("'Get This Plan →' button on result navigates to /plans"),
        checkItem("'Retake Quiz' resets quiz back to Question 1"),
        checkItem("Test all 4 Q3 answers each lead to correct plan: Basic / Standard / Premium / Custom"),

        h3("A5. Video Section"),
        checkItem("Explainer video loads and autoplays (muted)"),
        checkItem("Video controls work (play/pause)"),
        checkItem("Privacy Policy link in caption works"),

        h3("A6. Featured Products"),
        checkItem("4 product cards display with images"),
        checkItem("Local (🇵🇭) and Eco (♻️) badges show on applicable products"),
        checkItem("'Browse All Products →' navigates to /products"),

        h3("A7. Plans Preview"),
        checkItem("4 plan cards display with images and prices"),
        checkItem("'Choose [Plan]' buttons each navigate to /plans"),

        h3("A8. Testimonials"),
        checkItem("6 testimonial cards display in 3-column grid"),
        checkItem("Each card shows: star rating, quote, avatar initial, name, location, plan"),
        checkItem("'4.9 out of 5 · 200+ subscribers' header shows"),
        checkItem("Hover shadow effect works on cards"),

        h3("A9. CSR Section"),
        checkItem("3 CSR cards display with icons and text"),

        h3("A10. CTA Banner"),
        checkItem("Background image loads"),
        checkItem("'Get Started Today →' button navigates to /plans"),

        // SECTION B: Plans
        sectionLabel("B — PLANS PAGE  (/plans)"),
        h3("B1. Plan Cards"),
        checkItem("All 4 plan cards display: Basic, Standard, Premium, Custom"),
        checkItem("Savings badge shows (e.g. '₱549/mo one-time' strikethrough + 'Save ₱150' green pill) on each card"),
        checkItem("'Most Popular' badge on Standard plan"),
        checkItem("'Best Value' badge on Premium plan"),
        checkItem("'Most Flexible' badge on Custom plan"),
        checkItem("'Choose Basic' → navigates to /builder with Basic plan loaded"),
        checkItem("'Choose Standard' → navigates to /builder with Standard plan loaded"),
        checkItem("'Choose Premium' → navigates to /builder with Premium plan loaded"),
        checkItem("'Build Custom Box' → navigates to /builder with Custom plan loaded"),

        h3("B2. Plan Selection with Existing Items"),
        checkItem("Add items in builder, go back to /plans, click a DIFFERENT plan"),
        checkItem("Warning modal appears: 'You have items saved in your current box'"),
        checkItem("'Yes, start fresh' clears items and loads new plan in builder"),
        checkItem("'Keep my current items' dismisses modal and stays on /plans"),

        h3("B3. Loyalty Perks Strip"),
        checkItem("Perks strip shows below plan cards"),
        checkItem("4 perks display: Birthday Box Voucher, Loyalty Points, Subscriber-Only Deals, Pause Anytime"),

        h3("B4. Plan Comparison Tables"),
        checkItem("Plan Comparison table: 9 rows of features display correctly"),
        checkItem("Standard column highlighted in green"),
        checkItem("Competitor Comparison table: 4 competitor rows + BoxNiJuanPH highlighted row"),

        h3("B5. Footer"),
        checkItem("'All plans include free delivery within Metro Manila. Cancel anytime.' shown below cards"),

        // SECTION C: Builder
        sectionLabel("C — BOX BUILDER  (/builder)"),
        h3("C1. Plan Loading"),
        checkItem("Builder loads with correct plan from /plans selection"),
        checkItem("Plan name and item count shown in heading (e.g. 'Basic Plan — Choose 3 items')"),
        checkItem("Progress bar starts at 0"),
        checkItem("Custom plan shows 'up to 12 items' in heading"),

        h3("C2. Filter Bar"),
        checkItem("Search input filters products by name, brand, category"),
        checkItem("Clear X button appears when text is entered — clears the search on click"),
        checkItem("Category dropdown filters correctly for all 4 categories"),
        checkItem("Brand dropdown filters correctly"),
        checkItem("'🇵🇭 Local brands only' checkbox filters to local products only"),
        checkItem("'Clear filters' button resets all filters at once"),
        checkItem("'No items in this category.' message shows when no results"),

        h3("C3. Product Selection (Fixed Plans)"),
        checkItem("Clicking a product card opens the Variant Modal"),
        checkItem("Variant modal shows product thumbnail, name, all variants"),
        checkItem("Selecting a variant and clicking 'Add to Box →' adds product to box"),
        checkItem("Selected card shows green border + checkmark"),
        checkItem("Progress bar updates after each addition"),
        checkItem("When box is full (e.g. 3/3 for Basic), unselected cards go gray/disabled"),
        checkItem("'✓ Box complete!' message appears when full"),
        checkItem("Clicking a selected product removes it"),
        checkItem("Removing a product re-enables disabled cards"),
        checkItem("'Review My Box →' button activates only when box is full"),
        checkItem("Already-taken variants show 'already in box' label in modal and are disabled"),

        h3("C4. Product Selection (Custom Plan)"),
        checkItem("Can add up to 12 items, no category restrictions"),
        checkItem("Can add multiple variants of the same product"),
        checkItem("Qty badge (×2, ×3…) shows on card image when multiple variants selected"),
        checkItem("'+ Add another variant' hint shows on card when more variants available"),
        checkItem("'Save My Box ✓' button active when at least 1 item selected → goes to /my-box"),
        checkItem("'Review & Order →' button active when at least 1 item → goes to /summary"),

        h3("C5. Product Info Modal (ⓘ button)"),
        checkItem("ⓘ button visible on bottom-right of each non-disabled card"),
        checkItem("ⓘ button is NOT visible on disabled/grayed-out cards"),
        checkItem("Clicking ⓘ opens info modal WITHOUT selecting the product"),
        checkItem("Modal shows: About, Best For, Contents, Available Variants"),
        checkItem("Nutrition Facts section shows for snack products (Energy Bars, Trail Mix, etc.)"),
        checkItem("'Got it — back to building' button closes modal"),
        checkItem("Backdrop click closes modal"),
        checkItem("ESC key closes modal"),

        h3("C6. Desktop Summary Panel"),
        checkItem("Right sidebar shows 'No items selected yet.' when empty"),
        checkItem("Added items appear in the sidebar with thumbnail, name, variant"),
        checkItem("Remove (X) button on each item works"),
        checkItem("'Add X more items' text updates as items are added"),

        h3("C7. Tooltip (Desktop Hover)"),
        checkItem("Hovering a product card for ~400ms shows tooltip"),
        checkItem("Tooltip shows product description, purpose, contents"),
        checkItem("Snack products show nutrition facts in tooltip"),
        checkItem("Tooltip disappears on mouse leave"),
        checkItem("No tooltip on disabled cards"),

        h3("C8. Back Navigation"),
        checkItem("'← Back to Plans' link navigates to /plans"),

        // SECTION D: Summary
        sectionLabel("D — BOX SUMMARY  (/summary)"),
        h3("D1. Content Display"),
        checkItem("Plan card shows correct plan name, description, price"),
        checkItem("All selected items display with thumbnail, name, variant, category"),
        checkItem("Local and Eco badges show on applicable items"),

        h3("D2. Edit Items"),
        checkItem("Pencil (edit) button on each item opens Change Option modal"),
        checkItem("Can swap to a different variant — modal shows taken variants as disabled"),
        checkItem("Saving variant change updates the item in the list"),
        checkItem("X (remove) button removes item from the list"),
        checkItem("Warning banner shows if below minimum after removal: 'Your plan requires X items.'"),
        checkItem("'Proceed to Checkout' disabled when below minimum"),

        h3("D3. CSR Impact Note"),
        checkItem("Count of local brands in box shows correctly"),
        checkItem("Count of eco-friendly items shows correctly"),

        h3("D4. Navigation"),
        checkItem("'← Edit Box' returns to /builder"),
        checkItem("'Proceed to Checkout →' navigates to /checkout when box is complete"),

        // SECTION E: Checkout
        sectionLabel("E — CHECKOUT  (/checkout)"),
        h3("E1. Guest State"),
        checkItem("Guest warning banner shows when not logged in"),
        checkItem("'Sign In Instead' link goes to /login?redirect=/checkout"),

        h3("E2. Logged-In State"),
        checkItem("Green 'Signed in as [Name]' chip shows when logged in"),
        checkItem("Saved addresses appear as radio options (if user has saved addresses)"),
        checkItem("Default address is pre-selected"),
        checkItem("Selecting 'Use a different address' reveals new address form"),

        h3("E3. Delivery Form Validation"),
        checkItem("Leaving Full Name empty → 'Full Name is required' error on submit"),
        checkItem("Leaving Email empty → error on submit"),
        checkItem("Entering invalid email format → error on submit"),
        checkItem("Leaving Phone empty → 'Phone number is required' error"),
        checkItem("Entering '12345' (invalid PH format) → error on blur + on submit"),
        checkItem("Entering '09171234567' → valid, no error"),
        checkItem("Entering '+639171234567' → valid, no error"),
        checkItem("Typing in a field clears its error message"),

        h3("E4. Address Form Validation (New Address)"),
        checkItem("Selecting 'Use a different address' reveals the inline address form fields"),
        checkItem("Address form is hidden when a saved address radio option is selected"),
        checkItem("Street less than 5 chars → error on submit"),
        checkItem("City less than 2 chars → error on submit"),
        checkItem("ZIP with letters or not exactly 4 digits → error on submit"),
        checkItem("All 3 fields correct → no errors, submit proceeds"),

        h3("E5. Payment Method"),
        checkItem("4 payment options show: GCash, Maya, Credit/Debit, Cash on Delivery"),
        checkItem("Selecting different options changes radio selection"),

        h3("E6. Order Summary"),
        checkItem("Right panel shows all items from builder"),
        checkItem("Plan name and price shown"),
        checkItem("'Place Order →' disabled until form is complete"),

        h3("E7. Confirmation Modal"),
        checkItem("Clicking 'Place Order →' on complete form opens confirmation modal"),
        checkItem("Modal shows: delivery name, address, plan, price"),
        checkItem("'← Go Back' dismisses modal"),
        checkItem("'Confirm Order' generates order number and navigates to /confirmation"),

        // SECTION F: Confirmation
        sectionLabel("F — CONFIRMATION  (/confirmation)"),
        checkItem("Green checkmark and 'Order Confirmed!' heading show"),
        checkItem("Order number in BNJ-XXXXXX format shows (monospace)"),
        checkItem("All ordered items listed with images"),
        checkItem("Local brand count and eco-item count correct"),
        checkItem("'What Happens Next' steps display correctly"),
        checkItem("Amber refund notice card shows: 'Not satisfied with your box? Request a refund or replacement within 7 days of delivery…'"),
        checkItem("Refund notice card includes support@boxnijuanph.com email address"),
        checkItem("'See full return policy →' link in refund notice card navigates to /faq#returns"),
        checkItem("'Back to Home' navigates to /"),
        checkItem("'View My Subscription →' navigates to /my-box"),
        checkItem("'Build Another Box' navigates to /plans"),

        // SECTION G: My Box
        sectionLabel("G — MY BOX  (/my-box)"),
        h3("G1. No Subscription State"),
        checkItem("'No Active Subscription' message shows for new users"),
        checkItem("'Choose a Plan →' button navigates to /plans"),

        h3("G2. Active Subscription"),
        checkItem("Plan name, price, status badge, next delivery date show correctly"),
        checkItem("Box contents list shows all items from last order"),
        checkItem("Item count (X / Y) is accurate"),
        checkItem("Local and Eco badges display on applicable items"),

        h3("G3. Edit My Box"),
        checkItem("'Edit My Box ✏️' button click shows 'Loading…' immediately (disabled state)"),
        checkItem("Navigates to /builder with current items pre-loaded"),
        checkItem("After editing and saving, returning to /my-box shows updated items"),

        h3("G4. Pause / Resume Subscription"),
        checkItem("'⏸ Pause Subscription' button is visible for active subscriptions"),
        checkItem("Clicking pause shows a pause modal with 1–3 month options"),
        checkItem("Confirming pause shows amber 'Subscription paused · Resumes on [Date]' banner"),
        checkItem("'▶ Resume Subscription' button shows when paused"),
        checkItem("Clicking resume and confirming restores active status"),
        checkItem("'Resume now' link in banner also works"),

        h3("G5. Cancel Subscription"),
        checkItem("'Cancel Subscription' link visible in Manage section"),
        checkItem("Clicking shows cancel confirmation modal"),
        checkItem("Confirming cancel changes state to 'Subscription Cancelled'"),
        checkItem("Cancelled state shows 'Resubscribe' options"),

        h3("G5b. Report an Issue Button"),
        checkItem("'↩️ Report an Issue' button visible in Manage section (above Cancel Subscription)"),
        checkItem("Clicking '↩️ Report an Issue' navigates to /contact?topic=refund"),
        checkItem("On /contact, Topic dropdown is pre-selected to 'Refund or Replacement'"),

        h3("G6. Switch to Custom Box"),
        checkItem("'Switch to Custom Box' button visible for non-custom plans"),
        checkItem("Clicking navigates to /builder with Custom plan loaded"),

        h3("G7. Profile Tab — Personal Information"),
        checkItem("'Edit ✏️' button enters edit mode for Personal Information"),
        checkItem("Display Name field is required (red asterisk shown)"),
        checkItem("Phone Number field is required (red asterisk shown)"),
        checkItem("Leaving Display Name blank → error on save attempt"),
        checkItem("Display Name less than 2 chars → error on save"),
        checkItem("Entering invalid phone (e.g. '12345') → PH phone error on save"),
        checkItem("Valid name + valid phone → saves with 'Personal saved successfully!'"),
        checkItem("'Cancel' exits edit mode without saving changes"),

        h3("G8. Profile Tab — Default Payment Method"),
        checkItem("Radio buttons are disabled when NOT in edit mode"),
        checkItem("'Edit ✏️' button activates payment radio selection independently"),
        checkItem("Selecting a different payment option and saving → 'Payment preference saved!'"),
        checkItem("'Cancel' exits payment edit without saving"),
        checkItem("Editing payment does NOT open Personal Information edit mode"),

        h3("G9. Profile Tab — Address Book"),
        checkItem("'+ Add Address' button shows (if under 3 addresses)"),
        checkItem("'+ Add Address' button disappears once 3 addresses are saved (maximum reached)"),
        checkItem("Address form expands on click"),
        checkItem("Street less than 5 chars → error on save"),
        checkItem("City less than 2 chars → error on save"),
        checkItem("ZIP not 4 digits → error on save"),
        checkItem("Valid address saves and appears in list with label (Home/Office/Other)"),
        checkItem("'Edit' button on address reopens form with existing values"),
        checkItem("'Delete' button removes address from list"),
        checkItem("'Set as Default' marks address with 'Default' badge"),
        checkItem("'Address saved!' confirmation shows on successful save"),

        h3("G10. Profile Tab — Photo Upload"),
        checkItem("'Upload Photo' button opens file picker"),
        checkItem("Selecting image > 2MB shows file size error"),
        checkItem("Accepted formats: JPG, PNG, WebP"),
        checkItem("Selecting valid image shows photo as avatar"),
        checkItem("'Remove' button clears photo and reverts to initial avatar"),

        h3("G11. Logout"),
        checkItem("'Log Out' button in Profile tab logs out user"),
        checkItem("Navbar updates to show 'Sign In' instead of avatar"),
        checkItem("Logout toast shows 'See you soon, [Name]!'"),

        h3("G12. Order History"),
        checkItem("Past orders show if user has cancelled and resubscribed before"),
        checkItem("'Resubscribe to this plan →' link works from order history"),

        // SECTION H: Products Page
        sectionLabel("H — PRODUCTS PAGE  (/products)"),
        checkItem("All products from catalog display"),
        checkItem("Search bar filters by name, brand, category, description"),
        checkItem("Category filter works for all 4 categories"),
        checkItem("Brand filter works for all brands"),
        checkItem("Local-only checkbox filters correctly"),
        checkItem("'X products found' count updates with filters"),
        checkItem("'Clear filters' resets all at once"),
        checkItem("Clicking product card opens Product Detail Modal"),
        checkItem("Modal: About, Best For, Contents, Variants sections show"),
        checkItem("Nutrition Facts show for applicable products (snacks)"),
        checkItem("Modal closes: X button, backdrop click, ESC key"),
        checkItem("'Add to My Box →' inside modal navigates to /plans"),
        checkItem("Bottom CTA: 'See Plans & Pricing →' navigates to /plans"),

        // SECTION I: Login
        sectionLabel("I — LOGIN PAGE  (/login)"),
        h3("I1. Sign Up"),
        checkItem("Google / Apple / Facebook buttons show"),
        checkItem("Clicking social button shows provider quick-path with Name + Email fields"),
        checkItem("Completing social provider form + submit logs in and goes to homepage"),
        checkItem("Email sign-up: all required fields validate on submit"),
        checkItem("Username field: rejects spaces, auto-lowercases"),
        checkItem("Password strength meter updates in real time"),
        checkItem("Checklist: 8+ chars, uppercase, number, special char"),
        checkItem("'Passwords do not match' error shows when confirm doesn't match"),
        checkItem("'✓ Passwords match' shows when they match"),
        checkItem("Successful sign-up → navigates home + 'Welcome, [Name]!' toast"),

        h3("I2. Sign In"),
        checkItem("Empty email or password → inline errors"),
        checkItem("Invalid email format → error"),
        checkItem("Valid credentials → navigates home + 'Welcome back, [Name]!' toast"),
        checkItem("Redirect works: if accessed from /checkout, returns to /checkout after login"),

        h3("I3. Guest Checkout"),
        checkItem("'Continue as guest' link expands warning card"),
        checkItem("Warning lists 4 limitations with ✕ icons"),
        checkItem("'Sign In Instead (Recommended)' button collapses warning back"),
        checkItem("'I understand — continue as guest anyway' proceeds without login"),

        // SECTION J: FAQ
        sectionLabel("J — FAQ PAGE  (/faq)"),
        checkItem("6 topic anchor links in header (Delivery, Returns, Cancellation, Payment, Plans, Privacy)"),
        checkItem("Clicking each anchor link scrolls to correct section"),
        checkItem("Each FAQ item is collapsible — click to open/close"),
        checkItem("Chevron rotates on open"),
        checkItem("All 23 Q&As display with correct content"),
        checkItem("'Contact Support' button navigates to /contact"),
        checkItem("'Email Us Directly' opens mailto:support@boxnijuanph.com"),

        // SECTION K: Contact
        sectionLabel("K — CONTACT PAGE  (/contact)"),
        checkItem("4 info cards display (After-Sales, Delivery, Returns, Live Chat)"),
        checkItem("Email link (support@boxnijuanph.com) is clickable"),
        checkItem("Contact form: Full Name, Email, Order Number (optional), Topic, Message"),
        checkItem("Submitting with empty required fields shows inline errors"),
        checkItem("Invalid email format → error"),
        checkItem("Message less than 10 chars → error"),
        checkItem("Character count displays under message textarea"),
        checkItem("Character count is gray when under 10 chars, turns green when 10+ chars"),
        checkItem("Successful submit → success state with personalized message"),
        checkItem("'Send Another Message' resets form"),
        checkItem("Navigating to /contact?topic=refund pre-selects 'Refund or Replacement' in Topic dropdown"),
        checkItem("Without ?topic=refund, Topic dropdown starts on 'Select a topic…'"),

        // SECTION L: Navbar
        sectionLabel("L — NAVBAR"),
        checkItem("Logo navigates to homepage"),
        checkItem("All nav links (Home, Plans, Products, FAQ, Contact) work correctly"),
        checkItem("'Build Your Box' CTA button navigates to /plans"),
        checkItem("'Sign In' shows when logged out — navigates to /login?redirect=[current-page]"),
        checkItem("Avatar + 'Hi, [Name]' shows when logged in — navigates to /my-box?tab=profile"),
        checkItem("'My Box' link shows when logged in"),
        checkItem("'Log Out' button logs out and shows toast"),
        checkItem("Active page is highlighted in green"),
        checkItem("Mobile: hamburger menu opens/closes the nav"),
        checkItem("Mobile: all nav links work inside the menu"),
        checkItem("Mobile: 'Build Your Box' button is full width in menu"),

        // SECTION M: ChatBot
        sectionLabel("M — CHATBOT (BoxBot)"),
        checkItem("Chat bubble visible (bottom-right) on all pages"),
        checkItem("Red dot indicator visible on bubble"),
        checkItem("Clicking bubble opens chat panel"),
        checkItem("Bot sends a greeting message on first open"),
        checkItem("6 quick reply buttons visible above input"),
        checkItem("Clicking a quick reply populates input + sends message"),
        checkItem("Typing a message and clicking Send → bot responds within ~1 second"),
        checkItem("Typing indicator (3 bouncing dots) shows before bot response"),
        checkItem("Bot responds to: cancel, refund, delivery, payment, plans, privacy"),
        checkItem("'Refund' quick reply button — bot response mentions: 7-day delivery window"),
        checkItem("'Refund' response includes: email support@boxnijuanph.com, order number + photo required"),
        checkItem("'Refund' response mentions 1–2 business day reply time + 5–7 day processing time"),
        checkItem("'Refund' response shows 'Report an Issue →' link to /contact and 'FAQ: Returns →' link to /faq#returns"),
        checkItem("Bot shows product cards when asked about products/categories"),
        checkItem("'Add to builder →' links on product cards navigate to /builder (not /plans)"),
        checkItem("Minimize button (chevron) shrinks panel to header only"),
        checkItem("Maximize button (or click header) expands panel again"),
        checkItem("X button closes chat"),
        checkItem("ESC key closes chat"),
        checkItem("Trash icon clears chat history"),
        checkItem("After clearing, chat restarts with greeting"),
        checkItem("Chat history persists after page navigation (localStorage)"),
        checkItem("Returning user after login sees 'Continue chat' / 'Start fresh' prompt"),

        // SECTION N: Privacy
        sectionLabel("N — PRIVACY PAGE  (/privacy)"),
        checkItem("8 sections display with correct headings"),
        checkItem("'Back to Home' link works"),
        checkItem("National Privacy Commission link present in Section 8"),

        // SECTION O: Complete User Flows
        sectionLabel("O — END-TO-END USER FLOWS"),
        h3("O1. Guest Purchase Flow"),
        checkItem("Homepage → Plans → Builder (select items) → Summary → Checkout (as guest) → Confirmation"),
        checkItem("Correct plan, items, and order number carry through the whole flow"),

        h3("O2. Registered User Purchase Flow"),
        checkItem("Sign Up → Homepage → Plans → Builder → Summary → Checkout (signed in) → Confirmation"),
        checkItem("Order saved to My Box after confirmation"),
        checkItem("My Box shows correct subscription with all items"),

        h3("O3. Login Redirect Flow"),
        checkItem("Build box as guest → go to checkout → click 'Sign In Instead' → login → lands back on /checkout with items intact"),

        h3("O4. Edit Box Flow"),
        checkItem("My Box → 'Edit My Box' → Loading… → Builder pre-loaded with current items → Update items → Save → My Box updated"),

        h3("O5. Pause & Resume Flow"),
        checkItem("My Box → Pause Subscription → select months → confirm → amber banner shows → Resume → green active status returns"),

        h3("O6. Cancel & Resubscribe Flow"),
        checkItem("My Box → Cancel Subscription → confirm → cancelled state shown → Resubscribe → redirected to /plans"),

        h3("O7. Wellness Quiz → Plan → Build Flow"),
        checkItem("Homepage Quiz → answer questions → 'Get This Plan →' → Plans page → choose plan → Builder"),

        // ── BUG LOG ────────────────────────────────────────────
        divider(),
        h1("PART 3 — Bug / Issue Log"),
        body("Use this section to record any issues found during testing.", { italic: true }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "#", bold: true, size: 20 })] })], width: { size: 5, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.SOLID, color: "2D2D2D" } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Page / Feature", bold: true, size: 20, color: "FFFFFF" })] })], width: { size: 25, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.SOLID, color: "2D2D2D" } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Issue Description", bold: true, size: 20, color: "FFFFFF" })] })], width: { size: 45, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.SOLID, color: "2D2D2D" } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Severity", bold: true, size: 20, color: "FFFFFF" })] })], width: { size: 15, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.SOLID, color: "2D2D2D" } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true, size: 20, color: "FFFFFF" })] })], width: { size: 10, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.SOLID, color: "2D2D2D" } }),
              ],
            }),
            ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) =>
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(n), size: 20 })] })], width: { size: 5, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: " ", size: 20 })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: " ", size: 20 })] })], width: { size: 45, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: " ", size: 20 })] })], width: { size: 15, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: " ", size: 20 })] })], width: { size: 10, type: WidthType.PERCENTAGE } }),
                ],
              })
            ),
          ],
        }),

        new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "Severity scale: Low | Medium | High | Critical", size: 18, italics: true, color: color.gray })] }),
        new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: "Status: Open | Fixed | Won't Fix | Not a Bug", size: 18, italics: true, color: color.gray })] }),

        divider(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 0 },
          children: [new TextRun({ text: "BoxNiJuanPH · BSITOUMN COMP 047 · PUP Open University System · June 2026", size: 18, color: color.gray, italics: true })],
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  const outPath = path.join("C:/Users/I331629/Documents/BoxNiJuanPH-guide", "BoxNiJuanPH_QA_Checklist.docx");
  fs.writeFileSync(outPath, buffer);
  console.log("Done:", outPath);
});
