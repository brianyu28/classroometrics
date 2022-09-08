const titleBar = document.createElement('div');
titleBar.className = "title-bar"
const body = document.querySelector('body');
body.insertBefore(titleBar, body.firstChild);
