<template>
  <MappingForm v-model="mapping" class="mapping-update">
    <button @click="removeMapping">x</button>
  </MappingForm>
</template>

<script>
import webMidiMapper from "@/webMidiMapper";
import getDomPath from "@/utils/getDomPath";
import actions from "@/actions";
import MappingForm from "./MappingForm";

export default {
  components: {
    MappingForm
  },
  props: ["id"],
  computed: {
    valid() {
      return !!this.action && this.action != "off";
    },
    mapping: {
      get() {
        return this.$store.getMapping(this.id);
      },
      set(v) {
        this.$store.updateMapping(v);
      }
    }
  },
  methods: {
    removeMapping() {
      this.$store.removeMapping(this.id);
    }
  }
};
</script>

<style lang="scss">
.mapping-update {
  color: rgb(220, 220, 220);

  label {
    line-height: 1.4;
    input {
      display: inline;
    }
  }
}
</style>
