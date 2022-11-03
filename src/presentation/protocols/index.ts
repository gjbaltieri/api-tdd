// Poderia estar como export * from './controller'... mas o coverage do jest não reconhece e fica em 0%
export { Controller } from './controller'
export { HttpRequest, HttpResponse } from './http'
