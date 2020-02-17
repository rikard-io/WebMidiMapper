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
    <template v-for="(v, k) in args">
      <select v-if="Array.isArray(argsOptions(k))" class="select" :key="k" v-model="args[k]" @input="handleArgInput">
        <option v-for="opt in argsOptions(k)" :value="opt" :key="opt">{{
          opt
        }}</option>
      </select>
      <input
        v-else
        :key="k"
        @input="handleArgInput"
        v-model="args[k]"
        :placeholder="k"
      />
    </template>
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
      setTimeout(()=>{
        this.$emit("input", {key: this.key, args: this.args});
      },20)
    },
    argsOptions(key) {
      return this.action && this.action.args[key];
    }
  },
  watch:{
    value:{
      immediate: true,
      handler(v){
        this.key = v.key;
        this.args = v.args;
      }
    }
  },
  data(){
    return {
      key: '',
      args: {}
    }
  },
  computed: {
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
