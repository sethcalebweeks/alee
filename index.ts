const infix = "1 + ( 2 + ( 2 * 3 ) )"
const rpn = "1 2 + 3 *"

// 1, [1 :: Number]
// +, [<+> :: Number -> Number]
// (, [<id> :: T -> T, <+> :: Number -> Number]
// 2, [2 :: Number, <+> :: Number -> Number]
// *, [<*> :: Number -> Number, <+> :: Number -> Number]
// 3, [6 :: Number, <+> :: Number -> Number]
// ), [7 :: Number]

const tokenize = (str: string) => str.split(" ")

const evaluateRPN = (tokens: string[]) => tokens.reduce((stack, token) => {
    switch (token) {
      case "(":
        stack.unshift({value: (x) => x, type: "Number -> Number"})
        break;
      case ")":
        let top = stack.shift()
        stack.unshift({value: stack.shift().value(top.value), type: "Number"})
        break;
      case "+":
        if (stack[0]?.type === "Number" && stack[1]?.type === "Number") {
          stack.unshift({value: stack.shift().value + stack.shift().value, type: "Number"})
        } else if (stack[0]?.type === "Number" && stack[1]?.type !== "Number") {
          const pop = stack.shift().value
          stack.unshift({value: (x) => pop + x, type: "Number -> Number"})
        }         
        break;
      case "*":
        if (stack[0]?.type === "Number" && stack[1]?.type === "Number") {
          stack.unshift({value: stack.shift().value * stack.shift().value, type: "Number"})
        } else if (stack[0]?.type === "Number" || stack[1]?.type !== "Number") {
          const pop = stack.shift().value
          stack.unshift({value: (x) => pop * x, type: "Number -> Number"})
        }
        break;
      default:
        if (stack[0]?.type === "Number -> Number") {
          stack.unshift({value: stack.shift().value(parseInt(token)), type: "Number"})
        } else {
          stack.unshift({value: parseInt(token), type: "Number"})
        }
    }
    return stack
  }, [])

console.log(evaluateRPN(tokenize(infix))?.pop()?.value)
// 1 :: Number
// + :: Number -> Number -> Number