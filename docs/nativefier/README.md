# Nativefier

To use `nativefier` to generate a macOS app version of Classroometrics, run:

```
nativefier --name 'Classroometrics' 'classroometrics.com' --title-bar-style 'hidden' --inject classroometrics.css --inject classroometrics.js
```

`classroometrics.css` and `classroometrics.js` ensure that when the title bar is hidden, there's still a draggable region to move the window.
