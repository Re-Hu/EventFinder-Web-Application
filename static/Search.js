function search(){
    console.log("search")
    var keyword = document.getElementById("keyword").value;
    var category_c = document.getElementById("category").value;
    var distance = document.getElementById("distance").value;
    console.log("keyword:", keyword);
    console.log("category:", category_c);
    console.log("distance:", distance);
    keyword = keyword.replace(/[^\w\s]/g, '').split(" ").join("+");
    var category = ""
    if (category_c == "Music"){
        category = 'KZFzniwnSyZfZ7v7nJ';
    }
    if (category_c == 'Sports'){
        category = 'KZFzniwnSyZfZ7v7nE';
    }
    if (category_c == 'Arts' || category_c == 'Theatre'){
        category = 'KZFzniwnSyZfZ7v7na';
    }
    if (category_c == 'Film'){
        category = 'KZFzniwnSyZfZ7v7nn';
    }
    if (category_c == 'Miscellaneous'){
        category = 'KZFzniwnSyZfZ7v7n1';
    }
    if (distance == ''){
        distance = 10;
    }
    console.log("keyword:", keyword);
    console.log("category:", category);
    console.log("distance:", distance);


    // clearsearch()
    // get the latitude and longitude of the location
    if (document.getElementById("location").checked) {
        autoaddress_url = "https://ipinfo.io/?token=c4942fab9883b9"
        var response = fetch(autoaddress_url).then(response => response.json()).then(data => {
            var location = data.loc.split(",");
            var lat = location[0];
            var lng = location[1];
            console.log("Latitude:", lat);
            console.log("longitude:", lng);
            if (keyword == ''  || distance == ''){
                return;
            }
            searchevent(keyword, category, distance, lat, lng)
        })
    }
    else {
        var inputlocation = document.getElementById("inputlocation").value;
        inputlocation = inputlocation.replace(/[^\w\s]/g, '').split(" ").join("+");
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + inputlocation + "&key= " + "AIzaSyAUJrNuoPoEFfUEWZDCrk_HUacrFAw1B08";
        var result = fetch(url).then(response => response.json()).then(data => {
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            console.log("Latitude:", lat);
            console.log("longitude:", lng);
            searchevent(keyword, category, distance, lat, lng)
        })
    }
}

function searchevent(keyword, category, distance, lat, lng){
    console.log("search:", lat);
    var url = "https://hw6search.wl.r.appspot.com/search?keyword=" + keyword + "&category=" + category + "&distance=" + distance + "&latitude=" + lat + "&longitude=" + lng;
    // var url = "http://127.0.0.1:5000/search?keyword=" + keyword + "&category=" + category + "&distance=" + distance + "&latitude=" + lat + "&longitude=" + lng;
    console.log("url:", url);
    var result = fetch(url).then(response => response.json()).then(data => {
        console.log(data);
        clearsearch()
        if (data.page.totalElements == 0){
            var norecord = document.getElementById('NoRecordsFound')
            norecord.innerHTML = '<h3  class="norecords" align="center" style="padding-top: 20px;"> No Records Found </h3>'
        }
        else {
            var events = data._embedded.events;
            var result = document.getElementById('Result');
            var tabular_text = "";
            tabular_text += "<table class='tabular' id='searchtable'><tr><th>Date</th><th>Icon</th>";
            tabular_text += "<th id='sortevent' onclick=\"sorttable(2)\">Event</th>";
            tabular_text += "<th id='sortgenre' onclick=\"sorttable(3)\">Genre</th>";
            tabular_text += "<th id='sortvenue' onclick=\"sorttable(4)\">Venue</th></tr>";
            console.log("table link:", tabular_text);

            var limit = 20;
            if (events.length < 20) {
                limit = events.length;
            }
            tabular_text += "<tbody id='tablebody'>";
            for (let i = 0; i < limit; i++) {
                var localdate = '';
                var localtime = '';
                var image = '';
                var eventname = '';
                var genre = '';
                var venue = '';
                var id = '';
                // var newrow = tablebody.insertRow();
                // newrow.style.height = "100px";
                if (events[i].hasOwnProperty("dates")) {
                    if (events[i].dates.hasOwnProperty("start")) {
                        if (events[i].dates.start.hasOwnProperty("localDate")) {
                            localdate = events[i].dates.start.localDate;
                        }
                        if (events[i].dates.start.hasOwnProperty("localTime")) {
                            localtime = events[i].dates.start.localTime;
                        }
                    }
                }
                if (events[i].hasOwnProperty("images") && events[i].images.length > 0) {
                    if (events[i].images[0].hasOwnProperty("url")) {
                        image = events[i].images[0].url
                    }
                }
                if (events[i].hasOwnProperty("name")) {
                    eventname = events[i].name;
                }
                if (events[i].hasOwnProperty("classifications") && events[i].classifications.length > 0) {
                    if (events[i].classifications[0].hasOwnProperty("segment") && events[i].classifications[0].segment.hasOwnProperty("name")) {
                        genre = events[i].classifications[0].segment.name;
                    }
                }
                if (events[i].hasOwnProperty("_embedded") && events[i]._embedded.hasOwnProperty("venues") && events[i]._embedded.venues.length > 0) {
                    if (events[i]._embedded.venues[0].hasOwnProperty("name")) {
                        venue = events[i]._embedded.venues[0].name;
                    }
                }
                if (events[i].hasOwnProperty("id")) {
                    id = events[i].id;
                }
                console.log("image:", image);
                console.log("click", "eventdetail(" + id + ")");

                tabular_text += '<tr><td>' + localdate + "<br>" + localtime + '</td>';
                tabular_text += '<td><img src="' + image + '" style="width: 90px; height: 60px"></td>';
                tabular_text += '<td><a href="#" onClick="eventdetail(\'' + id + '\')" style="text-decoration: none; font-color: black">' + eventname + '</a></td>';
                tabular_text += '<td>' + genre + '</td>';
                tabular_text += '<td>' + venue + '</td></tr>';
            }
            tabular_text += '</tbody></table>';
            result.innerHTML = tabular_text;
        }
    })
}

function eventdetail(id) {
    // var url = "http://127.0.0.1:5000/searchevent?" + "&id=" + id;
    var url = "https://hw6search.wl.r.appspot.com/searchevent?" + "&id=" + id;
    var result = fetch(url).then(response => response.json()).then(data => {
        var detail = data;
        var eventname = detail.name;
        var date = '';
        var atristteam = '';
        var venue = '';
        var genre = '';
        var pricerange = '';
        var ticketstatus = '';
        var buyticketat = '';
        var seatmap = '';
        date = detail.dates.start.localDate + " " + detail.dates.start.localTime;
        if (detail.hasOwnProperty("_embedded") && detail._embedded.hasOwnProperty("attractions") && detail._embedded.attractions.length > 0) {
            for (let i = 0; i < detail._embedded.attractions.length; i++) {
                var arthtml = '<a href=' + detail._embedded.attractions[i].url + ' target="_blank">' + detail._embedded.attractions[i].name + '</a>';
                atristteam += arthtml;
                if (i != detail._embedded.attractions.length - 1) {
                    atristteam += " | ";
                }
            }
        }
        if (detail.hasOwnProperty("_embedded") && detail._embedded.hasOwnProperty("venues") && detail._embedded.venues.length > 0) {
            venue = detail._embedded.venues[0].name;
        }
        if (detail.hasOwnProperty("classifications") && detail.classifications.length > 0) {
            if (detail.classifications[0].hasOwnProperty("subGenre") && detail.classifications[0].subGenre.hasOwnProperty("name")) {
                if (genre != '') {
                    genre += " | ";
                }
                genre += detail.classifications[0].subGenre.name;
            }
            if (detail.classifications[0].hasOwnProperty("genre") && detail.classifications[0].genre.hasOwnProperty("name")) {
                if (genre != '') {
                    genre += " | ";
                }
                genre += detail.classifications[0].genre.name;
            }
            if (detail.classifications[0].hasOwnProperty("segment") && detail.classifications[0].segment.hasOwnProperty("name")) {
                if (genre != '') {
                    genre += " | ";
                }
                genre += detail.classifications[0].segment.name;
            }
            if (detail.classifications[0].hasOwnProperty("subType") && detail.classifications[0].subType.hasOwnProperty("name")) {
                if (genre != '') {
                    genre += " | ";
                }
                genre += detail.classifications[0].subType.name;
            }
            if (detail.classifications[0].hasOwnProperty("type") && detail.classifications[0].type.hasOwnProperty("name")) {
                if (genre != '') {
                    genre += " | ";
                }
                genre += detail.classifications[0].type.name;
            }
        }
        if (detail.hasOwnProperty("priceRanges") && detail.priceRanges.length > 0) {
            if (detail.priceRanges[0].hasOwnProperty("min") && detail.priceRanges[0].hasOwnProperty("max")) {
                pricerange = detail.priceRanges[0].min + " - " + detail.priceRanges[0].max + " " + detail.priceRanges[0].currency
            }
        }
        if (detail.hasOwnProperty("dates") && detail.dates.hasOwnProperty("status") && detail.dates.status.hasOwnProperty("code")) {
            ticketstatus = detail.dates.status.code;
        }
        if (detail.hasOwnProperty("url")) {
            buyticketat = detail.url;
        }
        if (detail.hasOwnProperty("seatmap") && detail.seatmap.hasOwnProperty("staticUrl")) {
            seatmap = detail.seatmap.staticUrl;
        }

        cleardetail();
        //create a new div to html and add the event detail to the div
        var detaildiv = document.getElementById("eventdetail");
        var newdiv = document.createElement("div");
        var divattr = document.createAttribute("class");
        divattr.value = "detailbox";
        newdiv.setAttributeNode(divattr);

        console.log("seatmap:", seatmap)
        var detailhtml = '';
        detailhtml += '<h1 id="detailtitle" align="center"> ' + eventname + '</h1>';
        detailhtml += '<div style="display: flex; flex-wrap: wrap;">';
        detailhtml += '<div style="flex: 1;  padding: 20px 100px 20px 20px;">'
        if (date != '') {
            detailhtml += '<div style="float:left; margin-top:20px; margin-left: 20px;"><h2>Date</h2>';
            detailhtml += '<p>' + date + '</p>';
        }
        if (atristteam != '') {
            detailhtml += '<h2>Artist/Team</h2>';
            detailhtml += '<p>' + atristteam + '</p>';
        }
        if (venue != '') {
            detailhtml += '<h2>Venue</h2>';
            detailhtml += '<p>' + venue + '</p>';
        }
        if (genre != '') {
            detailhtml += '<h2>Genre</h2>';
            detailhtml += '<p>' + genre + '</p>';
        }
        if (pricerange != '') {
            detailhtml += '<h2>Price Range</h2>';
            detailhtml += '<p>' + pricerange + '</p>';
        }
        if (ticketstatus != '') {
            var color = '';
        }
        detailhtml += '<h2>Ticket Status</h2>';
        if (ticketstatus == 'onsale') {
            color = 'green';
        } else if (ticketstatus == 'offsale') {
            color = 'red';
        } else if (ticketstatus == 'cancelled') {
            color = 'black';
        } else if (ticketstatus == 'rescheduled') {
            color = 'orange';
        } else if (ticketstatus == 'postponed') {
            color = 'orange';
        }
        detailhtml += '<p> <button style="width: auto; height:auto; background-color:' + color + '; border-radius: 5px; border: 0 solid lightgrey; color:white">' + ticketstatus + '</button></p>';
        if (buyticketat != '') {
            detailhtml += '<h2>Buy Ticket At</h2>';
            detailhtml += '<p> <a href=' + buyticketat + ' target="_blank">Ticketmaster</a></p>';
        }
        detailhtml += '<br></div></div>';
        detailhtml += '<div style="flex: 1; align: center; height: auto;">'
        if (seatmap != '') {
            detailhtml += '<img style="width: 400px; padding: 100px 100px 20px 100px;" src=' + seatmap + ' >';
        }
        detailhtml += '</div></div></div>';
        console.log("detailhtml-seat: ", detailhtml)
        console.log("detailhtml:", detailhtml)
        newdiv.innerHTML = detailhtml;
        detaildiv.appendChild(newdiv);

        var arrow = document.getElementById("arrdown");
        arrow.innerHTML = '<div class="Venue-Deatils-arrow"><h2 id="venuedatail-header">Show Venue details</h2><div class="arrow-down" id="arrowdown" style="align:center" onClick="showvenuedetails(\'' + venue + '\')"></div></div>';

        var scroll = document.getElementById("arrdown");
        if (scroll != null) {
            scroll.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

function showvenuedetails(venuename){
    console.log("venuename:", venuename)
    // var url = "http://127.0.0.1:5000/searchvenue?keyword=";
    var url = "https://hw6search.wl.r.appspot.com/searchvenue?keyword=";
    var keyword = venuename.split(' ').join('+');
    url += keyword;
    var result = fetch(url).then(response => response.json()).then(data => {
        console.log("data:", data)
        if (data.page.totalElements == 0){
            var arrow = document.getElementById("arrdown");
            arrow.innerHTML = ''
            var norecord = document.getElementById('novenue')
            norecord.innerHTML = "<h3  class='norecords' align='center' style='padding-top: 20px'> No Venue's Records Found </h3>"
            var scrollve = document.getElementById("novenue");
            if (scrollve != null) {
                scrollve.scrollIntoView();
            }
        }
        else{
            var venue = data._embedded.venues;
            for (var i = 0; i < venue.length; i++) {
                console.log("venue:", venue)
                var upcomingevents = '';
                var name = '';
                var address = '';
                var city = '';
                var postalcode = '';
                var map = '';
                var venueimg = '';
                if (venue[i].hasOwnProperty('url')) {
                    upcomingevents = venue[i].url;
                }
                if (venue[i].hasOwnProperty('name')) {
                    name = venue[i].name;
                    map += name.split(' ').join('+');
                }
                if (venue[i].hasOwnProperty('address') && venue[i].address.hasOwnProperty('line1')) {
                    address = venue[i].address.line1;
                    map += address.split(' ').join('+');
                }
                if (venue[i].hasOwnProperty('city') && venue[i].city.hasOwnProperty('name')) {
                    city += venue[i].city.name;
                    map += city.split(' ').join('+');
                }
                if (venue[i].hasOwnProperty('state') && venue[i].state.hasOwnProperty('stateCode')) {
                    if (city != '') {
                        city += ", ";
                    }
                    city += venue[i].state.stateCode;
                    map += city.split(' ').join('+');
                }
                if (venue[i].hasOwnProperty('postalCode')) {
                    postalcode = venue[i].postalCode;
                    map += postalcode.split(' ').join('+');
                }
                if (venue[i].hasOwnProperty('images') && venue[i].images.length > 0) {
                    venueimg = venue[i].images[0].url;
                }
            }
            console.log("name:", name)
            console.log("address:", address)
            console.log("city:", city)
            console.log("postalcode:", postalcode)

            var map_link = 'https://www.google.com/maps/search/?api=1&query=' + map;
            console.log("map:", map_link)
            var arrow = document.getElementById("arrdown");
            arrow.innerHTML = ''

            var venuediv = document.getElementById("venuedetail");
            var newve = document.createElement("div");
            var newattr = document.createAttribute("class");
            newattr.value = "Venue-Details";
            newve.setAttributeNode(newattr);

            var venuehtml = '';
            venuehtml += '<br><div class="Venueinsidebox"><h2>' + name + '</h2>';
            venuehtml += '<div style="width:100px; margin-top:0px; margin-bottom: 10px; margin-left:auto; margin-right:auto;"><img width=100px src="'+ venueimg +'"></div>'
            venuehtml += '<div style="display: flex; flex-wrap: wrap;">';
            venuehtml += '<div style="flex: 1; border-right: 2px solid darkgrey; padding-right: 10px; text-align: center;">';
            venuehtml += '<div style="display: flex; flex-wrap: wrap;">';
            venuehtml += '<div style="flex: 1; border-right: 0px solid black; padding-right: 10px;text-align:right;margin-top:0px;">';
            venuehtml += '<p> Address: </p> </div>'
            venuehtml += '<div style="flex: 2; border-left: 0px solid black; padding-left: 10px;text-align:left;margin-top:0px; ">'
            if (address != '') {
                venuehtml += '<p style=" font-size: 15px;">' + address + '</p>';
            }
            if (city != '') {
                venuehtml += '<p style=" font-size: 15px;">' + city + '</p>';
            }
            if (postalcode != '') {
                venuehtml += '<p style=" font-size: 15px;">' + postalcode + '</p>';
            }
            venuehtml += '</div></div>';
            venuehtml += '<a href='+ map_link + ' target="_blank">Open in Google Maps</a> </div>';
            venuehtml += '<div style="flex: 1; border-left: 0px solid lightgrey; padding-left: 10px;height: 50px;margin-top:20px; text-align:center;">'
            if (upcomingevents != '') {
                venuehtml += '<a href=' + upcomingevents + ' target="_blank">More Events at this venue</a>';
            }
            else{
                var alert = "No upcoming events at this venue";
                venuehtml += '<a>No upcoming events at this venue</a>';
            }
            venuehtml += '</div></div></div><br>';
            console.log("venuehtml:", venuehtml)
            newve.innerHTML = venuehtml;
            console.log("newve:", newve)
            venuediv.appendChild(newve);

            var scrollve = document.getElementById("venuedetail");
            if (scrollve != null) {
                scrollve.scrollIntoView();
            }
        }

    });
}

//reference: https://codepen.io/andrese52/pen/ZJENqp
function sorttable(n) {
    console.log("n:", n)
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("searchtable");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.getElementsByTagName("tr");

        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                  shouldSwitch = true;
                  break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                  shouldSwitch = true;
                  break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
            dir = "desc";
            switching = true;
            }
        }
    }
}

function locklocationinput(){
    console.log("locklocationinput")
    if (document.getElementById("location").checked){
        var pa = document.getElementById("inputlocation").parentNode;
        var inputloc = document.getElementById("inputlocation");
        pa.removeChild(inputloc);
    } else{
        if (document.getElementById("inputlocation") == null) {
            var tr = document.createElement("tr");
            tr.innerHTML = '<td colspan="2"><input style="width:700px; height:30px;" type="text" id="inputlocation" name="location" required ></td>'
            var ele = document.getElementById("space").parentNode;
            var addbefore = document.getElementById("space");
            ele.insertBefore(tr, addbefore);
        }
    }
}

function clearsearch(){
    var norecords = document.getElementById("NoRecordsFound");
    norecords.innerHTML = ''
    var results = document.getElementById("Result");
    results.innerHTML = ''
    cleardetail()
}

function cleardetail(){
    var eventdetail = document.getElementById("eventdetail");
    eventdetail.innerHTML = ''
    var arr = document.getElementById("arrdown");
    arr.innerHTML = ''
    var norecord = document.getElementById('novenue')
    norecord.innerHTML = ''
    var venuedetail = document.getElementById("venuedetail");
    venuedetail.innerHTML = ''
}

function clearall(){
    console.log("clear")
    // locklocationinput()
    clearsearch()
    document.getElementById("searchForm").reset();

    locklocationinput()
}
