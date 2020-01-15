<template>
  <table id="file_table" border="1">
    <tr
      is="FileTableRow"
      v-for="filename in files"
      v-on:compute="$emit('compute', $event)"
      v-bind:key="filename.id"
      v-bind:filename="filename.location"
      v-bind:data="filename"
    ></tr>
  </table>
</template>

<script>
import FileTableRow from "./file_table_row.vue";
export default {
  name: "FileList",
  props: ["files"],
  components: { FileTableRow }
};
</script>
