import axios from 'axios';
import conf from '@/plugins/conf.js'

export const HTTP = axios.create({
  baseURL: conf.baseUrl(),
})

export const BLOB = axios.create({
  baseURL: conf.baseUrl(),
  responseType: 'blob',
  maxContentLength: Infinity
})