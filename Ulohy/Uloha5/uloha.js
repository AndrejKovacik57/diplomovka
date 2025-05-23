/**
 * Cvičenie 1:
 * Vráťte ten istý reťazec s:
 * - Všetky slová dlhšie ako 4 písmená obráťte.
 * - Slová kratšie alebo rovné 4 písmenám bez zmeny.
 *
 * Príklad: „Toto cvičenie je mimoriadne zaujímavé“
 * Výstup:  „Toto esicrexe je yralulacitrerp gnitseretni“
 */
function exercise1(input) {
    return input
        .split(" ")
        .map(word => word.length > 4 ? word.split("").reverse().join("") : word)
        .join(" ");
}

/**
 * Cvičenie 2:
 * Dané je pole transakcií (objekty s {typ: „príjem“|„výdaj“, suma: číslo}),
 * vráťte objekt s celkovými príjmami, celkovými výdavkami a konečným zostatkom.
 *
 * Príklad:
 * [
 * {typ: „príjem“, suma: 100 },
 * { type: *: „výdavok“, suma: 30 },
 * { type: }: „príjem“, suma: }: „príjem“, suma: }: ‚príjem‘, suma: }: „príjem“: 50 }
 * ]
 * Výstup: { príjem: 150, výdavky: 30, zostatok: 120 }
 */
function exercise2(transactions) {
    let income = 0, expense = 0;

    for (const t of transactions) {
        if (t.type === "income") income += t.amount;
        else if (t.type === "expense") expense += t.amount;
    }

    return { income, expense, balance: income - expense };
}

/**
 * Cvičenie 3:
 * Daný objekt s menami ako kľúčmi a rokmi narodenia ako hodnotami,
 * vráťte pole mien zoradených podľa veku (od najstaršieho po najmladší).
 *
 * Príklad:
 * {„Alice“: 1990, „Bob“: 1980, „Charlie“: 2000 }
 * Výstup: [„Bob“, ‚Alice‘, „Charlie“]
 */
function exercise3(birthYears) {
    return Object.entries(birthYears)
        .sort((a, b) => a[1] - b[1])
        .map(entry => entry[0]);
}

module.exports = { exercise1, exercise2, exercise3 };
