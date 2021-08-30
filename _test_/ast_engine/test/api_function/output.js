const productosApi = () => ({
  async getDelete() {},

  async 34234(params = {}) {
    try {
      let response = await fetch(`534534`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          "access-token": token
        },
        body: JSON.stringify({ ...params
        })
      });

      if (!response.ok) {
        let error = await response.json();
        throw error;
      }

      let data = await response.json();
      return data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }

});

export default productosApi;