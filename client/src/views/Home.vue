<template>
  <div class="max-w-2xl mx-auto">
    <section class="border-b" v-if="!userDetails">
      <div class="mb-4 px-2 w-full flex flex-row">
        <input
          id="input1"
          class="w-full border px-4 py-2 rounded focus:border-blue-500 focus:shadow-outline outline-none"
          type="text"
          autofocus
          autocomplete="off"
          placeholder="Login with Username"
          v-model="username"
        />
        <button
          class="mx-2 px-4 py-2 text-sm rounded text-white bg-blue-500 focus:outline-none hover:bg-blue-400"
          @click="login"
          :disabled="!username"
        >
          Submit
        </button>
      </div>
    </section>
    <section class="border-b" v-if="userDetails">
      <div class="mb-4 px-2 w-full flex flex-row">
        <p>
          Logged in as: {{ userDetails.username }}
          <button
            class="mx-2 px-4 py-2 text-sm rounded text-white bg-blue-500 focus:outline-none hover:bg-blue-400"
            @click="logout"
          >
            Logout
          </button>
        </p>
      </div>
    </section>
    <p>Response from API: {{ message }}</p>
    <button @click="hitApi">Hit API</button>
    <button @click="posted">Hit POST</button>
    <button @click="getAll">Get All</button>

    <p>New Name: <input v-model="name" /> -- {{ name }}</p>
    <hr />
    <p>Key: <input v-model="key" /> -- {{ key }}</p>
    <p>Value: <input v-model="value" /> -- {{ value }}</p>
    <p>TTL: <input v-model="ttl" /> -- {{ ttl }}</p>
    <button @click="getCache">Get Cache</button>
    <button @click="setCache">Set Cache</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      username: null,
      userDetails: null,
      message: "Hit API Button",
      name: null,
      key: null,
      value: null,
      ttl: 0,
      backendServer: "http://localhost:5000",
    };
  },
  methods: {
    async login() {
      const response = await axios.post(
        `${this.backendServer}/api/login-with-username`,
        { username: this.username }
      );
      this.userDetails = response.data;
      console.log("JWT", response.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
      this.username = null;
    },
    logout() {
      this.userDetails = null;
      axios.defaults.headers.common["Authorization"] = null;
    },
    async hitApi() {
      const response = await axios.get("http://localhost:3000/");
      console.log(response.data);
      this.message = response.data.msg;
    },
    async posted() {
      const payload = { name: this.name };
      const response = await axios.post("http://localhost:3000/add", payload);
      console.log(response.data);
    },
    async getAll() {
      const response = await axios.get("http://localhost:3000/all");
      console.log(response.data);
    },
    async getCache() {
      const params = { key: this.key };
      const response = await axios.get("http://localhost:3000/cacheGet", {
        params,
      });
      console.log(response);
    },
    async setCache() {
      const params = { key: this.key, value: this.value, ttl: this.ttl };
      const response = await axios.post(
        "http://localhost:3000/cacheSet",
        params
      );
      console.log(response);
    },
  },
};
</script>
