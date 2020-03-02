<template>
  <div class="select-list">
    <select class="select" ref="selectAction" @input="handleSelect">
      <option :value="null" v-if="showDefaultOption" selected>Select action...</option>
      <option
        v-for="action in actions"
        :key="action.key"
        :value="action.key"
        :selected="(value && !showDefaultOption) ? action.key === value.key : false"
        >{{ action.name }}</option
      >
    </select>
    <template v-for="(v, k) in args">
      <select
        v-if="Array.isArray(argsOptions(k))"
        class="select"
        :key="k"
        v-model="args[k]"
        @input="handleArgInput"
      >
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
    handleSelect() {
      const actionKey = this.$refs.selectAction.options[
        this.$refs.selectAction.selectedIndex
      ].value;
      let args = null;
      if (actionKey) {
        const action = actions[actionKey];
        if (action.args) {
          args = {};
          Object.keys(action.args).forEach(k => (args[k] = ""));
        }
      }
      this.$emit("input", {
        key: actionKey,
        args
      });
    },
    handleArgInput({ currentTarget }) {
      setTimeout(() => {
        this.$emit("input", { key: this.key, args: this.args });
      }, 20);
    },
    argsOptions(key) {
      return this.action && this.action.args[key];
    },
    validate(){
      if(!this.action) return false;
      console.log('validating..')
      if(this.action.args){
        if(Object.keys(this.action.args).filter((k)=>!this.args[k]).length){
          console.log('invalid')
          return false;
        }
      }
      return true;
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log();
    });
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        this.key = v.key;
        this.args = v.args;
      }
    }
    // action: {
    //   immediate: true,
    //   handler(action){
    //     if (action && action.args) {
    //       let args = {};
    //       Object.keys(action.args).forEach(k => (args[k] = ""));
    //       this.args = args;
    //     }
    //   }
    // }
  },
  data() {
    return {
      key: "",
      args: {}
    };
  },
  computed: {
    showDefaultOption() {
      return !this.action;
    },
    action() {
      return this.value ? actions[this.key] : null;
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
