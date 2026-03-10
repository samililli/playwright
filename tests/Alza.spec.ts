import { test, expect } from '@playwright/test';

test.describe('Alza', () => {

    test('Alza nákup', async ({ page }) => {

    // #1a) Otevření stránky Alza.cz
        // Odmítnutí cookies okna
        // Ověření, že se stránka načetla


    // #1b) Vyhledání produktu "notebook"
        // Filtrování výsledků – pouze produkty skladem
        // Seřazení výsledků dle nejprodávanějších 


    // #1c) Otevření 1. produktu v seznamu
        // Uložení názvu, ceny a kódu produktu


    // #1d) Přidání produktu do košíku
        // Zavření modálního okna a pokračování v nákupu


    // #1e) Vyhledání produktu "bezdrátová myš"
        // Filtrování výsledků - pouze produkty skladem
        // Seřazení výsledků dle nejprodávanějších


    // #1f) Otevření 2. produktu v seznamu
        // Uložení názvu, ceny a kódu produktu


    // #1g) Přidání produktu do košíku
        // Zavření modálního okna a pokračování v nákupu


    // #1h) Vyhledání produktu "monitor"
        // Filtrování výsledků - pouze produkty skladem
        // Seřazení výsledků dle nejprodávanějších


    // #1i) Otevření 3. produktu v seznamu
        // Uložení názvu, ceny a kódu produktu


    // #1j) Přidání produktu do košíku
        // Zavření modálního okna a pokračování v nákupu


    // #1k) Otevření nákupního košíku
        // Ověření, že se v košíku nachází všechny 3 produkty s jejich správnými názvy, cenami a kódy.

    
    // #1l) Ověření, že celková cena košíku odpovídá součtu uložených cen produktů.


    });   

});