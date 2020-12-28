<template>
  <section class="section">
    <h2 class="title is-3 has-text-grey">
      Agents
    </h2>
    <div v-for="agent in agents" v-bind:key="agent._id">
      <div class="card">
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">{{ agent.salesperson_name }}</p>
              <p class="subtitle is-6">({{ agent.registration_no }})</p>
            </div>
          </div>

          <div class="content">
            <p>From: {{ agent.estate_agent_name }}</p>
            <p>Starting: {{ agent.registration_start_date }}</p>
            <p>
              <NuxtLink
                :to="
                  agent.estate_agent_license_no + '/' + agent.registration_no
                "
                >Details</NuxtLink
              >
            </p>
          </div>
        </div>
      </div>
      <hr />
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "AgentsPage",
  data() {
    return {
      agents: []
    };
  },
  mounted() {
    this.getAgents();
  },
  methods: {
    async getAgents() {
      const response = await axios.get("http://localhost:3000/api/v1/agents", {
        params: { limit: 10 }
      });
      this.agents = response.data;
    }
  }
};
</script>
