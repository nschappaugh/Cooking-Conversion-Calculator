/* <!-- Nicolas Schappaugh 12-12-2022 --> */

import React, { useState, useEffect} from "react";

// All of these components are very simple mostly just controling how elements display on the page.
// Everything important is on this converter component/container. The only exception is the PrintOutList, which has a small amount of code and is the only class component.
import ConverterWrapper from "../../components/ConverterWrapper";
import InputScreen from "../../components/InputScreen";
import PrintOutList from "../../components/PrintOutList";
import ButtonContainer from "../../components/ButtonContainer";
import Button from "../../components/Button";

// Imports a library that allows for conversions between a variety of measurements. *Source: https://github.com/convert-units/convert-units *Additional source: https://www.npmjs.com/package/convert-units
let convert = require('convert-units')

// These variables create arrays that are used further down to create the buttons the app relies on.
const inputList = [
  ["source amount", "source unit", "target unit", "ingredients"],
];

const numberList = [
  [7, 8, 9,],
  [4, 5, 6,],
  [1, 2, 3,],
  [0, ".",],
];

const unitList = [
  ["tsp", "Tbs", "fl-oz", "cup"],
  ["ml", "l"],
  ["oz", "lb"],
  ["mg", "g", "kg"],
];

const ingredientList = [
  ["flour", "black pepper", "sugar", "cane sugar", "salt", "sea salt", "water", "honey", "cooking oil", "olive oil", "vegetable oil"],
];

const utilityList = [
  ["clear", "reset", "print", "="],
];

// The Converter has been designed in such a way that new buttons can be added or removed by adjusting the arrays above. Any new buttons should function properly assuming the conversion library and spoonacular api can handle the inputs.
const Converter = () => {
  // This state controls the various inputs the user can enter for their calculations.
  const [input, setInput] = useState({
    selectedInput: "",
    sourceAmount: 0,
    sourceUnit: '',
    ingredientName: '',
    targetUnit: ''
  });

  // This state controls the various outputs that can result from the converter calculations.
  const [output, setOutput] = useState({
    solution: '',
    printData: '',
    printOut: []
  });

  // This variable contains the information that is displayed to the user on the screen and printOut.
  const displayValue = `${input.sourceAmount}${input.sourceUnit}  ${input.ingredientName} to ${input.targetUnit} = ${output.solution}`;

  // Most of the following functions have a common theme in that they activate when a designated button is clicked.
  // The input and comma functions update the input state based on which button is clicked. They are only clickable when a specific input selection is active.
  const handleInputSelection = (e) => {
    const value = e.target.innerHTML;

    setInput({
      ...input,
      selectedInput: value
    });
  };

  const handleNumInput = (e) => {
    const value = e.target.innerHTML;
    if (input.selectedInput === "source amount") {
      if (input.sourceAmount === 0) {
        setInput({
          ...input,
          sourceAmount: Number(value)
        });
      } else {
        setInput({
          ...input,
          sourceAmount: Number(input.sourceAmount + value)
        });
      }
    }
  };

  const handleComma = (e) => {
    const value = e.target.innerHTML;
    if (input.selectedInput === "source amount") {
      if (!input.sourceAmount.toString().includes(".")) {
        setInput({
          ...input,
          sourceAmount: input.sourceAmount + value
        });
      }
    }
  };

  const handleConversionInput = (e) => {
    const value = e.target.innerHTML;
    if (input.selectedInput === "source unit") {
      setInput({
        ...input,
        sourceUnit: value
      });
    } else if (input.selectedInput === "target unit") {
      setInput({
        ...input,
        targetUnit: value
      });
    }
  };

  const handleIngredientInput = (e) => {
    const value = e.target.innerHTML;
    if (input.selectedInput === "ingredients") {
      setInput({
        ...input,
        ingredientName: value
      });
    }
  };


  // This function handles the conversion of inputs into an ouputed solution. This is done with the help of the spoonacular API and the convert-units NPM library.
  //*API source: https://spoonacular.com/food-api
  //*Library source: https://github.com/convert-units/convert-units
  const handleConversionCalc = () => {
    if (input.sourceUnit !== '' && input.targetUnit !== '' && input.ingredientName !== '') {
      fetch(
        `https://api.spoonacular.com/recipes/convert?apiKey=52ab263f7d7b4539a15fae08d79ed348&ingredientName=${input.ingredientName}&sourceAmount=${input.sourceAmount}&sourceUnit=${input.sourceUnit}&targetUnit=${input.targetUnit}`
      )
      .then((response) => response.json())
      .then((data) => {
        return setOutput({
          ...output,
          solution: data.answer,
        });
      })
      .catch(() => {
        console.log("error");
      });

    } else if (input.sourceUnit !== '') {
      let validity = convert().from(input.sourceUnit).possibilities();

      if (validity.includes(input.targetUnit)) {
        let calc = convert(input.sourceAmount).from(input.sourceUnit).to(input.targetUnit);

        return setOutput({
          ...output,
          solution: calc.toFixed(2) + input.targetUnit,
        });

      } else {
        return setOutput({
          ...output,
          solution: "Error: invalid combination"
        });
      }
    }
  };

  // This function clears the current input based on which input the user is on. For example if on source amount it will only clear the number on the screen. Not any of the weights or ingredients. It also clears the output if applicable.
  const handleClear= () => {
    if (output.solution !== '') {
      setOutput({
        ...output,
        solution: ''
      });
    } else {
      switch (input.selectedInput) {
        case "source amount":
          setInput({
            ...input,
            sourceAmount: 0
          });
          break;
        case "source unit":
          setInput({
            ...input,
            sourceUnit: ''
          });
          break;
        case "target unit":
          setInput({
            ...input,
            targetUnit: ''
          });
          break;
        case "ingredients":
          setInput({
            ...input,
            ingredientName: ''
          });
          break;
      };
    }
  };

  // This function just resets everything except the printout when activated.
  const handleReset = () => {
    setInput({
      ...input,
      sourceAmount: 0,
      sourceUnit: '',
      ingredientName: '',
      targetUnit: '',
    });

    setOutput({
      ...output,
      solution: '',
      printData: ''
    });
  };

  // This function prints out the current output below the calculator. This allows the user to keep track of their conversions.
  const handlePrint = () => {
    if (output.solution !== '' && output.solution !== "Error: invalid combination") {
      return setOutput({
        ...output,
        printData: displayValue,
        printOut: [...output.printOut, output.printData]
      });
    };
  };


  // This function changes classes to indicate which buttons are clickable at any given time.
  const handleClassChange = () => {
    let activatedInputs = '';
    let deactivedInputs = '';

    switch (input.selectedInput) {
      case "source amount":
        activatedInputs = document.querySelectorAll(".numberBtns");
        deactivedInputs = document.querySelectorAll(".unitBtns, .ingredientBtns");

        activatedInputs.forEach(activatedInput => {
          activatedInput.classList.add("--active");
        });

        deactivedInputs.forEach(deactivedInput => {
          deactivedInput.classList.remove("--active");
        });
        break;
      case "source unit":
        activatedInputs = document.querySelectorAll(".unitBtns");
        deactivedInputs = document.querySelectorAll(".numberBtns, .ingredientBtns");

        activatedInputs.forEach(activatedInput => {
          activatedInput.classList.add("--active");
        });

        deactivedInputs.forEach(deactivedInput => {
          deactivedInput.classList.remove("--active");
        });
        break;
      case "target unit":
        activatedInputs = document.querySelectorAll(".unitBtns");
        deactivedInputs = document.querySelectorAll(".numberBtns, .ingredientBtns");

        activatedInputs.forEach(activatedInput => {
          activatedInput.classList.add("--active");
        });

        deactivedInputs.forEach(deactivedInput => {
          deactivedInput.classList.remove("--active");
        });
        break;
      case "ingredients":
        activatedInputs = document.querySelectorAll(".ingredientBtns");
        deactivedInputs = document.querySelectorAll(".unitBtns, .numberBtns");

        activatedInputs.forEach(activatedInput => {
          activatedInput.classList.add("--active");
        });

        deactivedInputs.forEach(deactivedInput => {
          deactivedInput.classList.remove("--active");
        });
        break;
    };
  };

  // This function is a utility for use in other functions. It finds a selected button and returns it so the button may be modified.
  function findButton(text) {
    const elements = Array.from(document.querySelectorAll('button'));

    const match = elements.find(el => {
      return el.textContent.includes(text);
    });

    return match;
  };

  const onPrintDataChange = () => {
    const btn = findButton('print')

    if (output.solution !== '' && output.solution !== "Error: invalid combination") {
      btn.classList.add('--active')
    } else {
      btn.classList.remove('--active')
    }
  };


  //The useEffect hook allows the app to update things after render. In this case the app can dynamically update classes and display content without delay.
  useEffect(() => {
    handleClassChange();
    onPrintDataChange();
  });

  // Below is the display for the app. It is all contained within a wrapper. The screen shows the user their inputs and resulting solutions. The ButtonContainer contains the buttons. All of the buttons are created according to the arrays at the top with specific properties. Finally the PrintOutList is at the bottom.

  // Each "List" below serves as the origin for a specific set of buttons. The properties of these buttons are then determined by the button component properties.
  return (
    <ConverterWrapper>
      <InputScreen value={displayValue}/>
      <ButtonContainer>
        {inputList.flat().map((btn, i) => {
          return (
            <Button
              key={i}
              className={"inputSelectorBtns, --active"}
              value={btn}
              onClick={handleInputSelection}
            />
          );
        })}
        {numberList.flat().map((btn, i) => {
          return (
            <Button
              key={i}
              className={"numberBtns"}
              value={btn}
              onClick={
                btn === "."
                  ? handleComma
                  : handleNumInput
              }
            />
          );
        })}
        {unitList.flat().map((btn, i) => {
          return (
            <Button
              key={i}
              className={"unitBtns"}
              value={btn}
              onClick={handleConversionInput}
            />
          );
        })}
        {ingredientList.flat().map((btn, i) => {
          return (
            <Button
              key={i}
              className={"ingredientBtns"}
              value={btn}
              onClick={handleIngredientInput}
            />
          );
        })}
        {utilityList.flat().map((btn, i) => {
          return (
            <Button
            key={i}
            className={
              btn === "="
                ? "equals"
                : btn === "print"
                ? ""
                : "--active"
            }
            value={btn}
            onClick={
              btn === "reset"
                ? handleReset
                : btn === "clear"
                ? handleClear
                : btn === "print"
                ? handlePrint
                : handleConversionCalc
            }
            />
          );
        })}
      </ButtonContainer>
      <PrintOutList data={output.printOut} />
    </ConverterWrapper>
  );
};

export default Converter;
