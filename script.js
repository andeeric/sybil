const DEFAULT_CONTENT = {
  comingUp: 'LUMA (Live) EP OUT NOW',
  about: 'Lady Sybil are a folktronica, Swedish-born, duo currently residing in London, UK. The duo’s signature sound is their dynamic shared leading vocals and harmonies, singing about both the dark and the light in the human experience. They are influenced by folk heroes such as Nick Drake, Joni Mitchell and Simon and Garfunkel as well as contemporaries Kate Bush, James Blake, Ben Howard and Bon Iver. Their songs are lyrically inspired by poetry as they explore themes such as mortality, relationships and the human bond with nature. Their soaring arrangements and elaborate melodies create a case in point of what Scandi music can sound like.',
  spotifyEmbed: 'https://open.spotify.com/embed/artist/3iGPGNApnVJ925NPDJJa29?utm_source=generator&si=bb68451f4af441fb',
  heroImage: '/assets/images/hero.jpg',
  socials: {facebook:'https://www.facebook.com/',instagram:'https://www.instagram.com/',youtube:'https://www.youtube.com/',spotify:'https://open.spotify.com/',tiktok:'https://www.tiktok.com/'},
  liveSessions: [
    {title:'Live Session 01', description:'', youtubeUrl:'https://www.youtube.com/watch?v=6w1mDlvFWMA'},
    {title:'Live Session 02', description:'', youtubeUrl:'https://www.youtube.com/watch?v=6w1mDlvFWMA'},
    {title:'Live Session 03', description:'', youtubeUrl:'https://www.youtube.com/watch?v=6w1mDlvFWMA'}
  ]
};

const ICONS = {
  facebook:'https://cdn.simpleicons.org/facebook/ffffff',
  instagram:'https://cdn.simpleicons.org/instagram/ffffff',
  youtube:'https://cdn.simpleicons.org/youtube/ffffff',
  spotify:'https://cdn.simpleicons.org/spotify/ffffff',
  tiktok:'https://cdn.simpleicons.org/tiktok/ffffff'
};

function youtubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    return u.searchParams.get('v') || u.pathname.split('/').pop();
  } catch { return ''; }
}

function renderSocials(socials) {
  document.querySelectorAll('[data-socials]').forEach(nav => {
    nav.innerHTML = Object.entries(ICONS).map(([name, icon]) => {
      const href = socials?.[name] || '#';
      return `<a href="${href}" aria-label="${name}" title="${name}" target="_blank" rel="noopener noreferrer"><img src="${icon}" alt=""></a>`;
    }).join('');
  });
}

function renderSpotify(src) {
  const target = document.querySelector('[data-spotify]');
  if (!target || !src) return;
  const iframe = document.createElement('iframe');
  iframe.setAttribute('data-testid','embed-iframe');
  iframe.style.borderRadius = '12px';
  iframe.src = src;
  iframe.width = '100%'; iframe.height = '152'; iframe.frameBorder = '0';
  iframe.allowFullscreen = true;
  iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  iframe.loading = 'lazy'; iframe.title = 'Lady Sybil on Spotify';
  target.replaceChildren(iframe);
}

function renderVideos(items) {
  const grid = document.querySelector('[data-live-sessions]');
  if (!grid) return;
  grid.innerHTML = (items || []).map(item => {
    const id = youtubeId(item.youtubeUrl || '');
    if (!id) return '';
    return `<article class="video-card"><div class="video-wrap"><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/${id}" title="${item.title || 'Lady Sybil live session'}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe></div>${item.title ? `<h3>${item.title}</h3>` : ''}${item.description ? `<p>${item.description}</p>` : ''}</article>`;
  }).join('');

  if (window.location.protocol === 'file:') {
    grid.querySelectorAll('.video-card').forEach(card => {
      const iframe = card.querySelector('iframe');
      if (!iframe) return;
      const id = iframe.src.split('/embed/')[1]?.split('?')[0] || '';
      const fallback = document.createElement('div');
      fallback.className = 'video-local-fallback';
      fallback.innerHTML = `<p>YouTube preview</p><a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer">Watch this Live Session on YouTube ↗</a><small>Embedded playback will appear when the site is served over HTTP/HTTPS.</small>`;
      iframe.replaceWith(fallback);
    });
  }
}

function initMenu() {
  const menuButton = document.querySelector('.menu-button');
  const mainNav = document.querySelector('#main-nav');
  const navLinks = [...document.querySelectorAll('.main-nav a')];
  const closeMenu = () => { mainNav?.classList.remove('open'); menuButton?.setAttribute('aria-expanded','false'); menuButton?.setAttribute('aria-label','Open navigation'); };
  menuButton?.addEventListener('click', event => { event.stopPropagation(); const open = mainNav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => { if (mainNav?.classList.contains('open') && !mainNav.contains(event.target) && !menuButton?.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && mainNav?.classList.contains('open')) { closeMenu(); menuButton?.focus(); } });
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)); }), {rootMargin:'-40% 0px -50% 0px',threshold:0});
  sections.forEach(section => observer.observe(section));
}

async function loadContent() {
  let content = DEFAULT_CONTENT;
  try {
    const response = await fetch('content/site.json', {cache:'no-store'});
    if (response.ok) content = {...DEFAULT_CONTENT, ...(await response.json())};
  } catch (_) {}
  document.querySelector('[data-coming-up]').textContent = content.comingUp || '';
  document.querySelector('[data-about]').textContent = content.about || '';
  if (content.heroImage) document.querySelector('.hero').style.backgroundImage = `url("${content.heroImage}")`;
  renderSocials(content.socials);
  renderSpotify(content.spotifyEmbed);
  renderVideos(content.liveSessions);
}

initMenu();
loadContent();
