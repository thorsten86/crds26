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
        tags: ['GVMS']
      },
      {
        id: '130106',
        ref: 'TLQI80703C',
        owner: 'Hunt, Anna',
        customer: 'HEWLETT-PACKARD',
        mrn: '26GB2STVN4MJUQI'
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
        mrn: '26GB2SV7NG3R5HC'
      },
      {
        id: '129155',
        ref: 'GBLOU09032026',
        owner: 'Hunt, Anna',
        customer: 'Christian Louboutin',
        mrn: '26GB2ODVYZOHDT'
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
        tags: ['Inventory Linked']
      },
      {
        id: '130049',
        ref: 'GBBOH11635259',
        owner: 'Martin, Ryan',
        customer: 'AMAZON KUIPER U...',
        mrn: '12/03/2026',
        tags: ['Inventory Linked']
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
        mrn: '26GB1DG7QYQCRP'
      },
      {
        id: '124079',
        ref: 'GBBOH05960',
        owner: 'Holt, Marina',
        customer: 'APPLE DISTRIBUTION',
        mrn: '26GB1IOURNQJPOA',
        tags: ['T1']
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
        mrn: '26GB2SW2HGBCXB'
      },
      {
        id: '128585',
        ref: 'GBGIV000163',
        owner: 'Swabey, Alex',
        customer: 'Givenchy Couture Ltd',
        mrn: '26GB2SVK2XRG01Y'
      }
    ]
  }
];

const board = document.getElementById('kanban-board');
const cardTemplate = document.getElementById('card-template');

boardData.forEach((column) => {
  const wrapper = document.createElement('section');
  wrapper.className = 'column';

  const title = document.createElement('h3');
  title.className = 'column-header';
  title.innerHTML = `<span>${column.name}</span><span>${column.items.length}</span>`;
  wrapper.appendChild(title);

  const list = document.createElement('div');
  list.className = 'column-list';

  column.items.forEach((item) => {
    const card = cardTemplate.content.cloneNode(true);
    card.querySelector('.kanban-card').classList.toggle('done', column.name === 'Done');
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

    list.appendChild(card);
  });

  wrapper.appendChild(list);
  board.appendChild(wrapper);
});
