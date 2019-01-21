<template>
  <div class="login-box">
    <div>
      <p>
        <input type="text" placeholder="手机号" v-model.trim="phone">
        <input type="text" placeholder="验证码" v-model="code" readonly="readonly">
      </p>
      <input type="button" value="发送验证码" @click="getCode">
    </div>
    <button id="login-btn" @click="loginUser">登 录</button>
  </div>
</template>

<script>
import { hex_md5 } from "../util/md5";
import httpHelper from "../util/httpHelper";
import { setTelPhone } from "../util/cacheManger";
export default {
  data() {
    return {
      phone: "15365655565",
      code: ""
    };
  },
  methods: {
    getCode() {
      let _self = this;
      let tel = /^[0-9]{11}$/.test(_self.phone);
      if (!tel) {
        _self.phone = "手机号不正确";
        return;
      }
      if (_self.phone) {
        let params = { num: _self.phone };
        httpHelper.get(
          _self,
          "getVeryCode",
          params,
          data => {
            if (data.body.code < 0) {
              alert(data.body.description);
              return;
            }
            _self.code = data.body.data;
          },
          err => {
            alert("shi bai");
          }
        );
      }
    },
    loginUser() {
      let _self = this;
      if (_self.phone && _self.code) {
        setTelPhone(_self.phone);
        //建立连接
        let webSocket = new WebSocket("ws://localhost:8001/");
        let opendata, closedata, messagedata;
        //开启连接
        webSocket.onopen = function(e) {
          opendata = e;
          console.log("webSocket open", e);
          document.getElementById("recv").innerHtml(JSON.parse(e.data));
        };
        //关闭连接
        // webSocket.onclose = function(e) {
        //   closedata = e;
        //   console.log("webSocket close", e);
        //   document.getElementById("recv").innerHtml(JSON.parse(e.data));
        // };

        //拿到返回
        webSocket.onmessage = function(e) {
          messagedata = e;
          console.log("webSocket close", e);
          document.getElementById("recv").innerHtml(JSON.parse(e.data));
        };

        //发送信息
        // document.getElementById("sendBtn").onclick = function() {
        //   var text = document.getElementById("sendTxt").value;
        //   webSocket.send(text);
        // };
        window.location.href = "/users.html";
      }
    }
  }
};
</script>


