# Exporting images

## Bitmap

From a bitmap screenshot, resize to w1440 and compress to **avif q50+** or **webm q75+**.

Resize to w410 to create the thumbnail.

## Vector

To create a svg screenshot :

1. use the Google Chrome extension [SVG Screenshot](https://chromewebstore.google.com/detail/svg-screenshot/nfakpcpmhhilkdpphcjgnokknpbpdllg).
2. is the extension failed, print the page to pdf, then convert the pdf to svg with [pdf2svg](https://github.com/dawbarton/pdf2svg) : `pdf2svg.exe page.pdf page.svg`
3. adjust in [Boxy SVG](https://boxy-svg.com/)
4. compress with [SVGOMG](https://jakearchibald.github.io/svgomg/)
5. repeat step 3 and 4 until the svg is light/clean enough
