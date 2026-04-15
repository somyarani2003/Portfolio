
const gc=document.getElementById('glowCursor');
document.addEventListener('mousemove',e=>{gc.style.left=e.clientX+'px';gc.style.top=e.clientY+'px'});
const reveals=document.querySelectorAll('.reveal');
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}})},{threshold:.08});
reveals.forEach(r=>obs.observe(r));

function showTab(id,btn){
  document.getElementById('tab-featured').style.display=id==='featured'?'grid':'none';
  document.getElementById('tab-github').style.display=id==='github'?'grid':'none';
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  if(id==='github')loadGitHub();
}

let ghLoaded=false;
async function loadGitHub(){
  if(ghLoaded)return;
  ghLoaded=true;
  const grid=document.getElementById('tab-github');
  try{
    const res=await fetch('https://api.github.com/users/SomyaRani/repos?sort=updated&per_page=12');
    const repos=await res.json();
    const loader=document.getElementById('gh-loader');
    if(loader)loader.remove();
    const icons={javascript:'🌐',html:'🎨',css:'💅',python:'🐍',typescript:'⚡',default:'📦'};
    const filtered=Array.isArray(repos)?repos.filter(r=>!r.fork).slice(0,9):[];
    if(!filtered.length){
      grid.innerHTML='<div class="gh-loader">No public repos found. Make sure your GitHub repos are public.</div>';return;
    }
    filtered.forEach((repo,i)=>{
      const lang=(repo.language||'').toLowerCase();
      const icon=icons[lang]||icons.default;
      const card=document.createElement('div');
      card.className='project-card gh-card reveal';
      card.style.transitionDelay=(i*.07)+'s';
      card.innerHTML=`
        <div class="project-header">
          <div class="project-icon">${icon}</div>
          <div class="project-stars">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ${repo.stargazers_count}
          </div>
        </div>
        <div class="project-title">${repo.name}</div>
        <div class="project-tech">
          ${repo.language?`<span class="p-tech">${repo.language}</span>`:''}
          ${(repo.topics||[]).slice(0,2).map(t=>`<span class="p-tech">${t}</span>`).join('')}
        </div>
        <div class="project-desc">${repo.description||'No description — check the repo for details.'}</div>
        <div class="project-links">
          <a href="${repo.html_url}" target="_blank" class="p-link">GitHub →</a>
          ${repo.homepage?`<a href="${repo.homepage}" target="_blank" class="p-link">Live →</a>`:''}
        </div>`;
      grid.appendChild(card);
      obs.observe(card);
    });
  }catch(e){
    const loader=document.getElementById('gh-loader');
    if(loader)loader.innerHTML='⚠ Could not load GitHub repos. Please check back later.';
  }
}
