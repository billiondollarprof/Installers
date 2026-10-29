# Decisions so far

Settled with the owner in October 2026. Do not re-open without being asked.

## The offer

- **What we sell:** a done for you service, not a SaaS product. Meet the
  business, show the demo, build it for them.
- **First offer: quote recovery.** Message the installer's old, unconverted
  quotes, qualify replies, book calls, alert the owner. Then the retainer
  covers instant follow up on every new quote.
- **Why recovery first:** results arrive in days, there is no ad spend, and
  the owner sees money from quotes they already paid to win. Vendor data (not
  independent) suggests roughly 4% to 9% of dormant contacts book a call; plan
  around 5%.

## The market

- **Country:** UK only. The owner has ruled out a new Nigerian market for this
  service.
- **Niche:** independent home improvement installers: windows, doors,
  conservatories and orangeries, roofline (fascias, soffits, guttering),
  composite and bifold doors, glass roofs. Most do several of these.
- **Why installers:** high job values; owners are on site and miss follow
  ups; homeowners compare several quotes. Business Pilot's installer data
  shows leads down 26% (2019 to 2024) while order values rose 41%, so each lead
  matters more and many old quotes were postponed, not lost. Spending is still
  weak in 2026, which is the pitch: fewer leads, so stop losing the ones you
  have.
- **Region:** to be chosen by data. The only regional spending data found (an
  industry survey) puts the South East highest at about £58.80 per household
  per week on home improvements. The finder's first run counts active
  installers per South East county and starts with the densest.
- **Ruled out, with reasons:** aesthetics clinics (Botox advertising ban under
  CAP 12.12, health data, saturated with agencies); UK hospitality bundle with
  Amara (closures, crowded tools, slow proof); social media content agent
  (cheap SaaS competitors, platform audits, no proven sales link); wedding
  venues (couples book once, so old enquiries rarely come back).

## Pricing (owner's numbers)

- Build: **£1,500**, with **£500 upfront** and the balance on handover.
- Monthly care: **£199**, offered only after the system is live, never in the
  first pitch. It covers maintenance and the running costs (mostly WhatsApp
  per message fees; the AI calls cost little). Put a monthly message cap in it
  so one busy client cannot eat the margin.
- Write the retainer into the contract as optional from day one, including
  what happens if they decline: the system is handed over and they open their
  own WhatsApp Business and AI accounts in their name.

## Outreach

- **Call first, then send the video.** Up to 10 calls a day. Send the
  personalised video only to owners who showed interest on the call, the same
  day. Follow up two days later.
- **A general video by email** may go to many leads at once, but only to
  limited companies (see Legal), from a separate warmed up domain, starting at
  20 to 30 a day, with an opt out on every email.
- **Personalised videos** use the demo with the prospect's name, owner name,
  trade and real jobs filled in.
- **Never deceive.** No "I spoke to you last month". If asked where you are
  based: "I work remotely with UK businesses."
- **Calling from Nigeria:** UK networks block calls from abroad that show a UK
  landline number (Ofcom rule, in force since early 2025). Ofcom proposed in
  2025 to withhold a UK mobile number on calls from abroad unless it can be
  verified; whether that is final is unconfirmed. Before buying a virtual
  number, get the provider to confirm in writing that outbound calls made from
  Nigeria display the UK number and connect. Rough cost: UK mobiles about
  $0.018 to $0.022 a minute, landlines about $0.009 (Zadarma's published rates),
  so a month of calling is around £10 to £15 plus the number's monthly rental.
- **WhatsApp on the virtual number:** register WhatsApp Business using the
  "Call me" verification. Ask the provider first whether the number can
  receive verification calls.

## Legal (UK)

- **Email (PECR):** limited companies and LLPs may be cold emailed without
  prior consent, with an opt out in every message. Sole traders and ordinary
  partnerships count as individuals and need consent first, so phone them.
  The finder tags every lead with its company type.
- **Calls:** never cold call a number on the Corporate TPS register (CTPS).
  Checking is a paid service; the owner checks before calling, and the desk
  records the result.
- **Old quote follow up for clients:** asking for a quote counts as
  "negotiations for a sale" under PECR's soft opt in, so following it up is
  allowed if the customer was given an opt out when they enquired, and every
  message carries one. Check what each client actually collected before
  sending anything.
- **Google:** use the official Places API only. Copying Google Maps pages
  breaks Google's terms. Places responses have storage limits in Google's
  terms; store our own derived fields and the place id, and re read details
  when needed.
- **Companies House:** use the official API (free key). It is public data
  under the Open Government Licence.
- **Websites:** read a business's own public contact page for its email,
  respect robots.txt, go slowly.

## The demo (built)

- Opens straight into the customer's chat. Messages arrive after a 1.5 second
  typing pause. Only the reply buttons move it on; tapping the screen or the
  message field never advances it.
- Two customers: Sarah (qualifies and books) and Tom (silent, gets one
  reminder two days later; the presenter taps his answer, or ticks "Tom never
  replies" for the polite stop after two messages).
- Typed free text gets a scripted assistant answer (price, timing, not
  interested, stop, gone elsewhere, yes, anything else). In the real build
  this is an AI on the client's knowledge base (DeepSeek is fine on cost);
  the opening messages stay as fixed templates.
- A WhatsApp style notification with a chime drops in when a lead books; tap
  it for the owner's "Lead Alerts" chat, X to dismiss it. Back arrow moves to
  the next customer, then to the results screen.
- Settings tab on the right edge: business, owner, trade, quote count,
  average job, each customer's job and price, channel (WhatsApp, SMS, email),
  light or dark, sound, restart, hide tab. Press and hold the header to bring
  the tab back.
- On desktop it shows as a smartphone, never as WhatsApp Desktop, because the
  story is the customer's phone and the owner's phone.

## The Lead Desk (built as an artifact, to port)

- Tabs: Leads, Script, How it works.
- Pipeline counts: Due today, All, New, Called, Interested, Video sent,
  Follow up, Pilot agreed, Paid.
- Each lead card: Call, copy number, WhatsApp (mobiles only), Email (Gmail
  compose), Website, Companies House link; company type and CTPS badges;
  one tap outcomes that set the next follow up date (Video sent and Follow up
  set it two days ahead).
- Paste a list from a spreadsheet to import.
