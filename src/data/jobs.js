// Filter option data for the Jobs page dropdowns. UI-only.
// The job listings themselves are no longer static: they are fetched from the
// backend (`GET /api/jobs`) and entered manually by admins. Only the filter
// option exports below live here now.
//
// `level` is one of 'junior' | 'middle' | 'senior'; `experienceYears` is the
// minimum years required; `hoursPerWeek` is the contract size.

export const cities = ['Amsterdam', 'Rotterdam', 'Utrecht', 'Eindhoven']

// Experience levels, in seniority order. Labels are translated in the UI.
export const levels = ['junior', 'middle', 'senior']

// Years-of-experience brackets. `value` is a range string ("0-2", "3-5", "6+");
// `label` is the numeric part shown next to the unit.
export const experienceRanges = [
  { value: '0-2', label: '0-2' },
  { value: '3-5', label: '3-5' },
  { value: '6+', label: '6+' },
]

// Selectable contract sizes (hours per week); matched exactly.
export const hoursOptions = [32, 36, 38, 40]
