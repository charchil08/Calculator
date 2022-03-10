import { useReducer } from 'react'
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './style.css';

export const ACTIONS = {
  'ADD_DIGIT': 'add-digit',
  'CHOOSE_OPERATION': 'choose-operation',
  'DELETE_DIGIT': 'delete-digit',
  'CLEAR': 'clear',
  'EVALUATE': 'evaluate'
}

const evaluate = ({ prevOperand, currentOperand, operation }) => {
  const value_1 = +prevOperand
  const value_2 = +currentOperand
  if (isNaN(value_1) || isNaN(value_2)) {
    return ""
  }
  let result = "";
  switch (operation) {
    case "+":
      result = value_1 + value_2
      break
    case "-":
      result = value_1 - value_2
      break
    case "*":
      result = value_1 * value_2
      break
    case "÷":
      result = value_1 / value_2
      break
    default:
      result = ""
  }
  return result.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", { 
  maximumFractionDigits : 0
})

const formatter = (operand) => {
  if(operand == null || operand.length===0) return
  const [integer,decimal] = operand.split(".")
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: `${payload.digit}`,
          overwrite: false
        }
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.prevOperand == null) {
        return state
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }

      }
      if (state.prevOperand == null) {
        return {
          ...state,
          prevOperand: state.currentOperand,
          currentOperand: null,
          operation: payload.operation
        }
      }
      return {
        ...state,
        prevOperand: evaluate(state),
        currentOperand: null,
        operation: payload.operation
      }
    case ACTIONS.CLEAR:
      return {
        prevOperand: null,
        currentOperand: null,
        operation: ''
      }
    case ACTIONS.EVALUATE:
      if (state.operation == null || state.prevOperand == null || state.currentOperand == null) {
        return state
      }
      return {
        ...state,
        currentOperand: evaluate(state),
        prevOperand: null,
        operation: null,
        overwrite: true
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand:null
        }
      }
      return {
        ...state,
        currentOperand:state.currentOperand.slice(0,-1)
      }
    default:
      return state
  }
}

function App() {
  const initState = {
    prevOperand: null,
    currentOperand: null,
    operation: '',
    overwrite: false
  }

  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <>
      <div className="calculator-grid">
        <div className="output">
          <div className="prev-operand">{formatter(state.prevOperand)} {state.operation}</div>
          <div className="cur-operand">{formatter(state.currentOperand)}</div>
        </div>
        <button className='span-two' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton dispatch={dispatch} operation="&#247;" />
        <DigitButton dispatch={dispatch} digit="1" />
        <DigitButton dispatch={dispatch} digit="2" />
        <DigitButton dispatch={dispatch} digit="3" />
        <OperationButton dispatch={dispatch} operation="*" />
        <DigitButton dispatch={dispatch} digit="4" />
        <DigitButton dispatch={dispatch} digit="5" />
        <DigitButton dispatch={dispatch} digit="6" />
        <OperationButton dispatch={dispatch} operation="+" />
        <DigitButton dispatch={dispatch} digit="7" />
        <DigitButton dispatch={dispatch} digit="8" />
        <DigitButton dispatch={dispatch} digit="9" />
        <OperationButton dispatch={dispatch} operation="-" />
        <DigitButton dispatch={dispatch} digit="." />
        <DigitButton dispatch={dispatch} digit="0" />

        <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>
    </>
  );
}

export default App;
