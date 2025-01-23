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
        // Get the text input from the request or use a default value
        $text = "Ahoj Volám sa andrej Kováčik a toto je jedna súvislá veta.";
        $words = explode(' ', $text);
        // Paths for input and output SVGs
        $generatedSvgs  = [];
        // Create the input SVG with plain text and semantic elements

        $inputPath = storage_path('/var/www/html/storage/app/private/temp/input.svg');
        $outputPath = storage_path('/var/www/html/storage/app/private/temp/output.svg');
        foreach ($words as $word) {
            // Paths for input and output SVGs for each word
//            $font = '/var/www/html/storage/app/private/fonts/ariali.ttf';
            $font_size = 24;
            $textWidth = strlen($word) * $font_size * 0.6; // Adjust ratio as needed
            $svgWidth = $textWidth; // Add padding if necessary
            $svgHeight = $font_size * 1.2; // Slightly larger than the font size

//            $box = imagettfbbox($font_size, 0, $font, $word);
//            $min_x = min( array($box[0], $box[2], $box[4], $box[6]) );
//            $max_x = max( array($box[0], $box[2], $box[4], $box[6]) );
//            $min_y = min( array($box[1], $box[3], $box[5], $box[7]) );
//            $max_y = max( array($box[1], $box[3], $box[5], $box[7]) );
//            $width  = ( $max_x - $min_x );
//            $height = ( $max_y - $min_y );
            // Create the input SVG with each word
//            dominant-baseline="middle" text-anchor="middle"

            $svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="' . $svgWidth . '" height="' . $svgHeight . '">
              <text x="0" y="' . ($svgHeight - $font_size * 0.2) . '" font-size="' . $font_size . '" font-family="Arial" fill="black"  dominant-baseline="middle">
                ' . $word . '
              </text>
            </svg>';
//            $svgContent ='<svg xmlns="http://www.w3.org/2000/svg" width="' . $width . '" height="' . $font_size . '">
//                              <text x="0" y="' . $height . '"  font-size="' . $font_size . '" font-family="Arial" fill="black">
//                                  ' . $word . '
//                              </text>
//                           </svg>';

            if (!is_dir(dirname($inputPath))) {
                mkdir(dirname($inputPath), 0755, true);
            }
            // Save the current word as a simple SVG file
            file_put_contents($inputPath, $svgContent);

            // Use Inkscape to convert text to paths for each word
            $process = new Process([
                'inkscape', '--export-plain-svg=' . $outputPath, '--export-text-to-path', '--export-area-drawing', $inputPath
            ]);
            try {
                $process->mustRun();

            } catch (ProcessFailedException $exception) {
                return view('svg', ['svgs' => []]);
            }

            // Load the generated SVG content for each word
            $outputSvg = file_get_contents($outputPath);
            // Clean up temporary input file
            unlink($inputPath);
            // Remove aria-label with original text
            $outputSvg = preg_replace('/aria-label="[^"]*"/', '', $outputSvg);

            // Add the SVG content to the list of SVGS
            $generatedSvgs[] = $outputSvg;
        }
        // Return the SVG content to the Blade view
        return view('svg', ['svgs' => $generatedSvgs]);
    }
}
