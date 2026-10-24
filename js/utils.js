export function filterScholarships(items, { query = '', category = 'Semua', status = 'Semua' } = {}) {
  const needle = query.trim().toLocaleLowerCase('id-ID');
  return items.filter((item) => {
    const matchesQuery = !needle || [item.title, item.provider, item.level, item.category, item.summary]
      .filter(Boolean)
      .some((value) => value.toLocaleLowerCase('id-ID').includes(needle));
    const matchesCategory = category === 'Semua' || item.category === category;
    const matchesStatus = status === 'Semua' || item.deadline?.status === status;
    return matchesQuery && matchesCategory && matchesStatus;
  });
}

export function getStatusLabel(status) {
  const labels = {
    open: 'Pendaftaran dibuka',
    closed: 'Pendaftaran ditutup',
    campus: 'Cek jadwal kampus',
    upcoming: 'Jadwal belum diumumkan'
  };
  return labels[status] ?? 'Cek situs resmi';
}

export function createWhatsAppShareUrl(item, pageUrl) {
  const text = `Info beasiswa: ${item.title}\n${item.deadline.label}\nDetail dan syarat: ${pageUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
