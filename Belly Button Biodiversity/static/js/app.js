function Plots(input) {
    //Use the D3 library to read in `samples.json`.
    d3.json("samples.json").then((samples_data) => {
   // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual  
      // Define variables for barplot  
      var Subjects = samples_data.samples;
      var ids = Subjects.filter(otu => otu.id == input);
      // Use `sample_values` as the values for the bar chart.
      var otu_values = ids[0].sample_values;
      // Use `otu_ids` as the labels for the bar chart.
      var otu_ids = ids[0].otu_ids;
      // Use `otu_labels` as the hovertext for the chart.
      var otu_labels = ids[0].otu_labels;
      //define labels for otu ids
      var yValues = otu_ids.slice(0, 10).map(otu => "OTU " + otu).reverse()
      //Define traces and filters for top 10 values
      var dataTrace = {
        x: otu_values.slice(0, 10).reverse(),     
        y: yValues,    
        text: otu_labels.slice(0, 10).reverse(),     
        type: "bar", 
        orientation: "h" 
      };

      var layout = {
        margin: {
            t: 10
        }
      }
      var data = [dataTrace];
      Plotly.newPlot("bar", data, layout);
    
      var piePlot = [
        {
          values: otu_values.slice(0,10),
          labels: otu_ids.slice(0, 10),
          hovertext: otu_labels.slice(0,10),
          hoverinfo: "hovertext",
          type: "pie"
        }
      ];
  
      var Layoutp = {
        margin: {t: 0, l: 0}
      };
  
      Plotly.newPlot("pie", piePlot, Layoutp);

    // Create a bubble chart that displays each sample.
      var BubblePlot = {
        // Use `otu_ids` for the x values.
        x: otu_ids,
        // Use `sample_values` for the y values.
        y: otu_values,
        // Use `sample_values` for the marker size.
        text: otu_labels,
        mode: "markers",
        marker: {
          size: otu_values, 
          color: otu_ids,
          colorscale: "Earth"
        }
      }
  
      var Layoutb = {
        margin: {
          t: 10
        },
        hovermode: "closest",
        xaxis: {
          title: "OTU ID"
        }
      }
      Plotly.newPlot("Bubble", [BubblePlot], Layoutb)
    });
  };
  


  // function to change the visualisations based on the selected id
  function optionChanged(userInput) {
    Plots(userInput);
    // select div with panel body
    var panelBody = d3.select(".panel-body");
    //clear panel body after change of input
    panelBody.html("");
    demoInfo(userInput);
  };
  // Display the sample metadata, i.e., an individual's demographic information.
  defaultfunction();
  function demoInfo(idInput) {  
    d3.json("samples.json").then((samples_data) => { 
        var metadata = samples_data.metadata;
        var ids = metadata.filter(x => x.id == idInput);
        var ResultId = ids[0];
        htmlEntry = d3.select("#sample-metadata");
        Object.entries(ResultId).forEach(([key, value]) => {
          htmlEntry.append("p").text(`${key}:${value}`)    });
      });
    };
  
  // Update all of the plots any time that a new sample is selected.
  function defaultfunction() {
    d3.json("samples.json").then((data) => {
      var names = data.names;
      names.forEach((name) => {
        d3.select("#selDataset").append("option").text(name).property("value", name);    });
      Plots(data.names[0]);
      demoInfo(data.names[0]);
      
    });
  };