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
    <button id="lianxi" @click="lianxi">练 习</button>
  </div>
</template>

<script>
import { hex_md5 } from "../util/md5";
import httpHelper from "../util/httpHelper";
import { setTelPhone } from "../util/cacheManger";
import io from "socket.io-client";
const socket = io.connect("ws://127.0.0.1:3000");
const obj = { username: "aaa", content: "nnnnnn"};
export default {
  data() {
    return {
      phone: "15365655565",
      code: ""
    };
  },
  methods: {
    lianxi() {
      socket.emit("message", obj);
    },
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
        window.location.href = "/users.html";
      }
    }
  },
  mounted() {
    console.log("messtat");
    socket.on("message", function(obj) {
      document.getElementById("lianxi").innerHTML = obj.username;
    });
  }
};
</script>


