document.addEventListener("DOMContentLoaded", async function () {
    const readMoreButtons = document.querySelectorAll(".read-more");
  
    readMoreButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
  
        const card = button.closest(".info-card");
        const extraText = card.querySelector(".extra-text");
  
        if (extraText.style.display === "none" || extraText.style.display === "") {
          extraText.style.display = "block";
          button.textContent = "Read less";
        } else {
          extraText.style.display = "none";
          button.textContent = "Read more";
        }
      });
    });

    // fetch isn't an option, so we go with absolute brimstone instead.
    const data = [
      {
        "url": "https://example.com/page1",
        "group": "Group A",
        "info1": "Value1",
        "info2": "Value2",
        "info3": "Value3",
        "info4": "Value4"
      },
      {
        "url": "https://test.org/demo",
        "group": "Group B",
        "info1": "UNSET",
        "info2": "UNSET",
        "info3": "UNSET",
        "info4": "UNSET"
      },
      {
          "url": "https://test.org/demo",
          "group": "Group B",
          "info1": "UNSET",
          "info2": "UNSET",
          "info3": "UNSET",
          "info4": "UNSET"
      },
      {
          "url": "https://test.org/demo",
          "group": "Group C",
          "info1": "UNSET",
          "info2": "UNSET",
          "info3": "UNSET",
          "info4": "UNSET"
      },
      {
          "url": "https://test.org/demo",
          "group": "Group C",
          "info1": "UNSET",
          "info2": "UNSET",
          "info3": "UNSET",
          "info4": "UNSET"
      },
      {
          "url": "https://test.org/demo",
          "group": "Group A",
          "info1": "UNSET",
          "info2": "UNSET",
          "info3": "UNSET",
          "info4": "UNSET"
      },
      {
          "url": "https://test.org/demo",
          "group": "Group B",
          "info1": "UNSET",
          "info2": "UNSET",
          "info3": "UNSET",
          "info4": "UNSET"
      }
    ]

    try {
      // Create the visualization
      createVisualization(data);
    } catch (error) {
      console.error('Error:', error);
      const visualization = document.getElementById('visualization');
      visualization.innerHTML = `<p style="color: red; padding: 10px;">Error loading visualization: ${error.message}</p>`;
    }

    function createVisualization(data) {
      // Check if D3 is loaded
      if (typeof d3 === 'undefined') {
        throw new Error('D3.js not loaded');
      }
    
      const node_size = 15;

      const container = d3.select("#visualization");
      const svg = container.select("svg");
      const infoDisplay = container.select(".info-display");
      
      // Get dimensions from container
      const width = parseInt(container.style("width"));
      const height = parseInt(container.style("height"));
      const center = { x: width / 2, y: height / 2 };
      
      // Set SVG background
      svg.style("background-color", "rgb(41, 41, 41)");

      // Create a color scale for groups
      const groups = [...new Set(data.map(d => d.group))];
      const colorScale = d3.scaleOrdinal()
        .domain(groups)
        .range(d3.schemeTableau10);
    
      // Create group centers with minimum distance from main center
      const minDistanceFromCenter = 100;
      const groupCenters = groups.map((group, i) => {
        // Calculate equal angles around the circle
        const angle = (i / groups.length) * Math.PI * 2;
        const distance = minDistanceFromCenter;
        
        return {
          id: group,
          x: center.x + Math.cos(angle) * distance,
          y: center.y + Math.sin(angle) * distance,
          color: colorScale(group)
        };
      });
    
      // Add invisible center point connections
      svg.selectAll(".center-connection")
        .data(groupCenters)
        .enter()
        .append("line")
        .attr("class", "center-connection")
        .attr("stroke", d => d.color)
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1)
        .attr("x1", center.x)
        .attr("y1", center.y)
        .attr("x2", d => d.x)
        .attr("y2", d => d.y);
    
      // Add invisible group centers
      const centers = svg.selectAll(".group-center")
        .data(groupCenters)
        .enter()
        .append("circle")
        .attr("class", "group-center")
        .attr("r", 1)
        .attr("fill", "none")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    
      // Add group labels
      svg.selectAll(".group-label")
        .data(groupCenters)
        .enter()
        .append("text")
        .attr("class", "group-label")
        .attr("x", d => d.x)
        .attr("y", d => d.y - 15)
        .attr("text-anchor", "middle")
        .attr("fill", d => d.color)
        .text(d => d.id);
    
      // Prepare node data with group references and default values
      const nodes = data.map(d => ({
        url: d.url,
        group: d.group,
        info1: d.info1 || "UNSET",
        info2: d.info2 || "UNSET",
        info3: d.info3 || "UNSET",
        info4: d.info4 || "UNSET",
        groupCenter: groupCenters.find(g => g.id === d.group),
        color: colorScale(d.group)
      }));
    
      // Create simulation
      const simulation = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-10))
      .force("center", d3.forceCenter(center.x, center.y).strength(0.02))
      .force("collision", d3.forceCollide().radius(node_size + 5).strength(0.7))
      .alphaDecay(0.05)
      .alphaTarget(0.3)
      .restart();
  
    
      // Add group forces - nodes attract to their group centers
      simulation.force("groupAttraction", d3.forceY()
        .y(d => d.groupCenter.y)
        .strength(0.15));
    
      simulation.force("groupAttractionX", d3.forceX()
        .x(d => d.groupCenter.x)
        .strength(0.15));
  
      // Force to keep groups separated using link forces
      const groupLinks = [];
      const minGroupDistance = 120; // Minimum distance between group centers
      
      // Create virtual links between all group centers
      for (let i = 0; i < groupCenters.length; i++) {
          for (let j = i + 1; j < groupCenters.length; j++) {
          groupLinks.push({
              source: groupCenters[i],
              target: groupCenters[j],
              distance: minGroupDistance
          });
          }
      }
  
      // Add group separation force
      simulation.force("groupSeparation", d3.forceLink(groupLinks)
          .id(d => d.id)
          .strength(0.8)
          .distance(minGroupDistance));
  
      // Force to maintain minimum distance from center
      simulation.force("centerDistance", d3.forceRadial()
          .radius(minDistanceFromCenter)
          .x(center.x)
          .y(center.y)
          .strength(0.15));
    
      // Add nodes to simulation
      simulation.nodes(nodes);
    
      // Create node elements
      const nodeElements = svg.selectAll(".node-group")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node-group");
    
      // Add circles
      nodeElements.append("circle")
        .attr("class", "node")
        .attr("r", node_size)
        .attr("fill", d => d.color)
        .on("mouseover", function(event, d) {
          // Highlight node
          d3.select(this)
            .attr("stroke", "white")
            .attr("stroke-width", 2);
          
          // Show info display
          infoDisplay.style("visibility", "visible")
            .html(`
              <div><strong>URL:</strong> ${d.url}</div>
              <div><strong>Group:</strong> ${d.group}</div>
              <div><strong>Info 1:</strong> ${d.info1}</div>
              <div><strong>Info 2:</strong> ${d.info2}</div>
              <div><strong>Info 3:</strong> ${d.info3}</div>
              <div><strong>Info 4:</strong> ${d.info4}</div>
            `);
        })
        .on("mouseout", function() {
          // Remove highlight
          d3.select(this)
            .attr("stroke", null);
          
          // Hide info display
          infoDisplay.style("visibility", "hidden");
        });
    
      // Add URL text to nodes
      nodeElements.append("text")
      .attr("class", "node-label")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("fill", "white") // Alternatively `.attr("fill", d => d3.color(d.color).darker(0.5))`, but that's hard to read
      .text(d => {
        // Extract domain from URL for cleaner display
        try {
          const urlObj = new URL(d.url);
          return urlObj.hostname.replace('www.', '');
        } catch {
          return d.url.length > 15 ? d.url.substring(0, 12) + '...' : d.url;
        }
      });
    
      // Add connection lines from nodes to group centers
      const connectionLines = svg.selectAll(".node-connection")
        .data(nodes)
        .enter()
        .append("line")
        .attr("class", "node-connection")
        .attr("stroke", d => d.color)
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1);
    
      // Update positions on each tick
      simulation.on("tick", () => {
        // Update node positions
        nodeElements
          .attr("transform", d => `translate(${d.x},${d.y})`);
    
        // Update connection lines
        connectionLines
          .attr("x1", d => d.x)
          .attr("y1", d => d.y)
          .attr("x2", d => d.groupCenter.x)
          .attr("y2", d => d.groupCenter.y);
    
        // Update group center positions
        centers
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
    
        // Update center connection lines
        svg.selectAll(".center-connection")
          .attr("x2", d => d.x)
          .attr("y2", d => d.y);
    
        // Update group labels
        svg.selectAll(".group-label")
          .attr("x", d => d.x)
          .attr("y", d => d.y - 15);
      });
    }
  });
  