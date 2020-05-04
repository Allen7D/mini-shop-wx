import { Base64 } from '../../miniprogram_npm/js-base64/index.js'
const baseUrl = 'https://server.mini-shop.ivinetrue.com/';

var app = getApp()

Page({
  // Super权限用于CMS(邮箱登录的方式)
  getSuperToken: function () {
    wx.request({
      url: baseUrl + 'v1/token',
      data: {
        account: '999@qq.com',
        secret: '123456',
        type: 101
      },
      method: 'POST',
      // 可以设置请求的 header，用于Token
      // header: {},
      success: function (res) {
        console.log('res', res.data);
        wx.setStorageSync('super_token', res.data.token);
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  // 调用登录接口(小程序登录)
  getToken: function () {
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.request({
          url: baseUrl + 'v1/token',
          data: {
            account: code,
            secret: '',
            type: 200
          },
          method: 'POST',
          success: function (res) {
            console.log('res', res.data)
            wx.setStorageSync('token', res.data.data.token);
          },
          fail: function (res) {
            console.log(res.data);
          }
        })
      }
    })
  },
  // 解析token
  decryptToken: function() {
    wx.request({
      url: baseUrl + 'v1/token/verify',
      data: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      success: function(res) {
        console.log('token', res.data)
      },
      fail: function(res) {
        console.log('fail', res)
      }
    })
  },
  // 查询用户信息
  getUser: function() {
    var token = wx.getStorageSync('token')
    wx.request({
      header: {
        'content-type': 'application/json',
        'authorization': `Basic ${Base64.encode(`${token}:$`)}`
      },
      url: baseUrl + 'v1/user',
      method: 'GET',
      success: function(res) {
        console.log('data', res.data)
      },
      fail: function (res) {
        console.log('fail', res)
      }
    })
  },
  // 查询最近上架商品
  getProductByRecent: function() {
    wx.request({
      url: baseUrl + 'v1/product/recent',
      method: 'GET',
      success: function(res) {
        console.log('data', res.data)
      },
      fail: function(res) {
        console.log('res', res)
      }
    })
  },
  // 查询用户的订单列表
  getOrderList: function () {
    var token = wx.getStorageSync('token')
    wx.request({
      header: {
        'content-type': 'application/json',
        'authorization': `Basic ${Base64.encode(`${token}:$`)}`
      },
      url: baseUrl + `v1/order?page={1}&size={10}`,
      method: 'GET',
      success: function (res) {
        console.log('data', res.data)
      },
      fail: function (res) {
        console.log('fail', res)
      }
    })
  },
})
