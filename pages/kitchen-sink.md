<!-- markdownlint-disable MD033 -->

# Kitchen sink

<img src="/assets/illustrations/examination-passed.svg" alt="examination passed" width="600" class="absolute -top-12 -right-1/4 not-prose" />

## Typography

<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<br />
<a class="app-link" href="/kitchen-sink">App link</a>

## Colors

<code-showcase>
  <color-grid name="primary" />
</code-showcase>

<code-showcase>
  <color-grid name="accent" />
</code-showcase>

## Components

### Buttons

<code-showcase>
  <push-button class="w-fit" text="Push button" />
</code-showcase>

### Placeholder

<code-showcase>
  <place-holder />
</code-showcase>

### Photo Gallery

<code-showcase>
  <photo-gallery :photos="[{ label: 'Vidéo de présentation', src: 'https://www.youtube.com/watch?v=F10yQLrO-xs', size: '1280-720', thumb: 'https://img.youtube.com/vi/F10yQLrO-xs/maxresdefault.jpg' }, { label: 'mon avatar', src: '/assets/images/avatar.jpg', size: '460-460' }, { label: 'le site de Lyf Pay', src: '/assets/images/lyf-eu.png', size: '1600-1767' }]" />
</code-showcase>
