import * as sapper from '@sapper/app';

//
// <https://github.com/upptime/upptime/issues/758>
// if we do not use this then we need to move sapper at end of <body>
// <https://caniuse.com/domcontentloaded>
//
document.addEventListener('DOMContentLoaded', function() {
  sapper.start({
    target: document.querySelector('#sapper')
  });
});
