let twrk = {};

// COORDINATES

twrk.scale = function ({ width, height }) {
    if (width) {
        twrk.width = width;
        twrk.res = window.innerWidth / twrk.width;
        twrk.height = window.innerHeight / twrk.res;
    } else if (height) {
        twrk.height = height;
        twrk.res = window.innerHeight / twrk.height;
        twrk.width = window.innerWidth / twrk.res;
    }
    twrk.center = {x: twrk.width / 2, y: twrk.height / 2};  
}
twrk.scale({ height: 220 });

// SVG

twrk.svgNameSpace = "http://www.w3.org/2000/svg";

twrk.svgPath = function (points) {

    let output = "M ";
    for (var i = 0; i < points.length; i++) {
        output += points[i].x * twrk.res + " " + points[i].y * twrk.res + " ";
    }

    return output;
};

twrk.makeSvgLayer = function ({ parent, id, x = 0, y = 0}) {
    dom[id] = document.createElementNS(twrk.svgNameSpace, "svg");
    dom[id].id = id;
    dom[id].style.transform = "translateX(" + (x * twrk.res) + "px) translateY(" + (y * twrk.res +"px)");
    parent.appendChild(dom[id]);
}

twrk.makeSvgLine = function ({parent, id, d="", color = "#f0f", stroke = 1, cap = "butt"}){
    dom[id] = document.createElementNS(twrk.svgNameSpace, "path");
    dom[id].setAttributeNS(null, "fill", "none");
    dom[id].setAttributeNS(null, "d", d);
    dom[id].setAttributeNS(null, "stroke-width", stroke * twrk.res);
    dom[id].setAttributeNS(null, "stroke", color);
    dom[id].setAttributeNS(null, "stroke-linecap", cap);
    dom[id].id = id;
    parent.appendChild(dom[id]);
} 

twrk.makeSvgShape = function ({ parent, id, d = "", color = "#0ff" }) {
    dom[id] = document.createElementNS(twrk.svgNameSpace, "path");
    dom[id].setAttributeNS(null, "fill", color);
    dom[id].setAttributeNS(null, "d", d);
    dom[id].id = id;
    parent.appendChild(dom[id]);
}

// DOM

let dom = {};

// add main stage
dom.stage = document.createElement("stage");
dom.stage.style.transform = "translateX(" + (twrk.center.x * twrk.res) + "px) translateY(" + (twrk.center.y * twrk.res +"px)");
dom.stage.id = "stage";
let stageParent = document.querySelector("#content");
stageParent.appendChild(dom.stage);

// make svg laver
twrk.makeSvgLayer({parent: dom.stage, id: "svgLayer", x: 0, y: 0});


// PAINTING VARIABLES
let dist = 20;
let cells = 7; //NEEDS TO BE UNEVEN
let gap = 3;
let values = [4,6,8,10,12,14];
let path = [];
let rF = 0.9;
let rFplus = 0.0;
//MAKE PATH

for (let col = 0; col < cells; col++) {
    for (let row = 0; row < cells; row++) {
        var division = values[Math.floor(Math.random()*values.length)];
        if ((row + col%2)%2 == 0) {//S
            for (let i = 0; i < (2*division + 2); i++){
                let x = (Math.floor((i + 1)/2) + col%2)%2*-dist;
                let y = (dist/division)*Math.floor(i/2)*(((col + 1)%2)*2 - 1);
                x += ((col%2)*2 - 1)*row*(dist + gap);
                y += col*(dist + gap) + (col%2)*dist - (cells+1)*dist/2;
                x = col%2==0? (x + (cells*(dist+gap)/2)): (x - ((cells-2)*(dist+gap)/2));
                path.push({x: x + Math.random()*rF, y: y + Math.random()*rF})
            }
        } else { //W
            for (let i = 0; i < (2*division + 2); i++) {
                let y = (Math.floor((i + 1)/2)+col%2)%2*-dist;
                let x = -(dist/division)*Math.floor(i/2)*(((col + 1)%2)*2 - 1);
                x += ((col%2)*2 - 1)*row*(dist + gap) - (col%2)*dist;
                y += col*(dist + gap) + dist - (cells+1)*dist/2;
                x = col%2==0? (x + (cells*(dist+gap)/2)): (x - ((cells-2)*(dist+gap)/2));
                path.push({x: x + Math.random()*rF, y: y + Math.random()*rF})
            } 
        }
        rF += rFplus;
    }
}

//PAINT IT 

console.log(path)
console.log(division)
twrk.makeSvgLine( {
    parent: dom.svgLayer,
    color: "#000",
    stroke:0.5,
    d: twrk.svgPath(path)
} );
