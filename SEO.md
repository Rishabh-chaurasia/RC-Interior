# SEO, AEO, GEO and webmaster setup

What is in the site (all in `index.html` and `public/`):
- Title, description, canonical, robots and Open Graph / Twitter tags with a 1200×630 share image (`public/og-image.jpg`).
- Structured data (JSON-LD): LocalBusiness + GeneralContractor with address, phones, area served and services; WebSite; FAQPage (for answer engines).
- Location meta tags (`geo.*`, `ICBM`). The coordinates (28.4813, 77.0932) are approximate for Sikanderpur, Gurugram: replace them with the exact office pin from Google Maps (right-click the pin, copy the numbers) in `index.html` (two places).
- A plain-text version of the page inside `#root` for crawlers and no-JavaScript visitors; the app replaces it on load.
- `robots.txt` (allows search and AI crawlers), `sitemap.xml` (with images) and `llms.txt` (summary for AI assistants).
- IndexNow key file: `public/1057c9782b3b47d0fc2f4559a4b63faa.txt`.

## Bing Webmaster Tools (do once, about 5 minutes)
1. Go to https://www.bing.com/webmasters and sign in.
2. Easiest: "Import from Google Search Console" if the site is already there. Otherwise "Add your site" → https://www.rcinterior.co.in/.
3. Choose the "HTML Meta Tag" method, copy the `<meta name="msvalidate.01" ...>` tag, paste it in `index.html` where the comment "Bing Webmaster Tools" is, deploy, then click Verify.
4. Sitemaps → submit https://www.rcinterior.co.in/sitemap.xml.

## Google Search Console
Same idea: https://search.google.com/search-console → add the domain → verify → Sitemaps → submit `sitemap.xml`.

## Tell Bing (and Yandex) about updates instantly — IndexNow
After each deploy, open this URL once in a browser:
https://www.bing.com/indexnow?url=https://www.rcinterior.co.in/&key=1057c9782b3b47d0fc2f4559a4b63faa

## Google Business Profile
Create or claim the profile at https://business.google.com with the same name, address and phone as the site, add photos and ask happy clients for reviews. This matters most for "office interior designer near me" searches.
