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

    // Verificar que los elementos del mapa existen antes de crear los mapas
    const mapaRegionalElement = document.getElementById("mapaRegional");
    const chartdivElement = document.getElementById("chartdiv");

    if (!mapaRegionalElement && !chartdivElement) {
        console.warn("Elementos de mapas no encontrados. No se cargarán los mapas.");
        return;
    }

    // MAPA NACIONAL - México y Estados Unidos con TREN (Ruta extendida)
    if (!mapaRegionalElement) {
        console.warn("Elemento 'mapaRegional' no encontrado. Se omitirá el mapa nacional.");
    } else {
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
            projection: am5map.geoMercator(),
            swipeVelocityThreshold: 0,
            tapToActivate: false
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
            { lat: 31.9686, lon: -99.9018, nombre: "Texas" },
            { lat: 27.5306, lon: -99.4803, nombre: "Laredo" },
            { lat: 41.8781, lon: -87.6298, nombre: "Midwest (Chicago)" },
            { lat: 35.1495, lon: -95.6706, nombre: "Centro Operativo USA" },

        ];

        // ====================
        // CIUDADES EN MÉXICO
        // ====================
        var ciudadesMexico = [
            { lat: 21.2548, lon: -100.8776, nombre: "Bajío (Base)" },
            { lat: 25.5594, lon: -100.6607, nombre: "Norte (Expansión)" },
            { lat: 19.3576, lon: -99.3945, nombre: "Centro (Distribución)" },
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
                6,
                1000
            );
        }, 500);

        chartNacional.appear(1000, 100);
    }

    // MAPA INTERNACIONAL 
    if (!chartdivElement) {
        console.warn("Elemento 'chartdiv' no encontrado. Se omitirá el mapa internacional.");
    } else {
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
            projection: am5map.geoMercator(),
            swipeVelocityThreshold: 0,
            tapToActivate: false
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
            latitude: 31.2304,
            longitude: 121.4737,
            name: "Asia"
        });
        puntoAsia.set("tooltipText", "Asia");

        var puntoEuropa = pointSeriesInternacional.pushDataItem({
            latitude: 49.5000,
            longitude: 10.5000,
            name: "Europa"
        });
        puntoEuropa.set("tooltipText", "Europa");

        var puntoAmerica = pointSeriesInternacional.pushDataItem({
            latitude: 41.8781,
            longitude: -87.6298,
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
        M80 23v18h23v14h18V41h23V23zm-8.2 50L42.38 279H135V144.5H95.5v-49H135V73z
        M185 137v46h78v-46zm96 0v46h78v-46zm96 0v46h78v-46zm-192 64v46h78v-46zm96 0v46h78v-46zm96 0v46h78v-46zm-192 64v46h78v-46zm96 0v46h19.3l32-32H359v-14zm96 0v14h78v-14z
        M27.22 297l24.11 108.5C76.75 398.1 105.7 391 128 391c24.2 0 46.2 8.6 67.2 16.6 21 8 41 15.4 60.8 15.4 19.8 0 39.8-7.4 60.8-15.4 19-7.2 38.9-15 60.5-16.4l-44.1-14.7 5.6-17 36.2 12V345h-17v-18h17v-30h-35.3l-32 32H154.4l-16-32z
        M393 297v30h17v18h-17v26.5l36.2-12 5.6 17-44 14.7c12.1.7 25.7 3.1 39.4 6.2 5.4-7.1 10.8-15.3 16.1-24 14.9-24.9 28.2-53.9 36.8-76.4z
        M128 407c-24.2 0-56.26 8.3-83.09 16.4-10.02 3-19.26 6-26.91 8.7v19c8.36-3 19.57-6.7 32.11-10.5C76.28 432.7 108.2 425 128 425c19.8 0 39.8 7.4 60.8 15.4s43 16.6 67.2 16.6c24.2 0 46.2-8.6 67.2-16.6 21-8 41-15.4 60.8-15.4 19.8 0 51.7 7.7 77.9 15.6 12.5 3.8 23.7 7.5 32.1 10.5v-19c-7.7-2.6-16.9-5.7-26.9-8.7-26.8-8.1-58.9-16.4-83.1-16.4-24.2 0-46.2 8.6-67.2 16.6-21 8-41 15.4-60.8 15.4-19.8 0-39.8-7.4-60.8-15.4S152.2 407 128 407z
        M128 443c-24.2 0-56.26 8.3-83.09 16.4-10.02 3-19.26 6-26.91 8.7v19c8.36-3 19.57-6.7 32.11-10.5C76.28 468.7 108.2 461 128 461c19.8 0 39.8 7.4 60.8 15.4s43 16.6 67.2 16.6c24.2 0 46.2-8.6 67.2-16.6 21-8 41-15.4 60.8-15.4 19.8 0 51.7 7.7 77.9 15.6 12.5 3.8 23.7 7.5 32.1 10.5v-19c-7.7-2.6-16.9-5.7-26.9-8.7-26.8-8.1-58.9-16.4-83.1-16.4-24.2 0-46.2 8.6-67.2 16.6-21 8-41 15.4-60.8 15.4-19.8 0-39.8-7.4-60.8-15.4S152.2 443 128 443z
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

        function isLargeScreen() {
            return window.innerWidth > 1024;
        }

        if (isLargeScreen()) {
            setTimeout(() => {
                chartInternacional.zoomToGeoPoint(
                    { latitude: 40, longitude: 30 },
                    1.8,
                    2000
                );
            }, 500);
        }

        chartInternacional.appear(1000, 100);
    }

});
