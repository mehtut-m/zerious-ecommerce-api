const axios = require('axios');

module.exports.getAllComplete = async (trackingArr, token) => {
  const res = await axios.post(
    process.env.THAIPOST_API_URL,
    {
      status: 501, // นำจ่ายสำเร็จ
      language: 'TH',
      barcode: [...trackingArr],
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return res.data.response.items;
};

module.exports.getItemStatus = async (tracking, token) => {
  const res = await axios.post(
    process.env.THAIPOST_API_URL,
    {
      status: 'all',
      language: 'TH',
      barcode: [tracking],
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return res.data.response.items;
};
