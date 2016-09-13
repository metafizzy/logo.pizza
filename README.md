# [logo.pizza](http://logo.pizza)

[Logo Pizza site](http://logo.pizza)

Static site, built with Gulp for tasks, Handlebars for templating.

## Structure

+ `assets/` - files that get copied into `build/`
+ `build/` - where static site gets built
+ `css/`  - global and base styles that don't fit in `modules/`
+ `data/` - Site and logo data files.
+ `img/` - Images (not included in repo)
+ `js/` - boilerplate JS
+ `modules/` - See below
+ `sandbox/` - A place to demo

## Modules

Modules are re-usable components used throughout the site. A module may consist of template, JS, and CSS files.

    modules/
      custom-colors/
        custom-colors.css
        custom-colors.js
        custom-colors.mustache
        custom-color.mustache

