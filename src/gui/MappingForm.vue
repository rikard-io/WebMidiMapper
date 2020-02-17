<template>
  <tr class="wmm__mapping_form">
    <td>
      <div>
        <input v-model="selector" :class="{ error: !validSelector }" />
        <button @click="handleElementPick">
          📌
        </button>
      </div>
    </td>
    <td><SelectList :data="inputs" v-model="inputId" /></td>
    <td><SelectList :data="channels" v-model="channel" /></td>
    <td><SelectList :data="events" v-model="event" /></td>
    <td class="wmm__mapping_form_input">
      <input
        type="text"
        v-model="mappingValue"
        :class="{ error: !validateMappingValue() }"
      /><button
        :class="{ wmm__tint_button: true, wmm__blink: autoMappingValue }"
        @click="handleAutoMapValue"
      >
        m
      </button>
    </td>
    <td>
      <ActionSelect v-model="action" />
      <button ref="inputDot" class="wmm__tint_button">
        t
      </button>
    </td>
    <td><slot /></td>
  </tr>
</template>

<script>
import webMidiMapper from "@/webMidiMapper";
import { validateValue } from "@/webMidiMapper";
import SelectList from "./SelectList";
import ActionSelect from "./ActionSelect";
import elementSelector from "./elementSelector";
import getDomPath from "@/utils/getDomPath";
import querySelector from "@/utils/querySelector";

function calculateSelector(el) {
  if (el.id) {
    return "#" + el.id;
  }
  if (el.classList.contains("wmm__mapping_meta_selector")) {
    return el.getAttribute("data-wmm__mapping_meta_selector");
  }
  return getDomPath(el);
}

export default {
  components: {
    SelectList,
    ActionSelect
  },
  props: ["value"],
  watch:{
    value(v){
      Object.assign(this.internalValue, ...v);
    }
  },
  data() {
    return {
      uiMappingId: null,
      autoMappingValue: false,
      currentTargetEl: null,
      internalValue: JSON.parse(JSON.stringify(this.value))
    };
  },
  computed: {
    validSelector() {
      if (!this.selector) return false;
      return !!querySelector(this.selector).length;
    },
    inputId: {
      get() {
        return this.internalValue.inputId;
      },
      set(v) {
        this.internalValue.inputId = v;
        this.handleInput();
      }
    },
    channel: {
      get() {
        return this.internalValue.channel;
      },
      set(v) {
        this.internalValue.channel = v;
        this.handleInput();
      }
    },
    event: {
      get() {
        return this.internalValue.event;
      },
      set(v) {
        this.internalValue.event = v;
        this.handleInput();
      }
    },
    mappingValue: {
      get() {
        return this.internalValue.value;
      },
      set(v) {
        this.internalValue.value = v;
        this.handleInput();
      }
    },
    action: {
      get() {
        return this.internalValue.action;
      },
      set(v) {
        this.internalValue.action = v;
        this.handleInput();
      }
    },
    selector: {
      get() {
        return this.internalValue.selector;
      },
      set(v) {
        this.internalValue.selector = v;
        this.handleInput();
      }
    },
    valid() {
      if (!this.action) return false;
      if (!this.validSelector) {
        return false;
      }
      return !this.$store.getMappingByProps(this.serialize());
    },
    inputs() {
      return [
        {
          name: "all",
          value: "all"
        },
        ...webMidiMapper.inputs.map(i => {
          return {
            name: i.name,
            value: i.id
          };
        })
      ];
    },
    channels() {
      const channels = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16
      ].map((v, i) => {
        return {
          value: i + 1,
          name: i + 1
        };
      });
      channels.unshift({
        name: "all",
        value: "all"
      });
      return channels;
    },
    events() {
      const events = webMidiMapper.events;
      return Object.keys(events).map(key => {
        return {
          value: key,
          name: key
        };
      });
    }
  },
  mounted() {
    setTimeout(() => {
      this.updateMapping();
    }, 200);
  },
  methods: {
    handleTrigger() {
      this.$refs.inputDot.classList.add("wmm__mapping_form_active");
      setTimeout(() => {
        this.$refs.inputDot.classList.remove("wmm__mapping_form_active");
      }, 50);
    },
    updateMapping() {
      if (this.uiMappingId) {
        webMidiMapper.unmap(this.uiMappingId);
      }
      this.uiMappingId = webMidiMapper.map(
        this.inputId,
        this.event,
        () => {
          this.handleTrigger();
        },
        this.mappingValue,
        this.channel
      ).id;
    },
    handleAutoMapValue() {
      this.autoMappingValue = true;
      webMidiMapper.nextValue(this.inputId, this.event, e => {
        this.value.value = e.data[1];
        this.autoMappingValue = false;
        this.handleInput();
      });
    },
    validateMappingValue() {
      return validateValue(this.mappingValue);
    },
    handleElementPick() {
      const callback = ({ target }) => {
        this.value.selector = calculateSelector(target);
        this.handleInput();
        elementSelector.off("select", callback);
        elementSelector.disable();
      };
      elementSelector.on("select", callback);
      elementSelector.enable();
    },
    handleInput() {
      this.$emit("input", this.serialize());
      this.updateMapping();
    },
    serialize() {
      return {
        id: this.value.id,
        selector: this.internalValue.selector,
        inputId: this.internalValue.inputId,
        event: this.internalValue.event,
        action: this.internalValue.action,
        value: this.internalValue.mappingValue,
        channel: this.internalValue.channel
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.wmm__mapping_form {
  label,
  input,
  select {
    &.error {
      border: 1px solid red !important;
    }
    display: block;
    width: 100%;
  }
  td {
    > div {
      display: flex;
    }

    position: relative;
  }
}

#wmm__app__ {
  button.wmm__tint_button {
    position: absolute;
    width: 8px !important;
    height: 8px !important;
    min-width: 10px !important;
    min-height: 10px !important;
    background: rgb(100, 100, 100);
    line-height: 0;
    padding: 0;
    margin: 0;
    top: 2px;
    right: 2px;
    overflow: hidden;
    border-radius: 0;
    padding: 0;
    font-size: 5px;
    color: #fff;
    &.wmm__blink {
      animation: wmm__blinking 0.5s infinite;
    }

    &.wmm__mapping_form_active {
      background: #fff;
    }
  }
}

@keyframes wmm__blinking {
  0% {
    opacity: 1;
  }
  49% {
    opacity: 1;
  }
  60% {
    opacity: 0.4;
  }
  99% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}
</style>
