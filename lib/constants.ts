export const WHATSAPP_NUMBER = "919876543210"; // Replace with real number before launch
export const PHONE_DISPLAY = "+91 98765 43210";
export const EMAIL = "hello@vmpvilla.in";
export const INSTAGRAM = "@vmp_homestay_agra";
export const INSTAGRAM_URL = "https://instagram.com/vmp_homestay_agra";
export const ADDRESS = "Tajganj, Agra, Uttar Pradesh 282001";
export const GOOGLE_MAPS_URL = "https://maps.google.com/?q=VMP+Villa+Agra";

export const ROOMS = [
  {
    id: "deluxe-ac",
    name: "Deluxe AC Room",
    badge: "Most Popular",
    badgeColor: "#e8762b",
    description:
      "Spacious and well-appointed with a queen bed, private en-suite bathroom, and warm earthy décor inspired by Mughal heritage.",
    price: "₹2,500",
    priceUnit: "/ night",
    amenities: [
      "❄️ Air Conditioning",
      "🚿 En-suite Bath",
      "📶 Free WiFi",
      "🌅 Garden View",
      "🔒 Safe & Locker",
    ],
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    imageAlt: "Deluxe AC Room at VMP Villa",
  },
  {
    id: "standard-ac",
    name: "Standard AC Room",
    badge: "Great Value",
    badgeColor: "#3a6b4a",
    description:
      "Comfortable and clean with twin or double bed configuration. Perfect for budget-conscious travellers who don't want to compromise on comfort.",
    price: "₹1,800",
    priceUnit: "/ night",
    amenities: [
      "❄️ Air Conditioning",
      "🚿 Shared Bath",
      "📶 Free WiFi",
      "📺 TV",
      "🧹 Daily Housekeeping",
    ],
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    imageAlt: "Standard AC Room at VMP Villa",
  },
  {
    id: "dormitory",
    name: "Dormitory Bed",
    badge: null,
    badgeColor: null,
    description:
      "Social sleeping for solo backpackers and budget explorers. Meet fellow Taj enthusiasts, share stories on the rooftop terrace.",
    price: "₹1,500",
    priceUnit: "/ bed",
    amenities: [
      "🛏️ Bunk Beds",
      "🔒 Personal Locker",
      "📶 Free WiFi",
      "🚿 Shared Bath",
      "👥 Mixed Dorm",
    ],
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80",
    imageAlt: "Dormitory at VMP Villa",
  },
] as const;

export const DISTANCES = [
  { icon: "🕌", name: "Taj Mahal (South Gate)", value: "4.2 km · 12 min" },
  { icon: "🏰", name: "Agra Fort", value: "2.8 km · 8 min" },
  { icon: "🚂", name: "Agra Cantt. Railway Station", value: "3.1 km · 10 min" },
  { icon: "✈️", name: "Agra Airport (AGR)", value: "7.0 km · 20 min" },
  { icon: "🍽️", name: "Sadar Bazaar (Food Street)", value: "1.5 km · 5 min" },
] as const;

export const FACILITIES = [
  { icon: "📶", name: "High-Speed WiFi", note: "Free throughout" },
  { icon: "🍳", name: "Home-Cooked Breakfast", note: "Fresh & wholesome" },
  { icon: "🅿️", name: "Free Parking", note: "For car & bike" },
  { icon: "🌿", name: "Garden & Terrace", note: "Sunrise views" },
  { icon: "🔥", name: "Fireplace (Winter)", note: "Oct – Feb season" },
  { icon: "🧺", name: "Laundry Service", note: "Same-day on request" },
  { icon: "🚗", name: "Airport Transfers", note: "On request" },
  { icon: "🗺️", name: "Local Tour Help", note: "Free recommendations" },
] as const;

export const REVIEWS = [
  {
    initial: "R",
    avatarColor: "#e8762b",
    name: "Ramesh K.",
    meta: "Bangalore · Family Trip",
    stars: 5,
    text: '"Aneesh bhai picked us up from the station and immediately made us feel like family. The rooftop breakfast with a view of old Agra is something my kids still talk about. Absolutely worth every rupee."',
    source: "Booking.com",
    sourceClass: "src-booking",
  },
  {
    initial: "S",
    avatarColor: "#3a6b4a",
    name: "Sophie M.",
    meta: "London, UK · Solo Travel",
    stars: 5,
    text: '"I\'ve stayed in 40+ countries and VMP Villa was one of the warmest welcomes I\'ve ever had. The eco-philosophy is genuine — not just marketing. Bhavna\'s cooking alone is worth the trip to Agra."',
    source: "TripAdvisor",
    sourceClass: "src-tripadvisor",
  },
  {
    initial: "P",
    avatarColor: "#2b7bb9",
    name: "Priya & Arjun",
    meta: "Delhi · Couple's Weekend",
    stars: 5,
    text: '"Surprise anniversary trip, and VMP Villa made it perfect. They had rose petals on the bed without us asking. The garden is stunning. Location is perfect — we walked to the Taj at sunrise."',
    source: "Google",
    sourceClass: "src-google",
  },
  {
    initial: "T",
    avatarColor: "#c4601e",
    name: "Tariq A.",
    meta: "Hyderabad · Business + Leisure",
    stars: 4,
    text: '"Clean, well-maintained rooms, reliable WiFi (important for remote work!), and genuinely the best dal makhani I\'ve ever eaten. Will definitely be my go-to Agra base from now on."',
    source: "MakeMyTrip",
    sourceClass: "src-mmt",
  },
  {
    initial: "H",
    avatarColor: "#6b4a9b",
    name: "Hannah W.",
    meta: "Melbourne, AU · Backpacker",
    stars: 5,
    text: '"Stayed in the dorm and loved the community vibe. Met other travellers who became travel companions for a week. The hosts organised a sunrise Taj tour with a local guide — unbeatable value."',
    source: "Booking.com",
    sourceClass: "src-booking",
  },
  {
    initial: "V",
    avatarColor: "#b9402b",
    name: "Vikram S.",
    meta: "Pune · Solo Explorer",
    stars: 5,
    text: '"Third time visiting Agra, third time staying at VMP Villa. Aneesh remembered my name, my room preference, even that I take my chai without sugar. That\'s the magic of a true homestay."',
    source: "TripAdvisor",
    sourceClass: "src-tripadvisor",
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: "What are the check-in and check-out times?",
    a: "Check-in is from 12:00 PM (noon) onwards. Check-out is by 11:00 AM. Early check-in and late check-out can be arranged depending on availability — just WhatsApp us in advance and we'll do our best to accommodate you.",
  },
  {
    q: "Is breakfast included in the room rate?",
    a: "Breakfast is available as an add-on for ₹200 per person per day. Bhavna ji's home-cooked breakfast includes fresh parathas, seasonal sabji, chai, and fruits. It's highly recommended! Lunch and dinner can also be arranged on request.",
  },
  {
    q: "Do you allow children and families?",
    a: "Absolutely! VMP Villa is very family-friendly. Children under 5 years stay free when sharing a parent's room. We have a safe garden for kids to play in, and can arrange for a cot or extra mattress on request.",
  },
  {
    q: "Are pets allowed?",
    a: "We love animals! Small, well-behaved pets are welcome with prior notice. Please WhatsApp us before booking so we can arrange a suitable room. There is a nominal ₹300/night pet cleaning fee.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Free cancellation up to 48 hours before check-in for a full refund. Cancellations within 48 hours are subject to one night's charge. No-shows are charged the full booking amount. We always try to find a fair solution — just contact us.",
  },
  {
    q: "How far is the Taj Mahal and can you arrange a tour?",
    a: "The Taj Mahal is approximately 4.2 km from VMP Villa — about a 12-minute auto-rickshaw or e-rickshaw ride. We can arrange an early morning sunrise tour with a trusted local guide (₹800–1,200 per group). Just ask us at check-in or via WhatsApp the night before.",
  },
  {
    q: "Is airport/station pickup available?",
    a: "Yes! We offer transfers from Agra Cantt. Railway Station (₹250), Agra Fort Station (₹300), and Agra Airport (₹400). Please share your arrival details at least 2 hours in advance via WhatsApp. Drop-off is also available at the same rates.",
  },
] as const;

export const ECO_STATS = [
  { icon: "🌧️", value: "2,400 L", label: "Rainwater harvested this month" },
  { icon: "🌱", value: "340", label: "Organic meals served this season" },
  { icon: "☀️", value: "180 kWh", label: "Solar energy generated this month" },
  { icon: "♻️", value: "100%", label: "Single-use plastic-free rooms" },
] as const;
