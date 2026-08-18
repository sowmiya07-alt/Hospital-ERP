export const TIME_SLOTS = [
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
];

export const formatTime12Hour = (timeString) => {
  if (!timeString) return "N/A";

  const trimmed = timeString.trim();

  // If already contains AM or PM
  if (/am|pm/i.test(trimmed)) {
    return trimmed;
  }

  // Parse HH:mm or HH:mm:ss
  const parts = trimmed.split(":");
  if (parts.length >= 2) {
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1].padStart(2, "0");

    if (isNaN(hours)) return trimmed;

    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;

    const formattedHours = String(hours).padStart(2, "0");
    return `${formattedHours}:${minutes} ${period}`;
  }

  return trimmed;
};
