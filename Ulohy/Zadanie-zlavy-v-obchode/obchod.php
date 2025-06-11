<?php

function vypocitajZlavu(float $cenaNakupu, string $typZlavy, int $urovenZakaznika): float {
    // TODO: Implementuj logiku zľavy
    return 0.0;
}

function nacitajZakaznikov(string $subor="customers.json"): array {
    // TODO: Načítaj JSON a vráť pole
    return [];
}

function transformujZakaznikovAUplatniZlavu(array $zakaznik, bool $doVelkych, bool $reverse, bool $reverseWords, string $oddelovac = "_"): string {
    // TODO: Immplementuj logiku transformácie a uplatnenia zľavy
    return "";
}


function ulozDoCSV(array $data, string $subor="results.csv"): void {
    // TODO: Zapíš dáta do CSV súboru
}

// Testovanie
if (__FILE__ == realpath($_SERVER['SCRIPT_FILENAME'])) {
    $zakaznici = nacitajZakaznikov("zakaznici.json");

    $vysledky = vypisZoznamCienPoZlave($zakaznici);
    print_r($vysledky);

    $vip = ziskajVIPZakaznikov($zakaznici);
    print_r($vip);

    $skupiny = zoskupZakaznikovPodlaZlavy($zakaznici);
    print_r($skupiny);
}
