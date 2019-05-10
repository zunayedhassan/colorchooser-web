"use strict";

class CommonTools {
    constructor() {

    }

    static GET_BROWSER_WIDTH() {
        return window.innerWidth;
    }

    static GET_BROWSER_HEIGHT() {
        return document.documentElement.clientHeight;
    }

    static GET_HTML_ELEMENT_WIDTH(element) {
        return element.getBoundingClientRect().width;
    }

    static GET_HTML_ELEMENT_HEIGHT(element) {
        return element.getBoundingClientRect().height;
    }
    
    static GET_HTML_ELEMENT_POSITION_X(element) {
        return element.getBoundingClientRect().left;
    }
    
    static GET_HTML_ELEMENT_POSITION_Y(element) {
        return element.getBoundingClientRect().top;
    }

    static IS_MOUSE_WITHIN_THE_ELEMENT(element, mouseEvent) {
        if ((element === undefined) || (element === null) || (mouseEvent === undefined)) {
            return false;
        }

        let x           = mouseEvent.clientX;
        let y           = mouseEvent.clientY;
        let elementMinX = element.getBoundingClientRect().left;
        let elementMinY = element.getBoundingClientRect().top;
        let elementMaxX = elementMinX + element.getBoundingClientRect().width;
        let elementMaxY = elementMinY + element.getBoundingClientRect().height;

        if ((x >= elementMinX) && (x <= elementMaxX) &&
            (y >= elementMinY) && (y <= elementMaxY)) {

            return true;

        }

        return false;
    }

    static REQUEST_FULLSCREEN(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
        else if (element.mozRequestFullScreen) {        // Firefox 
            element.mozRequestFullScreen();
        }
        else if (element.webkitRequestFullscreen) {     // Chrome, Safari & Opera
            element.webkitRequestFullscreen();
        }
        else if (element.msRequestFullscreen) {         // IE/Edge
            element.msRequestFullscreen();
        }
    }

    static EXIT_FULLSCREEN() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.webkitExitFullscreen) {       // Firefox 
            document.webkitExitFullscreen();
        }
        else if (document.mozCancelFullScreen) {        // Chrome, Safari & Opera
            document.mozCancelFullScreen();
        }
        else if (document.msExitFullscreen) {           // IE/Edge
            document.msExitFullscreen();
        }
    }

    static IS_FULLSCREEN() {
        let isInFullScreen = (document.fullscreenElement && (document.fullscreenElement !== null)) ||
                             (document.webkitFullscreenElement && (document.webkitFullscreenElement !== null)) ||
                             (document.mozFullScreenElement && (document.mozFullScreenElement !== null)) ||
                             (document.msFullscreenElement && (document.msFullscreenElement !== null));

        return isInFullScreen;
    }

    static GET_RANDOM_INTEGER(min, max) {
        let random = Math.floor(Math.random() * (+max - +min)) + +min;

        return random;
    }

    static GET_DPI() {
        let dpiElement = document.querySelector("#dpi-element");
        let dpi = CommonTools.GET_HTML_ELEMENT_WIDTH(dpiElement);

        return dpi;
    }

    static GET_MM_FROM_INCH(value) {
        return value * 25.4;
    }
    
    static GET_MM_FROM_PIXEL(value) {
        return CommonTools.GET_MM_FROM_INCH((1.0 / CommonTools.GET_DPI()) * value);
    }
    
    static GET_PIXEL_FROM_MM(value) {
        return (CommonTools.GET_DPI() / 25.4) * value;
    }
    
    static GET_RADIAN_FROM_DEGREE(angle) {
        let angleInRadian = (Math.PI / 180.0) * angle;
        return angleInRadian;
    }
    
    static GET_UUID(){
        var dt = new Date().getTime();
        
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt/16);
            return (c === 'x' ? r :(r&0x3|0x8)).toString(16);
        });
        
        return uuid;
    }
    
    static GET_DEGREE_FROM_RADIAN(angle) {
        return ((180.0 / Math.PI) * angle);
    }
    
    static GET_RADIAN_FROM_DEGREE(angle) {
        return ((Math.PI / 180.0) * angle);
    }
}