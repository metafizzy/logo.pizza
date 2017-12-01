# [logo.pizza](http://logo.pizza)

[Logo Pizza site](http://logo.pizza)

Static site, built with Gulp for tasks, Handlebars for templating.

## Tasks

+ `gulp` - build the production site, concatenate CSS and JS, minify JS
+ `gulp dev` - build the site, but use separate CSS and JS files for debugging

## Structure

+ `assets/` - files that get copied into `build/`
+ `build/` - where static site gets built
+ `css/`  - global and base styles that don't fit in `modules/`
+ `data/` - Site and logo data files.
+ `img/` - Images (not included in repo)
+ `js/` - boilerplate JS
+ `modules/` - See below
+ `sandbox/` - A place to demo

Images have been kept out of the repo.

## Modules

Modules are re-usable components used throughout the site. A module may consist of template, JS, and CSS files.

    modules/
      custom-colors/
        custom-colors.css
        custom-colors.js
        custom-colors.mustache
        custom-color.mustache

[BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) is used for CSS code style.

``` css
.custom-color {} /* block */
.custom-color__preview {} /* element, child */
.custom-color--dark {} /* modifier */
```

JavaScript can be initialized for each element with `data-js` attribute.

``` html
<div class="custom-colors" data-js="custom-colors">
```

``` js
LogoPizza.modules['custom-colors'] = function( elem ) {
  // do something with elem
};
```

---

By [Metafizzy](http://metafizzy.co)

All logo SVG code is owned by Metafizzy or clients who have purchased the logo. All rights reserved.

Remaining code is MIT Licensed
