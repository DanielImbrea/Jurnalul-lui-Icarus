import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LegalContent from "@/components/LegalContent";
import { legalInfo, LEGAL_LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  alternates: { canonical: "/politica-de-confidentialitate" }
};

export default function ConfidentialitatePage() {
  const {
    operatorName,
    brandName,
    siteUrl,
    contactEmail,
    dataRetentionYears
  } = legalInfo;

  return (
    <>
      <PageHero
        eyebrow="Informații legale"
        title="Politica de confidențialitate"
        atmosphere="neutral"
      />
      <LegalContent>
        <p className="text-ash">
          Ultima actualizare: {LEGAL_LAST_UPDATED}. {operatorName}, operatorul
          site-ului {brandName} ({siteUrl}), respectă Regulamentul (UE)
          2016/679 (GDPR) și legislația națională privind protecția datelor
          cu caracter personal.
        </p>

        <h2>1. Operatorul de date</h2>
        <p>
          Operator: {operatorName} (persoană fizică)
          <br />
          Email:{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="underline decoration-bone/30 underline-offset-4 hover:text-ember"
          >
            {contactEmail}
          </a>
        </p>

        <h2>2. Ce date colectăm</h2>
        <p>În funcție de modul în care folosești site-ul, putem prelucra:</p>
        <ul>
          <li>
            date de identificare și contact: nume, adresă de email, număr de
            telefon, adresă de livrare;
          </li>
          <li>
            date legate de comandă: produse comandate, valoare, metodă de plată,
            statusul comenzii;
          </li>
          <li>
            date tehnice: adresa IP, tip de browser, pagini vizitate — doar dacă
            accepți cookie-urile de analiză (Google Analytics);
          </li>
          <li>
            conținut trimis voluntar: recenzii, mesaje din formulare, imagini
            încărcate în galeria cititorilor.
          </li>
        </ul>
        <p>
          Datele cardului bancar sunt procesate exclusiv de Stripe și nu sunt
          stocate pe serverele noastre.
        </p>

        <h2>3. Scopul prelucrării</h2>
        <ul>
          <li>procesarea, livrarea și facturarea comenzilor;</li>
          <li>comunicarea legată de comenzi, retururi sau solicitări;</li>
          <li>moderarea conținutului generat de utilizatori (recenzii, galerie);</li>
          <li>
            analiza anonimizată/agregată a traficului pe site, cu consimțământ
            (Google Analytics);
          </li>
          <li>respectarea obligațiilor legale și fiscale.</li>
        </ul>

        <h2>4. Temeiul legal</h2>
        <ul>
          <li>executarea contractului de vânzare-cumpărare (comenzi);</li>
          <li>obligații legale (evidență contabilă, fiscală);</li>
          <li>
            consimțământul tău explicit (cookie-uri de analiză, conținut
            voluntar precum newsletter sau recenzii, unde este cazul);
          </li>
          <li>
            interesul legitim (securitatea site-ului, prevenirea abuzurilor).
          </li>
        </ul>

        <h2>5. Partajarea datelor</h2>
        <p>Datele pot fi transmise, strict cât este necesar, către:</p>
        <ul>
          <li>
            <strong>Stripe</strong> — procesarea plăților cu cardul;
          </li>
          <li>
            <strong>Fan Courier, Cargus sau SameDay</strong> — livrarea coletelor;
          </li>
          <li>
            <strong>Resend</strong> — trimiterea emailurilor legate de comenzi;
          </li>
          <li>
            <strong>Supabase</strong> — stocarea comenzilor, recenziilor și
            conținutului din galerie;
          </li>
          <li>
            <strong>Google Analytics</strong> — statistici de utilizare, doar cu
            consimțământul tău;
          </li>
          <li>
            <strong>Vercel</strong> — găzduirea site-ului.
          </li>
        </ul>
        <p>
          Nu vindem și nu cedăm datele tale către terți în scop de marketing.
        </p>

        <h2>6. Durata stocării</h2>
        <p>
          Datele comenzilor și documentele fiscale sunt păstrate conform
          obligațiilor legale, în general până la {dataRetentionYears} ani de la
          finalizarea tranzacției. Recenziile și conținutul public din galerie
          pot fi păstrate cât timp rămân vizibile pe site, dacă nu soliciți
          ștergerea. Datele de analiză Google Analytics sunt păstrate conform
          setărilor platformei (implicit până la 14 luni).
        </p>

        <h2>7. Drepturile persoanei vizate</h2>
        <p>Ai dreptul de:</p>
        <ul>
          <li>acces la datele tale;</li>
          <li>rectificare sau actualizare;</li>
          <li>ștergere („dreptul de a fi uitat”), în limitele legii;</li>
          <li>restricționarea prelucrării;</li>
          <li>portabilitatea datelor;</li>
          <li>opoziție față de anumite prelucrări;</li>
          <li>
            retragerea consimțământului pentru cookie-urile de analiză, oricând.
          </li>
        </ul>
        <p>
          Pentru exercitarea acestor drepturi, scrie-ne la{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="underline decoration-bone/30 underline-offset-4 hover:text-ember"
          >
            {contactEmail}
          </a>
          . Ai dreptul de a depune plângere la Autoritatea Națională de
          Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP) —{" "}
          <a
            href="https://www.dataprotection.ro"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-bone/30 underline-offset-4 hover:text-ember"
          >
            dataprotection.ro
          </a>
          .
        </p>

        <h2>8. Cookie-uri</h2>
        <p>
          Detalii despre cookie-urile folosite și modul de gestionare a
          consimțământului sunt disponibile în{" "}
          <a
            href="/politica-de-cookies"
            className="underline decoration-bone/30 underline-offset-4 hover:text-ember"
          >
            Politica de cookies
          </a>
          .
        </p>
      </LegalContent>
    </>
  );
}
