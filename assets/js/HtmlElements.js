"use strict";

class HtmlElements {
    constructor() {

    }

    static GET_BODY() {
        return document.querySelectorAll("body")[0];
    }
    
    static GET_INSTANCE() {
        let htmlElements = new HtmlElements();
        return htmlElements;
    }
}

HtmlElements.MOUSE_MOVE_EVENT = null;