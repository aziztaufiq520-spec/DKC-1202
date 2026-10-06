
/* DKC BANTUL — app.js */

const SUPABASE_URL = 'https://kpvhecscwqtslqfpsyvd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_mp-zxmwTcdUhiy1O8188CQ_tSy8vZoS';

let supabaseClient = null;

function loadSupabase() {
  return new Promise((resolve, reject) => {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Gagal memuat Supabase.'));
    document.head.appendChild(script);
  });
}

async function getSupabase() {
  if (!supabaseClient) {
    await loadSupabase();

    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );
  }

  return supabaseClient;
}

const positions = [
  'Ketua',
  'Wakil Ketua',
  'Sekretaris',
  'Bendahara',
  'Kepala Bidang Kajian Kepramukaan',
  'Kepala Bidang Kegiatan',
  'Kepala Bidang Pembinaan dan Pengembangan',
  'Kepala Bidang Penelitian dan Evaluasi',
  'Anggota Bidang Kajian Kepramukaan',
  'Anggota Bidang Kegiatan',
  'Anggota Bidang Pembinaan dan Pengembangan',
  'Anggota Bidang Penelitian dan Evaluasi'
];

const fallbackMembers = positions.map(position => ({
  position,
  name: 'Nama Pengurus',
  bio: 'Biodata pengurus akan diperbarui melalui panel pengelola.',
  photo_url: ''
}));

const fallbackInfo = [{
  title: 'Informasi DKC Bantul',
  event_date: '',
  event_time: '',
  location: '',
  description: 'Belum ada publikasi terbaru.'
}];

const fallbackActivities = [{
  title: 'Kegiatan DKC Bantul',
  event_date: '',
  event_time: '',
  location: '',
  description: 'Dokumentasi kegiatan akan ditampilkan di halaman ini.'
}];

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[c]));
}

function fmtDate(value) {
  if (!value) return 'Tanggal menyusul';

  const date = new Date(value + 'T00:00:00');

  if (Number.isNaN(date.getTime())) {
    return 'Tanggal menyusul';
  }

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function nav() {
  const menu = document.querySelector('.menu');
  const links = document.querySelector('.navlinks');

  if (menu && links) {
    menu.onclick = () => {
      links.classList.toggle('open');
    };
  }

  document.querySelectorAll('.navlinks a').forEach(link => {
    link.addEventListener('click', () => {
      if (links) {
        links.classList.remove('open');
      }
    });
  });

  const page = location.pathname.split('/').pop() || 'index.html';

  document
    .querySelectorAll('.navlinks a[data-page]')
    .forEach(link => {
      if (link.dataset.page === page) {
        link.classList.add('active');
      }
    });
}

function renderMembers(members) {
  const root = document.getElementById('members');

  if (!root) return;

  root.innerHTML = members.map((member, index) => `
    <article class="person ${index === 0 ? 'leader' : ''}">
      <div class="person-top">
        ${
          member.photo_url
            ? `
              <img
                src="${esc(member.photo_url)}"
                alt="${esc(member.name)}"
                style="width:100%;height:100%;object-fit:contain"
              >
            `
            : '<div class="placeholder">◎</div>'
        }
      </div>

      <div class="person-body">
        <small>${esc(member.position)}</small>
        <h3>${esc(member.name)}</h3>
        <p>${esc(member.bio || '')}</p>
      </div>
    </article>
  `).join('');
}

function renderEvents(id, data, activity = false) {
  const root = document.getElementById(id);

  if (!root) return;

  root.innerHTML = data.map(item => {

    if (activity) {
      return `
        <article class="activity">

          <div class="activity-cover">
            ${
              item.photo_url
                ? `
                  <img
                    src="${esc(item.photo_url)}"
                    alt="${esc(item.title)}"
                    style="width:100%;height:100%;object-fit:cover"
                  >
                `
                : '✦'
            }
          </div>

          <div class="activity-body">

            <h3>${esc(item.title)}</h3>

            <div class="meta">

              <span>
                ${fmtDate(item.event_date)}
              </span>

              ${
                item.event_time
                  ? `<span>${esc(item.event_time)} WIB</span>`
                  : ''
              }

              ${
                item.location
                  ? `<span>${esc(item.location)}</span>`
                  : ''
              }

            </div>

            <p>
              ${esc(item.description || '')}
            </p>

          </div>

        </article>
      `;
    }

    return `
      <article class="event">

        <div>

          <h3>${esc(item.title)}</h3>

          <div class="meta">

            <span>
              ${fmtDate(item.event_date)}
            </span>

            ${
              item.event_time
                ? `<span>${esc(item.event_time)} WIB</span>`
                : ''
            }

            ${
              item.location
                ? `<span>${esc(item.location)}</span>`
                : ''
            }

          </div>

          <p>
            ${esc(item.description || '')}
          </p>

        </div>

      </article>
    `;

  }).join('');
}

async function loadMembers() {

  try {

    const client = await getSupabase();

    const { data, error } = await client
      .from('organization_members')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', {
        ascending: true
      });

    if (error) throw error;

    renderMembers(
      data && data.length
        ? data
        : fallbackMembers
    );

  } catch (error) {

    console.error(
      'Gagal memuat struktur:',
      error
    );

    renderMembers(fallbackMembers);
  }
}

async function loadInformation() {

  try {

    const client = await getSupabase();

    const { data, error } = await client
      .from('information')
      .select('*')
      .eq('is_published', true)
      .order('event_date', {
        ascending: true
      });

    if (error) throw error;

    renderEvents(
      'infoList',
      data && data.length
        ? data
        : fallbackInfo
    );

  } catch (error) {

    console.error(
      'Gagal memuat informasi:',
      error
    );

    renderEvents(
      'infoList',
      fallbackInfo
    );
  }
}

async function loadActivities() {

  try {

    const client = await getSupabase();

    const { data, error } = await client
      .from('activities')
      .select('*')
      .eq('is_published', true)
      .order('event_date', {
        ascending: false
      });

    if (error) throw error;

    renderEvents(
      'activityList',
      data && data.length
        ? data
        : fallbackActivities,
      true
    );

  } catch (error) {

    console.error(
      'Gagal memuat kegiatan:',
      error
    );

    renderEvents(
      'activityList',
      fallbackActivities,
      true
    );
  }
}

async function saveSuggestion(event) {

  event.preventDefault();

  const form = event.target;
  const status = document.getElementById('status');

  try {

    const client = await getSupabase();

    const payload = {
      name: form.nama.value.trim(),
      base: form.pangkalan.value.trim(),
      suggestion: form.saran.value.trim()
    };

    if (!payload.name || !payload.suggestion) {

      if (status) {
        status.textContent =
          'Nama dan usul/saran wajib diisi.';
      }

      return;
    }

    const { error } = await client
      .from('suggestions')
      .insert(payload);

    if (error) throw error;

    if (status) {
      status.textContent =
        'Terima kasih. Usul dan saran Anda berhasil dikirim.';
    }

    form.reset();

  } catch (error) {

    console.error(
      'Gagal mengirim saran:',
      error
    );

    if (status) {
      status.textContent =
        'Usul dan saran belum berhasil dikirim. Silakan coba lagi.';
    }
  }
}

function initSuggestion() {

  const form =
    document.getElementById('suggestionForm');

  if (form) {
    form.addEventListener(
      'submit',
      saveSuggestion
    );
  }

  const count =
    document.getElementById('count');

  if (count) {
    count.textContent = 'Online';
  }
}

async function dkcAdminLogin(
  email,
  password
) {

  try {

    const client =
      await getSupabase();

    const { data, error } =
      await client.auth.signInWithPassword({
        email,
        password
      });

    if (error) {

      return {
        ok: false,
        message: error.message
      };
    }

    const {
      data: profile,
      error: profileError
    } = await client
      .from('profiles')
      .select('id, role')
      .eq('id', data.user.id)
      .single();

    if (
      profileError ||
      !profile ||
      !['admin', 'editor']
        .includes(profile.role)
    ) {

      await client.auth.signOut();

      return {
        ok: false,
        message:
          'Akun tidak memiliki hak akses pengelola.'
      };
    }

    return {
      ok: true,
      user: data.user,
      profile
    };

  } catch (error) {

    return {
      ok: false,
      message:
        error.message || 'Login gagal.'
    };
  }
}

async function dkcAdminLogout() {

  try {

    const client =
      await getSupabase();

    await client.auth.signOut();

  } catch (error) {

    console.error(
      'Logout gagal:',
      error
    );
  }
}

async function dkcGetCurrentUser() {

  try {

    const client =
      await getSupabase();

    const {
      data: {
        user
      }
    } = await client.auth.getUser();

    return user || null;

  } catch (error) {

    console.error(
      'Gagal membaca pengguna:',
      error
    );

    return null;
  }
}

window.dkcAdminLogin =
  dkcAdminLogin;

window.dkcAdminLogout =
  dkcAdminLogout;

window.dkcGetCurrentUser =
  dkcGetCurrentUser;

async function init() {

  nav();

  initSuggestion();

  await Promise.all([
    loadMembers(),
    loadInformation(),
    loadActivities()
  ]);
}

document.addEventListener(
  'DOMContentLoaded',
  init
);
