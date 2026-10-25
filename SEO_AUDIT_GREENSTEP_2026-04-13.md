# SEO Foundation Audit — Greenstep Cooling Towers

Date: 2026-04-13  
Audited domain: https://www.greenstepcoolingtowers.com/  
Strategic competitors referenced: https://www.ctpmuhendislik.com/ and susogutmakuleleri.com (needs confirmation for active canonical domain)

## 1) Executive summary

### Most important SEO problems (highest impact)
1. **Homepage intent dilution and template bloat**: homepage repeats many product/service blocks and duplicate section patterns, which weakens primary intent signaling for commercial cooling tower queries.
2. **Heading structure is over-fragmented**: multiple top-level headings are used for sliders/sections on the same page, likely producing weak semantic hierarchy and query targeting.
3. **Thin category pages** for services and spare parts (`/hizmetler`, `/yedek-parcalar`) with very limited unique explanatory content.
4. **Internal linking is menu-heavy but context-light**: many navigational links, but weak contextual links between product/service/blog intent clusters.
5. **Contact page contains mixed conversion + accounting/banking content**: this can dilute the page’s local-commercial/contact intent.
6. **Potential canonical/indexation ambiguity (needs confirmation)** because robots.txt, sitemap.xml, canonical tags, and hreflang files could not be directly validated in this run.
7. **Likely duplicate/repetitive template content across pages** (same blog block/footer repeated sitewide), increasing thin/repetitive signals.
8. **Image semantics likely weak**: numerous image placeholders and repeated gallery-style blocks suggest opportunity for stronger descriptive alt/caption filenames.
9. **Multilingual ambiguity**: “English” is visible in template, but discoverable/enforced EN URL architecture was not confirmed.

### Top 3 issues to fix first
1. **Rebuild homepage information hierarchy (High)**  
   Why first: It is the strongest authority/entry page and currently sends mixed intent signals.
2. **Upgrade thin commercial nodes (`/hizmetler`, `/yedek-parcalar`, core product pages) (High)**  
   Why first: These are money pages; stronger indexable substance and clearer intent can lift transactional rankings fastest.
3. **Fix indexation control stack: robots + XML sitemaps + canonicals + hreflang policy (High, needs confirmation)**  
   Why first: Crawl/index governance is prerequisite for sustained scaling and future content growth.

---

## 2) Technical SEO audit

## Indexing & crawlability risks
| Area | Observation | Risk | Action |
|---|---|---|---|
| Crawl surface | Heavy global menu links + repeated blocks on most templates | Crawl budget skew toward repetitive elements | Reduce template repetition footprint; increase contextual in-body links |
| Thin endpoints | `/hizmetler` and `/yedek-parcalar` pages are list-like with little body depth | Low value / soft-thin indexing | Add unique copy, use-case sections, FAQs, trust blocks |
| Blog architecture | Blog list and posts present; likely recent activity | Good freshness, but may be isolated from product conversion paths | Add product/service CTAs and contextual links in blog posts |

### robots.txt and sitemap recommendations
**Needs confirmation:** direct retrieval of `robots.txt` and `sitemap.xml` could not be validated in this environment.

Recommended baseline:
- `robots.txt` should:
  - Allow crawl of public pages/assets.
  - Block admin/system/private paths only.
  - Reference sitemap index via `Sitemap: https://www.greenstepcoolingtowers.com/sitemap_index.xml`.
- XML sitemaps should be split by type:
  - `sitemap-pages.xml`
  - `sitemap-products.xml`
  - `sitemap-blog.xml`
  - `sitemap-images.xml` (optional, useful for heavy visual catalogs)
- Ensure only canonical, indexable 200-URLs are submitted.

### Canonical risks
**Needs confirmation:** canonical tags were not directly extractable in this environment.

Potential risk patterns to check:
- Self-referencing canonical missing on product/service/blog pages.
- Inconsistent trailing slash and Turkish character transliteration in slugs.
- Canonical conflict between TR and potential EN pages.

### Title/meta description quality review
Observed titles exist and are generally page-specific (e.g., product and corporate pages), which is positive.  
However, likely issues:
- Commercial modifier breadth may be limited (industrial, package, closed circuit, maintenance, retrofit, OEM, etc.).
- Meta descriptions likely under-optimized for conversion intent and differentiation.

Action:
- Standardize title framework by page type.
- Add unique, intent-matched meta descriptions for all indexable templates.

### Heading hierarchy review
Observed patterns indicate:
- Homepage uses multiple H1-like sections for slider and section labels.
- Contact page includes multiple top-level intent blocks (“İletişim”, “Firma Bilgileri”, “Banka Bilgileri”), which may diffuse page focus.

Action:
- **One H1 per page** reflecting primary search intent.
- Move secondary sections to H2/H3.
- Keep commercial pages focused on one clear transactional topic.

### Internal linking weaknesses
Current structure is primarily menu-driven. Missing high-impact behaviors:
- Product pages linking to relevant service pages (e.g., maintenance/automation).
- Service pages linking back to product families and spare parts.
- Blog posts linking to specific commercial pages with descriptive anchors.

Action:
- Build deliberate internal link modules: “Related Products”, “Related Services”, “Used Spare Parts”, “Case/Reference Links”.

### Duplicate/repetitive template content risks
- Repeated footer blog blocks and recurring boilerplate across templates.
- Homepage and some listings repeat item cards multiple times.

Action:
- De-duplicate repeated template rows.
- Ensure each key landing page has distinct body copy blocks.

### Image SEO risks
Likely opportunities:
- Generic image labels and repeated slider assets.
- Unknown alt-text quality.

Action:
- Enforce descriptive, intent-based ALT text (product model + use case + material).
- Use modern formats + lazy-load below fold.
- Add image structured data only where useful.

### Page speed / rendering / JS SEO risks
**Needs confirmation:** Core Web Vitals and JS rendering behavior were not measured directly here.

Risk indicators:
- Heavy slider/image sections and repeated modules can bloat LCP and CLS.

Action:
- Reduce duplicate modules.
- Prioritize critical CSS and defer non-critical scripts.
- Compress hero assets and add explicit width/height.

### Mobile SEO risks
**Needs confirmation:** direct mobile rendering audit not executed.

Potential risks:
- Dense navigation and repeated blocks may push key conversion information too low.

Action:
- Mobile-first layout: primary CTA, category links, and trust proof in first viewport.

### Structured data / schema opportunities
Implement in phases:
- Organization + WebSite schema (sitewide).
- BreadcrumbList on all inner pages.
- Product schema for product/spare parts detail pages.
- Article schema on blog posts.
- FAQ schema on service/product pages where valid.
- LocalBusiness/ContactPoint for contact page.

### Multilingual / hreflang considerations
“English” appears in templates, but clear EN URL architecture was not verified.

Action:
- If EN strategy is active: enforce `/en/` path structure and reciprocal hreflang (`tr-TR`, `en`, `x-default`).
- If EN is not launched: remove misleading EN switch until ready.

---

## 3) Information architecture review

### Current structure assessment
Current top-level structure is directionally correct (Kurumsal / Ürünler / Yedek Parçalar / Hizmetler / Blog / İletişim) but **commercial depth pages are weak** and rely heavily on menu exposure instead of intent clusters.

### Weak / broad / overlapping pages
- `/hizmetler`: too list-like, lacking service-intent depth.
- `/yedek-parcalar`: broad bucket with minimal differentiation by part type/use-case.
- Homepage: combines too many intents and repeated modules.
- Contact page: mixes lead-gen and finance/procurement details in one indexable node.

### Recommended architecture (target)
- `/` (commercial overview + authority + conversion)
- `/urunler/`
  - `/urunler/monoblok-antibakteriyel-kuleler`
  - `/urunler/duz-guverteli-paket-kuleler`
  - `/urunler/kapali-devre-kuleler`
  - `/urunler/insai-tip-kuleler`
- `/yedek-parcalar/`
  - `/yedek-parcalar/fan-sistemleri`
  - `/yedek-parcalar/pvc-film-dolgu`
  - `/yedek-parcalar/rashing-halkasi`
  - etc.
- `/hizmetler/`
  - `/hizmetler/bakim-onarim`
  - `/hizmetler/otomasyon`
  - `/hizmetler/enerji-analizi`
  - etc.
- `/sektorler/` (new, high ROI)
  - HVAC, textile, plastics, food, power, heavy industry pages
- `/referanslar/` (indexed case-style structure)
- `/blog/` + topic clusters
- `/kurumsal/` + optional trust subpages
- `/iletisim/`
- `/en/` mirrored structure (only if maintained)

### Recommended commercial landing page template
Each money page should include:
1. Single intent H1 + commercial intro.
2. Technical specs table.
3. Application sectors/use cases.
4. Capacity/performance guidance.
5. Related spare parts/services.
6. Trust proof (references, certifications).
7. FAQ.
8. Strong conversion CTA (form, WhatsApp, phone).

### Recommended blog/topic cluster structure
Cluster hubs:
- Cooling tower fundamentals
- Selection/design guides
- Energy efficiency & automation
- Water quality/filtration/treatment
- Maintenance & troubleshooting

Each cluster should route users to relevant product/service pages using contextual anchors.

---

## 4) Page-level action plan

| Page group | Main SEO issue | Why it matters | Recommended fix | Priority |
|---|---|---|---|---|
| Homepage | Mixed intent + repeated modules + fragmented heading logic | Weakens core ranking signal for commercial head terms | Rebuild hero + one clear H1, trim duplicate sections, add intent-led internal links | High |
| Product pages | Some depth exists but lacks standardized conversion/spec architecture | Product pages must win transactional SERPs | Add specs, use-case blocks, FAQs, proof, schema, stronger title/meta frameworks | High |
| Spare parts pages | Category is thin and mostly link list | Low topical authority for parts queries | Build dedicated part detail pages + category intro + compatibility information | High |
| Service pages | Very thin list page; little unique value copy | Hard to rank for service-intent terms | Create individual service pages with methodology, deliverables, sectors, CTA | High |
| Blog | Fresh but potentially isolated from commercial pages | Missed internal PageRank + conversion path | Add editorial internal-link SOP and conversion CTA components in every post | Medium |
| Corporate/About | Basic narrative exists but trust architecture can improve | E-E-A-T and procurement trust signals matter in B2B | Add certifications, production capability, markets served, team/process proof | Medium |
| Contact | Intent dilution from accounting/bank data on same page | Can reduce conversion focus and local intent clarity | Move financial/account details to separate non-index page; keep contact page conversion-first | High |
| English pages | Visible EN cue but unclear EN IA | Risk of multilingual confusion and indexing errors | Either launch proper `/en/` with hreflang or hide EN switch until ready | Medium-High |

---

## 5) Competitor gap summary

## What competitors are doing better structurally
- `ctpmuhendislik.com` appears to have broader commercial depth (more distinct product/spare-part entities and denser topical footprint).
- Active bilingual signaling (TR/EN) appears more explicit.

## Where Greenstep can beat them faster
- **Cleaner semantic architecture**: less template duplication, stronger one-page-one-intent execution.
- **Better crawl hygiene**: disciplined canonical + sitemap + thin-page control.
- **Higher conversion architecture quality** on money pages (specs + trust + CTA + FAQ).

## Gap classification
- **Technical gaps**: canonical/robots/sitemap/hreflang governance (needs confirmation), heading semantics, template duplication.
- **Architectural gaps**: weak service/spare-part depth, limited sector landing pages.
- **Content-structure gaps**: insufficient transactional framing on commercial pages; blog-to-money page linking not systematic.

---

## 6) Implementation roadmap

## Phase 1 (0–30 days): must-fix foundational layer
1. Homepage hierarchy cleanup (single H1, remove duplicates, stronger CTA blocks).
2. Build/expand thin commercial templates (`/hizmetler`, `/yedek-parcalar`, top 4 product pages).
3. Validate and fix technical controls: robots, sitemap index, canonical self-reference, noindex policy.
4. Implement basic schema set (Organization, Breadcrumb, Article).
5. Establish internal linking framework between blog ↔ products/services.

## Phase 2 (30–90 days): structural/content expansion
1. Launch individual service and spare-part detail pages.
2. Add sector pages and reference/case architecture.
3. Add conversion assets: downloadable datasheets, quote flows, comparison modules.
4. Expand blog clusters mapped to commercial intents.

## Phase 3 (90+ days): authority & advanced SEO
1. Digital PR and industry citation acquisition.
2. Technical thought-leadership content + case studies.
3. Advanced schema enhancements and ongoing CWV tuning.
4. Internationalization expansion (`/en/`) with strict hreflang governance.

---

## Must fix now vs fix later

### Must fix now
- Homepage intent/heading/template cleanup.
- Thin commercial page expansion.
- Crawl/index control verification (robots/sitemaps/canonicals/hreflang).
- Contact page intent cleanup.

### Fix later
- Full multilingual rollout.
- Large-scale blog expansion.
- Advanced schema and authority campaigns.

---

## Immediate SEO Fixes to Start This Week
1. Replace current homepage multi-heading/duplicate block pattern with a single primary commercial narrative and one H1.
2. Expand `/hizmetler` into individual indexable service pages with clear deliverables and CTA.
3. Expand `/yedek-parcalar` into dedicated part landing pages with technical compatibility details.
4. Separate accounting/bank details from `/iletisim` into a non-index utility page.
5. Validate and submit clean XML sitemap(s) in Google Search Console and confirm canonical self-reference across core URLs.
6. Add breadcrumb + organization + article schema.
7. Add contextual internal links from each blog post to 1–2 relevant commercial pages.
