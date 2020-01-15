<template>
  <select v-on:change="$emit('selected', item)" v-model="item">
    <option disabled selected value=""><slot></slot></option>
    <option v-for="item in itemlist" v-bind:key="item">
      {{ item }}
    </option>
  </select>
</template>

<script>
export default {
  name: "Selector",
  data: function() {
    return { item: "" };
  },
  props: ["itemlist"]
};
</script>
