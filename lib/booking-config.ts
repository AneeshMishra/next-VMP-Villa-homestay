export const GST_RATE = 0.05; // 5% GST on accommodation

// Total physical units available per room type
export const ROOM_UNITS: Record<string, number> = {
  "2bhk-flat": 1,
  "1bhk-flat": 1,
  "deluxe-ac": 4,
  "standard-ac": 2,
  "dormitory": 1,
};

export const ROOM_PRICES: Record<string, number> = {
  "deluxe-ac": 1500,
  "standard-ac": 1200,
  dormitory: 500,
  "1bhk-flat": 2000,
  "2bhk-flat": 3000,
};

export const ROOM_NAMES: Record<string, string> = {
  "deluxe-ac": "Deluxe AC Room",
  "standard-ac": "Standard AC Room",
  dormitory: "Dormitory Bed",
  "1bhk-flat": "1BHK Private Flat",
  "2bhk-flat": "2BHK Private Flat",
};

export const MAX_GUESTS: Record<string, number> = {
  "deluxe-ac": 3,
  "standard-ac": 2,
  dormitory: 1,
  "1bhk-flat": 3,
  "2bhk-flat": 6,
};
