<template>
  <div class="select-list">
    <select class="select" @input="handleSelect" :value="value"
      ><option
        v-for="item in data"
        :key="item.name"
        :value="item.value"
        :selected="item.value === value"
        >{{ item.name || item.value }}</option
      >
    </select>
  </div>
</template>

<script>
export default {
  props: ["data", "value"],
  methods: {
    handleSelect({ currentTarget }) {
      const value = currentTarget.options[currentTarget.selectedIndex].value;
      this.$emit("input", value);
    }
  }
};
</script>
