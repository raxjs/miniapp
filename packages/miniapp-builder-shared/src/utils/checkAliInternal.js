const axios = require('axios').default;

module.exports = async function checkAliInternal() {
  try {
    const checkResult = await axios.get(
      'https://alilang-intranet.alibaba-inc.com/is_white_list.json',
      { headers: { 'need-json': 1 } }
    ).then((res) => res.data);
    return (
      checkResult &&
      checkResult.content === true &&
      checkResult.hasError === false
    );
  } catch (error) {
    return false;
  }
};
