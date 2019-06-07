function buildMetadata(sample) {

  var panelBody = d3.select("#sample-metadata");
  // Use `.html("") to clear any existing metadata
  panelBody.html("")

  d3.csv("../Data/schools_complete.csv").then( (itemNames) => {
    for (var i = 0; i < itemNames.length; i++ ){
       if (sample === itemNames[i].school_name) {
         sample = itemNames[i];
         panelBody.append('p')
           .text('School Name: ' + sample.school_name)
         panelBody.append('p')
           .text('School Type: ' + sample.type)
         panelBody.append('p')
           .text('School Size: ' + sample.size)
         panelBody.append('p')
           .text('School Budget: ' + sample.budget)
         break;
       }
   }
 });

}

function buildCharts(sample) {

    d3.csv("../Data/students_complete.csv").then((data) => {

      var valuesBySchool;
      //Filter by school
      data = data.filter(function(d) { return d.school_name  == sample;});
        valuesBySchool = d3.nest()
        //set the city type as key
        .key(function(d) {return d.grade;}) 
        //rollup and sum fare values by city type
        .rollup(function(d) {
          return d3.mean(d, function(e) { return e.math_score; })})
        .entries(data);
      
        //console.log(valuesBySchool)

        keys = []
        values = []
        
        for (i=0; i<valuesBySchool.length; i++) {
          keys.push(valuesBySchool[i].key);
          values.push(valuesBySchool[i].value);
        }

        var bubbletrace = {
          x: keys,
          y: values,
          mode: "markers",
          type: "scatter",
          name: "Grades",
          marker: {
            color: "#2077b4",
            symbol: "circle",
            size: 20
          }
        };

        // Create the data array for the plot
        var data = [bubbletrace];

        // Define the plot layout
        var layout = {
          title: "High school math scores",
          xaxis: { title: "Grade" },
          yaxis: { title: "Math Score" }
        };

        // Plot the chart to a div tag with id "plot"
        Plotly.newPlot("bubble", data, layout);

        // console.log(keys);
        // console.log(values);
     });


    d3.csv("../Data/students_complete.csv").then((data) => {

      var valuesBySchool;
      //Filter by school
      data = data.filter(function(d) { return d.school_name  == sample;});
        //group and organize data here
        valuesBySchool = d3.nest()
        //set the city type as key
        .key(function(d) {return d.grade;}) 
        //rollup and sum fare values by city type
        .rollup(function(d) {
          return d3.mean(d, function(e) { return e.reading_score; })})
        .entries(data);
      
        //console.log(valuesBySchool)

        keys = []
        values = []
        
        for (i=0; i<valuesBySchool.length; i++) {
          keys.push(valuesBySchool[i].key);
          values.push(valuesBySchool[i].value);
        }

        // console.log(keys);
        // console.log(values);

      //Note specific naming "labels" and "values" for the pie chart
      var pietrace = {
        labels: keys,
        values: values,
        type: "pie"
      };
      
      var data = [pietrace];
      
      var layout = {
        title: "High school reading scores"
      };
      
      Plotly.newPlot("pie", data, layout);

     });
 
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
   d3.csv("../Data/schools_complete.csv").then( (itemNames) => { 
    itemNames.forEach((dataItem) => {
       selector
       .append("option")
       .text(dataItem.school_name)
       .property("value", dataItem.school_name);
    });

  // Use the first sample from the list to build the initial plots
  const firstSample = itemNames[0].school_name;
  //console.log(firstSample);
  buildCharts(firstSample);
  buildMetadata(firstSample);
 });

}

function optionChanged(newSample) {
  // Fetch new data each time a new sample number is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
