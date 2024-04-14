import { API_URL } from "./constants";
class Client {
  /**
   * Simple client to make API requests with fetch
   */
  baseUrl = "";
  accessToken = "";

  constructor() {
    this.baseUrl = API_URL;
  }

  async handleResponse(response) {
    if (!response.ok) {
      const responseJson = await response.json();
      throw new Error(responseJson.detail);
    }
    return await response.json();
  }

  async get(url, token = null) {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "GET",
      headers: this.getDefaultHeaders(token),
    });
    return await this.handleResponse(response);
  }

  async post(url, data, token = null) {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      headers: this.getDefaultHeaders(token),
      body: JSON.stringify(data),
    });
    return await this.handleResponse(response);
  }

  async put(url, data, token = null) {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "PUT",
      headers: this.getDefaultHeaders(token),
      body: JSON.stringify(data),
    });
    return await this.handleResponse(response);
  }

  async delete(url, token = null) {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "DELETE",
      headers: this.getDefaultHeaders(token),
    });
    return await this.handleResponse(response);
  }

  getDefaultHeaders(token = null) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }
}

const client = new Client();

export default client;
