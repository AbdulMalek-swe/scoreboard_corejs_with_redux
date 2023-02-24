const incrementELe = document.querySelector('.lws-increment');
const decrementELe = document.querySelector('.lws-decrement');
const resultEle = document.querySelector('.lws-singleResult')
const INCREMENT = "increment";
const DECREMENT = "decrement";
const  REFRESH = 'refresh'
const increment = (value) => {
    return {
        type: INCREMENT,
        payload: value,
    };
};
const decrement = (value) => {
    return {
        type: DECREMENT,
        payload: value,
    };
};
const refresh = (value) => {
    return {
        type: REFRESH,
        payload: {},
    };
};
const initialState = {
    totalResult: []
}
function scoreReducer(state = initialState, action) {
    const searcMatch = state.totalResult.find(item => item.matchNo === action.payload.matchNo)
    if (action.type === INCREMENT) {
        const totalMatch = state.totalResult.filter(item => item.matchNo !== action.payload.matchNo)    
        if(searcMatch?.matchNo) {
            const result = searcMatch.score + action.payload.value;
             searcMatch.score = result;
            return {
               ...state,
               totalResult:[...totalMatch,searcMatch]
            }
        }
        const result = action.payload.score + action.payload.value;
        action.payload.score = result;
        return {
            ...state,
            totalResult: [...state.totalResult, action.payload]
        };
    } else if (action.type === DECREMENT) {
        const totalMatch = state.totalResult.filter(item => item.matchNo !== action.payload.matchNo)     
        if(searcMatch?.matchNo) {
            const result = searcMatch.score - action.payload.value;
            if(result<0){
                alert("warning!! negetive score not possible")
                return state
            }
             searcMatch.score = result;
            return {
               ...state,
               totalResult:[...totalMatch,searcMatch]
            }
        }
        const result = action.payload.score - action.payload.value;
        if(result<0){
            alert("warning!! negetive score not possible")
            return state
        }
        action.payload.score = result;
        return {
            ...state,
            totalResult: [...state.totalResult, action.payload]
        };
    } else if(action.type ===  REFRESH){
        for (let i = 0; i < state?.totalResult?.length; i++) {
             state.totalResult[i].score = 00;
          }
          console.log(state);
        return state;
    }
    else{
        return state;
    }
}
const store = Redux.createStore(scoreReducer);
let state;
const render = (t) => {
      state = store.getState();
  let totalMatchResult = document.querySelectorAll('.lws-singleResult');
    const finds = state.totalResult.find(item=>item.matchNo===t)
      let index = Number(finds?.matchNo);
      for(let i=0;i<totalMatchResult.length;i++){
        // totalMatchResult[index].innerText = 12
        if(index-1===i){
            totalMatchResult[i].innerText =  finds?.score;
        }
      }
};
render();
store.subscribe(render);
const matchContainerEle = document.querySelector('.all-matches');
const addtn = document.querySelector('.lws-addMatch');
let i = 1;
let matches = [{ matchNo: 1, score: 00 }]
addtn.addEventListener('click', (e) => {
    let lengths = matches.length;
    matches.push({ matchNo: Number(lengths + 1), score: 00 })
    i++;
    const initialStates = [];
    const matchDiv = document.createElement('div');
    matchDiv.classList.add('match');
    matchDiv.innerHTML = ''
    for (let i = 0; i <= matches.length; i++) {
        matchDiv.innerHTML = `
        <div class="wrapper">
                    <button class="lws-delete">
                        <img src="./image/delete.svg" alt="" />
                    </button>
                    <h3 class="lws-matchName">Match ${matches.length}</h3>
                </div>
                <div class="inc-dec">
                    <form class="incrementForm">
                        <h4>Increment</h4>
                        <input type="number" name="increment" class="lws-increment" />
                    </form>
                    <form class="decrementForm" action="">
                        <h4>Decrement</h4>
                        <input type="number" name="decrement" class="lws-decrement" />
                    </form>
                </div>
                <div class="numbers">
                    <h2 class="lws-singleResult">00</h2>
                </div>
        
        `
        matchContainerEle.appendChild(matchDiv)
    }
    formFunction()
})
function formFunction() {
    const incformElements = document.querySelectorAll('.incrementForm');
    incformElements.forEach((formElement, index) => {
        formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            const inputElement = formElement.querySelector('input');
            const value = Number(inputElement.value);
            if(value<0){
                alert("give me positive number")
                return ;
            }
            const find = matches.find(item => item.matchNo === index + 1);
            store.dispatch(increment({ ...find, value }));
            render(find?.matchNo)
            inputElement.value = ""
        })
    })
    const decformElements = document.querySelectorAll('.decrementForm');
    decformElements.forEach((formElement, index) => {
        formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            const inputElement = formElement.querySelector('input');
            const value = Number(inputElement.value)
            if(value<0){
                alert("give me positive number")
                return ;
            }
            const find = matches.find(item => item.matchNo === index + 1);
            store.dispatch(decrement({ ...find, value }));
            render(find?.matchNo)
            inputElement.value = ""
        })
    })
}
formFunction();
 const refreshAll = document.getElementById('lws-reset');
 refreshAll.addEventListener('click', (event) =>{
    store.dispatch(refresh());
    let totalMatchResult = document.querySelectorAll('.lws-singleResult');
    for(let i=0;i<totalMatchResult.length;i++){
        totalMatchResult[i].innerText = '00';
    }
 })
 