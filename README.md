# Folio

## TODO... maybe

I looked at Svelte which look promising but I was not satisfied with having my index.html `<body>` containing only `<script src='./main.js'></script>` which was loading Svelte app which was injecting html & css into `<body>` to finally have content displayed... this is not the best way IMO to use html, css & js. So I looked into SSR to have a static site composed of html & css and no one seems to have done this with Svelte yet. So I could have tried to do it with puppeteer to render/extract the generated html & css, but motivation was lacking.

Then I thought what's another cool framework which is not react and that has done SSR ? Vue with Nuxt project, so maybe this will be the next step of my folio, by this time, pure html, css and an optional js will be sufficient.

## Thanks

- [Feather Icons](https://feathericons.com/) : nice looking svg icons
- [Parcel Js](https://parceljs.org/) : fast & easy bundler
- [Web App Manifest Generator](https://app-manifest.firebaseapp.com/) : generate manifest.json easily
- [GTmetrix](https://gtmetrix.com) : great tool to check & monitor websites performances
