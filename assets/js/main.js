document.addEventListener('DOMContentLoaded', function () {
    var el = document.querySelector('.splide');
    if (el) {
        new Splide(el, {
            type: 'loop',
            perPage: 1,
            autoplay: false,
            focus: 'center',
            pagination: false,
        }).mount();
    }

    const projectCards = document.querySelectorAll('.left__card, .right__card');
    if (projectCards.length > 0) {
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const url = card.getAttribute('data-url');
                if (url) {
                    window.location.href = url;
                }
            });
        });
    }

    var sliderNotas = document.querySelector('.slider__notas');
    if (sliderNotas) {
        new Splide(sliderNotas, {
            type: 'loop',
            perPage: 8,
            perMove: 1,
            autoplay: true,
            interval: 1000,
            pauseOnHover: true,
            pagination: false,
            arrows: false,
            gap: '1rem',
            breakpoints: {
                1200: {
                    perPage: 6
                },
                992: {
                    perPage: 4
                },
                768: {
                    perPage: 2
                },
            }
        }).mount();
    }

    var clientesCarousel = document.querySelector('#clientes-carousel');
    if (clientesCarousel) {
        new Splide(clientesCarousel, {
            type: 'loop',
            perPage: 5,
            perMove: 1,
            autoplay: true,
            interval: 2000,
            pauseOnHover: true,
            pagination: false,
            arrows: false,
            gap: '2rem',
            breakpoints: {
                1200: {
                    perPage: 4
                },
                992: {
                    perPage: 3
                },
                768: {
                    perPage: 2
                },
                576: {
                    perPage: 1
                }
            }
        }).mount();
    }

    var sliderOpiniones = document.querySelector('.slider__opiniones');
    if (sliderOpiniones) {
        new Splide(sliderOpiniones, {
            type: 'loop',
            perPage: 3,
            perMove: 1,
            autoplay: false,
            pauseOnHover: false,
            pagination: false,
            arrows: false,
            gap: '1rem',
            breakpoints: {
                1200: {
                    perPage: 3
                },
                992: {
                    perPage: 2
                },
                768: {
                    perPage: 1
                },
            }
        }).mount();
    }

    document.querySelectorAll(".line__porcentaje").forEach(line => {
        const span = line.querySelector("span");
        const number = line.querySelector(".number");
        if (span && number) {
            number.style.left = span.style.width;
        }
    });

    /* Mapas */
    var root2 = am5.Root.new("mapaRegional");

    var root = am5.Root.new("chartdiv");

    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    var chart = root.container.children.push(am5map.MapChart.new(root, {
        panX: "none",
        panY: "none",
        wheelX: "none",
        wheelY: "none",
        pinchZoom: false,
        projection: am5map.geoMercator(),

    }));

    var cont = chart.children.push(am5.Container.new(root, {
        layout: root.horizontalLayout,
        x: 20,
        y: 40
    }));


    var backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
    backgroundSeries.mapPolygons.template.setAll({
        fill: root.interfaceColors.get("alternativeBackground"),
        fillOpacity: 0,
        strokeOpacity: 0
    });

    backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180)
    });


    var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow
    }));

    polygonSeries.mapPolygons.template.setAll({
        fill: am5.color(0xd9782b),
        stroke: am5.color(0xffffff),
        strokeWidth: 0.5
    });


    var lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
    lineSeries.mapLines.template.setAll({
        stroke: root.interfaceColors.get("alternativeBackground"),
        strokeOpacity: 0.3
    });


    var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    pointSeries.bullets.push(function () {
        var circle = am5.Circle.new(root, {
            radius: 7,
            tooltipText: "Drag me!",
            cursorOverStyle: "pointer",
            tooltipY: 0,
            fill: am5.color(0xffba00),
            stroke: root.interfaceColors.get("background"),
            strokeWidth: 2,
            draggable: true
        });

        circle.events.on("dragged", function (event) {
            var dataItem = event.target.dataItem;
            var projection = chart.get("projection");
            var geoPoint = chart.invert({ x: circle.x(), y: circle.y() });

            dataItem.setAll({
                longitude: geoPoint.longitude,
                latitude: geoPoint.latitude
            });
        });

        return am5.Bullet.new(root, {
            sprite: circle
        });
    });

    var tokyo = addCity({ latitude: 35.6762, longitude: 139.6503 }, "Tokyo"); // Asia
    var dubai = addCity({ latitude: 25.2048, longitude: 55.2708 }, "Dubai");   // Asia (puente)
    var paris = addCity({ latitude: 48.8567, longitude: 2.351 }, "Paris");     // Europa
    var madrid = addCity({ latitude: 40.4168, longitude: -3.7038 }, "Madrid"); // Europa
    var newyork = addCity({ latitude: 40.7128, longitude: -74.006 }, "New York"); // América
    var mexico = addCity({ latitude: 19.4326, longitude: -99.1332 }, "Mexico");   // América
    var la = addCity({ latitude: 34.0522, longitude: -118.2437 }, "Los Angeles"); // América

    var lineDataItem = lineSeries.pushDataItem({
        pointsToConnect: [
            tokyo,    // Asia
            dubai,    // transición Asia → Europa
            paris,    // Europa
            madrid,   // Europa
            newyork,  // salto a América
            mexico,   // América
            la        // América
        ]
    });

    var planeSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    var plane = am5.Graphics.new(root, {
        svgPath:
            "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47",
        scale: 0.06,
        centerY: am5.p50,
        centerX: am5.p50,
        fill: am5.color(0x000000)
    });

    planeSeries.bullets.push(function () {
        var container = am5.Container.new(root, {});
        container.children.push(plane);
        return am5.Bullet.new(root, { sprite: container });
    });


    var planeDataItem = planeSeries.pushDataItem({
        lineDataItem: lineDataItem,
        positionOnLine: 0,
        autoRotate: true
    });
    planeDataItem.dataContext = {};

    planeDataItem.animate({
        key: "positionOnLine",
        to: 1,
        duration: 20000,
        loops: Infinity,
        easing: am5.ease.linear
    });

    planeDataItem.on("positionOnLine", (value) => {
        if (planeDataItem.dataContext.prevPosition < value) {
            plane.set("rotation", 0);
        }

        if (planeDataItem.dataContext.prevPosition > value) {
            plane.set("rotation", -180);
        }
        planeDataItem.dataContext.prevPosition = value;
    });

    function addCity(coords, title) {
        return pointSeries.pushDataItem({
            latitude: coords.latitude,
            longitude: coords.longitude
        });
    }

    chart.appear(1000, 100);

    // =======================
    // MAPA REGIONAL
    // =======================

    var chart2 = root2.container.children.push(am5map.MapChart.new(root2, {
        panX: "none",
        panY: "none",
        wheelX: "none",
        wheelY: "none",
        pinchZoom: false,
        projection: am5map.geoMercator(),
        homeZoomLevel: 4,
        homeGeoPoint: {
            latitude: 28,
            longitude: -102
        }
    }));


    var polygonSeries2 = chart2.series.push(
        am5map.MapPolygonSeries.new(root2, {
            geoJSON: am5geodata_worldLow
        })
    );

    var lineSeries2 = chart2.series.push(
        am5map.MapLineSeries.new(root2, {})
    );

    var pointSeries2 = chart2.series.push(
        am5map.MapPointSeries.new(root2, {})
    );

    var planeSeries2 = chart2.series.push(
        am5map.MapPointSeries.new(root2, {})
    );
    //color mapa
    polygonSeries2.mapPolygons.template.setAll({
        fill: am5.color(0xd9782b),
        stroke: am5.color(0xffffff),
        strokeWidth: 0.5
    });

    lineSeries2.mapLines.template.setAll({
        stroke: am5.color(0xd9782b),
        strokeWidth: 2,
        strokeOpacity: 0.6
    });

    pointSeries2.bullets.push(function () {
        var circle = am5.Circle.new(root2, {
            radius: 6,
            fill: am5.color(0x1c1c1c),
            stroke: am5.color(0xffffff),
            strokeWidth: 2
        });

        return am5.Bullet.new(root2, {
            sprite: circle
        });
    });

    function addCity2(coords) {
        return pointSeries2.pushDataItem({
            latitude: coords.latitude,
            longitude: coords.longitude
        });
    }

    var la2 = addCity2({ latitude: 34.0522, longitude: -118.2437 });
    var texas2 = addCity2({ latitude: 31.9686, longitude: -99.9018 });
    var mexico2 = addCity2({ latitude: 19.4326, longitude: -99.1332 });
    var cancun2 = addCity2({ latitude: 21.1619, longitude: -86.8515 });

    var lineDataItem2 = lineSeries2.pushDataItem({
        pointsToConnect: [la2, texas2, mexico2, cancun2]
    });
    //avión
    var plane2 = am5.Graphics.new(root2, {
        svgPath: "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47",
        scale: 0.06,
        centerY: am5.p50,
        centerX: am5.p50,
        fill: am5.color(0x1c1c1c)
    });

    planeSeries2.bullets.push(function () {
        var container = am5.Container.new(root2, {});
        container.children.push(plane2);
        return am5.Bullet.new(root2, { sprite: container });
    });

    var planeDataItem2 = planeSeries2.pushDataItem({
        lineDataItem: lineDataItem2,
        positionOnLine: 0,
        autoRotate: true
    });

    planeDataItem2.animate({
        key: "positionOnLine",
        to: 1,
        duration: 10000,
        loops: Infinity,
        easing: am5.ease.linear
    });


chart2.events.on("ready", function () {
    chart2.goHome();
});




});
