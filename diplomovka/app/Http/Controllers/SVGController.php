<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class SVGController extends Controller
{
    public function renderText(Request $request)
    {
        // Get the text input from the request or use a default value
        $text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend mi dui, vitae facilisis felis sodales sit amet. Suspendisse metus tellus, rhoncus sed lacus ac, volutpat posuere tortor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec semper fringilla euismod. Ut eu ante eget lectus porta faucibus. Donec sagittis, arcu vitae lacinia finibus, augue lectus rhoncus tortor, sit amet viverra tortor diam non turpis. In tellus elit, ultricies vel lorem nec, pretium porta nunc. Integer faucibus erat eget tellus vestibulum eleifend. Donec ut mollis justo.

Nulla sapien nunc, congue non consequat nec, dignissim eu ex. Nunc euismod mauris ligula, non porta felis egestas sed. Phasellus nec dolor nisi. Quisque hendrerit neque est, a fermentum nibh pretium nec. Donec aliquam risus felis, non viverra magna mattis id. Nulla metus est, euismod sit amet ligula vel, varius venenatis ante. Aliquam ac bibendum arcu. Aliquam urna turpis, facilisis in luctus sed, congue nec orci.";

        // Paths for input and output SVGs
        $inputPath = storage_path('app/temp/input.svg');
        $outputPath = storage_path('app/temp/output.svg');

        // Create the input SVG with plain text and semantic elements
        $svgContent = <<<SVG
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="200">
            <rect width="100%" height="100%" fill="white" />
            <title>Generated SVG Text</title>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24" font-family="Arial" fill="black">
                $text
            </text>
        </svg>
        SVG;

        // Save the input SVG to a file
        if (!is_dir(dirname($inputPath))) {
            mkdir(dirname($inputPath), 0755, true);
        }
        file_put_contents($inputPath, $svgContent);

        // Use Inkscape to convert text to paths
        $process = new Process([
            'inkscape', '--export-plain-svg=' . $outputPath, '--export-text-to-path', $inputPath
        ]);
        try {
            $process->mustRun();
        } catch (ProcessFailedException $exception) {
            return response()->json(['error' => 'Failed to generate SVG.', 'ex'=>$exception], 500);
        }


        // Load the generated SVG content
        $outputSvg = file_get_contents($outputPath);

        // Remove aria-label with original text
        $outputSvg = preg_replace('/aria-label="[^"]*"/', '', $outputSvg);

        // Return the SVG content to the Blade view
        return view('svg', ['svg' => $outputSvg]);
    }
}
