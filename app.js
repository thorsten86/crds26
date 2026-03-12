const detailTemplate = {
  invoice: {
    Customer: 'ITX UK LIMITED / GB649927871000',
    'Invoice Number': '04-03180',
    'Invoice Value': '67821.72',
    'Truck Reg': 'CAEN R2177BDJ FUENTES UK',
    Packages: '292',
    'Net Weight': '2429',
    'Gross Weight': '3074',
    'VAT Adjustment': '317',
    'MRN Number Simplified Declaration': '26GB2A84G3AM5IWAR2',
    Exporter: 'TEMPE, S.A.',
    Incoterm: 'CIP'
  },
  worksheetValues: {
    '100s': '58,654.57',
    '200s': '9,050.17',
    '300s': '116.98',
    'Total Worksheet Value': '67,821.72'
  },
  entryValues: {
    'Entry 1': '36942.50',
    'Entry 2': '30879.22'
  },
  worksheetLines: {
    '100 Lines': '119',
    '200 Lines': '64',
    '300 Lines': '2',
    'Total Worksheet Lines': '185'
  },
  entryLines: {
    'Entry 1 Lines': '99',
    'Entry 2 Lines': '86'
  }
};

function cloneDetails() {
  return JSON.parse(JSON.stringify(detailTemplate));
}

const boardData = [
  {
    name: 'Pre-Alert',
    items: [
      { id: '130111', ref: 'use nxt', owner: 'Palubeckas, Tomas', customer: 'ONE OFF CUSTOMER', mrn: '26GB2SUDYU9ZAEK', tags: ['GVMS'], details: cloneDetails() },
      { id: '130106', ref: 'TLQI80703C', owner: 'Hunt, Anna', customer: 'HEWLETT-PACKARD', mrn: '26GB2STVN4MJUQI', tags: [], details: cloneDetails() }
    ]
  },
  {
    name: 'In Progress',
    items: [
      { id: '130114', ref: 'GBGIV000167', owner: 'Swabey, Alex', customer: 'Givenchy Couture Ltd', mrn: '26GB2SV7NG3R5HC', tags: [], details: cloneDetails() },
      { id: '129155', ref: 'GBLOU09032026', owner: 'Hunt, Anna', customer: 'Christian Louboutin', mrn: '26GB2ODVYZOHDT', tags: [], details: cloneDetails() }
    ]
  },
  {
    name: 'Prepared',
    items: [
      { id: '123728', ref: 'GBBOH78602', owner: 'Martin, Ryan', customer: 'AMAZON KUIPER S...', mrn: '21/03/2026', tags: ['Inventory Linked'], details: cloneDetails() },
      { id: '130049', ref: 'GBBOH11635259', owner: 'Martin, Ryan', customer: 'AMAZON KUIPER U...', mrn: '12/03/2026', tags: ['Inventory Linked'], details: cloneDetails() }
    ]
  },
  {
    name: 'Cleared',
    items: [
      { id: '123664', ref: 'GBBOH29441', owner: 'Holt, Marina', customer: 'APPLE DISTRIBUTION', mrn: '26GB1DG7QYQCRP', tags: [], details: cloneDetails() },
      { id: '124079', ref: 'GBBOH05960', owner: 'Holt, Marina', customer: 'APPLE DISTRIBUTION', mrn: '26GB1IOURNQJPOA', tags: ['T1'], details: cloneDetails() }
    ]
  },
  {
    name: 'Done',
    items: [
      { id: '130105', ref: 'TLQI80703B', owner: 'Hunt, Anna', customer: 'HEWLETT-PACKARD', mrn: '26GB2SW2HGBCXB', tags: [], details: cloneDetails() },
      { id: '128585', ref: 'GBGIV000163', owner: 'Swabey, Alex', customer: 'Givenchy Couture Ltd', mrn: '26GB2SVK2XRG01Y', tags: [], details: cloneDetails() }
    ]
  }
];

const board = document.getElementById('kanban-board');
const cardTemplate = document.getElementById('card-template');
const editModal = document.getElementById('edit-modal');
const modalOverlay = document.getElementById('modal-overlay');
const closeModalButton = document.getElementById('close-modal');
const cancelModalButton = document.getElementById('cancel-modal');
const detailsForm = document.getElementById('details-form');

let dragPayload = null;
let editingItemId = null;

function findItemById(itemId) {
  for (const column of boardData) {
    const item = column.items.find((entry) => entry.id === itemId);
    if (item) {
      return item;
    }
  }

  return null;
}

function renderFieldGroup(containerId, values, sectionName) {
  const container = document.getElementById(containerId);
  container.textContent = '';

  Object.entries(values).forEach(([key, value]) => {
    const label = document.createElement('label');
    label.className = 'field-label';
    label.textContent = key;

    const input = document.createElement('input');
    input.className = 'field-input';
    input.value = value;
    input.dataset.section = sectionName;
    input.dataset.key = key;

    label.appendChild(input);
    container.appendChild(label);
  });
}

function collectFieldGroup(containerId) {
  const nextValues = {};
  document.querySelectorAll(`#${containerId} input`).forEach((input) => {
    nextValues[input.dataset.key] = input.value;
  });

  return nextValues;
}

function openEditModal(itemId) {
  const item = findItemById(itemId);
  if (!item) {
    return;
  }

  editingItemId = itemId;

  document.getElementById('field-ref').value = item.ref;
  document.getElementById('field-owner').value = item.owner;
  document.getElementById('field-customer').value = item.customer;
  document.getElementById('field-mrn').value = item.mrn;
  document.getElementById('field-tags').value = item.tags.join(', ');

  renderFieldGroup('invoice-fields', item.details.invoice, 'invoice');
  renderFieldGroup('worksheet-values-fields', item.details.worksheetValues, 'worksheetValues');
  renderFieldGroup('entry-values-fields', item.details.entryValues, 'entryValues');
  renderFieldGroup('worksheet-lines-fields', item.details.worksheetLines, 'worksheetLines');
  renderFieldGroup('entry-lines-fields', item.details.entryLines, 'entryLines');

  editModal.classList.remove('hidden');
  editModal.classList.add('flex');
}

function closeEditModal() {
  editModal.classList.add('hidden');
  editModal.classList.remove('flex');
  editingItemId = null;
}

function createCard(item, columnName) {
  const cardFragment = cardTemplate.content.cloneNode(true);
  const card = cardFragment.querySelector('.kanban-card');

  card.classList.toggle('done', columnName === 'Done');
  card.dataset.id = item.id;

  card.querySelector('.work-id').textContent = item.id;
  card.querySelector('.work-ref').textContent = item.ref;
  card.querySelector('.work-owner').textContent = item.owner;
  card.querySelector('.work-customer').textContent = `Customer: ${item.customer}`;
  card.querySelector('.work-mrn').textContent = `MRN/Date: ${item.mrn}`;

  const tagsNode = card.querySelector('.tags');
  (item.tags || []).forEach((tag) => {
    const tagChip = document.createElement('span');
    tagChip.className = 'rounded-full bg-sky-100 px-2 py-1 text-xs text-sky-800';
    tagChip.textContent = tag;
    tagsNode.appendChild(tagChip);
  });

  card.addEventListener('click', () => openEditModal(item.id));

  card.addEventListener('dragstart', () => {
    dragPayload = { itemId: item.id, fromColumn: columnName };
    card.classList.add('dragging');
  });

  card.addEventListener('dragend', () => {
    dragPayload = null;
    card.classList.remove('dragging');
  });

  return cardFragment;
}

function moveItem(itemId, fromColumnName, toColumnName) {
  if (!fromColumnName || !toColumnName || fromColumnName === toColumnName) {
    return;
  }

  const fromColumn = boardData.find((column) => column.name === fromColumnName);
  const toColumn = boardData.find((column) => column.name === toColumnName);
  if (!fromColumn || !toColumn) {
    return;
  }

  const itemIndex = fromColumn.items.findIndex((item) => item.id === itemId);
  if (itemIndex < 0) {
    return;
  }

  const [item] = fromColumn.items.splice(itemIndex, 1);
  toColumn.items.push(item);
}

function renderBoard() {
  board.textContent = '';

  boardData.forEach((column) => {
    const wrapper = document.createElement('section');
    wrapper.className = 'rounded-lg border border-slate-200 bg-slate-50';

    const title = document.createElement('h3');
    title.className = 'flex items-center justify-between border-b border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700';
    title.innerHTML = `<span>${column.name}</span><span class="rounded-full bg-white px-2 py-0.5 text-xs">${column.items.length}</span>`;
    wrapper.appendChild(title);

    const list = document.createElement('div');
    list.className = 'column-list grid min-h-[220px] gap-2 p-2';

    list.addEventListener('dragover', (event) => {
      event.preventDefault();
      list.classList.add('drop-target');
    });

    list.addEventListener('dragleave', () => {
      list.classList.remove('drop-target');
    });

    list.addEventListener('drop', (event) => {
      event.preventDefault();
      list.classList.remove('drop-target');

      if (!dragPayload) {
        return;
      }

      moveItem(dragPayload.itemId, dragPayload.fromColumn, column.name);
      renderBoard();
    });

    column.items.forEach((item) => {
      list.appendChild(createCard(item, column.name));
    });

    wrapper.appendChild(list);
    board.appendChild(wrapper);
  });
}

detailsForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!editingItemId) {
    return;
  }

  const item = findItemById(editingItemId);
  if (!item) {
    closeEditModal();
    return;
  }

  item.ref = document.getElementById('field-ref').value;
  item.owner = document.getElementById('field-owner').value;
  item.customer = document.getElementById('field-customer').value;
  item.mrn = document.getElementById('field-mrn').value;
  item.tags = document
    .getElementById('field-tags')
    .value.split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  item.details.invoice = collectFieldGroup('invoice-fields');
  item.details.worksheetValues = collectFieldGroup('worksheet-values-fields');
  item.details.entryValues = collectFieldGroup('entry-values-fields');
  item.details.worksheetLines = collectFieldGroup('worksheet-lines-fields');
  item.details.entryLines = collectFieldGroup('entry-lines-fields');

  closeEditModal();
  renderBoard();
});

modalOverlay.addEventListener('click', closeEditModal);
closeModalButton.addEventListener('click', closeEditModal);
cancelModalButton.addEventListener('click', closeEditModal);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !editModal.classList.contains('hidden')) {
    closeEditModal();
  }
});

renderBoard();
