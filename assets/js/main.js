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
    const mapaMaritimo = document.getElementById('mapaMaritimo');

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
        // Recorrido animación
        // ====================
        var ciudadesRuta = [
            { lat: 19.3576, lon: -99.3945, nombre: "Centro (Distribución)" },  // 1. Centro México
            { lat: 21.2548, lon: -100.8776, nombre: "Bajío (Base)" },            // 2. Bajío
            { lat: 25.5594, lon: -100.6607, nombre: "Norte (Expansión)" },       // 3. Norte
            { lat: 27.5306, lon: -99.4803, nombre: "Laredo" },                  // 4. Laredo
            { lat: 31.9686, lon: -99.9018, nombre: "Texas" },                   // 5. Texas
        ];

        // Agregar puntos de ciudades
        var puntosRuta = [];

        // Agregar ciudades de USA
        for (var i = 0; i < ciudadesRuta.length; i++) {
            var ciudad = pointSeriesNacional.pushDataItem({
                latitude: ciudadesRuta[i].lat,
                longitude: ciudadesRuta[i].lon,
                name: ciudadesRuta[i].nombre
            });
            ciudad.set("tooltipText", ciudadesRuta[i].nombre);
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
            scale: 0.06,
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
                8,
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
        //var boatSVG = `M511.834,276.524c-0.085-2.411-0.427-4.821-1.344-7.125l-42.667-106.667c-3.264-8.085-11.093-13.397-19.819-13.397v-64c0-11.776-9.536-21.333-21.333-21.333h-64c-11.797,0-21.333,9.557-21.333,21.333v85.333v85.333h-21.333v-42.667c0-11.776-9.536-21.333-21.333-21.333h-21.333v-42.667c0-11.776-9.536-21.333-21.333-21.333h-21.333V85.335c0-11.776-9.536-21.333-21.333-21.333h-85.333c-11.797,0-21.333,9.557-21.333,21.333v42.667H85.338c-11.797,0-21.333,9.557-21.333,21.333v42.667H42.671c-11.797,0-21.333,9.557-21.333,21.333v42.667c-7.083,0-13.696,3.52-17.664,9.365c-3.968,5.867-4.779,13.312-2.155,19.904l41.152,102.827v17.28c0,23.509,19.115,42.624,42.603,42.624h315.157c9.301,0,18.347-2.88,26.325-8.491c1.365-0.939,2.688-1.899,4.181-3.221l71.339-64.213c6.187-5.568,9.728-13.547,9.728-21.845v-72.896C512.005,277.036,511.855,276.801,511.834,276.524zM192.005,106.668v21.333h-21.333h-21.333v-21.333H192.005zM106.671,256.001H64.005v-21.333h21.333h21.333V256.001zM149.337,192.001h-21.333h-21.333v-21.333h21.333h21.333V192.001zM149.338,256.001v-21.333h21.333h21.333v21.333H149.338zM192.005,192.001v-21.333h21.333h21.333v21.333h-21.333H192.005zM234.671,256.001v-21.333h21.333h21.333v21.333H234.671zM384.005,256.001v-64h42.667h6.891l25.6,64H384.005z`;
        var boatSVG = `M0.171,276.524c0.085-2.411,0.427-4.821,1.344-7.125l42.667-106.667c3.264-8.085,11.093-13.397,19.819-13.397v-64c0-11.776,9.536-21.333,21.333-21.333h64c11.797,0,21.333,9.557,21.333,21.333v85.333v85.333h21.333v-42.667c0-11.776,9.536-21.333,21.333-21.333h21.333v-42.667c0-11.776,9.536-21.333,21.333-21.333h21.333V85.335c0-11.776,9.536-21.333,21.333-21.333h85.333c11.797,0,21.333,9.557,21.333,21.333v42.667h21.333c11.797,0,21.333,9.557,21.333,21.333v42.667h21.333c11.797,0,21.333,9.557,21.333,21.333v42.667c7.083,0,13.696,3.52,17.664,9.365c3.968,5.867,4.779,13.312,2.155,19.904l-41.152,102.827v17.28c0,23.509-19.115,42.624-42.603,42.624H85.338c-9.301,0-18.347-2.88-26.325-8.491c-1.365-0.939-2.688-1.899-4.181-3.221L-16.507,330.41c-6.187-5.568-9.728-13.547-9.728-21.845v-72.896C-26.234,277.036-26.084,276.801-0.171,276.524zM319.995,106.668v21.333h21.333h21.333v-21.333H319.995zM405.329,256.001h42.667v-21.333h-21.333h-21.333V256.001zM362.663,192.001h21.333h21.333v-21.333h-21.333h-21.333V192.001zM362.662,256.001v-21.333h-21.333h-21.333v21.333H362.662zM319.995,192.001v-21.333h-21.333h-21.333v21.333h21.333H319.995zM277.329,256.001v-21.333h-21.333h-21.333v21.333H277.329zM127.995,256.001v-64h-42.667h-6.891l-25.6,64H127.995z`;
        var boat = am5.Graphics.new(rootInternacional, {
            svgPath: boatSVG,
            scale: 0.06,
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
                    { latitude: 35, longitude: 10 },
                    1.8,
                    2000
                );
            }, 500);
        }

        chartInternacional.appear(1000, 100);
    }

    // MAPA Maritimo 
    if (!mapaMaritimo) {
        console.warn("Elemento 'mapaMaritimo' no encontrado. Se omitirá el mapa maritimo.");
    } else {
        var rootMaritimo = am5.Root.new("mapaMaritimo");

        rootMaritimo.setThemes([
            am5themes_Animated.new(rootMaritimo)
        ]);

        var chartMaritimo = rootMaritimo.container.children.push(am5map.MapChart.new(rootMaritimo, {
            panX: "none",
            panY: "none",
            wheelX: "none",
            wheelY: "none",
            pinchZoom: false,
            projection: am5map.geoMercator(),
            swipeVelocityThreshold: 0,
            tapToActivate: false
        }));

        var backgroundSeriesMaritimo = chartMaritimo.series.push(am5map.MapPolygonSeries.new(rootMaritimo, {}));
        backgroundSeriesMaritimo.mapPolygons.template.setAll({
            fill: rootMaritimo.interfaceColors.get("alternativeBackground"),
            fillOpacity: 0,
            strokeOpacity: 0
        });

        backgroundSeriesMaritimo.data.push({
            geometry: am5map.getGeoRectangle(90, 180, -90, -180)
        });

        var polygonSeriesMaritimo = chartMaritimo.series.push(am5map.MapPolygonSeries.new(rootMaritimo, {
            geoJSON: am5geodata_worldLow
        }));

        polygonSeriesMaritimo.mapPolygons.template.setAll({
            fill: am5.color(0xd9782b),
            stroke: am5.color(0xffffff),
            strokeWidth: 0.5
        });

        var lineSeriesBarcoMaritimo = chartMaritimo.series.push(am5map.MapLineSeries.new(rootMaritimo, {}));
        lineSeriesBarcoMaritimo.mapLines.template.setAll({
            stroke: am5.color(0x1c1c1c),
            strokeWidth: 3,
            strokeOpacity: 0.8
        });

        var pointSeriesMaritimo = chartMaritimo.series.push(am5map.MapPointSeries.new(rootMaritimo, {}));

        pointSeriesMaritimo.bullets.push(function () {
            var circle = am5.Circle.new(rootMaritimo, {
                radius: 8,
                fill: am5.color(0xd9782b),
                stroke: am5.color(0x1c1c1c),
                strokeWidth: 2
            });
            return am5.Bullet.new(rootMaritimo, { sprite: circle });
        });

        var puntosBarcoMaritimo = [
            { lat: 19.0524, lon: -104.3147, nombre: "Puerto Manzanillo" },
            { lat: 19.2000, lon: -96.1333,  nombre: "Puerto Veracruz" },
            { lat: 17.9500, lon: -102.1667, nombre: "Puerto Lázaro Cárdenas" },
        ];

        var puntosBarcoDataMaritimo = [];
        for (var i = 0; i < puntosBarcoMaritimo.length; i++) {
            var puntoRutaMaritimo = pointSeriesMaritimo.pushDataItem({
                latitude:  puntosBarcoMaritimo[i].lat,
                longitude: puntosBarcoMaritimo[i].lon
            });
            puntoRutaMaritimo.set("tooltipText", puntosBarcoMaritimo[i].nombre);
            puntosBarcoDataMaritimo.push(puntoRutaMaritimo);
        }

        var routeBarcoMaritimo = lineSeriesBarcoMaritimo.pushDataItem({
            pointsToConnect: puntosBarcoDataMaritimo
        });

        var boatSeriesMaritimo = chartMaritimo.series.push(am5map.MapPointSeries.new(rootMaritimo, {}));

        var boatSVGMaritimo = `M0.171,276.524c0.085-2.411,0.427-4.821,1.344-7.125l42.667-106.667c3.264-8.085,11.093-13.397,19.819-13.397v-64c0-11.776,9.536-21.333,21.333-21.333h64c11.797,0,21.333,9.557,21.333,21.333v85.333v85.333h21.333v-42.667c0-11.776,9.536-21.333,21.333-21.333h21.333v-42.667c0-11.776,9.536-21.333,21.333-21.333h21.333V85.335c0-11.776,9.536-21.333,21.333-21.333h85.333c11.797,0,21.333,9.557,21.333,21.333v42.667h21.333c11.797,0,21.333,9.557,21.333,21.333v42.667h21.333c11.797,0,21.333,9.557,21.333,21.333v42.667c7.083,0,13.696,3.52,17.664,9.365c3.968,5.867,4.779,13.312,2.155,19.904l-41.152,102.827v17.28c0,23.509-19.115,42.624-42.603,42.624H85.338c-9.301,0-18.347-2.88-26.325-8.491c-1.365-0.939-2.688-1.899-4.181-3.221L-16.507,330.41c-6.187-5.568-9.728-13.547-9.728-21.845v-72.896C-26.234,277.036-26.084,276.801-0.171,276.524zM319.995,106.668v21.333h21.333h21.333v-21.333H319.995zM405.329,256.001h42.667v-21.333h-21.333h-21.333V256.001zM362.663,192.001h21.333h21.333v-21.333h-21.333h-21.333V192.001zM362.662,256.001v-21.333h-21.333h-21.333v21.333H362.662zM319.995,192.001v-21.333h-21.333h-21.333v21.333h21.333H319.995zM277.329,256.001v-21.333h-21.333h-21.333v21.333H277.329zM127.995,256.001v-64h-42.667h-6.891l-25.6,64H127.995z`;

        var boatMaritimo = am5.Graphics.new(rootMaritimo, {
            svgPath: boatSVGMaritimo,
            scale: 0.06,
            centerY: am5.p50,
            centerX: am5.p50,
            fill: am5.color(0x1c1c1c),
            stroke: am5.color(0x0a3a4a),
            strokeWidth: 1
        });

        boatSeriesMaritimo.bullets.push(function () {
            var container = am5.Container.new(rootMaritimo, {});
            container.children.push(boatMaritimo);
            return am5.Bullet.new(rootMaritimo, { sprite: container });
        });

        var boatDataItemMaritimo = boatSeriesMaritimo.pushDataItem({
            lineDataItem: routeBarcoMaritimo,
            positionOnLine: 0,
            autoRotate: true,
            autoRotateAngle: 360
        });

        boatDataItemMaritimo.animate({
            key: "positionOnLine",
            to: 1,
            duration: 20000,
            loops: Infinity,
            easing: am5.ease.linear
        });

        boatDataItemMaritimo.dataContext = { prevPosition: 0 };
        boatDataItemMaritimo.on("positionOnLine", (value) => {
            if (boatDataItemMaritimo.dataContext.prevPosition < value) {
                boat.set("rotation", 360);
            } else if (boatDataItemMaritimo.dataContext.prevPosition > value) {
                boat.set("rotation", 360);
            }
            boatDataItemMaritimo.dataContext.prevPosition = value;
        });

        setTimeout(() => {
            chartMaritimo.zoomToGeoPoint(
                { latitude: 23.6345, longitude: -102.5528 },
                10,
                1000
            );
        }, 500);

        chartMaritimo.appear(1000, 100);
    }

});
