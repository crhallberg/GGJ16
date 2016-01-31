var monkchantSound;
var drumchantSound;
var bugkillSound;
var bugwalkSound;
var fireSound;
var iceSound;
var brickSound;
var successSound;

function loadAllSound()
{
  drumchantSound = loadSound('assets/audio/warfulllooped.wav');
  drumchantSound.setVolume(0.0);
  drumchantSound.addCue(0.01, onLoop, "drumchant");
  
  monkchantSound = loadSound('assets/audio/monklooped.wav');
  deepdrumSound = loadSound('assets/audio/deepdrums.wav');
  deepdrumSound.addCue(0.01, onLoop, "deepdrum");
  
  bugkillSound = loadSound('assets/audio/bugsplat.wav');
  bugwalkSound = loadSound('assets/audio/bugwalk.wav');
  fireSound = loadSound('assets/audio/fire.wav');
  iceSound = loadSound('assets/audio/ice.wav');
  brickSound = loadSound('assets/audio/brickbreak.wav');
  successSound = loadSound('assets/audio/success.wav');
}


function playSound(soundName)
{
  if (soundName == "bugwalk" && !bugwalkSound.isPlaying())
    bugwalkSound.play();
  else if (soundName == "bugkill")
  {
  	bugkillSound.play();
  	stopSound("bugwalk");
  }
  else if (soundName == "fire")
  	fireSound.play();
  else if (soundName == "ice")
  	iceSound.play();
  else if (soundName == "brick")
    brickSound.play();
  else if (soundName == "success")
  	successSound.play();
}

function stopSound(soundName)
{
  if (soundName == "bugwalk" && bugwalkSound.isPlaying())
    println("bugwalk soundStop");
    bugwalkSound.stop();
}
function loopBackgroundMusic(soundName)
{
  println("background music");
  if (soundName === "drumchant" && !drumchantSound.isPlaying())
    drumchantSound.loop();
  if (soundName == "monkchant" && !monkchantSound.isPlaying())
  {
    monkchantSound.loop();
    deepdrumSound.loop();
  }
}

function onLoop(soundname)
{
  if (soundname == "deepdrum")
    tempo.resync();
}