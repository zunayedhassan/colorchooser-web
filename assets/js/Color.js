"use strict";

class Color {
    constructor(hex, opacity) {
        if (hex !== null) {
            let rgb = Color.GET_RGB_FROM_HEX(hex);

            this.Red = rgb.r;
            this.Green = rgb.g;
            this.Blue = rgb.b;
            this.Opacity = (opacity === undefined) ? 1.0 : opacity;
        }
    }
    
    GetRed() {
        return this.Red;
    }
    
    GetGreen() {
        return this.Green;
    }
    
    GetBlue() {
        return this.Blue;
    }
    
    GetOpacity() {
        return this.Opacity;
    }
    
    ToString() {
        return ("[" + this.GetRed() + ", " + this.GetGreen() + ", " + this.GetBlue() + "]");
    }
    
    static GET_RGB_FROM_HEX(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    static GET_TRUNCATED_RGB_VALUE(value) {
        return (value < 0) ? 0 : ((value > 255) ? 255 : value);
    }
    
    static GET_TRUNCATED_HUE_VALUE(value) {
        return (value < 0) ? 0 : ((value > 360) ? 360 : value);
    }
    
    static GET_TRUNCATED_SATURATION_VALUE(value) {
        return (value < 0) ? 0 : ((value > 100) ? 100 : value);
    }
    
    static GET_TRUNCATED_BRIGHTNESS_VALUE(value) {
        return (value < 0) ? 0 : ((value > 100) ? 100 : value);
    }
    
    static CREATE_COLOR_FROM_RGB(red, green, blue, opacity) {
        let color = new Color(null);
        
        color.Red = red;
        color.Green = green;
        color.Blue = blue;
        color.Opacity = (opacity === undefined) ? 1.0 : opacity;
        
        return color;
    }
    
    static GET_HSB_FROM_RGB(r, g, b) {
        if (arguments.length === 1) {
            g = r.g, b = r.b, r = r.r;
        }
        var max = Math.max(r, g, b), min = Math.min(r, g, b),
            d = max - min,
            h,
            s = (max === 0 ? 0 : d / max),
            v = max / 255;

        switch (max) {
            case min:
                h = 0;
                break;
                
            case r:
                h = (g - b) + d * (g < b ? 6: 0);
                h /= 6 * d;
                break;
                
            case g:
                h = (b - r) + d * 2;
                h /= 6 * d;
                break;
                
            case b:
                h = (r - g) + d * 4;
                h /= 6 * d;
                break;
        }

        return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
    }
    
    static GET_RGB_FROM_HSB(h, s, v) {
        var r, g, b;
        var i;
        var f, p, q, t;

        // Make sure our arguments stay in-range
        h = Math.max(0, Math.min(360, h));
        s = Math.max(0, Math.min(100, s));
        v = Math.max(0, Math.min(100, v));

        // We accept saturation and value arguments from 0 to 100 because that's
        // how Photoshop represents those values. Internally, however, the
        // saturation and value are calculated from a range of 0 to 1. We make
        // That conversion here.
        s /= 100;
        v /= 100;

        if(s == 0) {
            // Achromatic (grey)
            r = g = b = v;
            return [
                Math.round(r * 255), 
                Math.round(g * 255), 
                Math.round(b * 255)
            ];
        }

        h /= 60; // sector 0 to 5
        i = Math.floor(h);
        f = h - i; // factorial part of h
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));

        switch(i) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;

            case 1:
                r = q;
                g = v;
                b = p;
                break;

            case 2:
                r = p;
                g = v;
                b = t;
                break;

            case 3:
                r = p;
                g = q;
                b = v;
                break;

            case 4:
                r = t;
                g = p;
                b = v;
                break;

            default: // case 5:
                r = v;
                g = p;
                b = q;
        }

        return [
            Math.round(r * 255), 
            Math.round(g * 255), 
            Math.round(b * 255)
        ];
    }
    
    static _COMPONENT_TO_HEX(c) {
        var hex = c.toString(16);
        return (hex.length === 1) ? "0" + hex : hex;
    }

    static GET_HEX_FROM_RGB(r, g, b) {
        return "#" + Color._COMPONENT_TO_HEX(r) + Color._COMPONENT_TO_HEX(g) + Color._COMPONENT_TO_HEX(b);
    }
}