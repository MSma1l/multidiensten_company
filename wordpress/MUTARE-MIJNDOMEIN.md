# Mutarea site-ului la Mijndomein

Ai construit și testat site-ul local (vezi **INSTALARE-LOCAL.md**) și acum vrei să îl pui online, pe găzduirea **Mijndomein WordPress**. Acest ghid te ghidează pas cu pas. Nu te grăbi și urmează ordinea – este mai simplu decât pare. 🙂

> **Pe scurt, cum decurge mutarea:**
> 1. **Exporți** site-ul local într-un singur fișier.
> 2. **Cumperi** găzduirea WordPress la Mijndomein și instalezi WordPress acolo.
> 3. **Imporți** fișierul exportat pe site-ul de la Mijndomein.
>
> Folosim un plugin gratuit numit **All-in-One WP Migration**, care face totul automat (temă + conținut + bază de date + imagini).

---

## 1. Cumpără și găsește găzduirea WordPress la Mijndomein

1. Intră pe contul tău **Mijndomein** și conectează-te.
2. Cumpără un pachet de **WordPress hosting** (găzduire WordPress), dacă nu ai deja unul.
3. Mergi la **Mijn producten** (Produsele mele) și selectează găzduirea/domeniul respectiv.
4. Caută opțiunea **WordPress installeren** sau un instalator **"1-click" / Softaculous** și instalează WordPress.

   > Interfața Mijndomein se poate schimba din când în când. Dacă nu găsești butonul, caută în panou orice opțiune care conține cuvântul **WordPress** sau **1-click install**. Dacă tot nu îl găsești, contactează **suportul Mijndomein** – te ajută să instalezi WordPress în câteva minute.

5. După instalare, **notează cu grijă**:
   - **Adresa de administrare** (de obicei `https://domeniul-tau.nl/wp-admin`)
   - **Utilizatorul** și **parola** de administrator de la Mijndomein

   > Aceste date de la Mijndomein le folosim doar pentru prima conectare. După import, utilizatorul/parola vor fi cele de la site-ul tău **local** (vezi pasul 4).

---

## 2. Exportă site-ul local

Pe site-ul tău **local** (din LocalWP):

1. Intră în administrare (**WP Admin**).
2. În meniul din stânga mergi la **Plugins** → **Nieuwe plugin** (Plugin nou).
3. În căsuța de căutare scrie: **All-in-One WP Migration**.
4. La pluginul cu acest nume apasă **Nu installeren** / **Install Now** (Instalează), apoi **Activeren** / **Activate** (Activează).
5. În meniul din stânga va apărea **All-in-One WP Migration**. Apasă pe el → **Export**.
6. Apasă **Export to** (Exportă către) → alege **File** (Fișier).
7. Așteaptă să se termine (apare o bară de progres). La final apasă butonul de **download** și salvează fișierul cu terminația **`.wpress`** pe calculator (de exemplu pe Desktop).

> 💾 Acest fișier `.wpress` conține TOT site-ul tău: temă, pagini, joburi, mesaje, imagini și setări.

---

## 3. Importă site-ul pe Mijndomein

Acum lucrăm pe site-ul de la **Mijndomein**:

1. Deschide adresa de administrare notată la pasul 1 (`https://domeniul-tau.nl/wp-admin`) și conectează-te cu utilizatorul/parola de la Mijndomein.
2. Instalează **același** plugin: **Plugins** → **Nieuwe plugin** → caută **All-in-One WP Migration** → **Install Now** → **Activate**.
3. În meniul din stânga apasă **All-in-One WP Migration** → **Import**.
4. Apasă **Import from** → **File** și selectează fișierul **`.wpress`** descărcat la pasul 2.
5. Va apărea un avertisment că importul **suprascrie** site-ul actual (baza de date, fișierele media etc.). Confirmă – este normal, pentru că vrem să înlocuim WordPress-ul gol cu site-ul tău.
6. Așteaptă să se termine importul.

> 🔑 **Foarte important – conectare după import:** importul a înlocuit și utilizatorii. De acum te conectezi cu **utilizatorul și parola de la site-ul LOCAL** (cele setate în LocalWP), NU cu cele de la Mijndomein.

7. După import, conectează-te din nou (cu datele de la site-ul local) și mergi la **Instellingen** / **Settings** (Setări) → **Permalinks** → apasă **Save Changes** (Salvează). Acest pas reîmprospătează linkurile și previne erorile "404".

---

## ⚠️ Dacă importul este blocat din cauza dimensiunii fișierului

Versiunea gratuită a pluginului are o limită de încărcare (de obicei **256–512 MB**). Site-ul tău este mic, deci ar trebui să încapă fără probleme.

Dacă totuși apare un mesaj că fișierul e prea mare, ai trei variante simple:

1. **Cere suportului Mijndomein** să mărească valorile `upload_max_filesize` și `post_max_size`.
2. Instalează extensia gratuită **All-in-One WP Migration File Extension** (mărește limita de import).
3. **Contactează-mă pe mine** și te ajut să rezolvăm rapid.

---

## ✅ Checklist după mutare

Pe site-ul de la Mijndomein, verifică:

- [ ] Paginile se deschid corect (**Home**, **Vacatures**, **Contact**).
- [ ] Tema **Multidiensten** este **activă**.
- [ ] **Joburile** se văd pe pagina Vacatures.
- [ ] **Formularul de contact** trimite mesaje – **testează-l tu însuți** trimițând un mesaj de probă.
- [ ] Mesajul de test apare în administrare, la **Sollicitaties**.
- [ ] Butoanele **NL / EN** schimbă limba.
- [ ] **Domeniul** este conectat și **SSL-ul (https)** este activ (Mijndomein activează de regulă SSL automat; dacă nu, cere-le să îl activeze).

Dacă toate sunt bifate, site-ul este live! 🎉

---

## 📌 De reținut

Vechea versiune a proiectului (cea făcută în **React / FastAPI**) **rămâne neatinsă** și nu are nicio legătură cu acest pas. Pentru Mijndomein avem nevoie **doar** de exportul WordPress (`.wpress`) descris în acest ghid.
