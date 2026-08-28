MINESCOUT BETA — CLEAN URL BUILD

This build includes:
- The Minescout Beta Evolution article.
- All historical Beta ZIP snapshots under /assets/files/.
- The Evolution article registered in assets/js/filesystem.js.
- Internal HTML navigation converted to extensionless URLs.
- Nginx configuration for clean URLs in nginx-beta.minescout.net.conf.

DEPLOYMENT
1. Copy the contents of this directory into:
   /usr/share/nginx/html/beta.minescout.net/

2. Use nginx-beta.minescout.net.conf as the server block.

3. The important routing behavior is:
   /pages       -> pages.html
   /projects    -> projects.html
   /login       -> login.html
   /content/articles/vigenere-release -> content/articles/vigenere-release.html

4. Existing .html URLs redirect to their clean equivalents.

Do not rename the actual .html files. Nginx serves them behind the clean URLs.
