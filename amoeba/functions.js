function serialize() {
    data = { "amoebas": [], "food": [] };
    
    for ( let amoeba of amoebas) {
        data.amoebas.push(
            map( amoeba.x, 0, width, 0.0, 1.0 ),
            map( amoeba.y, 0, height, 1.0, 0.0 ) 
            );
    }
  
    for ( let f of food ) {
      data.food.push(
        map( f.x, 0, width, 0.0, 1.0 ),
        map( f.y, 0, height, 1.0, 0.0 )
        );
    }

    return data;

  }
  
function findMin(a) {

    return a.indexOf(Math.min.apply(Math, a));

}

function createAmoebas() {

    for (let i = 0; i < numbAmoebas; i++) {
        amoebas.push(new Amoeba(random(100, 200), random(100, 200)));
    }

}

function createFood(a, b) {
    if (food.length <= ( MAX_FOOD - numbFood ) ) {
        
        for (i = 0; i < numbFood; i++ ) {
        food.push( new Food( a, b ) );
      }

    }

  }

function mousePressed() {
    createFood( mouseX, mouseY );
  }

function keyPressed() {
    let fs = fullscreen();
    fullscreen( !fs );
  }

function windowResized() {
    resizeCanvas( windowWidth, windowHeight, WEBGL) ;
    shaderTexture.resizeCanvas( windowWidth, windowHeight, WEBGL );
}