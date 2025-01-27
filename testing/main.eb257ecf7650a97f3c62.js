(()=>{"use strict";var t={p:"/ahj-homeworks/testing/"};const e=t.p+"d5ccdc3a6e87c94bed2e.png",n=t.p+"09eb0cf7ff70325bbd75.png",i=t.p+"c9055ad93356138b03ef.png",a={VISA:{pattern:/^4/,lengths:[13,16],name:"visa"},MASTERCARD:{pattern:/^5[1-5]/,lengths:[16],name:"mastercard"},MIR:{pattern:/^220[0-4]/,lengths:[16],name:"mir"}},s="card-validator",r="card-images",l="card-image",c="card-input",d="validate-btn",o="active",h="invalid",u="valid",p={visa:e,mastercard:n,mir:i},g="Номер карты валиден",v="Неверный номер карты",m=19,f=4;class y{detectCardType(t){const e=t.replace(/\D/g,"");for(const[t,n]of Object.entries(a))if(n.pattern.test(e)&&n.lengths.includes(e.length))return n.name;return null}}class ${validateCard(t){return!(!t||t.length<13)&&this.luhnAlgorithm(t)}luhnAlgorithm(t){const e=t.replace(/\D/g,"");let n=0,i=!1;for(let t=e.length-1;t>=0;t--){let a=parseInt(e[t],10);i&&(a*=2,a>9&&(a-=9)),n+=a,i=!i}return n%10==0}}class b{constructor(t){if(!t)throw new Error("Container element is required");this.container=t,this.input=null,this.cardimage={},this.validator=new $,this.typeDetector=new y,this.init()}init(){this.renderWidget(),this.setupListeners()}renderWidget(){this.container.innerHTML=`\n      <div class="${s}">\n        <div class="${r}">\n          ${Object.entries(p).map((([t,e])=>`\n            <img src="${e}" \n                 data-type="${t}" \n                 class="${l}"\n                 alt="${t}"\n            >\n          `)).join("")}\n        </div>\n        <input type="text" \n               class="${c}"\n               maxlength="${m}"\n               placeholder="Enter card number">\n        <button class="${d}">Validate</button>\n      </div>\n    `,this.input=this.container.querySelector(`.${c}`),this.cardImages=Array.from(this.container.querySelectorAll(`.${l}`))}setupListeners(){this.input.addEventListener("input",(t=>this.handleInput(t))),this.container.querySelector(`.${d}`).addEventListener("click",(()=>this.validateCard()))}handleInput(t){let e=t.target.value.replace(/\D/g,"");const n=[];for(let t=0;t<e.length;t+=f)n.push(e.slice(t,t+f));this.input.value=n.join(" ");const i=this.typeDetector.detectCardType(e);this.highlightCardType(i)}highlightCardType(t){this.cardImages.forEach((e=>{const n=e.dataset.type===t;e.classList.toggle(o,n)}))}validateCard(){const t=this.input.value.replace(/\D/g,"");if(!t)return void this.showValidationResult(!1);if(t.length<13)return void this.showValidationResult(!1);const e=this.validator.validateCard(t);this.showValidationResult(e)}showValidationResult(t){const e=t?g:v;this.input.classList.toggle(u,t),this.input.classList.toggle(h,!t),alert(e)}}document.addEventListener("DOMContentLoaded",(()=>{const t=document.getElementById("root");new b(t)}))})();
//# sourceMappingURL=main.eb257ecf7650a97f3c62.js.map