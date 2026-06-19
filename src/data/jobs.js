// Static job listings used by the Jobs page. UI-only — no backend.
// `title` is the NL/PT label, `titleEN` the English one.
export const jobs = [
  { id: 1, title: 'Senior Elektricien', titleEN: 'Senior Electrician', company: 'Randstad', location: 'Amsterdam', salary: '€2.500 - €3.200', salaryRange: '2000-3000', desc: 'Gespecialiseerd technisch werk aan elektrische installaties', descEN: 'Specialized technical work in electrical installations' },
  { id: 2, title: 'CNC-operator', titleEN: 'CNC Operator', company: 'Randstad', location: 'Eindhoven', salary: '€2.200 - €2.800', salaryRange: '2000-3000', desc: 'Bediening van precisie CNC-machines', descEN: 'Operating precision CNC machines' },
  { id: 3, title: 'Verpleegkundige', titleEN: 'Registered Nurse', company: 'Randstad', location: 'Rotterdam', salary: '€2.400 - €3.000', salaryRange: '2000-3000', desc: 'Patiëntenzorg en ondersteuning', descEN: 'Patient care and support' },
  { id: 4, title: 'Magazijnmedewerker', titleEN: 'Warehouse Associate', company: 'Randstad', location: 'Rotterdam', salary: '€1.850 - €2.400', salaryRange: '0-2000', desc: 'Magazijnwerkzaamheden en voorraadbeheer', descEN: 'Warehouse operations and inventory management' },
  { id: 5, title: 'Kantoorbeheerder', titleEN: 'Office Administrator', company: 'Randstad', location: 'Utrecht', salary: '€1.800 - €2.300', salaryRange: '0-2000', desc: 'Administratieve ondersteuning', descEN: 'Administrative support' },
  { id: 6, title: 'CAD-ontwerper', titleEN: 'CAD Designer', company: 'Randstad', location: 'Amsterdam', salary: '€2.800 - €3.600', salaryRange: '3000-4000', desc: 'Tekenen met CAD-software', descEN: 'Drafting with CAD software' },
  { id: 7, title: 'Professionele Chauffeur', titleEN: 'Professional Driver', company: 'Randstad', location: 'Amsterdam', salary: '€2.000 - €2.600', salaryRange: '2000-3000', desc: 'Transport en levering van goederen', descEN: 'Transport and delivery of goods' },
  { id: 8, title: 'Financieel Analist', titleEN: 'Financial Analyst', company: 'Randstad', location: 'Amsterdam', salary: '€3.000 - €4.000', salaryRange: '3000-4000', desc: 'Financiële analyse en rapportage', descEN: 'Financial analysis and reporting' },
]

export const cities = ['Amsterdam', 'Rotterdam', 'Utrecht', 'Eindhoven']

export const salaryRanges = [
  { value: '0-2000', label: '€0 - €2.000' },
  { value: '2000-3000', label: '€2.000 - €3.000' },
  { value: '3000-4000', label: '€3.000 - €4.000' },
  { value: '4000+', label: '€4.000+' },
]
