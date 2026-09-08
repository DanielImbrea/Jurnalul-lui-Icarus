import Link from "next/link";
import Logo from "./Logo";
import { BRAND_NAME, CONTACT_EMAIL, TIKTOK_HANDLE, TIKTOK_URL } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="relative border-t border-bone/10">
      <div className="container-editorial grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-ash">
            Cele două cărți fac parte din același univers, dar spun povești
            diferite. În jurul lor s-a format o comunitate de cititori care
            continuă să le descopere, să le interpreteze și să vorbească despre
            ele — aici, pe TikTok și prin experiențele împărtășite de cei care
            le-au citit.
          </p>
        </div>

        <div>
          <p className="font-sans text-[12px] uppercase tracking-[0.14em] text-mist">
            Cărțile
          </p>
          <ul className="mt-4 space-y-3 font-sans text-sm text-ash">
            <li>
              <Link href="/carti/sub-umbrele-lui-blake" className="hover:text-bone">
                Sub Umbrele lui Blake
              </Link>
            </li>
            <li>
              <Link
                href="/carti/imbratisarea-durerii-si-avantajele-ei"
                className="hover:text-bone"
              >
                Îmbrățișarea Durerii
              </Link>
            </li>
            <li>
              <Link href="/comanda" className="hover:text-bone">
                Comandă
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-sans text-[12px] uppercase tracking-[0.14em] text-mist">
            Univers
          </p>
          <ul className="mt-4 space-y-3 font-sans text-sm text-ash">
            <li>
              <Link href="/comunitate" className="hover:text-bone">
                Comunitate
              </Link>
            </li>
            <li>
              <Link href="/galeria-cititorilor" className="hover:text-bone">
                Galeria cititorilor
              </Link>
            </li>
            <li>
              <Link href="/lasa-o-recenzie" className="hover:text-bone">
                Lasă o recenzie
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-bone">
                Contact
              </Link>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-bone">
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="hover:text-bone">
                {TIKTOK_HANDLE}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="rule" />

      <div className="container-editorial flex flex-col gap-4 py-8 font-sans text-xs text-ash/70 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {BRAND_NAME}. Toate drepturile rezervate.</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <Link href="/termeni-si-conditii" className="hover:text-bone">
              Termeni și condiții
            </Link>
          </li>
          <li>
            <Link href="/politica-de-confidentialitate" className="hover:text-bone">
              Confidențialitate
            </Link>
          </li>
          <li>
            <Link href="/politica-de-retur" className="hover:text-bone">
              Retur
            </Link>
          </li>
          <li>
            <Link href="/politica-de-cookies" className="hover:text-bone">
              Cookies
            </Link>
          </li>
          <li>
            <Link href="/livrare-si-comenzi" className="hover:text-bone">
              Livrare
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
