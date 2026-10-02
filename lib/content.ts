/**
 * Every word on the site lives here.
 *
 * FACTS RULE (from Joel's handover): only state what is on the handover's "Publish" list.
 * Never mention: battery, screen size in inches, SIM/eSIM, front camera, sensors, calls or
 * talk time, Google Play/GMS, Android version, prices, launch dates, or Safe Telecom
 * "approval". Anything new goes to Joel before it goes here.
 */

export const site = {
  name: "Bizmo",
  domain: "bizmousa.com",
  company: "Bizmo Inc.",
  oneLine: "Not filtered. Built kosher.",
  tagline: "The technology you need for business. Nothing you never asked for.",
  category: "The kosher business device",
};

export const nav = [
  { href: "#system", label: "How it works" },
  { href: "#apps", label: "Apps" },
  { href: "#specs", label: "Specifications" },
  { href: "#compare", label: "Compare" },
];

/* ------------------------------------------------------------------ film A: the device */

export const hero = {
  title: ["Not filtered.", "Built kosher."],
  lead: "Bizmo is a kosher business tablet with its own operating system. Only approved business apps run on it, so there is no filter to add, pay for monthly or get around.",
  tagline: site.tagline,
  cta: "Get notified at launch",
  status: "The kosher business device. Entering production now.",
};

export const turn = {
  title: "Recognisable across the room.",
  body: "Bizmo is visually distinct, so anyone can see it is a kosher device. It does not look like any other tablet, because it is not one.",
};

export const explode = {
  title: "Built from the ground up.",
  body: "Bizmo is not a regular tablet with a filter on top. It runs its own operating system, built from its own source code, with the filtering built into the apps themselves.",
  callouts: {
    processor: { label: "MediaTek Helio G99", sub: "6 nm processor" },
    memory: { label: "6 GB RAM", sub: "128 GB UFS storage, microSD expansion" },
    camera: { label: "13 MP rear camera", sub: "" },
    display: { label: "FHD 1920×1200 IPS", sub: "Display" },
  },
};

export const layers = {
  title: "Kosher is built into the system, not added on top.",
  body: "Bizmo is locked at the firmware. It cannot be bypassed the way a filter app can.",
  stack: [
    { id: "apps", label: "Approved business apps only", sub: "Nothing outside the approved list runs" },
    { id: "os", label: "Bizmo's own operating system", sub: "Built from its own source code" },
    { id: "verified", label: "Verified boot", sub: "Full encryption" },
    { id: "boot", label: "Secure boot", sub: "Locked bootloader" },
  ],
};

/* ------------------------------------------------------------------ apps */

export const apps = {
  title: "About 190 approved business apps.",
  titleSecond: "Nothing else runs.",
  body: "Bizmo runs only the apps on its approved list: banking, payments, Microsoft and Google work apps, phone-over-internet apps, security cameras, printing, transit and community apps.",
  notTitle: "Not on Bizmo",
  not: ["Web browser", "Social media", "Entertainment", "WhatsApp", "Remote access", "AI"],
  note: "The approved list grows and changes over time. App names are trademarks of their owners and are shown here as text only.",
  categories: [
    {
      id: "finance",
      name: "Banking and finance",
      apps: ["Chase Mobile", "Amex", "Bank of America", "Wells Fargo", "Citi Mobile", "Capital One", "TD Bank", "U.S. Bank", "M&T Mobile Banking", "Santander", "KeyBank", "Navy Federal", "USAA", "Merrill Edge", "E*TRADE", "thinkorswim", "Marcus by Goldman Sachs", "T. Rowe Price", "BMO", "CIBC", "Scotiabank", "Bank Hapoalim", "Leumi", "Bank Yahav", "The OJC Fund"],
      count: 47,
    },
    {
      id: "work",
      name: "Documents and work",
      apps: ["Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint", "Microsoft OneDrive", "Google Drive", "Google Sheets", "Docusign", "Adobe Fill & Sign", "Dropbox", "Evernote", "Asana", "Smartsheet", "Zendesk", "Mailchimp", "Genius Scan", "Buildium", "Zola Suite"],
      count: 20,
    },
    {
      id: "pay",
      name: "Payments, accounting and HR",
      apps: ["QuickBooks Online", "Square Point of Sale", "Cardknox Payments", "Fingercheck", "TSheets", "Timesheet", "Eastern Union Mortgage Calculator"],
      count: 7,
    },
    {
      id: "talk",
      name: "Phone-over-internet and messaging",
      apps: ["Zoom Workplace", "Microsoft Teams", "Slack", "Google Chat", "RingCentral", "3CX", "Phone.com", "Talkroute", "Zoiper", "Grandstream Wave", "Jivetel", "Mongotel"],
      count: 16,
    },
    {
      id: "security",
      name: "Sign-in and security",
      apps: ["Microsoft Authenticator", "Google Authenticator", "Duo Mobile", "Okta Verify", "1Password", "LastPass", "RSA SecurID", "FortiToken", "Intune Company Portal"],
      count: 15,
    },
    {
      id: "building",
      name: "Cameras, alarms and buildings",
      apps: ["Ring", "Arlo", "Blink", "ADT Control", "Hik-Connect", "Reolink", "UniFi", "eufy Security", "Schlage Home", "ecobee", "Total Connect 2.0", "DoorBird", "Night Owl"],
      count: 35,
    },
    {
      id: "travel",
      name: "Travel, transit and parking",
      apps: ["Waze", "Moovit", "E-ZPass NY", "The Official MTA App", "NJ TRANSIT", "ParkNYC", "PayByPhone", "Zipcar", "Avis", "AAA", "Rav-Kav", "Priority Pass"],
      count: 24,
    },
    {
      id: "more",
      name: "Printing, trades, utilities and community",
      apps: ["HP Print", "Epson iPrint", "Canon Print", "Brother Print", "Con Edison", "GEICO", "Allstate", "Doximity", "OneKey MLS", "Supra eKEY", "Southwire calculators", "Yeled", "IamResponding"],
      count: 26,
    },
  ],
};

/* ------------------------------------------------------------------ daily work (home screen illustration) */

export const daily = {
  title: ["The apps you work with.", "Nothing you never asked for."],
  body: "Banking, invoicing, signatures, phone-over-internet, navigation and security cameras. Bizmo runs the approved business apps you already use, and nothing else.",
  caption: "Illustration. App names are shown as text, and the final screen may differ.",
  apps: [
    { name: "Chase", short: "C" },
    { name: "QuickBooks", short: "Q" },
    { name: "Docusign", short: "D" },
    { name: "Zoom", short: "Z" },
    { name: "RingCentral", short: "R" },
    { name: "Google Sheets", short: "S" },
    { name: "Microsoft Word", short: "W" },
    { name: "Square", short: "S" },
    { name: "Waze", short: "W" },
    { name: "Ring", short: "R" },
    { name: "E-ZPass", short: "E" },
    { name: "Phone", short: "" },
  ],
};

/* ------------------------------------------------------------------ speed */

export const speed = {
  title: "Native speed. No proxy.",
  body: "A filter subscription sends your traffic through a filter server, and everything waits for it. Bizmo filters inside the device, so your apps connect without the detour.",
  lanes: {
    filter: { label: "Tablet with a filter", nodes: ["Your tablet", "Filter server", "Your bank, email, apps"] },
    bizmo: { label: "Bizmo", nodes: ["Bizmo", "Your bank, email, apps"] },
  },
};

/* ------------------------------------------------------------------ film B: close-ups + specs */

export const camera = {
  title: "13 MP rear camera.",
  body: "Scan and sign documents with approved apps such as Genius Scan and Adobe Fill & Sign.",
};

export const specs = {
  title: "Specifications, so far.",
  stats: [
    { value: 6, unit: "nm", label: "MediaTek Helio G99 processor" },
    { value: 6, unit: "GB", label: "RAM" },
    { value: 128, unit: "GB", label: "UFS storage, microSD expansion" },
    { value: 13, unit: "MP", label: "Rear camera" },
  ],
  lead: "Everything confirmed so far. More details will follow as production completes.",
  rows: [
    { k: "Processor", v: "MediaTek Helio G99, 6 nm" },
    { k: "Memory", v: "6 GB RAM" },
    { k: "Storage", v: "128 GB UFS, microSD expansion" },
    { k: "Display", v: "FHD 1920×1200 IPS" },
    { k: "Connectivity", v: "4G LTE, Wi-Fi 802.11ac, Bluetooth 5.0, GPS" },
    { k: "Camera", v: "13 MP rear camera" },
    { k: "Port", v: "USB-C" },
    { k: "Security", v: "Secure boot, locked bootloader, verified boot, full encryption" },
    { k: "Platform", v: "Its own operating system and source code. Filtering built into the apps. Only approved business apps run. Native speed, no proxy." },
  ],
};

/* ------------------------------------------------------------------ film C: trust */

export const trust = {
  title: "Certified by Vaad HaKehilos.",
  titleSecond: "Tested by Safe Telecom.",
  body: "Communities and institutions can set standards stricter than the default.",
};

/* ------------------------------------------------------------------ comparison */

export const compare = {
  title: "One device instead of a tablet and a filter.",
  body: "The real alternative to Bizmo is a normal tablet with a filter subscription. Here is how they differ.",
  head: ["", "Normal tablet with a filter", "Bizmo"],
  rows: [
    ["Filtering", "Covers mostly the web browser", "Built into the apps"],
    ["Apps", "Other apps stay open", "Only approved apps run"],
    ["Speed", "Slowed by a proxy server", "Native speed, no proxy"],
    ["Cost", "Monthly filter fees", "One device, one price"],
    ["Appearance", "Looks like any tablet", "Visually distinct, recognisable as kosher"],
    ["Protection", "Can be bypassed", "Locked bootloader, verified boot, full encryption"],
    ["Certification", "None", "Certified by Vaad HaKehilos, tested by Safe Telecom"],
  ],
};

/* ------------------------------------------------------------------ audience */

export const audience = {
  title: "For people who already work on a tablet.",
  body: "Bizmo is a cleaner, certified replacement for the work tablet you carry today. It is sold through authorized dealers: one device, one price.",
  roles: ["Business owners", "Salespeople", "Contractors", "Field workers", "Travelers", "Office professionals"],
};

/* ------------------------------------------------------------------ sign-up */

export const notify = {
  title: "Bizmo is entering production now.",
  body: "Leave your details and we'll tell you when it reaches your dealer.",
  fields: { name: "Name", email: "Email", city: "City" },
  button: "Notify me",
  sending: "Sending",
  done: (name: string) => `Thank you${name ? `, ${name.split(" ")[0]}` : ""}. We'll email you when Bizmo reaches your dealer.`,
  privacy: "We only use your details to tell you about Bizmo's launch.",
  errors: {
    name: "Enter your name.",
    email: "Enter an email address like name@example.com.",
    city: "Enter the city where you would buy Bizmo.",
    server: "Your details were not sent. Check your connection and try again.",
  },
};

export const footer = {
  line: site.tagline,
  legal: `© ${new Date().getFullYear()} ${site.company}`,
  note: "App names and trademarks belong to their owners.",
};
