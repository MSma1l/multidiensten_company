# Instalare locală – Tema "Randstad-Diensten"

Acest ghid te ajută să rulezi site-ul WordPress pe calculatorul tău (macOS), ca să îl vezi funcționând înainte să îl muți online. Nu ai nevoie de cunoștințe tehnice – urmează pașii pe rând și totul va merge. 🙂

> **Important:** aici construim site-ul **local** (doar pe calculatorul tău). După ce funcționează, îl mutăm la Mijndomein folosind ghidul **MUTARE-MIJNDOMEIN.md**.

---

## 1. Ce este LocalWP și de unde îl iei

**LocalWP** (sau "Local") este un program **gratuit** care instalează un WordPress complet pe calculatorul tău, fără să te complici cu servere sau baze de date. Este cel mai simplu mod de a testa un site WordPress.

1. Intră pe **https://localwp.com**
2. Apasă pe **Download** și alege versiunea pentru **Mac**.
3. Deschide fișierul descărcat și trage aplicația **Local** în folderul **Applications** (Aplicații), apoi deschide-o.

La prima pornire poate să dureze puțin (instalează componentele necesare). E normal.

---

## 2. Creează un site WordPress local

1. În LocalWP apasă butonul **+ Create a new site** (Creează un site nou).
2. La nume scrie: **randstad-diensten** (sau orice nume îți place). Apasă **Continue**.
3. La tipul de configurare lasă selectat **Preferred** (varianta recomandată – PHP, server web și bază de date implicite). Apasă **Continue**.
4. Acum setezi contul de administrator al site-ului:
   - **WordPress Username** (utilizator): de exemplu `admin`
   - **WordPress Password** (parolă): alege o parolă și **noteaz-o undeva**
   - **WordPress Email**: adresa ta de email

   > ⚠️ **Ține minte utilizatorul și parola!** Vei avea nevoie de ele ca să intri în administrare, iar mai târziu și pe site-ul de la Mijndomein.

5. Apasă **Add Site** și așteaptă să se instaleze (un minut sau două).

Când e gata, vei vedea site-ul în lista din stânga, cu butoanele **WP Admin** (intrare în administrare) și **Open site** (vezi site-ul).

---

## 3. Unde se află fișierele WordPress

Tema (designul și funcțiile site-ului) trebuie copiată într-un folder anume.

1. În LocalWP, selectează site-ul **randstad-diensten** din stânga.
2. În dreapta sus apasă butonul **Go to site folder** (Deschide folderul site-ului). Se va deschide Finder.
3. Intră în: **app** → **public** → **wp-content** → **themes**

Acesta este folderul în care stau temele: `app/public/wp-content/themes/`

---

## 4. Instalează tema "multidiensten"

1. Deschide un al doilea Finder și mergi la folderul temei pregătite:

   `<folderul-proiectului>/wordpress/multidiensten/`

2. **Copiază tot folderul `multidiensten`** (nu doar fișierele din el – folderul întreg).
3. **Lipește-l** în folderul de teme deschis la pasul anterior:

   `app/public/wp-content/themes/`

La final ar trebui să ai: `.../wp-content/themes/multidiensten/`

---

## 5. Activează tema

1. În LocalWP apasă **WP Admin** (sau intră pe `http://localhost/wp-admin`).
2. Conectează-te cu utilizatorul și parola setate la pasul 2.
3. În meniul din stânga mergi la **Weergave** / **Appearance** (Aspect) → **Thema's** / **Themes** (Teme).
4. Găsește tema **Multidiensten** și apasă **Activeren** / **Activate** (Activează).

**Ce se întâmplă automat la activare:**
- Se creează singure paginile **Home** (pagina principală), **Vacatures** (lista de joburi) și **Contact** (formularul de contact).
- Pagina **Home** este setată automat ca pagină de start a site-ului.

Nu trebuie să creezi nimic manual. 🎉

> 💡 **Dacă apare eroarea "404" la meniu sau la linkuri:** mergi la **Instellingen** / **Settings** (Setări) → **Permalinks** și apasă pur și simplu **Wijzigingen opslaan** / **Save Changes** (Salvează). Asta reîmprospătează adresele și rezolvă problema.

---

## 6. Adaugă un job (vacature)

1. În administrare, în meniul din stânga apasă **Vacatures**.
2. Apasă **Nieuwe vacature** (Job nou).
3. Completează câmpurile (atât în **NL**, cât și în **EN**):
   - Titlul jobului (NL + EN)
   - Descrierea (NL + EN)
   - **Salariu minim** și **Salariu maxim**
   - **Locație** (Locatie)
   - **Nivel** (Level)
   - **Experiență** (Ervaring)
   - **Ore** (Uren)
4. Apasă **Publiceren** / **Publish** (Publică).

Jobul va apărea imediat pe pagina **Vacatures** a site-ului.

---

## 7. Vezi mesajele de contact (sollicitaties)

Când cineva trimite formularul de contact, mesajul ajunge în administrare.

1. În meniul din stânga apasă **Sollicitaties**.
2. Apasă pe o intrare ca să o deschizi.
3. Vei vedea detaliile persoanei și butonul **Download CV** pentru a descărca CV-ul atașat.

---

## 8. Schimbă limba site-ului (NL / EN)

Site-ul este bilingv. În **antetul (header) site-ului** există două butoane: **NL** și **EN**. Apasă pe ele ca să schimbi limba afișată. Nu e nevoie de niciun plugin – funcția este deja inclusă în temă.

---

## ✅ Checklist: verifică faptul că totul funcționează

Deschide site-ul (**Open site**) și verifică:

- [ ] Pagina **Home** afișează secțiunea principală (hero).
- [ ] Pagina **Vacatures** listează joburile, iar **filtrele** funcționează.
- [ ] **Formularul de contact** se trimite și apare mesajul de succes.
- [ ] Mesajul trimis apare în administrare, la **Sollicitaties**.
- [ ] Butoanele **NL / EN** schimbă limba site-ului.

Dacă toate sunt bifate, felicitări – site-ul funcționează local! 🎉

Următorul pas este să îl muți online, urmând ghidul **MUTARE-MIJNDOMEIN.md**.
