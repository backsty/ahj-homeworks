(()=>{"use strict";var t={p:"/events/"};const e={DEFAULT:"default",GRAB:`url(${t.p+"691227554a945d50dd92.svg"}) 15 15, grab`,GRABBING:`url(${t.p+"a3f5d1b657d5834844bd.svg"}) 15 15, grabbing`,NOT_ALLOWED:`url(${t.p+"6bbc82537f831e8e8ca4.svg"}) 15 15, not-allowed`},s=t.p+"10caaca0666e07096cd3.svg";class n{constructor(t){this.data=t,this.container=null,this.cardsContainerEl=null,this.addCards=null,this.forms=null,this.cancelBtns=null,this.inputs=null,this.cards=null}bindToDom(t){if(!(t instanceof HTMLElement))throw new Error('Контейнер не является элементом "HTMLElement"');if(this.container=t,!this.container)throw new Error("Контейнер не найден")}drawUi(){this.data.forEach((t=>{const e=document.querySelector(`[data-column="${t.id}"]`);if(e){e.querySelector("h2").textContent=t.title}})),this.addCards=this.container.querySelectorAll(".add-card"),this.cards=this.container.querySelectorAll(".cards-container"),this.addCards.forEach((t=>{const e=n.createAddCardForm();t.parentElement.appendChild(e),t.addEventListener("click",(()=>{t.classList.add("hidden"),e.classList.remove("hidden"),e.querySelector(".card-input").focus()}))}))}static createCard(t){const e=document.createElement("div");e.className="card",e.draggable=!0;const n=document.createElement("div");n.className="card-content",n.textContent=t;const r=document.createElement("img");return r.className="card-delete",r.src=s,r.alt="Delete",e.appendChild(n),e.appendChild(r),e}static createAddCardForm(){const t=document.createElement("form");t.className="add-card-form hidden",t.innerHTML='\n      <textarea class="card-input" placeholder="Введите название карточки..."></textarea>\n      <div class="form-controls">\n        <button type="submit" class="add-btn">Добавить карточку</button>\n        <button type="button" class="cancel-btn">×</button>\n      </div>\n    ';return t.querySelector(".card-input").addEventListener("input",(function(){this.style.height="auto",this.style.height=this.scrollHeight+"px"})),t}static deleteCard(t){t&&t.classList.contains("card")&&t.remove()}static checkBinding(){return null!==document.querySelector(".board")}}const r=[{id:"todo",title:"Todo"},{id:"in-progress",title:"In progress"},{id:"done",title:"Done"}],o=new class{constructor(t){this.storage=t}save(t){this.storage.setItem("state",JSON.stringify(t))}load(){try{const t=this.storage.getItem("state");return t?JSON.parse(t):{todo:[],"in-progress":[],done:[]}}catch(t){throw new Error("Ошибка при загрузке данных")}}}(localStorage),i=new n(r),a=new class{constructor(t,e){this.ui=t,this.stateService=e,this.dragEl=null,this.ghostEl=null,this.shiftX=null,this.shiftY=null,this.elInitialX=null,this.elInitialY=null}init(){this.ui.bindToDom(document.querySelector(".board")),this.ui.drawUi(),this.loadState(),this.addEventListeners()}loadState(){const t=this.stateService.load();Object.entries(t).forEach((([t,e])=>{const s=document.querySelector(`[data-column="${t}"] .cards-container`);s&&(s.innerHTML="",e.forEach((t=>{s.appendChild(this.ui.constructor.createCard(t))})))}))}saveState(){const t={};this.ui.data.forEach((e=>{const s=document.querySelector(`[data-column="${e.id}"] .cards-container`);s&&(t[e.id]=Array.from(s.children).map((t=>t.querySelector(".card-content").textContent)))})),this.stateService.save(t)}addEventListeners(){document.addEventListener("mousedown",this.onMouseDown.bind(this)),document.addEventListener("mousemove",this.onMouseMove.bind(this)),document.addEventListener("mouseup",this.onMouseUp.bind(this)),this.ui.container.addEventListener("click",(t=>{if(t.target.classList.contains("card-delete")){const e=t.target.closest(".card");e&&(this.ui.constructor.deleteCard(e),this.saveState())}if(t.target.classList.contains("add-card")){const e=t.target.closest(".column").querySelector(".add-card-form");t.target.classList.add("hidden"),e.classList.remove("hidden"),e.querySelector(".card-input").focus()}if(t.target.classList.contains("cancel-btn")){const e=t.target.closest(".add-card-form");e.reset(),e.classList.add("hidden");e.closest(".column").querySelector(".add-card").classList.remove("hidden")}})),this.ui.container.addEventListener("submit",(t=>{if(t.target.classList.contains("add-card-form")){t.preventDefault();const e=t.target,s=e.querySelector(".card-input").value.trim();if(s){e.closest(".column").querySelector(".cards-container").appendChild(this.ui.constructor.createCard(s)),this.saveState()}e.reset(),e.classList.add("hidden");e.closest(".column").querySelector(".add-card").classList.remove("hidden")}}))}onMouseDown(t){const s=t.target.closest(".card");if(!s||t.target.closest(".card-delete"))return;t.preventDefault(),this.dragEl=s;const n=s.getBoundingClientRect();this.shiftX=t.clientX-n.left,this.shiftY=t.clientY-n.top,this.dragEl.style.opacity="0.5",document.body.style.cursor=e.GRABBING}onMouseMove(t){if(!this.dragEl)return;t.preventDefault(),this.ghostEl||this.createGhost(this.dragEl);const e=t.clientX-this.shiftX,s=t.clientY-this.shiftY;this.ghostEl.style.left=`${e}px`,this.ghostEl.style.top=`${s}px`;const n=t.target.closest(".cards-container");if(n){const e=this.getClosestCard(n,t.clientY);this.updateDropPosition(n,e)}}onMouseUp(){if(!this.dragEl)return;document.body.style.cursor=e.DEFAULT;const t=document.querySelector(".ghost-placeholder");t&&t.replaceWith(this.dragEl),this.dragEl.style.opacity="",this.removeGhost(),this.saveState(),this.dragEl=null}createGhost(t){this.ghostEl=t.cloneNode(!0),this.ghostEl.classList.add("dragged"),this.ghostEl.style.position="fixed",this.ghostEl.style.width=`${t.offsetWidth}px`,this.ghostEl.style.height=`${t.offsetHeight}px`,this.ghostEl.style.zIndex="1000",this.ghostEl.style.pointerEvents="none",document.body.appendChild(this.ghostEl)}removeGhost(){this.ghostEl&&(this.ghostEl.remove(),this.ghostEl=null)}updateDropPosition(t,e){const s=document.querySelector(".ghost-placeholder")||document.createElement("div");s.className="ghost-placeholder",s.style.height=`${this.dragEl.offsetHeight}px`,e?e!==s&&e.parentNode.insertBefore(s,e):t.appendChild(s)}getClosestCard(t,e){return[...t.querySelectorAll(".card:not(.dragged)")].reduce(((t,s)=>{const n=s.getBoundingClientRect(),r=e-n.top-n.height/2;return r<0&&r>t.offset?{offset:r,element:s}:t}),{offset:Number.NEGATIVE_INFINITY}).element}}(i,o);a.init()})();
//# sourceMappingURL=main.e429871652b269dcfb8a.js.map