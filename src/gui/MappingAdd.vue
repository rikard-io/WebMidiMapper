<template>
  <MappingForm
    class="wmm__add_form"
    ref="mappingForm"
    @input="validate"
    v-model="mapping"
  >
    <button @click="handleAdd" :disabled="!valid">+</button>
  </MappingForm>
</template>

<script>
import webMidiMapper from "@/webMidiMapper";
import MappingForm from "./MappingForm";
import getDomPath from "@/utils/getDomPath";

function calculateSelector(el) {
  if (el.id) {
    return "#" + el.id;
  }
  return getDomPath(el);
}

export default {
  components: {
    MappingForm
  },
  data() {
    return {
      mapping: {
        inputId: "all",
        event: "noteon",
        value: "all",
        action: { key: "", args: null },
        selector: "",
        channel: "all"
      },
      valid: false
    };
  },
  methods: {
    validate() {
      if (!this.$refs.mappingForm.validate()) {
        this.valid = false;
      } else if (this.$store.getMappingByProps(this.mapping)) {
        this.valid = false;
      } else {
        this.valid = true;
      }
    },
    reset() {
      this.mapping = {
        ...this.mapping,
        inputId: "all",
        event: "noteon",
        value: "all",
        action: { key: "", args: null },
        channel: "all"
      };
    },
    handleAdd() {
      if (!this.$store.getMappingByProps(this.mapping)) {
        this.$store.addMapping({ ...this.mapping });
      }
      this.reset();
    }
  }
};
</script>
