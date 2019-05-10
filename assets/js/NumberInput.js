"use strict";

class NumberInput {
    constructor(numberInput) {
        // Initialize Data
        this.NumberInputElement = numberInput;
        this.IsChangeAccordingToEvent = true;
        
        // Initialize GUI
        
        // Initialize Events
        this.GetStepUpButton().addEventListener("click", event => {
            let currentValue = this.GetValue();
            let min = this.GetMinValue();
            let max = this.GetMaxValue();
            let step = this.GetStep();
            let newValue = currentValue + step;
            
            if ((min <= newValue) && (max >= newValue)) {
                this.SetValue(newValue);
            }
            else if ((currentValue <= newValue) && (currentValue >= newValue)) {
                this.SetValue(currentValue);
            }
            else {
                this.SetValue(min);
            }
        });
        
        this.GetStepDownButton().addEventListener("click", event => {
            let currentValue = this.GetValue();
            let min = this.GetMinValue();
            let max = this.GetMaxValue();
            let step = this.GetStep();
            let newValue = currentValue - step;
            
            if ((min <= newValue) && (max >= newValue)) {
                this.SetValue(newValue);
            }
            else if ((currentValue <= newValue) && (currentValue >= newValue)) {
                this.SetValue(currentValue);
            }
            else {
                this.SetValue(min);
            }
        });
        
        // Initialize Finally
        NumberInput.OBJECTS.push(this);
    }
    
    GetHtmlElement() {
        return this.NumberInputElement;
    }
    
    GetMinValue() {
        return parseFloat(this.GetHtmlElement().querySelectorAll("input")[0].getAttribute("data-min"));
    }
    
    GetMaxValue() {
        return parseFloat(this.GetHtmlElement().querySelectorAll("input")[0].getAttribute("data-max"));
    }
    
    GetStep() {
        return parseFloat(this.GetHtmlElement().querySelectorAll("input")[0].getAttribute("data-step"));
    }
    
    GetValue() {
        return parseFloat(this.GetHtmlElement().querySelectorAll("input")[0].value.toString().trim());
    }
    
    GetInputElement() {
        return this.GetHtmlElement().querySelectorAll("input")[0];
    }
    
    SetValue(value) {
        let input = this.GetInputElement();
        input.value = value.toFixed(2);
        input.innerText = value;
    }
    
    GetStepUpButton() {
        return this.GetHtmlElement().querySelectorAll("a")[0];
    }
    
    GetStepDownButton() {
        return this.GetHtmlElement().querySelectorAll("a")[1];
    }
    
    static INITIALIZE_ALL() {
        this.NumberInputElements = document.querySelectorAll(".ssm-number-input");
        
        for (let i = 0; i < this.NumberInputElements.length; i++) {
            let numberInputElement = this.NumberInputElements[i];
            let numberInput = new NumberInput(numberInputElement);
        }
    }
    
    static GET_OBJECT_FROM_HTML_ELEMENT(htmlElement) {
        for (let i = 0; i < NumberInput.OBJECTS.length; i++) {
            let input = NumberInput.OBJECTS[i];
            
            if (input.GetHtmlElement() === htmlElement) {
                return input;
            }
        }
        
        return null;
    }
}

NumberInput.OBJECTS = new Array();