const PRIMARY = [5, 100, 63];

function normalizeStatus(status) {
  return String(status || '').toLowerCase();
}

function formatAmount(value, currency) {
  const num = Number(parseFloat(value || 0));
  return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(num)} ${currency}`.trim();
}

function dateToText(date) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString('fr-FR');
}

function buildRow(expense, labels, currency) {
  return [
    expense.user?.name || expense.user_name || '—',
    expense.user?.email || expense.user_email || '—',
    dateToText(expense.expense_date || expense.created_at),
    expense.title || '—',
    expense.category_name || expense.category?.name || expense.category || '—',
    formatAmount(expense.amount, currency),
    labels[normalizeStatus(expense.status)] || normalizeStatus(expense.status),
  ];
}

export async function exportExpensesPdf({ expenses, orgName, currency = 'FCFA', labels = {} }) {
  const [{ jsPDF }, jspdfAutotable] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const autoTable = jspdfAutotable.autoTable || jspdfAutotable.default;

  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  doc.text(labels.reportTitle || 'Rapport des notes de frais', pageWidth / 2, 46, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(80);
  doc.setFont('helvetica', 'normal');
  doc.text(orgName || labels.orgFallback || '', pageWidth / 2, 66, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    `${labels.generatedOn || 'Généré le'} ${new Date().toLocaleString('fr-FR')}`,
    pageWidth / 2,
    82,
    { align: 'center' }
  );

  const head = [
    labels.employee || 'Employé',
    labels.email || 'Email',
    labels.date || 'Date',
    labels.title || 'Titre',
    labels.category || 'Catégorie',
    labels.amount || 'Montant',
    labels.status || 'Statut',
  ];

  const body = [...expenses]
    .sort((a, b) => String(a.user?.name || a.user_name || '').localeCompare(String(b.user?.name || b.user_name || '')))
    .map((e) => buildRow(e, labels, currency));

  const total = formatAmount(
    expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0),
    currency
  );

  autoTable(doc, {
    startY: 100,
    head: [head],
    body,
    foot: [
      [
        { content: labels.total || 'Total', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold', fillColor: [248, 250, 252], textColor: PRIMARY } },
        { content: total, styles: { fontStyle: 'bold', fillColor: [248, 250, 252], textColor: PRIMARY } },
        '',
      ],
    ],
    styles: {
      fontSize: 9,
      cellPadding: 7,
      textColor: [51, 65, 85],
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: PRIMARY,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9.5,
    },
    alternateRowStyles: {
      fillColor: [244, 249, 247],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 110 },
      5: { halign: 'right' },
    },
    margin: { left: 30, right: 30 },
  });

  doc.save('rapport-notes-de-frais.pdf');
}

export async function exportExpensesXlsx({ expenses, orgName, labels = {} }) {
  const XLSX = await import('xlsx');

  const header = [
    labels.employee || 'Employé',
    labels.email || 'Email',
    labels.date || 'Date',
    labels.title || 'Titre',
    labels.category || 'Catégorie',
    labels.amount || 'Montant',
    labels.status || 'Statut',
  ];

  const rows = expenses.map((e) => [
    e.user?.name || e.user_name || '—',
    e.user?.email || e.user_email || '—',
    dateToText(e.expense_date || e.created_at),
    e.title || '—',
    e.category_name || e.category?.name || e.category || '—',
    parseFloat(e.amount || 0),
    labels[normalizeStatus(e.status)] || normalizeStatus(e.status),
  ]);

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const reportWs = XLSX.utils.aoa_to_sheet([
    [labels.reportTitle || 'Rapport des notes de frais'],
    [orgName || labels.orgFallback || ''],
    [''],
    header,
    ...rows,
    [''],
    [labels.total || 'Total', '', '', '', '', total, ''],
  ]);

  reportWs['!cols'] = [
    { wch: 20 }, { wch: 26 }, { wch: 12 }, { wch: 30 }, { wch: 16 }, { wch: 14 }, { wch: 12 },
  ];
  ['A1', 'B1', 'A2', 'B2'].forEach((addr) => {
    reportWs[addr] = reportWs[addr] || { t: 's', v: '' };
  });
  reportWs['A1'].s = { font: { bold: true, sz: 16, color: { rgb: '05643F' } } };
  reportWs['A2'].s = { font: { sz: 11, color: { rgb: '64748B' } } };
  header.forEach((_, i) => {
    const cell = reportWs[XLSX.utils.encode_cell({ r: 3, c: i })];
    if (cell) cell.s = { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '05643F' } } };
  });

  const summaryRows = Object.entries(
    expenses.reduce((acc, e) => {
      const name = e.user?.name || e.user_name || '—';
      acc[name] = (acc[name] || 0) + parseFloat(e.amount || 0);
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const summaryWs = XLSX.utils.aoa_to_sheet([
    [labels.byEmployee || 'Notes de frais par employé'],
    [''],
    [labels.employee || 'Employé', labels.total || 'Total', labels.expenseCount || 'Nombre de dépenses'],
    ...summaryRows.map(([name, amount]) => [name, amount, expenses.filter((e) => (e.user?.name || e.user_name || '—') === name).length]),
    [''],
    [labels.grandTotal || 'Total général', total, expenses.length],
  ]);
  summaryWs['!cols'] = [{ wch: 26 }, { wch: 16 }, { wch: 18 }];
  ['A1'].forEach((addr) => {
    summaryWs[addr] = summaryWs[addr] || { t: 's', v: '' };
  });
  summaryWs['A1'].s = { font: { bold: true, sz: 14, color: { rgb: '05643F' } } };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, reportWs, labels.reportTitle || 'Notes de frais');
  XLSX.utils.book_append_sheet(wb, summaryWs, labels.summary || 'Résumé');
  XLSX.writeFile(wb, 'rapport-notes-de-frais.xlsx');
}