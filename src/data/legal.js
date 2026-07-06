// Juridische documenten (Privacyverklaring, Cookiebeleid, Algemene Voorwaarden).
//
// Opgesteld volgens de Algemene Verordening Gegevensbescherming (AVG/GDPR), de
// Nederlandse Uitvoeringswet AVG (UAVG) en de richtsnoeren van de Autoriteit
// Persoonsgegevens (AP) voor werving en selectie / uitzendbureaus.
//
// >>> VUL DE BEDRIJFSGEGEVENS HIERONDER IN <<<
// De velden met vierkante haken [ ... ] MOETEN worden vervangen door de echte
// gegevens van het bedrijf voordat de verklaring juridisch volledig is. Dit is
// de enige plek die u hoeft aan te passen; de teksten verwijzen er automatisch
// naar.
const company = {
  // Naam afgeleid uit het e-mailadres / de projectnaam. Controleer dat dit exact
  // overeenkomt met de inschrijving bij de Kamer van Koophandel (KvK).
  name: 'Multidiensten Midden-Nederland',
  // NOG INVULLEN — echte gegevens vereist, mogen niet worden verzonnen:
  address: '[straat en huisnummer], [postcode] [plaats]',
  kvk: '[KvK-nummer]',
  email: 'Multidienstenmiddennederland@gmail.com',
  phone: '[telefoonnummer]',
  website: 'https://randstad-diensten.nl',
}

const UPDATED_NL = 'Laatst bijgewerkt: 6 juli 2026'
const UPDATED_EN = 'Last updated: 6 July 2026'

export const legal = {
  nl: {
    company,

    privacy: {
      title: 'Privacyverklaring',
      updated: UPDATED_NL,
      intro:
        `${company.name} hecht grote waarde aan de bescherming van uw persoonsgegevens. ` +
        'In deze privacyverklaring leggen wij op heldere en transparante wijze uit welke ' +
        'persoonsgegevens wij verwerken, met welk doel, op welke rechtsgrondslag en hoe lang. ' +
        'Wij verwerken uw persoonsgegevens zorgvuldig, veilig en uitsluitend in overeenstemming ' +
        'met de Algemene Verordening Gegevensbescherming (AVG) en de Uitvoeringswet AVG (UAVG).',
      sections: [
        {
          heading: '1. Wie zijn wij (verwerkingsverantwoordelijke)',
          blocks: [
            { type: 'p', text: 'De verwerkingsverantwoordelijke voor de verwerking van uw persoonsgegevens is:' },
            {
              type: 'ul',
              items: [
                `${company.name}`,
                `Adres: ${company.address}`,
                `KvK-nummer: ${company.kvk}`,
                `E-mail: ${company.email}`,
                `Telefoon: ${company.phone}`,
                `Website: ${company.website}`,
              ],
            },
          ],
        },
        {
          heading: '2. Welke persoonsgegevens verwerken wij',
          blocks: [
            {
              type: 'p',
              text:
                'Wij verwerken de persoonsgegevens die u zelf aan ons verstrekt, bijvoorbeeld ' +
                'wanneer u het contact- of sollicitatieformulier invult. Het gaat om de volgende gegevens:',
            },
            {
              type: 'ul',
              items: [
                'Voor- en achternaam',
                'E-mailadres',
                'Telefoonnummer',
                'De inhoud van uw bericht',
                'Uw curriculum vitae (cv) en de gegevens die daarin zijn opgenomen, zoals opleiding en werkervaring, indien u ervoor kiest een cv te uploaden',
              ],
            },
            {
              type: 'p',
              text:
                'Daarnaast leggen onze servers om technische en beveiligingsredenen automatisch een ' +
                'beperkt aantal gegevens vast, zoals uw IP-adres, het tijdstip van het bezoek en het type ' +
                'browser. Deze gegevens gebruiken wij niet om u persoonlijk te identificeren.',
            },
            {
              type: 'p',
              text:
                'Wij verzoeken u geen bijzondere categorieën van persoonsgegevens (zoals gegevens over ' +
                'gezondheid, godsdienst, ras of burgerservicenummer) in uw bericht of cv op te nemen, ' +
                'tenzij dit strikt noodzakelijk is voor de bemiddeling.',
            },
          ],
        },
        {
          heading: '3. Doeleinden en rechtsgronden van de verwerking',
          blocks: [
            { type: 'p', text: 'Wij verwerken uw persoonsgegevens uitsluitend voor de volgende doeleinden en op de daarbij vermelde rechtsgrondslag uit artikel 6 AVG:' },
            {
              type: 'ul',
              items: [
                'Om contact met u op te nemen en uw vraag of verzoek te beantwoorden — grondslag: uitvoering van een overeenkomst of het op uw verzoek nemen van precontractuele maatregelen (art. 6 lid 1 sub b AVG).',
                'Om u te bemiddelen naar passend werk en u voor te stellen aan opdrachtgevers (werkgevers) — grondslag: uitvoering van de overeenkomst / precontractuele maatregelen (art. 6 lid 1 sub b AVG).',
                'Om uw cv en gegevens langer te bewaren voor toekomstige vacatures — grondslag: uw toestemming (art. 6 lid 1 sub a AVG), die u te allen tijde kunt intrekken.',
                'Om onze website en dienstverlening te beveiligen, te onderhouden en te verbeteren — grondslag: ons gerechtvaardigd belang bij een veilige en goed functionerende website (art. 6 lid 1 sub f AVG).',
                'Om te voldoen aan wettelijke verplichtingen, bijvoorbeeld fiscale bewaarplichten — grondslag: wettelijke verplichting (art. 6 lid 1 sub c AVG).',
              ],
            },
            {
              type: 'p',
              text:
                'Wij nemen geen besluiten met rechtsgevolgen die uitsluitend zijn gebaseerd op geautomatiseerde ' +
                'verwerking, waaronder profilering.',
            },
          ],
        },
        {
          heading: '4. Bewaartermijnen',
          blocks: [
            {
              type: 'p',
              text:
                'Wij bewaren uw persoonsgegevens niet langer dan noodzakelijk is voor de doeleinden waarvoor ' +
                'zij zijn verzameld. Wij hanteren, conform de richtlijnen van de Autoriteit Persoonsgegevens, de ' +
                'volgende bewaartermijnen:',
            },
            {
              type: 'ul',
              items: [
                'Sollicitatiegegevens (waaronder uw cv): tot uiterlijk 4 weken na het einde van de sollicitatieprocedure, indien wij u niet kunnen plaatsen.',
                'Met uw uitdrukkelijke toestemming bewaren wij uw sollicitatiegegevens langer, tot maximaal 1 jaar, zodat wij u bij een passende vacature opnieuw kunnen benaderen.',
                'Gegevens van kandidaten die daadwerkelijk voor of via ons gaan werken, bewaren wij gedurende de wettelijk verplichte termijnen (waaronder fiscale bewaartermijnen van maximaal 7 jaar).',
                'Contactberichten die niet tot een sollicitatie leiden, verwijderen wij zodra de afhandeling is voltooid.',
              ],
            },
          ],
        },
        {
          heading: '5. Delen met derden (ontvangers)',
          blocks: [
            { type: 'p', text: 'Wij verkopen uw persoonsgegevens nooit aan derden. Wij delen uw gegevens uitsluitend wanneer dit noodzakelijk is voor onze dienstverlening of wanneer wij daartoe wettelijk verplicht zijn, met de volgende categorieën ontvangers:' },
            {
              type: 'ul',
              items: [
                'Opdrachtgevers (werkgevers) bij wie wij u, met uw instemming, voorstellen voor een functie.',
                'Verwerkers die in onze opdracht diensten leveren, zoals onze hosting- en IT-dienstverleners. Met deze partijen sluiten wij een verwerkersovereenkomst waarin passende waarborgen zijn vastgelegd.',
                'Overheidsinstanties, wanneer wij daartoe wettelijk verplicht zijn.',
              ],
            },
          ],
        },
        {
          heading: '6. Doorgifte buiten de Europese Economische Ruimte (EER)',
          blocks: [
            {
              type: 'p',
              text:
                'Uw persoonsgegevens worden opgeslagen en verwerkt op servers binnen de Europese Economische ' +
                'Ruimte (EER). Wij geven uw gegevens in beginsel niet door aan landen buiten de EER. Mocht dit in ' +
                'een specifiek geval toch noodzakelijk zijn, dan doen wij dit uitsluitend met passende waarborgen ' +
                'zoals de modelcontractbepalingen van de Europese Commissie.',
            },
          ],
        },
        {
          heading: '7. Beveiliging van uw gegevens',
          blocks: [
            {
              type: 'p',
              text:
                'Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen ' +
                'tegen verlies, misbruik en ongeoorloofde toegang. Onze website maakt gebruik van een beveiligde ' +
                'verbinding (HTTPS/TLS-versleuteling), de toegang tot gegevens is beperkt tot bevoegde medewerkers en ' +
                'wij evalueren onze beveiligingsmaatregelen regelmatig.',
            },
          ],
        },
        {
          heading: '8. Cookies en vergelijkbare technieken',
          blocks: [
            {
              type: 'p',
              text:
                'Onze website plaatst geen tracking- of advertentiecookies en volgt uw surfgedrag niet. Wij gebruiken ' +
                'uitsluitend functionele, noodzakelijke opslag in uw browser (local storage) om uw taalvoorkeur te ' +
                'onthouden. Hiervoor is op grond van de wet geen toestemming vereist.',
            },
            {
              type: 'p',
              text:
                'Onze website laadt lettertype- en icoonbestanden (Font Awesome) via een externe dienst (Cloudflare / ' +
                'cdnjs). Daarbij kan uw IP-adres aan deze dienst worden doorgegeven. Deze verwerking vindt plaats op grond ' +
                'van ons gerechtvaardigd belang bij een goed functionerende website (art. 6 lid 1 sub f AVG). Er worden ' +
                'hierbij geen cookies voor advertentie- of trackingdoeleinden geplaatst.',
            },
          ],
        },
        {
          heading: '9. Uw privacyrechten',
          blocks: [
            { type: 'p', text: 'Op grond van de AVG heeft u de volgende rechten met betrekking tot uw persoonsgegevens:' },
            {
              type: 'ul',
              items: [
                'Recht op inzage: u mag opvragen welke persoonsgegevens wij van u verwerken.',
                'Recht op rectificatie: u mag onjuiste gegevens laten corrigeren of aanvullen.',
                'Recht op verwijdering (“recht op vergetelheid”): u mag verzoeken uw gegevens te wissen.',
                'Recht op beperking van de verwerking.',
                'Recht op overdraagbaarheid van gegevens (dataportabiliteit).',
                'Recht van bezwaar tegen de verwerking.',
                'Recht om een gegeven toestemming te allen tijde in te trekken, zonder dat dit afbreuk doet aan de rechtmatigheid van de verwerking vóór de intrekking.',
              ],
            },
            {
              type: 'p',
              text:
                `U kunt uw rechten uitoefenen door een verzoek te sturen naar ${company.email}. Om uw identiteit te ` +
                'verifiëren kunnen wij u vragen om aanvullende gegevens. Wij reageren binnen één maand op uw verzoek.',
            },
          ],
        },
        {
          heading: '10. Klacht indienen bij de Autoriteit Persoonsgegevens',
          blocks: [
            {
              type: 'p',
              text:
                'Bent u van mening dat wij niet zorgvuldig met uw persoonsgegevens omgaan, dan vragen wij u eerst ' +
                `contact met ons op te nemen via ${company.email}. U heeft daarnaast altijd het recht om een klacht in te ` +
                'dienen bij de Nederlandse toezichthouder, de Autoriteit Persoonsgegevens, via www.autoriteitpersoonsgegevens.nl.',
            },
          ],
        },
        {
          heading: '11. Wijzigingen in deze privacyverklaring',
          blocks: [
            {
              type: 'p',
              text:
                'Wij kunnen deze privacyverklaring van tijd tot tijd aanpassen, bijvoorbeeld wanneer wet- of ' +
                'regelgeving daartoe aanleiding geeft. De meest actuele versie vindt u altijd op deze pagina. Wij ' +
                'adviseren u deze verklaring regelmatig te raadplegen.',
            },
          ],
        },
        {
          heading: '12. Contact',
          blocks: [
            { type: 'p', text: 'Heeft u vragen over deze privacyverklaring of over de manier waarop wij met uw persoonsgegevens omgaan? Neem dan gerust contact met ons op:' },
            {
              type: 'ul',
              items: [
                `${company.name}`,
                `E-mail: ${company.email}`,
                `Telefoon: ${company.phone}`,
                `Adres: ${company.address}`,
              ],
            },
          ],
        },
      ],
    },

    terms: {
      title: 'Algemene Voorwaarden & Disclaimer',
      updated: UPDATED_NL,
      intro:
        `Deze voorwaarden zijn van toepassing op het gebruik van de website ${company.website} van ${company.name}. ` +
        'Door de website te bezoeken en te gebruiken, gaat u akkoord met deze voorwaarden.',
      sections: [
        {
          heading: '1. Gebruik van de website',
          blocks: [
            {
              type: 'p',
              text:
                'U mag deze website uitsluitend gebruiken voor legitieme doeleinden en op een manier die geen inbreuk ' +
                'maakt op de rechten van anderen of het gebruik van de website door anderen belemmert. Misbruik, ' +
                'waaronder pogingen tot ongeoorloofde toegang, is niet toegestaan.',
            },
          ],
        },
        {
          heading: '2. Intellectueel eigendom',
          blocks: [
            {
              type: 'p',
              text:
                `Alle inhoud op deze website, waaronder teksten, afbeeldingen, logo’s en vormgeving, is eigendom van ` +
                `${company.name} of haar licentiegevers en is beschermd door intellectuele-eigendomsrechten. Het is niet ` +
                'toegestaan deze inhoud zonder voorafgaande schriftelijke toestemming te kopiëren, verspreiden of ' +
                'anderszins te gebruiken.',
            },
          ],
        },
        {
          heading: '3. Vacatures en bemiddeling',
          blocks: [
            {
              type: 'p',
              text:
                'De op de website getoonde vacatures zijn indicatief en kunnen op elk moment wijzigen of vervallen. ' +
                'Aan de inhoud van vacatures of aan een sollicitatie kunnen geen rechten worden ontleend; er ontstaat ' +
                'pas een verplichting wanneer daarover een uitdrukkelijke, schriftelijke overeenkomst is gesloten.',
            },
          ],
        },
        {
          heading: '4. Aansprakelijkheid',
          blocks: [
            {
              type: 'p',
              text:
                'Wij stellen de informatie op deze website met de grootst mogelijke zorg samen, maar kunnen niet ' +
                'garanderen dat deze te allen tijde volledig, juist en actueel is. Wij aanvaarden geen aansprakelijkheid ' +
                'voor enige directe of indirecte schade die voortvloeit uit het gebruik van deze website of de daarop ' +
                'geboden informatie, voor zover wettelijk toegestaan.',
            },
          ],
        },
        {
          heading: '5. Links naar websites van derden',
          blocks: [
            {
              type: 'p',
              text:
                'Onze website kan verwijzingen (links) naar websites van derden bevatten. Wij hebben geen zeggenschap ' +
                'over de inhoud van deze websites en aanvaarden geen aansprakelijkheid voor de inhoud of het ' +
                'privacybeleid daarvan.',
            },
          ],
        },
        {
          heading: '6. Toepasselijk recht',
          blocks: [
            {
              type: 'p',
              text:
                'Op deze voorwaarden en op elk gebruik van de website is uitsluitend Nederlands recht van toepassing. ' +
                'Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.',
            },
          ],
        },
      ],
    },
  },

  en: {
    company,

    privacy: {
      title: 'Privacy Statement',
      updated: UPDATED_EN,
      intro:
        `${company.name} attaches great importance to the protection of your personal data. ` +
        'This privacy statement explains, clearly and transparently, which personal data we process, ' +
        'for what purpose, on what legal basis and for how long. We process your personal data carefully, ' +
        'securely and solely in accordance with the General Data Protection Regulation (GDPR) and the Dutch ' +
        'GDPR Implementation Act (UAVG).',
      sections: [
        {
          heading: '1. Who we are (data controller)',
          blocks: [
            { type: 'p', text: 'The controller responsible for the processing of your personal data is:' },
            {
              type: 'ul',
              items: [
                `${company.name}`,
                `Address: ${company.address}`,
                `Chamber of Commerce (KvK) no.: ${company.kvk}`,
                `E-mail: ${company.email}`,
                `Telephone: ${company.phone}`,
                `Website: ${company.website}`,
              ],
            },
          ],
        },
        {
          heading: '2. Which personal data we process',
          blocks: [
            {
              type: 'p',
              text:
                'We process the personal data you provide to us yourself, for example when you complete the contact ' +
                'or application form. This concerns the following data:',
            },
            {
              type: 'ul',
              items: [
                'First and last name',
                'E-mail address',
                'Telephone number',
                'The content of your message',
                'Your curriculum vitae (CV) and the data it contains, such as education and work experience, if you choose to upload a CV',
              ],
            },
            {
              type: 'p',
              text:
                'In addition, for technical and security reasons our servers automatically record a limited amount of ' +
                'data, such as your IP address, the time of your visit and your browser type. We do not use this data to ' +
                'identify you personally.',
            },
            {
              type: 'p',
              text:
                'We ask you not to include special categories of personal data (such as data concerning health, religion, ' +
                'race or your citizen service number) in your message or CV, unless this is strictly necessary for the ' +
                'placement.',
            },
          ],
        },
        {
          heading: '3. Purposes and legal bases',
          blocks: [
            { type: 'p', text: 'We process your personal data solely for the following purposes and on the legal basis stated for each, pursuant to Article 6 GDPR:' },
            {
              type: 'ul',
              items: [
                'To contact you and answer your question or request — basis: performance of a contract or taking pre-contractual steps at your request (Art. 6(1)(b) GDPR).',
                'To help place you in suitable work and introduce you to clients (employers) — basis: performance of the contract / pre-contractual steps (Art. 6(1)(b) GDPR).',
                'To retain your CV and data for future vacancies — basis: your consent (Art. 6(1)(a) GDPR), which you may withdraw at any time.',
                'To secure, maintain and improve our website and services — basis: our legitimate interest in a secure and well-functioning website (Art. 6(1)(f) GDPR).',
                'To comply with legal obligations, such as tax retention duties — basis: legal obligation (Art. 6(1)(c) GDPR).',
              ],
            },
            {
              type: 'p',
              text:
                'We do not take decisions producing legal effects that are based solely on automated processing, ' +
                'including profiling.',
            },
          ],
        },
        {
          heading: '4. Retention periods',
          blocks: [
            {
              type: 'p',
              text:
                'We do not keep your personal data longer than necessary for the purposes for which it was collected. In ' +
                'line with the guidance of the Dutch Data Protection Authority we apply the following retention periods:',
            },
            {
              type: 'ul',
              items: [
                'Application data (including your CV): up to 4 weeks after the end of the application procedure, if we are unable to place you.',
                'With your explicit consent we keep your application data longer, for up to 1 year, so we can contact you again about a suitable vacancy.',
                'Data of candidates who actually start working for or through us is kept for the legally required periods (including tax retention periods of up to 7 years).',
                'Contact messages that do not lead to an application are deleted once they have been handled.',
              ],
            },
          ],
        },
        {
          heading: '5. Sharing with third parties (recipients)',
          blocks: [
            { type: 'p', text: 'We never sell your personal data. We only share your data where necessary for our services or where we are legally required to do so, with the following categories of recipients:' },
            {
              type: 'ul',
              items: [
                'Clients (employers) to whom we introduce you, with your agreement, for a position.',
                'Processors that provide services on our behalf, such as our hosting and IT providers. We conclude a data processing agreement with these parties containing appropriate safeguards.',
                'Government authorities, where we are legally obliged to do so.',
              ],
            },
          ],
        },
        {
          heading: '6. Transfers outside the European Economic Area (EEA)',
          blocks: [
            {
              type: 'p',
              text:
                'Your personal data is stored and processed on servers within the European Economic Area (EEA). In ' +
                'principle we do not transfer your data to countries outside the EEA. Should this nevertheless be necessary ' +
                'in a specific case, we will only do so with appropriate safeguards, such as the European Commission’s ' +
                'standard contractual clauses.',
            },
          ],
        },
        {
          heading: '7. Security of your data',
          blocks: [
            {
              type: 'p',
              text:
                'We take appropriate technical and organisational measures to protect your personal data against loss, ' +
                'misuse and unauthorised access. Our website uses a secure connection (HTTPS/TLS encryption), access to ' +
                'data is limited to authorised staff and we review our security measures regularly.',
            },
          ],
        },
        {
          heading: '8. Cookies and similar technologies',
          blocks: [
            {
              type: 'p',
              text:
                'Our website does not place tracking or advertising cookies and does not monitor your browsing behaviour. ' +
                'We only use functional, necessary storage in your browser (local storage) to remember your language ' +
                'preference. No consent is legally required for this.',
            },
            {
              type: 'p',
              text:
                'Our website loads font and icon files (Font Awesome) via an external service (Cloudflare / cdnjs). In doing ' +
                'so, your IP address may be passed to this service. This processing takes place on the basis of our ' +
                'legitimate interest in a well-functioning website (Art. 6(1)(f) GDPR). No cookies for advertising or ' +
                'tracking purposes are placed in the process.',
            },
          ],
        },
        {
          heading: '9. Your privacy rights',
          blocks: [
            { type: 'p', text: 'Under the GDPR you have the following rights regarding your personal data:' },
            {
              type: 'ul',
              items: [
                'Right of access: you may request which personal data we process about you.',
                'Right to rectification: you may have inaccurate data corrected or completed.',
                'Right to erasure (“right to be forgotten”): you may request that your data be deleted.',
                'Right to restriction of processing.',
                'Right to data portability.',
                'Right to object to the processing.',
                'Right to withdraw consent at any time, without affecting the lawfulness of processing before the withdrawal.',
              ],
            },
            {
              type: 'p',
              text:
                `You can exercise your rights by sending a request to ${company.email}. To verify your identity we may ask ` +
                'you for additional information. We will respond to your request within one month.',
            },
          ],
        },
        {
          heading: '10. Filing a complaint with the Dutch Data Protection Authority',
          blocks: [
            {
              type: 'p',
              text:
                'If you believe that we do not handle your personal data carefully, we ask you to first contact us at ' +
                `${company.email}. You also always have the right to lodge a complaint with the Dutch supervisory authority, ` +
                'the Autoriteit Persoonsgegevens, via www.autoriteitpersoonsgegevens.nl.',
            },
          ],
        },
        {
          heading: '11. Changes to this privacy statement',
          blocks: [
            {
              type: 'p',
              text:
                'We may amend this privacy statement from time to time, for example when laws or regulations require it. ' +
                'The most current version is always available on this page. We advise you to consult this statement regularly.',
            },
          ],
        },
        {
          heading: '12. Contact',
          blocks: [
            { type: 'p', text: 'Do you have questions about this privacy statement or about how we handle your personal data? Please feel free to contact us:' },
            {
              type: 'ul',
              items: [
                `${company.name}`,
                `E-mail: ${company.email}`,
                `Telephone: ${company.phone}`,
                `Address: ${company.address}`,
              ],
            },
          ],
        },
      ],
    },

    terms: {
      title: 'Terms & Disclaimer',
      updated: UPDATED_EN,
      intro:
        `These terms apply to the use of the website ${company.website} of ${company.name}. ` +
        'By visiting and using the website, you agree to these terms.',
      sections: [
        {
          heading: '1. Use of the website',
          blocks: [
            {
              type: 'p',
              text:
                'You may use this website only for legitimate purposes and in a way that does not infringe the rights of ' +
                'others or restrict others’ use of the website. Misuse, including attempts at unauthorised access, is not ' +
                'permitted.',
            },
          ],
        },
        {
          heading: '2. Intellectual property',
          blocks: [
            {
              type: 'p',
              text:
                `All content on this website, including texts, images, logos and design, is the property of ${company.name} ` +
                'or its licensors and is protected by intellectual property rights. This content may not be copied, ' +
                'distributed or otherwise used without prior written permission.',
            },
          ],
        },
        {
          heading: '3. Vacancies and placement',
          blocks: [
            {
              type: 'p',
              text:
                'The vacancies shown on the website are indicative and may change or lapse at any time. No rights can be ' +
                'derived from the content of vacancies or from an application; an obligation only arises once an express, ' +
                'written agreement has been concluded.',
            },
          ],
        },
        {
          heading: '4. Liability',
          blocks: [
            {
              type: 'p',
              text:
                'We compile the information on this website with the greatest possible care, but cannot guarantee that it ' +
                'is complete, accurate and up to date at all times. To the extent permitted by law, we accept no liability ' +
                'for any direct or indirect damage arising from the use of this website or the information provided on it.',
            },
          ],
        },
        {
          heading: '5. Links to third-party websites',
          blocks: [
            {
              type: 'p',
              text:
                'Our website may contain references (links) to third-party websites. We have no control over the content of ' +
                'these websites and accept no liability for their content or privacy policy.',
            },
          ],
        },
        {
          heading: '6. Applicable law',
          blocks: [
            {
              type: 'p',
              text:
                'These terms and any use of the website are governed exclusively by Dutch law. Disputes will be submitted ' +
                'to the competent court in the Netherlands.',
            },
          ],
        },
      ],
    },
  },
}
