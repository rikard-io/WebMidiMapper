<template>
  <div>
    <h2>Mappings</h2>
    <table>
      <tr>
        <th>Selector</th>
        <th>Input</th>
        <th>Channel</th>
        <th>Event</th>
        <th>Value</th>
        <th>Action</th>
        <th></th>
      </tr>
      <MappingUpdate
        v-for="mapping in mappings"
        :key="mapping.id"
        :id="mapping.id"
      />
      <tr>
        <th>New</th>
      </tr>
      <MappingAdd id="wmm__add_form" ref="mappingAdd" />
    </table>
  </div>
</template>

<script>
import MappingUpdate from "./MappingUpdate";
import MappingAdd from "./MappingAdd";

export default {
  components: {
    MappingUpdate,
    MappingAdd
  },
  data() {
    return {
      selector: null,
      mappings: []
    };
  },
  mounted() {
    this.$store.on("add-mapping", () => {
      this.updateMappings();
    });
    this.$store.on("update-mapping", () => {
      this.updateMappings();
    });
    this.$store.on("remove-mapping", mapping => {
      this.updateMappings();
    });

    this.updateMappings();
  },
  methods: {
    updateMappings() {
      this.mappings = Object.values(this.$store.state.mappings);
    }
  }
};
</script>

<style lang="scss">
#wmm__app__ {
  .wmm__mapping_meta_selector {
    display: inline;
    font-size: 8px;
  }

  #wmm__add_form {
    margin-top: 20px;
    border-top: 1px solid rgb(200, 200, 200);
  }

  table {
    margin: 0;
    width: 100%;
    border-collapse: collapse;
    th {
      text-align: left;
      font-size: 10px;
    }
    td {
      padding: 0;
      margin: 0;
    }
    tr td:last-child {
      width: 1%;
      white-space: nowrap;
    }
  }
}
</style>
