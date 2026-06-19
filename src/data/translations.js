// All UI copy lives here, keyed by language. The active dictionary is exposed
// through LanguageContext as `t`, so components read e.g. `t.hero.title`.
//
// NOTE: the `nl` entries reproduce the original design copy verbatim.
export const translations = {
  nl: {
    nav: { home: 'Home', jobs: 'Vacatures', contact: 'Contact' },

    hero: {
      title: 'Begin uw Carrièretransformatie',
      subtitle:
        'Tienduizenden professionals vertrouwen op ons om hun beste werkkansen te vinden. Bent u klaar om te groeien?',
      browse: 'Vacatures Bekijken',
      apply: 'Schrijf u nu in',
    },

    stats: [
      { number: '185K+', label: 'Aangenomen Professionals', text: 'Alleen dit jaar al', icon: 'fa-users' },
      { number: '5000+', label: 'Openstaande Vacatures', text: 'Nu beschikbaar', icon: 'fa-briefcase' },
      { number: '4.9/5', label: 'Klantbeoordelingen', text: 'Van 10.000+ gebruikers', icon: 'fa-star' },
      { number: '100%', label: 'Volledige Toewijding', text: 'Voor uw succes', icon: 'fa-handshake' },
    ],

    features: {
      title: 'Waarom Voor Ons Kiezen',
      subtitle: 'Wij bieden veel meer dan banen: wij bieden carrièretransformatie',
      items: [
        { icon: 'fa-magic', title: 'Perfecte Match', desc: 'Geavanceerde algoritmes koppelen uw vaardigheden aan ideale vacatures' },
        { icon: 'fa-chart-line', title: 'Carrièregroei', desc: 'Gratis trainingen en exclusieve mentorprogramma’s' },
        { icon: 'fa-coins', title: 'Concurrerend Salaris', desc: 'Wij garanderen de beste salarisonderhandelingen op de markt' },
        { icon: 'fa-shield-alt', title: 'Vertrouwen en Veiligheid', desc: '60+ jaar ervaring en miljoenen professionals die op ons vertrouwen' },
        { icon: 'fa-hourglass-half', title: 'Volledige Flexibiliteit', desc: 'Kies tussen fulltime, parttime of tijdelijk werk' },
        { icon: 'fa-handshake', title: 'Persoonlijke Ondersteuning', desc: 'Uw toegewijde recruiter staat altijd voor u klaar' },
      ],
    },

    about: {
      title: 'Uw Perfecte Carrière Wacht op U',
      paragraph1:
        'Wij zijn gespecialiseerd in het verbinden van talent met kansen in de sectoren logistiek, productie, technologie, opslag en handel. Onze diepgaande ervaring in deze markten stelt ons in staat de perfecte matches te maken.',
      highlight1: 'logistiek, productie, technologie, opslag en handel',
      paragraph2:
        'Vanuit onze vestigingen in Gelderland, Limburg en Noord-Brabant, werken wij met persoonlijke aandacht en hechte relaties. Uw carrièretransformatie is onze missie.',
      highlight2: 'Vanuit onze vestigingen in Gelderland, Limburg en Noord-Brabant,',
      findRole: 'Vind Uw Baan',
      talkToUs: 'Praat Met Ons',
    },

    testimonials: {
      title: 'Succesverhalen',
      subtitle: 'Professionals die hun leven veranderden dankzij onze vacatures',
      items: [
        { text: '"Randstad heeft mijn carrière getransformeerd. Het proces was eenvoudig, snel en professioneel. Binnen enkele dagen had ik mijn perfecte nieuwe baan!"', name: 'Miguel Pereira', job: 'Technisch Specialist', initials: 'MP' },
        { text: '"Het team van Randstad was geweldig! Ze vonden niet alleen de juiste baan, maar bereidden me ook voor op succes."', name: 'Carla Fernandes', job: 'Projectmanager', initials: 'CF' },
        { text: '"Mijn salaris verdrievoudigen? Ja! Randstad heeft een geweldig pakket voor mij onderhandeld. Bedankt voor de toewijding!"', name: 'João Lucas', job: 'Financieel Analist', initials: 'JL' },
      ],
    },

    cta: {
      title: 'Uw Volgende Grote Kans',
      subtitle:
        'Honderdduizenden hebben hun carrière al via ons getransformeerd. Nu is het uw beurt om nieuwe professionele hoogten te bereiken!',
      discover: 'Ontdek Vacatures',
      submitCv: 'Deel Uw CV',
    },

    jobs: {
      title: 'Vacatures die bij U Passen',
      search: 'Zoeken',
      searchPlaceholder: 'Functietitel...',
      location: 'Locatie',
      salary: 'Salaris',
      allCities: 'Alle Steden',
      allSalaries: 'Alle Salarissen',
      fullTime: 'Fulltime',
      apply: 'Solliciteren',
      noResults: 'Geen vacatures gevonden met deze filters.',
    },

    contact: {
      title: 'Start een Gesprek',
      subtitle:
        'Stuur uw gegevens en wij nemen snel contact met u op om uw ideale kansen te bespreken',
      firstName: 'Voornaam',
      firstNamePlaceholder: 'Uw voornaam',
      lastName: 'Achternaam',
      lastNamePlaceholder: 'Uw achternaam',
      email: 'E-mailadres',
      phone: 'Telefoonnummer',
      message: 'Bericht',
      messagePlaceholder: 'Vertel ons over uzelf...',
      submit: 'Verzoek Versturen',
      success: 'Perfect! Wij nemen binnenkort contact met u op met geweldige kansen.',
      errors: {
        firstNameRequired: 'Voer uw voornaam in.',
        firstNameInvalid: 'De voornaam mag alleen letters bevatten (min. 2 tekens).',
        lastNameRequired: 'Voer uw achternaam in.',
        lastNameInvalid: 'De achternaam mag alleen letters bevatten (min. 2 tekens).',
        emailRequired: 'Voer uw e-mailadres in.',
        emailInvalid: 'Voer een geldig e-mailadres in.',
        phoneRequired: 'Voer uw telefoonnummer in.',
        phoneInvalid: 'Voer een geldig telefoonnummer in.',
        messageRequired: 'Schrijf een bericht.',
        messageInvalid: 'Het bericht moet minstens 10 tekens bevatten.',
      },
    },

    footer: {
      aboutTitle: 'Over Ons',
      aboutText:
        'Randstad is een wereldwijd uitzendbureau dat al meer dan 60 jaar talent verbindt met transformerende kansen.',
      contactTitle: 'Neem Contact Op',
      socialTitle: 'Sociale Media',
      linksTitle: 'Links',
      privacy: 'Privacy',
      terms: 'Voorwaarden',
      sitemap: 'Sitemap',
      rights: 'Alle rechten voorbehouden.',
    },
  },

  en: {
    nav: { home: 'Home', jobs: 'Opportunities', contact: 'Connect' },

    hero: {
      title: 'Begin Your Career Transformation',
      subtitle:
        'Tens of thousands of professionals trust us to discover their ideal career paths. Are you ready to advance?',
      browse: 'Browse Opportunities',
      apply: 'Apply Today',
    },

    stats: [
      { number: '185K+', label: 'Professionals Hired', text: 'This year alone', icon: 'fa-users' },
      { number: '5000+', label: 'Open Positions', text: 'Ready now', icon: 'fa-briefcase' },
      { number: '4.9/5', label: 'Client Ratings', text: 'From 10K+ users', icon: 'fa-star' },
      { number: '100%', label: 'Full Commitment', text: 'To your success', icon: 'fa-handshake' },
    ],

    features: {
      title: 'Why Choose Us',
      subtitle: 'We offer more than jobs: we offer career transformation',
      items: [
        { icon: 'fa-magic', title: 'Perfect Match', desc: 'Advanced algorithms match your skills with ideal opportunities' },
        { icon: 'fa-chart-line', title: 'Career Growth', desc: 'Free training and exclusive mentoring programs' },
        { icon: 'fa-coins', title: 'Competitive Pay', desc: 'We guarantee the best salary negotiations in the market' },
        { icon: 'fa-shield-alt', title: 'Trust & Safety', desc: '60+ years of experience with millions trusting us' },
        { icon: 'fa-hourglass-half', title: 'Total Flexibility', desc: 'Choose between full-time, part-time or temporary work' },
        { icon: 'fa-handshake', title: 'Personal Support', desc: 'Your dedicated recruiter is always ready to help' },
      ],
    },

    about: {
      title: 'Your Ideal Career Awaits',
      paragraph1:
        'We excel at connecting talent with opportunities in logistics, manufacturing, technology, warehousing and commerce. Our deep industry expertise enables perfect career matches.',
      highlight1: 'logistics, manufacturing, technology, warehousing and commerce',
      paragraph2:
        'Operating from offices in Gelderland, Limburg and North Brabant, we build lasting professional relationships. Your career transformation is our mission.',
      highlight2: 'Operating from offices in Gelderland, Limburg and North Brabant,',
      findRole: 'Find Your Role',
      talkToUs: 'Talk With Us',
    },

    testimonials: {
      title: 'Success Stories',
      subtitle: 'Professionals who transformed their lives through our opportunities',
      items: [
        { text: '"Randstad transformed my career. The process was smooth, fast and professional. Within days, I was in my perfect new role!"', name: 'Miguel Pereira', job: 'Technical Specialist', initials: 'MP' },
        { text: '"The Randstad team was amazing! Not only did they find the right job, they prepared me for success."', name: 'Carla Fernandes', job: 'Project Manager', initials: 'CF' },
        { text: '"Triple my salary? Yes! Randstad negotiated an incredible package for me. Thank you for the dedication!"', name: 'João Lucas', job: 'Financial Analyst', initials: 'JL' },
      ],
    },

    cta: {
      title: 'Your Next Big Opportunity',
      subtitle:
        "Hundreds of thousands have already transformed their careers with us. Now it's your turn to reach new professional heights!",
      discover: 'Discover Openings',
      submitCv: 'Submit Your Profile',
    },

    jobs: {
      title: 'Opportunities That Match You',
      search: 'Search',
      searchPlaceholder: 'Job title...',
      location: 'Location',
      salary: 'Salary Range',
      allCities: 'All Cities',
      allSalaries: 'All Salaries',
      fullTime: 'Full-time',
      apply: 'Apply Now',
      noResults: 'No openings match these filters.',
    },

    contact: {
      title: "Let's Chat",
      subtitle: "Share your details and we'll reach out to explore your ideal opportunities",
      firstName: 'First Name',
      firstNamePlaceholder: 'Your first name',
      lastName: 'Last Name',
      lastNamePlaceholder: 'Your last name',
      email: 'Email Address',
      phone: 'Phone Number',
      message: 'Your Message',
      messagePlaceholder: 'Tell us about yourself...',
      submit: 'Send Request',
      success: 'Perfect! We will contact you very soon with exciting opportunities.',
      errors: {
        firstNameRequired: 'Please enter your first name.',
        firstNameInvalid: 'First name must contain only letters (min. 2 characters).',
        lastNameRequired: 'Please enter your last name.',
        lastNameInvalid: 'Last name must contain only letters (min. 2 characters).',
        emailRequired: 'Please enter your email address.',
        emailInvalid: 'Please enter a valid email address.',
        phoneRequired: 'Please enter your phone number.',
        phoneInvalid: 'Please enter a valid phone number.',
        messageRequired: 'Please write a message.',
        messageInvalid: 'Your message must be at least 10 characters.',
      },
    },

    footer: {
      aboutTitle: 'About Us',
      aboutText:
        'Randstad is a global recruitment leader with 60+ years of experience connecting talent with transformative opportunities.',
      contactTitle: 'Contact Us',
      socialTitle: 'Social Media',
      linksTitle: 'Links',
      privacy: 'Privacy',
      terms: 'Terms',
      sitemap: 'Sitemap',
      rights: 'All rights reserved.',
    },
  },
}
