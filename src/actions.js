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
        var keyCode = char.charCodeAt(0);
        if (keyCode > 90) {
          // 90 is keyCode for 'z'
          return keyCode - 32;
        }
        return keyCode;
      }
      function parseStringKey(str) {
        str = str.replace(/"/, "");
        if(str.length === 1){
          return getKeyCode(str):
        }
        switch(str){
          case 'left': return 37;
          case 'right': return 39;
          case 'up': return 38;
          case 'down': return 40;
          case 'enter': return 13;
          case 'space': return 32;
         }
      }
      let charCode = args.keyCode.charCodeAt(0) || 0;
      if (isNaN(keyCode)) {
        keyCode = getKeyCode(args.keyCode);
      }
      if (args.keyCode[0] === '"') {
        keyCode = parseStringKey(args.keyCode);
      }

      if (!keyCode) {
        console.error("invalid keycode for keydown action");
      }
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
