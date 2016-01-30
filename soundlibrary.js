var drumchant;

function loadAllSound()
{
  drumchant = loadSound('assets/audio/warfulllooped.wav');
  drumchant.setVolume(0.0);
  drumchant.addCue(0.01, onLoop, "drumchant");
}


function playSound(soundName)
{
/*  if (soundName === "mario")
    if (!mario.isPlaying())
      mario.play();
    else 
      mario.stop();*/
}

function loopBackgroundMusic(soundName)
{
  if (soundName === "drumchant" && !drumchant.isPlaying())
    drumchant.loop();
}

function onLoop(soundname)
{
  if (soundname == "drumchant")
    tempo.resync();
}