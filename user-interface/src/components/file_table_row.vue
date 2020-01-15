<template>
  <tr>
    <td>{{ filename }}</td>
    <td>
      <!-- <button v-on:click="$emit('compute', filename)">Start computation</button> -->
      <tree-view :data="data"></tree-view>
    </td>
  </tr>
</template>

<script>
export default {
  name: "FileTableRow",
  props: ["filename", "data"]
};
</script>
