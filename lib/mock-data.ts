/**
 * Fallback content for the public site.
 *
 * Shown ONLY when Convex is unreachable, errors, or returns no rows
 * (see `loadWithFallback` in lib/load-with-fallback.ts). As soon as the real
 * tables return data, the components render that instead — nothing here needs
 * to be removed by hand.
 *
 * Everything below is sample content: names are placeholders and no contact
 * details (phone numbers, emails) are included on purpose.
 */
import type { BoardMember, CommunityAd, Event } from "./types"

const CREATED_AT = "2026-01-01T00:00:00.000Z"

/** YYYY-MM-DD for today + `days` (negative = past). Keeps mock dates fresh. */
function dateFromToday(days: number): string {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() + days)
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${mm}-${dd}`
}

const IMG = {
  blood: "/mock/blood-donation.svg",
  tree: "/mock/tree-plantation.svg",
  school: "/mock/school-kits.svg",
  eye: "/mock/eye-camp.svg",
  installation: "/mock/installation.svg",
  health: "/mock/health-camp.svg",
  water: "/mock/water-sanitation.svg",
  partner: "/mock/partner.svg",
  fellowship: "/mock/fellowship.svg",
  volunteers: "/community-service-volunteers.png",
  wheel: "/rotary-international-wheel.png",
} as const

/** Upcoming events (hero "Upcoming Events" panel). Dates roll forward from today. */
export function getMockUpcomingEvents(): Event[] {
  return [
    {
      id: "mock-upcoming-blood-donation",
      title: "Voluntary Blood Donation Camp",
      description:
        "A one-day blood donation camp at the Gudalur Government Hospital campus, organised with the hospital blood bank. Donors receive a health check and refreshments.",
      event_date: dateFromToday(10),
      image_url: IMG.blood,
      extra_images: null,
      is_upcoming: true,
      created_at: CREATED_AT,
    },
    {
      id: "mock-upcoming-tree-plantation",
      title: "Nilgiris Tree Plantation Drive",
      description:
        "Planting native saplings along the roadside and school campuses around Gudalur with students, forest department volunteers and Rotarians.",
      event_date: dateFromToday(19),
      image_url: IMG.tree,
      extra_images: null,
      is_upcoming: true,
      created_at: CREATED_AT,
    },
    {
      id: "mock-upcoming-school-kits",
      title: "School Kit Distribution",
      description:
        "Distributing notebooks, geometry boxes, bags and water bottles to students of government and panchayat union schools in the Gudalur block.",
      event_date: dateFromToday(31),
      image_url: IMG.school,
      extra_images: null,
      is_upcoming: true,
      created_at: CREATED_AT,
    },
    {
      id: "mock-upcoming-eye-camp",
      title: "Free Eye Screening Camp",
      description:
        "Free eye check-ups, cataract screening and spectacle distribution for senior citizens and tea-estate workers, with a partner eye hospital.",
      event_date: dateFromToday(46),
      image_url: IMG.eye,
      extra_images: null,
      is_upcoming: true,
      created_at: CREATED_AT,
    },
    {
      id: "mock-upcoming-installation",
      title: "Installation Ceremony of the New Board",
      description:
        "The club's annual installation ceremony, welcoming the incoming President and board for the new Rotary year, with district leaders as guests.",
      event_date: dateFromToday(62),
      image_url: IMG.installation,
      extra_images: null,
      is_upcoming: true,
      created_at: CREATED_AT,
    },
  ]
}

/** Completed events (Event Details carousel + Gallery). Dates roll back from today. */
export function getMockPastEvents(): Event[] {
  return [
    {
      id: "mock-past-health-camp",
      title: "Community Health Camp",
      description:
        "General health check-ups, blood pressure and sugar screening, and doctor consultations for families from nearby villages.",
      event_date: dateFromToday(-21),
      image_url: IMG.health,
      extra_images: [IMG.volunteers, IMG.fellowship],
      is_upcoming: false,
      created_at: CREATED_AT,
    },
    {
      id: "mock-past-blood-donation",
      title: "Blood Donation Camp",
      description:
        "Rotarians, college students and local residents came together to donate blood for the hospital blood bank.",
      event_date: dateFromToday(-48),
      image_url: IMG.blood,
      extra_images: [IMG.volunteers],
      is_upcoming: false,
      created_at: CREATED_AT,
    },
    {
      id: "mock-past-school-kits",
      title: "Back-to-School Kit Distribution",
      description:
        "School kits handed over to students at the start of the academic year, supported by members and community partners.",
      event_date: dateFromToday(-80),
      image_url: IMG.school,
      extra_images: [IMG.volunteers, IMG.fellowship],
      is_upcoming: false,
      created_at: CREATED_AT,
    },
    {
      id: "mock-past-tree-plantation",
      title: "Green Gudalur Plantation Drive",
      description:
        "Native saplings planted across school grounds and public spaces, with students adopting trees to care for through the year.",
      event_date: dateFromToday(-115),
      image_url: IMG.tree,
      extra_images: [IMG.volunteers],
      is_upcoming: false,
      created_at: CREATED_AT,
    },
    {
      id: "mock-past-water",
      title: "Clean Water & Sanitation Awareness",
      description:
        "Awareness sessions on safe drinking water, handwashing and hygiene for students and families in partnership with local schools.",
      event_date: dateFromToday(-150),
      image_url: IMG.water,
      extra_images: [IMG.fellowship],
      is_upcoming: false,
      created_at: CREATED_AT,
    },
    {
      id: "mock-past-eye-camp",
      title: "Eye Screening Camp",
      description:
        "Free eye screening with referrals for cataract surgery and spectacles provided to those in need.",
      event_date: dateFromToday(-190),
      image_url: IMG.eye,
      extra_images: [IMG.volunteers],
      is_upcoming: false,
      created_at: CREATED_AT,
    },
  ]
}

/**
 * Board roles of a Rotary club. `section` follows the admin-panel convention:
 * "fixed" = top row (max 3), "layer1".."layer3" = the three scrolling rows.
 * Names are placeholders.
 */
const BOARD: Array<[designation: string, name: string, section: string]> = [
  ["President", "Rtn. A. Ramesh", "fixed"],
  ["Secretary", "Rtn. S. Priya", "fixed"],
  ["Treasurer", "Rtn. K. Murugan", "fixed"],
  ["Immediate Past President", "Rtn. P. Senthil", "layer1"],
  ["President-Elect", "Rtn. M. Lakshmi", "layer1"],
  ["Vice President", "Rtn. R. Anand", "layer1"],
  ["Joint Secretary", "Rtn. V. Deepa", "layer1"],
  ["Sergeant-at-Arms", "Rtn. N. Karthik", "layer1"],
  ["Club Service Director", "Rtn. T. Saravanan", "layer2"],
  ["Community Service Director", "Rtn. J. Kavitha", "layer2"],
  ["Vocational Service Director", "Rtn. B. Prakash", "layer2"],
  ["International Service Director", "Rtn. D. Revathi", "layer2"],
  ["Youth Service Director", "Rtn. G. Vignesh", "layer2"],
  ["Membership Chair", "Rtn. L. Meena", "layer3"],
  ["Public Image Chair", "Rtn. C. Arun", "layer3"],
  ["Rotary Foundation Chair", "Rtn. H. Nandini", "layer3"],
  ["Club Trainer", "Rtn. E. Rajan", "layer3"],
  ["Bulletin Editor", "Rtn. F. Sangeetha", "layer3"],
]

export const MOCK_BOARD_MEMBERS: BoardMember[] = BOARD.map(([designation, name, section], i) => ({
  id: `mock-board-${i + 1}`,
  name,
  designation,
  section,
  created_at: CREATED_AT,
}))

/** Club-owned promo slides for the "Community Partner" panel (no third-party ads). */
export const MOCK_COMMUNITY_ADS: CommunityAd[] = [
  {
    id: "mock-ad-partner",
    title: "Become a Community Partner",
    image_url: IMG.partner,
    link_url: null,
    is_active: true,
    duration_seconds: 8,
    display_order: 0,
    created_at: CREATED_AT,
    updated_at: CREATED_AT,
  },
  {
    id: "mock-ad-join",
    title: "Join Rotary: Service Above Self",
    image_url: IMG.volunteers,
    link_url: null,
    is_active: true,
    duration_seconds: 8,
    display_order: 1,
    created_at: CREATED_AT,
    updated_at: CREATED_AT,
  },
  {
    id: "mock-ad-volunteer",
    title: "Volunteer at Our Next Service Camp",
    image_url: IMG.fellowship,
    link_url: null,
    is_active: true,
    duration_seconds: 8,
    display_order: 2,
    created_at: CREATED_AT,
    updated_at: CREATED_AT,
  },
]
