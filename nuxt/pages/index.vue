<template>
  <section class="section">
    <div class="columns is-mobile">
      <card title="Free" icon="github">
        Open source on
        <a href="https://github.com/buefy/buefy">
          GitHub
        </a>
      </card>

      <card title="Responsive" icon="cellphone-link">
        <b class="has-text-grey">
          Every
        </b>
        component is responsive
      </card>

      <card title="Modern" icon="alert-decagram">
        Built with
        <a href="https://vuejs.org/">
          Vue.js
        </a>
        and
        <a href="http://bulma.io/">
          Bulma
        </a>
      </card>

      <card title="Lightweight" icon="arrange-bring-to-front">
        No other internal dependency
      </card>
    </div>
    <div>
      <section>
        <b-button @click="clickMe">Click Me</b-button>
        <p>Msg: {{ msg }}</p>
      </section>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import Card from "~/components/Card";

export default {
  name: "HomePage",

  components: {
    Card
  },

  data() {
    return {
      msg: "Let's start here"
    };
  },

  methods: {
    async clickMe() {
			this.$buefy.notification.open("Clicked!!");
			this.msg = "Clicked, waiting for reply";
			const response = await axios.get("http://localhost:3000/api/v1/hello");
			console.log(response.data);
			this.msg = response.data.msg;
    }
  }
};
</script>
