const sharedDetails = {
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

const boardData = [
  {
    name: 'Pre-Alert',
    items: [
      {
        id: '130111',
        ref: 'use nxt',
        owner: 'Palubeckas, Tomas',
        customer: 'ONE OFF CUSTOMER',
        mrn: '26GB2SUDYU9ZAEK',
        tags: ['GVMS'],
        details: sharedDetails
      },
      {
        id: '130106',
        ref: 'TLQI80703C',
        owner: 'Hunt, Anna',
        customer: 'HEWLETT-PACKARD',
        mrn: '26GB2STVN4MJUQI',
        details: sharedDetails
      }
    ]
  },
  {
    name: 'In Progress',
    items: [
      {
        id: '130114',
        ref: 'GBGIV000167',
        owner: 'Swabey, Alex',
        customer: 'Givenchy Couture Ltd',
        mrn: '26GB2SV7NG3R5HC',
        details: sharedDetails
      },
      {
        id: '129155',
        ref: 'GBLOU09032026',
        owner: 'Hunt, Anna',
        customer: 'Christian Louboutin',
        mrn: '26GB2ODVYZOHDT',
        details: sharedDetails
      }
    ]
  },
  {
    name: 'Prepared',
    items: [
      {
        id: '123728',
        ref: 'GBBOH78602',
        owner: 'Martin, Ryan',
        customer: 'AMAZON KUIPER S...',
        mrn: '21/03/2026',
        tags: ['Inventory Linked'],
        details: sharedDetails
      },
      {
        id: '130049',
        ref: 'GBBOH11635259',
        owner: 'Martin, Ryan',
        customer: 'AMAZON KUIPER U...',
        mrn: '12/03/2026',
        tags: ['Inventory Linked'],
        details: sharedDetails
      }
    ]
  },
  {
    name: 'Cleared',
    items: [
      {
        id: '123664',
        ref: 'GBBOH29441',
        owner: 'Holt, Marina',
        customer: 'APPLE DISTRIBUTION',
        mrn: '26GB1DG7QYQCRP',
        details: sharedDetails
      },
      {
        id: '124079',
        ref: 'GBBOH05960',
        owner: 'Holt, Marina',
        customer: 'APPLE DISTRIBUTION',
        mrn: '26GB1IOURNQJPOA',
        tags: ['T1'],
        details: sharedDetails
      }
    ]
  },
  {
    name: 'Done',
    items: [
      {
        id: '130105',
        ref: 'TLQI80703B',
        owner: 'Hunt, Anna',
        customer: 'HEWLETT-PACKARD',
        mrn: '26GB2SW2HGBCXB',
        details: sharedDetails
      },
      {
        id: '128585',
        ref: 'GBGIV000163',
        owner: 'Swabey, Alex',
        customer: 'Givenchy Couture Ltd',
        mrn: '26GB2SVK2XRG01Y',
        details: sharedDetails
      }
    ]
  }
];

const board = document.getElementById('kanban-board');
const cardTemplate = document.getElementById('card-template');
const detailsPanel = document.getElementById('details-panel');
const closeDetails = document.getElementById('close-details');

let dragPayload = null;

function renderDefinitionList(targetId, values) {
  const target = document.getElementById(targetId);
  target.textContent = '';

  Object.entries(values).forEach(([key, value]) => {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');

    term.textContent = key;
    description.textContent = value;

    row.appendChild(term);
    row.appendChild(description);
    target.appendChild(row);
  });
}

function openDetails(item) {
  renderDefinitionList('invoice-details-list', item.details.invoice);
  renderDefinitionList('worksheet-values-list', item.details.worksheetValues);
  renderDefinitionList('entry-values-list', item.details.entryValues);
  renderDefinitionList('worksheet-lines-list', item.details.worksheetLines);
  renderDefinitionList('entry-lines-list', item.details.entryLines);
  detailsPanel.classList.remove('hidden');
  detailsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function createCard(item, columnName) {
  const cardFragment = cardTemplate.content.cloneNode(true);
  const card = cardFragment.querySelector('.kanban-card');

  card.classList.toggle('done', columnName === 'Done');
  card.dataset.id = item.id;
  card.dataset.column = columnName;

  card.querySelector('.work-id').textContent = item.id;
  card.querySelector('.work-ref').textContent = item.ref;
  card.querySelector('.work-owner').textContent = item.owner;
  card.querySelector('.work-customer').textContent = `Customer: ${item.customer}`;
  card.querySelector('.work-mrn').textContent = `MRN/Date: ${item.mrn}`;

  const tagsNode = card.querySelector('.tags');
  (item.tags || []).forEach((tag) => {
    const tagChip = document.createElement('span');
    tagChip.className = 'tag';
    tagChip.textContent = tag;
    tagsNode.appendChild(tagChip);
  });

  card.addEventListener('click', () => {
    openDetails(item);
  });

  card.addEventListener('dragstart', () => {
    dragPayload = {
      itemId: item.id,
      fromColumn: columnName
    };
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
    wrapper.className = 'column';

    const title = document.createElement('h3');
    title.className = 'column-header';
    title.innerHTML = `<span>${column.name}</span><span>${column.items.length}</span>`;
    wrapper.appendChild(title);

    const list = document.createElement('div');
    list.className = 'column-list';

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

closeDetails.addEventListener('click', () => {
  detailsPanel.classList.add('hidden');
});

renderBoard();
