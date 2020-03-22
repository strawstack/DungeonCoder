/* NOTE - door template follows

door
  id: unique integer

  pos: location of door on map

  log: test string logged to console when player hits door

  testName: string that tests player's funct when evaluated

  solution: string must eval to match (via == ) the player's return value

*/

// current sloution and door id
var currSol = undefined;
var doorId = undefined;

// list blue doors and all properties
var doors = [{
  id: 1,

  pos: { x: 15, y: 12 }, // location of door on map

  objRef: undefined, // set by phaser

  log: "/*\n* DoorOne\n*\n* This is a locked door. To open it\n* just say 'unlock'.\n*\n* To say 'unlock', create a function called\n* 'DoorOne' that takes no parameters and returns\n* the string 'unlock'\n*\n* Here's a hint\n* function DoorOne(){\n*   return _____ ; \n* }\n*\n*/",

  testName: "DoorOne();", // checks player's solution

  solution: "a = 'unlock'" // solution must eval to return value of players code
},
{
  id: 2,

  pos: { x: 12, y: 9 },

  objRef: undefined, // set by phaser

  log: "/*\n* DoorTwo\n*\n* This is a locked door. To open it,\n* write a function that accepts one\n* argument (an array) and returns\n* a sorted version of that array.\n*\n* Here's a hint\n* function DoorTwo( arr ){\n*\n*   // sort array here\n*\n*   return arr;\n* }\n*\n*/",

  testName: "DoorTwo([2,3,4,6,7,3,5,1]).toString();",

  solution: "[1, 2, 3, 3, 4, 5, 6, 7].toString()"
},
{
  id: 3,

  pos: { x: 12, y: 15 },

  objRef: undefined, // set by phaser

  log: "/*\n* DoorThree\n*\n* Write a function with the following template\n* that returns the sumof the passed in array\n*\n* function DoorThree( arr ){\n*   //return the sum of 'arr'\n* }\n*\n*/",

  testName: "DoorThree([24,25,27,1,24,43,657,345,24]).toString();",

  solution: "1170" // evals to int 1170
},
{
  id: 4,

  pos: { x: 9, y: 12 },

  objRef: undefined, // set by phaser

  log: "/*\n* DoorFour\n*\n* This door will pass you a string that was\n* encrypted with the code shown below. You\n* must decrypt the string and return the\n* plain text message as a string.\n*\n* This code was used to encrypt the string:\n*\n* function encrypt( message ){\n*   var m = message.split('');\n*   for(var i=0; i < m.length; i++){\n*     m[i] = String.fromCharCode(m[i].charCodeAt(0) + 3);\n*   }\n*   return m.join('');\n* }\n*\n*/",

  testName: "DoorFour('frqjudwxodwlrqv#|rx#xqorfnhg#wkh#grru');",

  solution: "a = 'congratulations you unlocked the door'"
}
];

// on "run" button press eval editor code and check against solution
// remove door on success
function submitDoorCode(){

  // get door
  var _d;
  var _d_index;
  for(var d in doors){
    if(doors[d]["id"] == doorId){
      _d = doors[d];
      _d_index = d;
      break;
    }
  }

  var code = editor.getValue();
  var ans = eval( code + ";" + _d["testName"] );

  // below
  // "ans" is dynamic object returned by exec player code
  // eval(_d['sol']) is the solution as an eval'd string

  if( eval(_d["solution"]) == ans ){
    _d["objRef"].destroy();  // destroy phaser sprite
    doors.splice(_d_index, 1);  // remove door from array
    currSol = undefined;
    doorId = undefined;

  }else{
    // wrong

  }
}
