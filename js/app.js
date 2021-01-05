class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.expenseAmountInput = document.getElementById("expense_amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }
  //submit budget method
  submitBudgetForm(){
     const value = this.budgetInput.value;
     if(value ==='' || value <0) {
       this.budgetFeedback.classList.add("showItem");
       this.budgetFeedback.innerHTML =`<p>value cannot be empty or negative</p>`;
       const self = this;
       setTimeout(()=>{
         self.budgetFeedback.classList.remove("showItem");
       },2000);
     }else{
       this.budgetAmount.textContent = value;
       this.budgetInput.value = '';
       this.showBalance();
     }
  }
  //show balance method
  showBalance(){
    const expense = this.totalExpense();
    const total = parseInt(this.budgetAmount.textContent) - expense;
    
    this.balanceAmount.textContent = total;
    if(total < 0){
      this.balance.classList.remove('showGreen', 'showBlack');
      this.balance.classList.add('showRed');
    }
    else if(total > 0){
      this.balance.classList.remove('showRed', 'showBlack');
      this.balance.classList.add('showGreen');
    }
    else if(total === 0){
      this.balance.classList.remove('showRed', 'showGreen');
      this.balance.classList.add('showBlack');
    }
  }
  //submit expense form
  submitExpenseForm(){
    const expenseValue = this.expenseInput.value;
    const expenseAmountValue = this.expenseAmountInput.value;
    if(expenseValue === '' || expenseAmountValue ==='' || expenseAmountValue < 0){
      this.expenseFeedback.classList.add('showItem');
      this.expenseFeedback.innerHTML = `<p>values cannot be empty or negative<p>`;
      const self = this;
      setTimeout(()=>{
        self.expenseFeedback.classList.remove('showItem');
      }, 2000)
    }
    else{
      let amount = parseInt(expenseAmountValue);
      this.expenseInput.value ='';
      this.expenseAmountInput.value='';

      let expense = {
        id:this.itemID,
        title:expenseValue,
        amount,
      }
      this,this.itemID++;
      this.itemList.push(expense);
      this.addExpense(expense);
      this.showBalance();
    }
  }
  //add expense method
  addExpense(expense){
    const div = document.createElement('div');
    div.classList.add('expense');
    div.innerHTML = `
        <div class="expense-item d-flex justify-content-between align-items-baseline">

        <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
        <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

        <div class="expense-icons list-item">

          <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
          <i class="fas fa-edit"></i>
          </a>
          <a href="#" class="delete-icon" data-id="${expense.id}">
          <i class="fas fa-trash"></i>
          </a>
        </div>
        </div>
    `;
      this.expenseList.appendChild(div);
  }

  //total expense method acc=accumulater(value from adding the amount) curr=current
  totalExpense(){
    let total = 0;
    if(this.itemList.length > 0){
      total = this.itemList.reduce((acc,curr)=>{
        //console.log(`total is ${acc} and the current value is ${curr.amount}`);
        acc += curr.amount;
        return acc;
      }, 0);
    }
    this.expenseAmount.textContent = total;
    return total;
  }
  //edit expense method
  editExpense(element){
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    //remove from dom
     this.expenseList.removeChild(parent);
     //remove from the list
     let expense = this.itemList.filter((item)=>{
       return item.id === id;
     });
     //show value
     this.expenseInput.value = expense[0].title;
     this.expenseAmountInput.value = expense[0].amount;
     //remove from list
     let tempList = this.itemList.filter((item)=>{
       return item.id !== id;
     })
     this.itemList = tempList;
     this.showBalance();
  }
  //delete expense method
  deleteExpense(element){
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    //remove from dom
     this.expenseList.removeChild(parent);
     //remove from the list
     let tempList = this.itemList.filter((item)=>{
      return item.id !== id;
    })
    this.itemList = tempList;
    this.showBalance();
  }
}


function eventListeners(){
  const budgetForm = document.getElementById('budget-form');
  const expenseForm = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');

  //new instance of UI class
  const ui = new UI()

  //budget form submit
  budgetForm.addEventListener("submit", function(event){
    event.preventDefault();
    ui.submitBudgetForm();
  });

  //expense form submit
  expenseForm.addEventListener("submit", function(event){
    event.preventDefault();
    ui.submitExpenseForm();
  });

  //expense list
  expenseList.addEventListener("click", function(event){
    if(event.target.parentElement.classList.contains('edit-icon')){
      ui.editExpense(event.target.parentElement)
    }
    else if(event.target.parentElement.classList.contains('delete-icon')){
      ui.deleteExpense(event.target.parentElement)
    }
  });
}

document.addEventListener('DOMContentLoaded', function(){
  eventListeners();
});