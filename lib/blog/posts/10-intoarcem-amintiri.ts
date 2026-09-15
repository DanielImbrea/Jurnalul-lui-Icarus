import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "de-ce-ne-intoarcem-la-amintiri",
  title: "De ce ne întoarcem la amintiri?",
  excerpt:
    "Nostalgia te liniștește, obsesia te trage înapoi. Diferența stă în ce faci când trecutul te cheamă: îl vizitezi sau rămâi blocat acolo.",
  publishedAt: "2026-08-13",
  tags: ["amintiri", "nostalgie", "psihologie"],
  blocks: [
    {
      type: "paragraph",
      text:
        "Observi un detaliu, un miros, o stradă pe care ai mers odinioară, și ești din nou acolo. Ne întoarcem la amintiri pentru că ele compun identitatea: cine am fost, ce am iubit, ce am pierdut. Problema nu e că le vizitezi, ci că uneori rămâi blocat în trecut."
    },
    {
      type: "heading",
      level: 2,
      text: "Nostalgia utilă"
    },
    {
      type: "paragraph",
      text:
        "Amintirile plăcute scad tensiunea pe termen scurt. Mintea revine la o perioadă în care simțea siguranță, chiar dacă, privind înapoi, știi că amintirea e puțin idealizată. Nostalgia calmează, nu e neapărat minciună, ci un mod de a te liniști."
    },
    {
      type: "heading",
      level: 2,
      text: "Bucla dureroasă"
    },
    {
      type: "paragraph",
      text:
        "Când aceeași scenă revine fără informație nouă, emoția nu se descarcă, se reîncarcă. De obicei lipsește finalul: conversația neterminată, răspunsul absent, rămas-bunul nerostit. Mintea reia filmul ca și cum ai mai avea o șansă la un alt final."
    },
    {
      type: "paragraph",
      text:
        "Un exercițiu simplu, folosit des în terapie și în jurnal: notezi scena o dată, la persoana a treia, apoi adaugi o propoziție pe care nu ai putut-o spune atunci. Nu schimbă trecutul, dar uneori schimbă prezentul."
    }
  ]
};
