const Modal = {
   // toogle()
    open() {
       // Abrir modal
       // Adicionar a classe active ao modal
       // seletor css
       document.querySelector('.modal-overlay').classList.add('active');

    },
    close() {
       // fehcar o modal
       // remover a class active do modal
       document.querySelector('.modal-overlay').classList.remove('active');
    }
 }

const Storage = {
   get() {
      // vai transaformar de string para array ou objeto
      return JSON.parse(localStorage.getItem('dev.finances:transaction')) || [];
   },
   set(transactions) {
      // JSON é um objeto
      localStorage.setItem("dev.finances:transaction", JSON.stringify(transactions));
   }
}

const Transaction = {
   all: Storage.get(),

   add(transaction) {
      Transaction.all.push(transaction);

      App.reload();
   },
   remove(index) {
      Transaction.all.splice(index, 1);

      App.reload();
   },
   incomes() {
      let income = 0;
      // somar as entradas
      // pegar todas as transações 
      // para cada transação
      Transaction.all.forEach(transaction => {
         // se ela for maior que zero
         if (transaction.amount > 0) {
            // somar a uma variável e retornar a variável
            income += transaction.amount;
         }
      })
      return income;
   },
   expenses() {
      // somar as saídas
      let expense = 0;
      // somar as entradas
      // pegar todas as transações 
      // para cada transação
      Transaction.all.forEach(transaction => {
         // se ela for menor que zero
         if (transaction.amount < 0) {
            // somar a uma variável e retornar a variável
            expense += transaction.amount;
         }
      })
      return expense;
   },
   total() {
      // entradas - saídas

      return Transaction.incomes() + Transaction.expenses();
   }
}

// Substituir os dados do HTML com os dados do JS

const DOM = {
   transactionsContainer: document.querySelector('#data-table tbody'),
   addTransaction(transaction, index) {
      const tr = document.createElement('tr');
      // serve para mostra os valores
      // mas nesse caso ele vai receber um html
      tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
      tr.dataset.index = index;

      // appendChild - pega o HTML criado no JS e lança no HTML
      DOM.transactionsContainer.appendChild(tr);
   },
   innerHTMLTransaction(transaction, index) {
      const CSSclass = transaction.amount > 0 ? "income" : "expense";

      const amount = Utils.formatCurrency(transaction.amount);

      const html = `
         <td class="description">${transaction.description}</td>
         <td class="${CSSclass}">${amount}</td>
         <td class="date">${transaction.date}</td>
         <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação" title="Remover transação">
         </td>
      `

      return html;
   },
   updateBalance() {
      document.getElementById('incomeDisplay').innerHTML = 
      Utils.formatCurrency(Transaction.incomes()),
      document.getElementById('expenseDisplay').innerHTML = 
      Utils.formatCurrency(Transaction.expenses()),
      document.getElementById('totalDisplay').innerHTML = 
      Utils.formatCurrency(Transaction.total())
   },
   clearTransactions() {
      DOM.transactionsContainer.innerHTML = "";
   }
}

const Utils = {
   formatAmount(value) {
      value = Number(value) * 100;

      return value;
   },
   formatDate(date) {
      // split() separar
      const splittedDate = date.split("-");
      return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
   },
   formatCurrency(value) {
      const signal = Number(value) < 0 ? "-" : "";

      value = String(value).replace(/\D/g , "");

      value = Number(value) / 100;
      // Qual local do mundo você está, em outras palavras o tipo de dinheiro
      value = value.toLocaleString("pt-BR", {
         style: "currency",
         currency: "BRL"
      });

      return signal + value;

   }
}



const Form = {
   description: document.querySelector('input#description'),
   amount: document.querySelector('input#amount'),
   date: document.querySelector('input#date'),

   getValues() {
      return {
         description: Form.description.value,
         amount: Form.amount.value,
         date: Form.date.value
      }
   },
   validateFields() {
      // uma desestruturação - pega os valores, acessa o Form e depois o metodo
      // pegando seus respectivos valores
      const { description, amount, date } = Form.getValues();
      // trim() serve para fazer uma limpeza dos espaços vázios na string
      if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
         throw new Error("Por favor, preencha todos os campos");
      }
   },
   formatValues() {
      let { description, amount, date } = Form.getValues();
      amount = Utils.formatAmount(amount);
      date = Utils.formatDate(date);

      return {
         description,
         amount,
         date
      }
   },
   saveTransaction(transaction) {
      Transaction.add(transaction)
   },
   clearFields() {
      Form.description.value = "";
      Form.amount.value = "";
      Form.date.value = "";
   },
   submit(event) {
      // Não fazer o envio para a URL dos dados
      event.preventDefault();

      try {
         // verificar se todas as informações foram preenchidas
         Form.validateFields();
         // formatar os dados para salvar
         const transaction = Form.formatValues();
         // salvar
         Form.saveTransaction(transaction)
         // apagar os dados do formulário
         Form.clearFields()
         // modal feche
         Modal.close()
         // atualizar a aplicação
      } catch (error) {
         alert(error.message);
      }
      
   }
}

const App = {
   init() {
      // para cada transação
      // Atualiza na DOM
      Transaction.all.forEach(DOM.addTransaction);

      DOM.updateBalance();

      Storage.set(Transaction.all);
   },
   reload() {
      DOM.clearTransactions();
      App.init();
   }
}

// Iniciou
App.init();


/*  [
      {
         description: 'Luz',
         amount: -50000,
         date: '23/01/2021'
      },
      {
         description: 'WebSite',
         amount: 500000,
         date: '23/01/2021'
      },
      {
         description: 'Internet',
         amount: -20000,
         date: '23/01/2021'
      },     
      {
         description: 'App',
         amount: 300000,
         date: '23/01/2021'
      }    
   ], */