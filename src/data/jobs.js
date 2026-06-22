// Static job listings used by the Jobs page. UI-only — no backend.
// `title` is the NL/PT label, `titleEN` the English one.
// `level` is one of 'junior' | 'middle' | 'senior'; `experienceYears` is the
// minimum years required; `hoursPerWeek` is the contract size.
export const jobs = [
  { id: 1, title: 'Senior Elektricien', titleEN: 'Senior Electrician', company: 'Randstad', location: 'Amsterdam', salary: '€2.500 - €3.200', salaryRange: '2000-3000', level: 'senior', experienceYears: 6, hoursPerWeek: 40, desc: 'Gespecialiseerd technisch werk aan elektrische installaties', descEN: 'Specialized technical work in electrical installations' },
  { id: 2, title: 'CNC-operator', titleEN: 'CNC Operator', company: 'Randstad', location: 'Eindhoven', salary: '€2.200 - €2.800', salaryRange: '2000-3000', level: 'middle', experienceYears: 3, hoursPerWeek: 38, desc: 'Bediening van precisie CNC-machines', descEN: 'Operating precision CNC machines' },
  { id: 3, title: 'Verpleegkundige', titleEN: 'Registered Nurse', company: 'Randstad', location: 'Rotterdam', salary: '€2.400 - €3.000', salaryRange: '2000-3000', level: 'middle', experienceYears: 4, hoursPerWeek: 36, desc: 'Patiëntenzorg en ondersteuning', descEN: 'Patient care and support' },
  { id: 4, title: 'Magazijnmedewerker', titleEN: 'Warehouse Associate', company: 'Randstad', location: 'Rotterdam', salary: '€1.850 - €2.400', salaryRange: '0-2000', level: 'junior', experienceYears: 0, hoursPerWeek: 40, desc: 'Magazijnwerkzaamheden en voorraadbeheer', descEN: 'Warehouse operations and inventory management' },
  { id: 5, title: 'Kantoorbeheerder', titleEN: 'Office Administrator', company: 'Randstad', location: 'Utrecht', salary: '€1.800 - €2.300', salaryRange: '0-2000', level: 'junior', experienceYears: 1, hoursPerWeek: 32, desc: 'Administratieve ondersteuning', descEN: 'Administrative support' },
  { id: 6, title: 'CAD-ontwerper', titleEN: 'CAD Designer', company: 'Randstad', location: 'Amsterdam', salary: '€2.800 - €3.600', salaryRange: '3000-4000', level: 'senior', experienceYears: 5, hoursPerWeek: 40, desc: 'Tekenen met CAD-software', descEN: 'Drafting with CAD software' },
  { id: 7, title: 'Professionele Chauffeur', titleEN: 'Professional Driver', company: 'Randstad', location: 'Amsterdam', salary: '€2.000 - €2.600', salaryRange: '2000-3000', level: 'junior', experienceYears: 2, hoursPerWeek: 40, desc: 'Transport en levering van goederen', descEN: 'Transport and delivery of goods' },
  { id: 8, title: 'Financieel Analist', titleEN: 'Financial Analyst', company: 'Randstad', location: 'Amsterdam', salary: '€3.000 - €4.000', salaryRange: '3000-4000', level: 'middle', experienceYears: 3, hoursPerWeek: 36, desc: 'Financiële analyse en rapportage', descEN: 'Financial analysis and reporting' },
]

export const cities = ['Amsterdam', 'Rotterdam', 'Utrecht', 'Eindhoven']

export const salaryRanges = [
  { value: '0-2000', label: '€0 - €2.000' },
  { value: '2000-3000', label: '€2.000 - €3.000' },
  { value: '3000-4000', label: '€3.000 - €4.000' },
  { value: '4000+', label: '€4.000+' },
]

// Experience levels, in seniority order. Labels are translated in the UI.
export const levels = ['junior', 'middle', 'senior']

// Years-of-experience brackets. `value` is parsed the same way as salaryRanges
// ("0-2", "3-5", "6+"); `label` is the numeric part shown next to the unit.
export const experienceRanges = [
  { value: '0-2', label: '0-2' },
  { value: '3-5', label: '3-5' },
  { value: '6+', label: '6+' },
]

// Selectable contract sizes (hours per week); matched exactly.
export const hoursOptions = [32, 36, 38, 40]
