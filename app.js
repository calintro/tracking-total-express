const express = require('express');
const fs = require("fs");
const request = require('request');
const cheerio = require('cheerio');
const notifier = require('node-notifier');
const app = express();

let lastNotification = '';

function checkTracking() {
  const trackingCode = 'CODIGO_DA_URL_NO_TRACKING_DA_TOTAL_EXPRESS';
  const trackingURL = `http://tracking.totalexpress.com.br/tracking_encomenda.php?code=${trackingCode}`;

  request(trackingURL, function(error, response, html) {
    if (!error) {
      const $ = cheerio.load(html);
      const lastEntry = $('table tr').last();
      const lastUpdate = lastEntry.children('td').first().text().replace(/\s/g,'') + ' ' + lastEntry.children('td').eq(1).text().replace(/\s/g,'');
      const lastAction = lastEntry.children('td').last().text().trim();

      if (lastNotification != lastUpdate) {
        lastNotification = lastUpdate;
        
        notifier.notify({
          title: lastUpdate,
          message: lastAction,
          timeout: 10,
          sound: 'Blow'
        });
      }
    }
  })
}

app.listen(3000, function () {
  checkTracking();

  setInterval(checkTracking, 600 * 1000);
});
