export const requiredFields = [
  "date",
  "experimentNumber",
  "title",
  "aim",
  "algorithm",
  "code",
  "output",
  "result"
];

export function normalizeText(value) {
  return String(value || "").trim();
}

export function formatDisplayDate(dateValue) {
  const value = normalizeText(dateValue);

  if (!value) {
    return "N/A";
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return value;
  }

  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

export function getMissingFields(body) {
  return requiredFields.filter((field) => {
    const value = body?.[field];
    return typeof value !== "string" || !value.trim();
  });
}
