<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SVG Text</title>
    <style>
        .svg-container {
            width: 400px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px; /* Optional: Adds space between the items */
        }

        .svg-item {
            flex-shrink: 0;
            width: auto; /* You can set a specific width if needed */
        }
    </style>
</head>
<body>
<div class="svg-container">
    @foreach($svgs as $svg)
        {!! $svg !!}
    @endforeach
</div>


</body>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        // Select all SVG elements in the document
        const svgElements = document.querySelectorAll('svg');

        svgElements.forEach(svg => {
            const gElements = svg.querySelectorAll('g');

            if (gElements.length > 0) {
                let maxWidth = 0;
                let maxHeight = 0;

                gElements.forEach(g => {
                    const bbox = g.getBBox(); // Get the bounding box of the <g> element
                    maxWidth = Math.max(maxWidth, bbox.x + bbox.width);
                    maxHeight = Math.max(maxHeight, bbox.y + bbox.height);
                });

                // Apply the calculated dimensions to the parent SVG
                svg.setAttribute('width', maxWidth);
                svg.setAttribute('height', maxHeight);
            }
        });
    });

</script>
</html>
