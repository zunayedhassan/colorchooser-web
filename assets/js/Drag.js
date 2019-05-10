"use strict";

class Drag {
    constructor(dragSourceElement, onDragStarted, onDragMoved, onDragDone) {
        this.OnDragStarted      = onDragStarted;
        this.OnDragMoved        = onDragMoved;
        this.OnDragDone         = onDragDone;
        
        let _dragSourceElement  = dragSourceElement;
        let _isClicked          = false;
        let _previousX          = null;
        let _previousY          = null;
        
        // Overload your method here
        HtmlElements.GET_BODY().addEventListener("mousedown", event => {
            if (_dragSourceElement !== undefined) {
                _isClicked = CommonTools.IS_MOUSE_WITHIN_THE_ELEMENT(_dragSourceElement, event);

                if (_isClicked) {
                    if (this.OnDragStarted !== null) {
                        this.OnDragStarted(event, _previousX, _previousY);
                    }

                    _previousX = event.clientX;
                    _previousY = event.clientY;
                }
            }
        });
        
        HtmlElements.GET_BODY().addEventListener("mousemove", event => {
            if (_dragSourceElement !== undefined) {
                if (_isClicked) {
                    if (this.OnDragMoved !== null) {
                        this.OnDragMoved(event, _previousX, _previousY);
                    }

                    _previousX = event.clientX;
                    _previousY = event.clientY;
                }
            }
        });
        
        HtmlElements.GET_BODY().addEventListener("mouseup", event => {
            if (_dragSourceElement !== undefined) {
                if (this.OnDragDone !== null) {
                    this.OnDragDone(event, _previousX, _previousY);
                }

                _clear();
            }
        });
        
        let _clear = function() {
            _isClicked      = false;
            _previousX      = null;
            _previousY      = null;
        };
    }
}