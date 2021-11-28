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
twrk.scale({ height: 150 });

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


//draw
let dist = 10;
let square = 20;
let cells = 10;
let colors = ["#cdb4db", "#ffc8dd", "#ffafcc", "#bde0fe", "#a2d2ff"];
let c3 = [-square/2,0,square/2];
let c2 = [0,square/2];

for (let x = -cells/2; x < cells/2; x++){
    for (let y = -cells/2; y < cells/2; y++){
        let thisC3= c3[Math.floor(Math.random()*c3.length)]
        let thisC2= c2[Math.floor(Math.random()*c2.length)]
        let path = [
            {x: x*dist - thisC3, y: y*dist - square/2},
            {x: x*dist + thisC2, y: y*dist + square/2},
            {x: x*dist - square/2, y: y*dist + thisC2}
        ]
        twrk.makeSvgShape( {
            parent: dom.svgLayer,
            color: colors[Math.floor(Math.random()*colors.length)],
            d: twrk.svgPath(path)
        } );
    }
}

/*
// Frame
let aD = Math.random()/4;

let frame = [
    {x: -(cells/2 + 1 + aD)*dist, y:  -(cells/2 + 1)*dist},
    {x: -(cells/2 + 1)*dist, y:  (cells/2)*dist},
    {x: (cells/2)*dist, y:  (cells/2 + aD)*dist},
    {x: (cells/2 + aD)*dist, y:  -(cells/2 + 1 + aD)*dist},
    {x: -(cells/2 + 1 + aD)*dist, y:  -(cells/2 + 1)*dist}
]

twrk.makeSvgLine( {
    parent: dom.svgLayer,
    stroke: 3,
    cap: "square",
    color: "#333",
    d: twrk.svgPath(frame)
});

  {x: x*dist + thisTopX,  y: y*dist - square/2},
            {x: x*dist + square/2,  y: y*dist + square/2},
            {x: x*dist - square/2,  y: y*dist + square/2}

*/