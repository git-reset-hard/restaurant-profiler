const axios = require('axios');
var request = require('request');
var rp = require('request-promise');


const fetchAll = (terms) => {
  let options = {
    url: `https://api.yelp.com/v3/businesses/search?term=${terms}&location=san-francisco`,
    auth: {
      'bearer': 'VIbYemNYt5Ovsg5HgnB9eWuQznMb9Om1CbYboaZLE3jsq8xRYcTHrlO30DRFXXtZtiVAmL6WPN3MV98WXAft5l4sXydQfrtIJeYidoKI9IFTXmNFJbasKIX881vdWXYx'
    },
  };
  return rp(options);
};

module.exports = {
  fetchAll
};
