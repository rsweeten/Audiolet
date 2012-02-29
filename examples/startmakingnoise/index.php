<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Audiolet - Template</title>
    <!-- Production -->
    <!--
    <script src="../../src/audiolet/Audiolet.min.js"></script>
    -->

    <!-- Development -->
      <script type="text/javascript" src="https://www.google.com/jsapi"></script>
      <script type="text/javascript">
          google.load("visualization", "1", {packages:["corechart"]});
      </script>
    <script src="../../src/audiolet/Audiolet.js"></script>


    <link rel="stylesheet" href="../support/main.css" />
    <!-- link href='http://fonts.googleapis.com/css?family=Lato:400,700|Inconsolata' rel='stylesheet' type='text/css' -->
  </head>
  <body>
    <div id="wrap">
      <header>
        <h1>Timeseries Envelope Test</h1>
      </header>
      <section id="abstract">
        <p>I'm getting a list of frequencies in a timeseries and converting it to an envelope, which would then
            control the pitch of a sine wave.
        </p>
      </section>
      <section id="play">
          <select id="word">
              <option value="0" selected="selected">I Love You</option>
              <option value="1">Disbelieve</option>
              <option value="2">choice</option>
              <option value="3">valleys</option>
          </select>
         <label for="propSeconds">Length in Seconds</label>
        <input id="propSeconds" type="number" maxlength="2" placeholder="Seconds" value="10" /><br/>
          <label for="propMinPitch">Lowest Frequency in Hertz</label>
        <input id="propMinPitch" type="number" maxlength="4" placeholder="Lowest Frequency in Hertz" value="300" /><br/>
          <label for="propMaxPitch">Highest Frequency in Hertz</label>
        <input id="propMaxPitch" type="number" maxlength="4" placeholder="Highest Frequency in Hertz" value="1000" /><br/>
        <button type="button" onclick="selectThenProcess()">&#9654; Scale and Play TimeSeries</button>
      </section>
      <section class="code-block">
        <div id="originalValues"></div>
          <div id="dspValues"></div>
          <div id="pitchValues"></div>
      </section>
    </div>
    <script src="../support/hijs.js" type="text/javascript" charset="utf-8"></script>
    <!-- Common -->

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>

    <script src="ts.js"></script>
    <script src="js/audiolet_app.js"></script>
  </body>
</html>