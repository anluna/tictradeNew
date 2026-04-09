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

    // MAPA NACIONAL - México y Estados Unidos con TREN (Ruta extendida)
    var rootNacional = am5.Root.new("mapaRegional");

    rootNacional.setThemes([
        am5themes_Animated.new(rootNacional)
    ]);

    var chartNacional = rootNacional.container.children.push(am5map.MapChart.new(rootNacional, {
        panX: "none",
        panY: "none",
        wheelX: "none",
        wheelY: "none",
        pinchZoom: false,
        projection: am5map.geoMercator()
    }));

    // Fondo
    var backgroundSeries = chartNacional.series.push(am5map.MapPolygonSeries.new(rootNacional, {}));
    backgroundSeries.mapPolygons.template.setAll({
        fill: rootNacional.interfaceColors.get("alternativeBackground"),
        fillOpacity: 0,
        strokeOpacity: 0
    });

    backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180)
    });

    // Mapa mundial
    var polygonSeriesNacional = chartNacional.series.push(am5map.MapPolygonSeries.new(rootNacional, {
        geoJSON: am5geodata_worldLow
    }));

    polygonSeriesNacional.mapPolygons.template.setAll({
        fill: am5.color(0x1c1c1c),
        stroke: am5.color(0xffffff),
        strokeWidth: 0.5
    });

    // Línea de ruta
    var lineSeriesNacional = chartNacional.series.push(am5map.MapLineSeries.new(rootNacional, {}));
    lineSeriesNacional.mapLines.template.setAll({
        stroke: am5.color(0xd9782b),
        strokeWidth: 3,
        strokeOpacity: 0.8
    });

    // Puntos para las ciudades
    var pointSeriesNacional = chartNacional.series.push(am5map.MapPointSeries.new(rootNacional, {}));

    pointSeriesNacional.bullets.push(function () {
        var circle = am5.Circle.new(rootNacional, {
            radius: 6,
            fill: am5.color(0xd9782b),
            stroke: am5.color(0xffffff),
            strokeWidth: 2
        });
        return am5.Bullet.new(rootNacional, { sprite: circle });
    });

    // ====================
    // CIUDADES EN ESTADOS UNIDOS
    // ====================
    var ciudadesUSA = [
        { nombre: "Seattle", lat: 47.6062, lon: -122.3321 },
        { nombre: "Portland", lat: 45.5152, lon: -122.6784 },
        { nombre: "Phoenix", lat: 33.4484, lon: -112.0740 },
        { nombre: "Denver", lat: 39.7392, lon: -104.9903 },
        { nombre: "Nueva York", lat: 40.7128, lon: -74.0060 },
        { nombre: "Boston", lat: 42.3601, lon: -71.0589 },
        { nombre: "Philadelphia", lat: 39.9526, lon: -75.1652 },

    ];

    // ====================
    // CIUDADES EN MÉXICO
    // ====================
    var ciudadesMexico = [
        { nombre: "Tijuana", lat: 32.5149, lon: -117.0382 },
        { nombre: "Monterrey", lat: 25.6866, lon: -100.3161 },
        { nombre: "Guadalajara", lat: 20.6597, lon: -103.3496 },
        { nombre: "Ciudad de México", lat: 19.4326, lon: -99.1332 },
        { nombre: "Mérida", lat: 20.9674, lon: -89.6237 }
    ];

    // Agregar puntos de ciudades
    var puntosRuta = [];

    // Agregar ciudades de USA
    for (var i = 0; i < ciudadesUSA.length; i++) {
        var ciudad = pointSeriesNacional.pushDataItem({
            latitude: ciudadesUSA[i].lat,
            longitude: ciudadesUSA[i].lon,
            name: ciudadesUSA[i].nombre
        });
        ciudad.set("tooltipText", ciudadesUSA[i].nombre);
        puntosRuta.push(ciudad);
    }

    // Agregar ciudades de México
    for (var i = 0; i < ciudadesMexico.length; i++) {
        var ciudad = pointSeriesNacional.pushDataItem({
            latitude: ciudadesMexico[i].lat,
            longitude: ciudadesMexico[i].lon,
            name: ciudadesMexico[i].nombre
        });
        ciudad.set("tooltipText", ciudadesMexico[i].nombre);
        puntosRuta.push(ciudad);
    }

    // Ruta completa del Trailer por todas las ciudades
    var routeNacional = lineSeriesNacional.pushDataItem({
        pointsToConnect: puntosRuta
    });

    // ====================
    // Trailer
    // ====================
    var trainSeriesNacional = chartNacional.series.push(am5map.MapPointSeries.new(rootNacional, {}));

    // SVG del Trailer
    var trainSVG = "M105.01,40.54c-5.7,0-10.3,4.63-10.3,10.3c0,5.7,4.63,10.3,10.3,10.3c5.7,0,10.3-4.63,10.3-10.3 C115.31,45.14,110.68,40.54,105.01,40.54L105.01,40.54z M61.86,41.46c-5.2,0-9.38,4.22-9.38,9.38c0,5.2,4.22,9.38,9.38,9.38 c5.2,0,9.38-4.22,9.38-9.38C71.24,45.64,67.02,41.46,61.86,41.46L61.86,41.46z M61.86,47.23c-1.99,0-3.61,1.62-3.61,3.61 s1.62,3.61,3.61,3.61c1.99,0,3.61-1.62,3.61-3.61S63.85,47.23,61.86,47.23L61.86,47.23z M24.11,41.46c-5.2,0-9.38,4.22-9.38,9.38 c0,5.2,4.22,9.38,9.38,9.38c5.2,0,9.38-4.22,9.38-9.38C33.5,45.64,29.28,41.46,24.11,41.46L24.11,41.46z M24.11,47.23 c-1.99,0-3.61,1.62-3.61,3.61s1.62,3.61,3.61,3.61c1.99,0,3.61-1.62,3.61-3.61S26.11,47.23,24.11,47.23L24.11,47.23z M47.37,53.53 H38.1v-3.01h9.27V53.53L47.37,53.53z M10.46,53.53H5.63c-1.55,0-2.95-0.66-3.96-1.71c-1.01-1.05-1.65-2.5-1.65-4.02V8.06 c0-2.44-0.36-4.44,1.62-6.42C2.66,0.63,4.05,0,5.6,0h73.32c1.55,0,2.95,0.63,3.96,1.65c1.01,1.01,1.65,2.41,1.65,3.96l0,7.26 l10.27,0.07l3.62,0.02l0,0c0.73,0.79,1.4,1.6,2.01,2.42c2.71,3.64,4.23,7.94,4.52,12.11l16.38,6.27l1.55,16.51h-5.01 c-2.31-18.03-25.03-15.84-25.73,0l-7.61,0v1.74c0,0.86-0.67,1.52-1.52,1.52l-6.69,0v-3.04h5.16V5.61c0-0.7-0.28-1.33-0.76-1.81 c-0.48-0.48-1.11-0.76-1.81-0.76H5.6c-0.7,0-1.33,0.29-1.81,0.76C2.76,4.77,3.07,6.43,3.07,7.7v40.1c0,0.73,0.32,1.43,0.79,1.93 c0.48,0.48,1.08,0.79,1.77,0.79h4.82V53.53L10.46,53.53z M94.46,17.89l-5.83-0.09v9.69h11.02C99.12,23.98,97.49,20.9,94.46,17.89 L94.46,17.89z M105.01,46.88c-2.19,0-3.96,1.77-3.96,3.96c0,2.19,1.77,3.96,3.96,3.96c2.19,0,3.96-1.77,3.96-3.96 C108.97,48.65,107.2,46.88,105.01,46.88L105.01,46.88z";

    var train = am5.Graphics.new(rootNacional, {
        svgPath: trainSVG,
        scale: 0.3,
        centerY: am5.p50,
        centerX: am5.p50,
        fill: am5.color(0xd9782b),
        stroke: am5.color(0xd9782b),
        strokeWidth: 1
    });

    trainSeriesNacional.bullets.push(function () {
        var container = am5.Container.new(rootNacional, {});
        container.children.push(train);
        return am5.Bullet.new(rootNacional, { sprite: container });
    });

    var trainDataItemNacional = trainSeriesNacional.pushDataItem({
        lineDataItem: routeNacional,
        positionOnLine: 0,
        autoRotate: true
    });

    // Animación del trailer
    trainDataItemNacional.animate({
        key: "positionOnLine",
        to: 1,
        duration: 36000,
        loops: Infinity,
        easing: am5.ease.linear
    });

    // Rotación del trailer según dirección
    trainDataItemNacional.dataContext = { prevPosition: 0 };
    trainDataItemNacional.on("positionOnLine", (value) => {
        if (trainDataItemNacional.dataContext.prevPosition < value) {
            train.set("rotation", 0);
        } else if (trainDataItemNacional.dataContext.prevPosition > value) {
            train.set("rotation", -180);
        }
        trainDataItemNacional.dataContext.prevPosition = value;
    });

    // ====================
    // ZOOM
    // ====================
    setTimeout(() => {
        chartNacional.zoomToGeoPoint(
            { latitude: 32, longitude: -100 },
            4,
            1000
        );
    }, 500);

    chartNacional.appear(1000, 100);

    // MAPA INTERNACIONAL 
    var rootInternacional = am5.Root.new("chartdiv");

    rootInternacional.setThemes([
        am5themes_Animated.new(rootInternacional)
    ]);

    var chartInternacional = rootInternacional.container.children.push(am5map.MapChart.new(rootInternacional, {
        panX: "none",
        panY: "none",
        wheelX: "none",
        wheelY: "none",
        pinchZoom: false,
        projection: am5map.geoMercator()
    }));

    var backgroundSeriesInt = chartInternacional.series.push(am5map.MapPolygonSeries.new(rootInternacional, {}));
    backgroundSeriesInt.mapPolygons.template.setAll({
        fill: rootInternacional.interfaceColors.get("alternativeBackground"),
        fillOpacity: 0,
        strokeOpacity: 0
    });

    backgroundSeriesInt.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180)
    });

    // Mapa mundial
    var polygonSeriesInternacional = chartInternacional.series.push(am5map.MapPolygonSeries.new(rootInternacional, {
        geoJSON: am5geodata_worldLow
    }));

    polygonSeriesInternacional.mapPolygons.template.setAll({
        fill: am5.color(0xd9782b),
        stroke: am5.color(0xffffff),
        strokeWidth: 0.5
    });

    // Línea de ruta para el AVIÓN
    var lineSeriesAvion = chartInternacional.series.push(am5map.MapLineSeries.new(rootInternacional, {}));
    lineSeriesAvion.mapLines.template.setAll({
        stroke: am5.color(0x1c1c1c),
        strokeWidth: 2,
        strokeOpacity: 0.6,
        strokeDasharray: [5, 5]
    });

    // Línea de ruta para el BARCO
    var lineSeriesBarco = chartInternacional.series.push(am5map.MapLineSeries.new(rootInternacional, {}));
    lineSeriesBarco.mapLines.template.setAll({
        stroke: am5.color(0x1c1c1c),
        strokeWidth: 3,
        strokeOpacity: 0.8
    });

    // Puntos
    var pointSeriesInternacional = chartInternacional.series.push(am5map.MapPointSeries.new(rootInternacional, {}));

    pointSeriesInternacional.bullets.push(function () {
        var circle = am5.Circle.new(rootInternacional, {
            radius: 8,
            fill: am5.color(0xd9782b),
            stroke: am5.color(0x1c1c1c),
            strokeWidth: 2
        });
        return am5.Bullet.new(rootInternacional, { sprite: circle });
    });

    // Tres puntos: uno por continente
    var puntoAsia = pointSeriesInternacional.pushDataItem({
        latitude: 34.0479,
        longitude: 100.6197,
        name: "Asia"
    });
    puntoAsia.set("tooltipText", "Asia");

    var puntoEuropa = pointSeriesInternacional.pushDataItem({
        latitude: 54.5260,
        longitude: 15.2551,
        name: "Europa"
    });
    puntoEuropa.set("tooltipText", "Europa");

    var puntoAmerica = pointSeriesInternacional.pushDataItem({
        latitude: 40.0,
        longitude: -95.0,
        name: "América"
    });
    puntoAmerica.set("tooltipText", "América");

    // Ruta para el AVIÓN
    var routeAvion = lineSeriesAvion.pushDataItem({
        pointsToConnect: [puntoAsia, puntoEuropa, puntoAmerica]
    });

    // Ruta para el BARCO
    var puntosBarco = [
        { latitude: 34.0479, longitude: 100.6197 },
        { latitude: 20.0, longitude: 80.0 },
        { latitude: 15.0, longitude: 60.0 },
        { latitude: 12.0, longitude: 45.0 },
        { latitude: 15.0, longitude: 35.0 },
        { latitude: 20.0, longitude: 30.0 },
        { latitude: 35.0, longitude: 25.0 },
        { latitude: 40.0, longitude: 15.0 },
        { latitude: 38.0, longitude: -10.0 },
        { latitude: 35.0, longitude: -25.0 },
        { latitude: 30.0, longitude: -40.0 },
        { latitude: 25.0, longitude: -55.0 },
        { latitude: 30.0, longitude: -70.0 },
        { latitude: 40.0, longitude: -95.0 }
    ];

    var puntosBarcoData = [];
    for (var i = 0; i < puntosBarco.length; i++) {
        var puntoRuta = pointSeriesInternacional.pushDataItem({
            latitude: puntosBarco[i].latitude,
            longitude: puntosBarco[i].longitude
        });
        puntosBarcoData.push(puntoRuta);
    }

    var routeBarco = lineSeriesBarco.pushDataItem({
        pointsToConnect: puntosBarcoData
    });

    // ====================
    // AVIÓN
    // ====================
    var planeSeries = chartInternacional.series.push(am5map.MapPointSeries.new(rootInternacional, {}));

    var plane = am5.Graphics.new(rootInternacional, {
        svgPath: "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47",
        scale: 0.08,
        centerY: am5.p50,
        centerX: am5.p50,
        fill: am5.color(0x1c1c1c)
    });

    planeSeries.bullets.push(function () {
        var container = am5.Container.new(rootInternacional, {});
        container.children.push(plane);
        return am5.Bullet.new(rootInternacional, { sprite: container });
    });

    var planeDataItem = planeSeries.pushDataItem({
        lineDataItem: routeAvion,
        positionOnLine: 0,
        autoRotate: true
    });

    planeDataItem.animate({
        key: "positionOnLine",
        to: 1,
        duration: 8000,
        loops: Infinity,
        easing: am5.ease.linear
    });

    planeDataItem.dataContext = { prevPosition: 0 };
    planeDataItem.on("positionOnLine", (value) => {
        if (planeDataItem.dataContext.prevPosition < value) {
            plane.set("rotation", 0);
        } else if (planeDataItem.dataContext.prevPosition > value) {
            plane.set("rotation", -180);
        }
        planeDataItem.dataContext.prevPosition = value;
    });

    // ====================
    // BARCO
    // ====================
    var boatSeries = chartInternacional.series.push(am5map.MapPointSeries.new(rootInternacional, {}));

    // SVG BARCO 
    var boatSVG = "M0,40 L10,20 L30,15 L50,15 L70,20 L80,40 L70,45 L10,45 Z M15,45 L15,55 L65,55 L65,45 M20,55 L20,60 L60,60 L60,55";

    var boat = am5.Graphics.new(rootInternacional, {
        svgPath: boatSVG,
        scale: 0.4,
        centerY: am5.p50,
        centerX: am5.p50,
        fill: am5.color(0x1c1c1c),
        stroke: am5.color(0x0a3a4a),
        strokeWidth: 1
    });

    boatSeries.bullets.push(function () {
        var container = am5.Container.new(rootInternacional, {});
        container.children.push(boat);
        return am5.Bullet.new(rootInternacional, { sprite: container });
    });

    var boatDataItem = boatSeries.pushDataItem({
        lineDataItem: routeBarco,
        positionOnLine: 0,
        autoRotate: true
    });

    boatDataItem.animate({
        key: "positionOnLine",
        to: 1,
        duration: 25000,
        loops: Infinity,
        easing: am5.ease.linear
    });

    boatDataItem.dataContext = { prevPosition: 0 };
    boatDataItem.on("positionOnLine", (value) => {
        if (boatDataItem.dataContext.prevPosition < value) {
            boat.set("rotation", 0);
        } else if (boatDataItem.dataContext.prevPosition > value) {
            boat.set("rotation", -180);
        }
        boatDataItem.dataContext.prevPosition = value;
    });

    setTimeout(() => {
        chartInternacional.zoomToGeoPoint(
            { latitude: 40, longitude: 30 },
            1.5,
            2000
        );
    }, 500);

    chartInternacional.appear(1000, 100);

});
