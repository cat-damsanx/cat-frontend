import axios from 'axios';
// var axios = require('axios');
// var qs = require('qs');
// const baseUrl = 'http://127.0.0.1:5000';
const baseUrl = 'https://cat-server-production.up.railway.app'

const createCatExam = async () => {
  return await axios.get(`${baseUrl}/start-cat`);
}

const estimateAbility = async (data) => {
  return await axios.post(`${baseUrl}/cat-api/estimate-ability`, { data });
};

const selectQuestion = async (data) => {
  return await axios.post(`${baseUrl}/cat-api/select-question`, { data });
};

const checkingStop = async (data) => {
  return await axios.post(`${baseUrl}/cat-api/checking-stop`, { data });
};

const getPlot = async (data) => {
  return await axios.post(`${baseUrl}/cat-api/get-plot`, { data })
}

export { createCatExam, estimateAbility, selectQuestion, checkingStop, getPlot };
