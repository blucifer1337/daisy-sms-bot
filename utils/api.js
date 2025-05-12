const axios = require('axios');
const logger = require('./logger');
require('dotenv').config();

const BASE_URL = 'https://daisysms.com/stubs/handler_api.php';

class DaisyAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async _makeRequest(params) {
    try {
      const response = await axios.get(BASE_URL, { 
        params: { ...params, api_key: this.apiKey },
        headers: { 'Accept': 'application/json' }
      });
      return response.data;
    } catch (error) {
      logger.error(`API request failed: ${error}`);
      throw error;
    }
  }

  async getBalance() {
    return this._makeRequest({ action: 'getBalance' });
  }

  async getNumber(service, maxPrice, options = {}) {
    const params = {
      action: 'getNumber',
      service,
      max_price: maxPrice,
      ...options
    };
    return this._makeRequest(params);
  }

  async getStatus(id, includeText = false) {
    const params = {
      action: 'getStatus',
      id,
      text: includeText ? 1 : 0
    };
    return this._makeRequest(params);
  }

  async setStatus(id, status) {
    return this._makeRequest({ action: 'setStatus', id, status });
  }

  async getPrices() {
    return this._makeRequest({ action: 'getPrices' });
  }

  async getPricesVerification() {
    return this._makeRequest({ action: 'getPricesVerification' });
  }

  async getExtraActivation(activationId) {
    return this._makeRequest({ action: 'getExtraActivation', activationId });
  }

  async setAutoRenew(id, value) {
    return this._makeRequest({ action: 'setAutoRenew', id, value: value ? 'true' : 'false' });
  }
}

module.exports = new DaisyAPI(process.env.API_KEY);