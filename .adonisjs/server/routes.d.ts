import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'home.index': { paramsTuple?: []; params?: {} }
    'vehicles.index': { paramsTuple?: []; params?: {} }
    'vehicles.create': { paramsTuple?: []; params?: {} }
    'vehicles.store': { paramsTuple?: []; params?: {} }
    'vehicles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vehicles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vehicles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vehicles.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vehicles.listing': { paramsTuple?: []; params?: {} }
    'vehicles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookings.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookings.bookings': { paramsTuple?: []; params?: {} }
    'bookings.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookings.store_comment': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'profile': { paramsTuple?: []; params?: {} }
    'profile.update': { paramsTuple?: []; params?: {} }
    'vehicles.search': { paramsTuple?: []; params?: {} }
    'admin.index': { paramsTuple?: []; params?: {} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.vehicles': { paramsTuple?: []; params?: {} }
    'admin.comments': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'home.index': { paramsTuple?: []; params?: {} }
    'vehicles.index': { paramsTuple?: []; params?: {} }
    'vehicles.create': { paramsTuple?: []; params?: {} }
    'vehicles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vehicles.listing': { paramsTuple?: []; params?: {} }
    'vehicles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookings.bookings': { paramsTuple?: []; params?: {} }
    'bookings.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'profile': { paramsTuple?: []; params?: {} }
    'vehicles.search': { paramsTuple?: []; params?: {} }
    'admin.index': { paramsTuple?: []; params?: {} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.vehicles': { paramsTuple?: []; params?: {} }
    'admin.comments': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'home.index': { paramsTuple?: []; params?: {} }
    'vehicles.index': { paramsTuple?: []; params?: {} }
    'vehicles.create': { paramsTuple?: []; params?: {} }
    'vehicles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vehicles.listing': { paramsTuple?: []; params?: {} }
    'vehicles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookings.bookings': { paramsTuple?: []; params?: {} }
    'bookings.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'profile': { paramsTuple?: []; params?: {} }
    'vehicles.search': { paramsTuple?: []; params?: {} }
    'admin.index': { paramsTuple?: []; params?: {} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.vehicles': { paramsTuple?: []; params?: {} }
    'admin.comments': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'vehicles.store': { paramsTuple?: []; params?: {} }
    'vehicles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vehicles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'vehicles.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookings.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookings.store_comment': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'profile.update': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}