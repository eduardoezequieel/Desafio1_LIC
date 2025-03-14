let transactions = []; // lista de transacciones
let transactionType = '1'; // 1: Ingreso, 2: Egreso

const transactionsContainer = document.querySelector('.transactions-container');
const currentDateSpan = document.querySelector('#current-date');
const incomeCounterSpan = document.querySelector('#income-counter');
const revenueCounterSpan = document.querySelector('#revenue-counter');
const balanceCounterSpan = document.querySelector('#balance-counter');

document.addEventListener('DOMContentLoaded', () => {
  const date = new Date();

  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
  }).format(date);

  const monthYearText = toTitlecase(formattedDate.split(' ')[0]) + ' ' + formattedDate.split(' ')[2];

  currentDateSpan.textContent = monthYearText;
});

// Cambia los estilos al seleccionar una tab en especifico
document.querySelectorAll('.tabs-container > button').forEach((button) => {
  button.addEventListener('click', (e) => {
    const selectedButton = e.target;
    const siblings = Array.from(selectedButton.parentElement.children);
    
    siblings.forEach((sibling) => {
      if (sibling === selectedButton) {
        // se cambia la clase
        sibling.classList.add('active');

        // se obtiene el tipo de transacción seleccionada
        transactionType = sibling.dataset.transactionType;

        // se renderizan las transacciones en el DOM
        renderTransactions();
      } else {
        // se remueve la clase
        sibling.classList.remove('active');
      }
    });
    
  });
});

// Escucha el evento submit del formulario y obtiene los datos del formulario
document.querySelector('#transaction-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const form = e.target; // obtenemos el formulario
  const formData = new FormData(form); // obtenemos los datos del formulario

  const formObject = {};
  formData.forEach((value, key) => {
    // se agrega una propiedad al objeto formObject con los datos del formulario
    formObject[key] = value;
  });

  // se agrega la transacción a la lista de transacciones
  transactions.push({ id: getNewId(), ...formObject });
  
  // se renderizan las transacciones en el DOM
  renderTransactions();
  
  // se limpia el formulario
  form.reset();
});

// Genera un nuevo id para la transacción a partir del id más alto en la lista de transacciones
const getNewId = () => {
  // si no existe, se retorna 1
  if (transactions.length === 0) {
    return 1;
  }

  // se obtienen solo los ids de las transacciones
  const ids = transactions.map((transaction) => transaction.id);

  // se retorna el id más alto + 1
  return Math.max(...ids) + 1;
};

const deleteTransaction = (id) => {
  // se filtran las transacciones que no tengan el id a eliminar
  transactions = transactions.filter((transaction) => transaction.id !== id);

  // se renderizan las transacciones en el DOM
  renderTransactions();
}

// Renderiza las transacciones en el DOM
const renderTransactions = () => {
  // se deja un string vacio para agregar las transacciones en el DOM
  let htmlBlock = '';

  // se suman las transacciones con respecto a su tipo
  const incomes = transactions
    .filter((transaction) => transaction.transactionType === '1')
    .reduce((acc, transaction) => acc + (+transaction.amount), 0);

  const revenues = transactions
    .filter((transaction) => transaction.transactionType === '2')
    .reduce((acc, transaction) => acc + (+transaction.amount), 0);

  const balance = incomes - revenues;

  incomeCounterSpan.textContent = `$${incomes.toFixed(2)}`;
  revenueCounterSpan.textContent = `$${revenues.toFixed(2)}`;
  balanceCounterSpan.textContent = `$${balance.toFixed(2)}`;

  if (balance < 0) {
    balanceCounterSpan.classList.add('text-danger');
  } else {
    balanceCounterSpan.classList.remove('text-danger');
  }

  // se recorren las transacciones
  transactions.forEach((transaction) => {
    if (transaction.transactionType !== transactionType) {
      return;
    }

    const sign = transaction.transactionType === '1' ? '+' : '-';
    const amount = (+transaction.amount).toFixed(2);
    const expensePercentage = Math.round(((+transaction.amount) * 100) / incomes);

    htmlBlock += `
      <div class="transaction-item">
        <h2 class="text-system-color">${transaction.description}</h2>
        <div class="transaction-item-control d-flex gap-2 align-items-center">
          <span class="text-system-color text-">${sign} $${amount}</span>
          ${transaction.transactionType === '2' ? `<div id="percentage-container">${expensePercentage}%</div>` : ''}
          <button class="btn btn-danger btn-sm" type="button" onclick="deleteTransaction(${transaction.id})">X</button>
        </div>
      </div>
    `;
  });

  // se agrega el HTML generado al contenedor de transacciones
  transactionsContainer.innerHTML = htmlBlock;
};

const toTitlecase = (str) => {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
};