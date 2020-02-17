import eventMixin from "@/utils/eventMixin";

function deepClone(obj){
  return JSON.parse(JSON.stringify(obj));
}

function compare(a, b) {
  const bKeys = Object.keys(b);
  for (var i = 0; i < bKeys.length; i++) {
    var propName = bKeys[i];
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
}

export default {
  state: {
    mappings: {},
    idCounter: 0
  },
  addMapping(mapping) {
    mapping.id = mapping.id || `ci-${++this.state.idCounter}`;
    this.state.mappings[mapping.id] = mapping;
    this.trigger("add-mapping", mapping);
    this._autoSave();
  },
  updateMapping(mapping) {
    const old = this.getMapping(mapping.id);
    const updated = {
      ...old,
      ...deepClone(mapping)
    };

    this.state.mappings[mapping.id] = updated;
    this.trigger("update-mapping", this.getMapping(mapping.id), old);
    this._autoSave();
  },
  removeMapping(id) {
    const mapping = this.getMapping(id);
    delete this.state.mappings[id];
    this.trigger("remove-mapping", mapping);
    this._autoSave();
  },
  _autoSave() {
    if (this.autoSave) {
      this.save();
    }
  },
  getMapping(id) {
    return deepClone(this.state.mappings[id]);
  },
  getMappingByProps(props) {
    const propsWidthoutId = { ...props };
    delete propsWidthoutId.id;
    const result = Object.values(this.state.mappings).find(m => {
      return compare(m, propsWidthoutId);
    });
    return result ? deepClone(result) : null;
  },
  save() {
    const json = JSON.stringify(this.state);
    window.localStorage.setItem("webmidimapper-state", json);
  },
  restore() {
    const json = window.localStorage.getItem("webmidimapper-state");
    const data = JSON.parse(json);
    this.state.idCounter = data.idCounter;
    Object.values(data.mappings).forEach(m => {
      this.addMapping(m);
    });
  },
  tryRestore() {
    try {
      this.restore();
    } catch (e) {}
  },
  ...eventMixin
};
