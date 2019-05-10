"use strict";

class TextBox {
    constructor(htmlElement) {
        /* Initialize data */
        this.HtmlElement = htmlElement;
        this.IsChangeAccordingToEvent = true;
        
        /* Initialize GUI */
        
        /* Initialize events */
        
        /* Initialize finally */
        
        
    }
    
    GetHtmlElement() {
        return this.HtmlElement;
    }
    
    SetText(text) {
        this.GetHtmlElement().value = text;
    }
    
    GetText() {
        return this.GetHtmlElement().value;
    }
}