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
    var trainSVG = `
M43.297,157.656L6.109,262.219C2.406,271.031,0,285.313,0,292.109s0,41.234,0,41.234c0,11.188,9.156,20.375,20.375,20.375h24.391C47.219,379,68.516,398.75,94.438,398.75s47.234-19.75,49.688-45.031h45.109V139.75H73.391C62.188,139.75,48.641,147.813,43.297,157.656z
M94.438,373.781c-13.781,0-24.969-11.188-24.969-24.969s11.188-24.938,24.969-24.938c13.797,0,24.969,11.156,24.969,24.938S108.234,373.781,94.438,373.781z
M165.797,166.313v79.516H46.875l23.375-71.609c2.047-3.781,9-7.906,13.281-7.906H165.797z
M217.797,113.25v240.469h147.109c2.422,25.281,23.734,45.031,49.656,45.031c25.938,0,47.219-19.75,49.703-45.031H512V113.25H217.797z
M414.563,373.781c-13.781,0-24.969-11.188-24.969-24.969s11.188-24.938,24.969-24.938c13.797,0,24.969,11.156,24.969,24.938S428.359,373.781,414.563,373.781z
`;
    var train = am5.Graphics.new(rootNacional, {
        svgPath: trainSVG,
        scale: 0.1,
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
            train.set("rotation", 180);
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
        { latitude: 35.0, longitude: 25.0 },
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
        duration: 10000,
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
    var boatSVG = `
        M7.796,238.365l14.356,52.705c0,15.872,12.877,28.73,28.76,28.73h217.976c15.908,0,28.736-12.859,28.736-28.73l14.38-52.705H7.796z
        M152.713,14.374v200.039h7.178c3.974,0,7.19-6.444,7.19-14.368V0h-7.19C155.941,0,152.713,6.45,152.713,14.374z
        M58.096,207.229h81.448V53.899l-88.22,141.134C47.105,201.764,50.149,207.229,58.096,207.229z
        M183.681,207.229h70.66c7.936,0,10.185-4.875,5.012-10.901L183.681,108.4V207.229z
        `;
    var boat = am5.Graphics.new(rootInternacional, {
        svgPath: boatSVG,
        scale: 0.1,
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
        duration: 20000,
        loops: Infinity,
        easing: am5.ease.linear
    });

    boatDataItem.dataContext = { prevPosition: 0 };
    boatDataItem.on("positionOnLine", (value) => {
        if (boatDataItem.dataContext.prevPosition < value) {
            boat.set("rotation", 180);
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
