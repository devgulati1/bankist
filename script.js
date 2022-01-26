'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Dev Gulati',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnTestLogin=document.querySelector(".test-login-btn");



const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');




// CODE--
let  timer;

// TIMER FUNCTION-->
const startTimer=()=>{
  labelTimer.textContent="";
  let time=600;
 
 const timer=setInterval(() => {
    const min=String(Math.trunc(time/60))
    const sec=String(Math.trunc(time%60))
    labelTimer.textContent=`${min.padStart(2,"0")}:${sec.padStart(2,"0")}`
    

    if(time===0){
      clearInterval(timer)
      containerApp.style.opacity=0;
      labelWelcome.textContent=`Log in to get started`
    }
    time--;
  }, 1000);
  return timer; //so that we could use clearinterval in login check ..
}

// LOGIN CHECK
let currentAccount;
btnLogin.addEventListener("click",(e)=>{
  e.preventDefault();
currentAccount=accounts.find((acc)=>{
  return acc.username===inputLoginUsername.value;
})
console.log( currentAccount)
 if(currentAccount && currentAccount.pin===Number(inputLoginPin.value)){
  console.log("LOGIN")
  // displaying the ui !!
  labelWelcome.textContent=`Welcome back, ${currentAccount.owner.split(" ")[0]}`

  // setting opacity to 100
  containerApp.style.opacity=100;
  // first timer will not exist then it will exist.
  if(timer){
    clearInterval(timer)
  }
  timer=startTimer()
 updateUi(currentAccount);

  // clearing the input fields

  inputLoginUsername.value=inputLoginPin.value="";

 }
})
// UPDATE UI--
const updateUi=(acc)=>{
  displayMovements(acc.movements)
  calAndDisplayBalance(acc)
  calcAndDisplaySummary(acc)
}

// DISPLAY MOVEMENTS-
const displayMovements=(movements,sort=false)=>{
containerMovements.innerHTML="";
  const movs=sort?movements.slice().sort((a,b)=>{
    return a-b;
  }):movements;
 movs.forEach((move,i)=>{
   const type=move>0?"deposit":"withdrawal";

const html=` <div class="movements__row">
<div class="movements__type movements__type--${type}">${i+1} ${type}</div>

<div class="movements__value">${move}€</div>
</div>`;
containerMovements.insertAdjacentHTML('afterbegin',html)
 })
}



// FUNCTION TO CAL AND DISPLAY BALANCE--

const calAndDisplayBalance=(account)=>{
 account.balance=account.movements.reduce((acc,val)=>{
  return acc+val;
},0)
labelBalance.textContent=`${account.balance} € `
}



// FUNC TO CALC AND DISPLAY SUMMARY
const calcAndDisplaySummary=(acc)=>{
const incomes=acc.movements.filter((val)=>{
  return val>0;
}).reduce((acc,val)=>{
  return acc+val;
})
labelSumIn.textContent=`${incomes}€`

const out=acc.movements.filter((val)=>{
  return val<0;
}).reduce((acc,val)=>{
  return acc+val;
})
labelSumOut.textContent=`${Math.abs(out)}€`

const interest=acc.movements.filter((val)=>{
  return val>0;
}).map((deposit)=>{
  
  return deposit*acc.interestRate/100;
}).filter((inter,i,arr)=>{
  console.log(arr);
  return inter>=1;
})
.reduce((acc,inter)=>{
  return acc+inter;
})
labelSumInterest.textContent=`${interest}€`
}

// FUNCTION FOR CREATING USERNAMES--

const creatingUsernames=(accs)=>{
  accs.forEach((acc)=>{


  
  acc.username=acc.owner.toLowerCase().split(" ").map((name)=>{
    return name[0]
  }).join("");
  
})
}

creatingUsernames(accounts)
console.log(accounts)


// MONEY TRANSFER LOGIC HERE--
btnTransfer.addEventListener("click",(e)=>{
  e.preventDefault();
  console.log("click")
  const amount=Number(inputTransferAmount.value);
  const recepient=inputTransferTo.value;
  const recepientObj=accounts.find((acc)=>{
    return acc.username===recepient;

  })
  console.log(amount,recepientObj)
    
  // clearing input field
  inputTransferAmount.value=inputTransferTo.value="";

  // conditions--
   if(amount>0 && recepientObj && currentAccount.balance>=amount && 
     recepientObj.username!==currentAccount.username )
{
     currentAccount.movements.push(-amount)
     recepientObj.movements.push(amount)
     console.log("transfer..")
     updateUi(currentAccount);

    //  reset timer-->
    clearInterval(timer);
   timer= startTimer();
}

})
// REQUESTING A LOAN--
// loan will be given if movement>=10%amount;

btnLoan.addEventListener("click",(e)=>{
  e.preventDefault();
  const amount=Number(inputLoanAmount.value);
  if(amount>0 && currentAccount.movements.some((move)=>{
    return move>=0.1*amount;
  })){
    setTimeout(()=>{
   currentAccount.movements.push(amount);
   updateUi(currentAccount)
  },3000)
 //  reset timer-->
 clearInterval(timer);
 timer= startTimer();
}
  inputLoanAmount.value="";
})

// DELETING ACCOUNT-
btnClose.addEventListener("click",(e)=>{
  e.preventDefault();
  const closeusername=inputCloseUsername.value;
  const closepin=Number(inputClosePin.value);
  console.log(closeusername,closepin)
  if(currentAccount.username===closeusername && currentAccount.pin===closepin){

    const index=accounts.findIndex((acc)=>{
      return acc.username=closeusername;
    })
    accounts.splice(index,1)
    containerApp.style.opacity=0;
  console.log("delete")
  }
})

// SORT BUTTON
// when we want on/off we can use true/false..
let sorted=false;
btnSort.addEventListener("click",(e)=>{
  e.preventDefault();
  displayMovements(currentAccount.movements,!sorted)
  sorted=!sorted;
})

// TEST LOGIN BUTTON

btnTestLogin.addEventListener("click",(e)=>{
  e.preventDefault();
  currentAccount=account1;
  labelWelcome.textContent=`Welcome Back Dev `
  containerApp.style.opacity=100;
  updateUi(currentAccount)
  console.log("hello")
})