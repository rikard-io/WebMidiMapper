<template>
  <div id="wmm__app__">
    <span id="wmm__app__instructions">Esc to close, shift+m to show</span>
    <Mappings ref="mappings" v-if="showUI" />
  </div>
</template>

<script>
import Mappings from "./Mappings";

export default {
  components: {
    Mappings
  },
  data() {
    return {
      showUI: false
    };
  },
  mounted() {
    document.addEventListener(
      "keydown",
      e => {
        if (e.key === "M") {
          this.toggleUI(true);
        } else if (e.keyCode === 27) {
          this.toggleUI(false);
        }
      },
      false
    );

    window.__wmm_enable = function() {
      this.toggleUI(true);
    };

    this.toggleUI(true);
  },

  methods: {
    toggleUI(toggle) {
      this.showUI = toggle;
    }
  }
};
</script>

<style lang="scss">
// Most CSS goes here under #wmm__app__ to try and encapsulate everything
[data-wmm__selected] {
  border: 3px solid red !important;
}

#wmm__app__ {
  box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.1);
  overflow: scroll;
  max-height: 100vh;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  font-family: helvetica;
  letter-spacing: 0.12rem;
  z-index: 999;
  background: #eee;
  padding: 20px;

  h1,
  h2 {
    font-size: 14px;
    font-weight: 100;
  }
  
  #wmm__app__instructions {
    font-size: 8px;
  }

  .select,
  input,
  button,
  label {
    font-size: 10px;
    font-family: sans-serif;
    font-weight: 100;
    line-height: 1.3;
    margin: 0;
    padding: 0;
  }

  button {
    text-align: center;
  }

  .select,
  input,
  button {
    display: block;
    color: rgb(15, 14, 18);
    background-color: rgb(200, 200, 200);
    padding: 0.3em 1.2em 0.3em 0.8em;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
    margin: 2px;
    border: 1px solid rgb(86, 90, 94);
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
    border-radius: 0;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: rgb(200, 200, 200);
    min-width: 40px;
  }
  .wmm__mapping_form_input {
    width: 60px;
    input {
      width: 60px;
    }
  }
  button {
    width: auto;
  }
  .select::-ms-expand {
    display: none;
  }
  .select:hover {
    border-color: #888;
  }
  .select:focus {
    border-color: #aaa;
    box-shadow: 0 0 1px 3px rgba(59, 153, 252, 0.7);
    box-shadow: 0 0 0 3px -moz-mac-focusring;
    color: #222;
    outline: none;
  }
  .select option {
    font-weight: normal;
  }
}
</style>
