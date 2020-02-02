<template>
  <div class="select-list">
    <select class="select" @input="handleSelect"
      ><option
        v-for="action in actions"
        :key="action.key"
        :value="action.key"
        :selected="value ? action.key === value.key : false"
        >{{ action.name }}</option
      >
    </select>
    <input
      @input="handleArgInput"
      v-for="(v, k) in args"
      :key="k"
      v-model="args[k]"
      :placeholder="k"
    />
  </div>
</template>

<script>
import actions from "@/actions";

export default {
  props: ["value"],
  methods: {
    handleSelect({ currentTarget }) {
      const actionKey =
        currentTarget.options[currentTarget.selectedIndex].value;
      const action = actions[actionKey];
      let args = null;
      if (action.args) {
        args = {};
        Object.keys(action.args).forEach(k => (args[k] = ""));
      }
      this.$emit("input", {
        key: actionKey,
        args
      });
    },
    handleArgInput({ currentTarget }) {
      this.$emit("input", this.value);
    }
  },
  computed: {
    args() {
      if (!this.value) {
        return {};
      }
      return this.value.args;
    },
    action() {
      return this.value ? actions[this.value.key] : null;
    },
    actions() {
      return Object.keys(actions).map(key => {
        return {
          key,
          ...actions[key]
        };
      });
    }
  }
};
</script>
