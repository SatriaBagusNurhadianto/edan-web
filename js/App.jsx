import React, { useEffect, useMemo, useState } from 'react';
import scholarships from '../data/beasiswa.json';
import { createWhatsAppShareUrl, filterScholarships, getStatusLabel } from './utils.js';

function Icon({ name, size = 18 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    cap: <><path d="m2.5 9 9.5-5 9.5 5-9.5 5-9.5-5Z" /><path d="M6.5 11.3v4.1c3.5 2.9 7.5 2.9 11 0v-4.1M21.5 9v6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    external: <><path d="M14 4h6v6" /><path d="m20 4-9 9" /><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" /></>,
    back: <><path d="m15 18-6-6 6-6" /><path d="M9 12h11" /></>,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.7 10.7 6.6-4.4m-6.6 7 6.6 4.2" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.cap}</svg>;
}

function Brand() {
  return <a className="brand" href="/" aria-label="EDAN, halaman utama">
    <span className="brand-mark"><Icon name="cap" size={23} /></span>
    <span className="brand-copy"><span className="brand-name">EDAN<span className="brand-sub">Edukasi Nusantara</span></span><span className="brand-tag">BEASISWA SELURUH INDONESIA</span></span>
  </a>;
}

function Header({ onHome }) {
  return <header className="site-header"><div className="shell header-inner">
    <Brand />
    <nav className="main-nav" aria-label="Navigasi utama">
      <a href="/" onClick={onHome}>Jelajah</a>
      <a href="/#beasiswa" onClick={(event) => onHome(event, 'beasiswa')}>Beasiswa</a>
      <a href="/#tentang" onClick={(event) => onHome(event, 'tentang')}>Tentang</a>
    </nav>
    <a className="header-cta" href="/#beasiswa" onClick={(event) => onHome(event, 'beasiswa')}>Cari beasiswa <Icon name="arrow" size={16} /></a>
  </div></header>;
}

function StatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}><span className="status-dot" />{getStatusLabel(status)}</span>;
}

function useTracker() {
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('edan-tracker') || '{}'); } catch { return {}; }
  });
  const set = (id, status) => {
    const next = { ...data, [id]: status };
    setData(next);
    try { localStorage.setItem('edan-tracker', JSON.stringify(next)); } catch {}
  };
  return [data, set];
}
function useReminders() {
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('edan-reminders') || '{}'); } catch { return {}; }
  });
  const set = (id, on) => {
    const next = { ...data };
    if (on) next[id] = true; else delete next[id];
    setData(next);
    try { localStorage.setItem('edan-reminders', JSON.stringify(next)); } catch {}
  };
  return [data, set];
}

function ScholarshipCard({ item, onOpen }) {
  return <article className="scholarship-card">
    <div className="card-meta"><span className="category-label">{item.category}</span><span className="open-type-badge">{item.openType || 'Bersyarat'}</span><StatusBadge status={item.deadline.status} /></div>
    <button className="card-title-button" onClick={() => onOpen(item.id)}><h3>{item.title}</h3></button>
    <p className="provider">{item.provider}</p>
    <p className="card-summary">{item.summary}</p>
    <div className="card-facts">
      <div className="fact"><Icon name="cap" size={15} /><span>{item.level}</span></div>
      <div className="fact"><Icon name="calendar" size={15} /><span>{item.deadline.label}</span></div>
    </div>
    <div className="card-bottom"><span className="fact-count">{item.requirements.length} syarat utama</span><button className="detail-link" onClick={() => onOpen(item.id)}>Detail <Icon name="arrow" size={15} /></button></div>
  </article>;
}

function HomePage({ onOpen }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [status, setStatus] = useState('Semua');
  const [hideClosed, setHideClosed] = useState(true);
  const results = useMemo(() => {
    let r = filterScholarships(scholarships, { query, category, status });
    if (hideClosed) r = r.filter((item) => item.deadline.status !== 'closed');
    return r;
  }, [query, category, status, hideClosed]);
  const categories = ['Semua', ...new Set(scholarships.map((item) => item.category))];
  const statuses = [
    ['Semua', 'Semua jadwal'], ['open', 'Dibuka'], ['campus', 'Cek kampus'], ['upcoming', 'Akan datang'], ['closed', 'Ditutup']
  ];
  const resetFilters = () => { setQuery(''); setCategory('Semua'); setStatus('Semua'); setHideClosed(true); };

  return <>
    <main>
      <section className="explore-hero">
        <div className="hero-glow hero-glow-pink" /><div className="hero-glow hero-glow-cyan" /><div className="hero-glow hero-glow-lilac" />
        <div className="shell hero-layout">
          <div className="hero-content">
            <h1>Temukan beasiswa<br /><span>yang membuka jalanmu.</span></h1>
            <p className="hero-description">Cari program, cek persyaratan, dan lanjut ke sumber resmi. Semua informasi ini dikurasi untuk membantumu mengambil langkah berikutnya.</p>
            <label className="search-field"><Icon name="search" size={20} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur(); }} placeholder="Cari nama beasiswa, penyelenggara, atau jenjang" aria-label="Cari beasiswa" /><kbd>⌕</kbd></label>
            <div className="popular-searches"><span>Coba cari:</span><button onClick={() => setQuery('KIP')}>KIP Kuliah</button><button onClick={() => setQuery('LPDP')}>LPDP</button><button onClick={() => setQuery('mahasiswa baru')}>Mahasiswa baru</button></div>
          </div>
          <aside className="hero-side" aria-label="Ringkasan portal">
            <div className="hero-orbit"><span className="orbit-core"><Icon name="cap" size={39} /></span><span className="orbit-sticker sticker-one">ID</span><span className="orbit-sticker sticker-two">+</span></div>
            <div className="hero-note"><span className="note-check"><Icon name="check" size={15} /></span><span><strong>Informasi dari sumber resmi</strong><small>Periksa tautan penyelenggara sebelum mendaftar.</small></span></div>
          </aside>
        </div>
      </section>

      <section className="listing-section" id="beasiswa">
        <div className="shell">
          <div className="listing-heading"><div><p className="section-kicker">JELAJAHI PELUANG</p><h2>Beasiswa untuk berbagai langkah</h2><p className="section-subtitle">Program nasional, yayasan, dan kemitraan kampus dari berbagai wilayah.</p></div><div className="result-count"><strong>{results.length.toString().padStart(2, '0')}</strong><span>dari {scholarships.length} program</span></div></div>
          <div className="filters-panel">
            <div className="filter-group"><span className="filter-label">Penyelenggara</span><div className="filter-options">{categories.map((item) => <button key={item} className={`filter-chip ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
            <div className="filter-group status-filter"><span className="filter-label">Status pendaftaran</span><div className="filter-options">{statuses.map(([value, label]) => <button key={value} className={`filter-chip ${status === value ? 'selected' : ''}`} onClick={() => setStatus(value)}>{label}</button>)}</div></div>
            <div className="filter-group"><label style={{display:'flex',alignItems:'center',gap:8,fontSize:12,cursor:'pointer'}}><input type="checkbox" checked={hideClosed} onChange={(e)=>setHideClosed(e.target.checked)} /> Sembunyikan yang sudah ditutup</label></div>
          </div>
          {results.length ? <div className="scholarship-grid">{results.map((item) => <ScholarshipCard key={item.id} item={item} onOpen={onOpen} />)}</div> : <div className="empty-state"><div className="empty-mark"><Icon name="search" size={22} /></div><h3>Belum ada hasil yang cocok</h3><p>Coba kata kunci atau filter yang berbeda.</p><button className="button button-soft" onClick={resetFilters}>Hapus semua filter</button></div>}
          <p className="data-note"><Icon name="clock" size={15} /> Data terakhir diperiksa 21 Oktober 2026. Tenggat dan syarat bisa berubah—pastikan selalu cek situs resmi.</p>
        </div>
      </section>

      <section className="templates-strip" id="template"><div className="shell"><h2>Template Dokumen</h2><p>Siap pakai untuk pendaftaran beasiswa.</p><div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:12}}><a className="button button-soft" href="/templates/cv-template.txt" download>Download Template CV</a><a className="button button-soft" href="/templates/motivation-letter-template.txt" download>Download Template Surat Motivasi</a></div></div></section>
      <section className="community-strip" id="komunitas"><div className="shell"><h2>Komunitas Pejuang Beasiswa</h2><p>Bergabung dengan komunitas untuk sharing info, tips, dan pengalaman.</p><a className="button button-primary" href="https://chat.whatsapp.com/" target="_blank" rel="noreferrer">Gabung Grup WhatsApp <Icon name="share" size={16} /></a></div></section>
      <section className="mentor-strip" id="mentor"><div className="shell"><h2>Konsultasi Mentor</h2><p>Bimbingan langsung dari mentor berpengalaman.</p><a className="button button-soft" href="mailto:mentor@edan.id?subject=Konsultasi%20Beasiswa">Hubungi Mentor via Email <Icon name="arrow" size={16} /></a></div></section>
      <section className="about-strip" id="tentang"><div className="shell about-inner"><div><p className="section-kicker">SATU INDONESIA, BANYAK JALAN</p><h2>Mulai dari informasi yang tepat.</h2><p>EDAN merangkum peluang dari pemerintah, yayasan, dan mitra kampus. Keputusan kelayakan tetap mengikuti panduan resmi tiap penyelenggara.</p></div><a className="button button-primary" href="#beasiswa">Jelajahi 10 program <Icon name="arrow" size={16} /></a></div></section>
    </main>
    <Footer />
  </>;
}

function DetailPage({ item, onHome }) {
  const [tracker, setTracker] = useTracker();
  const [reminders, setReminder] = useReminders();
  const status = tracker[item.id] || 'belum';
  const isReminderOn = !!reminders[item.id];
  const detailUrl = `${window.location.origin}${window.location.pathname}?beasiswa=${encodeURIComponent(item.id)}`;
  const shareUrl = createWhatsAppShareUrl(item, detailUrl);
  return <>
    <main className="detail-page">
      <div className="shell">
        <button className="back-link" onClick={onHome}><Icon name="back" size={18} /> Kembali ke daftar</button>
        <div className="detail-heading">
          <div className="detail-heading-main"><div className="detail-labels"><span className="category-label">{item.category}</span><StatusBadge status={item.deadline.status} /></div><p className="detail-provider">{item.provider}</p><h1>{item.title}</h1><p className="detail-summary">{item.summary}</p></div>
          <div className="detail-heading-mark"><Icon name="cap" size={34} /></div>
        </div>
        <div className="detail-layout">
          <div className="detail-main-column">
            <section className="detail-section"><div className="section-title-row"><span className="section-icon pink-icon"><Icon name="check" size={18} /></span><div><p className="section-kicker">SEBELUM MENDAFTAR</p><h2>Syarat utama</h2></div></div><ul className="requirements-list">{item.requirements.map((requirement, index) => <li key={requirement}><span className="requirement-number">{String(index + 1).padStart(2, '0')}</span><span>{requirement}</span></li>)}</ul></section>
            <section className="detail-section benefit-section"><div className="section-title-row"><span className="section-icon cyan-icon"><Icon name="cap" size={18} /></span><div><p className="section-kicker">DUKUNGAN PROGRAM</p><h2>Manfaat beasiswa</h2></div></div><p className="benefit-copy">{item.benefit}</p></section>
            <section className="detail-section sources-section"><div className="section-title-row"><span className="section-icon lilac-icon"><Icon name="external" size={18} /></span><div><p className="section-kicker">CEK INFORMASI ASLI</p><h2>Sumber resmi</h2></div></div><p className="sources-intro">Buka sumber di bawah untuk membaca panduan, ketentuan, dan pembaruan dari penyelenggara.</p><ul className="source-list">{item.sources.map((source, index) => <li key={source}><a href={source} target="_blank" rel="noreferrer"><span>{new URL(source).hostname}</span><span className="source-open">{index === 0 ? 'Halaman program' : 'Panduan / informasi'} <Icon name="external" size={14} /></span></a></li>)}</ul><p className="verified-note">Sumber ditinjau: {new Date(`${item.verifiedAt}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.</p></section>
          </div>
          <aside className="detail-sidebar">
            <div className="deadline-card"><p className="section-kicker">TENGGAT & JADWAL</p><div className="deadline-status"><StatusBadge status={item.deadline.status} /></div><h2>{item.deadline.label}</h2><p>{item.deadline.detail}</p><div className="deadline-divider" /><a className="button button-primary full-button" href={item.officialUrl} target="_blank" rel="noreferrer">Buka situs resmi <Icon name="external" size={16} /></a><a className="button button-whatsapp full-button" href={shareUrl} target="_blank" rel="noreferrer"><Icon name="share" size={17} /> Bagikan lewat WhatsApp</a></div>
            <div className="level-card"><span className="level-icon"><Icon name="cap" size={17} /></span><span><small>Jenjang sasaran</small><strong>{item.level}</strong></span></div>
            <div className="tracker-card" style={{padding:13,border:'1px solid #eee7ef',borderRadius:14,background:'#fff'}}><strong style={{fontSize:9}}>Progress Aplikasi</strong><select value={status} onChange={(e)=>setTracker(item.id,e.target.value)} style={{marginTop:8,width:'100%',padding:8,borderRadius:8,border:'1px solid #eee7ef'}}><option value="belum">Belum daftar</option><option value="proses">Sedang proses</option><option value="selesai">Sudah submit</option><option value="diterima">Diterima</option></select></div>
            <button className="button button-soft full-button" onClick={()=>setReminder(item.id,!isReminderOn)} style={{marginTop:8}}>{isReminderOn ? 'Reminder H-3 aktif' : 'Aktifkan Reminder H-3'}</button>
            <div className="reminder-card"><strong>Catatan</strong><p>EDAN bukan penyelenggara beasiswa. Informasi ini ringkasan; persyaratan dan keputusan akhir mengikuti sumber resmi.</p></div>
          </aside>
        </div>
      </div>
    </main>
    <Footer />
  </>;
}

function Footer() {
  return <footer className="site-footer"><div className="shell footer-inner"><Brand /><p>Portal informasi beasiswa untuk pelajar dan mahasiswa di seluruh Indonesia.</p><span>© 2026 EDAN</span></div></footer>;
}

export default function App() {
  const [selectedId, setSelectedId] = useState(() => new URLSearchParams(window.location.search).get('beasiswa'));
  const selected = scholarships.find((item) => item.id === selectedId);
  const openDetail = (id) => {
    const url = new URL(window.location.href);
    url.searchParams.set('beasiswa', id);
    window.history.pushState({}, '', url);
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const goHome = (event, anchor = '') => {
    if (event) event.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.delete('beasiswa');
    const hash = anchor ? `#${anchor}` : '';
    window.history.pushState({}, '', `${url.pathname}${url.search}${hash}`);
    setSelectedId(null);
    if (anchor) {
      window.setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  useEffect(() => {
    const syncRoute = () => setSelectedId(new URLSearchParams(window.location.search).get('beasiswa'));
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);
  useEffect(() => {
    document.title = selected ? `${selected.title} — EDAN` : 'EDAN — Jelajah Beasiswa Indonesia';
  }, [selected]);

  return <><Header onHome={goHome} />{selected ? <DetailPage item={selected} onHome={goHome} /> : <HomePage onOpen={openDetail} />}</>;
}
