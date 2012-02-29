var props = {
    seconds: 30.0,
    lowPitch: 200.0,
    highPitch: 600.0
};

$(document).ready( function(){

    //google.setOnLoadCallback(drawChart);
});


/**
 * Recursive function to process exponents from Python (1.29e-09)
 * @param value
 */
function parseExp(value){
    var v = value.toString();
    if(v.search('e') > 0){
        v = Math.pow(parseFloat(v.split('e')[0]),parseFloat(v.split('e')[1]));
        return parseExp(v);
    }else{
        return parseFloat(v);
    }
}

/**
 *
 *Function to scale and play a TimeSeries of Frequency values
 */
function parsePlayTS(ts){
    //Empty out the charts..
    //$('#originalValues, #dspValues, #pitchValues').empty();
    var Synth = function() {
        this.audiolet = new Audiolet();

        this.min = null, this.max = null;
        this.pitchPoints = [], this.dspPoints = [], this.timePoints = [], this.originalPoints = [];

        // Define a Sine Wave
        this.sine = new Sine(this.audiolet, 400);

        // Let's figure out the Time Increments for the Envelope
        this.audiolet.envelopeTimeIncrement = (ts.length / this.audiolet.device.sampleRate) * props.seconds;

        //this.synth.pitchPoints = [], this.timePoints = [], this.dspPoints = [];
        this.min = props.lowPitch, this.max = 0.0;

        // Parse the TimeSeries numbers from the "server" or ajax response

        // Build two arrays, pitchPoints and timePoints, that will be used to build the Envelope
        // Track the low and hi points from the TimeSeries (TODO: use low-hi for something in the future..)
        for(var i = 0; i < ts.length; i++){
            var parsed = parseExp(ts[i]);

            if(parsed < this.min) this.min = parsed;
            if(parsed > this.max) this.max = parsed;
            this.originalPoints.push(parsed);
            this.timePoints.push(this.audiolet.envelopeTimeIncrement);
        }

        // Normalize vals to range between 0-1 for general DSP processing parameters (pan, gain, etc. all happens
        // with 0-1)
        for(var i = 0; i < this.originalPoints.length; i++){
            this.dspPoints[i] = norm(this.originalPoints[i], this.min, this.max);
        }

        // Map pitchPoints array to a different range
        for(var i = 0; i < this.originalPoints.length; i++){
            this.pitchPoints[i] = map(this.originalPoints[i], this.min, this.max, props.lowPitch, props.highPitch);
        }

        // Make an Envelope from the pitchPoints and timePoints arrays.. with an onComplete
        // function that removes itself from the env.
        this.envelope = new Envelope(this.audiolet, 1, this.pitchPoints, this.timePoints);

        // The Signal Path
        // 1.  Attach the envelope to the Sine Wave
        this.envelope.connect(this.sine);

        // 2. Send the Sine wave to the output
        this.sine.connect(this.audiolet.output);

        // Draw Charts
        drawCharts(this.originalPoints, this.dspPoints, this.pitchPoints);
    };

    //Play
    this.synth = new Synth();
}


function selectThenProcess(){
    props.seconds = parseFloat(document.getElementById('propSeconds').value);
    props.lowPitch = parseFloat(document.getElementById('propMinPitch').value);
    props.highPitch = parseFloat(document.getElementById('propMaxPitch').value);
    var e = document.getElementById("word");
    //alert(ts[parseInt(e.options[e.selectedIndex].value)]);
    parsePlayTS(ts[parseInt(e.options[e.selectedIndex].value)]);
}

/**
 * ( begin auto-generated from norm.xml )
 *
 * Normalizes a number from another range into a value between 0 and 1.
 * <br/> <br/>
 * Identical to map(value, low, high, 0, 1);
 * <br/> <br/>
 * Numbers outside the range are not clamped to 0 and 1, because
 * out-of-range values are often intentional and useful.
 *
 * ( end auto-generated )
 * @webref math:calculation
 * @param value the incoming value to be converted
 * @param start lower bound of the value's current range
 * @param stop upper bound of the value's current range
 * @see PApplet#map(float, float, float, float, float)
 * @see PApplet#lerp(float, float, float)
 */
function norm(value, start, stop) {
    return (value - start) / (stop - start);
}

/**
 * ( begin auto-generated from map.xml )
 *
 * Re-maps a number from one range to another. In the example above,
 * the number '25' is converted from a value in the range 0..100 into
 * a value that ranges from the left edge (0) to the right edge (width)
 * of the screen.
 * <br/> <br/>
 * Numbers outside the range are not clamped to 0 and 1, because
 * out-of-range values are often intentional and useful.
 *
 * ( end auto-generated )
 * @webref math:calculation
 * @param value the incoming value to be converted
 * @param istart lower bound of the value's current range
 * @param istop upper bound of the value's current range
 * @param ostart lower bound of the value's target range
 * @param ostop upper bound of the value's target range
 * @see PApplet#norm(float, float, float)
 * @see PApplet#lerp(float, float, float)
 */
function map(value,
    istart, istop,
    ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

function drawCharts(original, dspPoints, pitchPoints) {
    var dataOriginal = new google.visualization.DataTable();
    var dspData = new google.visualization.DataTable();
    var pichData = new google.visualization.DataTable();

    var rowsA = [], rowsB = [], rowsC = [];

    dataOriginal.addColumn('number', 'Time');
    dataOriginal.addColumn('number', 'Frequency');

    dspData.addColumn('number', 'Time');
    dspData.addColumn('number', 'Frequency');

    pichData.addColumn('number', 'Time');
    pichData.addColumn('number', 'Frequency');

    for(var i = 0; i < original.length; i++){
        rowsA.push([i, original[i]]);
        rowsB.push([i, dspPoints[i]]);
        rowsC.push([i, pitchPoints[i]]);
    };

    dataOriginal.addRows(rowsA);
    dspData.addRows(rowsB);
    pichData.addRows(rowsC);

    var optionsA = {
        title: 'Original values'
    };
    var optionsB = {
        title: 'normalized to values between 0-1'
    };
    var optionsC = {
        title: 'mapped to values specified in the input fields above'
    };

    var chart1 = new google.visualization.LineChart(document.getElementById('originalValues'));
    var chart2 = new google.visualization.LineChart(document.getElementById('dspValues'));
    var chart3 = new google.visualization.LineChart(document.getElementById('pitchValues'));
    chart1.draw(dataOriginal, optionsA);
    chart2.draw(dspData, optionsB);
    chart3.draw(pichData, optionsC);
}
