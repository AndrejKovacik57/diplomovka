<?php

function vypocitajZlavu(float $cenaNakupu, string $typZlavy, int $urovenZakaznika): float {
    if ($urovenZakaznika < 1 || $urovenZakaznika > 5) {
        return round($cenaNakupu, 2);
    }

    switch ($typZlavy) {
    case 'bezna':
            $zlava = 0.10;
            break;
          case 'specialna':
            $zlava = $cenaNakupu > 100 ? 0.20 : 0.0;
            break;
        case 'vernostna':
            $extra = max(0, $urovenZakaznika - 1) * 0.02;
            $zlava = 0.05 + $extra;
            break;
        case 'kombinovana':
            $zlava = $urovenZakaznika > 3 ? 0.15 : 0.0;
            break;
        default:
            $zlava = 0.0;
    }

    $cenaPoZlave = $cenaNakupu * (1 - $zlava);
    return round($cenaPoZlave, 2);
}

function nacitajZakaznikov(string $subor): array {
    if (!file_exists($subor)) {
        return [];
    }

    $obsah = file_get_contents($subor);
    $zakaznici = json_decode($obsah, true);

    return is_array($zakaznici) ? $zakaznici : [];
}

function transformujZakaznikovAUplatniZlavu(array $zakaznik, bool $doVelkych, bool $reverse, bool $reverseWords, string $oddelovac = "_"): array {
    $meno = $zakaznik['meno'] ?? '';
    $uroven = $zakaznik['uroven'] ?? 1;
    $typZlavy = $zakaznik['typZlavy'] ?? '';
    $nakup = $zakaznik['nakup'] ?? 0.0;

    if ($doVelkych) {
        $meno = strtoupper($meno);
    }

    if ($reverseWords && $reverse) {
        $slova = explode(" ", $meno);
        $slova = array_reverse($slova);
        $meno = implode(" ", $slova);
        $meno = strrev($meno);
    } elseif ($reverseWords) {
        $slova = explode(" ", $meno);
        $meno = implode(" ", array_reverse($slova));
    } elseif ($reverse) {
        $meno = strrev($meno);
    }

    $upraveneMeno = $meno . $oddelovac . $uroven;
    $finalnaCena = vypocitajZlavu($nakup, $typZlavy, $uroven);

    return [
        'upraveneMeno' => $upraveneMeno,
        'finalnaCena' => $finalnaCena
    ];
}

function ulozDoCSV(array $data, string $subor): void {
    $fp = fopen($subor, 'w');
    fputcsv($fp, ['upraveneMeno', 'finalnaCena']);

    foreach ($data as $polozka) {
        fputcsv($fp, [$polozka['upraveneMeno'], $polozka['finalnaCena']]);
    }

    fclose($fp);
}

// Testovanie
if (__FILE__ == realpath($_SERVER['SCRIPT_FILENAME'])) {
    $zakaznici = nacitajZakaznikov("zakaznici.json");
    $vystup = [];

    foreach ($zakaznici as $zakaznik) {
        $vystup[] = transformujZakaznikovAUplatniZlavu($zakaznik, true, false, true, "-");
    }

    print_r($vystup);
    ulozDoCSV($vystup, "vystup.csv");
}
