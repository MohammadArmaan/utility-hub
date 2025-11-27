import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let newValue = currentValue;

      switch (operation) {
        case "+":
          newValue = currentValue + inputValue;
          break;
        case "-":
          newValue = currentValue - inputValue;
          break;
        case "×":
        case "*":
          newValue = currentValue * inputValue;
          break;
        case "÷":
        case "/":
          newValue = currentValue / inputValue;
          break;
        case "%":
          newValue = currentValue % inputValue;
          break;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      
      if (e.key >= "0" && e.key <= "9") {
        inputDigit(e.key);
      } else if (e.key === ".") {
        inputDecimal();
      } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
        const opMap: { [key: string]: string } = {
          "+": "+",
          "-": "-",
          "*": "×",
          "/": "÷"
        };
        performOperation(opMap[e.key]);
      } else if (e.key === "Enter" || e.key === "=") {
        performOperation("=");
      } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
        clear();
      } else if (e.key === "%") {
        performOperation("%");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [display, previousValue, operation, waitingForOperand]);

  const buttonClass =
    "h-16 text-lg font-semibold transition-all hover:scale-105 active:scale-95";
  const numberButtonClass = `${buttonClass} bg-muted hover:bg-muted/80 text-white`;
  const operationButtonClass = `${buttonClass} bg-primary hover:bg-primary/90 text-primary-foreground`;
  const equalsButtonClass = `${buttonClass} bg-accent hover:bg-accent/90 text-accent-foreground`;

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-lg p-6 min-h-[80px] flex items-center justify-end">
        <div className="text-4xl font-bold text-foreground break-all text-right">
          {display}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Button onClick={clear} className={operationButtonClass}>
          C
        </Button>
        <Button onClick={() => performOperation("%")} className={operationButtonClass}>
          %
        </Button>
        <Button
          onClick={() => {
            setDisplay(String(parseFloat(display) * -1));
          }}
          className={operationButtonClass}
        >
          +/-
        </Button>
        <Button onClick={() => performOperation("÷")} className={operationButtonClass}>
          ÷
        </Button>

        <Button onClick={() => inputDigit("7")} className={numberButtonClass}>
          7
        </Button>
        <Button onClick={() => inputDigit("8")} className={numberButtonClass}>
          8
        </Button>
        <Button onClick={() => inputDigit("9")} className={numberButtonClass}>
          9
        </Button>
        <Button onClick={() => performOperation("×")} className={operationButtonClass}>
          ×
        </Button>

        <Button onClick={() => inputDigit("4")} className={numberButtonClass}>
          4
        </Button>
        <Button onClick={() => inputDigit("5")} className={numberButtonClass}>
          5
        </Button>
        <Button onClick={() => inputDigit("6")} className={numberButtonClass}>
          6
        </Button>
        <Button onClick={() => performOperation("-")} className={operationButtonClass}>
          -
        </Button>

        <Button onClick={() => inputDigit("1")} className={numberButtonClass}>
          1
        </Button>
        <Button onClick={() => inputDigit("2")} className={numberButtonClass}>
          2
        </Button>
        <Button onClick={() => inputDigit("3")} className={numberButtonClass}>
          3
        </Button>
        <Button onClick={() => performOperation("+")} className={operationButtonClass}>
          +
        </Button>

        <Button onClick={() => inputDigit("0")} className={`${numberButtonClass} col-span-2`}>
          0
        </Button>
        <Button onClick={inputDecimal} className={numberButtonClass}>
          .
        </Button>
        <Button
          onClick={() => performOperation("=")}
          className={equalsButtonClass}
        >
          =
        </Button>
      </div>
    </div>
  );
};

export default Calculator;
