import "./scss/actions.scss";

function createAnimateJsAction(fx) {
  return els => {
    return () => {
      els.forEach(el => {
        el.classList.add("animated", fx);
        el.addEventListener("animationend", function handleAnimationEnd() {
          el.classList.remove("animated", fx);
          el.removeEventListener("animationend", handleAnimationEnd);
        });
      });
    };
  };
}

export default {
  filter:{
    name: "🐫 Filter",
    args: {
      type: ['blur',
      'brightness',
      'contrast',
      'grayscale',
      'hue-rotate',
      'invert',
      'opacity',
      'saturate',
      'sepia']
    },
    create: (els, args) =>{
      const regString = `${args.type}\\(.*?\\)`;
      const regEx = new RegExp(regString,'gmi');
      return (event) => {
        els.forEach(el => {
          const unit = args.type === 'hue-rotate' ? 'deg' : (args.type === 'blur' ? 'px' : '');
          const max = unit === 'px' ? 40 : (unit === 'deg' ? 360 : 1);
          const val = (event.data[2] / 127) * max;
          el.style.filter = el.style.filter.replace(regEx,'');
          el.style.filter += ` ${args.type}(${val}${unit})`;
        });
      };
    },
    clear: (els, args) =>{
      const regString = `${args.type}\\(.*?\\)`;
      const regEx = new RegExp(regString,'gmi');
      els.forEach(el => {
        el.style.filter = el.style.filter.replace(regEx,'');
      });
    }
  },
  bounce: {
    name: "🏀 Bounce",
    create: createAnimateJsAction("bounce")
  },
  heartBeat: {
    name: "❤️ Beat",
    create: createAnimateJsAction("heartBeat")
  },
  flash: {
    name: "📸 Flash",
    create: createAnimateJsAction("flash")
  },
  rotateIn: {
    name: "℺ Rotate",
    create: createAnimateJsAction("rotateIn")
  },
  hinge: {
    name: "⛓Hinge",
    create: createAnimateJsAction("hinge")
  },
  shuffle: {
    name: "🌪 Shuffle",
    create: els => {
      return () => {
        els.forEach(el => {
          const children = el.childNodes;
          if (children.length) {
            children.forEach(child => {
              child.parentNode.appendChild(child);
            });
          } else {
            const text = el.innerText.split("");
            const first = text.shift();
            text.push(first);
            el.innerText = text.join("");
          }
        });
      };
    }
  },
  color: {
    name: "🟥🟨🟦🟩 Color",
    create: els => {
      return () => {
        els.forEach(el => {
          const h = Math.random() * 360;
          el.style.backgroundColor = `hsl(${h},38%,30%)`;
          el.style.color = `hsl(${h + 180},28%,70%)`;
        });
      };
    }
  },
  blackWhite: {
    name: "⬜️⬛️ Invert",
    create: els => {
      let i = 0;
      return () => {
        els.forEach(el => {
          el.style.filter = i ? "invert(1)" : "invert(0)";
          i = i ? 0 : 1;
        });
      };
    }
  },
  keydown: {
    name: "⌨️ Keydown",
    args: {
      keyCode: Number,
    },
    create: (els, args) => {
      function getKeyCode(char) {
        let keyCode = char.charCodeAt(0);
        if (keyCode > 90) {
          // 90 is keyCode for 'z'
          return keyCode - 32;
        }
        return keyCode;
      }
      function parseStringKey(_str) {
        let str = _str.replace(/\"/g, "");
        if(str.length === 1){
          return getKeyCode(str);
        }
        switch(str){
          case 'left': return 37;
          case 'right': return 39;
          case 'up': return 38;
          case 'down': return 40;
          case 'enter': return 13;
          case 'space': return 32;
          default:
            throw new Error('Unrecognized shorthand '+ str)
         }
      }

      let keyCode;
      let charCode;
      if (args.keyCode[0] === '"') {
        keyCode = parseStringKey(args.keyCode);
        if(args.keyCode.length === 3) charCode = args.keyCode.charCodeAt(1);
      } else {
        keyCode = parseInt(args.keyCode);
      }

     
      if (isNaN(keyCode)) {
        keyCode = getKeyCode(args.keyCode);
      }
      
      if (!keyCode) {
        console.error("invalid keycode for keydown action");
      }

      if(!charCode) charCode = keyCode;

      return () => {
        els.forEach(el => {
          el.dispatchEvent(
            new KeyboardEvent("keydown", {
              keyCode,
              charCode,
              which: keyCode
            })
          );
        });
      };
    }
  }
};
