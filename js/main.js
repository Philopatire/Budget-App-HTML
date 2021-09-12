var elements = {
  budgetInput: document.getElementById("budgetInput"),
  budgetSubmit: document.getElementById("budgetSubmit"),
  budgetOutput: document.getElementById("budgetOutput"),
  expenseOutput: document.getElementById("expenseOutput"),
  balanceOutput: document.getElementById("balanceOutput"),
  expenseNameInput: document.getElementById("expenseNameInput"),
  expenseInput: document.getElementById("expenseInput"),
  expenseSumbit: document.getElementById("expenseSubmit"),
  expensesDivOutput: document.getElementById("expenseOutputDiv"),
  expensesName: document.querySelectorAll(".expense-name"),
  expensesValue: document.querySelectorAll(".expense-value"),
  editExpenseBtns: document.querySelectorAll(".editExpense"),
  deleteExpenseBtns: document.querySelectorAll(".deleteExpense"),
  getTotalExpenses() {
    return Expense.getFromLocal().reduce(
      (acc, value) => ((acc += Number(value.expenseValue)), acc),
      0
    );
  },
  toDOM() {
    this.expenseOutput.textContent = this.getTotalExpenses();
    this.budgetOutput.textContent = localStorage.getItem("balance") || 0;
    if (
      Number(budgetOutput.textContent) -
      Number(this.expenseOutput.textContent) >=
      0
    ) {
      this.balanceOutput.textContent =
        Number(this.budgetOutput.textContent) -
        Number(expenseOutput.textContent);
      this.balanceOutput.style.color = "";
    } else {
      this.balanceOutput.style.color = "var(--red)";
      this.balanceOutput.textContent =
        Number(this.budgetOutput.textContent) -
        Number(expenseOutput.textContent);
    }
    this.expensesName = document.querySelectorAll(".expense-name");
    this.expensesValue = document.querySelectorAll(".expense-value");
    this.editExpenseBtns = document.querySelectorAll(".edit-expense");
    this.deleteExpenseBtns = document.querySelectorAll(".delete-expense");
    this.budgetSubmit.onclick = () => {
      let error = document.querySelector(".budget-box > .error");
      let myBudget = new Budget(this.budgetInput.value);
      if (myBudget.check()) {
        myBudget.sendToLocal();
        error.classList.remove("active");
      } else {
        error.classList.add("active");
      }
      this.toDOM();
    };
    this.expenseSumbit.onclick = () => {
      let myExpense = new Expense(
        this.expenseNameInput.value,
        this.expenseInput.value
      );
      let error = document.querySelector(".expense-box > .error");
      if (myExpense.check()) {
        myExpense.sendToLocal();
        myExpense.pushExpense();
        error.classList.remove("active");
      } else {
        error.classList.add("active");
      }
      this.toDOM();
    };
    this.deleteExpenseBtns.forEach((btn, i) => {
      btn.onclick = () => {
        let myExpense = new Expense(
          this.expensesName[i].textContent,
          this.expensesValue[i].textContent
        );
        myExpense.deleteLocal();
        btn.parentElement.parentElement.remove();
        this.toDOM();
      };
    });
    this.editExpenseBtns.forEach((btn, i) => {
      btn.onclick = () => {
        let myExpense = new Expense(
          this.expensesName[i].textContent,
          this.expensesValue[i].textContent
        );
        myExpense.deleteLocal();
        btn.parentElement.parentElement.remove();
        this.expenseNameInput.value = this.expensesName[i].textContent;
        this.expenseInput.value = this.expensesValue[i].textContent;
        this.toDOM();
      };
    });
  },
};
class Expense {
  static getFromLocal() {
    return Object.keys(localStorage)
      .filter((el) => el != "balance")
      .map((key) => JSON.parse(key));
  }
  constructor(name, value) {
    this.expenseName = name;
    this.expenseValue = value;
  }
  sendToLocal() {
    localStorage.setItem(
      JSON.stringify({
        expenseName: this.expenseName,
        expenseValue: this.expenseValue,
      }),
      ""
    );
    return true;
  }
  deleteLocal() {
    let response = false;
    Expense.getFromLocal().forEach((o) => {
      if (
        o.expenseName == this.expenseName &&
        o.expenseValue == this.expenseValue
      ) {
        localStorage.removeItem(JSON.stringify(o));
        response = true;
      }
    });
    return response;
  }
  editLocal() {
    let response = false;
    Expense.getFromLocal().forEach((o) => {
      localStorage.removeItem(JSON.stringify(o));
      o.expenseName = this.expenseName;
      o.expenseValue = this.expenseValue;
      localStorage.setItem(JSON.stringify(o), "");
      response = true;
    });
    return response;
  }
  pushExpense() {
    let row = document.createElement("div");
    row.classList.add("row");
    row.innerHTML = `
      <span class="expense-name">${this.expenseName}</span>
      <span class="expense-value">${this.expenseValue}</span>
      <span>
      <button class="edit-expense"><i class="fas fa-edit"></i></button>
      <button class="delete-expense"><i class="fas fa-trash"></i></button>
      </span>`;
    elements.expensesDivOutput.appendChild(row);
  }
  check() {
    let response = true;
    if (this.expenseValue < 0 || this.expenseValue == "") response = false;
    return response;
  }
}
class Budget {
  constructor(value) {
    this.budgetValue = value;
  }
  sendToLocal() {
    localStorage.setItem("balance", this.budgetValue);
    return true;
  }
  check() {
    let response = true;
    if (this.budgetValue < 0 || this.budgetValue == "") response = false;
    return response;
  }
}
window.onload = () => {
  Expense.getFromLocal().forEach((o) => {
    let myExpense = new Expense(o.expenseName, o.expenseValue);
    myExpense.pushExpense();
    elements.toDOM();
  });
  elements.toDOM();
};
