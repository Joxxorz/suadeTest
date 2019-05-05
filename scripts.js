$(document).ready(function() {
    var barChart = document.getElementById('barChart');
    var lineChart = document.getElementById('lineChart');
    var globalData = [];

    function populateChart(labels, dataset, whichChart) {
        var chartType = (whichChart === barChart) ? 'bar' : 'line';
        var barChartOnClick = {
            'onClick' : (e, item) => {
                var heading = item[0]['_model'].label;
                highlightColumn(heading.toLowerCase());
            }
        };

        var myChart = new Chart(whichChart, {
            type: chartType,
            data: {
                labels,
                datasets: [{
                    label: 'Sample Charts',
                    data: dataset,
                }]
            },
            options: (whichChart === barChart) ? barChartOnClick : {}
        });
    }

    function drawOutHeadings() {
        var labels = [];
        var dataset = [];
        globalData.forEach(element => {
            var seperated = element.split(',');
            labels.push(seperated[0]);
            dataset.push(seperated[1]);
        });

        createTable(labels, dataset);
        populateChart(labels, dataset, barChart);
        populateChart(labels, dataset, lineChart);
    }
    
    function updateGlobals(value, heading, i) {
        var capitaliseHeading = heading.charAt(0).toUpperCase() + heading.slice(1)
        var newValue = capitaliseHeading + ',' + value;
        globalData[i] = newValue;
        drawOutHeadings();
    }

    function createTable(headings, data) {
        var htmlBuild = '<table cellspacing="0">';

        if(headings.length > 0) {
            htmlBuild += '<tr>';
            headings.forEach(heading => {
                htmlBuild += '<th class="table-cell" data-heading="' + heading.toLowerCase() + '">' + heading + '</th>';
            });
            htmlBuild += '</tr>';
        }
        
        if(data.length > 0) {
            htmlBuild += '<tr>';
            data.forEach(function(datapoint, i) {
                var relatedHeading = headings[i].toLowerCase();
                htmlBuild += '<td class="table-cell" data-heading="' + relatedHeading + '">';
                htmlBuild += '<input class="table-entry" data-heading="' + relatedHeading + '" data-number="' + i + '"';
                htmlBuild += 'value="' + datapoint + '" type="text" /></td>';
            });
            htmlBuild += '</tr>';
        }
        
        htmlBuild += '</table>';
        $('#tableSpace').html(htmlBuild);
    }

    function highlightColumn(heading) {
        $('.table-cell').each(function() {
            if($(this).data('heading') === heading) {
                $(this).toggleClass('highlighted');
            }else {
                $(this).removeClass('highlighted');
            }
        });
    }

    function validateEntry(value) {
        var regexPattern = new RegExp("/[^0-9\.]/g");
        return patt.test(value);
    }

    $('#fileupload').on('change', function(e) {
        var data = null;
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event) {
            var csvData = event.target.result;
            data = csvData.split('\n');
            globalData = data;
            $('#barChart').removeClass('hidden');
            $('#barChart').addClass('showing');
            $('#lineChart').removeClass('hidden');
            $('#lineChart').addClass('showing');
            drawOutHeadings();
        };
    });

    $('.table-entry').on('keypress keyup blur', function(e) {
        var newValue = e.target.value;
        if(validateEntry(newValue)){
            var heading = $(this).attr('heading');
            var number = $(this).attr('number');
            updateGlobals(newValue, heading, number);
        } else {
            alert('Numerical values only.')
        };
    });
});