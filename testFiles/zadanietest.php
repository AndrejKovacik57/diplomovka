<?php

require 'zadanie.php';


$exercise_output = exercise1();
if ($exercise_output === "Hello world!") {
    echo "OK\n";
}
else{
    echo "FAIL\n";
}