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
  data() {
    return {
      uiMappingId: null,
      autoMappingValue: false,
      currentTargetEl: null
    };
  },
  computed: {
    validSelector() {
      if (!this.selector) return false;
      return !!querySelector(this.selector).length;
    },
    inputId: {
      get() {
        return this.value.inputId;
      },
      set(v) {
        this.value.inputId = v;
        this.handleInput();
      }
    },
    channel: {
      get() {
        return this.value.channel;
      },
      set(v) {
        this.value.channel = v;
        this.handleInput();
      }
    },
    event: {
      get() {
        return this.value.event;
      },
      set(v) {
        this.value.event = v;
        this.handleInput();
      }
    },
    mappingValue: {
      get() {
        return this.value.value;
      },
      set(v) {
        this.value.value = v;
        this.handleInput();
      }
    },
    action: {
      get() {
        return this.value.action;
      },
      set(v) {
        this.value.action = v;
        this.handleInput();
      }
    },
    selector: {
      get() {
        return this.value.selector;
      },
      set(v) {
        this.value.selector = v;
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
        this.value.value = e.value;
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
        selector: this.selector,
        inputId: this.inputId,
        event: this.event,
        action: this.action,
        value: this.mappingValue,
        channel: this.channel
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
