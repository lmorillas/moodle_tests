/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 97.32824427480917, "KoPercent": 2.6717557251908395};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9732633587786259, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Frontpage logged-0"], "isController": false}, {"data": [1.0, 500, 1500, "Frontpage logged-1"], "isController": false}, {"data": [1.0, 500, 1500, "View a forum discussion"], "isController": false}, {"data": [1.0, 500, 1500, "View course participants"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-2"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "View course once more"], "isController": false}, {"data": [1.0, 500, 1500, "View course once more-1"], "isController": false}, {"data": [1.0, 500, 1500, "View course once more-2"], "isController": false}, {"data": [1.0, 500, 1500, "View course once more-0"], "isController": false}, {"data": [1.0, 500, 1500, "View course again-1"], "isController": false}, {"data": [1.0, 500, 1500, "View course-0"], "isController": false}, {"data": [1.0, 500, 1500, "View course again-2"], "isController": false}, {"data": [1.0, 500, 1500, "View course-1"], "isController": false}, {"data": [1.0, 500, 1500, "View course-2"], "isController": false}, {"data": [1.0, 500, 1500, "View course again-0"], "isController": false}, {"data": [1.0, 500, 1500, "Frontpage logged"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Fill a form to reply a forum discussion-2"], "isController": false}, {"data": [1.0, 500, 1500, "View login page"], "isController": false}, {"data": [1.0, 500, 1500, "Fill a form to reply a forum discussion"], "isController": false}, {"data": [1.0, 500, 1500, "Fill a form to reply a forum discussion-0"], "isController": false}, {"data": [1.0, 500, 1500, "Fill a form to reply a forum discussion-1"], "isController": false}, {"data": [1.0, 500, 1500, "View course participants-0"], "isController": false}, {"data": [1.0, 500, 1500, "View a forum activity-0"], "isController": false}, {"data": [1.0, 500, 1500, "View course participants-2"], "isController": false}, {"data": [1.0, 500, 1500, "View course participants-1"], "isController": false}, {"data": [1.0, 500, 1500, "View a forum activity-2"], "isController": false}, {"data": [1.0, 500, 1500, "View a forum activity-1"], "isController": false}, {"data": [1.0, 500, 1500, "View login page-1"], "isController": false}, {"data": [1.0, 500, 1500, "View login page-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "View a page activity-2"], "isController": false}, {"data": [1.0, 500, 1500, "View a page activity-1"], "isController": false}, {"data": [1.0, 500, 1500, "View a forum discussion-2"], "isController": false}, {"data": [1.0, 500, 1500, "View a page activity-0"], "isController": false}, {"data": [1.0, 500, 1500, "View a forum discussion-1"], "isController": false}, {"data": [1.0, 500, 1500, "View a forum discussion-0"], "isController": false}, {"data": [1.0, 500, 1500, "View a forum activity"], "isController": false}, {"data": [1.0, 500, 1500, "View course again"], "isController": false}, {"data": [1.0, 500, 1500, "View a page activity"], "isController": false}, {"data": [0.9991666666666666, 500, 1500, "Frontpage not logged"], "isController": false}, {"data": [1.0, 500, 1500, "Frontpage not logged-0"], "isController": false}, {"data": [1.0, 500, 1500, "Frontpage not logged-1"], "isController": false}, {"data": [1.0, 500, 1500, "Send the forum discussion reply"], "isController": false}, {"data": [1.0, 500, 1500, "View course"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 26200, 700, 2.6717557251908395, 125.21500000000013, 0, 581, 238.0, 254.0, 287.0, 6.895872846421542, 111.61388547988432, 1.878419025410502], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Frontpage logged-0", 600, 0, 0.0, 59.359999999999964, 51, 99, 64.0, 71.8499999999998, 82.99000000000001, 0.1809921992362129, 0.06539757198964724, 0.021386773542560317], "isController": false}, {"data": ["Frontpage logged-1", 600, 0, 0.0, 159.05833333333328, 138, 231, 190.0, 197.0, 206.98000000000002, 0.18098635755001183, 5.48102337303068, 0.03499540897939681], "isController": false}, {"data": ["View a forum discussion", 500, 0, 0.0, 236.61199999999985, 211, 294, 251.0, 265.0, 281.99, 0.1657685327561936, 5.014174349209317, 0.09421609967197724], "isController": false}, {"data": ["View course participants", 500, 0, 0.0, 243.54800000000017, 207, 328, 278.0, 284.0, 312.99, 0.1661540261114375, 5.024861536061572, 0.0924880809409369], "isController": false}, {"data": ["Login-0", 600, 0, 0.0, 59.530000000000015, 51, 106, 64.0, 72.94999999999993, 82.0, 0.18348988588458182, 0.06898789654840234, 0.0578781573639843], "isController": false}, {"data": ["Logout-2", 500, 0, 0.0, 93.4739999999999, 85, 114, 99.0, 100.0, 106.0, 0.1670528371418596, 5.05905813731075, 0.03230123218172676], "isController": false}, {"data": ["Login-1", 600, 0, 0.0, 134.35500000000002, 120, 212, 143.0, 148.0, 161.98000000000002, 0.1834851724103132, 5.324295325195359, 0.038166349339254606], "isController": false}, {"data": ["Logout-1", 500, 0, 0.0, 109.25600000000003, 88, 214, 140.0, 148.0, 160.99, 0.16705177669587623, 0.1486173521190852, 0.03654257615222293], "isController": false}, {"data": ["Logout-0", 500, 0, 0.0, 59.38399999999998, 51, 165, 64.0, 68.0, 81.97000000000003, 0.1670538976013065, 0.06460287446300525, 0.023981370065812555], "isController": false}, {"data": ["View course once more", 500, 0, 0.0, 243.97000000000006, 208, 325, 282.90000000000003, 290.0, 313.97, 0.16587940301993406, 5.016718000121424, 0.0926591977806663], "isController": false}, {"data": ["View course once more-1", 500, 0, 0.0, 110.99800000000002, 88, 178, 144.0, 151.95, 162.99, 0.16588727296253103, 0.14012938585213805, 0.035315845220538836], "isController": false}, {"data": ["View course once more-2", 500, 0, 0.0, 73.45400000000006, 65, 86, 79.0, 80.0, 84.0, 0.16588842875125162, 4.813680441322941, 0.03450608918360996], "isController": false}, {"data": ["View course once more-0", 500, 0, 0.0, 59.25599999999998, 51, 114, 64.0, 70.0, 82.98000000000002, 0.16588941944011656, 0.06318054060707565, 0.022842195450250426], "isController": false}, {"data": ["View course again-1", 500, 0, 0.0, 107.18599999999994, 89, 177, 140.0, 149.0, 165.97000000000003, 0.1657768318920143, 0.14003609334628161, 0.03529233335201085], "isController": false}, {"data": ["View course-0", 600, 0, 0.0, 59.205000000000034, 51, 104, 64.0, 72.89999999999986, 83.0, 0.17912896748271853, 0.0682229465998635, 0.024665219155335268], "isController": false}, {"data": ["View course again-2", 500, 0, 0.0, 73.27399999999993, 65, 85, 78.0, 80.0, 84.0, 0.16577804110698618, 4.810477259231433, 0.034483127691199274], "isController": false}, {"data": ["View course-1", 600, 0, 0.0, 106.27666666666666, 89, 181, 138.0, 144.0, 155.99, 0.17912559839145212, 0.1513121509849669, 0.038134160595055235], "isController": false}, {"data": ["View course-2", 600, 0, 0.0, 73.68500000000006, 65, 92, 79.0, 81.0, 85.99000000000001, 0.17912709574970212, 5.197834495221336, 0.03725983534637359], "isController": false}, {"data": ["View course again-0", 500, 0, 0.0, 59.11999999999998, 51, 88, 63.0, 69.94999999999999, 82.99000000000001, 0.16578106422159491, 0.06313927250627151, 0.022827275444575083], "isController": false}, {"data": ["Frontpage logged", 600, 0, 0.0, 218.56333333333328, 192, 299, 250.89999999999998, 257.0, 269.99, 0.1809831365946092, 5.546320126440852, 0.056380488841484715], "isController": false}, {"data": ["Login", 600, 600, 100.0, 194.06333333333333, 173, 286, 206.0, 216.0, 234.97000000000003, 0.18348146913612337, 5.393172597195486, 0.09604108150093958], "isController": false}, {"data": ["Fill a form to reply a forum discussion-2", 500, 0, 0.0, 72.87800000000009, 65, 86, 78.0, 80.94999999999999, 83.99000000000001, 0.16578194369382065, 4.8105905028497915, 0.0344839394597498], "isController": false}, {"data": ["View login page", 600, 0, 0.0, 200.48333333333352, 82, 294, 233.0, 242.94999999999993, 256.96000000000004, 0.1862323975465744, 5.474032161869475, 0.06347178392944772], "isController": false}, {"data": ["Fill a form to reply a forum discussion", 500, 0, 0.0, 238.63399999999993, 207, 296, 273.0, 280.95, 287.99, 0.16577210513001672, 5.01444429336159, 0.09454190370696267], "isController": false}, {"data": ["Fill a form to reply a forum discussion-0", 500, 0, 0.0, 58.94200000000002, 51, 88, 64.0, 68.0, 80.0, 0.16578144898954547, 0.0641107947264258, 0.023798704102991397], "isController": false}, {"data": ["Fill a form to reply a forum discussion-1", 500, 0, 0.0, 106.47399999999999, 87, 155, 137.0, 145.0, 152.98000000000002, 0.16577897551245596, 0.1400379041194086, 0.03626415089334974], "isController": false}, {"data": ["View course participants-0", 500, 0, 0.0, 59.536000000000044, 51, 108, 64.0, 69.94999999999999, 81.99000000000001, 0.16616551148403083, 0.06312342184305468, 0.02271794102320734], "isController": false}, {"data": ["View a forum activity-0", 500, 0, 0.0, 58.90400000000001, 51, 105, 63.900000000000034, 65.0, 78.99000000000001, 0.1657817238248894, 0.0639490047957337, 0.02363684734222056], "isController": false}, {"data": ["View course participants-2", 500, 0, 0.0, 73.22199999999997, 66, 88, 78.0, 79.0, 82.99000000000001, 0.16616319219431788, 4.821653735535494, 0.034563242126357134], "isController": false}, {"data": ["View course participants-1", 500, 0, 0.0, 110.5360000000001, 88, 176, 144.0, 148.0, 168.99, 0.16616148037915393, 0.14036101614059387, 0.035211954338160545], "isController": false}, {"data": ["View a forum activity-2", 500, 0, 0.0, 72.91199999999998, 65, 92, 78.0, 79.0, 84.0, 0.16578067945543037, 4.810554141503923, 0.03448367648828776], "isController": false}, {"data": ["View a forum activity-1", 500, 0, 0.0, 113.0619999999999, 92, 173, 146.0, 151.0, 165.94000000000005, 0.16577870068622436, 0.1400376719663907, 0.036102197512722686], "isController": false}, {"data": ["View login page-1", 600, 0, 0.0, 141.3149999999999, 49, 198, 173.0, 180.89999999999986, 189.99, 0.18623430510393735, 5.404068497908589, 0.038738190417127595], "isController": false}, {"data": ["View login page-0", 600, 0, 0.0, 59.00166666666662, 29, 102, 64.0, 70.0, 82.99000000000001, 0.1862411263863324, 0.0700222984948613, 0.02473514959818477], "isController": false}, {"data": ["Logout", 600, 100, 16.666666666666668, 218.70000000000005, 0, 392, 294.0, 304.94999999999993, 327.98, 0.16093393179298102, 4.26417293169052, 0.07452100194515479], "isController": false}, {"data": ["View a page activity-2", 500, 0, 0.0, 73.37000000000005, 64, 89, 78.0, 80.0, 84.0, 0.16520351420915425, 4.793805880088681, 0.03436362160795884], "isController": false}, {"data": ["View a page activity-1", 500, 0, 0.0, 111.834, 92, 208, 143.0, 150.0, 162.96000000000004, 0.1652020950268883, 0.13955059784986168, 0.035815297945282425], "isController": false}, {"data": ["View a forum discussion-2", 500, 0, 0.0, 72.93599999999999, 64, 85, 78.0, 79.0, 84.0, 0.16577661203664193, 4.810435791071073, 0.03448283043340306], "isController": false}, {"data": ["View a page activity-0", 500, 0, 0.0, 59.25600000000002, 51, 167, 64.0, 69.94999999999999, 80.99000000000001, 0.16520722603190086, 0.0635660615786806, 0.023393601342407835], "isController": false}, {"data": ["View a forum discussion-1", 500, 0, 0.0, 104.16400000000002, 92, 154, 113.0, 119.0, 142.94000000000005, 0.16577540284251768, 0.1400348861902127, 0.03610147932996235], "isController": false}, {"data": ["View a forum discussion-0", 500, 0, 0.0, 59.27000000000002, 51, 95, 64.0, 69.94999999999999, 84.0, 0.165779580133373, 0.06394817788347884, 0.02363654169870357], "isController": false}, {"data": ["View a forum activity", 500, 0, 0.0, 245.11200000000005, 212, 325, 278.0, 290.0, 313.93000000000006, 0.16577128072239145, 5.014257793591713, 0.09421766150432795], "isController": false}, {"data": ["View course again", 500, 0, 0.0, 239.85399999999987, 208, 331, 273.0, 287.0, 308.99, 0.1657694670544788, 5.013393188681791, 0.09259778823746277], "isController": false}, {"data": ["View a page activity", 500, 0, 0.0, 244.71799999999996, 212, 371, 278.90000000000003, 287.0, 306.98, 0.16519494490253, 4.996663113736389, 0.09356744926119866], "isController": false}, {"data": ["Frontpage not logged", 600, 0, 0.0, 228.67499999999998, 191, 581, 262.0, 270.94999999999993, 298.9000000000001, 0.18913745753864078, 5.8102509783134995, 0.04469850070737409], "isController": false}, {"data": ["Frontpage not logged-0", 600, 0, 0.0, 59.19500000000003, 51, 101, 63.0, 69.94999999999993, 83.95000000000005, 0.18914705710822521, 0.06834415149418294, 0.022350384677827392], "isController": false}, {"data": ["Frontpage not logged-1", 600, 0, 0.0, 169.12666666666667, 138, 477, 202.0, 208.94999999999993, 225.98000000000002, 0.18914365839142144, 5.742098543373163, 0.022349983071642574], "isController": false}, {"data": ["Send the forum discussion reply", 500, 0, 0.0, 60.03399999999998, 51, 154, 64.0, 74.94999999999999, 86.0, 0.16580690260767833, 0.0628252716911906, 0.08921836263362379], "isController": false}, {"data": ["View course", 600, 0, 0.0, 239.47833333333327, 210, 311, 271.0, 279.0, 299.94000000000005, 0.1791183258645967, 5.417104915723335, 0.10005437733842706], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.URISyntaxException\/Non HTTP response message: Illegal character in query at index 51: http:\\\/\\\/centro1.catedu.es\\\/login\\\/logout.php?sesskey=${SESSION_SESSKEY}", 100, 14.285714285714286, 0.3816793893129771], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;div class=&quot;logininfo&quot;&gt;You are logged in as\\\/", 600, 85.71428571428571, 2.2900763358778624], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 26200, 700, "Test failed: text expected to contain \\\/&lt;div class=&quot;logininfo&quot;&gt;You are logged in as\\\/", 600, "Non HTTP response code: java.net.URISyntaxException\/Non HTTP response message: Illegal character in query at index 51: http:\\\/\\\/centro1.catedu.es\\\/login\\\/logout.php?sesskey=${SESSION_SESSKEY}", 100, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 600, 600, "Test failed: text expected to contain \\\/&lt;div class=&quot;logininfo&quot;&gt;You are logged in as\\\/", 600, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout", 600, 100, "Non HTTP response code: java.net.URISyntaxException\/Non HTTP response message: Illegal character in query at index 51: http:\\\/\\\/centro1.catedu.es\\\/login\\\/logout.php?sesskey=${SESSION_SESSKEY}", 100, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
