<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SVG Text</title>
    <style>
        .svg-container {
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
</html>
