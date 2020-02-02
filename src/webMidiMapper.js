import * as webmidi from "webmidi";

let mappingId = 1;

function parseValue(v) {
  const intV = parseInt(v);
  if (isFinite(intV) && intV !== null) return intV;
  try {
    return webmidi.noteNameToNumber(v) + 12; // follow Abletons convention (C3 = 60)
  } catch (e) {}
  return null;
}

export const validateValue = function(v) {
  if (v === "all") return true;
  const parsedValue = parseValue(v);
  if (parsedValue === null) return false;
  if (isFinite(parsedValue)) return parsedValue >= 0 && parsedValue <= 127;
  return false;
};

class Binding {
  constructor(
    mapper,
    inputId,
    event,
    callback,
    value = "all",
    channel = "all"
  ) {
    this.id = ++mappingId;
    this.callback = callback;
    this.value = parseValue(value) || "all";
    this.event = event;
    this.channel = channel;
    this.inputId = inputId;
    this.fn = this.fn.bind(this);
    this.mapper = mapper;
  }

  fn(e) {
    if (this.mapper.muted) {
      return;
    }
    const targetValue = e.data[1]; // [event, value1, value2]
    if (this.value === "all" || this.value === targetValue) {
      this.callback(e);
    }
  }
  setId(id) {
    this.id = id;
  }
}

class WebMidiMapper {
  constructor() {
    this._bindings = [];
    this.muted = false;
  }

  map(inputId, event, callback, value = "all", channel = "all") {
    const inputs =
      inputId === "all" ? webmidi.inputs : [webmidi.getInputById(inputId)];
    const binding = new Binding(this, inputId, event, callback, value, channel);
    this._bindings.push(binding);

    inputs.forEach(input => {
      input.addListener(event, channel, binding.fn);
    });
    return binding;
  }

  unmap(id) {
    if (typeof id === "function") {
      const fn = id;
      id = this._bindings.find(m => m.callback === fn).id;
    }
    const { inputId, event, channel, fn } = this._bindings.find(
      b => b.id === id
    );
    const inputs =
      inputId === "all" ? webmidi.inputs : [webmidi.getInputById(inputId)];
    inputs.forEach(input => input.removeListener(event, channel, fn));
    this._bindings = this._bindings.filter(b => b.id !== id);
    return this;
  }

  nextValue(inputId, event, cb, channel = "all") {
    const events = event === "all" ? Object.keys(this.events) : [event];
    const inputs =
      inputId === "all" ? webmidi.inputs : [webmidi.getInputById(inputId)];
    const _cb = e => {
      events.forEach(e => {
        inputs.forEach(input => input.removeListener(e, channel, _cb));
      });
      cb({
        ...e,
        note: e.note ? e.note.number : -1,
        value: e.note ? e.note.number : -1
      });
    };
    events.forEach(e => {
      inputs.forEach(input => input.addListener(e, channel, _cb));
    });
  }

  get supported() {
    return webmidi.supported;
  }
  get inputs() {
    return webmidi.inputs;
  }
  get outputs() {
    return webmidi.outputs;
  }
  get events() {
    return webmidi.MIDI_CHANNEL_MESSAGES;
  }
  mute() {
    this.muted = true;
  }
  unmute() {
    this.muted = false;
  }
  enable() {
    return new Promise((resolve, reject) => {
      webmidi.enable(err => {
        if (!err) {
          resolve(this);
        } else {
          reject(err);
        }
      });
    });
  }
}

export default new WebMidiMapper();
