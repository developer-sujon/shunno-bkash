const getDate = (date = new Date()) => date.getDate();
const getMonth = (date = new Date()) => date.toLocaleString('en-us', { month: 'long' });
const getFullYear = (date = new Date()) => date.getFullYear();

module.exports = { getDate, getMonth, getFullYear };
