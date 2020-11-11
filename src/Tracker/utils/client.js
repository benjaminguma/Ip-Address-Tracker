class Client {
  async getUserIp() {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data;
  }

  async getGeoInfo({ type, value }) {
    if (type.toLowerCase() === "domain") {
      const reg = /(https?:\/\/)|(w{3}\.)|(\/.*)/g;
      value = value.replace(reg, "");
    }

    const res = await fetch(
      `https://geo.ipify.org/api/v1?apiKey=${process.env.REACT_APP_IPIFY_KEY}&${type}=${value}`
    );
    if (!res.ok) throw Error(res.statusText);
    const data = await res.json();
    return data;
  }
}

export default new Client();
