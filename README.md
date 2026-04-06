# Playwright – testovací sada

Repozitář obsahuje automatizované end-to-end testy napsané v [Playwright](https://playwright.dev/) (TypeScript). Testy jsou navržené pro prohlížeč **Chromium** a pokrývají tři nezávislé webové aplikace. Procvičují různé přístupy k lokátorům, asercím a organizaci testů.

## Testované aplikace

### 1. SauceDemo (Swag Labs)

Stránka: [saucedemo.com](https://www.saucedemo.com/)

Ověření přihlašovacího formuláře, včetně chybových hlášek při nevyplněných polích, úspěšného přihlášení a odhlášení. Test je implementován ve dvou variantách – s XPath lokátory a s CSS lokátory – pro srovnání obou přístupů.

**Co test pokrývá:**
- validace chybových hlášek (chybějící Username, chybějící Password)
- přihlášení s platnými údaji
- ověření stránky s produkty (title „Products")
- odhlášení přes hamburger menu
- screenshoty v klíčových krocích

### 2. CommitQuality – CRUD operace

Stránka: [commitquality.com](https://commitquality.com)

Kompletní CRUD flow: přihlášení, vytvoření produktu s náhodnými daty, vyhledání přes filtr, editace všech údajů, smazání a ověření, že produkt už neexistuje.

**Co test pokrývá:**
- přihlášení a odhlášení
- vytvoření nového produktu (náhodný název, cena, datum)
- filtrování a ověření údajů
- editace produktu a kontrola změn
- smazání produktu a ověření prázdného výsledku

### 3. Alza – nákupní košík

Stránka: [alza.cz](https://www.alza.cz/)

Testy na e-shopu Alza existují ve dvou variantách: klasický přístup (`Alza_spec.ts`) a refaktorovaná verze s Page Object Modelem (`Alza_POM_spec.ts`). Obě varianty pokrývají stejný hlavní scénář, klasická verze navíc obsahuje edge case testy.

#### 3a) Alza – klasická varianta (`Alza_spec.ts`)

Všechny lokátory a logika jsou přímo v testovém souboru. Obsahuje tři testy:

**Nákup (happy flow):** vyhledání tří produktů (notebook, bezdrátová myš, monitor), filtr „skladem", řazení dle nejprodávanějších, přidání do košíku, ověření názvů, cen, kódů a celkové ceny v košíku.

**Odebrání produktu z košíku (edge case):** přidání jednoho produktu, přechod do košíku, smazání produktu a ověření prázdného košíku.

**Ověření nesprávného počtu položek (edge case / negativní scénář):** přidání pěti položek (včetně duplicit přes tlačítko +) a ověření, že počítadlo košíku neodpovídá chybně očekávané hodnotě 3. Testuje, že počítadlo správně reflektuje skutečný počet položek.

**Změna množství produktu v košíku (edge case):** přidání produktu, přechod do košíku a postupné navyšování množství až na parametrizovanou hodnotu (výchozí 16 ks). V každém kroku se ověřuje cena řádku i celková cena košíku.

#### 3b) Alza – Page Object Model (`Alza_POM_spec.ts`)

Refaktorovaná verze hlavního nákupního scénáře s využitím **Page Object Modelu**. Každá stránka a komponenta má vlastní třídu v adresáři `pages/`.

**Struktura POM:**
- `AlzaHomePage` – vyhledávání, cookies, ikona košíku
- `AlzaSearchResultsPage` – filtr „skladem", řazení, výběr produktu
- `AlzaProductPage` – název, cena, kód produktu, tlačítko koupit
- `AlzaCartModal` – modální okno po přidání do košíku
- `AlzaCartPage` – ověření produktů a celkové ceny v košíku
- `utils` – parsování cen z českého formátu

## Struktura projektu

```
├── tests/
│   ├── sauceDemo1_spec.ts        # SauceDemo (XPath + CSS varianty)
│   ├── commitQuality_spec.ts     # CommitQuality CRUD
│   ├── Alza_spec.ts              # Alza (bez POM)
│   └── Alza_POM_spec.ts          # Alza (s POM)
├── pages/
│   ├── AlzaHomePage.ts
│   ├── AlzaSearchResultsPage.ts
│   ├── AlzaProductPage.ts
│   ├── AlzaCartModal.ts
│   ├── AlzaCartPage.ts
│   └── utils.ts
├── playwright.config.ts
└── README.md
```

## Spuštění

```bash
# instalace závislostí
npm install

# spuštění všech testů (Chromium)
npx playwright test --project=chromium

# spuštění konkrétního testu
npx playwright test tests/sauceDemo1_spec.ts --project=chromium

# spuštění s vizuálním prohlížečem (headed)
npx playwright test --project=chromium --headed

# zobrazení HTML reportu
npx playwright show-report
```

## Použité přístupy

- **Lokátory:** `data-test` / `data-testid` atributy, CSS selektory s `[class*="..."]`, XPath hierarchické lokátory, `getByRole`, `getByTestId`
- **Aserce:** `toBeVisible()`, `toBeHidden()`, `toContainText()`, `toHaveURL()`, `toHaveText()`, `toHaveValue()`
- **Organizace:** `test.describe` bloky, Page Object Model (Alza POM varianta)
- **Stabilita:** aserce viditelnosti před interakcí, `toHaveURL` po navigaci, kontrola stavu checkboxu před kliknutím

## Technologie

- [Playwright](https://playwright.dev/) (TypeScript)
- Node.js