var apiKey = "cdc41e8f0bcf70b81699a9ee1f697257"

$(document).ready(function(){
    var searchHistory = JSON.parse(window.localStorage.getItem("searchHistory")) || [];
    for (var i = 0; i < searchHistory.length; i++){
        var listItem = $("<li>").addClass("list-group-item");
        var historyButton = $("<button>").text(searchHistory[i]).addClass("btn");
        historyButton.val(searchHistory[i]);
        listItem.append(historyButton);
        $(".searchHistory").append(listItem);
    }
    //need an on-click for the search button
    $("#searchButton").on("click", function(){
        var cityName = $("#city").val()
        console.log (cityName);
        weatherSearch(cityName);
        $("#city").val("");
        while (searchHistory.indexOf(cityName) === -1) {
            searchHistory.push(cityName);
            window.localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
            var listItem = $("<li>").addClass("list-group-item");
            var historyButton = $("<button>").text(searchHistory[i]).addClass("btn");
            historyButton.val(searchHistory[i]);
            listItem.append(historyButton);
            $(".searchHistory").append(listItem);

        };
    });

    $(".searchHistory").on("click", "button", function(){
        weatherSearch($(this).val());
    });
    //need a function that runs an ajax call for current weather
    function weatherSearch(city) { console.log (city);
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=cdc41e8f0bcf70b81699a9ee1f697257&units=imperial",
            method: "GET"
          }).then(function(response) {
            console.log(response);
            $("#currentWeather").empty();
            var uv = uvIndex(response.coord.lat, response.coord.lon);
            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var title = $("<h3>").text(response.name);
            var currentTemperature = $("<p>").text("Current Temp: " + response.main.temp);
            var currentHumidity = $("<p>").text("Current Humidity: " + response.main.humidity);
            var feels_like = $("<p>").text("Feels Like: " + response.main.feels_like);
            var temp_max = $("<p>").text("High of: " + response.main.temp_max);
            var temp_min = $("<p>").text("Low of: " + response.main.temp_min);
            cardBody.append(title, currentTemperature, feels_like, temp_max, temp_min, currentHumidity, uv);
            card.append(cardBody);
            $("#currentWeather").append(card);
            forecast(city);
        });
    }
    //need a function that runs the current weather for the UV index
    function uvIndex(lat, lon) {
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=cdc41e8f0bcf70b81699a9ee1f697257&lat=" + lat + "&lon=" + lon + "&units=imperial",
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var uv = $("<p> UV Index: </p>");
            var span = $("<span>" + response.value + "</span>");
            uv.append(span);
            if (response.value < 3) {
                span.addClass("green");
            }
            else if (response.value > 3 && response.value < 7){
                span.addClass("yellow");
            }
            else {
                span.addClass("red");
            }
            $("#currentWeather .card .card-body").append(uv);
            return uv;
        });
    }

    function forecast(city){
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=cdc41e8f0bcf70b81699a9ee1f697257&units=imperial",
            method: "GET"
        }).then(function(response) {
            console.log(response);
            $("#forecast").empty();
            var days = response.list.filter((day)=>{
                return day.dt_txt.includes("15:00:00")
            });
            for (var i = 0; i < days.length; i++){
                var col = $("<div>").addClass("col-sm-2 spacing");
                var cards = $("<div>").addClass("card sizing");
                var content = $("<div>").addClass("card-body");
                var date = $("<p>").text(new Date(days[i].dt_txt).toLocaleDateString());
                
                var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + days[i].weather[0].icon + ".png");
                
                var temp = $("<p>").text("Temp: " + days[i].main.temp + "°F");
                var humidity = $("<p>").text("Humidity: " + days[i].main.humidity + "%");
                content.append(date,temp,humidity,img);
                cards.append(content);
                col.append(cards);
                $("#forecast").append(col);
            }
        });
    }
    //need a function that runs a call for the forecast
    //set a local storage for the history of searches
    //need to make buttons for all of our search cities

});