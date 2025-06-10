<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $users = [
          [
              "Meno"=> "Jana",
            "Priezvisko"=> "Farkaš",
            "Email"=> "janafarkas@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xfarkasj"
          ],
          [
              "Meno"=> "Martin",
            "Priezvisko"=> "Polák",
            "Email"=> "martinpolak@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xpolakm"
          ],
          [
              "Meno"=> "Richard",
            "Priezvisko"=> "Szabó",
            "Email"=> "richardszabo@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xszabor"
          ],
          [
              "Meno"=> "Lukáš",
            "Priezvisko"=> "Urban",
            "Email"=> "lukasurban@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xurbanl"
          ],
          [
              "Meno"=> "Andrej",
            "Priezvisko"=> "Urban",
            "Email"=> "andrejurban@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xurbana"
          ],
          [
              "Meno"=> "Martin",
            "Priezvisko"=> "Kováč",
            "Email"=> "martinkovac@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xkovacm"
          ],
          [
              "Meno"=> "Eva",
            "Priezvisko"=> "Šimko",
            "Email"=> "evasimko@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xsimkoe"
          ],
          [
              "Meno"=> "Martin",
            "Priezvisko"=> "Urban",
            "Email"=> "martinurban@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xurbanm"
          ],
          [
              "Meno"=> "Michal",
            "Priezvisko"=> "Varga",
            "Email"=> "michalvarga@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xvargam"
          ],
          [
              "Meno"=> "Eva",
            "Priezvisko"=> "Molnár",
            "Email"=> "evamolnar@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xmolnare"
          ],
          [
              "Meno"=> "Michal",
            "Priezvisko"=> "Král",
            "Email"=> "michalkral@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xkralm"
          ],
          [
              "Meno"=> "Peter",
            "Priezvisko"=> "Nagy",
            "Email"=> "peternagy@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xnagyp"
          ],
          [
              "Meno"=> "Richard",
            "Priezvisko"=> "Novák",
            "Email"=> "richardnovak@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xnovakr"
          ],
          [
              "Meno"=> "Juraj",
            "Priezvisko"=> "Lukáč",
            "Email"=> "jurajlukac@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xlukacj"
          ],
          [
              "Meno"=> "Kristína",
            "Priezvisko"=> "Marek",
            "Email"=> "kristinamarek@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xmarekk"
          ],
          [
              "Meno"=> "Eva",
            "Priezvisko"=> "Szabó",
            "Email"=> "evaszabo@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xszaboe"
          ],
          [
              "Meno"=> "Richard",
            "Priezvisko"=> "Urban",
            "Email"=> "richardurban@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xurbanr"
          ],
          [
              "Meno"=> "Veronika",
            "Priezvisko"=> "Urban",
            "Email"=> "veronikaurban@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xurbanv"
          ],
          [
              "Meno"=> "Veronika",
            "Priezvisko"=> "Tóth",
            "Email"=> "veronikatoth@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xtothv"
          ],
          [
              "Meno"=> "Juraj",
            "Priezvisko"=> "Tóth",
            "Email"=> "jurajtoth@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xtothj"
          ],
          [
              "Meno"=> "Ján",
            "Priezvisko"=> "Baláž",
            "Email"=> "janbalaz@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xbalazj"
          ],
          [
              "Meno"=> "Lukáš",
            "Priezvisko"=> "Horváth",
            "Email"=> "lukashorvath@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xhorvathl"
          ],
          [
              "Meno"=> "Marek",
            "Priezvisko"=> "Novák",
            "Email"=> "mareknovak@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xnovakm"
          ],
          [
              "Meno"=> "Zuzana",
            "Priezvisko"=> "Horváth",
            "Email"=> "zuzanahorvath@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xhorvathz"
          ],
          [
              "Meno"=> "Barbora",
            "Priezvisko"=> "Farkaš",
            "Email"=> "barborafarkas@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xfarkasb"
          ],
          [
              "Meno"=> "Katarína",
            "Priezvisko"=> "Horváth",
            "Email"=> "katarinahorvath@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xhorvathk"
          ],
          [
              "Meno"=> "Veronika",
            "Priezvisko"=> "Marek",
            "Email"=> "veronikamarek@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xmarekv"
          ],
          [
              "Meno"=> "Andrej",
            "Priezvisko"=> "Lukáč",
            "Email"=> "andrejlukac@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xlukaca"
          ],
          [
              "Meno"=> "Lukáš",
            "Priezvisko"=> "Baláž",
            "Email"=> "lukasbalaz@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xbalazl"
          ],
          [
              "Meno"=> "Andrej",
            "Priezvisko"=> "Horváth",
            "Email"=> "andrejhorvath@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xhorvatha"
          ],
          [
              "Meno"=> "Barbora",
            "Priezvisko"=> "Novák",
            "Email"=> "barboranovak@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xnovakb"
          ],
          [
              "Meno"=> "Lucia",
            "Priezvisko"=> "Chovanec",
            "Email"=> "luciachovanec@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xchovanecl"
          ],
          [
              "Meno"=> "Mária",
            "Priezvisko"=> "Kučera",
            "Email"=> "mariakucera@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xkuceram"
          ],
          [
              "Meno"=> "Mária",
            "Priezvisko"=> "Horváth",
            "Email"=> "mariahorvath@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xhorvathm"
          ],
          [
              "Meno"=> "Richard",
            "Priezvisko"=> "Farkaš",
            "Email"=> "richardfarkas@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xfarkasr"
          ],
          [
              "Meno"=> "Natália",
            "Priezvisko"=> "Tóth",
            "Email"=> "nataliatoth@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xtothn"
          ],
          [
              "Meno"=> "Michal",
            "Priezvisko"=> "Novák",
            "Email"=> "michalnovak@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xnovakm"
          ],
          [
              "Meno"=> "Tomáš",
            "Priezvisko"=> "Lukáč",
            "Email"=> "tomaslukac@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xlukact"
          ],
          [
              "Meno"=> "Peter",
            "Priezvisko"=> "Lukáč",
            "Email"=> "peterlukac@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xlukacp"
          ],
          [
              "Meno"=> "Tomáš",
            "Priezvisko"=> "Blažek",
            "Email"=> "tomasblazek@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xblazekt"
          ],
          [
              "Meno"=> "Katarína",
            "Priezvisko"=> "Molnár",
            "Email"=> "katarinamolnar@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xmolnark"
          ],
          [
              "Meno"=> "Veronika",
            "Priezvisko"=> "Lukáč",
            "Email"=> "veronikalukac@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xlukacv"
          ],
          [
              "Meno"=> "Peter",
            "Priezvisko"=> "Blažek",
            "Email"=> "peterblazek@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xblazekp"
          ],
          [
              "Meno"=> "Mária",
            "Priezvisko"=> "Šimko",
            "Email"=> "mariasimko@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xsimkom"
          ],
          [
              "Meno"=> "Jana",
            "Priezvisko"=> "Marek",
            "Email"=> "janamarek@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xmarekj"
          ],
          [
              "Meno"=> "Martin",
            "Priezvisko"=> "Urban",
            "Email"=> "martinurban@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xurbanm"
          ],
          [
              "Meno"=> "Natália",
            "Priezvisko"=> "Molnár",
            "Email"=> "nataliamolnar@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xmolnarn"
          ],
          [
              "Meno"=> "Natália",
            "Priezvisko"=> "Marek",
            "Email"=> "nataliamarek@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xmarekn"
          ],
          [
              "Meno"=> "Andrej",
            "Priezvisko"=> "Chovanec",
            "Email"=> "andrejchovanec@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xchovaneca"
          ],
          ["Meno"=> "Natália",
            "Priezvisko"=> "Nagy",
            "Email"=> "natalianagy@gmail.com",
            "Heslo"=> "Heslo123!",
            "uid"=> "xnagyn"
          ]
        ];

        foreach ($users as $data) {
            $baseUid = $data['uid'];
            $uid = $baseUid;
            $counter = 1;

            // Kontrola existencie uid v databáze, pridá číslo kým nie je unikátny
            while (User::where('uid', $uid)->exists()) {
                $uid = $baseUid . $counter;
                $counter++;
            }
            // EMAIL
            $emailParts = explode('@', $data['Email']);
            $baseEmail = $emailParts[0];
            $domain = $emailParts[1];
            $email = $baseEmail . '@' . $domain;
            $emailCounter = 1;

            while (User::where('email', $email)->exists()) {
                $email = $baseEmail . $emailCounter . '@' . $domain;
                $emailCounter++;
            }
            User::create([
                'first_name' => $data['Meno'],
                'last_name' => $data['Priezvisko'],
                'email' => $email,
                'password' => Hash::make($data['Heslo']),
                'uid' => $uid,

            ]);
        }
    }
}
