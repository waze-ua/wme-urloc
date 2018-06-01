// ==UserScript==
// @name         WME URLoc
// @version      2018.06.01.001
// @description  Updates page's URL to current WME location
// @author       turbopirate
// @include      /^https:\/\/(www|beta)\.waze\.com(\/\w{2,3}|\/\w{2,3}-\w{2,3}|\/\w{2,3}-\w{2,3}-\w{2,3})?\/editor\b/
// @grant        none
// @namespace https://greasyfork.org/users/166361
// ==/UserScript==

(function() {
    'use strict';

    let wazeapi = W || window.W;
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
            last.lat = wazeapi.map.center.lat;
            last.lon = wazeapi.map.center.lon;
            last.zoom = wazeapi.map.zoom;
        }

        setTimeout(updateURL, 500);
    };

    let waitWaze = () => {
        wazeapi = W || window.W;

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
