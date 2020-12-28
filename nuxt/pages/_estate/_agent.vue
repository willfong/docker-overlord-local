<template>
  <div>
    <h1 class="title">{{agent.salesperson_name}}</h1>
		<p>{{agent.registration_no}}</p>
		<p>{{agent.registration_start_date}}</p>
    <p>{{agent.registration_end_date}}</p>
    <p>{{agent.estate_agent_license_no}}</p>
    <p>{{agent.estate_agent_name}}</p>
  </div>
</template>
<script>
export default {
  async asyncData({ params, error, payload }) {
    return { agent: payload };
  },
  layout: "agent"
  // page component definitions
};
</script>
