<?php


function exercise1(): string
{
    return "Hello world!";
}

if (__FILE__ == realpath($_SERVER['SCRIPT_FILENAME'])) {

    echo exercise1() . "\n";
}


