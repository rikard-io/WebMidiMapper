import "./scss/actions.scss";

function createAnimateJsAction(els, fx) {
    return () => {
      els.forEach(el => {
        el.classList.add("animated", fx);
        el.addEventListener("animationend", function handleAnimationEnd() {
          el.classList.remove("animated", fx);
          el.removeEventListener("animationend", handleAnimationEnd);
        });
      });
    };
}

export default {
  filter: {
    name: "🐫 Filter",
    args: {
      type: [
        "blur",
        "brightness",
        "contrast",
        "grayscale",
        "hue-rotate",
        "invert",
        "opacity",
        "saturate",
        "sepia"
      ]
    },
    create: (els, args) => {
      const regString = `${args.type}\\(.*?\\)`;
      const regEx = new RegExp(regString, "gmi");
      return event => {
        els.forEach(el => {
          const unit =
            args.type === "hue-rotate"
              ? "deg"
              : args.type === "blur"
              ? "px"
              : "";
          const max = unit === "px" ? 40 : unit === "deg" ? 360 : 1;
          const val = (event.data[2] / 127) * max;
          el.style.filter = el.style.filter.replace(regEx, "");
          el.style.filter += ` ${args.type}(${val}${unit})`;
        });
      };
    },
    clear: (els, args) => {
      const regString = `${args.type}\\(.*?\\)`;
      const regEx = new RegExp(regString, "gmi");
      els.forEach(el => {
        el.style.filter = el.style.filter.replace(regEx, "");
      });
    }
  },
  scale: {
    name: "🔍 scale",
    create(els) {
      return event => {
        els.forEach(el => {
          const val = 1 + (event.data[2] / 127) * 20;
          el.style.transform = `scale(${val})`;
        });
      };
    },
    clear: els => {
      return () => {
        els.forEach(el => {
          el.style.transform = "";
        });
      };
    }
  },
  animateJS: {
    name: "Animate CSS",
    args: {
      type: [
        "bounce",
        "bounceIn",
        "bounceInDown",
        "bounceInLeft",
        "bounceInRight",
        "bounceInUp",
        "bounceOut",
        "bounceOutDown",
        "bounceOutLeft",
        "bounceOutRight",
        "bounceOutUp",
        "fadeIn",
        "fadeInDown",
        "fadeInDownBig",
        "fadeInLeft",
        "fadeInLeftBig",
        "fadeInRight",
        "fadeInRightBig",
        "fadeInUp",
        "fadeInUpBig",
        "fadeOut",
        "fadeOutDown",
        "fadeOutDownBig",
        "fadeOutLeft",
        "fadeOutLeftBig",
        "fadeOutRight",
        "fadeOutRightBig",
        "fadeOutUp",
        "fadeOutUpBig",
        "flash",
        "flipInX",
        "flipInY",
        "flipOutX",
        "flipOutY",
        "headShake",
        "heartBeat",
        "hinge",
        "jackInTheBox",
        "jello",
        "lightSpeedIn",
        "lightSpeedOut",
        "pulse",
        "rollIn",
        "rollOut",
        "rotateIn",
        "rotateInDownLeft",
        "rotateInDownRight",
        "rotateInUpLeft",
        "rotateInUpRight",
        "rotateOut",
        "rotateOutDownLeft",
        "rotateOutDownRight",
        "rotateOutUpLeft",
        "rotateOutUpRight",
        "rubberBand",
        "shake",
        "slideInDown",
        "slideInLeft",
        "slideInRight",
        "slideInUp",
        "slideOutDown",
        "slideOutLeft",
        "slideOutRight",
        "slideOutUp",
        "swing",
        "tada",
        "wobble",
        "zoomIn",
        "zoomInDown",
        "zoomInLeft",
        "zoomInRight",
        "zoomInUp",
        "zoomOut",
        "zoomOutDown",
        "zoomOutLeft",
        "zoomOutRight",
        "zoomOutUp"
      ]
    },
    create(els, args) {
      return createAnimateJsAction(els, args.type);
    }
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
  Keyboard: {
    name: "⌨️ Keyboard",
    args: {
      keyCode: Number,
      event: ['keydown','keyup']
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
        if (str.length === 1) {
          return getKeyCode(str);
        }
        switch (str) {
          case "left":
            return 37;
          case "right":
            return 39;
          case "up":
            return 38;
          case "down":
            return 40;
          case "enter":
            return 13;
          case "space":
            return 32;
          default:
            console.error("Unrecognized shorthand " + str);
        }
      }

      let keyCode;
      let charCode;
      if (args.keyCode[0] === '"') {
        keyCode = parseStringKey(args.keyCode);
        if (args.keyCode.length === 3) charCode = args.keyCode.charCodeAt(1);
      } else {
        keyCode = parseInt(args.keyCode);
      }

      if (isNaN(keyCode)) {
        keyCode = getKeyCode(args.keyCode);
      }

      if (!keyCode) {
        console.error("invalid keycode for keyboard action");
      }

      if (!charCode) charCode = keyCode;

      return () => {
        els.forEach(el => {
          el.dispatchEvent(
            new KeyboardEvent(args.event, {
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
