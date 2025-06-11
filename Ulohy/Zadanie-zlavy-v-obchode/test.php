<?php

require 'obchod-hotovo.php';

function test_nacitajZakaznikov(): void {
    $testName = "test_nacitajZakaznikov";

    try {
        $zakaznici = nacitajZakaznikov("customers.json");
        $count = is_array($zakaznici) ? count($zakaznici) : 0;
        $status = $count > 0 ? "PASS" : "FAIL";
        echo "[$status] $testName | loaded: $count records\n";
        echo "[$status] $testName\n";
    } catch (Throwable $e) {
        echo "[FAIL] $testName | EXCEPTION: " . $e->getMessage() . "\n";
        echo "[FAIL] $testName\n";
    }
}


function test_vypocitajZlavu(): void {
    $testName = "test_vypocitajZlavu";
    $inputs = [
        [100.0, "bezna", 2, 90.00],
        [150.0, "specialna", 2, 120.00],
        [99.0, "specialna", 2, 99.00],
        [80.0, "vernostna", 3, 72.8],
        [200.0, "kombinovana", 4, 170.00],
        [50.0, "neznama", 2, 50.00],
        [120.0, "bezna", 6, 120.00], // neplatná úroveň
    ];

    $allPassed = true;

    foreach ($inputs as [$cena, $typ, $uroven, $expected]) {
        try {
            $result = vypocitajZlavu($cena, $typ, $uroven);
            $status = abs($result - $expected) < 0.01 ? "PASS" : "FAIL";
        } catch (Throwable $e) {
            $result = "EXCEPTION: " . $e->getMessage();
            $status = "FAIL";
        }

        $allPassed = $allPassed && ($status === "PASS");

        echo "[$status] $testName | input: [$cena, $typ, $uroven] | expected: $expected | got: $result\n";
    }

    echo "[" . ($allPassed ? "PASS" : "FAIL") . "] $testName\n";
}

function test_transformujZakaznikovAUplatniZlavu(): void {
    $testName = "test_transformujZakaznikovAUplatniZlavu";
    $zakaznik = [
        "meno" => "Jana Novak",
        "uroven" => 3,
        "typZlavy" => "vernostna",
        "nakup" => 80.00
    ];

    $kombinacie = [
        [false, false, false, "Jana Novak-3"],
        [true, false, false, "JANA NOVAK-3"],
        [false, true, false, "kavoN anaJ-3"],
        [false, false, true, "Novak Jana-3"],
        [true, true, false, "KAVON ANAJ-3"],
        [true, false, true, "NOVAK JANA-3"],
        [false, true, true, "anaJ kavoN-3"],
        [true, true, true, "ANAJ KAVON-3"]
    ];


    $allPassed = true;

    foreach ($kombinacie as [$doVelkych, $reverse, $reverseWords, $expectedMeno]) {
        try {
            $vysledok = transformujZakaznikovAUplatniZlavu($zakaznik, $doVelkych, $reverse, $reverseWords, "-");
            $meno = $vysledok['upraveneMeno'] ?? '';
            $cena = $vysledok['finalnaCena'] ?? null;

            $menoOK = $meno === $expectedMeno;
            $cenaOK = abs($cena - 72.8) < 0.01;

            $status = ($menoOK && $cenaOK) ? "PASS" : "FAIL";
        } catch (Throwable $e) {
            $status = "FAIL";
            $meno = "EXCEPTION: " . $e->getMessage();
            $cena = "N/A";
        }

        $allPassed = $allPassed && ($status === "PASS");

        echo "[$status] $testName | doVelkych: " . var_export($doVelkych, true)
            . " | reverse: " . var_export($reverse, true)
            . " | reverseWords: " . var_export($reverseWords, true)
            . " | expected: '$expectedMeno' cena: 72.8| got: '$meno' cena: $cena\n";
    }

    echo "[" . ($allPassed ? "PASS" : "FAIL") . "] $testName\n";
}


function test_ulozDoCSV(): void {
    $testName = "test_ulozDoCSV";
    $data = [
        ["upraveneMeno" => "JANA-3", "finalnaCena" => 72.00],
        ["upraveneMeno" => "PETER-4", "finalnaCena" => 100.00]
    ];

    try {
        $subor = "test_output.csv";
        ulozDoCSV($data, $subor);

        $status = file_exists($subor) && filesize($subor) > 0 ? "PASS" : "FAIL";
    } catch (Throwable $e) {
        $status = "FAIL";
    }

    echo "[$status] $testName | file: $subor\n";
    echo "[$status] $testName\n";
}



// Spustenie všetkých testov
test_nacitajZakaznikov();
test_vypocitajZlavu();
test_transformujZakaznikovAUplatniZlavu();
test_ulozDoCSV();
