const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, Table, TableRow, TableCell, WidthType,
  BorderStyle, ShadingType,
} = require("docx");
const fs = require("fs");
const path = require("path");

const green = "5F8F72";
const dark = "2D2D2D";
const gray = "6B7280";
const lightGreen = "EAF2ED";
const amber = "92400E";
const amberBg = "FFFBEB";
const red = "DC2626";
const blue = "1D4ED8";

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: green, space: 4 } },
    children: [new TextRun({ text, bold: true, size: 34, color: dark })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 80 },
    children: [new TextRun({ text, bold: true, size: 27, color: green })],
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 60 },
    children: [new TextRun({ text, bold: true, size: 23, color: dark })],
  });
}
function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 50, after: 50 },
    children: [new TextRun({ text, size: 21, color: opts.color || dark, bold: opts.bold || false, italics: opts.italic || false })],
  });
}
function step(num, text) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    indent: { left: 360 },
    children: [
      new TextRun({ text: `${num}.  `, bold: true, size: 21, color: green }),
      new TextRun({ text, size: 21, color: dark }),
    ],
  });
}
function expect(text) {
  return new Paragraph({
    spacing: { before: 30, after: 30 },
    indent: { left: 720 },
    children: [
      new TextRun({ text: "\u2713  Expected: ", bold: true, size: 20, color: green }),
      new TextRun({ text, size: 20, color: dark, italics: true }),
    ],
  });
}
function warn(text) {
  return new Paragraph({
    spacing: { before: 30, after: 30 },
    indent: { left: 720 },
    children: [
      new TextRun({ text: "\u26A0\uFE0F  Note: ", bold: true, size: 20, color: amber }),
      new TextRun({ text, size: 20, color: amber }),
    ],
  });
}
function tip(text) {
  return new Paragraph({
    spacing: { before: 30, after: 30 },
    indent: { left: 720 },
    children: [
      new TextRun({ text: "\u1F4A1  Tip: ", bold: true, size: 20, color: blue }),
      new TextRun({ text, size: 20, color: blue }),
    ],
  });
}
function divider() {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB", space: 1 } },
    children: [new TextRun({ text: "" })],
  });
}
function sectionBanner(label, desc) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    shading: { type: ShadingType.SOLID, color: dark },
    children: [
      new TextRun({ text: `  ${label}`, bold: true, size: 24, color: "7CAE8E" }),
      new TextRun({ text: `  —  ${desc}`, size: 20, color: "CCCCCC" }),
    ],
  });
}
function subBanner(label) {
  return new Paragraph({
    spacing: { before: 140, after: 60 },
    shading: { type: ShadingType.SOLID, color: lightGreen },
    children: [new TextRun({ text: `  ${label}  `, bold: true, size: 20, color: green })],
  });
}
function blank() {
  return new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun("")] });
}

// ── Document ─────────────────────────────────────────────────────
const doc = new Document({
  creator: "BoxNiJuanPH",
  title: "BoxNiJuanPH — QA Testing Guide (How-To per Checklist Item)",
  sections: [{
    properties: { page: { margin: { top: 1080, bottom: 1080, left: 1134, right: 1134 } } },
    children: [

      // COVER
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 480, after: 100 }, children: [new TextRun({ text: "BoxNiJuanPH", bold: true, size: 60, color: green })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "QA Testing Guide", size: 40, color: dark, bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "Step-by-step instructions for every item in the QA Checklist", size: 24, color: gray, italics: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "BSITOUMN COMP 047 — PUP Open University System", size: 22, color: gray })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 480 }, children: [new TextRun({ text: "June 2026", size: 22, color: gray })] }),
      divider(),

      // HOW TO USE
      h1("How to Use This Guide"),
      body("This document pairs with the QA Checklist (BoxNiJuanPH_QA_Checklist.docx). For every section and test item in the checklist, this guide tells you exactly how to perform the test — what to click, what to type, and what the expected result should be."),
      blank(),
      body("Before You Start:", { bold: true }),
      step(1, "Open the live site in your browser: boxnijuanph.vercel.app"),
      step(2, "Open a second tab for incognito / private browsing (Chrome: Ctrl+Shift+N / Edge: Ctrl+Shift+P) to test logged-out flows without interference from any saved login."),
      step(3, "Keep the QA Checklist open side-by-side. Tick each box as you verify it."),
      step(4, "Use the Bug Log table in the checklist to record anything that looks wrong."),
      blank(),
      body("Test Accounts to Use:", { bold: true }),
      body("Since BoxNiJuanPH is a prototype with simulated auth, you can use any email + password combination. Suggested test accounts:"),
      step(1, "New user: testuser1@gmail.com / Test@1234"),
      step(2, "Second user (to test isolation): testuser2@gmail.com / Test@1234"),
      warn("Always use different email addresses for different test users. All data is stored per email in localStorage."),
      blank(),
      body("How to Reset State:", { bold: true }),
      step(1, "Open browser DevTools (F12)"),
      step(2, "Go to Application tab → Local Storage → http://boxnijuanph.vercel.app"),
      step(3, "Click 'Clear All' to wipe all saved data and start fresh"),
      divider(),

      // ─────────────────────────────────────────────────────────
      // SECTION A: HOMEPAGE
      // ─────────────────────────────────────────────────────────
      sectionBanner("A — HOMEPAGE", "boxnijuanph.vercel.app/"),

      subBanner("A1. Hero Section"),
      body("How to test:"),
      step(1, "Navigate to the homepage (/)."),
      step(2, "Verify the background photo of a person exercising is visible, with a dark gradient overlay on the left."),
      step(3, "Read the headline — it should say 'Your Personal Wellness Box Every Month'."),
      step(4, "Click 'Build Your Box →'. You should be taken to /plans."),
      step(5, "Go back. Click 'How It Works'. The page should smoothly scroll down to the How It Works section (no page reload)."),
      step(6, "Confirm the 3 trust badges are visible below the buttons: '🔒 Secure checkout', '🚚 Free Metro Manila delivery', '↩️ Cancel anytime'."),

      subBanner("A2–A3. Stats Strip & How It Works"),
      body("How to test:"),
      step(1, "Scroll just below the hero. The green stats strip should show: '20+ Wellness Products', '4 Flexible Plans', '100% Filipino Brands', 'UN SDG 12 Aligned'."),
      step(2, "Scroll further to the How It Works section. Confirm 4 numbered steps show with icons."),
      step(3, "Check the text on each step matches: Choose Your Plan → Build Your Box → Review & Checkout → Receive Your Box."),

      subBanner("A4. Wellness Quiz"),
      body("How to test:"),
      step(1, "Scroll past How It Works. You should see a dark-themed section titled 'Wellness Quiz'."),
      step(2, "Confirm the progress dots (3 dots) appear at the top of the quiz card."),
      step(3, "Question 1 should show: 'How active is your lifestyle?' with 3 options."),
      step(4, "Click 'Light'. The quiz should immediately advance to Question 2 with the second dot highlighted."),
      step(5, "Click any option on Question 2 (e.g. 'Recovery'). Advances to Question 3."),
      step(6, "On Question 3, click 'Just a few'. The result screen should appear."),
      expect("Result shows 'Basic Plan', '₱399/mo', and a reason. A 'Get This Plan →' button appears."),
      step(7, "Click 'Get This Plan →'. Should go to /plans."),
      step(8, "Go back to homepage. Scroll to quiz. Click 'Retake Quiz'. Quiz resets to Question 1."),
      step(9, "Test all 4 options on Question 3 to verify correct plan matching:"),
      body("     'Just a few' → Basic Plan", { italic: true }),
      body("     'A good mix' → Standard Plan", { italic: true }),
      body("     'Load me up' → Premium Plan", { italic: true }),
      body("     'I'll pick everything' → Custom Plan", { italic: true }),
      warn("You need to retake the quiz for each option since Q3 is the last step."),

      subBanner("A5. Video Section"),
      body("How to test:"),
      step(1, "Scroll to the 'Built for Active Filipinos' section."),
      step(2, "The video should be auto-playing (muted) in a rounded container."),
      step(3, "Click the play/pause control to verify controls work."),
      step(4, "Click the 'Privacy Policy' link below the video. Should go to /privacy."),

      subBanner("A6. Featured Products"),
      body("How to test:"),
      step(1, "Scroll to 'Featured Products'. 4 product cards should be visible."),
      step(2, "Confirm some cards have '🇵🇭 Local' or '♻️ Eco' badges."),
      step(3, "Click 'Browse All Products →'. Should go to /products."),

      subBanner("A7. Plans Preview"),
      body("How to test:"),
      step(1, "Scroll to the dark 'Plans for Every Lifestyle' section. 4 plan cards show."),
      step(2, "Click 'Choose Basic' → should go to /plans. Go back."),
      step(3, "Repeat for Standard, Premium, and Custom."),

      subBanner("A8. Testimonials"),
      body("How to test:"),
      step(1, "Scroll to the 'Real People. Real Boxes.' section."),
      step(2, "Confirm '4.9 out of 5 · 200+ subscribers' shows below the section heading."),
      step(3, "Count the testimonial cards — there should be 6 total in a 3-column grid."),
      step(4, "Each card should show: stars, a quote in quotation marks, an avatar circle with initials, name, city, and plan type."),
      step(5, "Hover a card — it should lift slightly (shadow increases)."),

      subBanner("A9–A10. CSR Section & CTA Banner"),
      body("How to test:"),
      step(1, "Scroll to 'CSR & Sustainability'. 3 commitment cards with icons should show."),
      step(2, "Scroll to the bottom CTA banner. Green background with a white button."),
      step(3, "Click 'Get Started Today →'. Should go to /plans."),

      // ─────────────────────────────────────────────────────────
      // SECTION B: PLANS
      // ─────────────────────────────────────────────────────────
      sectionBanner("B — PLANS PAGE", "boxnijuanph.vercel.app/plans"),

      subBanner("B1. Plan Cards & Savings Badge"),
      body("How to test:"),
      step(1, "Go to /plans."),
      step(2, "Confirm 4 cards: Basic (₱399), Standard (₱599), Premium (₱899), Custom (₱1,299)."),
      step(3, "On each card, look just below the price. You should see:"),
      body("     A gray strikethrough price (e.g. '₱549/mo one-time')", { italic: true }),
      body("     A green pill badge (e.g. 'Save ₱150')", { italic: true }),
      step(4, "Confirm the badge labels: Basic = Save ₱150, Standard = Save ₱200, Premium = Save ₱300, Custom = Save ₱500."),
      step(5, "Confirm badges: Standard = 'Most Popular', Premium = 'Best Value', Custom = 'Most Flexible'."),
      step(6, "Click 'Choose Basic' → lands on /builder. Confirm heading says 'Basic Plan — Choose 3 items'. Go back."),
      step(7, "Repeat for Standard (5 items), Premium (8 items), and Custom (up to 12 items)."),

      subBanner("B2. Warning Modal When Switching Plans"),
      body("How to test:"),
      step(1, "Go to /plans. Click 'Choose Basic'. In the builder, select 2 products."),
      step(2, "Go back to /plans (/plans — use the Back link in the builder, not the browser back button)."),
      step(3, "Click 'Choose Standard' (a different plan than what you had)."),
      expect("A modal appears: 'You have items saved in your current box. Switching will clear your selections.'"),
      step(4, "Click 'Keep my current items'. Modal closes, you stay on /plans."),
      step(5, "Click 'Choose Standard' again. Modal appears again."),
      step(6, "Click 'Yes, start fresh with Standard'. Should go to builder with Standard plan and empty box."),

      subBanner("B3. Loyalty Perks Strip"),
      body("How to test:"),
      step(1, "Below the 4 plan cards, look for a light green box."),
      step(2, "Confirm the label 'SUBSCRIBER PERKS — INCLUDED IN EVERY PLAN' shows."),
      step(3, "Confirm 4 perks with icons: 🎁 Birthday Box Voucher, 🔁 Loyalty Points, 🏷️ Subscriber-Only Deals, ⏸️ Pause Anytime."),
      step(4, "Each perk should have a description line below its name."),

      subBanner("B4–B5. Plan Comparison Tables & Footer"),
      body("How to test:"),
      step(1, "Scroll below the perks strip. A 'Plan Comparison' table shows."),
      step(2, "Verify the Standard column has a green header cell."),
      step(3, "Check 'No category restrictions' and 'Save & modify box anytime' show '✓' only in the Custom column."),
      step(4, "Scroll further. A 'How We Compare' competitor table shows with 4 competitor rows."),
      step(5, "The BoxNiJuanPH row at the bottom should have a green highlight."),
      step(6, "Confirm the footer note: 'All plans include free delivery within Metro Manila. Cancel anytime.'"),

      // ─────────────────────────────────────────────────────────
      // SECTION C: BUILDER
      // ─────────────────────────────────────────────────────────
      sectionBanner("C — BOX BUILDER", "boxnijuanph.vercel.app/builder"),

      subBanner("C1. Plan Loading"),
      body("How to test:"),
      step(1, "Navigate to /plans and select Basic."),
      step(2, "Builder should load with heading: 'Basic Plan — Choose 3 items for your box.'"),
      step(3, "Progress bar should show '0 of 3 items selected' with '3 remaining'."),
      step(4, "Repeat for each plan to verify the correct item count shows."),

      subBanner("C2. Filter Bar"),
      body("How to test:"),
      step(1, "In the search input, type 'foam'. Only products with 'foam' in the name or description should appear."),
      step(2, "Click the X button inside the search box. Products reset."),
      step(3, "Open the Category dropdown. Select 'Healthy Snacks'. Only snack products show."),
      step(4, "Select 'All Categories' again to reset."),
      step(5, "Open the Brand dropdown. Select 'SarapFit'. Only SarapFit products show."),
      step(6, "Check the '🇵🇭 Local brands only' checkbox. Only locally-made products show."),
      step(7, "Click 'Clear filters' (appears as a small link on the right). All filters reset at once."),
      step(8, "Type something with no match (e.g. 'xyzxyz'). Should show 'No items in this category.'"),

      subBanner("C3. Product Selection (Fixed Plans — Basic/Standard/Premium)"),
      body("How to test:"),
      step(1, "Select Basic plan (3 items). Click any product card."),
      expect("A Variant Modal appears showing the product image, name, and a list of variants."),
      step(2, "Click one of the variant options to select it (it turns green/outlined)."),
      step(3, "Click 'Add to Box →'. Modal closes. Card now has a green border and checkmark."),
      step(4, "Progress bar updates: '1 of 3 items selected — 2 remaining'."),
      step(5, "Add a second and third product the same way."),
      expect("Progress bar shows '3 of 3 items selected — ✓ Box complete!'. Remaining cards go gray and disabled."),
      step(6, "Try clicking a disabled (grayed-out) card. Nothing should happen."),
      step(7, "Click one of your selected products. It should be removed from the box."),
      expect("Disabled cards become active again. Progress bar goes back to 2/3."),
      step(8, "In the Variant Modal, add a product variant that is already in your box. Try adding the same product again."),
      expect("The variant you already have shows 'already in box' and is disabled in the modal."),
      step(9, "Fill the box to 3 items. 'Review My Box →' button (bottom-right panel) should become green and active."),
      step(10, "Click 'Review My Box →'. Should navigate to /summary."),

      subBanner("C4. Product Selection (Custom Plan)"),
      body("How to test:"),
      step(1, "Go to /plans → 'Build Custom Box'."),
      step(2, "Select a product. Add it with one variant."),
      step(3, "Click the same product card again. The Variant Modal opens — select a DIFFERENT variant."),
      expect("Both variants appear in the sidebar panel. The qty badge (×2) shows on the card image."),
      step(4, "Add up to 12 items total. Progress bar fills."),
      step(5, "After adding at least 1 item, 'Save My Box ✓' and 'Review & Order →' both become active."),
      step(6, "Click 'Save My Box ✓'. Should go to /my-box."),

      subBanner("C5. Product Info Modal (ⓘ Button)"),
      body("How to test:"),
      step(1, "In the builder, hover over any product card. Look for a small circular ⓘ button at the bottom-right of the card image."),
      step(2, "Click the ⓘ button (do NOT click the main card area)."),
      expect("A detail modal opens. The product should NOT be selected (no green border on the card behind it)."),
      step(3, "Verify the modal shows: About, Best For, Contents, and Available Variants sections."),
      step(4, "For a snack item (e.g. Energy Bars, Trail Mix), confirm Nutrition Facts section shows."),
      step(5, "Click 'Got it — back to building'. Modal closes."),
      step(6, "Open the modal again. Click the dark backdrop outside the modal. Modal closes."),
      step(7, "Open the modal again. Press ESC on keyboard. Modal closes."),

      subBanner("C6. Desktop Summary Panel"),
      body("How to test:"),
      step(1, "On a desktop/wide screen (not mobile), the right sidebar panel should be visible."),
      step(2, "Before selecting any item: panel shows 'No items selected yet.'"),
      step(3, "Select 2 items. Both appear in the sidebar with thumbnail, name, and variant."),
      step(4, "Click the ✕ button next to an item in the sidebar. It should be removed."),

      subBanner("C7. Desktop Tooltip (Hover)"),
      body("How to test:"),
      step(1, "On desktop, hover your mouse over a product card for about 0.5 seconds."),
      expect("A dark tooltip card appears above the card showing product description, purpose, and contents."),
      step(2, "For a snack product, confirm the Nutrition Facts panel appears inside the tooltip."),
      step(3, "Move your mouse away. Tooltip disappears."),
      step(4, "Hover over a gray/disabled card. No tooltip should appear."),

      // ─────────────────────────────────────────────────────────
      // SECTION D: SUMMARY
      // ─────────────────────────────────────────────────────────
      sectionBanner("D — BOX SUMMARY", "boxnijuanph.vercel.app/summary"),

      subBanner("D1–D3. Content, Editing, and CSR Note"),
      body("How to test:"),
      step(1, "After filling a box in the builder, click 'Review My Box →'."),
      step(2, "Confirm the plan banner at the top shows: correct plan name, description, price."),
      step(3, "All selected items should be listed with thumbnail, name, variant, and category."),
      step(4, "Items from local brands should show the 🇵🇭 badge. Eco items show ♻️."),
      step(5, "Click the pencil (✏️) icon on any item. A Change Option modal appears."),
      step(6, "Select a different available variant. Click 'Confirm'. The item updates in the list."),
      step(7, "Click the ✕ (remove) button on an item."),
      expect("Item is removed. If the plan required that item to meet minimum, an amber warning banner appears at the bottom: 'Your Basic plan requires 3 items. Add 1 more to proceed.'"),
      step(8, "Confirm 'Proceed to Checkout →' button is disabled when below the minimum."),
      step(9, "In the CSR note card, verify the count of local brands and eco items matches your actual box contents."),

      subBanner("D4. Navigation"),
      body("How to test:"),
      step(1, "Click '← Edit Box'. Should go back to /builder with your items still selected."),
      step(2, "Go back to summary. Fill the box to the required count."),
      step(3, "Click 'Proceed to Checkout →'. Should go to /checkout."),

      // ─────────────────────────────────────────────────────────
      // SECTION E: CHECKOUT
      // ─────────────────────────────────────────────────────────
      sectionBanner("E — CHECKOUT", "boxnijuanph.vercel.app/checkout"),

      subBanner("E1. Guest State"),
      body("How to test (use incognito / not logged in):"),
      step(1, "Go through the flow without logging in: /plans → builder → summary → checkout."),
      expect("An amber banner at the top says 'You're checking out as a guest'."),
      step(2, "Click 'Sign In Instead'. Should go to /login?redirect=/checkout."),
      step(3, "Log in. Should return to /checkout with your items still in the order summary."),

      subBanner("E2. Logged-In State"),
      body("How to test:"),
      step(1, "Log in first, then go through the purchase flow."),
      expect("A green chip says 'Signed in as [Your Name]' at the top."),
      step(2, "If you have saved addresses in your profile, they appear as radio buttons. Confirm the default is pre-selected."),
      step(3, "Select 'Use a different address'. The new address form fields should expand."),

      subBanner("E3. Phone Number Validation"),
      body("How to test:"),
      step(1, "Fill in all other fields correctly. In the Phone field, type '12345' and click somewhere else (blur the field)."),
      expect("Red error appears below the phone field: 'Enter a valid PH number (e.g. 09171234567 or +639171234567)'."),
      step(2, "Clear the field and type '09171234567'. Click elsewhere."),
      expect("No error. Field accepts the value."),
      step(3, "Test '+639171234567'. Also accepted."),
      step(4, "Try '0917 123 4567' (with spaces). Should also be accepted (spaces are stripped automatically)."),
      step(5, "Leave phone field empty, click 'Place Order →'."),
      expect("Error shows: phone field is required."),

      subBanner("E4. Address Validation (When 'Use a different address' is selected)"),
      body("How to test:"),
      step(1, "Select 'Use a different address' to expand the form."),
      step(2, "Leave Street blank. Click 'Place Order →'."),
      expect("Error below Street: 'Street address is required'."),
      step(3, "Type 'Hi' (only 2 chars) in Street. Submit again."),
      expect("Error: 'Street must be at least 5 characters'."),
      step(4, "Type 'X' in City. Submit."),
      expect("Error: 'City must be at least 2 characters'."),
      step(5, "Type 'ABC' (not 4 digits) in ZIP. Submit."),
      expect("Error: 'ZIP must be a 4-digit number'."),
      step(6, "Fill all correctly: Street = '123 Rizal St Brgy 5', City = 'Manila', ZIP = '1000'."),
      expect("No errors. All fields valid."),

      subBanner("E5–E7. Payment, Order Summary, and Confirmation Modal"),
      body("How to test:"),
      step(1, "Select a payment method (GCash, Maya, etc.)."),
      step(2, "Look at the right panel. All your selected items should be listed with the plan name and price."),
      step(3, "With all fields filled correctly, 'Place Order →' should be green and active."),
      step(4, "Click 'Place Order →'."),
      expect("A confirmation modal appears showing: Delivery to name, full address, plan, and price."),
      step(5, "Click '← Go Back'. Modal closes. You are back on the checkout form."),
      step(6, "Click 'Place Order →' again. In the modal, click 'Confirm Order'."),
      expect("Navigates to /confirmation."),

      // ─────────────────────────────────────────────────────────
      // SECTION F: CONFIRMATION
      // ─────────────────────────────────────────────────────────
      sectionBanner("F — CONFIRMATION", "boxnijuanph.vercel.app/confirmation"),

      body("How to test:"),
      step(1, "After completing checkout, you should be on /confirmation."),
      step(2, "Confirm the large green ✓ checkmark and 'Order Confirmed!' heading."),
      step(3, "Confirm 'Thank you, [Your Name]!' shows correctly."),
      step(4, "Check the order number — it should be in the format BNJ-XXXXXX (e.g. BNJ-A3F9K1). It should be in a monospace/code font."),
      step(5, "Confirm all your box items are listed with thumbnails."),
      step(6, "The CSR section should show: '🇵🇭 X Filipino brands supported' and '♻️ X eco-friendly items chosen'."),
      step(7, "Confirm the 3 'What Happens Next' steps are listed correctly."),
      step(8, "Look for the amber-colored notice card. It should read: 'Not satisfied with your box?'"),
      expect("Card shows the 7-day refund window, the support email (support@boxnijuanph.com), and a 'See full return policy →' link."),
      step(9, "Click 'See full return policy →'. Should navigate to /faq#returns (or scroll to the Returns section on the FAQ page)."),
      step(10, "Click 'Back to Home'. Goes to /."),
      step(11, "Click 'View My Subscription →'. Goes to /my-box."),
      step(12, "Click 'Build Another Box'. Goes to /plans."),

      // ─────────────────────────────────────────────────────────
      // SECTION G: MY BOX
      // ─────────────────────────────────────────────────────────
      sectionBanner("G — MY BOX", "boxnijuanph.vercel.app/my-box"),

      subBanner("G1–G2. No Subscription / Active Subscription"),
      body("How to test:"),
      step(1, "Sign up as a brand-new user (use a new email). Go to /my-box."),
      expect("'No Active Subscription' state: shows 📭 icon and 'Choose a Plan →' button."),
      step(2, "Click 'Choose a Plan →'. Goes to /plans."),
      step(3, "Complete a full purchase. Navigate to /my-box."),
      expect("Active subscription view: plan card with green top bar, status badge '✓ Active', your items listed."),
      step(4, "Check 'Next delivery' shows a future date. Check 'Deliver to' shows your checkout address."),

      subBanner("G3. Edit My Box"),
      body("How to test:"),
      step(1, "On /my-box, click 'Edit My Box ✏️'."),
      expect("Button immediately shows 'Loading…' and becomes disabled (grayed out)."),
      step(2, "After ~1–2 seconds, page navigates to /builder."),
      expect("Builder shows your current plan and your existing items pre-selected."),
      step(3, "Remove one item and add a different one."),
      step(4, "Complete the box and click 'Review My Box →' → /summary → 'Proceed to Checkout →' → complete checkout."),
      step(5, "Go to /my-box. Confirm the box contents have updated."),

      subBanner("G4. Pause & Resume"),
      body("How to test:"),
      step(1, "On /my-box with an active subscription, click '⏸ Pause Subscription'."),
      expect("A modal appears asking how many months to pause (1, 2, or 3)."),
      step(2, "Select '2 months'. Click 'Confirm Pause'."),
      expect("The top bar turns amber. A banner shows '⏸ Subscription paused · Resumes on [date 2 months from now]'."),
      step(3, "Status badge should show '⏸ Paused'. 'Next delivery' should show '—' (dashes, no date)."),
      step(4, "Click '▶ Resume Subscription'."),
      expect("Confirms, subscription goes back to active (green top bar, '✓ Active' badge)."),
      step(5, "Also test: in the paused banner, click 'Resume now'. Same result."),

      subBanner("G5. Cancel Subscription"),
      body("How to test:"),
      step(1, "On /my-box, scroll to the Manage section. Click 'Cancel Subscription'."),
      expect("A cancellation confirmation modal appears."),
      step(2, "Click 'Confirm Cancellation'."),
      expect("Page changes to 'Subscription Cancelled' state. Shows your last order details and a 'Resubscribe' option."),
      step(3, "Click 'Resubscribe'. Should navigate to /plans."),

      subBanner("G5b. Report an Issue Button"),
      body("How to test:"),
      step(1, "On /my-box with an active subscription, scroll to the Manage section."),
      step(2, "Locate the '↩️ Report an Issue' button — it should appear above 'Cancel Subscription'."),
      step(3, "Click '↩️ Report an Issue'."),
      expect("Browser navigates to /contact?topic=refund — notice the ?topic=refund in the URL."),
      step(4, "On the Contact page, look at the Topic dropdown."),
      expect("Topic is already pre-selected to 'Refund or Replacement'. User does not need to pick the topic manually."),
      step(5, "Go back. Navigate directly to /contact (without the ?topic=refund param)."),
      expect("Topic dropdown starts on 'Select a topic…' — blank, not pre-selected."),

      subBanner("G6. Switch to Custom Box"),
      body("How to test:"),
      step(1, "On /my-box with a Basic/Standard/Premium plan, scroll to the Manage section."),
      step(2, "Click 'Switch to Custom Box'."),
      expect("Navigates to /builder with the Custom plan loaded (up to 12 items heading)."),

      subBanner("G7. Profile — Personal Information Validation"),
      body("How to test:"),
      step(1, "Click the '👤 Profile' tab."),
      step(2, "In the Personal Information card, click 'Edit ✏️'."),
      step(3, "Clear the Display Name field. Click 'Save ✓'."),
      expect("Error below Display Name: 'Display name is required'."),
      step(4, "Type 'A' (1 character only). Click 'Save ✓'."),
      expect("Error: 'Display name must be at least 2 characters'."),
      step(5, "Clear the Phone field. Click 'Save ✓'."),
      expect("Error: 'Phone number is required'."),
      step(6, "Type '12345' in Phone. Click 'Save ✓'."),
      expect("Error: 'Enter a valid PH number…'."),
      step(7, "Type a valid name (e.g. 'Maria Santos') and valid phone (09171234567). Click 'Save ✓'."),
      expect("Confirmation message: 'Personal saved successfully!' appears. Edit mode closes."),
      step(8, "Click 'Cancel'. Edit mode closes without saving."),

      subBanner("G8. Profile — Default Payment Method"),
      body("How to test:"),
      step(1, "In the Default Payment Method card, try clicking a radio button BEFORE clicking Edit ✏️."),
      expect("Nothing happens — radio buttons are locked."),
      step(2, "Click 'Edit ✏️' in the payment card."),
      expect("Radio buttons are now interactive."),
      step(3, "Select 'Maya'. Click 'Save ✓'."),
      expect("'Payment preference saved!' message appears. Radio buttons lock again."),
      step(4, "Click 'Edit ✏️' on payment while also clicking 'Edit ✏️' on Personal Information."),
      expect("Both sections can be in edit mode independently — saving one does not affect the other."),

      subBanner("G9. Profile — Address Book"),
      body("How to test:"),
      step(1, "In the Saved Addresses card, click '+ Add Address'."),
      step(2, "Select label 'Home'. Leave all other fields blank. Click 'Save'."),
      expect("Error messages appear below each required field."),
      step(3, "Enter: Street = 'Hi' (2 chars). Click Save."),
      expect("Error: 'Street must be at least 5 characters'."),
      step(4, "Enter valid data: Street = '123 Kalayaan Ave', City = 'Quezon City', ZIP = '1100'. Click Save."),
      expect("Address saved and appears in the list with 'Home' label."),
      step(5, "Click the edit (pencil) button on the saved address. Form opens with existing values pre-filled."),
      step(6, "Click the delete (trash) button. Address is removed from the list."),
      step(7, "Add 2 more addresses. Click 'Set as Default' on the second one."),
      expect("'Default' badge moves to that address."),
      step(8, "Try adding a 4th address."),
      expect("'+ Add Address' button should no longer appear when 3 addresses are saved."),

      subBanner("G10–G11. Photo Upload & Logout"),
      body("How to test:"),
      step(1, "Click 'Upload Photo'. Select an image file larger than 2MB."),
      expect("Error: 'File size must be under 2MB'."),
      step(2, "Select a valid image (JPG/PNG under 2MB). It should appear as your avatar."),
      step(3, "Click 'Remove'. Avatar reverts to the initial letter circle."),
      step(4, "Click 'Log Out' at the bottom of the profile tab."),
      expect("Redirected to homepage. Navbar shows 'Sign In' instead of avatar. Toast: 'See you soon, [Name]!'"),

      // ─────────────────────────────────────────────────────────
      // SECTION H: PRODUCTS
      // ─────────────────────────────────────────────────────────
      sectionBanner("H — PRODUCTS PAGE", "boxnijuanph.vercel.app/products"),

      body("How to test:"),
      step(1, "Go to /products. Confirm all products display (you should see 28 products total)."),
      step(2, "Check that '28 products found' shows in the header."),
      step(3, "Type 'aloe' in the search bar. Only products with 'aloe' in name/description should show."),
      step(4, "Click X to clear search."),
      step(5, "Filter by 'Recovery & Fitness'. Count the products. Clear filter."),
      step(6, "Check '🇵🇭 Local brands only'. Products without Local status disappear."),
      step(7, "Click 'Clear filters'. All products return."),
      step(8, "Click any product card."),
      expect("Product Detail Modal opens with full product information."),
      step(9, "Verify: About, Best For, Contents, Available Variants sections are present."),
      step(10, "For a snack product (e.g. Energy Bars), verify Nutrition Facts section shows."),
      step(11, "Click 'Add to My Box →'. Should go to /plans."),
      step(12, "Go back to /products. Click a product card. Press ESC."),
      expect("Modal closes."),
      step(13, "Open a modal. Click the dark backdrop area outside the white card."),
      expect("Modal closes."),
      step(14, "Scroll to the bottom CTA. Click 'See Plans & Pricing →'. Goes to /plans."),

      // ─────────────────────────────────────────────────────────
      // SECTION I: LOGIN
      // ─────────────────────────────────────────────────────────
      sectionBanner("I — LOGIN PAGE", "boxnijuanph.vercel.app/login"),

      subBanner("I1. Sign Up — Email"),
      body("How to test:"),
      step(1, "Go to /login. Make sure 'Sign Up' tab is selected."),
      step(2, "Click 'Create Account →' without filling any fields."),
      expect("Error: 'Full name is required'."),
      step(3, "Fill Full Name and Username. Leave Email blank. Click Create Account."),
      expect("Error: 'Email is required'."),
      step(4, "Enter email 'notanemail'. Click Create Account."),
      expect("Error: 'Enter a valid email address'."),
      step(5, "Fill valid email. Enter password 'abc' (too short). Check the strength meter."),
      expect("Meter shows 'Too short' in red. Checklist shows unchecked requirements."),
      step(6, "Type 'Password1!' — strength should show 'Strong' in green. All checklist items checked."),
      step(7, "In Confirm Password, type 'different'."),
      expect("'Passwords do not match' red text shows."),
      step(8, "Type 'Password1!' again in confirm. Shows '✓ Passwords match' in green."),
      step(9, "Click 'Create Account →'. Short loading state, then lands on homepage with 'Welcome, [Name]!' toast."),

      subBanner("I2. Sign Up — Social Provider"),
      body("How to test:"),
      step(1, "Click the Google button."),
      expect("A quick-path form shows with Name and Email fields. A chip shows 'Signing up with Google'."),
      step(2, "Click '← Back'. Returns to main sign-up options."),
      step(3, "Click Google again. Enter name and email. Click 'Sign Up with Google →'."),
      expect("Navigates to homepage with welcome toast."),

      subBanner("I3. Sign In"),
      body("How to test:"),
      step(1, "Switch to 'Sign In' tab. Leave fields empty. Click 'Sign In →'."),
      expect("Error: 'Email is required'."),
      step(2, "Enter email only (no password). Click Sign In."),
      expect("Error: 'Password is required'."),
      step(3, "Enter the same credentials used during sign-up. Click Sign In."),
      expect("Navigates to homepage with 'Welcome back, [Name]!' toast."),

      subBanner("I4. Login Redirect"),
      body("How to test:"),
      step(1, "Log out. Build a box as a guest through to /checkout."),
      step(2, "On /checkout, click 'Sign In Instead' in the guest banner."),
      expect("Navigates to /login?redirect=/checkout."),
      step(3, "Sign in."),
      expect("Returns to /checkout (not homepage). Items are still in the order summary."),

      subBanner("I5. Guest Checkout Warning"),
      body("How to test:"),
      step(1, "On /login (Sign In tab), click 'Continue as guest'."),
      expect("An amber warning card expands below with 4 limitations listed with ✕ icons and a privacy note."),
      step(2, "Click 'Sign In Instead (Recommended)'. Warning card collapses back."),
      step(3, "Click 'Continue as guest' again. Click 'I understand — continue as guest anyway'."),
      expect("Proceeds to the destination page as a guest (no login required)."),

      // ─────────────────────────────────────────────────────────
      // SECTION J: FAQ
      // ─────────────────────────────────────────────────────────
      sectionBanner("J — FAQ PAGE", "boxnijuanph.vercel.app/faq"),

      body("How to test:"),
      step(1, "Go to /faq. Confirm 6 topic pills show: Delivery, Returns, Cancellation, Payment, Plans, Privacy."),
      step(2, "Click '📦 Plans & Products'. Page should scroll to that section."),
      step(3, "Click '🚚 Delivery & Shipping'. Page scrolls to delivery section."),
      step(4, "Click the first FAQ item (a question). The answer should expand with smooth animation."),
      step(5, "Confirm the chevron arrow rotates when open."),
      step(6, "Click the same question again. Answer collapses."),
      step(7, "Open multiple FAQ items and verify all of them can be open simultaneously."),
      step(8, "Scroll to the bottom. Click 'Contact Support'. Goes to /contact."),
      step(9, "Click 'Email Us Directly'. Your email client should open with support@boxnijuanph.com."),

      // ─────────────────────────────────────────────────────────
      // SECTION K: CONTACT
      // ─────────────────────────────────────────────────────────
      sectionBanner("K — CONTACT PAGE", "boxnijuanph.vercel.app/contact"),

      body("How to test:"),
      step(1, "Go to /contact. Confirm 4 info cards display on the left."),
      step(2, "Click the email link 'support@boxnijuanph.com'. Should open an email client."),
      step(3, "In the form, click 'Send Message →' without filling anything."),
      expect("Errors appear below required fields (Full Name, Email, Topic, Message)."),
      step(4, "Enter 'notanemail' in Email. Click Send."),
      expect("Error: 'Enter a valid email address'."),
      step(5, "Type 'Hello' (5 chars) in Message. Click Send."),
      expect("Error: 'Message must be at least 10 characters'."),
      step(6, "Fill all fields correctly. Watch the character counter below Message as you type."),
      step(7, "Click 'Send Message →'."),
      expect("Form disappears. A success screen shows: '✓ Message Sent! Thanks, [Name]! We've received your message about [Topic].'"),
      step(8, "Click 'Send Another Message'. Form resets to blank state."),
      blank(),
      body("How to test the Topic pre-fill (linked from My Box):"),
      step(9, "Navigate to /contact?topic=refund (append ?topic=refund to the URL manually, or use the 'Report an Issue' button from /my-box)."),
      expect("Topic dropdown is pre-selected to 'Refund or Replacement'."),
      step(10, "Navigate to /contact without any query param."),
      expect("Topic dropdown shows 'Select a topic…' — not pre-selected."),
      warn("The pre-fill only works for ?topic=refund. Other topic values do not pre-fill anything."),

      // ─────────────────────────────────────────────────────────
      // SECTION L: NAVBAR
      // ─────────────────────────────────────────────────────────
      sectionBanner("L — NAVBAR", "visible on all pages"),

      body("How to test:"),
      step(1, "Logged out: Navbar should show logo, nav links, 'Sign In', and 'Build Your Box' button."),
      step(2, "Click logo. Goes to homepage from any page."),
      step(3, "Click each nav link: Home (/), Plans (/plans), Products (/products), FAQ (/faq), Contact (/contact). Verify each loads the correct page."),
      step(4, "Check that the active page link is highlighted in green."),
      step(5, "Click 'Sign In'. Goes to /login?redirect=[current-page]. Log in. Confirm the redirect parameter brought you back to the right page."),
      step(6, "Logged in: Navbar shows avatar circle with your initial + 'Hi, [Name]'. Click it."),
      expect("Goes to /my-box?tab=profile."),
      step(7, "Confirm 'My Box' link is visible and works."),
      step(8, "Click 'Log Out'. Shows 'See you soon, [Name]!' toast. Navbar reverts to logged-out state."),
      step(9, "Resize browser to mobile width (or use browser DevTools device emulation)."),
      expect("Nav links disappear. A ☰ hamburger icon appears."),
      step(10, "Click hamburger. Full menu drops down with all links."),
      step(11, "Click any link inside the mobile menu. Menu closes and navigates correctly."),

      // ─────────────────────────────────────────────────────────
      // SECTION M: CHATBOT
      // ─────────────────────────────────────────────────────────
      sectionBanner("M — CHATBOT (BoxBot)", "chat bubble — bottom right of every page"),

      body("How to test:"),
      step(1, "On any page, look for the green circle button at the bottom-right corner. It has a small red dot."),
      step(2, "Click the bubble. The chat panel opens. BoxBot sends a greeting message."),
      step(3, "Try each of the 6 Quick Reply buttons: Order status, Plans & pricing, Show products, Delivery, Refund, FAQ."),
      expect("Each click sends a message and BoxBot responds with relevant information and links."),
      step(4, "For 'Show products', BoxBot should show product cards with thumbnails."),
      step(5, "Click 'Add to builder →' on a product card. Should go to /plans."),
      step(6, "Click the 'Refund' quick reply button (or type 'refund')."),
      expect("BoxBot responds with a detailed refund message. Read the response carefully:"),
      body("     ✓ Mentions 7-day window from delivery", { italic: true }),
      body("     ✓ Covers: damaged, incorrect, or missing items", { italic: true }),
      body("     ✓ Shows what to include in the email: order number (BNJ-XXXXXX) + photo", { italic: true }),
      body("     ✓ Shows support email: support@boxnijuanph.com", { italic: true }),
      body("     ✓ States 1–2 business day reply time", { italic: true }),
      body("     ✓ States 5–7 business day refund processing time", { italic: true }),
      step(7, "Confirm 2 link buttons appear below the refund response: 'Report an Issue →' (/contact) and 'FAQ: Returns →' (/faq#returns)."),
      expect("Both links navigate to the correct pages."),
      step(8, "Type 'cancel' in the input and click Send. Bot explains cancellation process."),
      step(9, "Type 'kumusta' (Filipino greeting). Bot should respond with a greeting."),
      step(10, "Type random text like 'asdfgh'. Bot should respond with a generic fallback message."),
      step(11, "Click the minimize button (chevron ∧). Panel shrinks to just the green header bar."),
      step(12, "Click the header bar to expand again."),
      step(13, "Click the X button. Chat panel closes. Bubble is visible again."),
      step(14, "Press ESC key while chat is open. Chat closes."),
      step(15, "Open chat, send a few messages. Navigate to a different page. Open chat again."),
      expect("Previous messages are still there (chat history persists via localStorage)."),
      step(16, "Click the 🗑️ trash icon in the chat header."),
      expect("All messages are cleared. Bot sends a fresh greeting."),

      // ─────────────────────────────────────────────────────────
      // SECTION N: PRIVACY
      // ─────────────────────────────────────────────────────────
      sectionBanner("N — PRIVACY PAGE", "boxnijuanph.vercel.app/privacy"),

      body("How to test:"),
      step(1, "Go to /privacy."),
      step(2, "Confirm 8 numbered sections are visible: Who We Are, What We Collect, How We Use, Who We Share With, Data Security, Your Rights, Data Retention, Contact Us."),
      step(3, "In Section 5 (Data Security), confirm 4 security cards display."),
      step(4, "In Section 6, confirm 7 rights under RA 10173 are listed."),
      step(5, "In Section 8, verify the NPC (National Privacy Commission) link is present."),
      step(6, "Click 'Back to Home' at the top. Returns to /."),

      // ─────────────────────────────────────────────────────────
      // SECTION O: END-TO-END FLOWS
      // ─────────────────────────────────────────────────────────
      sectionBanner("O — END-TO-END USER FLOWS", "full purchase and account management flows"),

      subBanner("O1. Guest Purchase Flow"),
      body("Complete this flow without logging in at any point:"),
      step(1, "Homepage → Click 'Build Your Box →'"),
      step(2, "Plans → Select 'Standard' (5 items)"),
      step(3, "Builder → Add exactly 5 products with variants → 'Review My Box →'"),
      step(4, "Summary → Confirm all 5 items show → 'Proceed to Checkout →'"),
      step(5, "Checkout → See guest warning banner → Fill all fields → 'Place Order →' → Confirm"),
      step(6, "Confirmation → Verify order number, item list, CSR stats"),
      expect("Entire flow completes without errors. Correct data carries through each step."),

      subBanner("O2. Registered User Purchase Flow"),
      body("Complete a full purchase as a signed-in user:"),
      step(1, "Sign up as a new user"),
      step(2, "Homepage → Plans → Select 'Premium' (8 items) → Builder → fill 8 items → Summary → Checkout → Confirm"),
      step(3, "Go to /my-box"),
      expect("Subscription shows Premium plan with all 8 items listed correctly."),

      subBanner("O3. Login Redirect Flow"),
      body("Test that login correctly redirects back to checkout:"),
      step(1, "Log out. Go to /plans → /builder → fill 3 items → /summary → /checkout"),
      step(2, "On /checkout, click 'Sign In Instead'"),
      step(3, "Observe the URL: should say /login?redirect=/checkout"),
      step(4, "Log in"),
      expect("Returns to /checkout (not homepage). Order summary on the right still shows your items."),

      subBanner("O4. Edit Box Flow"),
      body("Test editing an existing subscription box:"),
      step(1, "Have an active subscription on /my-box"),
      step(2, "Click 'Edit My Box ✏️'. Observe the loading state on the button."),
      step(3, "In /builder, swap 1 item for a different product"),
      step(4, "Click 'Review My Box →' → /summary → 'Proceed to Checkout →' → complete checkout"),
      step(5, "Go to /my-box"),
      expect("Box contents card shows the updated item list."),

      subBanner("O5. Pause & Resume Flow"),
      body("Test pausing and resuming:"),
      step(1, "Active subscription → '⏸ Pause Subscription' → select 1 month → confirm"),
      step(2, "Verify amber banner + paused status"),
      step(3, "Click '▶ Resume Subscription' → confirm"),
      expect("Green active status restored. Next delivery date shows."),

      subBanner("O6. Cancel & Resubscribe"),
      body("Test full cancellation and resubscription:"),
      step(1, "Active subscription → 'Cancel Subscription' → confirm"),
      step(2, "Verify 'Subscription Cancelled' state with last order card"),
      step(3, "Click 'Resubscribe' → /plans"),
      step(4, "Choose a plan and complete a new purchase"),
      expect("New active subscription created. /my-box shows the new box."),

      subBanner("O7. Quiz → Plan → Build Flow"),
      body("Test the complete quiz-to-purchase path:"),
      step(1, "Homepage → Scroll to Wellness Quiz"),
      step(2, "Answer: 'Very Active' → 'All-Around' → 'Load me up'"),
      expect("Result: Premium Plan (₱899/mo)."),
      step(3, "Click 'Get This Plan →' → /plans"),
      step(4, "Click 'Choose Premium' → /builder"),
      step(5, "Fill 8 items → 'Review My Box →' → continue through checkout"),
      expect("Entire quiz-to-order flow works without errors."),

      divider(),

      // ─────────────────────────────────────────────────────────
      // COMMON ISSUES REFERENCE
      // ─────────────────────────────────────────────────────────
      h1("Common Issues Reference"),
      body("If something isn't working, check these first before logging a bug:"),
      blank(),
      body("Issue: Page looks blank or shows an error screen", { bold: true }),
      step(1, "Hard refresh: press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)."),
      step(2, "Clear localStorage (DevTools → Application → Local Storage → Clear All) and refresh."),
      blank(),
      body("Issue: Items/plan didn't carry through to the next step", { bold: true }),
      step(1, "Make sure you clicked the navigation button inside the app (e.g. 'Review My Box →'), not the browser back button."),
      step(2, "Browser back button skips the save step and can cause state loss."),
      blank(),
      body("Issue: Login doesn't seem to work / user appears logged out", { bold: true }),
      step(1, "Check if you're in incognito — localStorage can behave differently per window."),
      step(2, "Try signing in again using the same email."),
      blank(),
      body("Issue: Video on homepage doesn't play", { bold: true }),
      step(1, "The video file may not have been uploaded to the Vercel deployment. This is a known prototype limitation."),
      step(2, "Check on the local dev server (npm run dev) — if it works locally but not on Vercel, the video file needs to be uploaded."),
      blank(),
      body("Issue: Chat doesn't respond", { bold: true }),
      step(1, "Wait 1–2 seconds. The bot has a simulated delay."),
      step(2, "If still no response, refresh the page and try again."),
      divider(),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 0 },
        children: [new TextRun({ text: "BoxNiJuanPH · BSITOUMN COMP 047 · PUP Open University System · June 2026", size: 18, color: gray, italics: true })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  const out = path.join("C:/Users/I331629/Documents/BoxNiJuanPH-guide", "BoxNiJuanPH_QA_Testing_Guide.docx");
  fs.writeFileSync(out, buf);
  console.log("Done:", out);
});
