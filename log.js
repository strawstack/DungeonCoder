function log( str ){

  if( str == "welcome"){
    $("#log").html("\n/*\n*\n* Welcome to Dungeon Crawl\n*\n* Here you will use your coding skills\n* to navigate and overcome a dungeon\n*\n* Move with arrow keys. Click Run Code\n* to attempt a door unlock.\n*\n*/");

  }else{
    $("#log").html( str );

  }
}

// show welcome text on startup
log("welcome");
