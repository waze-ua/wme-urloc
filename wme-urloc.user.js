// ==UserScript==
// @name         WME URLoc
// @version      0.1
// @description  Updates address bar to current WME location.
// @author       turbopirate
// @include      /^https:\/\/(www|beta)\.waze\.com(\/\w{2,3}|\/\w{2,3}-\w{2,3}|\/\w{2,3}-\w{2,3}-\w{2,3})?\/editor\b/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let wazeapi = Waze || window.Waze;
    let projI = new OpenLayers.Projection("EPSG:900913");
    let projE = new OpenLayers.Projection("EPSG:4326");
    let last = {};

    let updateURL = () => {
        if (wazeapi.map.center && (last.lat !== wazeapi.map.center.lat || last.lon !== wazeapi.map.center.lon || last.zoom !== wazeapi.map.zoom)) {
            let lonlat=(new OpenLayers.LonLat(wazeapi.map.center.lon, wazeapi.map.center.lat)).transform(projI, projE);
            let lon = Math.round(lonlat.lon * 100000) / 100000;
            let lat = Math.round(lonlat.lat * 100000) / 100000;
            let urloc = `${window.location.protocol}//${window.location.host}${window.location.pathname}?env=row&lon=${lon}&lat=${lat}&zoom=${wazeapi.map.zoom}`;
            window.history.pushState({path:urloc}, document.title, urloc);
        }
        setTimeout(updateURL, 500);
    };

    let waitWaze = () => {
        wazeapi = Waze || window.Waze;

        if (wazeapi && wazeapi.map) {
            last.lat = wazeapi.map.center.lat;
            last.lon = wazeapi.map.center.lon;
            last.zoom = wazeapi.map.zoom;

            setTimeout(updateURL, 500);
            return;
        }

        setTimeout(waitWaze, 500);
        console.log("URLOC: Waiting...");
    };

    if (window.history.pushState)
        waitWaze();
    else
        console.error("URLOC: Your browser is not supported!");
})();
