# Lady Sybil — Decap CMS site

This is a static Lady Sybil website with Decap CMS at `/admin/`.

## Hosting with Netlify + GitHub

1. Create a GitHub repository and upload the contents of this folder to the `main` branch.
2. Create a site in Netlify from that GitHub repository. The publish directory is the repository root (`.`).
3. In Netlify, enable **Identity**.
4. In Identity settings, set registration to **Invite only** unless you intentionally want open registration.
5. Enable **Git Gateway** under Identity's services.
6. Invite the people who should edit the site.
7. Open `https://YOUR-DOMAIN/admin/` and sign in.

Decap CMS uses the Git Gateway backend to write CMS changes into the repository. See the official Decap documentation for current Netlify/Git Gateway setup details.

## Editable content

- Coming Up announcement
- About biography
- Spotify embed URL
- Hero image
- About image
- Facebook, Instagram, YouTube, Spotify and TikTok URLs
- Any number of Live Sessions, including title, description and YouTube URL
- Future images through the Images collection / media library

## Local development

Because the CMS and content are intended to run from a web origin, do not double-click `index.html` for a complete CMS/content test. Serve the directory over HTTP, for example:

    python3 -m http.server 8000

Then open `http://localhost:8000/`.

For CMS local editing with Decap's local backend, install the project tooling and run `npx decap-server`; see the official Decap local-backend documentation.
