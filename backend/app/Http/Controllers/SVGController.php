<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class SVGController extends Controller
{
    public function renderText(Request $request)
    {
        $text = "Ahoj Volám sa Andrej Kováčik a toto je jedna súvislá veta. Pokračujem druhou vetou kotrá obsahuje aj čísla a znaky 5 8 98 11 1 @ @_:!";
        $words = explode(' ', $text);
        $generatedSvgs  = [];

        $inputPath = storage_path('/var/www/html/storage/app/private/temp/input.svg');
        $outputPath = storage_path('/var/www/html/storage/app/private/temp/output.svg');
        foreach ($words as $word) {
            $font_size = 24;
            $textWidth = strlen($word) * $font_size * 0.6; // Adjust ratio as needed
            $svgWidth = $textWidth; // Add padding if necessary
            $svgHeight = $font_size * 1.5; // Slightly larger than the font size

            $svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="' . $svgWidth . '" height="' . $svgHeight . '">
              <text x="0" y="' . $font_size * 0.8 . '" font-size="' . $font_size . '" font-family="Arial" fill="black"  dominant-baseline="middle">
                ' . $word . '
              </text>
            </svg>';

            if (!is_dir(dirname($inputPath))) {
                mkdir(dirname($inputPath), 0755, true);
            }
            file_put_contents($inputPath, $svgContent);

            $process = new Process([
                'inkscape', '--export-plain-svg=' . $outputPath, '--export-text-to-path', $inputPath
            ]);
            try {
                $process->mustRun();

            } catch (ProcessFailedException $exception) {
                return view('svg', ['svgs' => []]);
            }

            $outputSvg = file_get_contents($outputPath);

            $outputSvg = preg_replace('/aria-label="[^"]*"/', '', $outputSvg);

            $generatedSvgs[] = $outputSvg;
            unlink($outputPath);
        }
        return view('svg', ['svgs' => $generatedSvgs]);
    }
}
