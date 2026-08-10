# Benchmark — clones et skills d'artifacts (améliorations inspirées)

**Date:** 2026-08-06
**Statut:** analyse complète, 15 repos lus au niveau source (SKILL.md, validateurs, manifests, builds), pas seulement les README.
**Objet:** comparer l'écosystème artifact-building à notre flow 8-gates (`artifact-builder`), tirer les idées à adopter/ignorer.
**Input direct:** ticket 05 (Verification gate) — plusieurs idées ici sont des inputs concrets pour ce ticket ouvert.

---

## 1. Répertoire des repos analysés (15)

| Repo | ⭐ | Famille | Ce que c'est |
|---|---|---|---|
| `ThariqS/html-effectiveness` | 634 | Fondation | L'essai fondateur "The unreasonable effectiveness of HTML" + 31 exemples (20 + 11 unknowns) |
| `claudio-silva/claude-artifact-runner` | 571 | Build | `npx run-claude-artifact build` → HTML single-file ou projet React+TS+Vite+Tailwind+shadcn |
| `haidang1810/md2html` | 411 | Skill | md → HTML analysé (template + catalogue composants) |
| `jiji262/claude-design-skill` | 171 | Taste | Design system interne de Claude.ai adapté en skill (anti-slop, scale floors, assets) |
| `dogum/html-artifacts` | 133 | Skill | Heuristique de déclenchement HTML-vs-markdown + 9 catégories de références |
| `clockless-org/html-anything` | 128 | Skill | 17 styles systems, routing 3 couches, vérif navigateur |
| `madewithclaude/awesome-claude-artifacts` | 65 | Curated | Liste de référence |
| `coda0HQ/open-artifacts` | 45 | Pipeline | Recipe JSON + fragments → publish Cloudflare, Manifest v2 (hash), versions, chiffrement |
| `mesomya/html-artifact` | 13 | Skill | Visual systems + composition-before-boxes + anti-slop |
| `julianoczkowski/html` | 7 | Skill | 12 patterns slash-commands + templates/base.html + gallery |
| `ClawEnable/html-artifact-best-practices` | 1 | Skill+validator | Judge/create/review + validateur Node zero-dep + checklist 11 dimensions |
| `liush2yuxjtu/html-artifacts` | 0 | Skill | 20 exemples bundlés = quality bar + token block dans le SKILL.md |
| `fuller-stack-dev/make-html` | 0 | Skill | 5 medium rules + validation.md tiered + style provenance |
| `xiagaohui/local-artifacts-for-claude-code` | 0 | Local | MCP server + SSE live-reload (1 fichier python) |
| `mayfer/open-artifacts` | 213 | Runtime | esbuild-wasm dans le navigateur + deps CDN + iframe blob |

**Familles:** 8 skills · 2 fondations/théorie · 2 pipelines/builds · 2 runtimes · 1 curated list.

**Nota:** `ericforai/html-first-workflow` (identifié en recherche initiale) est introuvable sur GitHub (404 repo + user + wayback) — exclu de l'analyse source.

---

## 2. Comparaison gate par gate

Légende: ✅ notre gate couvert ET mieux · ⚠️ comparable · ❌ plus faible que les meilleurs du marché.

### Gate 1 — Brainstorm/scope
**Verdict: ⚠️ comparable — jiji262 est plus fort.**

- **jiji262** (le plus fort): checklist de 8-10 questions en UN tour, table when-to-ask-vs-build, et **Design Direction Advisor** (brief trop vague → propose 3 directions issues de 10 philosophies distinctes, budget 5-10 min, puis sort du mode).
- **coda0HQ**: scope = champ de premier rang du Recipe + isolation de la génération de contenu dans un sous-agent (le parent ne reçoit que URL + version).
- **dogum / ClawEnable**: heuristiques de déclenchement (triggers + carve-outs), pas de vraie session de scope.
- La plupart des autres: aucun scope — routage automatique.

**À adopter:** checklist 8-10 questions en un tour (gate 1), champ `scope` explicite dans le brief.

### Gate 2 — Décision de format (JSX vs HTML)
**Verdict: ⚠️ notre table ticket-08 est la seule sur l'axe JSX-vs-HTML. Les autres décident HTML-vs-Markdown (pré-gate).**

- **dogum** (le plus net): 8 triggers positifs + 5 carve-outs + seuil ~100 lignes + honnêteté coût token (2-4×). Mécanisme modèle pour un *pré-gate 0* : "ce travail mérite-t-il un artifact du tout ?".
- **ClawEnable**: Judge-before-create (2 étapes) + 20 trigger evals avec `expected_action`/`expected_pattern`/`must_not_do`.
- **coda0HQ**: `format: html|markdown|react` + `level: 1|2|3` (doc → interactif → riche) + `canvas` orthogonal — la décision de format est structurée en 3 axes.
- **jiji262**: arbre de décision output-formats (canvas / deck / prototype / animation / wireframe).

**À adopter:** pré-gate 0 HTML-vs-Markdown (triggers dogum) ; notre table JSX-vs-HTML reste l'axe interne. Le `level 1-3` de coda0HQ est un complément possible.

### Gate 3 — Domain-model validation
**Verdict: ✅ notre gate 3 est unique — personne n'a de vraie validation de modèle de domaine.**

- **md2html** (le plus proche): §11 component-selection cheatsheet — mapping contenu→structure ("liste numérotée → timeline", "flow → Mermaid", "pros/cons → box", "conclusion → highlight"). C'est un mapping contenu-structure explicite.
- **ClawEnable**: dimensions review "Content Fidelity" et "Source-of-Truth Preservation" (pas de gate, mais des critères de vérif).
- **jiji262**: fact-verification gate (WebSearch d'abord pour tout brief nommant un produit/version → `product-facts.md`) — adjacent, volable.
- **coda0HQ**: JSON Schema `additionalProperties:false` (clés inconnues = erreurs) + validation runtime.

**À adopter:** cheatsheet contenu→structure de md2html comme aide gate 3 ; fact-verification de jiji262 pour briefs avec produit/version nommé.

### Gate 4 — Design tokens / taste
**Verdict: ⚠️ comparable — les meilleurs ont plus d'outillage anti-slop et d'enforcement que nous.**

- **jiji262** (le plus profond): 10 règles anti-slop (ban **Inter/Roboto/Arial sauf si marque**, orbes de gradient, grille 3 colonnes par défaut, card arrondie+bordure gauche, icônes décoratives), **scale floors** (slides body ≥24px/headers ≥64px, print ≥12pt, hit targets ≥44px), `oklch()` pour les couleurs dérivées, Core Asset Protocol + freeze `brand-spec.md`, règle qualité 5-10-2-8.
- **dogum**: baseline CSS safe-default copier-coller + **avoid-list avec règle numérique de redémarrage** ("si l'artifact a 3 de ces défauts → recommencer") + design-system-from-codebase en 4 étapes.
- **julianoczkowski**: tokens verrouillés dans base.html + règle "don't redefine" + **gallery = drift-check visuel** + alias rétro-compatibles.
- **liush2yuxjtu**: token block `:root` directement dans le SKILL.md + 20 exemples comme barre de qualité.
- **mesomya**: axes de visual system + **composition-before-boxes** (11 structures non-box: rail, swimlanes, timeline, matrice…) + anti-slop hard-failures.
- **coda0HQ**: **gate de contraste WCAG 4.5:1 vérifié au build** (en code, pas en checklist !) + trope bans.
- **html-anything**: tokens `_design.md` + overrides par style + `requiredPrimitives` + attribut `data-ha-style` vérifiable mécaniquement.

**À adopter:** anti-slop checklist comportementale (complète notre token block ADR-001) ; scale floors ; gate de contraste build-time ; avoid-list avec seuil de redémarrage.

### Gate 5 — Implémentation
**Verdict: ⚠️ comparable — nos rivaux ont des squelettes paste-verbatim et des règles plus prescriptives.**

- **julianoczkowski**: playbooks par pattern avec **squelettes JS paste-verbatim** (drag-drop + export inclus) + sections "When it fits / When it does NOT fit" + utility kit.
- **make-html**: **5 medium rules** ("si c'est comparable → aligne-le ; spatial → dessine-le ; état → interactif ; réutilisé → export ; sélectionnable → état réel") + sélection state-driven (aria-selected/aria-pressed).
- **md2html**: **build-in-memory-puis-Write-une-fois** (anti-drift Read-then-Edit) + template placeholders + catalogue composants copier-coller.
- **coda0HQ**: composition par fragments ordonnés + build déterministe (pas de timestamp/random → reproductible).
- **Thariq**: prompt-box de provenance en tête de chaque artifact + **export-first** ("la data model sert l'export ; l'export est la sortie durable").

**À adopter:** export-first pour editors ; build-in-memory-Write-once ; prompt-box de provenance ; squelettes paste-verbatim pour patterns récurrents.

### Gate 6 — Vérification navigateur
**Verdict: ✅✅ notre gate Playwright est LE seul gate 6 automatisé de tout l'écosystème.** C'est notre avantage distinctif.

- **make-html** (le plus proche): validation.md tiered — checks statiques, render checks (DOM rendu compté, pas juste source), interaction checks (tab/filtre/toggle + aria), responsive checks (scrollWidth ≤ clientWidth, 390px), screenshot review avec liste de défauts à rejeter. Mais **discipline d'agent**, pas d'automatisation.
- **ClawEnable**: validateur Node = analyse statique (pas navigateur) + checklist 11 dimensions (Content Fidelity, Responsive, Dependency Policy, **Copyability**, **Source-of-Truth**, Print).
- **jiji262**: loop 5 checks en vrai navigateur mais dépendante de l'environnement, non scriptée + discipline "don't over-verify".
- **coda0HQ**: **zéro vérification navigateur — explicitement interdite en mode live** (ship gate = greps statiques).
- **dogum / liush2yuxjtu / mesomya**: aucun (mesomya refuse même d'ouvrir le navigateur sauf demande).

**À adopter:** enrichir notre gate 6 avec la checklist tiered de make-html et les dimensions ClawEnable (Copyability, Source-of-Truth, Print, Dependency Policy). Garder Playwright comme moteur.

### Gate 7 — Build (HTML auto-contenu)
**Verdict: ⚠️ comparable — claude-artifact-runner est notre pair le plus proche.**

- **claude-artifact-runner**: `viteSingleFile` + favicon base64 inliné + **HashRouter pour file://** + modes strict/regular explicités (strict désactivé par défaut car les artifacts LLM échouent tsc — compromis documenté).
- **ClawEnable** (le plus volable): **validateur Node zero-dep (~170 lignes)** — doctype/charset/viewport/title, un seul bloc style + un seul bloc script, **aucun** stylesheet/script/img/url() externe, `@media print` requis, `:focus-visible` requis, `user-select:none` interdit, aucune largeur fixe >375px, disclaimer IA requis. Testé avec `node --test` + fixtures.
- **coda0HQ**: CSP strict `sandbox allow-scripts; default-src 'none'` + origine opaque (iframe) — enforcement le plus dur.
- **mayfer**: esbuild-wasm in-browser + `jsdelivr /+esm` pour deps npm sans node_modules — impressionnant mais fragile (pas de minify, pas de CSS, regex-hacks).
- **md2html / ericforai**: deps CDN = self-containment cassé (nous sommes plus stricts).

**À adopter:** porter les checks du validateur ClawEnable dans `build-artifact.mjs` (premier pass statique avant Playwright) ; vérifier le support file:// de nos outputs (HashRouter + favicon inline).

### Gate 8 — Archive
**Verdict: ⚠️ comparable — coda0HQ est nettement plus profond que nous.**

- **coda0HQ** (le plus fort): **Manifest v2** avec triple de hash `recipeHash`/`inputHash`/`outputHash` (inputHash = un hash par fragment ordonné → "quelle source a changé" est réponse machine) ; **watch-snapshot + staleness + ack** (le record d'archive dit activement quand il est périmé) ; versions immuables + labels + `?v=N` + CAS 409 ; **manifest-after-accept** (le record n'est écrit qu'après que le serveur accepte) ; chiffrement zero-knowledge avec enveloppe auto-descriptive `{v, alg, kdf, iterations, salt, iv, ciphertext}` + password en credentials gitignoré + decrypt-on-update ; stockage de **hash-only tokens**.
- **liush2yuxjtu**: dossier d'archive fixe `~/.claude/artifacts/` + slug normalisé + suffixe date + script helper (écrit + ouvre + affiche le chemin).
- **claude-artifact-runner**: output fichier + `create` = git init/commit/push.
- **mayfer**: téléchargement zip.

**À adopter:** triple de hash dans notre record d'archive (reproductibilité) ; manifest-after-accept ; slug + dossier fixe. Staleness/ack = plus tard.

---

## 3. Axes transversaux + verdicts

### 3.1 À adopter (vite fait, impact direct)

| # | Idée | Source | Où dans notre flow |
|---|---|---|---|
| A1 | **Checks statiques automatisés** (doctype/charset/viewport/title, 1 bloc style+script, zéro dépendance externe, print, focus-visible, user-select:none, width>375) en premier pass du build | ClawEnable | Gate 7 (`build-artifact.mjs`) avant Playwright |
| A2 | **Checklist anti-slop comportementale** (Inter/Roboto bannis, pas d'orbes de gradient, pas de grille 3 col par défaut, pas d'emoji décoratifs) — complète le token block ADR-001 | jiji262 + dogum + mesomya | Gate 4 |
| A3 | **Scale floors** (slides ≥24/64px, print ≥12pt, hit targets ≥44px, hairlines <1px) | jiji262 | Gate 4 (ADR-001) |
| A4 | **Export-first** pour editors ("décide la string d'export AVANT l'UI ; la data model doit s'en dériver") | Thariq + dogum + julianoczkowski | Gate 5 |
| A5 | **Checklist 8-10 questions en un tour** au gate 1 | jiji262 | Gate 1 |
| A6 | **Triple de hash** `recipeHash/inputHash/outputHash` dans le record d'archive | coda0HQ | Gate 8 |
| A7 | **Manifest-after-accept** (record d'archive écrit seulement si le build passe) | coda0HQ | Gate 8 |
| A8 | **Checklist verification tiered** (statique → render DOM compté → interaction+aria → responsive 390px → screenshot review) | make-html | Gate 6 (complète Playwright) |
| A9 | **Dimensions review** Copyability / Source-of-Truth / Print / Dependency Policy | ClawEnable | Gate 6 |
| A10 | **Build-in-memory-puis-Write-une-fois** (anti-drift) | md2html | Gate 5 |
| A11 | **Prompt-box de provenance** (le prompt qui a produit l'artifact, en tête) | Thariq | Gate 5 + archive |
| A12 | **Pré-gate 0 HTML-vs-Markdown** : 8 triggers + carve-outs + seuil ~100 lignes + coût 2-4× | dogum | Avant gate 1 |

### 3.2 À adopter plus tard (réfléchir, ne pas bloquer)

| # | Idée | Source | Pourquoi plus tard |
|---|---|---|---|
| B1 | **20 trigger evals** (`expected_action`/`must_not_do`) comme suite de régression du skill lui-même | ClawEnable | Quand le flow sera stabilisé |
| B2 | **Corpus de référence genre-indexé** ("lis l'exemple le plus proche avant d'écrire") — notre corpus = festival-noise-sim + artifacts existants | liush2yuxjtu | Après 2-3 artifacts réels en corpus |
| B3 | **Design Direction Advisor** (3 directions si brief vague) | jiji262 | Gate 1, quand le besoin se présente |
| B4 | **Fact-verification gate** (WebSearch si produit/version nommé) | jiji262 | Gate 3 enhancement |
| B5 | **Mode strict/regular dégradable** (checks complets en gate séparé qui peut échouer sans bloquer) | claude-artifact-runner | Calibration après le premier vrai run |
| B6 | **Style provenance** (source-backed / saved theme / fallback + note dans l'artifact) | make-html | Si on produit des artifacts multi-clients |
| B7 | **Staleness + ack** (le record d'archive dit quand il est périmé) | coda0HQ | Après le triple de hash |
| B8 | **Structures non-box** (composition-before-boxes: rail, swimlanes, timeline, matrice) | mesomya | Gate 4, enrichit le vocabulaire |
| B9 | **Playbooks par genre + "When it fits / does NOT fit"** | julianoczkowski | Gate 5, si les briefs se répètent par genre |

### 3.3 À ignorer (avec raison)

| # | Idée | Source | Raison |
|---|---|---|---|
| C1 | **esbuild-wasm in-browser** | mayfer | Paradigme runtime ≠ notre build-time ; fragile, pas de minify, pas de CSS |
| C2 | **Deps npm via CDN `jsdelivr /+esm`** | mayfer | Casse le self-containment hors-ligne |
| C3 | **MCP server + SSE live-reload** | xiagaohui | Hors périmètre skill (outil de session, pas de build) |
| C4 | **Pipeline Cloudflare self-host** | coda0HQ | Hors périmètre tant qu'on ne publie pas de façon managée |
| C5 | **localStorage / persistence** | Thariq | Violerait notre règle never-localStorage |
| C6 | **React+Babel via CDN avec integrity** | jiji262 | Casse l'offline ; notre esbuild build-time est la bonne réponse |
| C7 | **Tailwind via CDN** | ericforai + md2html | Casse le self-containment |

---

## 4. Inputs directs pour le ticket 05 (Verification gate)

Le ticket 05 demande: qu'est-ce que "verified rendering" — la liste ci-dessous répond avec les meilleurs mécanismes trouvés:

1. **Premier pass statique automatisé** (A1 — port du validateur ClawEnable dans `build-artifact.mjs`): doctype, charset, viewport, title non-vide, 1 seul `<style>` + 1 seul `<script>`, zéro dépendance externe (stylesheet/script/img/url()), `@media print`, `:focus-visible`, pas de `user-select:none`, pas de largeur fixe >375px. Exit 0 = passe.
2. **Ensuite Playwright** (notre avantage unique — personne d'autre ne l'a): render headless, console-error-clean, interaction smoke par contrôle (comme actuellement).
3. **Compléter avec les dimensions manquantes** (A8/A9): responsive 390px (scrollWidth ≤ clientWidth), Copyability (data en DOM texte réel, select-all préserve l'ordre), Source-of-Truth (pas de canvas-only), Print (export PDF propre), Dependency Policy.
4. **Checklist tiered make-html** comme référentiel: statique → DOM rendu (compter les nœuds générés, pas juste lire la source) → interaction (état visuel + aria) → responsive → screenshot review avec liste de défauts à rejeter.
5. **Discipline "don't over-verify"** (jiji262): adapter le niveau de vérif à la taille du changement.

**Positionnement:** nous sommes les seuls avec un gate 6 automatisé — le benchmark confirme qu'il faut le garder comme différenciateur et l'enrichir, pas le réduire.

---

## 5. Sources

Repos analysés (liens en section 1). Méthodologie: 6 agents de recherche (librarian) en parallèle, lecture source (SKILL.md, validateurs, manifests, configs build, exemples), commit-pinnés où possible. Voir `HANDOFF.md` pour le contexte du flow 8-gates et le ticket 05.
