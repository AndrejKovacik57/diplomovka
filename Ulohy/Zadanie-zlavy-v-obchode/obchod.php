<?php

function vypocitajZlavu(float $cenaNakupu, string $typZlavy, int $urovenZakaznika): float {
    // TODO: Implementujte logiku pre jednotlivé typy zliav

    return 0.0;
}


// Pre manuálne testovanie
if (__FILE__ == realpath($_SERVER['SCRIPT_FILENAME'])) {

    echo vypocitajZlavu(120.0, 'bezna', 2);
    echo vypocitajZlavu(150.0, 'sezonna', 1);
    echo vypocitajZlavu(80.0, 'vernostna', 3);
    echo vypocitajZlavu(200.0, 'kombinovana', 4);

}
