var drumchantSound;
var bugkillSound;
var bugwalkSound;
var fireSound;
var iceSound;
var successSound;

function loadAllSound()
{
  drumchantSound = loadSound('assets/audio/warfulllooped.wav');
  drumchantSound.setVolume(0.0);
  drumchantSound.addCue(0.01, onLoop, "drumchant");
  
  bugkillSound = loadSound('assets/audio/bugsplat.wav');
  bugwalkSound = loadSound('assets/audio/bugwalk.wav');
  fireSound = loadSound('assets/audio/fire.wav');
  iceSound = loadSound('assets/audio/ice.wav');
  successSound = loadSound('assets/audio/success.wav');
}


function playSound(soundName)
{
  if (soundName == "bugwalk" && !bugwalkSound.isPlaying())
    bugwalkSound.play();
  else if (soundName == "bugkill")
  	bugkillSound.play();
  else if (soundName == "fire")
  	fireSound.play();
  else if (soundName == "ice")
  	iceSound.play();
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
  if (soundName === "drumchant" && !drumchantSound.isPlaying())
    drumchantSound.loop();
}

function onLoop(soundname)
{
  if (soundname == "drumchant")
    tempo.resync();
}