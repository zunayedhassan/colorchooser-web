"use strict";

class ColorChooserInput {
    constructor(colorChooser) {
        // Initialize Data
        this.ColorChooserHtmlElement    = colorChooser;
        this.ColorChooserInput          = this.GetColorChooserInput();
        this.ColorPreview               = this.GetHtmlElement().querySelectorAll("rect")[0];
        this.IsChangeAccordingToEvent   = true;
        this.CustomColorChooser         = this.GetHtmlElement().querySelectorAll(".ssm-custom-color-chooser")[0];
        this.HueColorIndicator          = this.GetHtmlElement().querySelectorAll(".ssm-hue-color-chooser-indicator")[0];
        this.ColorIndicator             = this.GetHtmlElement().querySelectorAll(".ssm-color-chooser-indicator")[0];
        this.ColorPreviewPane           = this.GetHtmlElement().querySelectorAll(".ssm-custom-color-preview")[0];
        this.NumberInputs               = this.GetHtmlElement().querySelectorAll(".ssm-number-input");
        this.RedInput                   = new NumberInput(this.NumberInputs[0]);
        this.GreenInput                 = new NumberInput(this.NumberInputs[1]);
        this.BlueInput                  = new NumberInput(this.NumberInputs[2]);
        this.HueInput                   = new NumberInput(this.NumberInputs[3]);
        this.SaturationInput            = new NumberInput(this.NumberInputs[4]);
        this.BrightnessInput            = new NumberInput(this.NumberInputs[5]);
        this.HexTextBox                 = new TextBox(this.GetHtmlElement().querySelectorAll(".ssm-color-chooser-hex")[0].querySelectorAll(".ssm-textbox")[0]);
        this.DoneButton                 = this.GetHtmlElement().querySelectorAll(".ssm-color-chooser-done")[0];
        this.MoreButton                 = this.GetHtmlElement().querySelectorAll(".ssm-color-chooser-more")[0];
        this.ColorPaletteItems          = this.GetHtmlElement().querySelectorAll(".ssm-color-chooser-palette-item");
        this.ColorChooserDialog         = this.GetHtmlElement().querySelectorAll(".ssm-color-chooser-dialog")[0];

        // Initialize GUI

        // Initialize Events
        HtmlElements.GET_BODY().addEventListener("mousedown", event => {
            if (!CommonTools.IS_MOUSE_WITHIN_THE_ELEMENT(this.GetHtmlElement(), event) && !CommonTools.IS_MOUSE_WITHIN_THE_ELEMENT(this.ColorChooserDialog, event)) {
                this.SetShowColorChooserDialog(false);
            }

            if (CommonTools.IS_MOUSE_WITHIN_THE_ELEMENT(this.DoneButton, event)) {
                setTimeout(() => {
                    this.SetShowColorChooserDialog(false);
                }, 300);
            }
        });

        for (let i = 0; i < this.ColorPaletteItems.length; i++) {
            let item = this.ColorPaletteItems[i];

            item.addEventListener("click", event => {
                for (let j = 0; j < this.ColorPaletteItems.length; j++) {
                    let currentItem = this.ColorPaletteItems[j];
                    currentItem.setAttribute("data-isChecked", false);
                }

                item.setAttribute("data-isChecked", true);
                let color = item.style.background;
                color = color.split(")")[0].split("(")[1].split(",");
                color = Color.GET_HEX_FROM_RGB(parseInt(color[0].trim()), parseInt(color[1].trim()), parseInt(color[2].trim()));

                this.SetColor(color);
            });
        }

        this.DoneButton.addEventListener("click", event => {
            let hue = this.HueInput.GetValue();
            let saturation = this.SaturationInput.GetValue();
            let brightness = this.BrightnessInput.GetValue();

            let rgb = Color.GET_RGB_FROM_HSB(hue, saturation, brightness);
            let hex = Color.GET_HEX_FROM_RGB(rgb[0], rgb[1], rgb[2]);

            this.SetColor(hex);
        });

        this.MoreButton.addEventListener("click", event => {
            this.SetExtraPaneShow(!this.IsExtraPaneShowing());
        });

        this.InitializeNumberInputEvent(this.RedInput, () => {
            if (this.RedInput.IsChangeAccordingToEvent) {
                this._applyColorFromRGBValue();
            }
        });

        this.InitializeNumberInputEvent(this.GreenInput, () => {
            if (this.GreenInput.IsChangeAccordingToEvent) {
                this._applyColorFromRGBValue();
            }
        });

        this.InitializeNumberInputEvent(this.BlueInput, () => {
            if (this.BlueInput.IsChangeAccordingToEvent) {
                this._applyColorFromRGBValue();
            }
        });

        this.InitializeNumberInputEvent(this.HueInput, () => {
            if (this.HueInput.IsChangeAccordingToEvent) {
                this._applyColorFromHSBValue();
            }
        });

        this.InitializeNumberInputEvent(this.SaturationInput, () => {
            if (this.SaturationInput.IsChangeAccordingToEvent) {
                this._applyColorFromHSBValue();
            }
        });

        this.InitializeNumberInputEvent(this.BrightnessInput, () => {
            if (this.BrightnessInput.IsChangeAccordingToEvent) {
                this._applyColorFromHSBValue();
            }
        });

        this.InitializeTextBoxInputEvent(this.HexTextBox, () => {
            if (this.HexTextBox.IsChangeAccordingToEvent) {
                let hex = this.HexTextBox.GetText().trim();
                let isOk  = /^#[0-9A-F]{6}$/i.test(hex);

                if (isOk) {
                    this.SetColor(hex);
                }
            }
        });

        this.GetHtmlElement().addEventListener("click", event => {
            if (!this.IsDisabled()) {
                //this.ColorChooserInput.focus();
                //this.ColorChooserInput.click();

                this.SetShowColorChooserDialog(true);
            }
        });

        this.ColorChooserInput.addEventListener("change", event => {
            if (this.IsChangeAccordingToEvent) {
                this.SetColor(event.target.value);
            }
        });

        let hueColorDrag = new Drag(
            this.CustomColorChooser.querySelectorAll(".ssm-hue-rect")[0],
            (event, previousX, previousY) => {
                if (CommonTools.IS_MOUSE_WITHIN_THE_ELEMENT(this.CustomColorChooser.querySelectorAll(".ssm-hue-rect")[0], event)) {
                    let indicatorHalfWidth = (CommonTools.GET_HTML_ELEMENT_WIDTH(this.HueColorIndicator) / 2.0);
                    let x = event.clientX - CommonTools.GET_HTML_ELEMENT_POSITION_X(this.CustomColorChooser.querySelectorAll(".ssm-hue-rect")[0]) - indicatorHalfWidth;

                    this.HueColorIndicator.style.left = x + "px";
                    this._onHueColorBarAction();
                }
            },
            (event, previousX, previousY) => {
                let indicatorHalfWidth = (CommonTools.GET_HTML_ELEMENT_WIDTH(this.HueColorIndicator) / 2.0);
                let x = this.HueColorIndicator.style.left;

                if (x.trim().length === 0) {
                    x = 0;
                }

                if (x.toString().includes("px")) {
                    x = parseFloat(x.split("px")[0].trim());
                }

                x += event.clientX - previousX;

                if ((x >= -indicatorHalfWidth) && (x < CommonTools.GET_HTML_ELEMENT_WIDTH(this.CustomColorChooser.querySelectorAll(".ssm-hue-rect")[0]) - indicatorHalfWidth - 1)) {
                    this.HueColorIndicator.style.left = x + "px";
                    this._onHueColorBarAction();
                }
            },
            (event, previousX, previousY) => {
                if (CommonTools.IS_MOUSE_WITHIN_THE_ELEMENT(this.CustomColorChooser.querySelectorAll(".ssm-hue-rect")[0], event)) {
                    let indicatorHalfWidth = (CommonTools.GET_HTML_ELEMENT_WIDTH(this.HueColorIndicator) / 2.0);
                    let x = event.clientX - CommonTools.GET_HTML_ELEMENT_POSITION_X(this.CustomColorChooser.querySelectorAll(".ssm-hue-rect")[0]) - indicatorHalfWidth;

                    this.HueColorIndicator.style.left = x + "px";
                    this._onHueColorBarAction();
                }
            });


        let colorDrag = new Drag(
            this.CustomColorChooser.querySelectorAll(".ssm-color-rect")[0],
            (event, previousX, previousY) => {
                if (CommonTools.IS_MOUSE_WITHIN_THE_ELEMENT(this.CustomColorChooser.querySelectorAll(".ssm-color-rect")[0], event)) {
                    let indicatorHalfWidth = (CommonTools.GET_HTML_ELEMENT_WIDTH(this.ColorIndicator) / 2.0);
                    let x = event.clientX - CommonTools.GET_HTML_ELEMENT_POSITION_X(this.CustomColorChooser.querySelectorAll(".ssm-color-rect")[0]) - indicatorHalfWidth;
                    let y = event.clientY - CommonTools.GET_HTML_ELEMENT_POSITION_Y(this.CustomColorChooser.querySelectorAll(".ssm-color-rect")[0]) - indicatorHalfWidth;

                    this.ColorIndicator.style.left = x + "px";
                    this.ColorIndicator.style.top = y + "px";

                    this._onColorAction();
                }
            },
            (event, previousX, previousY) => {
                let indicatorHalfWidth = (CommonTools.GET_HTML_ELEMENT_WIDTH(this.ColorIndicator) / 2.0);
                let x = this.ColorIndicator.style.left;
                let y = this.ColorIndicator.style.top;

                if (x.trim().length === 0) {
                    x = 0;
                }

                if (y.trim().length === 0) {
                    y = 0;
                }

                if (x.toString().includes("px")) {
                    x = parseFloat(x.split("px")[0].trim());
                }

                if (y.toString().includes("px")) {
                    y = parseFloat(y.split("px")[0].trim());
                }

                x += event.clientX - previousX;
                y += event.clientY - previousY;

                if ((x >= -indicatorHalfWidth) && (x < CommonTools.GET_HTML_ELEMENT_WIDTH(this.CustomColorChooser.querySelectorAll(".ssm-color-rect")[0]) - indicatorHalfWidth)) {
                    this.ColorIndicator.style.left = x + "px";
                }

                if ((y >= -indicatorHalfWidth) && (y < CommonTools.GET_HTML_ELEMENT_HEIGHT(this.CustomColorChooser.querySelectorAll(".ssm-color-rect")[0]) - indicatorHalfWidth)) {
                    this.ColorIndicator.style.top = y + "px";
                }

                //this._onColorAction();        // XXX: May cause performance issue
            },
            (event, previousX, previousY) => {
                if (CommonTools.IS_MOUSE_WITHIN_THE_ELEMENT(this.CustomColorChooser.querySelectorAll(".ssm-color-rect")[0], event)) {
                    let indicatorHalfWidth = (CommonTools.GET_HTML_ELEMENT_WIDTH(this.HueColorIndicator) / 2.0);
                    let x = event.clientX - CommonTools.GET_HTML_ELEMENT_POSITION_X(this.CustomColorChooser.querySelectorAll(".ssm-color-rect")[0]) - indicatorHalfWidth;
                    let y = event.clientY - CommonTools.GET_HTML_ELEMENT_POSITION_Y(this.CustomColorChooser.querySelectorAll(".ssm-color-rect")[0]) - indicatorHalfWidth;

                    this.ColorIndicator.style.left = x + "px";
                    this.ColorIndicator.style.top = y + "px";

                    this._onColorAction();
                }
            });

        // Initialize Finally
        ColorChooserInput.OBJECTS.push(this);
    }

    GetColorChooserInput() {
        return this.GetHtmlElement().querySelectorAll("input[type='color']")[0];
    }

    GetHtmlElement() {
        return this.ColorChooserHtmlElement;
    }

    SetColor(color, isChangeColorProperties) {
        isChangeColorProperties = (isChangeColorProperties === undefined) ? true : isChangeColorProperties;

        this.ColorPreview.setAttribute("fill", color);
        this.ColorPreviewPane.style.background = color;

        let currentColor = new Color(color);
        let hsl = Color.GET_HSB_FROM_RGB(currentColor.GetRed(), currentColor.GetGreen(), currentColor.GetBlue());

        let hueBarWidth = 200;
        let hueIndicatorHalfWidth = CommonTools.GET_HTML_ELEMENT_WIDTH(this.HueColorIndicator) / 2.0;
        let hueX = ((hueBarWidth / 360.0) * hsl[0]) - hueIndicatorHalfWidth;

        this.HueColorIndicator.style.left = hueX + "px";


        let colorSquareSize = 200;
        let colorIndicatorHalfWidth = CommonTools.GET_HTML_ELEMENT_WIDTH(this.ColorIndicator) / 2.0;
        let saturationX = ((colorSquareSize / 100.0) * hsl[1]) - colorIndicatorHalfWidth;

        this.ColorIndicator.style.left = saturationX + "px";

        let brightnessY = ((colorSquareSize / 100.0) * (100.0 - hsl[2])) - colorIndicatorHalfWidth;
        this.ColorIndicator.style.top = brightnessY + "px";

        this._onHueColorBarAction(isChangeColorProperties);
        this._onColorAction(isChangeColorProperties);

        if (isChangeColorProperties) {
            this._setColorPropertiesValue(hsl[0], hsl[1], hsl[2]);
        }

        this.HexTextBox.IsChangeAccordingToEvent = false;
        this.HexTextBox.SetText(color);
        this.HexTextBox.IsChangeAccordingToEvent = true;


        let isShouldAddToCustomColor = true;

        for (let i = 18; i < this.ColorPaletteItems.length; i++) {
            let item = this.ColorPaletteItems[i];
            let background = item.getAttribute("data-color");

            if (background === color) {
                isShouldAddToCustomColor = false;
                break;
            }
        }

        if (isShouldAddToCustomColor) {
            let colorHistory = new Array();

            for (let i = 18; i < this.ColorPaletteItems.length; i++) {
                let item = this.ColorPaletteItems[i];
                let background = item.getAttribute("data-color");
                colorHistory.push(background);
            }

            for (let i = 18, j = 0; i < this.ColorPaletteItems.length; i++, j++) {
                let item = this.ColorPaletteItems[i];

                if (i === 18) {
                    item.setAttribute("data-color", color);
                    item.style.background = color;
                }
                else {
                    item.setAttribute("data-color", colorHistory[j - 1]);
                    item.style.background = colorHistory[j - 1];
                }
            }
        }

        this.GetColorChooserInput().setAttribute("value", color);
        this.GetColorChooserInput().value = color;
    }

    GetValue() {
        return this.ColorChooserInput.value;
    }

    SetDisable(isDisabled) {
        this.GetHtmlElement().setAttribute("data-isDisabled", isDisabled);
    }

    IsDisabled() {
        return (this.GetHtmlElement().getAttribute("data-isDisabled") === "true") ? true : false;
    }

    static INITIALIZE_ALL() {
        let colorChoosers = document.querySelectorAll(".ssm-color-chooser");

        for (let i = 0; i < colorChoosers.length; i++) {
            let colorChooserElement = colorChoosers[i];
            let colorChooser = new ColorChooserInput(colorChooserElement);
        }
    }

    static GET_OBJECT_FROM_HTML_ELEMENT(htmlElement) {
        for (let i = 0; i < ColorChooserInput.OBJECTS.length; i++) {
            let input = ColorChooserInput.OBJECTS[i];

            if (input.GetHtmlElement() === htmlElement) {
                return input;
            }
        }

        return null;
    }

    _getColorPaletteElement() {
        return this.GetHtmlElement().querySelectorAll(".ssm-color-chooser-dialog")[0];
    }

    IsColorPaletteShowing() {
        let isShowing = (this._getColorPaletteElement().getAttribute("data-isShow") === "true") ? true : false;

        return isShowing;
    }

    IsExtraPaneShowing() {
        let isShowing = (this.CustomColorChooser.getAttribute("data-isShow") === "true") ? true : false;

        return isShowing;
    }

    SetExtraPaneShow(isShow) {
        this.CustomColorChooser.setAttribute("data-isShow", isShow);
        this.MoreButton.querySelectorAll(".ssm-button-title")[0].innerHTML = (isShow ? "Collapse" : "Expand");

        if (isShow) {
            this._initializeHue(this.CustomColorChooser);
            this._setColorToColorPane(this.CustomColorChooser, 255, 0, 0);
            this._onColorAction();
            this.SetColor(this.GetValue());
        }
    }

    _initializeHue(element) {
        let canvas = element.querySelectorAll(".ssm-hue-rect")[0];
        let context = canvas.getContext("2d");
        let canvasWidth = CommonTools.GET_HTML_ELEMENT_WIDTH(canvas);
        let canvasHeight = CommonTools.GET_HTML_ELEMENT_HEIGHT(canvas);

        context.beginPath();
        context.rect(0, 0, canvasWidth, canvasHeight);

        let linearGradient = context.createLinearGradient(0, 0, canvasWidth, 0);

        for (let x = 0; x < 255; x++) {
            let offset = ((1.0 / 255.0) * x);
            let h = Math.floor((x / 255.0) * 360.0);

            let rgb = Color.GET_RGB_FROM_HSB(h, 100.0, 100.0);
            linearGradient.addColorStop(offset, `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
        }

        context.fillStyle = linearGradient;
        context.fill();
    }

    _setColorToColorPane(element, red, green, blue) {
        let canvas = element.querySelectorAll(".ssm-color-rect")[0];
        let context = canvas.getContext("2d");
        let canvasWidth = CommonTools.GET_HTML_ELEMENT_WIDTH(canvas);
        let canvasHeight = CommonTools.GET_HTML_ELEMENT_HEIGHT(canvas);

        context.beginPath();
        context.rect(0, 0, canvasWidth, canvasHeight);
        context.stroke();
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, 1)`;
        context.fill();

        context.beginPath();
        context.rect(0, 0, canvasWidth, canvasHeight);

        let linearGradient1 = context.createLinearGradient(0, 0, canvasWidth, 0);

        linearGradient1.addColorStop(0, 'rgba(255, 255, 255, 1)');
        linearGradient1.addColorStop(1, 'rgba(255, 255, 255, 0)');

        context.fillStyle = linearGradient1;
        context.fill();

        context.beginPath();
        context.rect(0, 0, canvasWidth, canvasHeight);

        let linearGradient2 = context.createLinearGradient(0, 0, 0, canvasHeight);

        linearGradient2.addColorStop(0, 'rgba(0, 0, 0, 0)');
        linearGradient2.addColorStop(1, 'rgba(0, 0, 0, 1)');

        context.fillStyle = linearGradient2;
        context.fill();
    }

    _getHue() {
        let hueBarWidth = 200;
        let hueIndicatorHalfWidth = CommonTools.GET_HTML_ELEMENT_WIDTH(this.HueColorIndicator) / 2.0;

        let x = this.HueColorIndicator.style.left;

        if (x.trim().length === 0) {
            x = 0;
        }

        if (x.toString().includes("px")) {
            x = parseFloat(x.split("px")[0].trim());
        }

        x += hueIndicatorHalfWidth;
        x = (x < 0) ? 0 : ((x > hueBarWidth) ? hueBarWidth : x);

        let hue = Math.round((360.0 / hueBarWidth) * x);

        return hue;
    }

    _getSaturation() {
        let colorSquareSize = 200;
        let colorIndicatorHalfWidth = CommonTools.GET_HTML_ELEMENT_WIDTH(this.ColorIndicator) / 2.0;

        let x = this.ColorIndicator.style.left;

        if (x.trim().length === 0) {
            x = 0;
        }

        if (x.toString().includes("px")) {
            x = parseFloat(x.split("px")[0].trim());
        }

        x += colorIndicatorHalfWidth;
        x = (x < 0) ? 0 : ((x > colorSquareSize) ? colorSquareSize : x);

        let saturation = Math.round((100.0 / colorSquareSize) * x);

        return saturation;
    }

    _getBrightness() {
        let colorSquareSize = 200;
        let colorIndicatorHalfWidth = CommonTools.GET_HTML_ELEMENT_WIDTH(this.ColorIndicator) / 2.0;

        let y = this.ColorIndicator.style.top;

        if (y.trim().length === 0) {
            y = 0;
        }

        if (y.toString().includes("px")) {
            y = parseFloat(y.split("px")[0].trim());
        }

        y += colorIndicatorHalfWidth;
        y = (y < 0) ? 0 : ((y > colorSquareSize) ? colorSquareSize : y);

        let brightness = Math.round((100.0 / colorSquareSize) * (colorSquareSize - y));

        return brightness;
    }

    _onHueColorBarAction(isChangeColorProperties) {
        isChangeColorProperties = (isChangeColorProperties === undefined) ? true : isChangeColorProperties;
        let hue = this._getHue();
        let saturation = this._getSaturation();
        let brightness = this._getBrightness();

        let rgb = Color.GET_RGB_FROM_HSB(hue, saturation, brightness);
        this.ColorPreviewPane.style.background = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;

        rgb = Color.GET_RGB_FROM_HSB(hue, 100, 100);

        this._setColorToColorPane(this.CustomColorChooser, rgb[0], rgb[1], rgb[2]);

        if (isChangeColorProperties) {
            this._setColorPropertiesValue(hue, saturation, brightness);
        }
    }

    _onColorAction(isChangeColorProperties) {
        isChangeColorProperties = (isChangeColorProperties === undefined) ? true : isChangeColorProperties;
        let hue = this._getHue();
        let saturation = this._getSaturation();
        let brightness = this._getBrightness();

        let rgb = Color.GET_RGB_FROM_HSB(hue, saturation, brightness);

        this.ColorPreviewPane.style.background = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;

        if (isChangeColorProperties) {
            this._setColorPropertiesValue(hue, saturation, brightness);
        }
    }

    _setColorPropertiesValue(hue, saturation, brightness) {
        this.RedInput.IsChangeAccordingToEvent = false;
        this.GreenInput.IsChangeAccordingToEvent = false;
        this.BlueInput.IsChangeAccordingToEvent = false;
        this.HueInput.IsChangeAccordingToEvent = false;
        this.SaturationInput.IsChangeAccordingToEvent = false;
        this.BrightnessInput.IsChangeAccordingToEvent = false;
        this.HexTextBox.IsChangeAccordingToEvent = false;

        let rgb = Color.GET_RGB_FROM_HSB(hue, saturation, brightness);

        this.RedInput.SetValue(rgb[0]);
        this.GreenInput.SetValue(rgb[1]);
        this.BlueInput.SetValue(rgb[2]);

        this.HueInput.SetValue(hue);
        this.SaturationInput.SetValue(saturation);
        this.BrightnessInput.SetValue(brightness);

        let hex = Color.GET_HEX_FROM_RGB(rgb[0], rgb[1], rgb[2]);

        this.HexTextBox.SetText(hex);

        this.RedInput.IsChangeAccordingToEvent = true;
        this.GreenInput.IsChangeAccordingToEvent = true;
        this.BlueInput.IsChangeAccordingToEvent = true;
        this.HueInput.IsChangeAccordingToEvent = true;
        this.SaturationInput.IsChangeAccordingToEvent = true;
        this.BrightnessInput.IsChangeAccordingToEvent = true;
        this.HexTextBox.IsChangeAccordingToEvent = true;
    }

    InitializeNumberInputEvent(numberInput, callback) {
        numberInput.GetInputElement().addEventListener("change", callback);
        numberInput.GetStepUpButton().addEventListener("click", callback);
        numberInput.GetStepDownButton().addEventListener("click", callback);
    }

    InitializeTextBoxInputEvent(textBox, callback) {
        textBox.GetHtmlElement().addEventListener("change", callback);
        textBox.GetHtmlElement().addEventListener("input", callback);
    }

    SetShowColorChooserDialog(isShow) {
        let buttonHeight = CommonTools.GET_HTML_ELEMENT_HEIGHT(this.GetHtmlElement());
        let x = null;
        let y = null;
        let browserHeight = null;
        let dialogHeight = null;

        this.ColorChooserDialog.setAttribute("data-isShow", isShow);

        if (isShow) {
            buttonHeight = CommonTools.GET_HTML_ELEMENT_HEIGHT(this.GetHtmlElement());
            x = CommonTools.GET_HTML_ELEMENT_POSITION_X(this.GetHtmlElement());
            y = CommonTools.GET_HTML_ELEMENT_POSITION_Y(this.GetHtmlElement()) + buttonHeight;
            browserHeight = CommonTools.GET_BROWSER_HEIGHT();
            dialogHeight = CommonTools.GET_HTML_ELEMENT_HEIGHT(this.ColorChooserDialog);

            if (y + dialogHeight > browserHeight) {
                y = CommonTools.GET_HTML_ELEMENT_POSITION_Y(this.GetHtmlElement()) - dialogHeight;
            }

            this.ColorChooserDialog.style.left = x + "px";
            this.ColorChooserDialog.style.top = y + "px";
        }
    }

    _applyColorFromRGBValue() {
        let red = this.RedInput.GetValue();
        let green = this.GreenInput.GetValue();
        let blue = this.BlueInput.GetValue();

        red = Color.GET_TRUNCATED_RGB_VALUE(red);
        green = Color.GET_TRUNCATED_RGB_VALUE(green);
        blue = Color.GET_TRUNCATED_RGB_VALUE(blue);

        let hex = Color.GET_HEX_FROM_RGB(red, green, blue);

        this.SetColor(hex, false);
    }

    _applyColorFromHSBValue() {
        let hue = this.HueInput.GetValue();
        let saturation = this.SaturationInput.GetValue();
        let brightness = this.BrightnessInput.GetValue();

        hue = Color.GET_TRUNCATED_HUE_VALUE(hue);
        saturation = Color.GET_TRUNCATED_SATURATION_VALUE(saturation);
        brightness = Color.GET_TRUNCATED_BRIGHTNESS_VALUE(brightness);

        let rgb = Color.GET_RGB_FROM_HSB(hue, saturation, brightness);
        let hex = Color.GET_HEX_FROM_RGB(rgb[0], rgb[1], rgb[2]);

        this.SetColor(hex, false);
    }

    GetActionButton() {
        return this.DoneButton;
    }
}

ColorChooserInput.OBJECTS = new Array();