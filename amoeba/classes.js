class Amoeba {
    constructor( a, b ) {
      this.x = a,
      this.y = b, 
      this.movement = { 
          x: random( minSpeed, maxSpeed ) * ( random() < 0.5? 1: -1 ),
          y: random( minSpeed, maxSpeed ) * ( random() < 0.5? 1: -1 )
        },
      this.lastPos = { x: this.x, y: this.y }
      this.target = {}, // Momentary target, x. and y.
      this.oldDistance = 0,
      this.targets = []; // Array with Distances to targets
      }
    
      run(){
      this.lastPos = { x: this.x, y: this.y};
      this.x += this.movement.x;
      this.y += this.movement.y;
    }
    
    tumble(){
      this.movement = { 
          x: random( minSpeed, maxSpeed ) * ( random() < 0.5? 1: -1),
          y: random( minSpeed, maxSpeed ) * ( random() < 0.5? 1: -1)
        }
    }
    
    move() {
      this.run();
      if (
        dist( this.x, this.y, this.target.x, this.target.y ) > 
        dist( this.lastPos.x, this.lastPos.y, this.target.x, this.target.y) || 
        random() > randomFactor
        ) {
        this.tumble(); // Amoeba tries to move towards target, tumbles if moving away. Some randomness.
      }
    }
    
    setTarget() {
      if ( food.length > 0 ) {

        // Temporally add mouse position to Food Array
        food.push( { x: mouseX, y: mouseY } );
          
        // Search nearest target and set it to this amoebas target
        for ( let f of food) {
            this.targets.push( dist( this.x, this.y, f.x, f.y ) );
        }
        
        this.target = {
          x: food[ findMin( this.targets ) ].x,
          y: food[ findMin( this.targets ) ].y
        };

        // Remove mouse position from food array
        food.pop();

        hunting = true;
        
      } else {

        this.target = { x: mouseX, y: mouseY };
        hunting = false;

      }
    }
    
    eat() {
      if (
        dist( this.x, this.y, this.target.x, this.target.y ) < 
        targetDistance && hunting
        ) {
        food.splice( findMin( this.targets ), 1 );
      }
    }
   
    beAmoeba() {
      this.targets = [];
      this.setTarget();
      this.move();
      this.eat();
    }
  }
  
  class Food {
    constructor(xPos, yPos){
      this.x = xPos + random()*100 - random()*100,
      this.y = yPos + random()*100 - random()*100
    }
  }