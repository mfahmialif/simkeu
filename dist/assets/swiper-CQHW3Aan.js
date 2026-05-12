import{r as wt,c as R,o as H,d as pe,F as K,i as J,v as It,m as $,b as G,e as X,t as $e,aO as Ae,aj as je,a1 as Yt,f as pi}from"./index-DzKS1On1.js";import{V as re}from"./VImg-D26PGqLu.js";import{_ as Xe}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{V as Ft}from"./VCardText-D5A2yNHo.js";import{V as Wt}from"./VCard-CGT-Z1Vm.js";import{_ as di}from"./AppCardCode-Cdw7zgTp.js";import{V as ci,a as ie}from"./VRow-BU0pEF7-.js";import"./VAvatar-Dt4olrDV.js";import"./vue3-perfect-scrollbar-Dz1N6cWY.js";import"./VDivider-B5z_Wivj.js";/* empty css              */function At(s){return s!==null&&typeof s=="object"&&"constructor"in s&&s.constructor===Object}function zt(s,e){s===void 0&&(s={}),e===void 0&&(e={});const i=["__proto__","constructor","prototype"];Object.keys(e).filter(t=>i.indexOf(t)<0).forEach(t=>{typeof s[t]>"u"?s[t]=e[t]:At(e[t])&&At(s[t])&&Object.keys(e[t]).length>0&&zt(s[t],e[t])})}const qt={body:{},addEventListener(){},removeEventListener(){},activeElement:{blur(){},nodeName:""},querySelector(){return null},querySelectorAll(){return[]},getElementById(){return null},createEvent(){return{initEvent(){}}},createElement(){return{children:[],childNodes:[],style:{},setAttribute(){},getElementsByTagName(){return[]}}},createElementNS(){return{}},importNode(){return null},location:{hash:"",host:"",hostname:"",href:"",origin:"",pathname:"",protocol:"",search:""}};function Z(){const s=typeof document<"u"?document:{};return zt(s,qt),s}const fi={document:qt,navigator:{userAgent:""},location:{hash:"",host:"",hostname:"",href:"",origin:"",pathname:"",protocol:"",search:""},history:{replaceState(){},pushState(){},go(){},back(){}},CustomEvent:function(){return this},addEventListener(){},removeEventListener(){},getComputedStyle(){return{getPropertyValue(){return""}}},Image(){},Date(){},screen:{},setTimeout(){},clearTimeout(){},matchMedia(){return{}},requestAnimationFrame(s){return typeof setTimeout>"u"?(s(),null):setTimeout(s,0)},cancelAnimationFrame(s){typeof setTimeout>"u"||clearTimeout(s)}};function W(){const s=typeof window<"u"?window:{};return zt(s,fi),s}function ve(s){return s===void 0&&(s=""),s.trim().split(" ").filter(e=>!!e.trim())}function ui(s){const e=s;Object.keys(e).forEach(i=>{try{e[i]=null}catch{}try{delete e[i]}catch{}})}function Se(s,e){return e===void 0&&(e=0),setTimeout(s,e)}function le(){return Date.now()}function mi(s){const e=W();let i;return e.getComputedStyle&&(i=e.getComputedStyle(s,null)),!i&&s.currentStyle&&(i=s.currentStyle),i||(i=s.style),i}function Et(s,e){e===void 0&&(e="x");const i=W();let t,r,n;const f=mi(s);return i.WebKitCSSMatrix?(r=f.transform||f.webkitTransform,r.split(",").length>6&&(r=r.split(", ").map(c=>c.replace(",",".")).join(", ")),n=new i.WebKitCSSMatrix(r==="none"?"":r)):(n=f.MozTransform||f.OTransform||f.MsTransform||f.msTransform||f.transform||f.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,"),t=n.toString().split(",")),e==="x"&&(i.WebKitCSSMatrix?r=n.m41:t.length===16?r=parseFloat(t[12]):r=parseFloat(t[4])),e==="y"&&(i.WebKitCSSMatrix?r=n.m42:t.length===16?r=parseFloat(t[13]):r=parseFloat(t[5])),r||0}function De(s){return typeof s=="object"&&s!==null&&s.constructor&&Object.prototype.toString.call(s).slice(8,-1)==="Object"}function wi(s){return typeof window<"u"&&typeof window.HTMLElement<"u"?s instanceof HTMLElement:s&&(s.nodeType===1||s.nodeType===11)}function ae(){const s=Object(arguments.length<=0?void 0:arguments[0]),e=["__proto__","constructor","prototype"];for(let i=1;i<arguments.length;i+=1){const t=i<0||arguments.length<=i?void 0:arguments[i];if(t!=null&&!wi(t)){const r=Object.keys(Object(t)).filter(n=>e.indexOf(n)<0);for(let n=0,f=r.length;n<f;n+=1){const c=r[n],d=Object.getOwnPropertyDescriptor(t,c);d!==void 0&&d.enumerable&&(De(s[c])&&De(t[c])?t[c].__swiper__?s[c]=t[c]:ae(s[c],t[c]):!De(s[c])&&De(t[c])?(s[c]={},t[c].__swiper__?s[c]=t[c]:ae(s[c],t[c])):s[c]=t[c])}}}return s}function Oe(s,e,i){s.style.setProperty(e,i)}function Ut(s){let{swiper:e,targetPosition:i,side:t}=s;const r=W(),n=-e.translate;let f=null,c;const d=e.params.speed;e.wrapperEl.style.scrollSnapType="none",r.cancelAnimationFrame(e.cssModeFrameID);const o=i>n?"next":"prev",p=(v,w)=>o==="next"&&v>=w||o==="prev"&&v<=w,u=()=>{c=new Date().getTime(),f===null&&(f=c);const v=Math.max(Math.min((c-f)/d,1),0),w=.5-Math.cos(v*Math.PI)/2;let a=n+w*(i-n);if(p(a,i)&&(a=i),e.wrapperEl.scrollTo({[t]:a}),p(a,i)){e.wrapperEl.style.overflow="hidden",e.wrapperEl.style.scrollSnapType="",setTimeout(()=>{e.wrapperEl.style.overflow="",e.wrapperEl.scrollTo({[t]:a})}),r.cancelAnimationFrame(e.cssModeFrameID);return}e.cssModeFrameID=r.requestAnimationFrame(u)};u()}function xe(s){return s.querySelector(".swiper-slide-transform")||s.shadowRoot&&s.shadowRoot.querySelector(".swiper-slide-transform")||s}function Q(s,e){e===void 0&&(e="");const i=W(),t=[...s.children];return i.HTMLSlotElement&&s instanceof HTMLSlotElement&&t.push(...s.assignedElements()),e?t.filter(r=>r.matches(e)):t}function gi(s,e){const i=[e];for(;i.length>0;){const t=i.shift();if(s===t)return!0;i.push(...t.children,...t.shadowRoot?t.shadowRoot.children:[],...t.assignedElements?t.assignedElements():[])}}function hi(s,e){const i=W();let t=e.contains(s);return!t&&i.HTMLSlotElement&&e instanceof HTMLSlotElement&&(t=[...e.assignedElements()].includes(s),t||(t=gi(s,e))),t}function Qe(s){try{console.warn(s);return}catch{}}function oe(s,e){e===void 0&&(e=[]);const i=document.createElement(s);return i.classList.add(...Array.isArray(e)?e:ve(e)),i}function Je(s){const e=W(),i=Z(),t=s.getBoundingClientRect(),r=i.body,n=s.clientTop||r.clientTop||0,f=s.clientLeft||r.clientLeft||0,c=s===e?e.scrollY:s.scrollTop,d=s===e?e.scrollX:s.scrollLeft;return{top:t.top+c-n,left:t.left+d-f}}function vi(s,e){const i=[];for(;s.previousElementSibling;){const t=s.previousElementSibling;e?t.matches(e)&&i.push(t):i.push(t),s=t}return i}function bi(s,e){const i=[];for(;s.nextElementSibling;){const t=s.nextElementSibling;e?t.matches(e)&&i.push(t):i.push(t),s=t}return i}function be(s,e){return W().getComputedStyle(s,null).getPropertyValue(e)}function Re(s){let e=s,i;if(e){for(i=0;(e=e.previousSibling)!==null;)e.nodeType===1&&(i+=1);return i}}function ye(s,e){const i=[];let t=s.parentElement;for(;t;)e?t.matches(e)&&i.push(t):i.push(t),t=t.parentElement;return i}function He(s,e){function i(t){t.target===s&&(e.call(s,t),s.removeEventListener("transitionend",i))}e&&s.addEventListener("transitionend",i)}function Tt(s,e,i){const t=W();return s[e==="width"?"offsetWidth":"offsetHeight"]+parseFloat(t.getComputedStyle(s,null).getPropertyValue(e==="width"?"margin-right":"margin-top"))+parseFloat(t.getComputedStyle(s,null).getPropertyValue(e==="width"?"margin-left":"margin-bottom"))}function Y(s){return(Array.isArray(s)?s:[s]).filter(e=>!!e)}function tt(s){return e=>Math.abs(e)>0&&s.browser&&s.browser.need3dFix&&Math.abs(e)%90===0?e+.001:e}function de(s,e){e===void 0&&(e=""),typeof trustedTypes<"u"?s.innerHTML=trustedTypes.createPolicy("html",{createHTML:i=>i}).createHTML(e):s.innerHTML=e}let gt;function yi(){const s=W(),e=Z();return{smoothScroll:e.documentElement&&e.documentElement.style&&"scrollBehavior"in e.documentElement.style,touch:!!("ontouchstart"in s||s.DocumentTouch&&e instanceof s.DocumentTouch)}}function Kt(){return gt||(gt=yi()),gt}let ht;function Si(s){let{userAgent:e}=s===void 0?{}:s;const i=Kt(),t=W(),r=t.navigator.platform,n=e||t.navigator.userAgent,f={ios:!1,android:!1},c=t.screen.width,d=t.screen.height,o=n.match(/(Android);?[\s\/]+([\d.]+)?/);let p=n.match(/(iPad).*OS\s([\d_]+)/);const u=n.match(/(iPod)(.*OS\s([\d_]+))?/),v=!p&&n.match(/(iPhone\sOS|iOS)\s([\d_]+)/),w=r==="Win32";let a=r==="MacIntel";const l=["1024x1366","1366x1024","834x1194","1194x834","834x1112","1112x834","768x1024","1024x768","820x1180","1180x820","810x1080","1080x810"];return!p&&a&&i.touch&&l.indexOf(`${c}x${d}`)>=0&&(p=n.match(/(Version)\/([\d.]+)/),p||(p=[0,1,"13_0_0"]),a=!1),o&&!w&&(f.os="android",f.android=!0),(p||v||u)&&(f.os="ios",f.ios=!0),f}function Zt(s){return s===void 0&&(s={}),ht||(ht=Si(s)),ht}let vt;function xi(){const s=W(),e=Zt();let i=!1;function t(){const c=s.navigator.userAgent.toLowerCase();return c.indexOf("safari")>=0&&c.indexOf("chrome")<0&&c.indexOf("android")<0}if(t()){const c=String(s.navigator.userAgent);if(c.includes("Version/")){const[d,o]=c.split("Version/")[1].split(" ")[0].split(".").map(p=>Number(p));i=d<16||d===16&&o<2}}const r=/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(s.navigator.userAgent),n=t(),f=n||r&&e.ios;return{isSafari:i||n,needPerspectiveFix:i,need3dFix:f,isWebView:r}}function Qt(){return vt||(vt=xi()),vt}function Ei(s){let{swiper:e,on:i,emit:t}=s;const r=W();let n=null,f=null;const c=()=>{!e||e.destroyed||!e.initialized||(t("beforeResize"),t("resize"))},d=()=>{!e||e.destroyed||!e.initialized||(n=new ResizeObserver(u=>{f=r.requestAnimationFrame(()=>{const{width:v,height:w}=e;let a=v,l=w;u.forEach(h=>{let{contentBoxSize:b,contentRect:g,target:m}=h;m&&m!==e.el||(a=g?g.width:(b[0]||b).inlineSize,l=g?g.height:(b[0]||b).blockSize)}),(a!==v||l!==w)&&c()})}),n.observe(e.el))},o=()=>{f&&r.cancelAnimationFrame(f),n&&n.unobserve&&e.el&&(n.unobserve(e.el),n=null)},p=()=>{!e||e.destroyed||!e.initialized||t("orientationchange")};i("init",()=>{if(e.params.resizeObserver&&typeof r.ResizeObserver<"u"){d();return}r.addEventListener("resize",c),r.addEventListener("orientationchange",p)}),i("destroy",()=>{o(),r.removeEventListener("resize",c),r.removeEventListener("orientationchange",p)})}function Ti(s){let{swiper:e,extendParams:i,on:t,emit:r}=s;const n=[],f=W(),c=function(p,u){u===void 0&&(u={});const v=f.MutationObserver||f.WebkitMutationObserver,w=new v(a=>{if(e.__preventObserver__)return;if(a.length===1){r("observerUpdate",a[0]);return}const l=function(){r("observerUpdate",a[0])};f.requestAnimationFrame?f.requestAnimationFrame(l):f.setTimeout(l,0)});w.observe(p,{attributes:typeof u.attributes>"u"?!0:u.attributes,childList:e.isElement||(typeof u.childList>"u"?!0:u).childList,characterData:typeof u.characterData>"u"?!0:u.characterData}),n.push(w)},d=()=>{if(e.params.observer){if(e.params.observeParents){const p=ye(e.hostEl);for(let u=0;u<p.length;u+=1)c(p[u])}c(e.hostEl,{childList:e.params.observeSlideChildren}),c(e.wrapperEl,{attributes:!1})}},o=()=>{n.forEach(p=>{p.disconnect()}),n.splice(0,n.length)};i({observer:!1,observeParents:!1,observeSlideChildren:!1}),t("init",d),t("destroy",o)}var Mi={on(s,e,i){const t=this;if(!t.eventsListeners||t.destroyed||typeof e!="function")return t;const r=i?"unshift":"push";return s.split(" ").forEach(n=>{t.eventsListeners[n]||(t.eventsListeners[n]=[]),t.eventsListeners[n][r](e)}),t},once(s,e,i){const t=this;if(!t.eventsListeners||t.destroyed||typeof e!="function")return t;function r(){t.off(s,r),r.__emitterProxy&&delete r.__emitterProxy;for(var n=arguments.length,f=new Array(n),c=0;c<n;c++)f[c]=arguments[c];e.apply(t,f)}return r.__emitterProxy=e,t.on(s,r,i)},onAny(s,e){const i=this;if(!i.eventsListeners||i.destroyed||typeof s!="function")return i;const t=e?"unshift":"push";return i.eventsAnyListeners.indexOf(s)<0&&i.eventsAnyListeners[t](s),i},offAny(s){const e=this;if(!e.eventsListeners||e.destroyed||!e.eventsAnyListeners)return e;const i=e.eventsAnyListeners.indexOf(s);return i>=0&&e.eventsAnyListeners.splice(i,1),e},off(s,e){const i=this;return!i.eventsListeners||i.destroyed||!i.eventsListeners||s.split(" ").forEach(t=>{typeof e>"u"?i.eventsListeners[t]=[]:i.eventsListeners[t]&&i.eventsListeners[t].forEach((r,n)=>{(r===e||r.__emitterProxy&&r.__emitterProxy===e)&&i.eventsListeners[t].splice(n,1)})}),i},emit(){const s=this;if(!s.eventsListeners||s.destroyed||!s.eventsListeners)return s;let e,i,t;for(var r=arguments.length,n=new Array(r),f=0;f<r;f++)n[f]=arguments[f];return typeof n[0]=="string"||Array.isArray(n[0])?(e=n[0],i=n.slice(1,n.length),t=s):(e=n[0].events,i=n[0].data,t=n[0].context||s),i.unshift(t),(Array.isArray(e)?e:e.split(" ")).forEach(d=>{s.eventsAnyListeners&&s.eventsAnyListeners.length&&s.eventsAnyListeners.forEach(o=>{o.apply(t,[d,...i])}),s.eventsListeners&&s.eventsListeners[d]&&s.eventsListeners[d].forEach(o=>{o.apply(t,i)})}),s}};function Ci(){const s=this;let e,i;const t=s.el;typeof s.params.width<"u"&&s.params.width!==null?e=s.params.width:e=t.clientWidth,typeof s.params.height<"u"&&s.params.height!==null?i=s.params.height:i=t.clientHeight,!(e===0&&s.isHorizontal()||i===0&&s.isVertical())&&(e=e-parseInt(be(t,"padding-left")||0,10)-parseInt(be(t,"padding-right")||0,10),i=i-parseInt(be(t,"padding-top")||0,10)-parseInt(be(t,"padding-bottom")||0,10),Number.isNaN(e)&&(e=0),Number.isNaN(i)&&(i=0),Object.assign(s,{width:e,height:i,size:s.isHorizontal()?e:i}))}function Pi(){const s=this;function e(T,z){return parseFloat(T.getPropertyValue(s.getDirectionLabel(z))||0)}const i=s.params,{wrapperEl:t,slidesEl:r,size:n,rtlTranslate:f,wrongRTL:c}=s,d=s.virtual&&i.virtual.enabled,o=d?s.virtual.slides.length:s.slides.length,p=Q(r,`.${s.params.slideClass}, swiper-slide`),u=d?s.virtual.slides.length:p.length;let v=[];const w=[],a=[];let l=i.slidesOffsetBefore;typeof l=="function"&&(l=i.slidesOffsetBefore.call(s));let h=i.slidesOffsetAfter;typeof h=="function"&&(h=i.slidesOffsetAfter.call(s));const b=s.snapGrid.length,g=s.slidesGrid.length;let m=i.spaceBetween,y=-l,E=0,k=0;if(typeof n>"u")return;typeof m=="string"&&m.indexOf("%")>=0?m=parseFloat(m.replace("%",""))/100*n:typeof m=="string"&&(m=parseFloat(m)),s.virtualSize=-m,p.forEach(T=>{f?T.style.marginLeft="":T.style.marginRight="",T.style.marginBottom="",T.style.marginTop=""}),i.centeredSlides&&i.cssMode&&(Oe(t,"--swiper-centered-offset-before",""),Oe(t,"--swiper-centered-offset-after",""));const _=i.grid&&i.grid.rows>1&&s.grid;_?s.grid.initSlides(p):s.grid&&s.grid.unsetSlides();let I;const S=i.slidesPerView==="auto"&&i.breakpoints&&Object.keys(i.breakpoints).filter(T=>typeof i.breakpoints[T].slidesPerView<"u").length>0;for(let T=0;T<u;T+=1){I=0;let z;if(p[T]&&(z=p[T]),_&&s.grid.updateSlide(T,z,p),!(p[T]&&be(z,"display")==="none")){if(i.slidesPerView==="auto"){S&&(p[T].style[s.getDirectionLabel("width")]="");const P=getComputedStyle(z),C=z.style.transform,L=z.style.webkitTransform;if(C&&(z.style.transform="none"),L&&(z.style.webkitTransform="none"),i.roundLengths)I=s.isHorizontal()?Tt(z,"width"):Tt(z,"height");else{const j=e(P,"width"),O=e(P,"padding-left"),x=e(P,"padding-right"),M=e(P,"margin-left"),B=e(P,"margin-right"),N=P.getPropertyValue("box-sizing");if(N&&N==="border-box")I=j+M+B;else{const{clientWidth:q,offsetWidth:U}=z;I=j+O+x+M+B+(U-q)}}C&&(z.style.transform=C),L&&(z.style.webkitTransform=L),i.roundLengths&&(I=Math.floor(I))}else I=(n-(i.slidesPerView-1)*m)/i.slidesPerView,i.roundLengths&&(I=Math.floor(I)),p[T]&&(p[T].style[s.getDirectionLabel("width")]=`${I}px`);p[T]&&(p[T].swiperSlideSize=I),a.push(I),i.centeredSlides?(y=y+I/2+E/2+m,E===0&&T!==0&&(y=y-n/2-m),T===0&&(y=y-n/2-m),Math.abs(y)<1/1e3&&(y=0),i.roundLengths&&(y=Math.floor(y)),k%i.slidesPerGroup===0&&v.push(y),w.push(y)):(i.roundLengths&&(y=Math.floor(y)),(k-Math.min(s.params.slidesPerGroupSkip,k))%s.params.slidesPerGroup===0&&v.push(y),w.push(y),y=y+I+m),s.virtualSize+=I+m,E=I,k+=1}}if(s.virtualSize=Math.max(s.virtualSize,n)+h,f&&c&&(i.effect==="slide"||i.effect==="coverflow")&&(t.style.width=`${s.virtualSize+m}px`),i.setWrapperSize&&(t.style[s.getDirectionLabel("width")]=`${s.virtualSize+m}px`),_&&s.grid.updateWrapperSize(I,v),!i.centeredSlides){const T=[];for(let z=0;z<v.length;z+=1){let P=v[z];i.roundLengths&&(P=Math.floor(P)),v[z]<=s.virtualSize-n&&T.push(P)}v=T,Math.floor(s.virtualSize-n)-Math.floor(v[v.length-1])>1&&v.push(s.virtualSize-n)}if(d&&i.loop){const T=a[0]+m;if(i.slidesPerGroup>1){const z=Math.ceil((s.virtual.slidesBefore+s.virtual.slidesAfter)/i.slidesPerGroup),P=T*i.slidesPerGroup;for(let C=0;C<z;C+=1)v.push(v[v.length-1]+P)}for(let z=0;z<s.virtual.slidesBefore+s.virtual.slidesAfter;z+=1)i.slidesPerGroup===1&&v.push(v[v.length-1]+T),w.push(w[w.length-1]+T),s.virtualSize+=T}if(v.length===0&&(v=[0]),m!==0){const T=s.isHorizontal()&&f?"marginLeft":s.getDirectionLabel("marginRight");p.filter((z,P)=>!i.cssMode||i.loop?!0:P!==p.length-1).forEach(z=>{z.style[T]=`${m}px`})}if(i.centeredSlides&&i.centeredSlidesBounds){let T=0;a.forEach(P=>{T+=P+(m||0)}),T-=m;const z=T>n?T-n:0;v=v.map(P=>P<=0?-l:P>z?z+h:P)}if(i.centerInsufficientSlides){let T=0;a.forEach(P=>{T+=P+(m||0)}),T-=m;const z=(i.slidesOffsetBefore||0)+(i.slidesOffsetAfter||0);if(T+z<n){const P=(n-T-z)/2;v.forEach((C,L)=>{v[L]=C-P}),w.forEach((C,L)=>{w[L]=C+P})}}if(Object.assign(s,{slides:p,snapGrid:v,slidesGrid:w,slidesSizesGrid:a}),i.centeredSlides&&i.cssMode&&!i.centeredSlidesBounds){Oe(t,"--swiper-centered-offset-before",`${-v[0]}px`),Oe(t,"--swiper-centered-offset-after",`${s.size/2-a[a.length-1]/2}px`);const T=-s.snapGrid[0],z=-s.slidesGrid[0];s.snapGrid=s.snapGrid.map(P=>P+T),s.slidesGrid=s.slidesGrid.map(P=>P+z)}if(u!==o&&s.emit("slidesLengthChange"),v.length!==b&&(s.params.watchOverflow&&s.checkOverflow(),s.emit("snapGridLengthChange")),w.length!==g&&s.emit("slidesGridLengthChange"),i.watchSlidesProgress&&s.updateSlidesOffset(),s.emit("slidesUpdated"),!d&&!i.cssMode&&(i.effect==="slide"||i.effect==="fade")){const T=`${i.containerModifierClass}backface-hidden`,z=s.el.classList.contains(T);u<=i.maxBackfaceHiddenSlides?z||s.el.classList.add(T):z&&s.el.classList.remove(T)}}function _i(s){const e=this,i=[],t=e.virtual&&e.params.virtual.enabled;let r=0,n;typeof s=="number"?e.setTransition(s):s===!0&&e.setTransition(e.params.speed);const f=c=>t?e.slides[e.getSlideIndexByData(c)]:e.slides[c];if(e.params.slidesPerView!=="auto"&&e.params.slidesPerView>1)if(e.params.centeredSlides)(e.visibleSlides||[]).forEach(c=>{i.push(c)});else for(n=0;n<Math.ceil(e.params.slidesPerView);n+=1){const c=e.activeIndex+n;if(c>e.slides.length&&!t)break;i.push(f(c))}else i.push(f(e.activeIndex));for(n=0;n<i.length;n+=1)if(typeof i[n]<"u"){const c=i[n].offsetHeight;r=c>r?c:r}(r||r===0)&&(e.wrapperEl.style.height=`${r}px`)}function Ii(){const s=this,e=s.slides,i=s.isElement?s.isHorizontal()?s.wrapperEl.offsetLeft:s.wrapperEl.offsetTop:0;for(let t=0;t<e.length;t+=1)e[t].swiperSlideOffset=(s.isHorizontal()?e[t].offsetLeft:e[t].offsetTop)-i-s.cssOverflowAdjustment()}const jt=(s,e,i)=>{e&&!s.classList.contains(i)?s.classList.add(i):!e&&s.classList.contains(i)&&s.classList.remove(i)};function zi(s){s===void 0&&(s=this&&this.translate||0);const e=this,i=e.params,{slides:t,rtlTranslate:r,snapGrid:n}=e;if(t.length===0)return;typeof t[0].swiperSlideOffset>"u"&&e.updateSlidesOffset();let f=-s;r&&(f=s),e.visibleSlidesIndexes=[],e.visibleSlides=[];let c=i.spaceBetween;typeof c=="string"&&c.indexOf("%")>=0?c=parseFloat(c.replace("%",""))/100*e.size:typeof c=="string"&&(c=parseFloat(c));for(let d=0;d<t.length;d+=1){const o=t[d];let p=o.swiperSlideOffset;i.cssMode&&i.centeredSlides&&(p-=t[0].swiperSlideOffset);const u=(f+(i.centeredSlides?e.minTranslate():0)-p)/(o.swiperSlideSize+c),v=(f-n[0]+(i.centeredSlides?e.minTranslate():0)-p)/(o.swiperSlideSize+c),w=-(f-p),a=w+e.slidesSizesGrid[d],l=w>=0&&w<=e.size-e.slidesSizesGrid[d],h=w>=0&&w<e.size-1||a>1&&a<=e.size||w<=0&&a>=e.size;h&&(e.visibleSlides.push(o),e.visibleSlidesIndexes.push(d)),jt(o,h,i.slideVisibleClass),jt(o,l,i.slideFullyVisibleClass),o.progress=r?-u:u,o.originalProgress=r?-v:v}}function Li(s){const e=this;if(typeof s>"u"){const p=e.rtlTranslate?-1:1;s=e&&e.translate&&e.translate*p||0}const i=e.params,t=e.maxTranslate()-e.minTranslate();let{progress:r,isBeginning:n,isEnd:f,progressLoop:c}=e;const d=n,o=f;if(t===0)r=0,n=!0,f=!0;else{r=(s-e.minTranslate())/t;const p=Math.abs(s-e.minTranslate())<1,u=Math.abs(s-e.maxTranslate())<1;n=p||r<=0,f=u||r>=1,p&&(r=0),u&&(r=1)}if(i.loop){const p=e.getSlideIndexByData(0),u=e.getSlideIndexByData(e.slides.length-1),v=e.slidesGrid[p],w=e.slidesGrid[u],a=e.slidesGrid[e.slidesGrid.length-1],l=Math.abs(s);l>=v?c=(l-v)/a:c=(l+a-w)/a,c>1&&(c-=1)}Object.assign(e,{progress:r,progressLoop:c,isBeginning:n,isEnd:f}),(i.watchSlidesProgress||i.centeredSlides&&i.autoHeight)&&e.updateSlidesProgress(s),n&&!d&&e.emit("reachBeginning toEdge"),f&&!o&&e.emit("reachEnd toEdge"),(d&&!n||o&&!f)&&e.emit("fromEdge"),e.emit("progress",r)}const bt=(s,e,i)=>{e&&!s.classList.contains(i)?s.classList.add(i):!e&&s.classList.contains(i)&&s.classList.remove(i)};function ki(){const s=this,{slides:e,params:i,slidesEl:t,activeIndex:r}=s,n=s.virtual&&i.virtual.enabled,f=s.grid&&i.grid&&i.grid.rows>1,c=u=>Q(t,`.${i.slideClass}${u}, swiper-slide${u}`)[0];let d,o,p;if(n)if(i.loop){let u=r-s.virtual.slidesBefore;u<0&&(u=s.virtual.slides.length+u),u>=s.virtual.slides.length&&(u-=s.virtual.slides.length),d=c(`[data-swiper-slide-index="${u}"]`)}else d=c(`[data-swiper-slide-index="${r}"]`);else f?(d=e.find(u=>u.column===r),p=e.find(u=>u.column===r+1),o=e.find(u=>u.column===r-1)):d=e[r];d&&(f||(p=bi(d,`.${i.slideClass}, swiper-slide`)[0],i.loop&&!p&&(p=e[0]),o=vi(d,`.${i.slideClass}, swiper-slide`)[0],i.loop&&!o===0&&(o=e[e.length-1]))),e.forEach(u=>{bt(u,u===d,i.slideActiveClass),bt(u,u===p,i.slideNextClass),bt(u,u===o,i.slidePrevClass)}),s.emitSlidesClasses()}const Ke=(s,e)=>{if(!s||s.destroyed||!s.params)return;const i=()=>s.isElement?"swiper-slide":`.${s.params.slideClass}`,t=e.closest(i());if(t){let r=t.querySelector(`.${s.params.lazyPreloaderClass}`);!r&&s.isElement&&(t.shadowRoot?r=t.shadowRoot.querySelector(`.${s.params.lazyPreloaderClass}`):requestAnimationFrame(()=>{t.shadowRoot&&(r=t.shadowRoot.querySelector(`.${s.params.lazyPreloaderClass}`),r&&r.remove())})),r&&r.remove()}},yt=(s,e)=>{if(!s.slides[e])return;const i=s.slides[e].querySelector('[loading="lazy"]');i&&i.removeAttribute("loading")},Mt=s=>{if(!s||s.destroyed||!s.params)return;let e=s.params.lazyPreloadPrevNext;const i=s.slides.length;if(!i||!e||e<0)return;e=Math.min(e,i);const t=s.params.slidesPerView==="auto"?s.slidesPerViewDynamic():Math.ceil(s.params.slidesPerView),r=s.activeIndex;if(s.params.grid&&s.params.grid.rows>1){const f=r,c=[f-e];c.push(...Array.from({length:e}).map((d,o)=>f+t+o)),s.slides.forEach((d,o)=>{c.includes(d.column)&&yt(s,o)});return}const n=r+t-1;if(s.params.rewind||s.params.loop)for(let f=r-e;f<=n+e;f+=1){const c=(f%i+i)%i;(c<r||c>n)&&yt(s,c)}else for(let f=Math.max(r-e,0);f<=Math.min(n+e,i-1);f+=1)f!==r&&(f>n||f<r)&&yt(s,f)};function $i(s){const{slidesGrid:e,params:i}=s,t=s.rtlTranslate?s.translate:-s.translate;let r;for(let n=0;n<e.length;n+=1)typeof e[n+1]<"u"?t>=e[n]&&t<e[n+1]-(e[n+1]-e[n])/2?r=n:t>=e[n]&&t<e[n+1]&&(r=n+1):t>=e[n]&&(r=n);return i.normalizeSlideIndex&&(r<0||typeof r>"u")&&(r=0),r}function Ai(s){const e=this,i=e.rtlTranslate?e.translate:-e.translate,{snapGrid:t,params:r,activeIndex:n,realIndex:f,snapIndex:c}=e;let d=s,o;const p=w=>{let a=w-e.virtual.slidesBefore;return a<0&&(a=e.virtual.slides.length+a),a>=e.virtual.slides.length&&(a-=e.virtual.slides.length),a};if(typeof d>"u"&&(d=$i(e)),t.indexOf(i)>=0)o=t.indexOf(i);else{const w=Math.min(r.slidesPerGroupSkip,d);o=w+Math.floor((d-w)/r.slidesPerGroup)}if(o>=t.length&&(o=t.length-1),d===n&&!e.params.loop){o!==c&&(e.snapIndex=o,e.emit("snapIndexChange"));return}if(d===n&&e.params.loop&&e.virtual&&e.params.virtual.enabled){e.realIndex=p(d);return}const u=e.grid&&r.grid&&r.grid.rows>1;let v;if(e.virtual&&r.virtual.enabled&&r.loop)v=p(d);else if(u){const w=e.slides.find(l=>l.column===d);let a=parseInt(w.getAttribute("data-swiper-slide-index"),10);Number.isNaN(a)&&(a=Math.max(e.slides.indexOf(w),0)),v=Math.floor(a/r.grid.rows)}else if(e.slides[d]){const w=e.slides[d].getAttribute("data-swiper-slide-index");w?v=parseInt(w,10):v=d}else v=d;Object.assign(e,{previousSnapIndex:c,snapIndex:o,previousRealIndex:f,realIndex:v,previousIndex:n,activeIndex:d}),e.initialized&&Mt(e),e.emit("activeIndexChange"),e.emit("snapIndexChange"),(e.initialized||e.params.runCallbacksOnInit)&&(f!==v&&e.emit("realIndexChange"),e.emit("slideChange"))}function ji(s,e){const i=this,t=i.params;let r=s.closest(`.${t.slideClass}, swiper-slide`);!r&&i.isElement&&e&&e.length>1&&e.includes(s)&&[...e.slice(e.indexOf(s)+1,e.length)].forEach(c=>{!r&&c.matches&&c.matches(`.${t.slideClass}, swiper-slide`)&&(r=c)});let n=!1,f;if(r){for(let c=0;c<i.slides.length;c+=1)if(i.slides[c]===r){n=!0,f=c;break}}if(r&&n)i.clickedSlide=r,i.virtual&&i.params.virtual.enabled?i.clickedIndex=parseInt(r.getAttribute("data-swiper-slide-index"),10):i.clickedIndex=f;else{i.clickedSlide=void 0,i.clickedIndex=void 0;return}t.slideToClickedSlide&&i.clickedIndex!==void 0&&i.clickedIndex!==i.activeIndex&&i.slideToClickedSlide()}var Di={updateSize:Ci,updateSlides:Pi,updateAutoHeight:_i,updateSlidesOffset:Ii,updateSlidesProgress:zi,updateProgress:Li,updateSlidesClasses:ki,updateActiveIndex:Ai,updateClickedSlide:ji};function Oi(s){s===void 0&&(s=this.isHorizontal()?"x":"y");const e=this,{params:i,rtlTranslate:t,translate:r,wrapperEl:n}=e;if(i.virtualTranslate)return t?-r:r;if(i.cssMode)return r;let f=Et(n,s);return f+=e.cssOverflowAdjustment(),t&&(f=-f),f||0}function Vi(s,e){const i=this,{rtlTranslate:t,params:r,wrapperEl:n,progress:f}=i;let c=0,d=0;const o=0;i.isHorizontal()?c=t?-s:s:d=s,r.roundLengths&&(c=Math.floor(c),d=Math.floor(d)),i.previousTranslate=i.translate,i.translate=i.isHorizontal()?c:d,r.cssMode?n[i.isHorizontal()?"scrollLeft":"scrollTop"]=i.isHorizontal()?-c:-d:r.virtualTranslate||(i.isHorizontal()?c-=i.cssOverflowAdjustment():d-=i.cssOverflowAdjustment(),n.style.transform=`translate3d(${c}px, ${d}px, ${o}px)`);let p;const u=i.maxTranslate()-i.minTranslate();u===0?p=0:p=(s-i.minTranslate())/u,p!==f&&i.updateProgress(s),i.emit("setTranslate",i.translate,e)}function Bi(){return-this.snapGrid[0]}function Gi(){return-this.snapGrid[this.snapGrid.length-1]}function Hi(s,e,i,t,r){s===void 0&&(s=0),e===void 0&&(e=this.params.speed),i===void 0&&(i=!0),t===void 0&&(t=!0);const n=this,{params:f,wrapperEl:c}=n;if(n.animating&&f.preventInteractionOnTransition)return!1;const d=n.minTranslate(),o=n.maxTranslate();let p;if(t&&s>d?p=d:t&&s<o?p=o:p=s,n.updateProgress(p),f.cssMode){const u=n.isHorizontal();if(e===0)c[u?"scrollLeft":"scrollTop"]=-p;else{if(!n.support.smoothScroll)return Ut({swiper:n,targetPosition:-p,side:u?"left":"top"}),!0;c.scrollTo({[u?"left":"top"]:-p,behavior:"smooth"})}return!0}return e===0?(n.setTransition(0),n.setTranslate(p),i&&(n.emit("beforeTransitionStart",e,r),n.emit("transitionEnd"))):(n.setTransition(e),n.setTranslate(p),i&&(n.emit("beforeTransitionStart",e,r),n.emit("transitionStart")),n.animating||(n.animating=!0,n.onTranslateToWrapperTransitionEnd||(n.onTranslateToWrapperTransitionEnd=function(v){!n||n.destroyed||v.target===this&&(n.wrapperEl.removeEventListener("transitionend",n.onTranslateToWrapperTransitionEnd),n.onTranslateToWrapperTransitionEnd=null,delete n.onTranslateToWrapperTransitionEnd,n.animating=!1,i&&n.emit("transitionEnd"))}),n.wrapperEl.addEventListener("transitionend",n.onTranslateToWrapperTransitionEnd))),!0}var Ri={getTranslate:Oi,setTranslate:Vi,minTranslate:Bi,maxTranslate:Gi,translateTo:Hi};function Xi(s,e){const i=this;i.params.cssMode||(i.wrapperEl.style.transitionDuration=`${s}ms`,i.wrapperEl.style.transitionDelay=s===0?"0ms":""),i.emit("setTransition",s,e)}function Jt(s){let{swiper:e,runCallbacks:i,direction:t,step:r}=s;const{activeIndex:n,previousIndex:f}=e;let c=t;c||(n>f?c="next":n<f?c="prev":c="reset"),e.emit(`transition${r}`),i&&c==="reset"?e.emit(`slideResetTransition${r}`):i&&n!==f&&(e.emit(`slideChangeTransition${r}`),c==="next"?e.emit(`slideNextTransition${r}`):e.emit(`slidePrevTransition${r}`))}function Ni(s,e){s===void 0&&(s=!0);const i=this,{params:t}=i;t.cssMode||(t.autoHeight&&i.updateAutoHeight(),Jt({swiper:i,runCallbacks:s,direction:e,step:"Start"}))}function Yi(s,e){s===void 0&&(s=!0);const i=this,{params:t}=i;i.animating=!1,!t.cssMode&&(i.setTransition(0),Jt({swiper:i,runCallbacks:s,direction:e,step:"End"}))}var Fi={setTransition:Xi,transitionStart:Ni,transitionEnd:Yi};function Wi(s,e,i,t,r){s===void 0&&(s=0),i===void 0&&(i=!0),typeof s=="string"&&(s=parseInt(s,10));const n=this;let f=s;f<0&&(f=0);const{params:c,snapGrid:d,slidesGrid:o,previousIndex:p,activeIndex:u,rtlTranslate:v,wrapperEl:w,enabled:a}=n;if(!a&&!t&&!r||n.destroyed||n.animating&&c.preventInteractionOnTransition)return!1;typeof e>"u"&&(e=n.params.speed);const l=Math.min(n.params.slidesPerGroupSkip,f);let h=l+Math.floor((f-l)/n.params.slidesPerGroup);h>=d.length&&(h=d.length-1);const b=-d[h];if(c.normalizeSlideIndex)for(let _=0;_<o.length;_+=1){const I=-Math.floor(b*100),S=Math.floor(o[_]*100),T=Math.floor(o[_+1]*100);typeof o[_+1]<"u"?I>=S&&I<T-(T-S)/2?f=_:I>=S&&I<T&&(f=_+1):I>=S&&(f=_)}if(n.initialized&&f!==u&&(!n.allowSlideNext&&(v?b>n.translate&&b>n.minTranslate():b<n.translate&&b<n.minTranslate())||!n.allowSlidePrev&&b>n.translate&&b>n.maxTranslate()&&(u||0)!==f))return!1;f!==(p||0)&&i&&n.emit("beforeSlideChangeStart"),n.updateProgress(b);let g;f>u?g="next":f<u?g="prev":g="reset";const m=n.virtual&&n.params.virtual.enabled;if(!(m&&r)&&(v&&-b===n.translate||!v&&b===n.translate))return n.updateActiveIndex(f),c.autoHeight&&n.updateAutoHeight(),n.updateSlidesClasses(),c.effect!=="slide"&&n.setTranslate(b),g!=="reset"&&(n.transitionStart(i,g),n.transitionEnd(i,g)),!1;if(c.cssMode){const _=n.isHorizontal(),I=v?b:-b;if(e===0)m&&(n.wrapperEl.style.scrollSnapType="none",n._immediateVirtual=!0),m&&!n._cssModeVirtualInitialSet&&n.params.initialSlide>0?(n._cssModeVirtualInitialSet=!0,requestAnimationFrame(()=>{w[_?"scrollLeft":"scrollTop"]=I})):w[_?"scrollLeft":"scrollTop"]=I,m&&requestAnimationFrame(()=>{n.wrapperEl.style.scrollSnapType="",n._immediateVirtual=!1});else{if(!n.support.smoothScroll)return Ut({swiper:n,targetPosition:I,side:_?"left":"top"}),!0;w.scrollTo({[_?"left":"top"]:I,behavior:"smooth"})}return!0}const k=Qt().isSafari;return m&&!r&&k&&n.isElement&&n.virtual.update(!1,!1,f),n.setTransition(e),n.setTranslate(b),n.updateActiveIndex(f),n.updateSlidesClasses(),n.emit("beforeTransitionStart",e,t),n.transitionStart(i,g),e===0?n.transitionEnd(i,g):n.animating||(n.animating=!0,n.onSlideToWrapperTransitionEnd||(n.onSlideToWrapperTransitionEnd=function(I){!n||n.destroyed||I.target===this&&(n.wrapperEl.removeEventListener("transitionend",n.onSlideToWrapperTransitionEnd),n.onSlideToWrapperTransitionEnd=null,delete n.onSlideToWrapperTransitionEnd,n.transitionEnd(i,g))}),n.wrapperEl.addEventListener("transitionend",n.onSlideToWrapperTransitionEnd)),!0}function qi(s,e,i,t){s===void 0&&(s=0),i===void 0&&(i=!0),typeof s=="string"&&(s=parseInt(s,10));const r=this;if(r.destroyed)return;typeof e>"u"&&(e=r.params.speed);const n=r.grid&&r.params.grid&&r.params.grid.rows>1;let f=s;if(r.params.loop)if(r.virtual&&r.params.virtual.enabled)f=f+r.virtual.slidesBefore;else{let c;if(n){const v=f*r.params.grid.rows;c=r.slides.find(w=>w.getAttribute("data-swiper-slide-index")*1===v).column}else c=r.getSlideIndexByData(f);const d=n?Math.ceil(r.slides.length/r.params.grid.rows):r.slides.length,{centeredSlides:o}=r.params;let p=r.params.slidesPerView;p==="auto"?p=r.slidesPerViewDynamic():(p=Math.ceil(parseFloat(r.params.slidesPerView,10)),o&&p%2===0&&(p=p+1));let u=d-c<p;if(o&&(u=u||c<Math.ceil(p/2)),t&&o&&r.params.slidesPerView!=="auto"&&!n&&(u=!1),u){const v=o?c<r.activeIndex?"prev":"next":c-r.activeIndex-1<r.params.slidesPerView?"next":"prev";r.loopFix({direction:v,slideTo:!0,activeSlideIndex:v==="next"?c+1:c-d+1,slideRealIndex:v==="next"?r.realIndex:void 0})}if(n){const v=f*r.params.grid.rows;f=r.slides.find(w=>w.getAttribute("data-swiper-slide-index")*1===v).column}else f=r.getSlideIndexByData(f)}return requestAnimationFrame(()=>{r.slideTo(f,e,i,t)}),r}function Ui(s,e,i){e===void 0&&(e=!0);const t=this,{enabled:r,params:n,animating:f}=t;if(!r||t.destroyed)return t;typeof s>"u"&&(s=t.params.speed);let c=n.slidesPerGroup;n.slidesPerView==="auto"&&n.slidesPerGroup===1&&n.slidesPerGroupAuto&&(c=Math.max(t.slidesPerViewDynamic("current",!0),1));const d=t.activeIndex<n.slidesPerGroupSkip?1:c,o=t.virtual&&n.virtual.enabled;if(n.loop){if(f&&!o&&n.loopPreventsSliding)return!1;if(t.loopFix({direction:"next"}),t._clientLeft=t.wrapperEl.clientLeft,t.activeIndex===t.slides.length-1&&n.cssMode)return requestAnimationFrame(()=>{t.slideTo(t.activeIndex+d,s,e,i)}),!0}return n.rewind&&t.isEnd?t.slideTo(0,s,e,i):t.slideTo(t.activeIndex+d,s,e,i)}function Ki(s,e,i){e===void 0&&(e=!0);const t=this,{params:r,snapGrid:n,slidesGrid:f,rtlTranslate:c,enabled:d,animating:o}=t;if(!d||t.destroyed)return t;typeof s>"u"&&(s=t.params.speed);const p=t.virtual&&r.virtual.enabled;if(r.loop){if(o&&!p&&r.loopPreventsSliding)return!1;t.loopFix({direction:"prev"}),t._clientLeft=t.wrapperEl.clientLeft}const u=c?t.translate:-t.translate;function v(g){return g<0?-Math.floor(Math.abs(g)):Math.floor(g)}const w=v(u),a=n.map(g=>v(g)),l=r.freeMode&&r.freeMode.enabled;let h=n[a.indexOf(w)-1];if(typeof h>"u"&&(r.cssMode||l)){let g;n.forEach((m,y)=>{w>=m&&(g=y)}),typeof g<"u"&&(h=l?n[g]:n[g>0?g-1:g])}let b=0;if(typeof h<"u"&&(b=f.indexOf(h),b<0&&(b=t.activeIndex-1),r.slidesPerView==="auto"&&r.slidesPerGroup===1&&r.slidesPerGroupAuto&&(b=b-t.slidesPerViewDynamic("previous",!0)+1,b=Math.max(b,0))),r.rewind&&t.isBeginning){const g=t.params.virtual&&t.params.virtual.enabled&&t.virtual?t.virtual.slides.length-1:t.slides.length-1;return t.slideTo(g,s,e,i)}else if(r.loop&&t.activeIndex===0&&r.cssMode)return requestAnimationFrame(()=>{t.slideTo(b,s,e,i)}),!0;return t.slideTo(b,s,e,i)}function Zi(s,e,i){e===void 0&&(e=!0);const t=this;if(!t.destroyed)return typeof s>"u"&&(s=t.params.speed),t.slideTo(t.activeIndex,s,e,i)}function Qi(s,e,i,t){e===void 0&&(e=!0),t===void 0&&(t=.5);const r=this;if(r.destroyed)return;typeof s>"u"&&(s=r.params.speed);let n=r.activeIndex;const f=Math.min(r.params.slidesPerGroupSkip,n),c=f+Math.floor((n-f)/r.params.slidesPerGroup),d=r.rtlTranslate?r.translate:-r.translate;if(d>=r.snapGrid[c]){const o=r.snapGrid[c],p=r.snapGrid[c+1];d-o>(p-o)*t&&(n+=r.params.slidesPerGroup)}else{const o=r.snapGrid[c-1],p=r.snapGrid[c];d-o<=(p-o)*t&&(n-=r.params.slidesPerGroup)}return n=Math.max(n,0),n=Math.min(n,r.slidesGrid.length-1),r.slideTo(n,s,e,i)}function Ji(){const s=this;if(s.destroyed)return;const{params:e,slidesEl:i}=s,t=e.slidesPerView==="auto"?s.slidesPerViewDynamic():e.slidesPerView;let r=s.clickedIndex,n;const f=s.isElement?"swiper-slide":`.${e.slideClass}`;if(e.loop){if(s.animating)return;n=parseInt(s.clickedSlide.getAttribute("data-swiper-slide-index"),10),e.centeredSlides?r<s.loopedSlides-t/2||r>s.slides.length-s.loopedSlides+t/2?(s.loopFix(),r=s.getSlideIndex(Q(i,`${f}[data-swiper-slide-index="${n}"]`)[0]),Se(()=>{s.slideTo(r)})):s.slideTo(r):r>s.slides.length-t?(s.loopFix(),r=s.getSlideIndex(Q(i,`${f}[data-swiper-slide-index="${n}"]`)[0]),Se(()=>{s.slideTo(r)})):s.slideTo(r)}else s.slideTo(r)}var es={slideTo:Wi,slideToLoop:qi,slideNext:Ui,slidePrev:Ki,slideReset:Zi,slideToClosest:Qi,slideToClickedSlide:Ji};function ts(s,e){const i=this,{params:t,slidesEl:r}=i;if(!t.loop||i.virtual&&i.params.virtual.enabled)return;const n=()=>{Q(r,`.${t.slideClass}, swiper-slide`).forEach((v,w)=>{v.setAttribute("data-swiper-slide-index",w)})},f=i.grid&&t.grid&&t.grid.rows>1,c=t.slidesPerGroup*(f?t.grid.rows:1),d=i.slides.length%c!==0,o=f&&i.slides.length%t.grid.rows!==0,p=u=>{for(let v=0;v<u;v+=1){const w=i.isElement?oe("swiper-slide",[t.slideBlankClass]):oe("div",[t.slideClass,t.slideBlankClass]);i.slidesEl.append(w)}};if(d){if(t.loopAddBlankSlides){const u=c-i.slides.length%c;p(u),i.recalcSlides(),i.updateSlides()}else Qe("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");n()}else if(o){if(t.loopAddBlankSlides){const u=t.grid.rows-i.slides.length%t.grid.rows;p(u),i.recalcSlides(),i.updateSlides()}else Qe("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");n()}else n();i.loopFix({slideRealIndex:s,direction:t.centeredSlides?void 0:"next",initial:e})}function is(s){let{slideRealIndex:e,slideTo:i=!0,direction:t,setTranslate:r,activeSlideIndex:n,initial:f,byController:c,byMousewheel:d}=s===void 0?{}:s;const o=this;if(!o.params.loop)return;o.emit("beforeLoopFix");const{slides:p,allowSlidePrev:u,allowSlideNext:v,slidesEl:w,params:a}=o,{centeredSlides:l,initialSlide:h}=a;if(o.allowSlidePrev=!0,o.allowSlideNext=!0,o.virtual&&a.virtual.enabled){i&&(!a.centeredSlides&&o.snapIndex===0?o.slideTo(o.virtual.slides.length,0,!1,!0):a.centeredSlides&&o.snapIndex<a.slidesPerView?o.slideTo(o.virtual.slides.length+o.snapIndex,0,!1,!0):o.snapIndex===o.snapGrid.length-1&&o.slideTo(o.virtual.slidesBefore,0,!1,!0)),o.allowSlidePrev=u,o.allowSlideNext=v,o.emit("loopFix");return}let b=a.slidesPerView;b==="auto"?b=o.slidesPerViewDynamic():(b=Math.ceil(parseFloat(a.slidesPerView,10)),l&&b%2===0&&(b=b+1));const g=a.slidesPerGroupAuto?b:a.slidesPerGroup;let m=g;m%g!==0&&(m+=g-m%g),m+=a.loopAdditionalSlides,o.loopedSlides=m;const y=o.grid&&a.grid&&a.grid.rows>1;p.length<b+m||o.params.effect==="cards"&&p.length<b+m*2?Qe("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters"):y&&a.grid.fill==="row"&&Qe("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");const E=[],k=[],_=y?Math.ceil(p.length/a.grid.rows):p.length,I=f&&_-h<b&&!l;let S=I?h:o.activeIndex;typeof n>"u"?n=o.getSlideIndex(p.find(O=>O.classList.contains(a.slideActiveClass))):S=n;const T=t==="next"||!t,z=t==="prev"||!t;let P=0,C=0;const j=(y?p[n].column:n)+(l&&typeof r>"u"?-b/2+.5:0);if(j<m){P=Math.max(m-j,g);for(let O=0;O<m-j;O+=1){const x=O-Math.floor(O/_)*_;if(y){const M=_-x-1;for(let B=p.length-1;B>=0;B-=1)p[B].column===M&&E.push(B)}else E.push(_-x-1)}}else if(j+b>_-m){C=Math.max(j-(_-m*2),g),I&&(C=Math.max(C,b-_+h+1));for(let O=0;O<C;O+=1){const x=O-Math.floor(O/_)*_;y?p.forEach((M,B)=>{M.column===x&&k.push(B)}):k.push(x)}}if(o.__preventObserver__=!0,requestAnimationFrame(()=>{o.__preventObserver__=!1}),o.params.effect==="cards"&&p.length<b+m*2&&(k.includes(n)&&k.splice(k.indexOf(n),1),E.includes(n)&&E.splice(E.indexOf(n),1)),z&&E.forEach(O=>{p[O].swiperLoopMoveDOM=!0,w.prepend(p[O]),p[O].swiperLoopMoveDOM=!1}),T&&k.forEach(O=>{p[O].swiperLoopMoveDOM=!0,w.append(p[O]),p[O].swiperLoopMoveDOM=!1}),o.recalcSlides(),a.slidesPerView==="auto"?o.updateSlides():y&&(E.length>0&&z||k.length>0&&T)&&o.slides.forEach((O,x)=>{o.grid.updateSlide(x,O,o.slides)}),a.watchSlidesProgress&&o.updateSlidesOffset(),i){if(E.length>0&&z){if(typeof e>"u"){const O=o.slidesGrid[S],M=o.slidesGrid[S+P]-O;d?o.setTranslate(o.translate-M):(o.slideTo(S+Math.ceil(P),0,!1,!0),r&&(o.touchEventsData.startTranslate=o.touchEventsData.startTranslate-M,o.touchEventsData.currentTranslate=o.touchEventsData.currentTranslate-M))}else if(r){const O=y?E.length/a.grid.rows:E.length;o.slideTo(o.activeIndex+O,0,!1,!0),o.touchEventsData.currentTranslate=o.translate}}else if(k.length>0&&T)if(typeof e>"u"){const O=o.slidesGrid[S],M=o.slidesGrid[S-C]-O;d?o.setTranslate(o.translate-M):(o.slideTo(S-C,0,!1,!0),r&&(o.touchEventsData.startTranslate=o.touchEventsData.startTranslate-M,o.touchEventsData.currentTranslate=o.touchEventsData.currentTranslate-M))}else{const O=y?k.length/a.grid.rows:k.length;o.slideTo(o.activeIndex-O,0,!1,!0)}}if(o.allowSlidePrev=u,o.allowSlideNext=v,o.controller&&o.controller.control&&!c){const O={slideRealIndex:e,direction:t,setTranslate:r,activeSlideIndex:n,byController:!0};Array.isArray(o.controller.control)?o.controller.control.forEach(x=>{!x.destroyed&&x.params.loop&&x.loopFix({...O,slideTo:x.params.slidesPerView===a.slidesPerView?i:!1})}):o.controller.control instanceof o.constructor&&o.controller.control.params.loop&&o.controller.control.loopFix({...O,slideTo:o.controller.control.params.slidesPerView===a.slidesPerView?i:!1})}o.emit("loopFix")}function ss(){const s=this,{params:e,slidesEl:i}=s;if(!e.loop||!i||s.virtual&&s.params.virtual.enabled)return;s.recalcSlides();const t=[];s.slides.forEach(r=>{const n=typeof r.swiperSlideIndex>"u"?r.getAttribute("data-swiper-slide-index")*1:r.swiperSlideIndex;t[n]=r}),s.slides.forEach(r=>{r.removeAttribute("data-swiper-slide-index")}),t.forEach(r=>{i.append(r)}),s.recalcSlides(),s.slideTo(s.realIndex,0)}var rs={loopCreate:ts,loopFix:is,loopDestroy:ss};function ns(s){const e=this;if(!e.params.simulateTouch||e.params.watchOverflow&&e.isLocked||e.params.cssMode)return;const i=e.params.touchEventsTarget==="container"?e.el:e.wrapperEl;e.isElement&&(e.__preventObserver__=!0),i.style.cursor="move",i.style.cursor=s?"grabbing":"grab",e.isElement&&requestAnimationFrame(()=>{e.__preventObserver__=!1})}function as(){const s=this;s.params.watchOverflow&&s.isLocked||s.params.cssMode||(s.isElement&&(s.__preventObserver__=!0),s[s.params.touchEventsTarget==="container"?"el":"wrapperEl"].style.cursor="",s.isElement&&requestAnimationFrame(()=>{s.__preventObserver__=!1}))}var os={setGrabCursor:ns,unsetGrabCursor:as};function ls(s,e){e===void 0&&(e=this);function i(t){if(!t||t===Z()||t===W())return null;t.assignedSlot&&(t=t.assignedSlot);const r=t.closest(s);return!r&&!t.getRootNode?null:r||i(t.getRootNode().host)}return i(e)}function Dt(s,e,i){const t=W(),{params:r}=s,n=r.edgeSwipeDetection,f=r.edgeSwipeThreshold;return n&&(i<=f||i>=t.innerWidth-f)?n==="prevent"?(e.preventDefault(),!0):!1:!0}function ps(s){const e=this,i=Z();let t=s;t.originalEvent&&(t=t.originalEvent);const r=e.touchEventsData;if(t.type==="pointerdown"){if(r.pointerId!==null&&r.pointerId!==t.pointerId)return;r.pointerId=t.pointerId}else t.type==="touchstart"&&t.targetTouches.length===1&&(r.touchId=t.targetTouches[0].identifier);if(t.type==="touchstart"){Dt(e,t,t.targetTouches[0].pageX);return}const{params:n,touches:f,enabled:c}=e;if(!c||!n.simulateTouch&&t.pointerType==="mouse"||e.animating&&n.preventInteractionOnTransition)return;!e.animating&&n.cssMode&&n.loop&&e.loopFix();let d=t.target;if(n.touchEventsTarget==="wrapper"&&!hi(d,e.wrapperEl)||"which"in t&&t.which===3||"button"in t&&t.button>0||r.isTouched&&r.isMoved)return;const o=!!n.noSwipingClass&&n.noSwipingClass!=="",p=t.composedPath?t.composedPath():t.path;o&&t.target&&t.target.shadowRoot&&p&&(d=p[0]);const u=n.noSwipingSelector?n.noSwipingSelector:`.${n.noSwipingClass}`,v=!!(t.target&&t.target.shadowRoot);if(n.noSwiping&&(v?ls(u,d):d.closest(u))){e.allowClick=!0;return}if(n.swipeHandler&&!d.closest(n.swipeHandler))return;f.currentX=t.pageX,f.currentY=t.pageY;const w=f.currentX,a=f.currentY;if(!Dt(e,t,w))return;Object.assign(r,{isTouched:!0,isMoved:!1,allowTouchCallbacks:!0,isScrolling:void 0,startMoving:void 0}),f.startX=w,f.startY=a,r.touchStartTime=le(),e.allowClick=!0,e.updateSize(),e.swipeDirection=void 0,n.threshold>0&&(r.allowThresholdMove=!1);let l=!0;d.matches(r.focusableElements)&&(l=!1,d.nodeName==="SELECT"&&(r.isTouched=!1)),i.activeElement&&i.activeElement.matches(r.focusableElements)&&i.activeElement!==d&&(t.pointerType==="mouse"||t.pointerType!=="mouse"&&!d.matches(r.focusableElements))&&i.activeElement.blur();const h=l&&e.allowTouchMove&&n.touchStartPreventDefault;(n.touchStartForcePreventDefault||h)&&!d.isContentEditable&&t.preventDefault(),n.freeMode&&n.freeMode.enabled&&e.freeMode&&e.animating&&!n.cssMode&&e.freeMode.onTouchStart(),e.emit("touchStart",t)}function ds(s){const e=Z(),i=this,t=i.touchEventsData,{params:r,touches:n,rtlTranslate:f,enabled:c}=i;if(!c||!r.simulateTouch&&s.pointerType==="mouse")return;let d=s;if(d.originalEvent&&(d=d.originalEvent),d.type==="pointermove"&&(t.touchId!==null||d.pointerId!==t.pointerId))return;let o;if(d.type==="touchmove"){if(o=[...d.changedTouches].find(E=>E.identifier===t.touchId),!o||o.identifier!==t.touchId)return}else o=d;if(!t.isTouched){t.startMoving&&t.isScrolling&&i.emit("touchMoveOpposite",d);return}const p=o.pageX,u=o.pageY;if(d.preventedByNestedSwiper){n.startX=p,n.startY=u;return}if(!i.allowTouchMove){d.target.matches(t.focusableElements)||(i.allowClick=!1),t.isTouched&&(Object.assign(n,{startX:p,startY:u,currentX:p,currentY:u}),t.touchStartTime=le());return}if(r.touchReleaseOnEdges&&!r.loop)if(i.isVertical()){if(u<n.startY&&i.translate<=i.maxTranslate()||u>n.startY&&i.translate>=i.minTranslate()){t.isTouched=!1,t.isMoved=!1;return}}else{if(f&&(p>n.startX&&-i.translate<=i.maxTranslate()||p<n.startX&&-i.translate>=i.minTranslate()))return;if(!f&&(p<n.startX&&i.translate<=i.maxTranslate()||p>n.startX&&i.translate>=i.minTranslate()))return}if(e.activeElement&&e.activeElement.matches(t.focusableElements)&&e.activeElement!==d.target&&d.pointerType!=="mouse"&&e.activeElement.blur(),e.activeElement&&d.target===e.activeElement&&d.target.matches(t.focusableElements)){t.isMoved=!0,i.allowClick=!1;return}t.allowTouchCallbacks&&i.emit("touchMove",d),n.previousX=n.currentX,n.previousY=n.currentY,n.currentX=p,n.currentY=u;const v=n.currentX-n.startX,w=n.currentY-n.startY;if(i.params.threshold&&Math.sqrt(v**2+w**2)<i.params.threshold)return;if(typeof t.isScrolling>"u"){let E;i.isHorizontal()&&n.currentY===n.startY||i.isVertical()&&n.currentX===n.startX?t.isScrolling=!1:v*v+w*w>=25&&(E=Math.atan2(Math.abs(w),Math.abs(v))*180/Math.PI,t.isScrolling=i.isHorizontal()?E>r.touchAngle:90-E>r.touchAngle)}if(t.isScrolling&&i.emit("touchMoveOpposite",d),typeof t.startMoving>"u"&&(n.currentX!==n.startX||n.currentY!==n.startY)&&(t.startMoving=!0),t.isScrolling||d.type==="touchmove"&&t.preventTouchMoveFromPointerMove){t.isTouched=!1;return}if(!t.startMoving)return;i.allowClick=!1,!r.cssMode&&d.cancelable&&d.preventDefault(),r.touchMoveStopPropagation&&!r.nested&&d.stopPropagation();let a=i.isHorizontal()?v:w,l=i.isHorizontal()?n.currentX-n.previousX:n.currentY-n.previousY;r.oneWayMovement&&(a=Math.abs(a)*(f?1:-1),l=Math.abs(l)*(f?1:-1)),n.diff=a,a*=r.touchRatio,f&&(a=-a,l=-l);const h=i.touchesDirection;i.swipeDirection=a>0?"prev":"next",i.touchesDirection=l>0?"prev":"next";const b=i.params.loop&&!r.cssMode,g=i.touchesDirection==="next"&&i.allowSlideNext||i.touchesDirection==="prev"&&i.allowSlidePrev;if(!t.isMoved){if(b&&g&&i.loopFix({direction:i.swipeDirection}),t.startTranslate=i.getTranslate(),i.setTransition(0),i.animating){const E=new window.CustomEvent("transitionend",{bubbles:!0,cancelable:!0,detail:{bySwiperTouchMove:!0}});i.wrapperEl.dispatchEvent(E)}t.allowMomentumBounce=!1,r.grabCursor&&(i.allowSlideNext===!0||i.allowSlidePrev===!0)&&i.setGrabCursor(!0),i.emit("sliderFirstMove",d)}if(new Date().getTime(),r._loopSwapReset!==!1&&t.isMoved&&t.allowThresholdMove&&h!==i.touchesDirection&&b&&g&&Math.abs(a)>=1){Object.assign(n,{startX:p,startY:u,currentX:p,currentY:u,startTranslate:t.currentTranslate}),t.loopSwapReset=!0,t.startTranslate=t.currentTranslate;return}i.emit("sliderMove",d),t.isMoved=!0,t.currentTranslate=a+t.startTranslate;let m=!0,y=r.resistanceRatio;if(r.touchReleaseOnEdges&&(y=0),a>0?(b&&g&&t.allowThresholdMove&&t.currentTranslate>(r.centeredSlides?i.minTranslate()-i.slidesSizesGrid[i.activeIndex+1]-(r.slidesPerView!=="auto"&&i.slides.length-r.slidesPerView>=2?i.slidesSizesGrid[i.activeIndex+1]+i.params.spaceBetween:0)-i.params.spaceBetween:i.minTranslate())&&i.loopFix({direction:"prev",setTranslate:!0,activeSlideIndex:0}),t.currentTranslate>i.minTranslate()&&(m=!1,r.resistance&&(t.currentTranslate=i.minTranslate()-1+(-i.minTranslate()+t.startTranslate+a)**y))):a<0&&(b&&g&&t.allowThresholdMove&&t.currentTranslate<(r.centeredSlides?i.maxTranslate()+i.slidesSizesGrid[i.slidesSizesGrid.length-1]+i.params.spaceBetween+(r.slidesPerView!=="auto"&&i.slides.length-r.slidesPerView>=2?i.slidesSizesGrid[i.slidesSizesGrid.length-1]+i.params.spaceBetween:0):i.maxTranslate())&&i.loopFix({direction:"next",setTranslate:!0,activeSlideIndex:i.slides.length-(r.slidesPerView==="auto"?i.slidesPerViewDynamic():Math.ceil(parseFloat(r.slidesPerView,10)))}),t.currentTranslate<i.maxTranslate()&&(m=!1,r.resistance&&(t.currentTranslate=i.maxTranslate()+1-(i.maxTranslate()-t.startTranslate-a)**y))),m&&(d.preventedByNestedSwiper=!0),!i.allowSlideNext&&i.swipeDirection==="next"&&t.currentTranslate<t.startTranslate&&(t.currentTranslate=t.startTranslate),!i.allowSlidePrev&&i.swipeDirection==="prev"&&t.currentTranslate>t.startTranslate&&(t.currentTranslate=t.startTranslate),!i.allowSlidePrev&&!i.allowSlideNext&&(t.currentTranslate=t.startTranslate),r.threshold>0)if(Math.abs(a)>r.threshold||t.allowThresholdMove){if(!t.allowThresholdMove){t.allowThresholdMove=!0,n.startX=n.currentX,n.startY=n.currentY,t.currentTranslate=t.startTranslate,n.diff=i.isHorizontal()?n.currentX-n.startX:n.currentY-n.startY;return}}else{t.currentTranslate=t.startTranslate;return}!r.followFinger||r.cssMode||((r.freeMode&&r.freeMode.enabled&&i.freeMode||r.watchSlidesProgress)&&(i.updateActiveIndex(),i.updateSlidesClasses()),r.freeMode&&r.freeMode.enabled&&i.freeMode&&i.freeMode.onTouchMove(),i.updateProgress(t.currentTranslate),i.setTranslate(t.currentTranslate))}function cs(s){const e=this,i=e.touchEventsData;let t=s;t.originalEvent&&(t=t.originalEvent);let r;if(t.type==="touchend"||t.type==="touchcancel"){if(r=[...t.changedTouches].find(E=>E.identifier===i.touchId),!r||r.identifier!==i.touchId)return}else{if(i.touchId!==null||t.pointerId!==i.pointerId)return;r=t}if(["pointercancel","pointerout","pointerleave","contextmenu"].includes(t.type)&&!(["pointercancel","contextmenu"].includes(t.type)&&(e.browser.isSafari||e.browser.isWebView)))return;i.pointerId=null,i.touchId=null;const{params:f,touches:c,rtlTranslate:d,slidesGrid:o,enabled:p}=e;if(!p||!f.simulateTouch&&t.pointerType==="mouse")return;if(i.allowTouchCallbacks&&e.emit("touchEnd",t),i.allowTouchCallbacks=!1,!i.isTouched){i.isMoved&&f.grabCursor&&e.setGrabCursor(!1),i.isMoved=!1,i.startMoving=!1;return}f.grabCursor&&i.isMoved&&i.isTouched&&(e.allowSlideNext===!0||e.allowSlidePrev===!0)&&e.setGrabCursor(!1);const u=le(),v=u-i.touchStartTime;if(e.allowClick){const E=t.path||t.composedPath&&t.composedPath();e.updateClickedSlide(E&&E[0]||t.target,E),e.emit("tap click",t),v<300&&u-i.lastClickTime<300&&e.emit("doubleTap doubleClick",t)}if(i.lastClickTime=le(),Se(()=>{e.destroyed||(e.allowClick=!0)}),!i.isTouched||!i.isMoved||!e.swipeDirection||c.diff===0&&!i.loopSwapReset||i.currentTranslate===i.startTranslate&&!i.loopSwapReset){i.isTouched=!1,i.isMoved=!1,i.startMoving=!1;return}i.isTouched=!1,i.isMoved=!1,i.startMoving=!1;let w;if(f.followFinger?w=d?e.translate:-e.translate:w=-i.currentTranslate,f.cssMode)return;if(f.freeMode&&f.freeMode.enabled){e.freeMode.onTouchEnd({currentPos:w});return}const a=w>=-e.maxTranslate()&&!e.params.loop;let l=0,h=e.slidesSizesGrid[0];for(let E=0;E<o.length;E+=E<f.slidesPerGroupSkip?1:f.slidesPerGroup){const k=E<f.slidesPerGroupSkip-1?1:f.slidesPerGroup;typeof o[E+k]<"u"?(a||w>=o[E]&&w<o[E+k])&&(l=E,h=o[E+k]-o[E]):(a||w>=o[E])&&(l=E,h=o[o.length-1]-o[o.length-2])}let b=null,g=null;f.rewind&&(e.isBeginning?g=f.virtual&&f.virtual.enabled&&e.virtual?e.virtual.slides.length-1:e.slides.length-1:e.isEnd&&(b=0));const m=(w-o[l])/h,y=l<f.slidesPerGroupSkip-1?1:f.slidesPerGroup;if(v>f.longSwipesMs){if(!f.longSwipes){e.slideTo(e.activeIndex);return}e.swipeDirection==="next"&&(m>=f.longSwipesRatio?e.slideTo(f.rewind&&e.isEnd?b:l+y):e.slideTo(l)),e.swipeDirection==="prev"&&(m>1-f.longSwipesRatio?e.slideTo(l+y):g!==null&&m<0&&Math.abs(m)>f.longSwipesRatio?e.slideTo(g):e.slideTo(l))}else{if(!f.shortSwipes){e.slideTo(e.activeIndex);return}e.navigation&&(t.target===e.navigation.nextEl||t.target===e.navigation.prevEl)?t.target===e.navigation.nextEl?e.slideTo(l+y):e.slideTo(l):(e.swipeDirection==="next"&&e.slideTo(b!==null?b:l+y),e.swipeDirection==="prev"&&e.slideTo(g!==null?g:l))}}function Ot(){const s=this,{params:e,el:i}=s;if(i&&i.offsetWidth===0)return;e.breakpoints&&s.setBreakpoint();const{allowSlideNext:t,allowSlidePrev:r,snapGrid:n}=s,f=s.virtual&&s.params.virtual.enabled;s.allowSlideNext=!0,s.allowSlidePrev=!0,s.updateSize(),s.updateSlides(),s.updateSlidesClasses();const c=f&&e.loop;(e.slidesPerView==="auto"||e.slidesPerView>1)&&s.isEnd&&!s.isBeginning&&!s.params.centeredSlides&&!c?s.slideTo(s.slides.length-1,0,!1,!0):s.params.loop&&!f?s.slideToLoop(s.realIndex,0,!1,!0):s.slideTo(s.activeIndex,0,!1,!0),s.autoplay&&s.autoplay.running&&s.autoplay.paused&&(clearTimeout(s.autoplay.resizeTimeout),s.autoplay.resizeTimeout=setTimeout(()=>{s.autoplay&&s.autoplay.running&&s.autoplay.paused&&s.autoplay.resume()},500)),s.allowSlidePrev=r,s.allowSlideNext=t,s.params.watchOverflow&&n!==s.snapGrid&&s.checkOverflow()}function fs(s){const e=this;e.enabled&&(e.allowClick||(e.params.preventClicks&&s.preventDefault(),e.params.preventClicksPropagation&&e.animating&&(s.stopPropagation(),s.stopImmediatePropagation())))}function us(){const s=this,{wrapperEl:e,rtlTranslate:i,enabled:t}=s;if(!t)return;s.previousTranslate=s.translate,s.isHorizontal()?s.translate=-e.scrollLeft:s.translate=-e.scrollTop,s.translate===0&&(s.translate=0),s.updateActiveIndex(),s.updateSlidesClasses();let r;const n=s.maxTranslate()-s.minTranslate();n===0?r=0:r=(s.translate-s.minTranslate())/n,r!==s.progress&&s.updateProgress(i?-s.translate:s.translate),s.emit("setTranslate",s.translate,!1)}function ms(s){const e=this;Ke(e,s.target),!(e.params.cssMode||e.params.slidesPerView!=="auto"&&!e.params.autoHeight)&&e.update()}function ws(){const s=this;s.documentTouchHandlerProceeded||(s.documentTouchHandlerProceeded=!0,s.params.touchReleaseOnEdges&&(s.el.style.touchAction="auto"))}const ei=(s,e)=>{const i=Z(),{params:t,el:r,wrapperEl:n,device:f}=s,c=!!t.nested,d=e==="on"?"addEventListener":"removeEventListener",o=e;!r||typeof r=="string"||(i[d]("touchstart",s.onDocumentTouchStart,{passive:!1,capture:c}),r[d]("touchstart",s.onTouchStart,{passive:!1}),r[d]("pointerdown",s.onTouchStart,{passive:!1}),i[d]("touchmove",s.onTouchMove,{passive:!1,capture:c}),i[d]("pointermove",s.onTouchMove,{passive:!1,capture:c}),i[d]("touchend",s.onTouchEnd,{passive:!0}),i[d]("pointerup",s.onTouchEnd,{passive:!0}),i[d]("pointercancel",s.onTouchEnd,{passive:!0}),i[d]("touchcancel",s.onTouchEnd,{passive:!0}),i[d]("pointerout",s.onTouchEnd,{passive:!0}),i[d]("pointerleave",s.onTouchEnd,{passive:!0}),i[d]("contextmenu",s.onTouchEnd,{passive:!0}),(t.preventClicks||t.preventClicksPropagation)&&r[d]("click",s.onClick,!0),t.cssMode&&n[d]("scroll",s.onScroll),t.updateOnWindowResize?s[o](f.ios||f.android?"resize orientationchange observerUpdate":"resize observerUpdate",Ot,!0):s[o]("observerUpdate",Ot,!0),r[d]("load",s.onLoad,{capture:!0}))};function gs(){const s=this,{params:e}=s;s.onTouchStart=ps.bind(s),s.onTouchMove=ds.bind(s),s.onTouchEnd=cs.bind(s),s.onDocumentTouchStart=ws.bind(s),e.cssMode&&(s.onScroll=us.bind(s)),s.onClick=fs.bind(s),s.onLoad=ms.bind(s),ei(s,"on")}function hs(){ei(this,"off")}var vs={attachEvents:gs,detachEvents:hs};const Vt=(s,e)=>s.grid&&e.grid&&e.grid.rows>1;function bs(){const s=this,{realIndex:e,initialized:i,params:t,el:r}=s,n=t.breakpoints;if(!n||n&&Object.keys(n).length===0)return;const f=Z(),c=t.breakpointsBase==="window"||!t.breakpointsBase?t.breakpointsBase:"container",d=["window","container"].includes(t.breakpointsBase)||!t.breakpointsBase?s.el:f.querySelector(t.breakpointsBase),o=s.getBreakpoint(n,c,d);if(!o||s.currentBreakpoint===o)return;const u=(o in n?n[o]:void 0)||s.originalParams,v=Vt(s,t),w=Vt(s,u),a=s.params.grabCursor,l=u.grabCursor,h=t.enabled;v&&!w?(r.classList.remove(`${t.containerModifierClass}grid`,`${t.containerModifierClass}grid-column`),s.emitContainerClasses()):!v&&w&&(r.classList.add(`${t.containerModifierClass}grid`),(u.grid.fill&&u.grid.fill==="column"||!u.grid.fill&&t.grid.fill==="column")&&r.classList.add(`${t.containerModifierClass}grid-column`),s.emitContainerClasses()),a&&!l?s.unsetGrabCursor():!a&&l&&s.setGrabCursor(),["navigation","pagination","scrollbar"].forEach(k=>{if(typeof u[k]>"u")return;const _=t[k]&&t[k].enabled,I=u[k]&&u[k].enabled;_&&!I&&s[k].disable(),!_&&I&&s[k].enable()});const b=u.direction&&u.direction!==t.direction,g=t.loop&&(u.slidesPerView!==t.slidesPerView||b),m=t.loop;b&&i&&s.changeDirection(),ae(s.params,u);const y=s.params.enabled,E=s.params.loop;Object.assign(s,{allowTouchMove:s.params.allowTouchMove,allowSlideNext:s.params.allowSlideNext,allowSlidePrev:s.params.allowSlidePrev}),h&&!y?s.disable():!h&&y&&s.enable(),s.currentBreakpoint=o,s.emit("_beforeBreakpoint",u),i&&(g?(s.loopDestroy(),s.loopCreate(e),s.updateSlides()):!m&&E?(s.loopCreate(e),s.updateSlides()):m&&!E&&s.loopDestroy()),s.emit("breakpoint",u)}function ys(s,e,i){if(e===void 0&&(e="window"),!s||e==="container"&&!i)return;let t=!1;const r=W(),n=e==="window"?r.innerHeight:i.clientHeight,f=Object.keys(s).map(c=>{if(typeof c=="string"&&c.indexOf("@")===0){const d=parseFloat(c.substr(1));return{value:n*d,point:c}}return{value:c,point:c}});f.sort((c,d)=>parseInt(c.value,10)-parseInt(d.value,10));for(let c=0;c<f.length;c+=1){const{point:d,value:o}=f[c];e==="window"?r.matchMedia(`(min-width: ${o}px)`).matches&&(t=d):o<=i.clientWidth&&(t=d)}return t||"max"}var Ss={setBreakpoint:bs,getBreakpoint:ys};function xs(s,e){const i=[];return s.forEach(t=>{typeof t=="object"?Object.keys(t).forEach(r=>{t[r]&&i.push(e+r)}):typeof t=="string"&&i.push(e+t)}),i}function Es(){const s=this,{classNames:e,params:i,rtl:t,el:r,device:n}=s,f=xs(["initialized",i.direction,{"free-mode":s.params.freeMode&&i.freeMode.enabled},{autoheight:i.autoHeight},{rtl:t},{grid:i.grid&&i.grid.rows>1},{"grid-column":i.grid&&i.grid.rows>1&&i.grid.fill==="column"},{android:n.android},{ios:n.ios},{"css-mode":i.cssMode},{centered:i.cssMode&&i.centeredSlides},{"watch-progress":i.watchSlidesProgress}],i.containerModifierClass);e.push(...f),r.classList.add(...e),s.emitContainerClasses()}function Ts(){const s=this,{el:e,classNames:i}=s;!e||typeof e=="string"||(e.classList.remove(...i),s.emitContainerClasses())}var Ms={addClasses:Es,removeClasses:Ts};function Cs(){const s=this,{isLocked:e,params:i}=s,{slidesOffsetBefore:t}=i;if(t){const r=s.slides.length-1,n=s.slidesGrid[r]+s.slidesSizesGrid[r]+t*2;s.isLocked=s.size>n}else s.isLocked=s.snapGrid.length===1;i.allowSlideNext===!0&&(s.allowSlideNext=!s.isLocked),i.allowSlidePrev===!0&&(s.allowSlidePrev=!s.isLocked),e&&e!==s.isLocked&&(s.isEnd=!1),e!==s.isLocked&&s.emit(s.isLocked?"lock":"unlock")}var Ps={checkOverflow:Cs},Ct={init:!0,direction:"horizontal",oneWayMovement:!1,swiperElementNodeName:"SWIPER-CONTAINER",touchEventsTarget:"wrapper",initialSlide:0,speed:300,cssMode:!1,updateOnWindowResize:!0,resizeObserver:!0,nested:!1,createElements:!1,eventsPrefix:"swiper",enabled:!0,focusableElements:"input, select, option, textarea, button, video, label",width:null,height:null,preventInteractionOnTransition:!1,userAgent:null,url:null,edgeSwipeDetection:!1,edgeSwipeThreshold:20,autoHeight:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",breakpoints:void 0,breakpointsBase:"window",spaceBetween:0,slidesPerView:1,slidesPerGroup:1,slidesPerGroupSkip:0,slidesPerGroupAuto:!1,centeredSlides:!1,centeredSlidesBounds:!1,slidesOffsetBefore:0,slidesOffsetAfter:0,normalizeSlideIndex:!0,centerInsufficientSlides:!1,watchOverflow:!0,roundLengths:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,allowTouchMove:!0,threshold:5,touchMoveStopPropagation:!1,touchStartPreventDefault:!0,touchStartForcePreventDefault:!1,touchReleaseOnEdges:!1,uniqueNavElements:!0,resistance:!0,resistanceRatio:.85,watchSlidesProgress:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,loop:!1,loopAddBlankSlides:!0,loopAdditionalSlides:0,loopPreventsSliding:!0,rewind:!1,allowSlidePrev:!0,allowSlideNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",noSwipingSelector:null,passiveListeners:!0,maxBackfaceHiddenSlides:10,containerModifierClass:"swiper-",slideClass:"swiper-slide",slideBlankClass:"swiper-slide-blank",slideActiveClass:"swiper-slide-active",slideVisibleClass:"swiper-slide-visible",slideFullyVisibleClass:"swiper-slide-fully-visible",slideNextClass:"swiper-slide-next",slidePrevClass:"swiper-slide-prev",wrapperClass:"swiper-wrapper",lazyPreloaderClass:"swiper-lazy-preloader",lazyPreloadPrevNext:0,runCallbacksOnInit:!0,_emitClasses:!1};function _s(s,e){return function(t){t===void 0&&(t={});const r=Object.keys(t)[0],n=t[r];if(typeof n!="object"||n===null){ae(e,t);return}if(s[r]===!0&&(s[r]={enabled:!0}),r==="navigation"&&s[r]&&s[r].enabled&&!s[r].prevEl&&!s[r].nextEl&&(s[r].auto=!0),["pagination","scrollbar"].indexOf(r)>=0&&s[r]&&s[r].enabled&&!s[r].el&&(s[r].auto=!0),!(r in s&&"enabled"in n)){ae(e,t);return}typeof s[r]=="object"&&!("enabled"in s[r])&&(s[r].enabled=!0),s[r]||(s[r]={enabled:!1}),ae(e,t)}}const St={eventsEmitter:Mi,update:Di,translate:Ri,transition:Fi,slide:es,loop:rs,grabCursor:os,events:vs,breakpoints:Ss,checkOverflow:Ps,classes:Ms},xt={};class ne{constructor(){let e,i;for(var t=arguments.length,r=new Array(t),n=0;n<t;n++)r[n]=arguments[n];r.length===1&&r[0].constructor&&Object.prototype.toString.call(r[0]).slice(8,-1)==="Object"?i=r[0]:[e,i]=r,i||(i={}),i=ae({},i),e&&!i.el&&(i.el=e);const f=Z();if(i.el&&typeof i.el=="string"&&f.querySelectorAll(i.el).length>1){const p=[];return f.querySelectorAll(i.el).forEach(u=>{const v=ae({},i,{el:u});p.push(new ne(v))}),p}const c=this;c.__swiper__=!0,c.support=Kt(),c.device=Zt({userAgent:i.userAgent}),c.browser=Qt(),c.eventsListeners={},c.eventsAnyListeners=[],c.modules=[...c.__modules__],i.modules&&Array.isArray(i.modules)&&c.modules.push(...i.modules);const d={};c.modules.forEach(p=>{p({params:i,swiper:c,extendParams:_s(i,d),on:c.on.bind(c),once:c.once.bind(c),off:c.off.bind(c),emit:c.emit.bind(c)})});const o=ae({},Ct,d);return c.params=ae({},o,xt,i),c.originalParams=ae({},c.params),c.passedParams=ae({},i),c.params&&c.params.on&&Object.keys(c.params.on).forEach(p=>{c.on(p,c.params.on[p])}),c.params&&c.params.onAny&&c.onAny(c.params.onAny),Object.assign(c,{enabled:c.params.enabled,el:e,classNames:[],slides:[],slidesGrid:[],snapGrid:[],slidesSizesGrid:[],isHorizontal(){return c.params.direction==="horizontal"},isVertical(){return c.params.direction==="vertical"},activeIndex:0,realIndex:0,isBeginning:!0,isEnd:!1,translate:0,previousTranslate:0,progress:0,velocity:0,animating:!1,cssOverflowAdjustment(){return Math.trunc(this.translate/2**23)*2**23},allowSlideNext:c.params.allowSlideNext,allowSlidePrev:c.params.allowSlidePrev,touchEventsData:{isTouched:void 0,isMoved:void 0,allowTouchCallbacks:void 0,touchStartTime:void 0,isScrolling:void 0,currentTranslate:void 0,startTranslate:void 0,allowThresholdMove:void 0,focusableElements:c.params.focusableElements,lastClickTime:0,clickTimeout:void 0,velocities:[],allowMomentumBounce:void 0,startMoving:void 0,pointerId:null,touchId:null},allowClick:!0,allowTouchMove:c.params.allowTouchMove,touches:{startX:0,startY:0,currentX:0,currentY:0,diff:0},imagesToLoad:[],imagesLoaded:0}),c.emit("_swiper"),c.params.init&&c.init(),c}getDirectionLabel(e){return this.isHorizontal()?e:{width:"height","margin-top":"margin-left","margin-bottom ":"margin-right","margin-left":"margin-top","margin-right":"margin-bottom","padding-left":"padding-top","padding-right":"padding-bottom",marginRight:"marginBottom"}[e]}getSlideIndex(e){const{slidesEl:i,params:t}=this,r=Q(i,`.${t.slideClass}, swiper-slide`),n=Re(r[0]);return Re(e)-n}getSlideIndexByData(e){return this.getSlideIndex(this.slides.find(i=>i.getAttribute("data-swiper-slide-index")*1===e))}recalcSlides(){const e=this,{slidesEl:i,params:t}=e;e.slides=Q(i,`.${t.slideClass}, swiper-slide`)}enable(){const e=this;e.enabled||(e.enabled=!0,e.params.grabCursor&&e.setGrabCursor(),e.emit("enable"))}disable(){const e=this;e.enabled&&(e.enabled=!1,e.params.grabCursor&&e.unsetGrabCursor(),e.emit("disable"))}setProgress(e,i){const t=this;e=Math.min(Math.max(e,0),1);const r=t.minTranslate(),f=(t.maxTranslate()-r)*e+r;t.translateTo(f,typeof i>"u"?0:i),t.updateActiveIndex(),t.updateSlidesClasses()}emitContainerClasses(){const e=this;if(!e.params._emitClasses||!e.el)return;const i=e.el.className.split(" ").filter(t=>t.indexOf("swiper")===0||t.indexOf(e.params.containerModifierClass)===0);e.emit("_containerClasses",i.join(" "))}getSlideClasses(e){const i=this;return i.destroyed?"":e.className.split(" ").filter(t=>t.indexOf("swiper-slide")===0||t.indexOf(i.params.slideClass)===0).join(" ")}emitSlidesClasses(){const e=this;if(!e.params._emitClasses||!e.el)return;const i=[];e.slides.forEach(t=>{const r=e.getSlideClasses(t);i.push({slideEl:t,classNames:r}),e.emit("_slideClass",t,r)}),e.emit("_slideClasses",i)}slidesPerViewDynamic(e,i){e===void 0&&(e="current"),i===void 0&&(i=!1);const t=this,{params:r,slides:n,slidesGrid:f,slidesSizesGrid:c,size:d,activeIndex:o}=t;let p=1;if(typeof r.slidesPerView=="number")return r.slidesPerView;if(r.centeredSlides){let u=n[o]?Math.ceil(n[o].swiperSlideSize):0,v;for(let w=o+1;w<n.length;w+=1)n[w]&&!v&&(u+=Math.ceil(n[w].swiperSlideSize),p+=1,u>d&&(v=!0));for(let w=o-1;w>=0;w-=1)n[w]&&!v&&(u+=n[w].swiperSlideSize,p+=1,u>d&&(v=!0))}else if(e==="current")for(let u=o+1;u<n.length;u+=1)(i?f[u]+c[u]-f[o]<d:f[u]-f[o]<d)&&(p+=1);else for(let u=o-1;u>=0;u-=1)f[o]-f[u]<d&&(p+=1);return p}update(){const e=this;if(!e||e.destroyed)return;const{snapGrid:i,params:t}=e;t.breakpoints&&e.setBreakpoint(),[...e.el.querySelectorAll('[loading="lazy"]')].forEach(f=>{f.complete&&Ke(e,f)}),e.updateSize(),e.updateSlides(),e.updateProgress(),e.updateSlidesClasses();function r(){const f=e.rtlTranslate?e.translate*-1:e.translate,c=Math.min(Math.max(f,e.maxTranslate()),e.minTranslate());e.setTranslate(c),e.updateActiveIndex(),e.updateSlidesClasses()}let n;if(t.freeMode&&t.freeMode.enabled&&!t.cssMode)r(),t.autoHeight&&e.updateAutoHeight();else{if((t.slidesPerView==="auto"||t.slidesPerView>1)&&e.isEnd&&!t.centeredSlides){const f=e.virtual&&t.virtual.enabled?e.virtual.slides:e.slides;n=e.slideTo(f.length-1,0,!1,!0)}else n=e.slideTo(e.activeIndex,0,!1,!0);n||r()}t.watchOverflow&&i!==e.snapGrid&&e.checkOverflow(),e.emit("update")}changeDirection(e,i){i===void 0&&(i=!0);const t=this,r=t.params.direction;return e||(e=r==="horizontal"?"vertical":"horizontal"),e===r||e!=="horizontal"&&e!=="vertical"||(t.el.classList.remove(`${t.params.containerModifierClass}${r}`),t.el.classList.add(`${t.params.containerModifierClass}${e}`),t.emitContainerClasses(),t.params.direction=e,t.slides.forEach(n=>{e==="vertical"?n.style.width="":n.style.height=""}),t.emit("changeDirection"),i&&t.update()),t}changeLanguageDirection(e){const i=this;i.rtl&&e==="rtl"||!i.rtl&&e==="ltr"||(i.rtl=e==="rtl",i.rtlTranslate=i.params.direction==="horizontal"&&i.rtl,i.rtl?(i.el.classList.add(`${i.params.containerModifierClass}rtl`),i.el.dir="rtl"):(i.el.classList.remove(`${i.params.containerModifierClass}rtl`),i.el.dir="ltr"),i.update())}mount(e){const i=this;if(i.mounted)return!0;let t=e||i.params.el;if(typeof t=="string"&&(t=document.querySelector(t)),!t)return!1;t.swiper=i,t.parentNode&&t.parentNode.host&&t.parentNode.host.nodeName===i.params.swiperElementNodeName.toUpperCase()&&(i.isElement=!0);const r=()=>`.${(i.params.wrapperClass||"").trim().split(" ").join(".")}`;let f=t&&t.shadowRoot&&t.shadowRoot.querySelector?t.shadowRoot.querySelector(r()):Q(t,r())[0];return!f&&i.params.createElements&&(f=oe("div",i.params.wrapperClass),t.append(f),Q(t,`.${i.params.slideClass}`).forEach(c=>{f.append(c)})),Object.assign(i,{el:t,wrapperEl:f,slidesEl:i.isElement&&!t.parentNode.host.slideSlots?t.parentNode.host:f,hostEl:i.isElement?t.parentNode.host:t,mounted:!0,rtl:t.dir.toLowerCase()==="rtl"||be(t,"direction")==="rtl",rtlTranslate:i.params.direction==="horizontal"&&(t.dir.toLowerCase()==="rtl"||be(t,"direction")==="rtl"),wrongRTL:be(f,"display")==="-webkit-box"}),!0}init(e){const i=this;if(i.initialized||i.mount(e)===!1)return i;i.emit("beforeInit"),i.params.breakpoints&&i.setBreakpoint(),i.addClasses(),i.updateSize(),i.updateSlides(),i.params.watchOverflow&&i.checkOverflow(),i.params.grabCursor&&i.enabled&&i.setGrabCursor(),i.params.loop&&i.virtual&&i.params.virtual.enabled?i.slideTo(i.params.initialSlide+i.virtual.slidesBefore,0,i.params.runCallbacksOnInit,!1,!0):i.slideTo(i.params.initialSlide,0,i.params.runCallbacksOnInit,!1,!0),i.params.loop&&i.loopCreate(void 0,!0),i.attachEvents();const r=[...i.el.querySelectorAll('[loading="lazy"]')];return i.isElement&&r.push(...i.hostEl.querySelectorAll('[loading="lazy"]')),r.forEach(n=>{n.complete?Ke(i,n):n.addEventListener("load",f=>{Ke(i,f.target)})}),Mt(i),i.initialized=!0,Mt(i),i.emit("init"),i.emit("afterInit"),i}destroy(e,i){e===void 0&&(e=!0),i===void 0&&(i=!0);const t=this,{params:r,el:n,wrapperEl:f,slides:c}=t;return typeof t.params>"u"||t.destroyed||(t.emit("beforeDestroy"),t.initialized=!1,t.detachEvents(),r.loop&&t.loopDestroy(),i&&(t.removeClasses(),n&&typeof n!="string"&&n.removeAttribute("style"),f&&f.removeAttribute("style"),c&&c.length&&c.forEach(d=>{d.classList.remove(r.slideVisibleClass,r.slideFullyVisibleClass,r.slideActiveClass,r.slideNextClass,r.slidePrevClass),d.removeAttribute("style"),d.removeAttribute("data-swiper-slide-index")})),t.emit("destroy"),Object.keys(t.eventsListeners).forEach(d=>{t.off(d)}),e!==!1&&(t.el&&typeof t.el!="string"&&(t.el.swiper=null),ui(t)),t.destroyed=!0),null}static extendDefaults(e){ae(xt,e)}static get extendedDefaults(){return xt}static get defaults(){return Ct}static installModule(e){ne.prototype.__modules__||(ne.prototype.__modules__=[]);const i=ne.prototype.__modules__;typeof e=="function"&&i.indexOf(e)<0&&i.push(e)}static use(e){return Array.isArray(e)?(e.forEach(i=>ne.installModule(i)),ne):(ne.installModule(e),ne)}}Object.keys(St).forEach(s=>{Object.keys(St[s]).forEach(e=>{ne.prototype[e]=St[s][e]})});ne.use([Ei,Ti]);function Is(s){let{swiper:e,extendParams:i,on:t,emit:r}=s;i({virtual:{enabled:!1,slides:[],cache:!0,renderSlide:null,renderExternal:null,renderExternalUpdate:!0,addSlidesBefore:0,addSlidesAfter:0}});let n;const f=Z();e.virtual={cache:{},from:void 0,to:void 0,slides:[],offset:0,slidesGrid:[]};const c=f.createElement("div");function d(a,l){const h=e.params.virtual;if(h.cache&&e.virtual.cache[l])return e.virtual.cache[l];let b;return h.renderSlide?(b=h.renderSlide.call(e,a,l),typeof b=="string"&&(de(c,b),b=c.children[0])):e.isElement?b=oe("swiper-slide"):b=oe("div",e.params.slideClass),b.setAttribute("data-swiper-slide-index",l),h.renderSlide||de(b,a),h.cache&&(e.virtual.cache[l]=b),b}function o(a,l,h){const{slidesPerView:b,slidesPerGroup:g,centeredSlides:m,loop:y,initialSlide:E}=e.params;if(l&&!y&&E>0)return;const{addSlidesBefore:k,addSlidesAfter:_}=e.params.virtual,{from:I,to:S,slides:T,slidesGrid:z,offset:P}=e.virtual;e.params.cssMode||e.updateActiveIndex();const C=typeof h>"u"?e.activeIndex||0:h;let L;e.rtlTranslate?L="right":L=e.isHorizontal()?"left":"top";let j,O;m?(j=Math.floor(b/2)+g+_,O=Math.floor(b/2)+g+k):(j=b+(g-1)+_,O=(y?b:g)+k);let x=C-O,M=C+j;y||(x=Math.max(x,0),M=Math.min(M,T.length-1));let B=(e.slidesGrid[x]||0)-(e.slidesGrid[0]||0);y&&C>=O?(x-=O,m||(B+=e.slidesGrid[0])):y&&C<O&&(x=-O,m&&(B+=e.slidesGrid[0])),Object.assign(e.virtual,{from:x,to:M,offset:B,slidesGrid:e.slidesGrid,slidesBefore:O,slidesAfter:j});function N(){e.updateSlides(),e.updateProgress(),e.updateSlidesClasses(),r("virtualUpdate")}if(I===x&&S===M&&!a){e.slidesGrid!==z&&B!==P&&e.slides.forEach(A=>{A.style[L]=`${B-Math.abs(e.cssOverflowAdjustment())}px`}),e.updateProgress(),r("virtualUpdate");return}if(e.params.virtual.renderExternal){e.params.virtual.renderExternal.call(e,{offset:B,from:x,to:M,slides:function(){const V=[];for(let F=x;F<=M;F+=1)V.push(T[F]);return V}()}),e.params.virtual.renderExternalUpdate?N():r("virtualUpdate");return}const q=[],U=[],fe=A=>{let V=A;return A<0?V=T.length+A:V>=T.length&&(V=V-T.length),V};if(a)e.slides.filter(A=>A.matches(`.${e.params.slideClass}, swiper-slide`)).forEach(A=>{A.remove()});else for(let A=I;A<=S;A+=1)if(A<x||A>M){const V=fe(A);e.slides.filter(F=>F.matches(`.${e.params.slideClass}[data-swiper-slide-index="${V}"], swiper-slide[data-swiper-slide-index="${V}"]`)).forEach(F=>{F.remove()})}const ze=y?-T.length:0,D=y?T.length*2:T.length;for(let A=ze;A<D;A+=1)if(A>=x&&A<=M){const V=fe(A);typeof S>"u"||a?U.push(V):(A>S&&U.push(V),A<I&&q.push(V))}if(U.forEach(A=>{e.slidesEl.append(d(T[A],A))}),y)for(let A=q.length-1;A>=0;A-=1){const V=q[A];e.slidesEl.prepend(d(T[V],V))}else q.sort((A,V)=>V-A),q.forEach(A=>{e.slidesEl.prepend(d(T[A],A))});Q(e.slidesEl,".swiper-slide, swiper-slide").forEach(A=>{A.style[L]=`${B-Math.abs(e.cssOverflowAdjustment())}px`}),N()}function p(a){if(typeof a=="object"&&"length"in a)for(let l=0;l<a.length;l+=1)a[l]&&e.virtual.slides.push(a[l]);else e.virtual.slides.push(a);o(!0)}function u(a){const l=e.activeIndex;let h=l+1,b=1;if(Array.isArray(a)){for(let g=0;g<a.length;g+=1)a[g]&&e.virtual.slides.unshift(a[g]);h=l+a.length,b=a.length}else e.virtual.slides.unshift(a);if(e.params.virtual.cache){const g=e.virtual.cache,m={};Object.keys(g).forEach(y=>{const E=g[y],k=E.getAttribute("data-swiper-slide-index");k&&E.setAttribute("data-swiper-slide-index",parseInt(k,10)+b),m[parseInt(y,10)+b]=E}),e.virtual.cache=m}o(!0),e.slideTo(h,0)}function v(a){if(typeof a>"u"||a===null)return;let l=e.activeIndex;if(Array.isArray(a))for(let h=a.length-1;h>=0;h-=1)e.params.virtual.cache&&(delete e.virtual.cache[a[h]],Object.keys(e.virtual.cache).forEach(b=>{b>a&&(e.virtual.cache[b-1]=e.virtual.cache[b],e.virtual.cache[b-1].setAttribute("data-swiper-slide-index",b-1),delete e.virtual.cache[b])})),e.virtual.slides.splice(a[h],1),a[h]<l&&(l-=1),l=Math.max(l,0);else e.params.virtual.cache&&(delete e.virtual.cache[a],Object.keys(e.virtual.cache).forEach(h=>{h>a&&(e.virtual.cache[h-1]=e.virtual.cache[h],e.virtual.cache[h-1].setAttribute("data-swiper-slide-index",h-1),delete e.virtual.cache[h])})),e.virtual.slides.splice(a,1),a<l&&(l-=1),l=Math.max(l,0);o(!0),e.slideTo(l,0)}function w(){e.virtual.slides=[],e.params.virtual.cache&&(e.virtual.cache={}),o(!0),e.slideTo(0,0)}t("beforeInit",()=>{if(!e.params.virtual.enabled)return;let a;if(typeof e.passedParams.virtual.slides>"u"){const l=[...e.slidesEl.children].filter(h=>h.matches(`.${e.params.slideClass}, swiper-slide`));l&&l.length&&(e.virtual.slides=[...l],a=!0,l.forEach((h,b)=>{h.setAttribute("data-swiper-slide-index",b),e.virtual.cache[b]=h,h.remove()}))}a||(e.virtual.slides=e.params.virtual.slides),e.classNames.push(`${e.params.containerModifierClass}virtual`),e.params.watchSlidesProgress=!0,e.originalParams.watchSlidesProgress=!0,o(!1,!0)}),t("setTranslate",()=>{e.params.virtual.enabled&&(e.params.cssMode&&!e._immediateVirtual?(clearTimeout(n),n=setTimeout(()=>{o()},100)):o())}),t("init update resize",()=>{e.params.virtual.enabled&&e.params.cssMode&&Oe(e.wrapperEl,"--swiper-virtual-size",`${e.virtualSize}px`)}),Object.assign(e.virtual,{appendSlide:p,prependSlide:u,removeSlide:v,removeAllSlides:w,update:o})}function zs(s){let{swiper:e,extendParams:i,on:t,emit:r}=s;const n=Z(),f=W();e.keyboard={enabled:!1},i({keyboard:{enabled:!1,onlyInViewport:!0,pageUpDown:!0}});function c(p){if(!e.enabled)return;const{rtlTranslate:u}=e;let v=p;v.originalEvent&&(v=v.originalEvent);const w=v.keyCode||v.charCode,a=e.params.keyboard.pageUpDown,l=a&&w===33,h=a&&w===34,b=w===37,g=w===39,m=w===38,y=w===40;if(!e.allowSlideNext&&(e.isHorizontal()&&g||e.isVertical()&&y||h)||!e.allowSlidePrev&&(e.isHorizontal()&&b||e.isVertical()&&m||l))return!1;if(!(v.shiftKey||v.altKey||v.ctrlKey||v.metaKey)&&!(n.activeElement&&n.activeElement.nodeName&&(n.activeElement.nodeName.toLowerCase()==="input"||n.activeElement.nodeName.toLowerCase()==="textarea"))){if(e.params.keyboard.onlyInViewport&&(l||h||b||g||m||y)){let E=!1;if(ye(e.el,`.${e.params.slideClass}, swiper-slide`).length>0&&ye(e.el,`.${e.params.slideActiveClass}`).length===0)return;const k=e.el,_=k.clientWidth,I=k.clientHeight,S=f.innerWidth,T=f.innerHeight,z=Je(k);u&&(z.left-=k.scrollLeft);const P=[[z.left,z.top],[z.left+_,z.top],[z.left,z.top+I],[z.left+_,z.top+I]];for(let C=0;C<P.length;C+=1){const L=P[C];if(L[0]>=0&&L[0]<=S&&L[1]>=0&&L[1]<=T){if(L[0]===0&&L[1]===0)continue;E=!0}}if(!E)return}e.isHorizontal()?((l||h||b||g)&&(v.preventDefault?v.preventDefault():v.returnValue=!1),((h||g)&&!u||(l||b)&&u)&&e.slideNext(),((l||b)&&!u||(h||g)&&u)&&e.slidePrev()):((l||h||m||y)&&(v.preventDefault?v.preventDefault():v.returnValue=!1),(h||y)&&e.slideNext(),(l||m)&&e.slidePrev()),r("keyPress",w)}}function d(){e.keyboard.enabled||(n.addEventListener("keydown",c),e.keyboard.enabled=!0)}function o(){e.keyboard.enabled&&(n.removeEventListener("keydown",c),e.keyboard.enabled=!1)}t("init",()=>{e.params.keyboard.enabled&&d()}),t("destroy",()=>{e.keyboard.enabled&&o()}),Object.assign(e.keyboard,{enable:d,disable:o})}function Ls(s){let{swiper:e,extendParams:i,on:t,emit:r}=s;const n=W();i({mousewheel:{enabled:!1,releaseOnEdges:!1,invert:!1,forceToAxis:!1,sensitivity:1,eventsTarget:"container",thresholdDelta:null,thresholdTime:null,noMousewheelClass:"swiper-no-mousewheel"}}),e.mousewheel={enabled:!1};let f,c=le(),d;const o=[];function p(m){let _=0,I=0,S=0,T=0;return"detail"in m&&(I=m.detail),"wheelDelta"in m&&(I=-m.wheelDelta/120),"wheelDeltaY"in m&&(I=-m.wheelDeltaY/120),"wheelDeltaX"in m&&(_=-m.wheelDeltaX/120),"axis"in m&&m.axis===m.HORIZONTAL_AXIS&&(_=I,I=0),S=_*10,T=I*10,"deltaY"in m&&(T=m.deltaY),"deltaX"in m&&(S=m.deltaX),m.shiftKey&&!S&&(S=T,T=0),(S||T)&&m.deltaMode&&(m.deltaMode===1?(S*=40,T*=40):(S*=800,T*=800)),S&&!_&&(_=S<1?-1:1),T&&!I&&(I=T<1?-1:1),{spinX:_,spinY:I,pixelX:S,pixelY:T}}function u(){e.enabled&&(e.mouseEntered=!0)}function v(){e.enabled&&(e.mouseEntered=!1)}function w(m){return e.params.mousewheel.thresholdDelta&&m.delta<e.params.mousewheel.thresholdDelta||e.params.mousewheel.thresholdTime&&le()-c<e.params.mousewheel.thresholdTime?!1:m.delta>=6&&le()-c<60?!0:(m.direction<0?(!e.isEnd||e.params.loop)&&!e.animating&&(e.slideNext(),r("scroll",m.raw)):(!e.isBeginning||e.params.loop)&&!e.animating&&(e.slidePrev(),r("scroll",m.raw)),c=new n.Date().getTime(),!1)}function a(m){const y=e.params.mousewheel;if(m.direction<0){if(e.isEnd&&!e.params.loop&&y.releaseOnEdges)return!0}else if(e.isBeginning&&!e.params.loop&&y.releaseOnEdges)return!0;return!1}function l(m){let y=m,E=!0;if(!e.enabled||m.target.closest(`.${e.params.mousewheel.noMousewheelClass}`))return;const k=e.params.mousewheel;e.params.cssMode&&y.preventDefault();let _=e.el;e.params.mousewheel.eventsTarget!=="container"&&(_=document.querySelector(e.params.mousewheel.eventsTarget));const I=_&&_.contains(y.target);if(!e.mouseEntered&&!I&&!k.releaseOnEdges)return!0;y.originalEvent&&(y=y.originalEvent);let S=0;const T=e.rtlTranslate?-1:1,z=p(y);if(k.forceToAxis)if(e.isHorizontal())if(Math.abs(z.pixelX)>Math.abs(z.pixelY))S=-z.pixelX*T;else return!0;else if(Math.abs(z.pixelY)>Math.abs(z.pixelX))S=-z.pixelY;else return!0;else S=Math.abs(z.pixelX)>Math.abs(z.pixelY)?-z.pixelX*T:-z.pixelY;if(S===0)return!0;k.invert&&(S=-S);let P=e.getTranslate()+S*k.sensitivity;if(P>=e.minTranslate()&&(P=e.minTranslate()),P<=e.maxTranslate()&&(P=e.maxTranslate()),E=e.params.loop?!0:!(P===e.minTranslate()||P===e.maxTranslate()),E&&e.params.nested&&y.stopPropagation(),!e.params.freeMode||!e.params.freeMode.enabled){const C={time:le(),delta:Math.abs(S),direction:Math.sign(S),raw:m};o.length>=2&&o.shift();const L=o.length?o[o.length-1]:void 0;if(o.push(C),L?(C.direction!==L.direction||C.delta>L.delta||C.time>L.time+150)&&w(C):w(C),a(C))return!0}else{const C={time:le(),delta:Math.abs(S),direction:Math.sign(S)},L=d&&C.time<d.time+500&&C.delta<=d.delta&&C.direction===d.direction;if(!L){d=void 0;let j=e.getTranslate()+S*k.sensitivity;const O=e.isBeginning,x=e.isEnd;if(j>=e.minTranslate()&&(j=e.minTranslate()),j<=e.maxTranslate()&&(j=e.maxTranslate()),e.setTransition(0),e.setTranslate(j),e.updateProgress(),e.updateActiveIndex(),e.updateSlidesClasses(),(!O&&e.isBeginning||!x&&e.isEnd)&&e.updateSlidesClasses(),e.params.loop&&e.loopFix({direction:C.direction<0?"next":"prev",byMousewheel:!0}),e.params.freeMode.sticky){clearTimeout(f),f=void 0,o.length>=15&&o.shift();const M=o.length?o[o.length-1]:void 0,B=o[0];if(o.push(C),M&&(C.delta>M.delta||C.direction!==M.direction))o.splice(0);else if(o.length>=15&&C.time-B.time<500&&B.delta-C.delta>=1&&C.delta<=6){const N=S>0?.8:.2;d=C,o.splice(0),f=Se(()=>{e.destroyed||!e.params||e.slideToClosest(e.params.speed,!0,void 0,N)},0)}f||(f=Se(()=>{if(e.destroyed||!e.params)return;const N=.5;d=C,o.splice(0),e.slideToClosest(e.params.speed,!0,void 0,N)},500))}if(L||r("scroll",y),e.params.autoplay&&e.params.autoplay.disableOnInteraction&&e.autoplay.stop(),k.releaseOnEdges&&(j===e.minTranslate()||j===e.maxTranslate()))return!0}}return y.preventDefault?y.preventDefault():y.returnValue=!1,!1}function h(m){let y=e.el;e.params.mousewheel.eventsTarget!=="container"&&(y=document.querySelector(e.params.mousewheel.eventsTarget)),y[m]("mouseenter",u),y[m]("mouseleave",v),y[m]("wheel",l)}function b(){return e.params.cssMode?(e.wrapperEl.removeEventListener("wheel",l),!0):e.mousewheel.enabled?!1:(h("addEventListener"),e.mousewheel.enabled=!0,!0)}function g(){return e.params.cssMode?(e.wrapperEl.addEventListener(event,l),!0):e.mousewheel.enabled?(h("removeEventListener"),e.mousewheel.enabled=!1,!0):!1}t("init",()=>{!e.params.mousewheel.enabled&&e.params.cssMode&&g(),e.params.mousewheel.enabled&&b()}),t("destroy",()=>{e.params.cssMode&&b(),e.mousewheel.enabled&&g()}),Object.assign(e.mousewheel,{enable:b,disable:g})}function Lt(s,e,i,t){return s.params.createElements&&Object.keys(t).forEach(r=>{if(!i[r]&&i.auto===!0){let n=Q(s.el,`.${t[r]}`)[0];n||(n=oe("div",t[r]),n.className=t[r],s.el.append(n)),i[r]=n,e[r]=n}}),i}function ks(s){let{swiper:e,extendParams:i,on:t,emit:r}=s;i({navigation:{nextEl:null,prevEl:null,hideOnClick:!1,disabledClass:"swiper-button-disabled",hiddenClass:"swiper-button-hidden",lockClass:"swiper-button-lock",navigationDisabledClass:"swiper-navigation-disabled"}}),e.navigation={nextEl:null,prevEl:null};function n(a){let l;return a&&typeof a=="string"&&e.isElement&&(l=e.el.querySelector(a)||e.hostEl.querySelector(a),l)?l:(a&&(typeof a=="string"&&(l=[...document.querySelectorAll(a)]),e.params.uniqueNavElements&&typeof a=="string"&&l&&l.length>1&&e.el.querySelectorAll(a).length===1?l=e.el.querySelector(a):l&&l.length===1&&(l=l[0])),a&&!l?a:l)}function f(a,l){const h=e.params.navigation;a=Y(a),a.forEach(b=>{b&&(b.classList[l?"add":"remove"](...h.disabledClass.split(" ")),b.tagName==="BUTTON"&&(b.disabled=l),e.params.watchOverflow&&e.enabled&&b.classList[e.isLocked?"add":"remove"](h.lockClass))})}function c(){const{nextEl:a,prevEl:l}=e.navigation;if(e.params.loop){f(l,!1),f(a,!1);return}f(l,e.isBeginning&&!e.params.rewind),f(a,e.isEnd&&!e.params.rewind)}function d(a){a.preventDefault(),!(e.isBeginning&&!e.params.loop&&!e.params.rewind)&&(e.slidePrev(),r("navigationPrev"))}function o(a){a.preventDefault(),!(e.isEnd&&!e.params.loop&&!e.params.rewind)&&(e.slideNext(),r("navigationNext"))}function p(){const a=e.params.navigation;if(e.params.navigation=Lt(e,e.originalParams.navigation,e.params.navigation,{nextEl:"swiper-button-next",prevEl:"swiper-button-prev"}),!(a.nextEl||a.prevEl))return;let l=n(a.nextEl),h=n(a.prevEl);Object.assign(e.navigation,{nextEl:l,prevEl:h}),l=Y(l),h=Y(h);const b=(g,m)=>{g&&g.addEventListener("click",m==="next"?o:d),!e.enabled&&g&&g.classList.add(...a.lockClass.split(" "))};l.forEach(g=>b(g,"next")),h.forEach(g=>b(g,"prev"))}function u(){let{nextEl:a,prevEl:l}=e.navigation;a=Y(a),l=Y(l);const h=(b,g)=>{b.removeEventListener("click",g==="next"?o:d),b.classList.remove(...e.params.navigation.disabledClass.split(" "))};a.forEach(b=>h(b,"next")),l.forEach(b=>h(b,"prev"))}t("init",()=>{e.params.navigation.enabled===!1?w():(p(),c())}),t("toEdge fromEdge lock unlock",()=>{c()}),t("destroy",()=>{u()}),t("enable disable",()=>{let{nextEl:a,prevEl:l}=e.navigation;if(a=Y(a),l=Y(l),e.enabled){c();return}[...a,...l].filter(h=>!!h).forEach(h=>h.classList.add(e.params.navigation.lockClass))}),t("click",(a,l)=>{let{nextEl:h,prevEl:b}=e.navigation;h=Y(h),b=Y(b);const g=l.target;let m=b.includes(g)||h.includes(g);if(e.isElement&&!m){const y=l.path||l.composedPath&&l.composedPath();y&&(m=y.find(E=>h.includes(E)||b.includes(E)))}if(e.params.navigation.hideOnClick&&!m){if(e.pagination&&e.params.pagination&&e.params.pagination.clickable&&(e.pagination.el===g||e.pagination.el.contains(g)))return;let y;h.length?y=h[0].classList.contains(e.params.navigation.hiddenClass):b.length&&(y=b[0].classList.contains(e.params.navigation.hiddenClass)),r(y===!0?"navigationShow":"navigationHide"),[...h,...b].filter(E=>!!E).forEach(E=>E.classList.toggle(e.params.navigation.hiddenClass))}});const v=()=>{e.el.classList.remove(...e.params.navigation.navigationDisabledClass.split(" ")),p(),c()},w=()=>{e.el.classList.add(...e.params.navigation.navigationDisabledClass.split(" ")),u()};Object.assign(e.navigation,{enable:v,disable:w,update:c,init:p,destroy:u})}function me(s){return s===void 0&&(s=""),`.${s.trim().replace(/([\.:!+\/])/g,"\\$1").replace(/ /g,".")}`}function $s(s){let{swiper:e,extendParams:i,on:t,emit:r}=s;const n="swiper-pagination";i({pagination:{el:null,bulletElement:"span",clickable:!1,hideOnClick:!1,renderBullet:null,renderProgressbar:null,renderFraction:null,renderCustom:null,progressbarOpposite:!1,type:"bullets",dynamicBullets:!1,dynamicMainBullets:1,formatFractionCurrent:g=>g,formatFractionTotal:g=>g,bulletClass:`${n}-bullet`,bulletActiveClass:`${n}-bullet-active`,modifierClass:`${n}-`,currentClass:`${n}-current`,totalClass:`${n}-total`,hiddenClass:`${n}-hidden`,progressbarFillClass:`${n}-progressbar-fill`,progressbarOppositeClass:`${n}-progressbar-opposite`,clickableClass:`${n}-clickable`,lockClass:`${n}-lock`,horizontalClass:`${n}-horizontal`,verticalClass:`${n}-vertical`,paginationDisabledClass:`${n}-disabled`}}),e.pagination={el:null,bullets:[]};let f,c=0;function d(){return!e.params.pagination.el||!e.pagination.el||Array.isArray(e.pagination.el)&&e.pagination.el.length===0}function o(g,m){const{bulletActiveClass:y}=e.params.pagination;g&&(g=g[`${m==="prev"?"previous":"next"}ElementSibling`],g&&(g.classList.add(`${y}-${m}`),g=g[`${m==="prev"?"previous":"next"}ElementSibling`],g&&g.classList.add(`${y}-${m}-${m}`)))}function p(g,m,y){if(g=g%y,m=m%y,m===g+1)return"next";if(m===g-1)return"previous"}function u(g){const m=g.target.closest(me(e.params.pagination.bulletClass));if(!m)return;g.preventDefault();const y=Re(m)*e.params.slidesPerGroup;if(e.params.loop){if(e.realIndex===y)return;const E=p(e.realIndex,y,e.slides.length);E==="next"?e.slideNext():E==="previous"?e.slidePrev():e.slideToLoop(y)}else e.slideTo(y)}function v(){const g=e.rtl,m=e.params.pagination;if(d())return;let y=e.pagination.el;y=Y(y);let E,k;const _=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:e.slides.length,I=e.params.loop?Math.ceil(_/e.params.slidesPerGroup):e.snapGrid.length;if(e.params.loop?(k=e.previousRealIndex||0,E=e.params.slidesPerGroup>1?Math.floor(e.realIndex/e.params.slidesPerGroup):e.realIndex):typeof e.snapIndex<"u"?(E=e.snapIndex,k=e.previousSnapIndex):(k=e.previousIndex||0,E=e.activeIndex||0),m.type==="bullets"&&e.pagination.bullets&&e.pagination.bullets.length>0){const S=e.pagination.bullets;let T,z,P;if(m.dynamicBullets&&(f=Tt(S[0],e.isHorizontal()?"width":"height"),y.forEach(C=>{C.style[e.isHorizontal()?"width":"height"]=`${f*(m.dynamicMainBullets+4)}px`}),m.dynamicMainBullets>1&&k!==void 0&&(c+=E-(k||0),c>m.dynamicMainBullets-1?c=m.dynamicMainBullets-1:c<0&&(c=0)),T=Math.max(E-c,0),z=T+(Math.min(S.length,m.dynamicMainBullets)-1),P=(z+T)/2),S.forEach(C=>{const L=[...["","-next","-next-next","-prev","-prev-prev","-main"].map(j=>`${m.bulletActiveClass}${j}`)].map(j=>typeof j=="string"&&j.includes(" ")?j.split(" "):j).flat();C.classList.remove(...L)}),y.length>1)S.forEach(C=>{const L=Re(C);L===E?C.classList.add(...m.bulletActiveClass.split(" ")):e.isElement&&C.setAttribute("part","bullet"),m.dynamicBullets&&(L>=T&&L<=z&&C.classList.add(...`${m.bulletActiveClass}-main`.split(" ")),L===T&&o(C,"prev"),L===z&&o(C,"next"))});else{const C=S[E];if(C&&C.classList.add(...m.bulletActiveClass.split(" ")),e.isElement&&S.forEach((L,j)=>{L.setAttribute("part",j===E?"bullet-active":"bullet")}),m.dynamicBullets){const L=S[T],j=S[z];for(let O=T;O<=z;O+=1)S[O]&&S[O].classList.add(...`${m.bulletActiveClass}-main`.split(" "));o(L,"prev"),o(j,"next")}}if(m.dynamicBullets){const C=Math.min(S.length,m.dynamicMainBullets+4),L=(f*C-f)/2-P*f,j=g?"right":"left";S.forEach(O=>{O.style[e.isHorizontal()?j:"top"]=`${L}px`})}}y.forEach((S,T)=>{if(m.type==="fraction"&&(S.querySelectorAll(me(m.currentClass)).forEach(z=>{z.textContent=m.formatFractionCurrent(E+1)}),S.querySelectorAll(me(m.totalClass)).forEach(z=>{z.textContent=m.formatFractionTotal(I)})),m.type==="progressbar"){let z;m.progressbarOpposite?z=e.isHorizontal()?"vertical":"horizontal":z=e.isHorizontal()?"horizontal":"vertical";const P=(E+1)/I;let C=1,L=1;z==="horizontal"?C=P:L=P,S.querySelectorAll(me(m.progressbarFillClass)).forEach(j=>{j.style.transform=`translate3d(0,0,0) scaleX(${C}) scaleY(${L})`,j.style.transitionDuration=`${e.params.speed}ms`})}m.type==="custom"&&m.renderCustom?(de(S,m.renderCustom(e,E+1,I)),T===0&&r("paginationRender",S)):(T===0&&r("paginationRender",S),r("paginationUpdate",S)),e.params.watchOverflow&&e.enabled&&S.classList[e.isLocked?"add":"remove"](m.lockClass)})}function w(){const g=e.params.pagination;if(d())return;const m=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:e.grid&&e.params.grid.rows>1?e.slides.length/Math.ceil(e.params.grid.rows):e.slides.length;let y=e.pagination.el;y=Y(y);let E="";if(g.type==="bullets"){let k=e.params.loop?Math.ceil(m/e.params.slidesPerGroup):e.snapGrid.length;e.params.freeMode&&e.params.freeMode.enabled&&k>m&&(k=m);for(let _=0;_<k;_+=1)g.renderBullet?E+=g.renderBullet.call(e,_,g.bulletClass):E+=`<${g.bulletElement} ${e.isElement?'part="bullet"':""} class="${g.bulletClass}"></${g.bulletElement}>`}g.type==="fraction"&&(g.renderFraction?E=g.renderFraction.call(e,g.currentClass,g.totalClass):E=`<span class="${g.currentClass}"></span> / <span class="${g.totalClass}"></span>`),g.type==="progressbar"&&(g.renderProgressbar?E=g.renderProgressbar.call(e,g.progressbarFillClass):E=`<span class="${g.progressbarFillClass}"></span>`),e.pagination.bullets=[],y.forEach(k=>{g.type!=="custom"&&de(k,E||""),g.type==="bullets"&&e.pagination.bullets.push(...k.querySelectorAll(me(g.bulletClass)))}),g.type!=="custom"&&r("paginationRender",y[0])}function a(){e.params.pagination=Lt(e,e.originalParams.pagination,e.params.pagination,{el:"swiper-pagination"});const g=e.params.pagination;if(!g.el)return;let m;typeof g.el=="string"&&e.isElement&&(m=e.el.querySelector(g.el)),!m&&typeof g.el=="string"&&(m=[...document.querySelectorAll(g.el)]),m||(m=g.el),!(!m||m.length===0)&&(e.params.uniqueNavElements&&typeof g.el=="string"&&Array.isArray(m)&&m.length>1&&(m=[...e.el.querySelectorAll(g.el)],m.length>1&&(m=m.find(y=>ye(y,".swiper")[0]===e.el))),Array.isArray(m)&&m.length===1&&(m=m[0]),Object.assign(e.pagination,{el:m}),m=Y(m),m.forEach(y=>{g.type==="bullets"&&g.clickable&&y.classList.add(...(g.clickableClass||"").split(" ")),y.classList.add(g.modifierClass+g.type),y.classList.add(e.isHorizontal()?g.horizontalClass:g.verticalClass),g.type==="bullets"&&g.dynamicBullets&&(y.classList.add(`${g.modifierClass}${g.type}-dynamic`),c=0,g.dynamicMainBullets<1&&(g.dynamicMainBullets=1)),g.type==="progressbar"&&g.progressbarOpposite&&y.classList.add(g.progressbarOppositeClass),g.clickable&&y.addEventListener("click",u),e.enabled||y.classList.add(g.lockClass)}))}function l(){const g=e.params.pagination;if(d())return;let m=e.pagination.el;m&&(m=Y(m),m.forEach(y=>{y.classList.remove(g.hiddenClass),y.classList.remove(g.modifierClass+g.type),y.classList.remove(e.isHorizontal()?g.horizontalClass:g.verticalClass),g.clickable&&(y.classList.remove(...(g.clickableClass||"").split(" ")),y.removeEventListener("click",u))})),e.pagination.bullets&&e.pagination.bullets.forEach(y=>y.classList.remove(...g.bulletActiveClass.split(" ")))}t("changeDirection",()=>{if(!e.pagination||!e.pagination.el)return;const g=e.params.pagination;let{el:m}=e.pagination;m=Y(m),m.forEach(y=>{y.classList.remove(g.horizontalClass,g.verticalClass),y.classList.add(e.isHorizontal()?g.horizontalClass:g.verticalClass)})}),t("init",()=>{e.params.pagination.enabled===!1?b():(a(),w(),v())}),t("activeIndexChange",()=>{typeof e.snapIndex>"u"&&v()}),t("snapIndexChange",()=>{v()}),t("snapGridLengthChange",()=>{w(),v()}),t("destroy",()=>{l()}),t("enable disable",()=>{let{el:g}=e.pagination;g&&(g=Y(g),g.forEach(m=>m.classList[e.enabled?"remove":"add"](e.params.pagination.lockClass)))}),t("lock unlock",()=>{v()}),t("click",(g,m)=>{const y=m.target,E=Y(e.pagination.el);if(e.params.pagination.el&&e.params.pagination.hideOnClick&&E&&E.length>0&&!y.classList.contains(e.params.pagination.bulletClass)){if(e.navigation&&(e.navigation.nextEl&&y===e.navigation.nextEl||e.navigation.prevEl&&y===e.navigation.prevEl))return;const k=E[0].classList.contains(e.params.pagination.hiddenClass);r(k===!0?"paginationShow":"paginationHide"),E.forEach(_=>_.classList.toggle(e.params.pagination.hiddenClass))}});const h=()=>{e.el.classList.remove(e.params.pagination.paginationDisabledClass);let{el:g}=e.pagination;g&&(g=Y(g),g.forEach(m=>m.classList.remove(e.params.pagination.paginationDisabledClass))),a(),w(),v()},b=()=>{e.el.classList.add(e.params.pagination.paginationDisabledClass);let{el:g}=e.pagination;g&&(g=Y(g),g.forEach(m=>m.classList.add(e.params.pagination.paginationDisabledClass))),l()};Object.assign(e.pagination,{enable:h,disable:b,render:w,update:v,init:a,destroy:l})}function As(s){let{swiper:e,extendParams:i,on:t,emit:r}=s;const n=Z();let f=!1,c=null,d=null,o,p,u,v;i({scrollbar:{el:null,dragSize:"auto",hide:!1,draggable:!1,snapOnRelease:!0,lockClass:"swiper-scrollbar-lock",dragClass:"swiper-scrollbar-drag",scrollbarDisabledClass:"swiper-scrollbar-disabled",horizontalClass:"swiper-scrollbar-horizontal",verticalClass:"swiper-scrollbar-vertical"}}),e.scrollbar={el:null,dragEl:null};function w(){if(!e.params.scrollbar.el||!e.scrollbar.el)return;const{scrollbar:P,rtlTranslate:C}=e,{dragEl:L,el:j}=P,O=e.params.scrollbar,x=e.params.loop?e.progressLoop:e.progress;let M=p,B=(u-p)*x;C?(B=-B,B>0?(M=p-B,B=0):-B+p>u&&(M=u+B)):B<0?(M=p+B,B=0):B+p>u&&(M=u-B),e.isHorizontal()?(L.style.transform=`translate3d(${B}px, 0, 0)`,L.style.width=`${M}px`):(L.style.transform=`translate3d(0px, ${B}px, 0)`,L.style.height=`${M}px`),O.hide&&(clearTimeout(c),j.style.opacity=1,c=setTimeout(()=>{j.style.opacity=0,j.style.transitionDuration="400ms"},1e3))}function a(P){!e.params.scrollbar.el||!e.scrollbar.el||(e.scrollbar.dragEl.style.transitionDuration=`${P}ms`)}function l(){if(!e.params.scrollbar.el||!e.scrollbar.el)return;const{scrollbar:P}=e,{dragEl:C,el:L}=P;C.style.width="",C.style.height="",u=e.isHorizontal()?L.offsetWidth:L.offsetHeight,v=e.size/(e.virtualSize+e.params.slidesOffsetBefore-(e.params.centeredSlides?e.snapGrid[0]:0)),e.params.scrollbar.dragSize==="auto"?p=u*v:p=parseInt(e.params.scrollbar.dragSize,10),e.isHorizontal()?C.style.width=`${p}px`:C.style.height=`${p}px`,v>=1?L.style.display="none":L.style.display="",e.params.scrollbar.hide&&(L.style.opacity=0),e.params.watchOverflow&&e.enabled&&P.el.classList[e.isLocked?"add":"remove"](e.params.scrollbar.lockClass)}function h(P){return e.isHorizontal()?P.clientX:P.clientY}function b(P){const{scrollbar:C,rtlTranslate:L}=e,{el:j}=C;let O;O=(h(P)-Je(j)[e.isHorizontal()?"left":"top"]-(o!==null?o:p/2))/(u-p),O=Math.max(Math.min(O,1),0),L&&(O=1-O);const x=e.minTranslate()+(e.maxTranslate()-e.minTranslate())*O;e.updateProgress(x),e.setTranslate(x),e.updateActiveIndex(),e.updateSlidesClasses()}function g(P){const C=e.params.scrollbar,{scrollbar:L,wrapperEl:j}=e,{el:O,dragEl:x}=L;f=!0,o=P.target===x?h(P)-P.target.getBoundingClientRect()[e.isHorizontal()?"left":"top"]:null,P.preventDefault(),P.stopPropagation(),j.style.transitionDuration="100ms",x.style.transitionDuration="100ms",b(P),clearTimeout(d),O.style.transitionDuration="0ms",C.hide&&(O.style.opacity=1),e.params.cssMode&&(e.wrapperEl.style["scroll-snap-type"]="none"),r("scrollbarDragStart",P)}function m(P){const{scrollbar:C,wrapperEl:L}=e,{el:j,dragEl:O}=C;f&&(P.preventDefault&&P.cancelable?P.preventDefault():P.returnValue=!1,b(P),L.style.transitionDuration="0ms",j.style.transitionDuration="0ms",O.style.transitionDuration="0ms",r("scrollbarDragMove",P))}function y(P){const C=e.params.scrollbar,{scrollbar:L,wrapperEl:j}=e,{el:O}=L;f&&(f=!1,e.params.cssMode&&(e.wrapperEl.style["scroll-snap-type"]="",j.style.transitionDuration=""),C.hide&&(clearTimeout(d),d=Se(()=>{O.style.opacity=0,O.style.transitionDuration="400ms"},1e3)),r("scrollbarDragEnd",P),C.snapOnRelease&&e.slideToClosest())}function E(P){const{scrollbar:C,params:L}=e,j=C.el;if(!j)return;const O=j,x=L.passiveListeners?{passive:!1,capture:!1}:!1,M=L.passiveListeners?{passive:!0,capture:!1}:!1;if(!O)return;const B=P==="on"?"addEventListener":"removeEventListener";O[B]("pointerdown",g,x),n[B]("pointermove",m,x),n[B]("pointerup",y,M)}function k(){!e.params.scrollbar.el||!e.scrollbar.el||E("on")}function _(){!e.params.scrollbar.el||!e.scrollbar.el||E("off")}function I(){const{scrollbar:P,el:C}=e;e.params.scrollbar=Lt(e,e.originalParams.scrollbar,e.params.scrollbar,{el:"swiper-scrollbar"});const L=e.params.scrollbar;if(!L.el)return;let j;if(typeof L.el=="string"&&e.isElement&&(j=e.el.querySelector(L.el)),!j&&typeof L.el=="string"){if(j=n.querySelectorAll(L.el),!j.length)return}else j||(j=L.el);e.params.uniqueNavElements&&typeof L.el=="string"&&j.length>1&&C.querySelectorAll(L.el).length===1&&(j=C.querySelector(L.el)),j.length>0&&(j=j[0]),j.classList.add(e.isHorizontal()?L.horizontalClass:L.verticalClass);let O;j&&(O=j.querySelector(me(e.params.scrollbar.dragClass)),O||(O=oe("div",e.params.scrollbar.dragClass),j.append(O))),Object.assign(P,{el:j,dragEl:O}),L.draggable&&k(),j&&j.classList[e.enabled?"remove":"add"](...ve(e.params.scrollbar.lockClass))}function S(){const P=e.params.scrollbar,C=e.scrollbar.el;C&&C.classList.remove(...ve(e.isHorizontal()?P.horizontalClass:P.verticalClass)),_()}t("changeDirection",()=>{if(!e.scrollbar||!e.scrollbar.el)return;const P=e.params.scrollbar;let{el:C}=e.scrollbar;C=Y(C),C.forEach(L=>{L.classList.remove(P.horizontalClass,P.verticalClass),L.classList.add(e.isHorizontal()?P.horizontalClass:P.verticalClass)})}),t("init",()=>{e.params.scrollbar.enabled===!1?z():(I(),l(),w())}),t("update resize observerUpdate lock unlock changeDirection",()=>{l()}),t("setTranslate",()=>{w()}),t("setTransition",(P,C)=>{a(C)}),t("enable disable",()=>{const{el:P}=e.scrollbar;P&&P.classList[e.enabled?"remove":"add"](...ve(e.params.scrollbar.lockClass))}),t("destroy",()=>{S()});const T=()=>{e.el.classList.remove(...ve(e.params.scrollbar.scrollbarDisabledClass)),e.scrollbar.el&&e.scrollbar.el.classList.remove(...ve(e.params.scrollbar.scrollbarDisabledClass)),I(),l(),w()},z=()=>{e.el.classList.add(...ve(e.params.scrollbar.scrollbarDisabledClass)),e.scrollbar.el&&e.scrollbar.el.classList.add(...ve(e.params.scrollbar.scrollbarDisabledClass)),S()};Object.assign(e.scrollbar,{enable:T,disable:z,updateSize:l,setTranslate:w,init:I,destroy:S})}function js(s){let{swiper:e,extendParams:i,on:t}=s;i({parallax:{enabled:!1}});const r="[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]",n=(d,o)=>{const{rtl:p}=e,u=p?-1:1,v=d.getAttribute("data-swiper-parallax")||"0";let w=d.getAttribute("data-swiper-parallax-x"),a=d.getAttribute("data-swiper-parallax-y");const l=d.getAttribute("data-swiper-parallax-scale"),h=d.getAttribute("data-swiper-parallax-opacity"),b=d.getAttribute("data-swiper-parallax-rotate");if(w||a?(w=w||"0",a=a||"0"):e.isHorizontal()?(w=v,a="0"):(a=v,w="0"),w.indexOf("%")>=0?w=`${parseInt(w,10)*o*u}%`:w=`${w*o*u}px`,a.indexOf("%")>=0?a=`${parseInt(a,10)*o}%`:a=`${a*o}px`,typeof h<"u"&&h!==null){const m=h-(h-1)*(1-Math.abs(o));d.style.opacity=m}let g=`translate3d(${w}, ${a}, 0px)`;if(typeof l<"u"&&l!==null){const m=l-(l-1)*(1-Math.abs(o));g+=` scale(${m})`}if(b&&typeof b<"u"&&b!==null){const m=b*o*-1;g+=` rotate(${m}deg)`}d.style.transform=g},f=()=>{const{el:d,slides:o,progress:p,snapGrid:u,isElement:v}=e,w=Q(d,r);e.isElement&&w.push(...Q(e.hostEl,r)),w.forEach(a=>{n(a,p)}),o.forEach((a,l)=>{let h=a.progress;e.params.slidesPerGroup>1&&e.params.slidesPerView!=="auto"&&(h+=Math.ceil(l/2)-p*(u.length-1)),h=Math.min(Math.max(h,-1),1),a.querySelectorAll(`${r}, [data-swiper-parallax-rotate]`).forEach(b=>{n(b,h)})})},c=function(d){d===void 0&&(d=e.params.speed);const{el:o,hostEl:p}=e,u=[...o.querySelectorAll(r)];e.isElement&&u.push(...p.querySelectorAll(r)),u.forEach(v=>{let w=parseInt(v.getAttribute("data-swiper-parallax-duration"),10)||d;d===0&&(w=0),v.style.transitionDuration=`${w}ms`})};t("beforeInit",()=>{e.params.parallax.enabled&&(e.params.watchSlidesProgress=!0,e.originalParams.watchSlidesProgress=!0)}),t("init",()=>{e.params.parallax.enabled&&f()}),t("setTranslate",()=>{e.params.parallax.enabled&&f()}),t("setTransition",(d,o)=>{e.params.parallax.enabled&&c(o)})}function Ds(s){let{swiper:e,extendParams:i,on:t,emit:r}=s;const n=W();i({zoom:{enabled:!1,limitToOriginalSize:!1,maxRatio:3,minRatio:1,panOnMouseMove:!1,toggle:!0,containerClass:"swiper-zoom-container",zoomedSlideClass:"swiper-slide-zoomed"}}),e.zoom={enabled:!1};let f=1,c=!1,d=!1,o={x:0,y:0};const p=-3;let u,v;const w=[],a={originX:0,originY:0,slideEl:void 0,slideWidth:void 0,slideHeight:void 0,imageEl:void 0,imageWrapEl:void 0,maxRatio:3},l={isTouched:void 0,isMoved:void 0,currentX:void 0,currentY:void 0,minX:void 0,minY:void 0,maxX:void 0,maxY:void 0,width:void 0,height:void 0,startX:void 0,startY:void 0,touchesStart:{},touchesCurrent:{}},h={x:void 0,y:void 0,prevPositionX:void 0,prevPositionY:void 0,prevTime:void 0};let b=1;Object.defineProperty(e.zoom,"scale",{get(){return b},set(D){if(b!==D){const A=a.imageEl,V=a.slideEl;r("zoomChange",D,A,V)}b=D}});function g(){if(w.length<2)return 1;const D=w[0].pageX,A=w[0].pageY,V=w[1].pageX,F=w[1].pageY;return Math.sqrt((V-D)**2+(F-A)**2)}function m(){const D=e.params.zoom,A=a.imageWrapEl.getAttribute("data-swiper-zoom")||D.maxRatio;if(D.limitToOriginalSize&&a.imageEl&&a.imageEl.naturalWidth){const V=a.imageEl.naturalWidth/a.imageEl.offsetWidth;return Math.min(V,A)}return A}function y(){if(w.length<2)return{x:null,y:null};const D=a.imageEl.getBoundingClientRect();return[(w[0].pageX+(w[1].pageX-w[0].pageX)/2-D.x-n.scrollX)/f,(w[0].pageY+(w[1].pageY-w[0].pageY)/2-D.y-n.scrollY)/f]}function E(){return e.isElement?"swiper-slide":`.${e.params.slideClass}`}function k(D){const A=E();return!!(D.target.matches(A)||e.slides.filter(V=>V.contains(D.target)).length>0)}function _(D){const A=`.${e.params.zoom.containerClass}`;return!!(D.target.matches(A)||[...e.hostEl.querySelectorAll(A)].filter(V=>V.contains(D.target)).length>0)}function I(D){if(D.pointerType==="mouse"&&w.splice(0,w.length),!k(D))return;const A=e.params.zoom;if(u=!1,v=!1,w.push(D),!(w.length<2)){if(u=!0,a.scaleStart=g(),!a.slideEl){a.slideEl=D.target.closest(`.${e.params.slideClass}, swiper-slide`),a.slideEl||(a.slideEl=e.slides[e.activeIndex]);let V=a.slideEl.querySelector(`.${A.containerClass}`);if(V&&(V=V.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0]),a.imageEl=V,V?a.imageWrapEl=ye(a.imageEl,`.${A.containerClass}`)[0]:a.imageWrapEl=void 0,!a.imageWrapEl){a.imageEl=void 0;return}a.maxRatio=m()}if(a.imageEl){const[V,F]=y();a.originX=V,a.originY=F,a.imageEl.style.transitionDuration="0ms"}c=!0}}function S(D){if(!k(D))return;const A=e.params.zoom,V=e.zoom,F=w.findIndex(ee=>ee.pointerId===D.pointerId);F>=0&&(w[F]=D),!(w.length<2)&&(v=!0,a.scaleMove=g(),a.imageEl&&(V.scale=a.scaleMove/a.scaleStart*f,V.scale>a.maxRatio&&(V.scale=a.maxRatio-1+(V.scale-a.maxRatio+1)**.5),V.scale<A.minRatio&&(V.scale=A.minRatio+1-(A.minRatio-V.scale+1)**.5),a.imageEl.style.transform=`translate3d(0,0,0) scale(${V.scale})`))}function T(D){if(!k(D)||D.pointerType==="mouse"&&D.type==="pointerout")return;const A=e.params.zoom,V=e.zoom,F=w.findIndex(ee=>ee.pointerId===D.pointerId);F>=0&&w.splice(F,1),!(!u||!v)&&(u=!1,v=!1,a.imageEl&&(V.scale=Math.max(Math.min(V.scale,a.maxRatio),A.minRatio),a.imageEl.style.transitionDuration=`${e.params.speed}ms`,a.imageEl.style.transform=`translate3d(0,0,0) scale(${V.scale})`,f=V.scale,c=!1,V.scale>1&&a.slideEl?a.slideEl.classList.add(`${A.zoomedSlideClass}`):V.scale<=1&&a.slideEl&&a.slideEl.classList.remove(`${A.zoomedSlideClass}`),V.scale===1&&(a.originX=0,a.originY=0,a.slideEl=void 0)))}let z;function P(){e.touchEventsData.preventTouchMoveFromPointerMove=!1}function C(){clearTimeout(z),e.touchEventsData.preventTouchMoveFromPointerMove=!0,z=setTimeout(()=>{e.destroyed||P()})}function L(D){const A=e.device;if(!a.imageEl||l.isTouched)return;A.android&&D.cancelable&&D.preventDefault(),l.isTouched=!0;const V=w.length>0?w[0]:D;l.touchesStart.x=V.pageX,l.touchesStart.y=V.pageY}function j(D){const V=D.pointerType==="mouse"&&e.params.zoom.panOnMouseMove;if(!k(D)||!_(D))return;const F=e.zoom;if(!a.imageEl)return;if(!l.isTouched||!a.slideEl){V&&M(D);return}if(V){M(D);return}l.isMoved||(l.width=a.imageEl.offsetWidth||a.imageEl.clientWidth,l.height=a.imageEl.offsetHeight||a.imageEl.clientHeight,l.startX=Et(a.imageWrapEl,"x")||0,l.startY=Et(a.imageWrapEl,"y")||0,a.slideWidth=a.slideEl.offsetWidth,a.slideHeight=a.slideEl.offsetHeight,a.imageWrapEl.style.transitionDuration="0ms");const ee=l.width*F.scale,we=l.height*F.scale;if(l.minX=Math.min(a.slideWidth/2-ee/2,0),l.maxX=-l.minX,l.minY=Math.min(a.slideHeight/2-we/2,0),l.maxY=-l.minY,l.touchesCurrent.x=w.length>0?w[0].pageX:D.pageX,l.touchesCurrent.y=w.length>0?w[0].pageY:D.pageY,Math.max(Math.abs(l.touchesCurrent.x-l.touchesStart.x),Math.abs(l.touchesCurrent.y-l.touchesStart.y))>5&&(e.allowClick=!1),!l.isMoved&&!c){if(e.isHorizontal()&&(Math.floor(l.minX)===Math.floor(l.startX)&&l.touchesCurrent.x<l.touchesStart.x||Math.floor(l.maxX)===Math.floor(l.startX)&&l.touchesCurrent.x>l.touchesStart.x)){l.isTouched=!1,P();return}if(!e.isHorizontal()&&(Math.floor(l.minY)===Math.floor(l.startY)&&l.touchesCurrent.y<l.touchesStart.y||Math.floor(l.maxY)===Math.floor(l.startY)&&l.touchesCurrent.y>l.touchesStart.y)){l.isTouched=!1,P();return}}D.cancelable&&D.preventDefault(),D.stopPropagation(),C(),l.isMoved=!0;const ue=(F.scale-f)/(a.maxRatio-e.params.zoom.minRatio),{originX:he,originY:te}=a;l.currentX=l.touchesCurrent.x-l.touchesStart.x+l.startX+ue*(l.width-he*2),l.currentY=l.touchesCurrent.y-l.touchesStart.y+l.startY+ue*(l.height-te*2),l.currentX<l.minX&&(l.currentX=l.minX+1-(l.minX-l.currentX+1)**.8),l.currentX>l.maxX&&(l.currentX=l.maxX-1+(l.currentX-l.maxX+1)**.8),l.currentY<l.minY&&(l.currentY=l.minY+1-(l.minY-l.currentY+1)**.8),l.currentY>l.maxY&&(l.currentY=l.maxY-1+(l.currentY-l.maxY+1)**.8),h.prevPositionX||(h.prevPositionX=l.touchesCurrent.x),h.prevPositionY||(h.prevPositionY=l.touchesCurrent.y),h.prevTime||(h.prevTime=Date.now()),h.x=(l.touchesCurrent.x-h.prevPositionX)/(Date.now()-h.prevTime)/2,h.y=(l.touchesCurrent.y-h.prevPositionY)/(Date.now()-h.prevTime)/2,Math.abs(l.touchesCurrent.x-h.prevPositionX)<2&&(h.x=0),Math.abs(l.touchesCurrent.y-h.prevPositionY)<2&&(h.y=0),h.prevPositionX=l.touchesCurrent.x,h.prevPositionY=l.touchesCurrent.y,h.prevTime=Date.now(),a.imageWrapEl.style.transform=`translate3d(${l.currentX}px, ${l.currentY}px,0)`}function O(){const D=e.zoom;if(w.length=0,!a.imageEl)return;if(!l.isTouched||!l.isMoved){l.isTouched=!1,l.isMoved=!1;return}l.isTouched=!1,l.isMoved=!1;let A=300,V=300;const F=h.x*A,ee=l.currentX+F,we=h.y*V,ge=l.currentY+we;h.x!==0&&(A=Math.abs((ee-l.currentX)/h.x)),h.y!==0&&(V=Math.abs((ge-l.currentY)/h.y));const ue=Math.max(A,V);l.currentX=ee,l.currentY=ge;const he=l.width*D.scale,te=l.height*D.scale;l.minX=Math.min(a.slideWidth/2-he/2,0),l.maxX=-l.minX,l.minY=Math.min(a.slideHeight/2-te/2,0),l.maxY=-l.minY,l.currentX=Math.max(Math.min(l.currentX,l.maxX),l.minX),l.currentY=Math.max(Math.min(l.currentY,l.maxY),l.minY),a.imageWrapEl.style.transitionDuration=`${ue}ms`,a.imageWrapEl.style.transform=`translate3d(${l.currentX}px, ${l.currentY}px,0)`}function x(){const D=e.zoom;a.slideEl&&e.activeIndex!==e.slides.indexOf(a.slideEl)&&(a.imageEl&&(a.imageEl.style.transform="translate3d(0,0,0) scale(1)"),a.imageWrapEl&&(a.imageWrapEl.style.transform="translate3d(0,0,0)"),a.slideEl.classList.remove(`${e.params.zoom.zoomedSlideClass}`),D.scale=1,f=1,a.slideEl=void 0,a.imageEl=void 0,a.imageWrapEl=void 0,a.originX=0,a.originY=0)}function M(D){if(f<=1||!a.imageWrapEl||!k(D)||!_(D))return;const A=n.getComputedStyle(a.imageWrapEl).transform,V=new n.DOMMatrix(A);if(!d){d=!0,o.x=D.clientX,o.y=D.clientY,l.startX=V.e,l.startY=V.f,l.width=a.imageEl.offsetWidth||a.imageEl.clientWidth,l.height=a.imageEl.offsetHeight||a.imageEl.clientHeight,a.slideWidth=a.slideEl.offsetWidth,a.slideHeight=a.slideEl.offsetHeight;return}const F=(D.clientX-o.x)*p,ee=(D.clientY-o.y)*p,we=l.width*f,ge=l.height*f,ue=a.slideWidth,he=a.slideHeight,te=Math.min(ue/2-we/2,0),ce=-te,Le=Math.min(he/2-ge/2,0),We=-Le,Ee=Math.max(Math.min(l.startX+F,ce),te),Te=Math.max(Math.min(l.startY+ee,We),Le);a.imageWrapEl.style.transitionDuration="0ms",a.imageWrapEl.style.transform=`translate3d(${Ee}px, ${Te}px, 0)`,o.x=D.clientX,o.y=D.clientY,l.startX=Ee,l.startY=Te,l.currentX=Ee,l.currentY=Te}function B(D){const A=e.zoom,V=e.params.zoom;if(!a.slideEl){D&&D.target&&(a.slideEl=D.target.closest(`.${e.params.slideClass}, swiper-slide`)),a.slideEl||(e.params.virtual&&e.params.virtual.enabled&&e.virtual?a.slideEl=Q(e.slidesEl,`.${e.params.slideActiveClass}`)[0]:a.slideEl=e.slides[e.activeIndex]);let ke=a.slideEl.querySelector(`.${V.containerClass}`);ke&&(ke=ke.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0]),a.imageEl=ke,ke?a.imageWrapEl=ye(a.imageEl,`.${V.containerClass}`)[0]:a.imageWrapEl=void 0}if(!a.imageEl||!a.imageWrapEl)return;e.params.cssMode&&(e.wrapperEl.style.overflow="hidden",e.wrapperEl.style.touchAction="none"),a.slideEl.classList.add(`${V.zoomedSlideClass}`);let F,ee,we,ge,ue,he,te,ce,Le,We,Ee,Te,qe,Ue,dt,ct,ft,ut;typeof l.touchesStart.x>"u"&&D?(F=D.pageX,ee=D.pageY):(F=l.touchesStart.x,ee=l.touchesStart.y);const mt=f,Me=typeof D=="number"?D:null;f===1&&Me&&(F=void 0,ee=void 0,l.touchesStart.x=void 0,l.touchesStart.y=void 0);const $t=m();A.scale=Me||$t,f=Me||$t,D&&!(f===1&&Me)?(ft=a.slideEl.offsetWidth,ut=a.slideEl.offsetHeight,we=Je(a.slideEl).left+n.scrollX,ge=Je(a.slideEl).top+n.scrollY,ue=we+ft/2-F,he=ge+ut/2-ee,Le=a.imageEl.offsetWidth||a.imageEl.clientWidth,We=a.imageEl.offsetHeight||a.imageEl.clientHeight,Ee=Le*A.scale,Te=We*A.scale,qe=Math.min(ft/2-Ee/2,0),Ue=Math.min(ut/2-Te/2,0),dt=-qe,ct=-Ue,mt>0&&Me&&typeof l.currentX=="number"&&typeof l.currentY=="number"?(te=l.currentX*A.scale/mt,ce=l.currentY*A.scale/mt):(te=ue*A.scale,ce=he*A.scale),te<qe&&(te=qe),te>dt&&(te=dt),ce<Ue&&(ce=Ue),ce>ct&&(ce=ct)):(te=0,ce=0),Me&&A.scale===1&&(a.originX=0,a.originY=0),l.currentX=te,l.currentY=ce,a.imageWrapEl.style.transitionDuration="300ms",a.imageWrapEl.style.transform=`translate3d(${te}px, ${ce}px,0)`,a.imageEl.style.transitionDuration="300ms",a.imageEl.style.transform=`translate3d(0,0,0) scale(${A.scale})`}function N(){const D=e.zoom,A=e.params.zoom;if(!a.slideEl){e.params.virtual&&e.params.virtual.enabled&&e.virtual?a.slideEl=Q(e.slidesEl,`.${e.params.slideActiveClass}`)[0]:a.slideEl=e.slides[e.activeIndex];let V=a.slideEl.querySelector(`.${A.containerClass}`);V&&(V=V.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0]),a.imageEl=V,V?a.imageWrapEl=ye(a.imageEl,`.${A.containerClass}`)[0]:a.imageWrapEl=void 0}!a.imageEl||!a.imageWrapEl||(e.params.cssMode&&(e.wrapperEl.style.overflow="",e.wrapperEl.style.touchAction=""),D.scale=1,f=1,l.currentX=void 0,l.currentY=void 0,l.touchesStart.x=void 0,l.touchesStart.y=void 0,a.imageWrapEl.style.transitionDuration="300ms",a.imageWrapEl.style.transform="translate3d(0,0,0)",a.imageEl.style.transitionDuration="300ms",a.imageEl.style.transform="translate3d(0,0,0) scale(1)",a.slideEl.classList.remove(`${A.zoomedSlideClass}`),a.slideEl=void 0,a.originX=0,a.originY=0,e.params.zoom.panOnMouseMove&&(o={x:0,y:0},d&&(d=!1,l.startX=0,l.startY=0)))}function q(D){const A=e.zoom;A.scale&&A.scale!==1?N():B(D)}function U(){const D=e.params.passiveListeners?{passive:!0,capture:!1}:!1,A=e.params.passiveListeners?{passive:!1,capture:!0}:!0;return{passiveListener:D,activeListenerWithCapture:A}}function fe(){const D=e.zoom;if(D.enabled)return;D.enabled=!0;const{passiveListener:A,activeListenerWithCapture:V}=U();e.wrapperEl.addEventListener("pointerdown",I,A),e.wrapperEl.addEventListener("pointermove",S,V),["pointerup","pointercancel","pointerout"].forEach(F=>{e.wrapperEl.addEventListener(F,T,A)}),e.wrapperEl.addEventListener("pointermove",j,V)}function ze(){const D=e.zoom;if(!D.enabled)return;D.enabled=!1;const{passiveListener:A,activeListenerWithCapture:V}=U();e.wrapperEl.removeEventListener("pointerdown",I,A),e.wrapperEl.removeEventListener("pointermove",S,V),["pointerup","pointercancel","pointerout"].forEach(F=>{e.wrapperEl.removeEventListener(F,T,A)}),e.wrapperEl.removeEventListener("pointermove",j,V)}t("init",()=>{e.params.zoom.enabled&&fe()}),t("destroy",()=>{ze()}),t("touchStart",(D,A)=>{e.zoom.enabled&&L(A)}),t("touchEnd",(D,A)=>{e.zoom.enabled&&O()}),t("doubleTap",(D,A)=>{!e.animating&&e.params.zoom.enabled&&e.zoom.enabled&&e.params.zoom.toggle&&q(A)}),t("transitionEnd",()=>{e.zoom.enabled&&e.params.zoom.enabled&&x()}),t("slideChange",()=>{e.zoom.enabled&&e.params.zoom.enabled&&e.params.cssMode&&x()}),Object.assign(e.zoom,{enable:fe,disable:ze,in:B,out:N,toggle:q})}function Os(s){let{swiper:e,extendParams:i,on:t}=s;i({controller:{control:void 0,inverse:!1,by:"slide"}}),e.controller={control:void 0};function r(o,p){const u=function(){let l,h,b;return(g,m)=>{for(h=-1,l=g.length;l-h>1;)b=l+h>>1,g[b]<=m?h=b:l=b;return l}}();this.x=o,this.y=p,this.lastIndex=o.length-1;let v,w;return this.interpolate=function(l){return l?(w=u(this.x,l),v=w-1,(l-this.x[v])*(this.y[w]-this.y[v])/(this.x[w]-this.x[v])+this.y[v]):0},this}function n(o){e.controller.spline=e.params.loop?new r(e.slidesGrid,o.slidesGrid):new r(e.snapGrid,o.snapGrid)}function f(o,p){const u=e.controller.control;let v,w;const a=e.constructor;function l(h){if(h.destroyed)return;const b=e.rtlTranslate?-e.translate:e.translate;e.params.controller.by==="slide"&&(n(h),w=-e.controller.spline.interpolate(-b)),(!w||e.params.controller.by==="container")&&(v=(h.maxTranslate()-h.minTranslate())/(e.maxTranslate()-e.minTranslate()),(Number.isNaN(v)||!Number.isFinite(v))&&(v=1),w=(b-e.minTranslate())*v+h.minTranslate()),e.params.controller.inverse&&(w=h.maxTranslate()-w),h.updateProgress(w),h.setTranslate(w,e),h.updateActiveIndex(),h.updateSlidesClasses()}if(Array.isArray(u))for(let h=0;h<u.length;h+=1)u[h]!==p&&u[h]instanceof a&&l(u[h]);else u instanceof a&&p!==u&&l(u)}function c(o,p){const u=e.constructor,v=e.controller.control;let w;function a(l){l.destroyed||(l.setTransition(o,e),o!==0&&(l.transitionStart(),l.params.autoHeight&&Se(()=>{l.updateAutoHeight()}),He(l.wrapperEl,()=>{v&&l.transitionEnd()})))}if(Array.isArray(v))for(w=0;w<v.length;w+=1)v[w]!==p&&v[w]instanceof u&&a(v[w]);else v instanceof u&&p!==v&&a(v)}function d(){e.controller.control&&e.controller.spline&&(e.controller.spline=void 0,delete e.controller.spline)}t("beforeInit",()=>{if(typeof window<"u"&&(typeof e.params.controller.control=="string"||e.params.controller.control instanceof HTMLElement)){(typeof e.params.controller.control=="string"?[...document.querySelectorAll(e.params.controller.control)]:[e.params.controller.control]).forEach(p=>{if(e.controller.control||(e.controller.control=[]),p&&p.swiper)e.controller.control.push(p.swiper);else if(p){const u=`${e.params.eventsPrefix}init`,v=w=>{e.controller.control.push(w.detail[0]),e.update(),p.removeEventListener(u,v)};p.addEventListener(u,v)}});return}e.controller.control=e.params.controller.control}),t("update",()=>{d()}),t("resize",()=>{d()}),t("observerUpdate",()=>{d()}),t("setTranslate",(o,p,u)=>{!e.controller.control||e.controller.control.destroyed||e.controller.setTranslate(p,u)}),t("setTransition",(o,p,u)=>{!e.controller.control||e.controller.control.destroyed||e.controller.setTransition(p,u)}),Object.assign(e.controller,{setTranslate:f,setTransition:c})}function Vs(s){let{swiper:e,extendParams:i,on:t}=s;i({a11y:{enabled:!0,notificationClass:"swiper-notification",prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide",firstSlideMessage:"This is the first slide",lastSlideMessage:"This is the last slide",paginationBulletMessage:"Go to slide {{index}}",slideLabelMessage:"{{index}} / {{slidesLength}}",containerMessage:null,containerRoleDescriptionMessage:null,containerRole:null,itemRoleDescriptionMessage:null,slideRole:"group",id:null,scrollOnFocus:!0}}),e.a11y={clicked:!1};let r=null,n,f,c=new Date().getTime();function d(x){const M=r;M.length!==0&&de(M,x)}function o(x){const M=()=>Math.round(16*Math.random()).toString(16);return"x".repeat(x).replace(/x/g,M)}function p(x){x=Y(x),x.forEach(M=>{M.setAttribute("tabIndex","0")})}function u(x){x=Y(x),x.forEach(M=>{M.setAttribute("tabIndex","-1")})}function v(x,M){x=Y(x),x.forEach(B=>{B.setAttribute("role",M)})}function w(x,M){x=Y(x),x.forEach(B=>{B.setAttribute("aria-roledescription",M)})}function a(x,M){x=Y(x),x.forEach(B=>{B.setAttribute("aria-controls",M)})}function l(x,M){x=Y(x),x.forEach(B=>{B.setAttribute("aria-label",M)})}function h(x,M){x=Y(x),x.forEach(B=>{B.setAttribute("id",M)})}function b(x,M){x=Y(x),x.forEach(B=>{B.setAttribute("aria-live",M)})}function g(x){x=Y(x),x.forEach(M=>{M.setAttribute("aria-disabled",!0)})}function m(x){x=Y(x),x.forEach(M=>{M.setAttribute("aria-disabled",!1)})}function y(x){if(x.keyCode!==13&&x.keyCode!==32)return;const M=e.params.a11y,B=x.target;if(!(e.pagination&&e.pagination.el&&(B===e.pagination.el||e.pagination.el.contains(x.target))&&!x.target.matches(me(e.params.pagination.bulletClass)))){if(e.navigation&&e.navigation.prevEl&&e.navigation.nextEl){const N=Y(e.navigation.prevEl);Y(e.navigation.nextEl).includes(B)&&(e.isEnd&&!e.params.loop||e.slideNext(),e.isEnd?d(M.lastSlideMessage):d(M.nextSlideMessage)),N.includes(B)&&(e.isBeginning&&!e.params.loop||e.slidePrev(),e.isBeginning?d(M.firstSlideMessage):d(M.prevSlideMessage))}e.pagination&&B.matches(me(e.params.pagination.bulletClass))&&B.click()}}function E(){if(e.params.loop||e.params.rewind||!e.navigation)return;const{nextEl:x,prevEl:M}=e.navigation;M&&(e.isBeginning?(g(M),u(M)):(m(M),p(M))),x&&(e.isEnd?(g(x),u(x)):(m(x),p(x)))}function k(){return e.pagination&&e.pagination.bullets&&e.pagination.bullets.length}function _(){return k()&&e.params.pagination.clickable}function I(){const x=e.params.a11y;k()&&e.pagination.bullets.forEach(M=>{e.params.pagination.clickable&&(p(M),e.params.pagination.renderBullet||(v(M,"button"),l(M,x.paginationBulletMessage.replace(/\{\{index\}\}/,Re(M)+1)))),M.matches(me(e.params.pagination.bulletActiveClass))?M.setAttribute("aria-current","true"):M.removeAttribute("aria-current")})}const S=(x,M,B)=>{p(x),x.tagName!=="BUTTON"&&(v(x,"button"),x.addEventListener("keydown",y)),l(x,B),a(x,M)},T=x=>{f&&f!==x.target&&!f.contains(x.target)&&(n=!0),e.a11y.clicked=!0},z=()=>{n=!1,requestAnimationFrame(()=>{requestAnimationFrame(()=>{e.destroyed||(e.a11y.clicked=!1)})})},P=x=>{c=new Date().getTime()},C=x=>{if(e.a11y.clicked||!e.params.a11y.scrollOnFocus||new Date().getTime()-c<100)return;const M=x.target.closest(`.${e.params.slideClass}, swiper-slide`);if(!M||!e.slides.includes(M))return;f=M;const B=e.slides.indexOf(M)===e.activeIndex,N=e.params.watchSlidesProgress&&e.visibleSlides&&e.visibleSlides.includes(M);B||N||x.sourceCapabilities&&x.sourceCapabilities.firesTouchEvents||(e.isHorizontal()?e.el.scrollLeft=0:e.el.scrollTop=0,requestAnimationFrame(()=>{n||(e.params.loop?e.slideToLoop(parseInt(M.getAttribute("data-swiper-slide-index")),0):e.slideTo(e.slides.indexOf(M),0),n=!1)}))},L=()=>{const x=e.params.a11y;x.itemRoleDescriptionMessage&&w(e.slides,x.itemRoleDescriptionMessage),x.slideRole&&v(e.slides,x.slideRole);const M=e.slides.length;x.slideLabelMessage&&e.slides.forEach((B,N)=>{const q=e.params.loop?parseInt(B.getAttribute("data-swiper-slide-index"),10):N,U=x.slideLabelMessage.replace(/\{\{index\}\}/,q+1).replace(/\{\{slidesLength\}\}/,M);l(B,U)})},j=()=>{const x=e.params.a11y;e.el.append(r);const M=e.el;x.containerRoleDescriptionMessage&&w(M,x.containerRoleDescriptionMessage),x.containerMessage&&l(M,x.containerMessage),x.containerRole&&v(M,x.containerRole);const B=e.wrapperEl,N=x.id||B.getAttribute("id")||`swiper-wrapper-${o(16)}`,q=e.params.autoplay&&e.params.autoplay.enabled?"off":"polite";h(B,N),b(B,q),L();let{nextEl:U,prevEl:fe}=e.navigation?e.navigation:{};U=Y(U),fe=Y(fe),U&&U.forEach(D=>S(D,N,x.nextSlideMessage)),fe&&fe.forEach(D=>S(D,N,x.prevSlideMessage)),_()&&Y(e.pagination.el).forEach(A=>{A.addEventListener("keydown",y)}),Z().addEventListener("visibilitychange",P),e.el.addEventListener("focus",C,!0),e.el.addEventListener("focus",C,!0),e.el.addEventListener("pointerdown",T,!0),e.el.addEventListener("pointerup",z,!0)};function O(){r&&r.remove();let{nextEl:x,prevEl:M}=e.navigation?e.navigation:{};x=Y(x),M=Y(M),x&&x.forEach(N=>N.removeEventListener("keydown",y)),M&&M.forEach(N=>N.removeEventListener("keydown",y)),_()&&Y(e.pagination.el).forEach(q=>{q.removeEventListener("keydown",y)}),Z().removeEventListener("visibilitychange",P),e.el&&typeof e.el!="string"&&(e.el.removeEventListener("focus",C,!0),e.el.removeEventListener("pointerdown",T,!0),e.el.removeEventListener("pointerup",z,!0))}t("beforeInit",()=>{r=oe("span",e.params.a11y.notificationClass),r.setAttribute("aria-live","assertive"),r.setAttribute("aria-atomic","true")}),t("afterInit",()=>{e.params.a11y.enabled&&j()}),t("slidesLengthChange snapGridLengthChange slidesGridLengthChange",()=>{e.params.a11y.enabled&&L()}),t("fromEdge toEdge afterInit lock unlock",()=>{e.params.a11y.enabled&&E()}),t("paginationUpdate",()=>{e.params.a11y.enabled&&I()}),t("destroy",()=>{e.params.a11y.enabled&&O()})}function Bs(s){let{swiper:e,extendParams:i,on:t}=s;i({history:{enabled:!1,root:"",replaceState:!1,key:"slides",keepQuery:!1}});let r=!1,n={};const f=w=>w.toString().replace(/\s+/g,"-").replace(/[^\w-]+/g,"").replace(/--+/g,"-").replace(/^-+/,"").replace(/-+$/,""),c=w=>{const a=W();let l;w?l=new URL(w):l=a.location;const h=l.pathname.slice(1).split("/").filter(y=>y!==""),b=h.length,g=h[b-2],m=h[b-1];return{key:g,value:m}},d=(w,a)=>{const l=W();if(!r||!e.params.history.enabled)return;let h;e.params.url?h=new URL(e.params.url):h=l.location;const b=e.virtual&&e.params.virtual.enabled?e.slidesEl.querySelector(`[data-swiper-slide-index="${a}"]`):e.slides[a];let g=f(b.getAttribute("data-history"));if(e.params.history.root.length>0){let y=e.params.history.root;y[y.length-1]==="/"&&(y=y.slice(0,y.length-1)),g=`${y}/${w?`${w}/`:""}${g}`}else h.pathname.includes(w)||(g=`${w?`${w}/`:""}${g}`);e.params.history.keepQuery&&(g+=h.search);const m=l.history.state;m&&m.value===g||(e.params.history.replaceState?l.history.replaceState({value:g},null,g):l.history.pushState({value:g},null,g))},o=(w,a,l)=>{if(a)for(let h=0,b=e.slides.length;h<b;h+=1){const g=e.slides[h];if(f(g.getAttribute("data-history"))===a){const y=e.getSlideIndex(g);e.slideTo(y,w,l)}}else e.slideTo(0,w,l)},p=()=>{n=c(e.params.url),o(e.params.speed,n.value,!1)},u=()=>{const w=W();if(e.params.history){if(!w.history||!w.history.pushState){e.params.history.enabled=!1,e.params.hashNavigation.enabled=!0;return}if(r=!0,n=c(e.params.url),!n.key&&!n.value){e.params.history.replaceState||w.addEventListener("popstate",p);return}o(0,n.value,e.params.runCallbacksOnInit),e.params.history.replaceState||w.addEventListener("popstate",p)}},v=()=>{const w=W();e.params.history.replaceState||w.removeEventListener("popstate",p)};t("init",()=>{e.params.history.enabled&&u()}),t("destroy",()=>{e.params.history.enabled&&v()}),t("transitionEnd _freeModeNoMomentumRelease",()=>{r&&d(e.params.history.key,e.activeIndex)}),t("slideChange",()=>{r&&e.params.cssMode&&d(e.params.history.key,e.activeIndex)})}function Gs(s){let{swiper:e,extendParams:i,emit:t,on:r}=s,n=!1;const f=Z(),c=W();i({hashNavigation:{enabled:!1,replaceState:!1,watchState:!1,getSlideIndex(v,w){if(e.virtual&&e.params.virtual.enabled){const a=e.slides.find(h=>h.getAttribute("data-hash")===w);return a?parseInt(a.getAttribute("data-swiper-slide-index"),10):0}return e.getSlideIndex(Q(e.slidesEl,`.${e.params.slideClass}[data-hash="${w}"], swiper-slide[data-hash="${w}"]`)[0])}}});const d=()=>{t("hashChange");const v=f.location.hash.replace("#",""),w=e.virtual&&e.params.virtual.enabled?e.slidesEl.querySelector(`[data-swiper-slide-index="${e.activeIndex}"]`):e.slides[e.activeIndex],a=w?w.getAttribute("data-hash"):"";if(v!==a){const l=e.params.hashNavigation.getSlideIndex(e,v);if(typeof l>"u"||Number.isNaN(l))return;e.slideTo(l)}},o=()=>{if(!n||!e.params.hashNavigation.enabled)return;const v=e.virtual&&e.params.virtual.enabled?e.slidesEl.querySelector(`[data-swiper-slide-index="${e.activeIndex}"]`):e.slides[e.activeIndex],w=v?v.getAttribute("data-hash")||v.getAttribute("data-history"):"";e.params.hashNavigation.replaceState&&c.history&&c.history.replaceState?(c.history.replaceState(null,null,`#${w}`||""),t("hashSet")):(f.location.hash=w||"",t("hashSet"))},p=()=>{if(!e.params.hashNavigation.enabled||e.params.history&&e.params.history.enabled)return;n=!0;const v=f.location.hash.replace("#","");if(v){const a=e.params.hashNavigation.getSlideIndex(e,v);e.slideTo(a||0,0,e.params.runCallbacksOnInit,!0)}e.params.hashNavigation.watchState&&c.addEventListener("hashchange",d)},u=()=>{e.params.hashNavigation.watchState&&c.removeEventListener("hashchange",d)};r("init",()=>{e.params.hashNavigation.enabled&&p()}),r("destroy",()=>{e.params.hashNavigation.enabled&&u()}),r("transitionEnd _freeModeNoMomentumRelease",()=>{n&&o()}),r("slideChange",()=>{n&&e.params.cssMode&&o()})}function Hs(s){let{swiper:e,extendParams:i,on:t,emit:r,params:n}=s;e.autoplay={running:!1,paused:!1,timeLeft:0},i({autoplay:{enabled:!1,delay:3e3,waitForTransition:!0,disableOnInteraction:!1,stopOnLastSlide:!1,reverseDirection:!1,pauseOnMouseEnter:!1}});let f,c,d=n&&n.autoplay?n.autoplay.delay:3e3,o=n&&n.autoplay?n.autoplay.delay:3e3,p,u=new Date().getTime(),v,w,a,l,h,b,g;function m(M){!e||e.destroyed||!e.wrapperEl||M.target===e.wrapperEl&&(e.wrapperEl.removeEventListener("transitionend",m),!(g||M.detail&&M.detail.bySwiperTouchMove)&&T())}const y=()=>{if(e.destroyed||!e.autoplay.running)return;e.autoplay.paused?v=!0:v&&(o=p,v=!1);const M=e.autoplay.paused?p:u+o-new Date().getTime();e.autoplay.timeLeft=M,r("autoplayTimeLeft",M,M/d),c=requestAnimationFrame(()=>{y()})},E=()=>{let M;return e.virtual&&e.params.virtual.enabled?M=e.slides.find(N=>N.classList.contains("swiper-slide-active")):M=e.slides[e.activeIndex],M?parseInt(M.getAttribute("data-swiper-autoplay"),10):void 0},k=M=>{if(e.destroyed||!e.autoplay.running)return;cancelAnimationFrame(c),y();let B=typeof M>"u"?e.params.autoplay.delay:M;d=e.params.autoplay.delay,o=e.params.autoplay.delay;const N=E();!Number.isNaN(N)&&N>0&&typeof M>"u"&&(B=N,d=N,o=N),p=B;const q=e.params.speed,U=()=>{!e||e.destroyed||(e.params.autoplay.reverseDirection?!e.isBeginning||e.params.loop||e.params.rewind?(e.slidePrev(q,!0,!0),r("autoplay")):e.params.autoplay.stopOnLastSlide||(e.slideTo(e.slides.length-1,q,!0,!0),r("autoplay")):!e.isEnd||e.params.loop||e.params.rewind?(e.slideNext(q,!0,!0),r("autoplay")):e.params.autoplay.stopOnLastSlide||(e.slideTo(0,q,!0,!0),r("autoplay")),e.params.cssMode&&(u=new Date().getTime(),requestAnimationFrame(()=>{k()})))};return B>0?(clearTimeout(f),f=setTimeout(()=>{U()},B)):requestAnimationFrame(()=>{U()}),B},_=()=>{u=new Date().getTime(),e.autoplay.running=!0,k(),r("autoplayStart")},I=()=>{e.autoplay.running=!1,clearTimeout(f),cancelAnimationFrame(c),r("autoplayStop")},S=(M,B)=>{if(e.destroyed||!e.autoplay.running)return;clearTimeout(f),M||(b=!0);const N=()=>{r("autoplayPause"),e.params.autoplay.waitForTransition?e.wrapperEl.addEventListener("transitionend",m):T()};if(e.autoplay.paused=!0,B){h&&(p=e.params.autoplay.delay),h=!1,N();return}p=(p||e.params.autoplay.delay)-(new Date().getTime()-u),!(e.isEnd&&p<0&&!e.params.loop)&&(p<0&&(p=0),N())},T=()=>{e.isEnd&&p<0&&!e.params.loop||e.destroyed||!e.autoplay.running||(u=new Date().getTime(),b?(b=!1,k(p)):k(),e.autoplay.paused=!1,r("autoplayResume"))},z=()=>{if(e.destroyed||!e.autoplay.running)return;const M=Z();M.visibilityState==="hidden"&&(b=!0,S(!0)),M.visibilityState==="visible"&&T()},P=M=>{M.pointerType==="mouse"&&(b=!0,g=!0,!(e.animating||e.autoplay.paused)&&S(!0))},C=M=>{M.pointerType==="mouse"&&(g=!1,e.autoplay.paused&&T())},L=()=>{e.params.autoplay.pauseOnMouseEnter&&(e.el.addEventListener("pointerenter",P),e.el.addEventListener("pointerleave",C))},j=()=>{e.el&&typeof e.el!="string"&&(e.el.removeEventListener("pointerenter",P),e.el.removeEventListener("pointerleave",C))},O=()=>{Z().addEventListener("visibilitychange",z)},x=()=>{Z().removeEventListener("visibilitychange",z)};t("init",()=>{e.params.autoplay.enabled&&(L(),O(),_())}),t("destroy",()=>{j(),x(),e.autoplay.running&&I()}),t("_freeModeStaticRelease",()=>{(a||b)&&T()}),t("_freeModeNoMomentumRelease",()=>{e.params.autoplay.disableOnInteraction?I():S(!0,!0)}),t("beforeTransitionStart",(M,B,N)=>{e.destroyed||!e.autoplay.running||(N||!e.params.autoplay.disableOnInteraction?S(!0,!0):I())}),t("sliderFirstMove",()=>{if(!(e.destroyed||!e.autoplay.running)){if(e.params.autoplay.disableOnInteraction){I();return}w=!0,a=!1,b=!1,l=setTimeout(()=>{b=!0,a=!0,S(!0)},200)}}),t("touchEnd",()=>{if(!(e.destroyed||!e.autoplay.running||!w)){if(clearTimeout(l),clearTimeout(f),e.params.autoplay.disableOnInteraction){a=!1,w=!1;return}a&&e.params.cssMode&&T(),a=!1,w=!1}}),t("slideChange",()=>{e.destroyed||!e.autoplay.running||(h=!0)}),Object.assign(e.autoplay,{start:_,stop:I,pause:S,resume:T})}function Rs(s){let{swiper:e,extendParams:i,on:t}=s;i({thumbs:{swiper:null,multipleActiveThumbs:!0,autoScrollOffset:0,slideThumbActiveClass:"swiper-slide-thumb-active",thumbsContainerClass:"swiper-thumbs"}});let r=!1,n=!1;e.thumbs={swiper:null};function f(){const o=e.thumbs.swiper;if(!o||o.destroyed)return;const p=o.clickedIndex,u=o.clickedSlide;if(u&&u.classList.contains(e.params.thumbs.slideThumbActiveClass)||typeof p>"u"||p===null)return;let v;o.params.loop?v=parseInt(o.clickedSlide.getAttribute("data-swiper-slide-index"),10):v=p,e.params.loop?e.slideToLoop(v):e.slideTo(v)}function c(){const{thumbs:o}=e.params;if(r)return!1;r=!0;const p=e.constructor;if(o.swiper instanceof p){if(o.swiper.destroyed)return r=!1,!1;e.thumbs.swiper=o.swiper,Object.assign(e.thumbs.swiper.originalParams,{watchSlidesProgress:!0,slideToClickedSlide:!1}),Object.assign(e.thumbs.swiper.params,{watchSlidesProgress:!0,slideToClickedSlide:!1}),e.thumbs.swiper.update()}else if(De(o.swiper)){const u=Object.assign({},o.swiper);Object.assign(u,{watchSlidesProgress:!0,slideToClickedSlide:!1}),e.thumbs.swiper=new p(u),n=!0}return e.thumbs.swiper.el.classList.add(e.params.thumbs.thumbsContainerClass),e.thumbs.swiper.on("tap",f),!0}function d(o){const p=e.thumbs.swiper;if(!p||p.destroyed)return;const u=p.params.slidesPerView==="auto"?p.slidesPerViewDynamic():p.params.slidesPerView;let v=1;const w=e.params.thumbs.slideThumbActiveClass;if(e.params.slidesPerView>1&&!e.params.centeredSlides&&(v=e.params.slidesPerView),e.params.thumbs.multipleActiveThumbs||(v=1),v=Math.floor(v),p.slides.forEach(h=>h.classList.remove(w)),p.params.loop||p.params.virtual&&p.params.virtual.enabled)for(let h=0;h<v;h+=1)Q(p.slidesEl,`[data-swiper-slide-index="${e.realIndex+h}"]`).forEach(b=>{b.classList.add(w)});else for(let h=0;h<v;h+=1)p.slides[e.realIndex+h]&&p.slides[e.realIndex+h].classList.add(w);const a=e.params.thumbs.autoScrollOffset,l=a&&!p.params.loop;if(e.realIndex!==p.realIndex||l){const h=p.activeIndex;let b,g;if(p.params.loop){const m=p.slides.find(y=>y.getAttribute("data-swiper-slide-index")===`${e.realIndex}`);b=p.slides.indexOf(m),g=e.activeIndex>e.previousIndex?"next":"prev"}else b=e.realIndex,g=b>e.previousIndex?"next":"prev";l&&(b+=g==="next"?a:-1*a),p.visibleSlidesIndexes&&p.visibleSlidesIndexes.indexOf(b)<0&&(p.params.centeredSlides?b>h?b=b-Math.floor(u/2)+1:b=b+Math.floor(u/2)-1:b>h&&p.params.slidesPerGroup,p.slideTo(b,o?0:void 0))}}t("beforeInit",()=>{const{thumbs:o}=e.params;if(!(!o||!o.swiper))if(typeof o.swiper=="string"||o.swiper instanceof HTMLElement){const p=Z(),u=()=>{const w=typeof o.swiper=="string"?p.querySelector(o.swiper):o.swiper;if(w&&w.swiper)o.swiper=w.swiper,c(),d(!0);else if(w){const a=`${e.params.eventsPrefix}init`,l=h=>{o.swiper=h.detail[0],w.removeEventListener(a,l),c(),d(!0),o.swiper.update(),e.update()};w.addEventListener(a,l)}return w},v=()=>{if(e.destroyed)return;u()||requestAnimationFrame(v)};requestAnimationFrame(v)}else c(),d(!0)}),t("slideChange update resize observerUpdate",()=>{d()}),t("setTransition",(o,p)=>{const u=e.thumbs.swiper;!u||u.destroyed||u.setTransition(p)}),t("beforeDestroy",()=>{const o=e.thumbs.swiper;!o||o.destroyed||n&&o.destroy()}),Object.assign(e.thumbs,{init:c,update:d})}function Xs(s){let{swiper:e,extendParams:i,emit:t,once:r}=s;i({freeMode:{enabled:!1,momentum:!0,momentumRatio:1,momentumBounce:!0,momentumBounceRatio:1,momentumVelocityRatio:1,sticky:!1,minimumVelocity:.02}});function n(){if(e.params.cssMode)return;const d=e.getTranslate();e.setTranslate(d),e.setTransition(0),e.touchEventsData.velocities.length=0,e.freeMode.onTouchEnd({currentPos:e.rtl?e.translate:-e.translate})}function f(){if(e.params.cssMode)return;const{touchEventsData:d,touches:o}=e;d.velocities.length===0&&d.velocities.push({position:o[e.isHorizontal()?"startX":"startY"],time:d.touchStartTime}),d.velocities.push({position:o[e.isHorizontal()?"currentX":"currentY"],time:le()})}function c(d){let{currentPos:o}=d;if(e.params.cssMode)return;const{params:p,wrapperEl:u,rtlTranslate:v,snapGrid:w,touchEventsData:a}=e,h=le()-a.touchStartTime;if(o<-e.minTranslate()){e.slideTo(e.activeIndex);return}if(o>-e.maxTranslate()){e.slides.length<w.length?e.slideTo(w.length-1):e.slideTo(e.slides.length-1);return}if(p.freeMode.momentum){if(a.velocities.length>1){const I=a.velocities.pop(),S=a.velocities.pop(),T=I.position-S.position,z=I.time-S.time;e.velocity=T/z,e.velocity/=2,Math.abs(e.velocity)<p.freeMode.minimumVelocity&&(e.velocity=0),(z>150||le()-I.time>300)&&(e.velocity=0)}else e.velocity=0;e.velocity*=p.freeMode.momentumVelocityRatio,a.velocities.length=0;let b=1e3*p.freeMode.momentumRatio;const g=e.velocity*b;let m=e.translate+g;v&&(m=-m);let y=!1,E;const k=Math.abs(e.velocity)*20*p.freeMode.momentumBounceRatio;let _;if(m<e.maxTranslate())p.freeMode.momentumBounce?(m+e.maxTranslate()<-k&&(m=e.maxTranslate()-k),E=e.maxTranslate(),y=!0,a.allowMomentumBounce=!0):m=e.maxTranslate(),p.loop&&p.centeredSlides&&(_=!0);else if(m>e.minTranslate())p.freeMode.momentumBounce?(m-e.minTranslate()>k&&(m=e.minTranslate()+k),E=e.minTranslate(),y=!0,a.allowMomentumBounce=!0):m=e.minTranslate(),p.loop&&p.centeredSlides&&(_=!0);else if(p.freeMode.sticky){let I;for(let S=0;S<w.length;S+=1)if(w[S]>-m){I=S;break}Math.abs(w[I]-m)<Math.abs(w[I-1]-m)||e.swipeDirection==="next"?m=w[I]:m=w[I-1],m=-m}if(_&&r("transitionEnd",()=>{e.loopFix()}),e.velocity!==0){if(v?b=Math.abs((-m-e.translate)/e.velocity):b=Math.abs((m-e.translate)/e.velocity),p.freeMode.sticky){const I=Math.abs((v?-m:m)-e.translate),S=e.slidesSizesGrid[e.activeIndex];I<S?b=p.speed:I<2*S?b=p.speed*1.5:b=p.speed*2.5}}else if(p.freeMode.sticky){e.slideToClosest();return}p.freeMode.momentumBounce&&y?(e.updateProgress(E),e.setTransition(b),e.setTranslate(m),e.transitionStart(!0,e.swipeDirection),e.animating=!0,He(u,()=>{!e||e.destroyed||!a.allowMomentumBounce||(t("momentumBounce"),e.setTransition(p.speed),setTimeout(()=>{e.setTranslate(E),He(u,()=>{!e||e.destroyed||e.transitionEnd()})},0))})):e.velocity?(t("_freeModeNoMomentumRelease"),e.updateProgress(m),e.setTransition(b),e.setTranslate(m),e.transitionStart(!0,e.swipeDirection),e.animating||(e.animating=!0,He(u,()=>{!e||e.destroyed||e.transitionEnd()}))):e.updateProgress(m),e.updateActiveIndex(),e.updateSlidesClasses()}else if(p.freeMode.sticky){e.slideToClosest();return}else p.freeMode&&t("_freeModeNoMomentumRelease");(!p.freeMode.momentum||h>=p.longSwipesMs)&&(t("_freeModeStaticRelease"),e.updateProgress(),e.updateActiveIndex(),e.updateSlidesClasses())}Object.assign(e,{freeMode:{onTouchStart:n,onTouchMove:f,onTouchEnd:c}})}function Ns(s){let{swiper:e,extendParams:i,on:t}=s;i({grid:{rows:1,fill:"column"}});let r,n,f,c;const d=()=>{let l=e.params.spaceBetween;return typeof l=="string"&&l.indexOf("%")>=0?l=parseFloat(l.replace("%",""))/100*e.size:typeof l=="string"&&(l=parseFloat(l)),l},o=l=>{const{slidesPerView:h}=e.params,{rows:b,fill:g}=e.params.grid,m=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:l.length;f=Math.floor(m/b),Math.floor(m/b)===m/b?r=m:r=Math.ceil(m/b)*b,h!=="auto"&&g==="row"&&(r=Math.max(r,h*b)),n=r/b},p=()=>{e.slides&&e.slides.forEach(l=>{l.swiperSlideGridSet&&(l.style.height="",l.style[e.getDirectionLabel("margin-top")]="")})},u=(l,h,b)=>{const{slidesPerGroup:g}=e.params,m=d(),{rows:y,fill:E}=e.params.grid,k=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:b.length;let _,I,S;if(E==="row"&&g>1){const T=Math.floor(l/(g*y)),z=l-y*g*T,P=T===0?g:Math.min(Math.ceil((k-T*y*g)/y),g);S=Math.floor(z/P),I=z-S*P+T*g,_=I+S*r/y,h.style.order=_}else E==="column"?(I=Math.floor(l/y),S=l-I*y,(I>f||I===f&&S===y-1)&&(S+=1,S>=y&&(S=0,I+=1))):(S=Math.floor(l/n),I=l-S*n);h.row=S,h.column=I,h.style.height=`calc((100% - ${(y-1)*m}px) / ${y})`,h.style[e.getDirectionLabel("margin-top")]=S!==0?m&&`${m}px`:"",h.swiperSlideGridSet=!0},v=(l,h)=>{const{centeredSlides:b,roundLengths:g}=e.params,m=d(),{rows:y}=e.params.grid;if(e.virtualSize=(l+m)*r,e.virtualSize=Math.ceil(e.virtualSize/y)-m,e.params.cssMode||(e.wrapperEl.style[e.getDirectionLabel("width")]=`${e.virtualSize+m}px`),b){const E=[];for(let k=0;k<h.length;k+=1){let _=h[k];g&&(_=Math.floor(_)),h[k]<e.virtualSize+h[0]&&E.push(_)}h.splice(0,h.length),h.push(...E)}},w=()=>{c=e.params.grid&&e.params.grid.rows>1},a=()=>{const{params:l,el:h}=e,b=l.grid&&l.grid.rows>1;c&&!b?(h.classList.remove(`${l.containerModifierClass}grid`,`${l.containerModifierClass}grid-column`),f=1,e.emitContainerClasses()):!c&&b&&(h.classList.add(`${l.containerModifierClass}grid`),l.grid.fill==="column"&&h.classList.add(`${l.containerModifierClass}grid-column`),e.emitContainerClasses()),c=b};t("init",w),t("update",a),e.grid={initSlides:o,unsetSlides:p,updateSlide:u,updateWrapperSize:v}}function Ys(s){const e=this,{params:i,slidesEl:t}=e;i.loop&&e.loopDestroy();const r=n=>{if(typeof n=="string"){const f=document.createElement("div");de(f,n),t.append(f.children[0]),de(f,"")}else t.append(n)};if(typeof s=="object"&&"length"in s)for(let n=0;n<s.length;n+=1)s[n]&&r(s[n]);else r(s);e.recalcSlides(),i.loop&&e.loopCreate(),(!i.observer||e.isElement)&&e.update()}function Fs(s){const e=this,{params:i,activeIndex:t,slidesEl:r}=e;i.loop&&e.loopDestroy();let n=t+1;const f=c=>{if(typeof c=="string"){const d=document.createElement("div");de(d,c),r.prepend(d.children[0]),de(d,"")}else r.prepend(c)};if(typeof s=="object"&&"length"in s){for(let c=0;c<s.length;c+=1)s[c]&&f(s[c]);n=t+s.length}else f(s);e.recalcSlides(),i.loop&&e.loopCreate(),(!i.observer||e.isElement)&&e.update(),e.slideTo(n,0,!1)}function Ws(s,e){const i=this,{params:t,activeIndex:r,slidesEl:n}=i;let f=r;t.loop&&(f-=i.loopedSlides,i.loopDestroy(),i.recalcSlides());const c=i.slides.length;if(s<=0){i.prependSlide(e);return}if(s>=c){i.appendSlide(e);return}let d=f>s?f+1:f;const o=[];for(let p=c-1;p>=s;p-=1){const u=i.slides[p];u.remove(),o.unshift(u)}if(typeof e=="object"&&"length"in e){for(let p=0;p<e.length;p+=1)e[p]&&n.append(e[p]);d=f>s?f+e.length:f}else n.append(e);for(let p=0;p<o.length;p+=1)n.append(o[p]);i.recalcSlides(),t.loop&&i.loopCreate(),(!t.observer||i.isElement)&&i.update(),t.loop?i.slideTo(d+i.loopedSlides,0,!1):i.slideTo(d,0,!1)}function qs(s){const e=this,{params:i,activeIndex:t}=e;let r=t;i.loop&&(r-=e.loopedSlides,e.loopDestroy());let n=r,f;if(typeof s=="object"&&"length"in s){for(let c=0;c<s.length;c+=1)f=s[c],e.slides[f]&&e.slides[f].remove(),f<n&&(n-=1);n=Math.max(n,0)}else f=s,e.slides[f]&&e.slides[f].remove(),f<n&&(n-=1),n=Math.max(n,0);e.recalcSlides(),i.loop&&e.loopCreate(),(!i.observer||e.isElement)&&e.update(),i.loop?e.slideTo(n+e.loopedSlides,0,!1):e.slideTo(n,0,!1)}function Us(){const s=this,e=[];for(let i=0;i<s.slides.length;i+=1)e.push(i);s.removeSlide(e)}function Ks(s){let{swiper:e}=s;Object.assign(e,{appendSlide:Ys.bind(e),prependSlide:Fs.bind(e),addSlide:Ws.bind(e),removeSlide:qs.bind(e),removeAllSlides:Us.bind(e)})}function _e(s){const{effect:e,swiper:i,on:t,setTranslate:r,setTransition:n,overwriteParams:f,perspective:c,recreateShadows:d,getEffectParams:o}=s;t("beforeInit",()=>{if(i.params.effect!==e)return;i.classNames.push(`${i.params.containerModifierClass}${e}`),c&&c()&&i.classNames.push(`${i.params.containerModifierClass}3d`);const u=f?f():{};Object.assign(i.params,u),Object.assign(i.originalParams,u)}),t("setTranslate _virtualUpdated",()=>{i.params.effect===e&&r()}),t("setTransition",(u,v)=>{i.params.effect===e&&n(v)}),t("transitionEnd",()=>{if(i.params.effect===e&&d){if(!o||!o().slideShadows)return;i.slides.forEach(u=>{u.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach(v=>v.remove())}),d()}});let p;t("virtualUpdate",()=>{i.params.effect===e&&(i.slides.length||(p=!0),requestAnimationFrame(()=>{p&&i.slides&&i.slides.length&&(r(),p=!1)}))})}function Ne(s,e){const i=xe(e);return i!==e&&(i.style.backfaceVisibility="hidden",i.style["-webkit-backface-visibility"]="hidden"),i}function it(s){let{swiper:e,duration:i,transformElements:t,allSlides:r}=s;const{activeIndex:n}=e,f=c=>c.parentElement?c.parentElement:e.slides.find(o=>o.shadowRoot&&o.shadowRoot===c.parentNode);if(e.params.virtualTranslate&&i!==0){let c=!1,d;r?d=t:d=t.filter(o=>{const p=o.classList.contains("swiper-slide-transform")?f(o):o;return e.getSlideIndex(p)===n}),d.forEach(o=>{He(o,()=>{if(c||!e||e.destroyed)return;c=!0,e.animating=!1;const p=new window.CustomEvent("transitionend",{bubbles:!0,cancelable:!0});e.wrapperEl.dispatchEvent(p)})})}}function Zs(s){let{swiper:e,extendParams:i,on:t}=s;i({fadeEffect:{crossFade:!1}}),_e({effect:"fade",swiper:e,on:t,setTranslate:()=>{const{slides:f}=e,c=e.params.fadeEffect;for(let d=0;d<f.length;d+=1){const o=e.slides[d];let u=-o.swiperSlideOffset;e.params.virtualTranslate||(u-=e.translate);let v=0;e.isHorizontal()||(v=u,u=0);const w=e.params.fadeEffect.crossFade?Math.max(1-Math.abs(o.progress),0):1+Math.min(Math.max(o.progress,-1),0),a=Ne(c,o);a.style.opacity=w,a.style.transform=`translate3d(${u}px, ${v}px, 0px)`}},setTransition:f=>{const c=e.slides.map(d=>xe(d));c.forEach(d=>{d.style.transitionDuration=`${f}ms`}),it({swiper:e,duration:f,transformElements:c,allSlides:!0})},overwriteParams:()=>({slidesPerView:1,slidesPerGroup:1,watchSlidesProgress:!0,spaceBetween:0,virtualTranslate:!e.params.cssMode})})}function Qs(s){let{swiper:e,extendParams:i,on:t}=s;i({cubeEffect:{slideShadows:!0,shadow:!0,shadowOffset:20,shadowScale:.94}});const r=(d,o,p)=>{let u=p?d.querySelector(".swiper-slide-shadow-left"):d.querySelector(".swiper-slide-shadow-top"),v=p?d.querySelector(".swiper-slide-shadow-right"):d.querySelector(".swiper-slide-shadow-bottom");u||(u=oe("div",`swiper-slide-shadow-cube swiper-slide-shadow-${p?"left":"top"}`.split(" ")),d.append(u)),v||(v=oe("div",`swiper-slide-shadow-cube swiper-slide-shadow-${p?"right":"bottom"}`.split(" ")),d.append(v)),u&&(u.style.opacity=Math.max(-o,0)),v&&(v.style.opacity=Math.max(o,0))};_e({effect:"cube",swiper:e,on:t,setTranslate:()=>{const{el:d,wrapperEl:o,slides:p,width:u,height:v,rtlTranslate:w,size:a,browser:l}=e,h=tt(e),b=e.params.cubeEffect,g=e.isHorizontal(),m=e.virtual&&e.params.virtual.enabled;let y=0,E;b.shadow&&(g?(E=e.wrapperEl.querySelector(".swiper-cube-shadow"),E||(E=oe("div","swiper-cube-shadow"),e.wrapperEl.append(E)),E.style.height=`${u}px`):(E=d.querySelector(".swiper-cube-shadow"),E||(E=oe("div","swiper-cube-shadow"),d.append(E))));for(let _=0;_<p.length;_+=1){const I=p[_];let S=_;m&&(S=parseInt(I.getAttribute("data-swiper-slide-index"),10));let T=S*90,z=Math.floor(T/360);w&&(T=-T,z=Math.floor(-T/360));const P=Math.max(Math.min(I.progress,1),-1);let C=0,L=0,j=0;S%4===0?(C=-z*4*a,j=0):(S-1)%4===0?(C=0,j=-z*4*a):(S-2)%4===0?(C=a+z*4*a,j=a):(S-3)%4===0&&(C=-a,j=3*a+a*4*z),w&&(C=-C),g||(L=C,C=0);const O=`rotateX(${h(g?0:-T)}deg) rotateY(${h(g?T:0)}deg) translate3d(${C}px, ${L}px, ${j}px)`;P<=1&&P>-1&&(y=S*90+P*90,w&&(y=-S*90-P*90)),I.style.transform=O,b.slideShadows&&r(I,P,g)}if(o.style.transformOrigin=`50% 50% -${a/2}px`,o.style["-webkit-transform-origin"]=`50% 50% -${a/2}px`,b.shadow)if(g)E.style.transform=`translate3d(0px, ${u/2+b.shadowOffset}px, ${-u/2}px) rotateX(89.99deg) rotateZ(0deg) scale(${b.shadowScale})`;else{const _=Math.abs(y)-Math.floor(Math.abs(y)/90)*90,I=1.5-(Math.sin(_*2*Math.PI/360)/2+Math.cos(_*2*Math.PI/360)/2),S=b.shadowScale,T=b.shadowScale/I,z=b.shadowOffset;E.style.transform=`scale3d(${S}, 1, ${T}) translate3d(0px, ${v/2+z}px, ${-v/2/T}px) rotateX(-89.99deg)`}const k=(l.isSafari||l.isWebView)&&l.needPerspectiveFix?-a/2:0;o.style.transform=`translate3d(0px,0,${k}px) rotateX(${h(e.isHorizontal()?0:y)}deg) rotateY(${h(e.isHorizontal()?-y:0)}deg)`,o.style.setProperty("--swiper-cube-translate-z",`${k}px`)},setTransition:d=>{const{el:o,slides:p}=e;if(p.forEach(u=>{u.style.transitionDuration=`${d}ms`,u.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach(v=>{v.style.transitionDuration=`${d}ms`})}),e.params.cubeEffect.shadow&&!e.isHorizontal()){const u=o.querySelector(".swiper-cube-shadow");u&&(u.style.transitionDuration=`${d}ms`)}},recreateShadows:()=>{const d=e.isHorizontal();e.slides.forEach(o=>{const p=Math.max(Math.min(o.progress,1),-1);r(o,p,d)})},getEffectParams:()=>e.params.cubeEffect,perspective:()=>!0,overwriteParams:()=>({slidesPerView:1,slidesPerGroup:1,watchSlidesProgress:!0,resistanceRatio:0,spaceBetween:0,centeredSlides:!1,virtualTranslate:!0})})}function Ce(s,e,i){const t=`swiper-slide-shadow${i?`-${i}`:""}${s?` swiper-slide-shadow-${s}`:""}`,r=xe(e);let n=r.querySelector(`.${t.split(" ").join(".")}`);return n||(n=oe("div",t.split(" ")),r.append(n)),n}function Js(s){let{swiper:e,extendParams:i,on:t}=s;i({flipEffect:{slideShadows:!0,limitRotation:!0}});const r=(d,o)=>{let p=e.isHorizontal()?d.querySelector(".swiper-slide-shadow-left"):d.querySelector(".swiper-slide-shadow-top"),u=e.isHorizontal()?d.querySelector(".swiper-slide-shadow-right"):d.querySelector(".swiper-slide-shadow-bottom");p||(p=Ce("flip",d,e.isHorizontal()?"left":"top")),u||(u=Ce("flip",d,e.isHorizontal()?"right":"bottom")),p&&(p.style.opacity=Math.max(-o,0)),u&&(u.style.opacity=Math.max(o,0))};_e({effect:"flip",swiper:e,on:t,setTranslate:()=>{const{slides:d,rtlTranslate:o}=e,p=e.params.flipEffect,u=tt(e);for(let v=0;v<d.length;v+=1){const w=d[v];let a=w.progress;e.params.flipEffect.limitRotation&&(a=Math.max(Math.min(w.progress,1),-1));const l=w.swiperSlideOffset;let b=-180*a,g=0,m=e.params.cssMode?-l-e.translate:-l,y=0;e.isHorizontal()?o&&(b=-b):(y=m,m=0,g=-b,b=0),w.style.zIndex=-Math.abs(Math.round(a))+d.length,p.slideShadows&&r(w,a);const E=`translate3d(${m}px, ${y}px, 0px) rotateX(${u(g)}deg) rotateY(${u(b)}deg)`,k=Ne(p,w);k.style.transform=E}},setTransition:d=>{const o=e.slides.map(p=>xe(p));o.forEach(p=>{p.style.transitionDuration=`${d}ms`,p.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach(u=>{u.style.transitionDuration=`${d}ms`})}),it({swiper:e,duration:d,transformElements:o})},recreateShadows:()=>{e.params.flipEffect,e.slides.forEach(d=>{let o=d.progress;e.params.flipEffect.limitRotation&&(o=Math.max(Math.min(d.progress,1),-1)),r(d,o)})},getEffectParams:()=>e.params.flipEffect,perspective:()=>!0,overwriteParams:()=>({slidesPerView:1,slidesPerGroup:1,watchSlidesProgress:!0,spaceBetween:0,virtualTranslate:!e.params.cssMode})})}function er(s){let{swiper:e,extendParams:i,on:t}=s;i({coverflowEffect:{rotate:50,stretch:0,depth:100,scale:1,modifier:1,slideShadows:!0}}),_e({effect:"coverflow",swiper:e,on:t,setTranslate:()=>{const{width:f,height:c,slides:d,slidesSizesGrid:o}=e,p=e.params.coverflowEffect,u=e.isHorizontal(),v=e.translate,w=u?-v+f/2:-v+c/2,a=u?p.rotate:-p.rotate,l=p.depth,h=tt(e);for(let b=0,g=d.length;b<g;b+=1){const m=d[b],y=o[b],E=m.swiperSlideOffset,k=(w-E-y/2)/y,_=typeof p.modifier=="function"?p.modifier(k):k*p.modifier;let I=u?a*_:0,S=u?0:a*_,T=-l*Math.abs(_),z=p.stretch;typeof z=="string"&&z.indexOf("%")!==-1&&(z=parseFloat(p.stretch)/100*y);let P=u?0:z*_,C=u?z*_:0,L=1-(1-p.scale)*Math.abs(_);Math.abs(C)<.001&&(C=0),Math.abs(P)<.001&&(P=0),Math.abs(T)<.001&&(T=0),Math.abs(I)<.001&&(I=0),Math.abs(S)<.001&&(S=0),Math.abs(L)<.001&&(L=0);const j=`translate3d(${C}px,${P}px,${T}px)  rotateX(${h(S)}deg) rotateY(${h(I)}deg) scale(${L})`,O=Ne(p,m);if(O.style.transform=j,m.style.zIndex=-Math.abs(Math.round(_))+1,p.slideShadows){let x=u?m.querySelector(".swiper-slide-shadow-left"):m.querySelector(".swiper-slide-shadow-top"),M=u?m.querySelector(".swiper-slide-shadow-right"):m.querySelector(".swiper-slide-shadow-bottom");x||(x=Ce("coverflow",m,u?"left":"top")),M||(M=Ce("coverflow",m,u?"right":"bottom")),x&&(x.style.opacity=_>0?_:0),M&&(M.style.opacity=-_>0?-_:0)}}},setTransition:f=>{e.slides.map(d=>xe(d)).forEach(d=>{d.style.transitionDuration=`${f}ms`,d.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach(o=>{o.style.transitionDuration=`${f}ms`})})},perspective:()=>!0,overwriteParams:()=>({watchSlidesProgress:!0})})}function tr(s){let{swiper:e,extendParams:i,on:t}=s;i({creativeEffect:{limitProgress:1,shadowPerProgress:!1,progressMultiplier:1,perspective:!0,prev:{translate:[0,0,0],rotate:[0,0,0],opacity:1,scale:1},next:{translate:[0,0,0],rotate:[0,0,0],opacity:1,scale:1}}});const r=c=>typeof c=="string"?c:`${c}px`;_e({effect:"creative",swiper:e,on:t,setTranslate:()=>{const{slides:c,wrapperEl:d,slidesSizesGrid:o}=e,p=e.params.creativeEffect,{progressMultiplier:u}=p,v=e.params.centeredSlides,w=tt(e);if(v){const a=o[0]/2-e.params.slidesOffsetBefore||0;d.style.transform=`translateX(calc(50% - ${a}px))`}for(let a=0;a<c.length;a+=1){const l=c[a],h=l.progress,b=Math.min(Math.max(l.progress,-p.limitProgress),p.limitProgress);let g=b;v||(g=Math.min(Math.max(l.originalProgress,-p.limitProgress),p.limitProgress));const m=l.swiperSlideOffset,y=[e.params.cssMode?-m-e.translate:-m,0,0],E=[0,0,0];let k=!1;e.isHorizontal()||(y[1]=y[0],y[0]=0);let _={translate:[0,0,0],rotate:[0,0,0],scale:1,opacity:1};b<0?(_=p.next,k=!0):b>0&&(_=p.prev,k=!0),y.forEach((L,j)=>{y[j]=`calc(${L}px + (${r(_.translate[j])} * ${Math.abs(b*u)}))`}),E.forEach((L,j)=>{let O=_.rotate[j]*Math.abs(b*u);E[j]=O}),l.style.zIndex=-Math.abs(Math.round(h))+c.length;const I=y.join(", "),S=`rotateX(${w(E[0])}deg) rotateY(${w(E[1])}deg) rotateZ(${w(E[2])}deg)`,T=g<0?`scale(${1+(1-_.scale)*g*u})`:`scale(${1-(1-_.scale)*g*u})`,z=g<0?1+(1-_.opacity)*g*u:1-(1-_.opacity)*g*u,P=`translate3d(${I}) ${S} ${T}`;if(k&&_.shadow||!k){let L=l.querySelector(".swiper-slide-shadow");if(!L&&_.shadow&&(L=Ce("creative",l)),L){const j=p.shadowPerProgress?b*(1/p.limitProgress):b;L.style.opacity=Math.min(Math.max(Math.abs(j),0),1)}}const C=Ne(p,l);C.style.transform=P,C.style.opacity=z,_.origin&&(C.style.transformOrigin=_.origin)}},setTransition:c=>{const d=e.slides.map(o=>xe(o));d.forEach(o=>{o.style.transitionDuration=`${c}ms`,o.querySelectorAll(".swiper-slide-shadow").forEach(p=>{p.style.transitionDuration=`${c}ms`})}),it({swiper:e,duration:c,transformElements:d,allSlides:!0})},perspective:()=>e.params.creativeEffect.perspective,overwriteParams:()=>({watchSlidesProgress:!0,virtualTranslate:!e.params.cssMode})})}function ir(s){let{swiper:e,extendParams:i,on:t}=s;i({cardsEffect:{slideShadows:!0,rotate:!0,perSlideRotate:2,perSlideOffset:8}}),_e({effect:"cards",swiper:e,on:t,setTranslate:()=>{const{slides:f,activeIndex:c,rtlTranslate:d}=e,o=e.params.cardsEffect,{startTranslate:p,isTouched:u}=e.touchEventsData,v=d?-e.translate:e.translate;for(let w=0;w<f.length;w+=1){const a=f[w],l=a.progress,h=Math.min(Math.max(l,-4),4);let b=a.swiperSlideOffset;e.params.centeredSlides&&!e.params.cssMode&&(e.wrapperEl.style.transform=`translateX(${e.minTranslate()}px)`),e.params.centeredSlides&&e.params.cssMode&&(b-=f[0].swiperSlideOffset);let g=e.params.cssMode?-b-e.translate:-b,m=0;const y=-100*Math.abs(h);let E=1,k=-o.perSlideRotate*h,_=o.perSlideOffset-Math.abs(h)*.75;const I=e.virtual&&e.params.virtual.enabled?e.virtual.from+w:w,S=(I===c||I===c-1)&&h>0&&h<1&&(u||e.params.cssMode)&&v<p,T=(I===c||I===c+1)&&h<0&&h>-1&&(u||e.params.cssMode)&&v>p;if(S||T){const L=(1-Math.abs((Math.abs(h)-.5)/.5))**.5;k+=-28*h*L,E+=-.5*L,_+=96*L,m=`${-25*L*Math.abs(h)}%`}if(h<0?g=`calc(${g}px ${d?"-":"+"} (${_*Math.abs(h)}%))`:h>0?g=`calc(${g}px ${d?"-":"+"} (-${_*Math.abs(h)}%))`:g=`${g}px`,!e.isHorizontal()){const L=m;m=g,g=L}const z=h<0?`${1+(1-E)*h}`:`${1-(1-E)*h}`,P=`
        translate3d(${g}, ${m}, ${y}px)
        rotateZ(${o.rotate?d?-k:k:0}deg)
        scale(${z})
      `;if(o.slideShadows){let L=a.querySelector(".swiper-slide-shadow");L||(L=Ce("cards",a)),L&&(L.style.opacity=Math.min(Math.max((Math.abs(h)-.5)/.5,0),1))}a.style.zIndex=-Math.abs(Math.round(l))+f.length;const C=Ne(o,a);C.style.transform=P}},setTransition:f=>{const c=e.slides.map(d=>xe(d));c.forEach(d=>{d.style.transitionDuration=`${f}ms`,d.querySelectorAll(".swiper-slide-shadow").forEach(o=>{o.style.transitionDuration=`${f}ms`})}),it({swiper:e,duration:f,transformElements:c})},perspective:()=>!0,overwriteParams:()=>({_loopSwapReset:!1,watchSlidesProgress:!0,loopAdditionalSlides:e.params.cardsEffect.rotate?3:2,centeredSlides:!0,virtualTranslate:!e.params.cssMode})})}const sr=[Is,zs,Ls,ks,$s,As,js,Ds,Os,Vs,Bs,Gs,Hs,Rs,Xs,Ns,Ks,Zs,Qs,Js,er,tr,ir];ne.use(sr);const st=["eventsPrefix","injectStyles","injectStylesUrls","modules","init","_direction","oneWayMovement","swiperElementNodeName","touchEventsTarget","initialSlide","_speed","cssMode","updateOnWindowResize","resizeObserver","nested","focusableElements","_enabled","_width","_height","preventInteractionOnTransition","userAgent","url","_edgeSwipeDetection","_edgeSwipeThreshold","_freeMode","_autoHeight","setWrapperSize","virtualTranslate","_effect","breakpoints","breakpointsBase","_spaceBetween","_slidesPerView","maxBackfaceHiddenSlides","_grid","_slidesPerGroup","_slidesPerGroupSkip","_slidesPerGroupAuto","_centeredSlides","_centeredSlidesBounds","_slidesOffsetBefore","_slidesOffsetAfter","normalizeSlideIndex","_centerInsufficientSlides","_watchOverflow","roundLengths","touchRatio","touchAngle","simulateTouch","_shortSwipes","_longSwipes","longSwipesRatio","longSwipesMs","_followFinger","allowTouchMove","_threshold","touchMoveStopPropagation","touchStartPreventDefault","touchStartForcePreventDefault","touchReleaseOnEdges","uniqueNavElements","_resistance","_resistanceRatio","_watchSlidesProgress","_grabCursor","preventClicks","preventClicksPropagation","_slideToClickedSlide","_loop","loopAdditionalSlides","loopAddBlankSlides","loopPreventsSliding","_rewind","_allowSlidePrev","_allowSlideNext","_swipeHandler","_noSwiping","noSwipingClass","noSwipingSelector","passiveListeners","containerModifierClass","slideClass","slideActiveClass","slideVisibleClass","slideFullyVisibleClass","slideNextClass","slidePrevClass","slideBlankClass","wrapperClass","lazyPreloaderClass","lazyPreloadPrevNext","runCallbacksOnInit","observer","observeParents","observeSlideChildren","a11y","_autoplay","_controller","coverflowEffect","cubeEffect","fadeEffect","flipEffect","creativeEffect","cardsEffect","hashNavigation","history","keyboard","mousewheel","_navigation","_pagination","parallax","_scrollbar","_thumbs","virtual","zoom","control"];function Pe(s){return typeof s=="object"&&s!==null&&s.constructor&&Object.prototype.toString.call(s).slice(8,-1)==="Object"&&!s.__swiper__}function Pt(s,e){const i=["__proto__","constructor","prototype"];Object.keys(e).filter(t=>i.indexOf(t)<0).forEach(t=>{typeof s[t]>"u"?s[t]=e[t]:Pe(e[t])&&Pe(s[t])&&Object.keys(e[t]).length>0?e[t].__swiper__?s[t]=e[t]:Pt(s[t],e[t]):s[t]=e[t]})}function rr(s){return s===void 0&&(s={}),s.navigation&&typeof s.navigation.nextEl>"u"&&typeof s.navigation.prevEl>"u"}function nr(s){return s===void 0&&(s={}),s.pagination&&typeof s.pagination.el>"u"}function ar(s){return s===void 0&&(s={}),s.scrollbar&&typeof s.scrollbar.el>"u"}function Ze(s){return s===void 0&&(s=""),s.replace(/-[a-z]/g,e=>e.toUpperCase().replace("-",""))}function or(s){let{swiper:e,slides:i,passedParams:t,changedParams:r,nextEl:n,prevEl:f,scrollbarEl:c,paginationEl:d}=s;const o=r.filter(S=>S!=="children"&&S!=="direction"&&S!=="wrapperClass"),{params:p,pagination:u,navigation:v,scrollbar:w,virtual:a,thumbs:l}=e;let h,b,g,m,y,E,k,_;r.includes("thumbs")&&t.thumbs&&t.thumbs.swiper&&!t.thumbs.swiper.destroyed&&p.thumbs&&(!p.thumbs.swiper||p.thumbs.swiper.destroyed)&&(h=!0),r.includes("controller")&&t.controller&&t.controller.control&&p.controller&&!p.controller.control&&(b=!0),r.includes("pagination")&&t.pagination&&(t.pagination.el||d)&&(p.pagination||p.pagination===!1)&&u&&!u.el&&(g=!0),r.includes("scrollbar")&&t.scrollbar&&(t.scrollbar.el||c)&&(p.scrollbar||p.scrollbar===!1)&&w&&!w.el&&(m=!0),r.includes("navigation")&&t.navigation&&(t.navigation.prevEl||f)&&(t.navigation.nextEl||n)&&(p.navigation||p.navigation===!1)&&v&&!v.prevEl&&!v.nextEl&&(y=!0);const I=S=>{e[S]&&(e[S].destroy(),S==="navigation"?(e.isElement&&(e[S].prevEl.remove(),e[S].nextEl.remove()),p[S].prevEl=void 0,p[S].nextEl=void 0,e[S].prevEl=void 0,e[S].nextEl=void 0):(e.isElement&&e[S].el.remove(),p[S].el=void 0,e[S].el=void 0))};r.includes("loop")&&e.isElement&&(p.loop&&!t.loop?E=!0:!p.loop&&t.loop?k=!0:_=!0),o.forEach(S=>{if(Pe(p[S])&&Pe(t[S]))Object.assign(p[S],t[S]),(S==="navigation"||S==="pagination"||S==="scrollbar")&&"enabled"in t[S]&&!t[S].enabled&&I(S);else{const T=t[S];(T===!0||T===!1)&&(S==="navigation"||S==="pagination"||S==="scrollbar")?T===!1&&I(S):p[S]=t[S]}}),o.includes("controller")&&!b&&e.controller&&e.controller.control&&p.controller&&p.controller.control&&(e.controller.control=p.controller.control),r.includes("children")&&i&&a&&p.virtual.enabled?(a.slides=i,a.update(!0)):r.includes("virtual")&&a&&p.virtual.enabled&&(i&&(a.slides=i),a.update(!0)),r.includes("children")&&i&&p.loop&&(_=!0),h&&l.init()&&l.update(!0),b&&(e.controller.control=p.controller.control),g&&(e.isElement&&(!d||typeof d=="string")&&(d=document.createElement("div"),d.classList.add("swiper-pagination"),d.part.add("pagination"),e.el.appendChild(d)),d&&(p.pagination.el=d),u.init(),u.render(),u.update()),m&&(e.isElement&&(!c||typeof c=="string")&&(c=document.createElement("div"),c.classList.add("swiper-scrollbar"),c.part.add("scrollbar"),e.el.appendChild(c)),c&&(p.scrollbar.el=c),w.init(),w.updateSize(),w.setTranslate()),y&&(e.isElement&&((!n||typeof n=="string")&&(n=document.createElement("div"),n.classList.add("swiper-button-next"),de(n,e.hostEl.constructor.nextButtonSvg),n.part.add("button-next"),e.el.appendChild(n)),(!f||typeof f=="string")&&(f=document.createElement("div"),f.classList.add("swiper-button-prev"),de(f,e.hostEl.constructor.prevButtonSvg),f.part.add("button-prev"),e.el.appendChild(f))),n&&(p.navigation.nextEl=n),f&&(p.navigation.prevEl=f),v.init(),v.update()),r.includes("allowSlideNext")&&(e.allowSlideNext=t.allowSlideNext),r.includes("allowSlidePrev")&&(e.allowSlidePrev=t.allowSlidePrev),r.includes("direction")&&e.changeDirection(t.direction,!1),(E||_)&&e.loopDestroy(),(k||_)&&e.loopCreate(),e.update()}const Bt=s=>{if(parseFloat(s)===Number(s))return Number(s);if(s==="true"||s==="")return!0;if(s==="false")return!1;if(s==="null")return null;if(s!=="undefined"){if(typeof s=="string"&&s.includes("{")&&s.includes("}")&&s.includes('"')){let e;try{e=JSON.parse(s)}catch{e=s}return e}return s}},Gt=["a11y","autoplay","controller","cards-effect","coverflow-effect","creative-effect","cube-effect","fade-effect","flip-effect","free-mode","grid","hash-navigation","history","keyboard","mousewheel","navigation","pagination","parallax","scrollbar","thumbs","virtual","zoom"];function Ht(s,e,i){const t={},r={};Pt(t,Ct);const n=[...st,"on"],f=n.map(d=>d.replace(/_/,""));n.forEach(d=>{d=d.replace("_",""),typeof s[d]<"u"&&(r[d]=s[d])});const c=[...s.attributes];return typeof e=="string"&&typeof i<"u"&&c.push({name:e,value:Pe(i)?{...i}:i}),c.forEach(d=>{const o=Gt.find(p=>d.name.startsWith(`${p}-`));if(o){const p=Ze(o),u=Ze(d.name.split(`${o}-`)[1]);typeof r[p]>"u"&&(r[p]={}),r[p]===!0&&(r[p]={enabled:!0}),r[p][u]=Bt(d.value)}else{const p=Ze(d.name);if(!f.includes(p))return;const u=Bt(d.value);r[p]&&Gt.includes(d.name)&&!Pe(u)?(r[p].constructor!==Object&&(r[p]={}),r[p].enabled=!!u):r[p]=u}}),Pt(t,r),t.navigation?t.navigation={prevEl:".swiper-button-prev",nextEl:".swiper-button-next",...t.navigation!==!0?t.navigation:{}}:t.navigation===!1&&delete t.navigation,t.scrollbar?t.scrollbar={el:".swiper-scrollbar",...t.scrollbar!==!0?t.scrollbar:{}}:t.scrollbar===!1&&delete t.scrollbar,t.pagination?t.pagination={el:".swiper-pagination",...t.pagination!==!0?t.pagination:{}}:t.pagination===!1&&delete t.pagination,{params:t,passedParams:r}}const lr=":host{--swiper-theme-color:#007aff}:host{position:relative;display:block;margin-left:auto;margin-right:auto;z-index:1}.swiper{width:100%;height:100%;margin-left:auto;margin-right:auto;position:relative;overflow:hidden;list-style:none;padding:0;z-index:1;display:block}.swiper-vertical>.swiper-wrapper{flex-direction:column}.swiper-wrapper{position:relative;width:100%;height:100%;z-index:1;display:flex;transition-property:transform;transition-timing-function:var(--swiper-wrapper-transition-timing-function,initial);box-sizing:content-box}.swiper-android ::slotted(swiper-slide),.swiper-ios ::slotted(swiper-slide),.swiper-wrapper{transform:translate3d(0px,0,0)}.swiper-horizontal{touch-action:pan-y}.swiper-vertical{touch-action:pan-x}::slotted(swiper-slide){flex-shrink:0;width:100%;height:100%;position:relative;transition-property:transform;display:block}::slotted(.swiper-slide-invisible-blank){visibility:hidden}.swiper-autoheight,.swiper-autoheight ::slotted(swiper-slide){height:auto}.swiper-autoheight .swiper-wrapper{align-items:flex-start;transition-property:transform,height}.swiper-backface-hidden ::slotted(swiper-slide){transform:translateZ(0);-webkit-backface-visibility:hidden;backface-visibility:hidden}.swiper-3d.swiper-css-mode .swiper-wrapper{perspective:1200px}.swiper-3d .swiper-wrapper{transform-style:preserve-3d}.swiper-3d{perspective:1200px}.swiper-3d .swiper-cube-shadow,.swiper-3d ::slotted(swiper-slide){transform-style:preserve-3d}.swiper-css-mode>.swiper-wrapper{overflow:auto;scrollbar-width:none;-ms-overflow-style:none}.swiper-css-mode>.swiper-wrapper::-webkit-scrollbar{display:none}.swiper-css-mode ::slotted(swiper-slide){scroll-snap-align:start start}.swiper-css-mode.swiper-horizontal>.swiper-wrapper{scroll-snap-type:x mandatory}.swiper-css-mode.swiper-vertical>.swiper-wrapper{scroll-snap-type:y mandatory}.swiper-css-mode.swiper-free-mode>.swiper-wrapper{scroll-snap-type:none}.swiper-css-mode.swiper-free-mode ::slotted(swiper-slide){scroll-snap-align:none}.swiper-css-mode.swiper-centered>.swiper-wrapper::before{content:'';flex-shrink:0;order:9999}.swiper-css-mode.swiper-centered ::slotted(swiper-slide){scroll-snap-align:center center;scroll-snap-stop:always}.swiper-css-mode.swiper-centered.swiper-horizontal ::slotted(swiper-slide):first-child{margin-inline-start:var(--swiper-centered-offset-before)}.swiper-css-mode.swiper-centered.swiper-horizontal>.swiper-wrapper::before{height:100%;min-height:1px;width:var(--swiper-centered-offset-after)}.swiper-css-mode.swiper-centered.swiper-vertical ::slotted(swiper-slide):first-child{margin-block-start:var(--swiper-centered-offset-before)}.swiper-css-mode.swiper-centered.swiper-vertical>.swiper-wrapper::before{width:100%;min-width:1px;height:var(--swiper-centered-offset-after)}.swiper-virtual ::slotted(swiper-slide){-webkit-backface-visibility:hidden;transform:translateZ(0)}.swiper-virtual.swiper-css-mode .swiper-wrapper::after{content:'';position:absolute;left:0;top:0;pointer-events:none}.swiper-virtual.swiper-css-mode.swiper-horizontal .swiper-wrapper::after{height:1px;width:var(--swiper-virtual-size)}.swiper-virtual.swiper-css-mode.swiper-vertical .swiper-wrapper::after{width:1px;height:var(--swiper-virtual-size)}:host{--swiper-navigation-size:44px}.swiper-button-next,.swiper-button-prev{position:absolute;top:var(--swiper-navigation-top-offset,50%);width:calc(var(--swiper-navigation-size)/ 44 * 27);height:var(--swiper-navigation-size);margin-top:calc(0px - (var(--swiper-navigation-size)/ 2));z-index:10;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--swiper-navigation-color,var(--swiper-theme-color))}.swiper-button-next.swiper-button-disabled,.swiper-button-prev.swiper-button-disabled{opacity:.35;cursor:auto;pointer-events:none}.swiper-button-next.swiper-button-hidden,.swiper-button-prev.swiper-button-hidden{opacity:0;cursor:auto;pointer-events:none}.swiper-navigation-disabled .swiper-button-next,.swiper-navigation-disabled .swiper-button-prev{display:none!important}.swiper-button-next svg,.swiper-button-prev svg{width:100%;height:100%;object-fit:contain;transform-origin:center}.swiper-rtl .swiper-button-next svg,.swiper-rtl .swiper-button-prev svg{transform:rotate(180deg)}.swiper-button-prev,.swiper-rtl .swiper-button-next{left:var(--swiper-navigation-sides-offset,10px);right:auto}.swiper-button-next,.swiper-rtl .swiper-button-prev{right:var(--swiper-navigation-sides-offset,10px);left:auto}.swiper-button-lock{display:none}.swiper-pagination{position:absolute;text-align:center;transition:.3s opacity;transform:translate3d(0,0,0);z-index:10}.swiper-pagination.swiper-pagination-hidden{opacity:0}.swiper-pagination-disabled>.swiper-pagination,.swiper-pagination.swiper-pagination-disabled{display:none!important}.swiper-horizontal>.swiper-pagination-bullets,.swiper-pagination-bullets.swiper-pagination-horizontal,.swiper-pagination-custom,.swiper-pagination-fraction{bottom:var(--swiper-pagination-bottom,8px);top:var(--swiper-pagination-top,auto);left:0;width:100%}.swiper-pagination-bullets-dynamic{overflow:hidden;font-size:0}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{transform:scale(.33);position:relative}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active{transform:scale(1)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-main{transform:scale(1)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev{transform:scale(.66)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev-prev{transform:scale(.33)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next{transform:scale(.66)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next-next{transform:scale(.33)}.swiper-pagination-bullet{width:var(--swiper-pagination-bullet-width,var(--swiper-pagination-bullet-size,8px));height:var(--swiper-pagination-bullet-height,var(--swiper-pagination-bullet-size,8px));display:inline-block;border-radius:var(--swiper-pagination-bullet-border-radius,50%);background:var(--swiper-pagination-bullet-inactive-color,#000);opacity:var(--swiper-pagination-bullet-inactive-opacity, .2)}button.swiper-pagination-bullet{border:none;margin:0;padding:0;box-shadow:none;-webkit-appearance:none;appearance:none}.swiper-pagination-clickable .swiper-pagination-bullet{cursor:pointer}.swiper-pagination-bullet:only-child{display:none!important}.swiper-pagination-bullet-active{opacity:var(--swiper-pagination-bullet-opacity, 1);background:var(--swiper-pagination-color,var(--swiper-theme-color))}.swiper-pagination-vertical.swiper-pagination-bullets,.swiper-vertical>.swiper-pagination-bullets{right:var(--swiper-pagination-right,8px);left:var(--swiper-pagination-left,auto);top:50%;transform:translate3d(0px,-50%,0)}.swiper-pagination-vertical.swiper-pagination-bullets .swiper-pagination-bullet,.swiper-vertical>.swiper-pagination-bullets .swiper-pagination-bullet{margin:var(--swiper-pagination-bullet-vertical-gap,6px) 0;display:block}.swiper-pagination-vertical.swiper-pagination-bullets.swiper-pagination-bullets-dynamic,.swiper-vertical>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic{top:50%;transform:translateY(-50%);width:8px}.swiper-pagination-vertical.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet,.swiper-vertical>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{display:inline-block;transition:.2s transform,.2s top}.swiper-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet,.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet{margin:0 var(--swiper-pagination-bullet-horizontal-gap,4px)}.swiper-horizontal>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic,.swiper-pagination-horizontal.swiper-pagination-bullets.swiper-pagination-bullets-dynamic{left:50%;transform:translateX(-50%);white-space:nowrap}.swiper-horizontal>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet,.swiper-pagination-horizontal.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{transition:.2s transform,.2s left}.swiper-horizontal.swiper-rtl>.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{transition:.2s transform,.2s right}.swiper-pagination-fraction{color:var(--swiper-pagination-fraction-color,inherit)}.swiper-pagination-progressbar{background:var(--swiper-pagination-progressbar-bg-color,rgba(0,0,0,.25));position:absolute}.swiper-pagination-progressbar .swiper-pagination-progressbar-fill{background:var(--swiper-pagination-color,var(--swiper-theme-color));position:absolute;left:0;top:0;width:100%;height:100%;transform:scale(0);transform-origin:left top}.swiper-rtl .swiper-pagination-progressbar .swiper-pagination-progressbar-fill{transform-origin:right top}.swiper-horizontal>.swiper-pagination-progressbar,.swiper-pagination-progressbar.swiper-pagination-horizontal,.swiper-pagination-progressbar.swiper-pagination-vertical.swiper-pagination-progressbar-opposite,.swiper-vertical>.swiper-pagination-progressbar.swiper-pagination-progressbar-opposite{width:100%;height:var(--swiper-pagination-progressbar-size,4px);left:0;top:0}.swiper-horizontal>.swiper-pagination-progressbar.swiper-pagination-progressbar-opposite,.swiper-pagination-progressbar.swiper-pagination-horizontal.swiper-pagination-progressbar-opposite,.swiper-pagination-progressbar.swiper-pagination-vertical,.swiper-vertical>.swiper-pagination-progressbar{width:var(--swiper-pagination-progressbar-size,4px);height:100%;left:0;top:0}.swiper-pagination-lock{display:none}.swiper-scrollbar{border-radius:var(--swiper-scrollbar-border-radius,10px);position:relative;touch-action:none;background:var(--swiper-scrollbar-bg-color,rgba(0,0,0,.1))}.swiper-scrollbar-disabled>.swiper-scrollbar,.swiper-scrollbar.swiper-scrollbar-disabled{display:none!important}.swiper-horizontal>.swiper-scrollbar,.swiper-scrollbar.swiper-scrollbar-horizontal{position:absolute;left:var(--swiper-scrollbar-sides-offset,1%);bottom:var(--swiper-scrollbar-bottom,4px);top:var(--swiper-scrollbar-top,auto);z-index:50;height:var(--swiper-scrollbar-size,4px);width:calc(100% - 2 * var(--swiper-scrollbar-sides-offset,1%))}.swiper-scrollbar.swiper-scrollbar-vertical,.swiper-vertical>.swiper-scrollbar{position:absolute;left:var(--swiper-scrollbar-left,auto);right:var(--swiper-scrollbar-right,4px);top:var(--swiper-scrollbar-sides-offset,1%);z-index:50;width:var(--swiper-scrollbar-size,4px);height:calc(100% - 2 * var(--swiper-scrollbar-sides-offset,1%))}.swiper-scrollbar-drag{height:100%;width:100%;position:relative;background:var(--swiper-scrollbar-drag-bg-color,rgba(0,0,0,.5));border-radius:var(--swiper-scrollbar-border-radius,10px);left:0;top:0}.swiper-scrollbar-cursor-drag{cursor:move}.swiper-scrollbar-lock{display:none}::slotted(.swiper-slide-zoomed){cursor:move;touch-action:none}.swiper .swiper-notification{position:absolute;left:0;top:0;pointer-events:none;opacity:0;z-index:-1000}.swiper-free-mode>.swiper-wrapper{transition-timing-function:ease-out;margin:0 auto}.swiper-grid>.swiper-wrapper{flex-wrap:wrap}.swiper-grid-column>.swiper-wrapper{flex-wrap:wrap;flex-direction:column}.swiper-fade.swiper-free-mode ::slotted(swiper-slide){transition-timing-function:ease-out}.swiper-fade ::slotted(swiper-slide){pointer-events:none;transition-property:opacity}.swiper-fade ::slotted(swiper-slide) ::slotted(swiper-slide){pointer-events:none}.swiper-fade ::slotted(.swiper-slide-active){pointer-events:auto}.swiper-fade ::slotted(.swiper-slide-active) ::slotted(.swiper-slide-active){pointer-events:auto}.swiper.swiper-cube{overflow:visible}.swiper-cube ::slotted(swiper-slide){pointer-events:none;-webkit-backface-visibility:hidden;backface-visibility:hidden;z-index:1;visibility:hidden;transform-origin:0 0;width:100%;height:100%}.swiper-cube ::slotted(swiper-slide) ::slotted(swiper-slide){pointer-events:none}.swiper-cube.swiper-rtl ::slotted(swiper-slide){transform-origin:100% 0}.swiper-cube ::slotted(.swiper-slide-active),.swiper-cube ::slotted(.swiper-slide-active) ::slotted(.swiper-slide-active){pointer-events:auto}.swiper-cube ::slotted(.swiper-slide-active),.swiper-cube ::slotted(.swiper-slide-next),.swiper-cube ::slotted(.swiper-slide-prev){pointer-events:auto;visibility:visible}.swiper-cube .swiper-cube-shadow{position:absolute;left:0;bottom:0px;width:100%;height:100%;opacity:.6;z-index:0}.swiper-cube .swiper-cube-shadow:before{content:'';background:#000;position:absolute;left:0;top:0;bottom:0;right:0;filter:blur(50px)}.swiper-cube ::slotted(.swiper-slide-next)+::slotted(swiper-slide){pointer-events:auto;visibility:visible}.swiper.swiper-flip{overflow:visible}.swiper-flip ::slotted(swiper-slide){pointer-events:none;-webkit-backface-visibility:hidden;backface-visibility:hidden;z-index:1}.swiper-flip ::slotted(swiper-slide) ::slotted(swiper-slide){pointer-events:none}.swiper-flip ::slotted(.swiper-slide-active),.swiper-flip ::slotted(.swiper-slide-active) ::slotted(.swiper-slide-active){pointer-events:auto}.swiper-creative ::slotted(swiper-slide){-webkit-backface-visibility:hidden;backface-visibility:hidden;overflow:hidden;transition-property:transform,opacity,height}.swiper.swiper-cards{overflow:visible}.swiper-cards ::slotted(swiper-slide){transform-origin:center bottom;-webkit-backface-visibility:hidden;backface-visibility:hidden;overflow:hidden}",pr="::slotted(.swiper-slide-shadow),::slotted(.swiper-slide-shadow-bottom),::slotted(.swiper-slide-shadow-left),::slotted(.swiper-slide-shadow-right),::slotted(.swiper-slide-shadow-top){position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:10}::slotted(.swiper-slide-shadow){background:rgba(0,0,0,.15)}::slotted(.swiper-slide-shadow-left){background-image:linear-gradient(to left,rgba(0,0,0,.5),rgba(0,0,0,0))}::slotted(.swiper-slide-shadow-right){background-image:linear-gradient(to right,rgba(0,0,0,.5),rgba(0,0,0,0))}::slotted(.swiper-slide-shadow-top){background-image:linear-gradient(to top,rgba(0,0,0,.5),rgba(0,0,0,0))}::slotted(.swiper-slide-shadow-bottom){background-image:linear-gradient(to bottom,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-lazy-preloader{animation:swiper-preloader-spin 1s infinite linear;width:42px;height:42px;position:absolute;left:50%;top:50%;margin-left:-21px;margin-top:-21px;z-index:10;transform-origin:50%;box-sizing:border-box;border:4px solid var(--swiper-preloader-color,var(--swiper-theme-color));border-radius:50%;border-top-color:transparent}@keyframes swiper-preloader-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}::slotted(.swiper-slide-shadow-cube.swiper-slide-shadow-bottom),::slotted(.swiper-slide-shadow-cube.swiper-slide-shadow-left),::slotted(.swiper-slide-shadow-cube.swiper-slide-shadow-right),::slotted(.swiper-slide-shadow-cube.swiper-slide-shadow-top){z-index:0;-webkit-backface-visibility:hidden;backface-visibility:hidden}::slotted(.swiper-slide-shadow-flip.swiper-slide-shadow-bottom),::slotted(.swiper-slide-shadow-flip.swiper-slide-shadow-left),::slotted(.swiper-slide-shadow-flip.swiper-slide-shadow-right),::slotted(.swiper-slide-shadow-flip.swiper-slide-shadow-top){z-index:0;-webkit-backface-visibility:hidden;backface-visibility:hidden}::slotted(.swiper-zoom-container){width:100%;height:100%;display:flex;justify-content:center;align-items:center;text-align:center}::slotted(.swiper-zoom-container)>canvas,::slotted(.swiper-zoom-container)>img,::slotted(.swiper-zoom-container)>svg{max-width:100%;max-height:100%;object-fit:contain}";class dr{}const ti=typeof window>"u"||typeof HTMLElement>"u"?dr:HTMLElement,Rt=`<svg width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"/></svg>
    `,ii=(s,e)=>{if(typeof CSSStyleSheet<"u"&&s.adoptedStyleSheets){const i=new CSSStyleSheet;i.replaceSync(e),s.adoptedStyleSheets=[i]}else{const i=document.createElement("style");i.rel="stylesheet",i.textContent=e,s.appendChild(i)}};class si extends ti{constructor(){super(),this.attachShadow({mode:"open"})}static get nextButtonSvg(){return Rt}static get prevButtonSvg(){return Rt.replace("/></svg>",' transform-origin="center" transform="rotate(180)"/></svg>')}cssStyles(){return[lr,...this.injectStyles&&Array.isArray(this.injectStyles)?this.injectStyles:[]].join(`
`)}cssLinks(){return this.injectStylesUrls||[]}calcSlideSlots(){const e=this.slideSlots||0,i=[...this.querySelectorAll("[slot^=slide-]")].map(t=>parseInt(t.getAttribute("slot").split("slide-")[1],10));if(this.slideSlots=i.length?Math.max(...i)+1:0,!!this.rendered){if(this.slideSlots>e)for(let t=e;t<this.slideSlots;t+=1){const r=document.createElement("swiper-slide");r.setAttribute("part",`slide slide-${t+1}`);const n=document.createElement("slot");n.setAttribute("name",`slide-${t+1}`),r.appendChild(n),this.shadowRoot.querySelector(".swiper-wrapper").appendChild(r)}else if(this.slideSlots<e){const t=this.swiper.slides;for(let r=t.length-1;r>=0;r-=1)r>this.slideSlots&&t[r].remove()}}}render(){if(this.rendered)return;this.calcSlideSlots();let e=this.cssStyles();this.slideSlots>0&&(e=e.replace(/::slotted\(([a-z-0-9.]*)\)/g,"$1")),e.length&&ii(this.shadowRoot,e),this.cssLinks().forEach(t=>{if(this.shadowRoot.querySelector(`link[href="${t}"]`))return;const n=document.createElement("link");n.rel="stylesheet",n.href=t,this.shadowRoot.appendChild(n)});const i=document.createElement("div");i.classList.add("swiper"),i.part="container",de(i,`
      <slot name="container-start"></slot>
      <div class="swiper-wrapper" part="wrapper">
        <slot></slot>
        ${Array.from({length:this.slideSlots}).map((t,r)=>`
        <swiper-slide part="slide slide-${r}">
          <slot name="slide-${r}"></slot>
        </swiper-slide>
        `).join("")}
      </div>
      <slot name="container-end"></slot>
      ${rr(this.passedParams)?`
        <div part="button-prev" class="swiper-button-prev">${this.constructor.prevButtonSvg}</div>
        <div part="button-next" class="swiper-button-next">${this.constructor.nextButtonSvg}</div>
      `:""}
      ${nr(this.passedParams)?`
        <div part="pagination" class="swiper-pagination"></div>
      `:""}
      ${ar(this.passedParams)?`
        <div part="scrollbar" class="swiper-scrollbar"></div>
      `:""}
    `),this.shadowRoot.appendChild(i),this.rendered=!0}initialize(){var e=this;if(this.swiper&&this.swiper.initialized)return;const{params:i,passedParams:t}=Ht(this);this.swiperParams=i,this.passedParams=t,delete this.swiperParams.init,this.render(),this.swiper=new ne(this.shadowRoot.querySelector(".swiper"),{...i.virtual?{}:{observer:!0},...i,touchEventsTarget:"container",onAny:function(r){r==="observerUpdate"&&e.calcSlideSlots();const n=i.eventsPrefix?`${i.eventsPrefix}${r.toLowerCase()}`:r.toLowerCase();for(var f=arguments.length,c=new Array(f>1?f-1:0),d=1;d<f;d++)c[d-1]=arguments[d];const o=new CustomEvent(n,{detail:c,bubbles:r!=="hashChange",cancelable:!0});e.dispatchEvent(o)}})}connectedCallback(){this.swiper&&this.swiper.initialized&&this.nested&&this.closest("swiper-slide")&&this.closest("swiper-slide").swiperLoopMoveDOM||this.init===!1||this.getAttribute("init")==="false"||this.initialize()}disconnectedCallback(){this.nested&&this.closest("swiper-slide")&&this.closest("swiper-slide").swiperLoopMoveDOM||this.swiper&&this.swiper.destroy&&this.swiper.destroy()}updateSwiperOnPropChange(e,i){const{params:t,passedParams:r}=Ht(this,e,i);this.passedParams=r,this.swiperParams=t,!(this.swiper&&this.swiper.params[e]===i)&&or({swiper:this.swiper,passedParams:this.passedParams,changedParams:[Ze(e)],...e==="navigation"&&r[e]?{prevEl:".swiper-button-prev",nextEl:".swiper-button-next"}:{},...e==="pagination"&&r[e]?{paginationEl:".swiper-pagination"}:{},...e==="scrollbar"&&r[e]?{scrollbarEl:".swiper-scrollbar"}:{}})}attributeChangedCallback(e,i,t){this.swiper&&this.swiper.initialized&&(i==="true"&&t===null&&(t=!1),this.updateSwiperOnPropChange(e,t))}static get observedAttributes(){return st.filter(i=>i.includes("_")).map(i=>i.replace(/[A-Z]/g,t=>`-${t}`).replace("_","").toLowerCase())}}st.forEach(s=>{s!=="init"&&(s=s.replace("_",""),Object.defineProperty(si.prototype,s,{configurable:!0,get(){return(this.passedParams||{})[s]},set(e){this.passedParams||(this.passedParams={}),this.passedParams[s]=e,this.swiper&&this.swiper.initialized&&this.updateSwiperOnPropChange(s,e)}}))});class cr extends ti{constructor(){super(),this.attachShadow({mode:"open"})}render(){const e=this.lazy||this.getAttribute("lazy")===""||this.getAttribute("lazy")==="true";if(ii(this.shadowRoot,pr),this.shadowRoot.appendChild(document.createElement("slot")),e){const i=document.createElement("div");i.classList.add("swiper-lazy-preloader"),i.part.add("preloader"),this.shadowRoot.appendChild(i)}}initialize(){this.render()}connectedCallback(){this.swiperLoopMoveDOM||this.initialize()}}const se=()=>{typeof window>"u"||(window.customElements.get("swiper-container")||window.customElements.define("swiper-container",si),window.customElements.get("swiper-slide")||window.customElements.define("swiper-slide",cr))};typeof window<"u"&&(window.SwiperElementRegisterParams=s=>{st.push(...s)});const fr={class:"swiper-virtual"},ur=["slides"],mr={class:"text-secondary"},wr={class:"d-flex justify-center gap-4 flex-wrap"},gr={__name:"DemoSwiperVirtualSlides",setup(s){se();const e=Array.from({length:500},(d,o)=>`Slides ${o+1}`),i=wt(null),t=wt(1),r=wt(500),n=d=>{var o;(o=i.value)==null||o.swiper.slideTo(d-1)},f=()=>{var d;(d=i.value)==null||d.swiper.prependSlide([`<swiper-slide>Slide ${--t.value} </swiper-slide>`,`<swiper-slide>Slide ${--t.value} </swiper-slide>`])},c=()=>{var d;(d=i.value)==null||d.swiper.appendSlide([`<swiper-slide>Slide ${++r.value} </swiper-slide>`])};return(d,o)=>(H(),R("section",fr,[pe("swiper-container",{ref_key:"swiperEl",ref:i,virtual:"true",slides:$(e),navigation:"true","slides-per-view":"5","space-between":"50","free-mode":"true","events-prefix":"swiper-",breakpoints:{1024:{slidesPerView:4,spaceBetween:40},768:{slidesPerView:3,spaceBetween:30},640:{slidesPerView:2,spaceBetween:20},320:{slidesPerView:1,spaceBetween:10}}},[(H(!0),R(K,null,J($(e),(p,u)=>(H(),R("swiper-slide",{key:u},[pe("div",mr,It(p),1)]))),128))],8,ur),pe("div",wr,[G(je,{variant:"outlined",color:"primary",onClick:Ae(f,["prevent"])},{default:X(()=>o[3]||(o[3]=[$e(" Prepend 2 Slides ")])),_:1,__:[3]}),G(je,{variant:"outlined",color:"primary",onClick:o[0]||(o[0]=Ae(p=>n(1),["prevent"]))},{default:X(()=>o[4]||(o[4]=[$e(" Slide 1 ")])),_:1,__:[4]}),G(je,{variant:"outlined",color:"primary",onClick:o[1]||(o[1]=Ae(p=>n(250),["prevent"]))},{default:X(()=>o[5]||(o[5]=[$e(" Slide 250 ")])),_:1,__:[5]}),G(je,{variant:"outlined",color:"primary",onClick:o[2]||(o[2]=Ae(p=>n(500),["prevent"]))},{default:X(()=>o[6]||(o[6]=[$e(" Slide 500 ")])),_:1,__:[6]}),G(je,{variant:"outlined",color:"primary",onClick:Ae(c,["prevent"])},{default:X(()=>o[7]||(o[7]=[$e(" Append Slide ")])),_:1,__:[7]})])]))}},rt="/assets/banner-31-D6mS0gQn.jpg",Ye="/assets/banner-32-B8kg_gZc.jpg",nt="/assets/banner-33-DfQ0Urdo.jpg",at="/assets/banner-34-CMWn1p69.jpg",ot="/assets/banner-35-avrf_yoA.jpg",ri="/assets/banner-36-BiLQv0qP.jpg",ni="/assets/banner-37-CxyHDUrj.jpg",ai="/assets/5-CFPERer_.jpg",et="/assets/banner-39-D9mpewKd.jpg",hr={"pagination-clickable":"true","slides-per-view":"5","space-between":"50","events-prefix":"swiper-",breakpoints:{1024:{slidesPerView:4,spaceBetween:40},768:{slidesPerView:3,spaceBetween:30},640:{slidesPerView:2,spaceBetween:20},320:{slidesPerView:1,spaceBetween:10}}},vr={__name:"DemoSwiperResponsiveBreakpoints",setup(s){return se(),(e,i)=>(H(),R("swiper-container",hr,[(H(!0),R(K,null,J([$(rt),$(Ye),$(nt),$(at),$(ot),$(ri),$(ni),$(ai),$(et)],t=>(H(),R("swiper-slide",{key:t},[G(re,{src:t},null,8,["src"])]))),128))]))}},Fe="/assets/banner-20-D60huBoA.jpg",lt="/assets/banner-4-EPycabrm.jpg",oi="/assets/banner-5-DVgdLDIC.jpg",Ie="/assets/banner-7-C3Ec249A.jpg",pt="/assets/banner-8-CS7lrdd8.jpg",kt="/assets/banner-9-CN54Uf8b.jpg",br={"pagination-clickable":"true",autoplay:"true",navigation:"true","events-prefix":"swiper-"},yr={__name:"DemoSwiperLazyLoading",setup(s){return se(),(e,i)=>(H(),R("swiper-container",br,[(H(!0),R(K,null,J([$(lt),$(oi),$(kt),$(Ie),$(pt),$(Fe)],t=>(H(),R("swiper-slide",{key:t,lazy:"true"},[G(re,{src:t,cover:"",loading:"lazy"},null,8,["src"])]))),128))]))}},Ve="/assets/banner-11-ClWmypCi.jpg",Be="/assets/6-C2cDgitj.jpg",Ge="/assets/banner-13-Cforbb5S.jpg",Xt="/assets/banner-15-DVoX7is_.jpg",_t="/assets/banner-16-BBt3y7wv.jpg",Sr={class:"mySwiper","thumbs-swiper":".mySwiper2",loop:"true","space-between":"10",navigation:"true","centered-slides":"true","events-prefix":"swiper-"},xr={class:"mySwiper2",loop:"true","free-mode":"true","events-prefix":"swiper-","slides-per-view":"4"},Er={__name:"DemoSwiperGallery",setup(s){return se(),(e,i)=>(H(),R(K,null,[pe("swiper-container",Sr,[(H(!0),R(K,null,J([$(Ve),$(Be),$(Ge),$(Xt),$(_t),$(Ve),$(Be),$(Ge)],t=>(H(),R("swiper-slide",{key:t},[G(re,{src:t,cover:""},null,8,["src"])]))),128))]),pe("swiper-container",xr,[(H(!0),R(K,null,J([$(Ve),$(Be),$(Ge),$(Xt),$(_t),$(Ve),$(Be),$(Ge)],t=>(H(),R("swiper-slide",{key:t},[G(re,{src:t,cover:""},null,8,["src"])]))),128))])],64))}},Tr=Xe(Er,[["__scopeId","data-v-43655b19"]]),Mr="/assets/banner-10-C2w4rcW8.jpg",Cr={pagination:"true",navigation:"true",autoplay:"true","centered-slides":"true","events-prefix":"swiper-"},Pr={__name:"DemoSwiperAutoplay",setup(s){return se(),(e,i)=>(H(),R("swiper-container",Cr,[(H(!0),R(K,null,J([$(Ie),$(pt),$(kt),$(Mr),$(Ve),$(Fe)],t=>(H(),R("swiper-slide",{key:t},[G(re,{src:t,cover:""},null,8,["src"])]))),128))]))}},_r={pagination:"true",effect:"coverflow","grab-cursor":"true","centered-slides":"true","slides-per-view":"auto","coverflow-effect-rotate":"50","coverflow-effect-stretch":"0","coverflow-effect-depth":"100","coverflow-effect-modifier":"1","coverflow-effect-slide-shadows":"true","events-prefix":"swiper-"},Ir={__name:"DemoSwiperCoverflowEffect",setup(s){return se(),(e,i)=>(H(),R("swiper-container",_r,[(H(!0),R(K,null,J([$(rt),$(Ye),$(nt),$(at),$(ot),$(ri),$(ni),$(ai),$(et)],t=>(H(),R("swiper-slide",{key:t},[G(re,{src:t},null,8,["src"])]))),128))]))}},zr=Xe(Ir,[["__scopeId","data-v-7a12df17"]]),Lr="/assets/banner-21-BbDBzY5j.jpg",kr="/assets/banner-23-eu_41WqH.jpg",$r="/assets/banner-24-BNOF4zrU.jpg",Ar={pagination:"true","centered-slides":"true",effect:"cube","grab-cursor":"true","cube-effect-shadow":"true","cube-effect-slide-shadows":"true","cube-effect-shadow-scale":"0.94","events-prefix":"swiper-"},jr={__name:"DemoSwiperCubeEffect",setup(s){return se(),(e,i)=>(H(),R("swiper-container",Ar,[(H(!0),R(K,null,J([$(Lr),$(Ye),$(kr),$($r)],t=>(H(),R("swiper-slide",{key:t},[G(re,{src:t},null,8,["src"])]))),128))]))}},Dr=Xe(jr,[["__scopeId","data-v-afdf8d88"]]),Or="/assets/banner-17-vuA5wUeU.jpg",Vr="/assets/banner-18-rnuWLp8J.jpg",Br="/assets/banner-19-DKrHObKZ.jpg",Gr={"space-between":"30",pagination:"true",navigation:"true",effect:"fade","events-prefix":"swiper-"},Hr={__name:"DemoSwiperFade",setup(s){return se(),(e,i)=>(H(),R("swiper-container",Gr,[(H(!0),R(K,null,J([$(Fe),$(Br),$(Vr),$(Or),$(_t)],t=>(H(),R("swiper-slide",{key:t},[G(re,{src:t},null,8,["src"])]))),128))]))}},Rr={"centered-slides":"true","space-between":"30","slides-per-view":"1","events-prefix":"swiper-",breakpoints:{992:{slidesPerView:4,spaceBetween:30},780:{slidesPerView:3,spaceBetween:30},460:{slidesPerView:2,spaceBetween:30}}},Xr={class:"d-flex align-center gap-x-3"},Nr={class:"font-weight-medium"},Yr={__name:"DemoSwiperCenteredSlidesOption2",setup(s){return se(),(e,i)=>(H(),R("swiper-container",Rr,[(H(),R(K,null,J([{icon:"ri-github-fill",text:"Getting Started"},{icon:"ri-facebook-circle-line",text:"Pricing & Plans"},{icon:"ri-twitter-line",text:"Sales Question"},{icon:"ri-instagram-line",text:"Usage Guidelines"},{icon:"ri-gitlab-line",text:"General Guide"}],({icon:t,text:r})=>pe("swiper-slide",{key:r},[G(Wt,{class:"bg-default"},{default:X(()=>[G(Ft,null,{default:X(()=>[pe("div",Xr,[G(Yt,{icon:t,size:"28"},null,8,["icon"]),pe("span",Nr,It(r),1)])]),_:2},1024)]),_:2},1024)])),64))]))}},Fr=Xe(Yr,[["__scopeId","data-v-a0d299b9"]]),Wr={class:"swiper-centered-slide"},qr={navigation:"true","centered-slides":"true","space-between":"30","slides-per-view":"1","events-prefix":"swiper-",injectStyles:[`
        .swiper-button-next, .swiper-button-prev{
          background: rgb(var(--v-theme-primary)) !important;
          color: #fff !important;
          padding-inline: 0.45rem !important;
          padding-block: 0.45rem !important;
          inline-size: 1rem !important;
          block-size: 1rem !important;
          border-radius: 50%
        }
        `],breakpoints:{992:{slidesPerView:4,spaceBetween:30},780:{slidesPerView:3,spaceBetween:30},460:{slidesPerView:2,spaceBetween:20}}},Ur={class:"d-flex flex-column align-center gap-y-3"},Kr={class:"text-high-emphasis"},Zr={__name:"DemoSwiperCenteredSlidesOption1",setup(s){return se(),(e,i)=>(H(),R("div",Wr,[pe("swiper-container",qr,[(H(),R(K,null,J([{icon:"ri-github-fill",text:"Getting Started"},{icon:"ri-facebook-circle-line",text:"Pricing & Plans"},{icon:"ri-twitter-line",text:"Sales Question"},{icon:"ri-instagram-line",text:"Usage Guidelines"},{icon:"ri-gitlab-line",text:"General Guide"}],({icon:t,text:r})=>pe("swiper-slide",{key:r},[G(Wt,null,{default:X(()=>[G(Ft,null,{default:X(()=>[pe("div",Ur,[G(Yt,{icon:t,size:"28"},null,8,["icon"]),pe("span",Kr,It(r),1)])]),_:2},1024)]),_:2},1024)])),64))])]))}},Qr=Xe(Zr,[["__scopeId","data-v-2608311e"]]),Nt="/assets/banner-26-Co29d348.jpg",Jr="/assets/banner-28-BavDZX16.jpg",en="/assets/banner-29-Bw5q4Gpe.jpg",tn="/assets/banner-30-BcnSNmsG.jpg",sn={"slides-per-view":"4","grid-fill":"rows","space-between":"30","grid-rows":"2","pagination-clickable":"true","events-prefix":"swiper-"},rn={__name:"DemoSwiperGrid",setup(s){return se(),(e,i)=>(H(),R("swiper-container",sn,[(H(!0),R(K,null,J([$(Nt),$(et),$(Jr),$(en),$(tn),$(rt),$(Ye),$(nt),$(at),$(ot),$(Nt),$(et)],t=>(H(),R("swiper-slide",{key:t},[G(re,{src:t},null,8,["src"])]))),128))]))}},nn={pagination:"true","slides-per-view":"3","space-between":"25","events-prefix":"swiper-"},an={__name:"DemoSwiperMultipleSlidesPerView",setup(s){return se(),(e,i)=>(H(),R("swiper-container",nn,[(H(!0),R(K,null,J([$(rt),$(Ye),$(nt),$(at),$(ot)],t=>(H(),R("swiper-slide",{key:t},[G(re,{src:t},null,8,["src"])]))),128))]))}},on={navigation:"true","pagination-type":"progressbar","events-prefix":"swiper-"},ln={__name:"DemoSwiperProgress",setup(s){return se(),(e,i)=>(H(),R("swiper-container",on,[(H(!0),R(K,null,J([$(pt),$(Ie),$(Fe),$(lt),$(oi)],t=>(H(),R("swiper-slide",{key:t},[G(re,{src:t},null,8,["src"])]))),128))]))}},pn={pagination:"true","events-prefix":"swiper-"},dn={__name:"DemoSwiperPagination",setup(s){return se(),(e,i)=>(H(),R("swiper-container",pn,[(H(!0),R(K,null,J([$(Be),$(kt),$(pt),$(Ie),$(Fe)],t=>(H(),R("swiper-slide",{key:t},[G(re,{src:t},null,8,["src"])]))),128))]))}},cn="/assets/banner-14-bNfFS-GU.jpg",li="/assets/banner-2-SWMk04gr.jpg",fn="/assets/banner-3-S5UpPGOJ.jpg",un={navigation:"true","events-prefix":"swiper-"},mn={__name:"DemoSwiperNavigation",setup(s){return se(),(e,i)=>(H(),R("swiper-container",un,[(H(!0),R(K,null,J([$(Ie),$(lt),$(cn),$(fn),$(li)],t=>(H(),R("swiper-slide",{key:t},[G(re,{src:t},null,8,["src"])]))),128))]))}},wn="/assets/banner-1-rgqr7rAW.jpg",gn={"events-prefix":"swiper-"},hn={__name:"DemoSwiperBasic",setup(s){return se(),(e,i)=>(H(),R("swiper-container",gn,[(H(!0),R(K,null,J([$(wn),$(li),$(lt),$(Ie),$(Ge)],t=>(H(),R("swiper-slide",{key:t},[G(re,{src:t},null,8,["src"])]))),128))]))}},vn={ts:`<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import swiper10 from '@images/banner/banner-10.jpg'
import swiper11 from '@images/banner/banner-11.jpg'
import swiper20 from '@images/banner/banner-20.jpg'
import swiper7 from '@images/banner/banner-7.jpg'
import swiper8 from '@images/banner/banner-8.jpg'
import swiper9 from '@images/banner/banner-9.jpg'

register()
<\/script>

<template>
  <swiper-container
    pagination="true"
    navigation="true"
    autoplay="true"
    centered-slides="true"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in
        [
          swiper7,
          swiper8,
          swiper9,
          swiper10,
          swiper11,
          swiper20,
        ]"
      :key="swiperImg"
    >
      <VImg
        :src="swiperImg"
        cover
      />
    </swiper-slide>
  </swiper-container>
</template>
`,js:`<script setup>
import { register } from 'swiper/element/bundle'
import swiper10 from '@images/banner/banner-10.jpg'
import swiper11 from '@images/banner/banner-11.jpg'
import swiper20 from '@images/banner/banner-20.jpg'
import swiper7 from '@images/banner/banner-7.jpg'
import swiper8 from '@images/banner/banner-8.jpg'
import swiper9 from '@images/banner/banner-9.jpg'

register()
<\/script>

<template>
  <swiper-container
    pagination="true"
    navigation="true"
    autoplay="true"
    centered-slides="true"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in
        [
          swiper7,
          swiper8,
          swiper9,
          swiper10,
          swiper11,
          swiper20,
        ]"
      :key="swiperImg"
    >
      <VImg
        :src="swiperImg"
        cover
      />
    </swiper-slide>
  </swiper-container>
</template>
`},bn={ts:`<script setup lang="ts">
import { register } from 'swiper/element/bundle'

import swiper1 from '@images/banner/banner-1.jpg'
import swiper13 from '@images/banner/banner-13.jpg'
import swiper2 from '@images/banner/banner-2.jpg'
import swiper4 from '@images/banner/banner-4.jpg'
import swiper7 from '@images/banner/banner-7.jpg'

register()
<\/script>

<template>
  <swiper-container events-prefix="swiper-">
    <swiper-slide
      v-for="swiperImg in [
        swiper1,
        swiper2,
        swiper4,
        swiper7,
        swiper13,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>
`,js:`<script setup>
import { register } from 'swiper/element/bundle'
import swiper1 from '@images/banner/banner-1.jpg'
import swiper13 from '@images/banner/banner-13.jpg'
import swiper2 from '@images/banner/banner-2.jpg'
import swiper4 from '@images/banner/banner-4.jpg'
import swiper7 from '@images/banner/banner-7.jpg'

register()
<\/script>

<template>
  <swiper-container events-prefix="swiper-">
    <swiper-slide
      v-for="swiperImg in [
        swiper1,
        swiper2,
        swiper4,
        swiper7,
        swiper13,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>
`},yn={ts:`<script setup lang="ts">
import { register } from 'swiper/element/bundle'

register()
<\/script>

<template>
  <!-- eslint-disable vue/attribute-hyphenation -->
  <div class="swiper-centered-slide">
    <swiper-container
      navigation="true"
      centered-slides="true"
      space-between="30"
      slides-per-view="1"
      events-prefix="swiper-"
      :injectStyles="[
        \`
        .swiper-button-next, .swiper-button-prev{
          background: rgb(var(--v-theme-primary)) !important;
          color: #fff !important;
          padding-inline: 0.45rem !important;
          padding-block: 0.45rem !important;
          inline-size: 1rem !important;
          block-size: 1rem !important;
          border-radius: 50%
        }
        \`,
      ]"
      :breakpoints="{
        992: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        780: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        460: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
      }"
    >
      <swiper-slide
        v-for="{ icon, text } in [
          { icon: 'ri-github-fill', text: 'Getting Started' },
          { icon: 'ri-facebook-circle-line', text: 'Pricing & Plans' },
          { icon: 'ri-twitter-line', text: 'Sales Question' },
          { icon: 'ri-instagram-line', text: 'Usage Guidelines' },
          { icon: 'ri-gitlab-line', text: 'General Guide' },
        ]"
        :key="text"
      >
        <VCard>
          <VCardText>
            <div class="d-flex flex-column align-center gap-y-3">
              <VIcon
                :icon="icon"
                size="28"
              />
              <span class="text-high-emphasis">{{ text }}</span>
            </div>
          </VCardText>
        </VCard>
      </swiper-slide>
    </swiper-container>
  </div>
</template>

<style lang="scss" scoped>
swiper-slide {
  padding-block: 1rem;

  &.swiper-slide-active {
    .v-card {
      border: 1px solid rgb(var(--v-theme-primary));

      .v-icon {
        color: rgb(var(--v-theme-primary));
      }
    }
  }
}
</style>
`,js:`<script setup>
import { register } from 'swiper/element/bundle'

register()
<\/script>

<template>
  <!-- eslint-disable vue/attribute-hyphenation -->
  <div class="swiper-centered-slide">
    <swiper-container
      navigation="true"
      centered-slides="true"
      space-between="30"
      slides-per-view="1"
      events-prefix="swiper-"
      :injectStyles="[
        \`
        .swiper-button-next, .swiper-button-prev{
          background: rgb(var(--v-theme-primary)) !important;
          color: #fff !important;
          padding-inline: 0.45rem !important;
          padding-block: 0.45rem !important;
          inline-size: 1rem !important;
          block-size: 1rem !important;
          border-radius: 50%
        }
        \`,
      ]"
      :breakpoints="{
        992: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        780: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        460: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
      }"
    >
      <swiper-slide
        v-for="{ icon, text } in [
          { icon: 'ri-github-fill', text: 'Getting Started' },
          { icon: 'ri-facebook-circle-line', text: 'Pricing & Plans' },
          { icon: 'ri-twitter-line', text: 'Sales Question' },
          { icon: 'ri-instagram-line', text: 'Usage Guidelines' },
          { icon: 'ri-gitlab-line', text: 'General Guide' },
        ]"
        :key="text"
      >
        <VCard>
          <VCardText>
            <div class="d-flex flex-column align-center gap-y-3">
              <VIcon
                :icon="icon"
                size="28"
              />
              <span class="text-high-emphasis">{{ text }}</span>
            </div>
          </VCardText>
        </VCard>
      </swiper-slide>
    </swiper-container>
  </div>
</template>

<style lang="scss" scoped>
swiper-slide {
  padding-block: 1rem;

  &.swiper-slide-active {
    .v-card {
      border: 1px solid rgb(var(--v-theme-primary));

      .v-icon {
        color: rgb(var(--v-theme-primary));
      }
    }
  }
}
</style>
`},Sn={ts:`<script setup lang="ts">
import { register } from 'swiper/element/bundle'

register()
<\/script>

<template>
  <swiper-container
    centered-slides="true"
    space-between="30"
    slides-per-view="1"
    events-prefix="swiper-"
    :breakpoints="{
      992: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
      780: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      460: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
    }"
  >
    <swiper-slide
      v-for="{ icon, text } in [
        { icon: 'ri-github-fill', text: 'Getting Started' },
        { icon: 'ri-facebook-circle-line', text: 'Pricing & Plans' },
        { icon: 'ri-twitter-line', text: 'Sales Question' },
        { icon: 'ri-instagram-line', text: 'Usage Guidelines' },
        { icon: 'ri-gitlab-line', text: 'General Guide' },
      ]"
      :key="text"
    >
      <VCard class="bg-default">
        <VCardText>
          <div class="d-flex align-center gap-x-3">
            <VIcon
              :icon="icon"
              size="28"
            />
            <span class="font-weight-medium">{{ text }}</span>
          </div>
        </VCardText>
      </VCard>
    </swiper-slide>
  </swiper-container>
</template>

<style lang="scss" scoped>
swiper-slide {
  padding-block: 1rem;

  &.swiper-slide-active {
    .v-card {
      border: 1px solid rgb(var(--v-theme-primary));
      background: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-on-primary));
    }
  }
}
</style>
`,js:`<script setup>
import { register } from 'swiper/element/bundle'

register()
<\/script>

<template>
  <swiper-container
    centered-slides="true"
    space-between="30"
    slides-per-view="1"
    events-prefix="swiper-"
    :breakpoints="{
      992: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
      780: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      460: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
    }"
  >
    <swiper-slide
      v-for="{ icon, text } in [
        { icon: 'ri-github-fill', text: 'Getting Started' },
        { icon: 'ri-facebook-circle-line', text: 'Pricing & Plans' },
        { icon: 'ri-twitter-line', text: 'Sales Question' },
        { icon: 'ri-instagram-line', text: 'Usage Guidelines' },
        { icon: 'ri-gitlab-line', text: 'General Guide' },
      ]"
      :key="text"
    >
      <VCard class="bg-default">
        <VCardText>
          <div class="d-flex align-center gap-x-3">
            <VIcon
              :icon="icon"
              size="28"
            />
            <span class="font-weight-medium">{{ text }}</span>
          </div>
        </VCardText>
      </VCard>
    </swiper-slide>
  </swiper-container>
</template>

<style lang="scss" scoped>
swiper-slide {
  padding-block: 1rem;

  &.swiper-slide-active {
    .v-card {
      border: 1px solid rgb(var(--v-theme-primary));
      background: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-on-primary));
    }
  }
}
</style>
`},xn={ts:`<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import swiper31 from '@images/banner/banner-31.jpg'
import swiper32 from '@images/banner/banner-32.jpg'
import swiper33 from '@images/banner/banner-33.jpg'
import swiper34 from '@images/banner/banner-34.jpg'
import swiper35 from '@images/banner/banner-35.jpg'
import swiper36 from '@images/banner/banner-36.jpg'
import swiper37 from '@images/banner/banner-37.jpg'
import swiper38 from '@images/banner/banner-38.jpg'
import swiper39 from '@images/banner/banner-39.jpg'

register()
<\/script>

<template>
  <swiper-container
    pagination="true"
    effect="coverflow"
    grab-cursor="true"
    centered-slides="true"
    slides-per-view="auto"
    coverflow-effect-rotate="50"
    coverflow-effect-stretch="0"
    coverflow-effect-depth="100"
    coverflow-effect-modifier="1"
    coverflow-effect-slide-shadows="true"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper31,
        swiper32,
        swiper33,
        swiper34,
        swiper35,
        swiper36,
        swiper37,
        swiper38,
        swiper39,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>

<style lang="scss" scoped>
swiper-slide {
  background-position: center;
  background-size: cover;
  block-size: 300px;
  inline-size: 300px;
}
</style>
`,js:`<script setup>
import { register } from 'swiper/element/bundle'
import swiper31 from '@images/banner/banner-31.jpg'
import swiper32 from '@images/banner/banner-32.jpg'
import swiper33 from '@images/banner/banner-33.jpg'
import swiper34 from '@images/banner/banner-34.jpg'
import swiper35 from '@images/banner/banner-35.jpg'
import swiper36 from '@images/banner/banner-36.jpg'
import swiper37 from '@images/banner/banner-37.jpg'
import swiper38 from '@images/banner/banner-38.jpg'
import swiper39 from '@images/banner/banner-39.jpg'

register()
<\/script>

<template>
  <swiper-container
    pagination="true"
    effect="coverflow"
    grab-cursor="true"
    centered-slides="true"
    slides-per-view="auto"
    coverflow-effect-rotate="50"
    coverflow-effect-stretch="0"
    coverflow-effect-depth="100"
    coverflow-effect-modifier="1"
    coverflow-effect-slide-shadows="true"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper31,
        swiper32,
        swiper33,
        swiper34,
        swiper35,
        swiper36,
        swiper37,
        swiper38,
        swiper39,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>

<style lang="scss" scoped>
swiper-slide {
  background-position: center;
  background-size: cover;
  block-size: 300px;
  inline-size: 300px;
}
</style>
`},En={ts:`<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import swiper21 from '@images/banner/banner-21.jpg'
import swiper23 from '@images/banner/banner-23.jpg'
import swiper24 from '@images/banner/banner-24.jpg'
import swiper32 from '@images/banner/banner-32.jpg'

register()
<\/script>

<template>
  <swiper-container
    pagination="true"
    centered-slides="true"
    effect="cube"
    grab-cursor="true"
    cube-effect-shadow="true"
    cube-effect-slide-shadows="true"
    cube-effect-shadow-scale="0.94"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper21,
        swiper32,
        swiper23,
        swiper24,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>

<style lang="scss" scoped>
swiper-slide {
  background-position: center;
  background-size: cover;
  block-size: 250px;
  inline-size: 250px;
}

swiper-container {
  margin: auto;
  block-size: 250px;
  inline-size: 250px;
}
</style>
`,js:`<script setup>
import { register } from 'swiper/element/bundle'
import swiper21 from '@images/banner/banner-21.jpg'
import swiper23 from '@images/banner/banner-23.jpg'
import swiper24 from '@images/banner/banner-24.jpg'
import swiper32 from '@images/banner/banner-32.jpg'

register()
<\/script>

<template>
  <swiper-container
    pagination="true"
    centered-slides="true"
    effect="cube"
    grab-cursor="true"
    cube-effect-shadow="true"
    cube-effect-slide-shadows="true"
    cube-effect-shadow-scale="0.94"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper21,
        swiper32,
        swiper23,
        swiper24,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>

<style lang="scss" scoped>
swiper-slide {
  background-position: center;
  background-size: cover;
  block-size: 250px;
  inline-size: 250px;
}

swiper-container {
  margin: auto;
  block-size: 250px;
  inline-size: 250px;
}
</style>
`},Tn={ts:`<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import swiper16 from '@images/banner/banner-16.jpg'
import swiper17 from '@images/banner/banner-17.jpg'
import swiper18 from '@images/banner/banner-18.jpg'
import swiper19 from '@images/banner/banner-19.jpg'
import swiper20 from '@images/banner/banner-20.jpg'

register()
<\/script>

<template>
  <swiper-container
    space-between="30"
    pagination="true"
    navigation="true"
    effect="fade"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper20,
        swiper19,
        swiper18,
        swiper17,
        swiper16,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>
`,js:`<script setup>
import { register } from 'swiper/element/bundle'
import swiper16 from '@images/banner/banner-16.jpg'
import swiper17 from '@images/banner/banner-17.jpg'
import swiper18 from '@images/banner/banner-18.jpg'
import swiper19 from '@images/banner/banner-19.jpg'
import swiper20 from '@images/banner/banner-20.jpg'

register()
<\/script>

<template>
  <swiper-container
    space-between="30"
    pagination="true"
    navigation="true"
    effect="fade"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper20,
        swiper19,
        swiper18,
        swiper17,
        swiper16,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>
`},Mn={ts:`<script setup lang="ts">
import { register } from 'swiper/element/bundle'

import swiper11 from '@images/banner/banner-11.jpg'
import swiper12 from '@images/banner/banner-12.jpg'
import swiper13 from '@images/banner/banner-13.jpg'
import swiper15 from '@images/banner/banner-15.jpg'
import swiper16 from '@images/banner/banner-16.jpg'

register()
<\/script>

<template>
  <swiper-container
    class="mySwiper"
    thumbs-swiper=".mySwiper2"
    loop="true"
    space-between="10"
    navigation="true"
    centered-slides="true"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper11,
        swiper12,
        swiper13,
        swiper15,
        swiper16,
        swiper11,
        swiper12,
        swiper13,

      ]"
      :key="swiperImg"
    >
      <VImg
        :src="swiperImg"
        cover
      />
    </swiper-slide>
  </swiper-container>

  <swiper-container
    class="mySwiper2"
    loop="true"
    free-mode="true"
    events-prefix="swiper-"
    slides-per-view="4"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper11,
        swiper12,
        swiper13,
        swiper15,
        swiper16,
        swiper11,
        swiper12,
        swiper13,
      ]"
      :key="swiperImg"
    >
      <VImg
        :src="swiperImg"
        cover
      />
    </swiper-slide>
  </swiper-container>
</template>

<style lang="scss" scoped>
swiper-container {
  background-color: #000;
}

.mySwiper2 {
  swiper-slide {
    border: 5px solid black;
    block-size: 100%;
    inline-size: 25%;
    opacity: 0.4;
  }

  .swiper-slide-thumb-active {
    opacity: 1;
  }
}
</style>
`,js:`<script setup>
import { register } from 'swiper/element/bundle'
import swiper11 from '@images/banner/banner-11.jpg'
import swiper12 from '@images/banner/banner-12.jpg'
import swiper13 from '@images/banner/banner-13.jpg'
import swiper15 from '@images/banner/banner-15.jpg'
import swiper16 from '@images/banner/banner-16.jpg'

register()
<\/script>

<template>
  <swiper-container
    class="mySwiper"
    thumbs-swiper=".mySwiper2"
    loop="true"
    space-between="10"
    navigation="true"
    centered-slides="true"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper11,
        swiper12,
        swiper13,
        swiper15,
        swiper16,
        swiper11,
        swiper12,
        swiper13,

      ]"
      :key="swiperImg"
    >
      <VImg
        :src="swiperImg"
        cover
      />
    </swiper-slide>
  </swiper-container>

  <swiper-container
    class="mySwiper2"
    loop="true"
    free-mode="true"
    events-prefix="swiper-"
    slides-per-view="4"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper11,
        swiper12,
        swiper13,
        swiper15,
        swiper16,
        swiper11,
        swiper12,
        swiper13,
      ]"
      :key="swiperImg"
    >
      <VImg
        :src="swiperImg"
        cover
      />
    </swiper-slide>
  </swiper-container>
</template>

<style lang="scss" scoped>
swiper-container {
  background-color: #000;
}

.mySwiper2 {
  swiper-slide {
    border: 5px solid black;
    block-size: 100%;
    inline-size: 25%;
    opacity: 0.4;
  }

  .swiper-slide-thumb-active {
    opacity: 1;
  }
}
</style>
`},Cn={ts:`<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import swiper26 from '@images/banner/banner-26.jpg'
import swiper28 from '@images/banner/banner-28.jpg'
import swiper29 from '@images/banner/banner-29.jpg'
import swiper30 from '@images/banner/banner-30.jpg'
import swiper31 from '@images/banner/banner-31.jpg'
import swiper32 from '@images/banner/banner-32.jpg'
import swiper33 from '@images/banner/banner-33.jpg'
import swiper34 from '@images/banner/banner-34.jpg'
import swiper35 from '@images/banner/banner-35.jpg'
import swiper39 from '@images/banner/banner-39.jpg'

register()
<\/script>

<template>
  <swiper-container
    slides-per-view="4"
    grid-fill="rows"
    space-between="30"
    grid-rows="2"
    pagination-clickable="true"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper26,
        swiper39,
        swiper28,
        swiper29,
        swiper30,
        swiper31,
        swiper32,
        swiper33,
        swiper34,
        swiper35,
        swiper26,
        swiper39,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>
`,js:`<script setup>
import { register } from 'swiper/element/bundle'
import swiper26 from '@images/banner/banner-26.jpg'
import swiper28 from '@images/banner/banner-28.jpg'
import swiper29 from '@images/banner/banner-29.jpg'
import swiper30 from '@images/banner/banner-30.jpg'
import swiper31 from '@images/banner/banner-31.jpg'
import swiper32 from '@images/banner/banner-32.jpg'
import swiper33 from '@images/banner/banner-33.jpg'
import swiper34 from '@images/banner/banner-34.jpg'
import swiper35 from '@images/banner/banner-35.jpg'
import swiper39 from '@images/banner/banner-39.jpg'

register()
<\/script>

<template>
  <swiper-container
    slides-per-view="4"
    grid-fill="rows"
    space-between="30"
    grid-rows="2"
    pagination-clickable="true"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper26,
        swiper39,
        swiper28,
        swiper29,
        swiper30,
        swiper31,
        swiper32,
        swiper33,
        swiper34,
        swiper35,
        swiper26,
        swiper39,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>
`},Pn={ts:`<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import swiper20 from '@images/banner/banner-20.jpg'
import swiper4 from '@images/banner/banner-4.jpg'
import swiper5 from '@images/banner/banner-5.jpg'
import swiper7 from '@images/banner/banner-7.jpg'
import swiper8 from '@images/banner/banner-8.jpg'
import swiper9 from '@images/banner/banner-9.jpg'

register()
<\/script>

<template>
  <swiper-container
    pagination-clickable="true"
    autoplay="true"
    navigation="true"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper4,
        swiper5,
        swiper9,
        swiper7,
        swiper8,
        swiper20,
      ]"
      :key="swiperImg"
      lazy="true"
    >
      <VImg
        :src="swiperImg"
        cover
        loading="lazy"
      />
    </swiper-slide>
  </swiper-container>
</template>
`,js:`<script setup>
import { register } from 'swiper/element/bundle'
import swiper20 from '@images/banner/banner-20.jpg'
import swiper4 from '@images/banner/banner-4.jpg'
import swiper5 from '@images/banner/banner-5.jpg'
import swiper7 from '@images/banner/banner-7.jpg'
import swiper8 from '@images/banner/banner-8.jpg'
import swiper9 from '@images/banner/banner-9.jpg'

register()
<\/script>

<template>
  <swiper-container
    pagination-clickable="true"
    autoplay="true"
    navigation="true"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper4,
        swiper5,
        swiper9,
        swiper7,
        swiper8,
        swiper20,
      ]"
      :key="swiperImg"
      lazy="true"
    >
      <VImg
        :src="swiperImg"
        cover
        loading="lazy"
      />
    </swiper-slide>
  </swiper-container>
</template>
`},_n={ts:`<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import swiper31 from '@images/banner/banner-31.jpg'
import swiper32 from '@images/banner/banner-32.jpg'
import swiper33 from '@images/banner/banner-33.jpg'
import swiper34 from '@images/banner/banner-34.jpg'
import swiper35 from '@images/banner/banner-35.jpg'

register()
<\/script>

<template>
  <swiper-container
    pagination="true"
    slides-per-view="3"
    space-between="25"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper31,
        swiper32,
        swiper33,
        swiper34,
        swiper35,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>
`,js:`<script setup>
import { register } from 'swiper/element/bundle'
import swiper31 from '@images/banner/banner-31.jpg'
import swiper32 from '@images/banner/banner-32.jpg'
import swiper33 from '@images/banner/banner-33.jpg'
import swiper34 from '@images/banner/banner-34.jpg'
import swiper35 from '@images/banner/banner-35.jpg'

register()
<\/script>

<template>
  <swiper-container
    pagination="true"
    slides-per-view="3"
    space-between="25"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper31,
        swiper32,
        swiper33,
        swiper34,
        swiper35,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>
`},In={ts:`<script setup lang="ts">
import { register } from 'swiper/element/bundle'

import swiper14 from '@images/banner/banner-14.jpg'
import swiper2 from '@images/banner/banner-2.jpg'
import swiper3 from '@images/banner/banner-3.jpg'
import swiper4 from '@images/banner/banner-4.jpg'
import swiper7 from '@images/banner/banner-7.jpg'

register()
<\/script>

<template>
  <swiper-container
    navigation="true"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper7,
        swiper4,
        swiper14,
        swiper3,
        swiper2,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>
`,js:`<script setup>
import { register } from 'swiper/element/bundle'
import swiper14 from '@images/banner/banner-14.jpg'
import swiper2 from '@images/banner/banner-2.jpg'
import swiper3 from '@images/banner/banner-3.jpg'
import swiper4 from '@images/banner/banner-4.jpg'
import swiper7 from '@images/banner/banner-7.jpg'

register()
<\/script>

<template>
  <swiper-container
    navigation="true"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper7,
        swiper4,
        swiper14,
        swiper3,
        swiper2,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>
`},zn={ts:`<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import swiper8 from '@images/banner/banner-8.jpg'
import swiper9 from '@images/banner/banner-9.jpg'

import swiper12 from '@images/banner/banner-12.jpg'
import swiper20 from '@images/banner/banner-20.jpg'
import swiper7 from '@images/banner/banner-7.jpg'

register()
<\/script>

<template>
  <swiper-container
    pagination="true"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper12,
        swiper9,
        swiper8,
        swiper7,
        swiper20,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>
`,js:`<script setup>
import { register } from 'swiper/element/bundle'
import swiper8 from '@images/banner/banner-8.jpg'
import swiper9 from '@images/banner/banner-9.jpg'
import swiper12 from '@images/banner/banner-12.jpg'
import swiper20 from '@images/banner/banner-20.jpg'
import swiper7 from '@images/banner/banner-7.jpg'

register()
<\/script>

<template>
  <swiper-container
    pagination="true"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper12,
        swiper9,
        swiper8,
        swiper7,
        swiper20,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>
`},Ln={ts:`<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import swiper5 from '@images/banner/banner-5.jpg'
import swiper8 from '@images/banner/banner-8.jpg'

import swiper20 from '@images/banner/banner-20.jpg'
import swiper4 from '@images/banner/banner-4.jpg'
import swiper7 from '@images/banner/banner-7.jpg'

register()
<\/script>

<template>
  <swiper-container
    navigation="true"
    pagination-type="progressbar"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper8,
        swiper7,
        swiper20,
        swiper4,
        swiper5,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>
`,js:`<script setup>
import { register } from 'swiper/element/bundle'
import swiper5 from '@images/banner/banner-5.jpg'
import swiper8 from '@images/banner/banner-8.jpg'
import swiper20 from '@images/banner/banner-20.jpg'
import swiper4 from '@images/banner/banner-4.jpg'
import swiper7 from '@images/banner/banner-7.jpg'

register()
<\/script>

<template>
  <swiper-container
    navigation="true"
    pagination-type="progressbar"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper8,
        swiper7,
        swiper20,
        swiper4,
        swiper5,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>
`},kn={ts:`<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import swiper31 from '@images/banner/banner-31.jpg'
import swiper32 from '@images/banner/banner-32.jpg'
import swiper33 from '@images/banner/banner-33.jpg'
import swiper34 from '@images/banner/banner-34.jpg'
import swiper35 from '@images/banner/banner-35.jpg'
import swiper36 from '@images/banner/banner-36.jpg'
import swiper37 from '@images/banner/banner-37.jpg'
import swiper38 from '@images/banner/banner-38.jpg'
import swiper39 from '@images/banner/banner-39.jpg'

register()
<\/script>

<template>
  <swiper-container
    pagination-clickable="true"
    slides-per-view="5"
    space-between="50"
    events-prefix="swiper-"
    :breakpoints="{
      1024: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
    }"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper31,
        swiper32,
        swiper33,
        swiper34,
        swiper35,
        swiper36,
        swiper37,
        swiper38,
        swiper39,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>
`,js:`<script setup>
import { register } from 'swiper/element/bundle'
import swiper31 from '@images/banner/banner-31.jpg'
import swiper32 from '@images/banner/banner-32.jpg'
import swiper33 from '@images/banner/banner-33.jpg'
import swiper34 from '@images/banner/banner-34.jpg'
import swiper35 from '@images/banner/banner-35.jpg'
import swiper36 from '@images/banner/banner-36.jpg'
import swiper37 from '@images/banner/banner-37.jpg'
import swiper38 from '@images/banner/banner-38.jpg'
import swiper39 from '@images/banner/banner-39.jpg'

register()
<\/script>

<template>
  <swiper-container
    pagination-clickable="true"
    slides-per-view="5"
    space-between="50"
    events-prefix="swiper-"
    :breakpoints="{
      1024: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
    }"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper31,
        swiper32,
        swiper33,
        swiper34,
        swiper35,
        swiper36,
        swiper37,
        swiper38,
        swiper39,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>
`},$n={ts:`<script setup lang="ts">
import { register } from 'swiper/element/bundle'

register()

const slides = Array.from({ length: 500 }, (_, index) => \`Slides \${index + 1}\`)
const swiperEl = ref<any>(null)
const prependNumber = ref(1)
const appendNumber = ref(500)

const toSlide = (index: number) => {
  swiperEl.value?.swiper.slideTo(index - 1)
}

const prependSlide = () => {
  swiperEl.value?.swiper.prependSlide([
    \`<swiper-slide>Slide \${(--prependNumber.value)} </swiper-slide>\`,
    \`<swiper-slide>Slide \${(--prependNumber.value)} </swiper-slide>\`,
  ])
}

const appendSlide = () => {
  swiperEl.value?.swiper.appendSlide([
    \`<swiper-slide>Slide \${(++appendNumber.value)} </swiper-slide>\`,
  ])
}
<\/script>

<template>
  <section class="swiper-virtual">
    <swiper-container
      ref="swiperEl"
      virtual="true"
      :slides="slides"
      navigation="true"
      slides-per-view="5"
      space-between="50"
      free-mode="true"
      events-prefix="swiper-"
      :breakpoints="{
        1024: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
      }"
    >
      <swiper-slide
        v-for="(item, index) in slides"
        :key="index"
      >
        <div class="text-secondary">
          {{ item }}
        </div>
      </swiper-slide>
    </swiper-container>

    <div class="d-flex justify-center gap-4 flex-wrap">
      <VBtn
        variant="outlined"
        color="primary"
        @click.prevent="prependSlide"
      >
        Prepend 2 Slides
      </VBtn>
      <VBtn
        variant="outlined"
        color="primary"
        @click.prevent="toSlide(1)"
      >
        Slide 1
      </VBtn>
      <VBtn
        variant="outlined"
        color="primary"
        @click.prevent="toSlide(250)"
      >
        Slide 250
      </VBtn>
      <VBtn
        variant="outlined"
        color="primary"
        @click.prevent="toSlide(500)"
      >
        Slide 500
      </VBtn>
      <VBtn
        variant="outlined"
        color="primary"
        @click.prevent="appendSlide"
      >
        Append Slide
      </VBtn>
    </div>
  </section>
</template>

<style lang="scss">
.swiper-virtual {
  swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eee;
    font-size: 18px;
    text-align: center;
  }

  swiper-container {
    block-size: 300px;
    inline-size: 100%;
    margin-block: 20px;
    margin-inline: auto;
  }
}
</style>
`,js:`<script setup>
import { register } from 'swiper/element/bundle'

register()

const slides = Array.from({ length: 500 }, (_, index) => \`Slides \${ index + 1 }\`)
const swiperEl = ref(null)
const prependNumber = ref(1)
const appendNumber = ref(500)

const toSlide = index => {
  swiperEl.value?.swiper.slideTo(index - 1)
}

const prependSlide = () => {
  swiperEl.value?.swiper.prependSlide([
    \`<swiper-slide>Slide \${ --prependNumber.value } </swiper-slide>\`,
    \`<swiper-slide>Slide \${ --prependNumber.value } </swiper-slide>\`,
  ])
}

const appendSlide = () => {
  swiperEl.value?.swiper.appendSlide([\`<swiper-slide>Slide \${ ++appendNumber.value } </swiper-slide>\`])
}
<\/script>

<template>
  <section class="swiper-virtual">
    <swiper-container
      ref="swiperEl"
      virtual="true"
      :slides="slides"
      navigation="true"
      slides-per-view="5"
      space-between="50"
      free-mode="true"
      events-prefix="swiper-"
      :breakpoints="{
        1024: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
      }"
    >
      <swiper-slide
        v-for="(item, index) in slides"
        :key="index"
      >
        <div class="text-secondary">
          {{ item }}
        </div>
      </swiper-slide>
    </swiper-container>

    <div class="d-flex justify-center gap-4 flex-wrap">
      <VBtn
        variant="outlined"
        color="primary"
        @click.prevent="prependSlide"
      >
        Prepend 2 Slides
      </VBtn>
      <VBtn
        variant="outlined"
        color="primary"
        @click.prevent="toSlide(1)"
      >
        Slide 1
      </VBtn>
      <VBtn
        variant="outlined"
        color="primary"
        @click.prevent="toSlide(250)"
      >
        Slide 250
      </VBtn>
      <VBtn
        variant="outlined"
        color="primary"
        @click.prevent="toSlide(500)"
      >
        Slide 500
      </VBtn>
      <VBtn
        variant="outlined"
        color="primary"
        @click.prevent="appendSlide"
      >
        Append Slide
      </VBtn>
    </div>
  </section>
</template>

<style lang="scss">
.swiper-virtual {
  swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eee;
    font-size: 18px;
    text-align: center;
  }

  swiper-container {
    block-size: 300px;
    inline-size: 100%;
    margin-block: 20px;
    margin-inline: auto;
  }
}
</style>
`},Yn={__name:"swiper",setup(s){return(e,i)=>{const t=hn,r=di,n=mn,f=dn,c=ln,d=an,o=rn,p=Qr,u=Fr,v=Hr,w=Dr,a=zr,l=Pr,h=Tr,b=yr,g=vr,m=gr;return H(),pi(ci,null,{default:X(()=>[G(ie,null,{default:X(()=>[G(r,{title:"Basic",code:$(bn)},{default:X(()=>[G(t)]),_:1},8,["code"])]),_:1}),G(ie,null,{default:X(()=>[G(r,{title:"Navigation",code:$(In)},{default:X(()=>[G(n)]),_:1},8,["code"])]),_:1}),G(ie,null,{default:X(()=>[G(r,{title:"Pagination",code:$(zn)},{default:X(()=>[G(f)]),_:1},8,["code"])]),_:1}),G(ie,null,{default:X(()=>[G(r,{title:"Progress",code:$(Ln)},{default:X(()=>[G(c)]),_:1},8,["code"])]),_:1}),G(ie,null,{default:X(()=>[G(r,{title:"Multiple Slides Per View",code:$(_n)},{default:X(()=>[G(d)]),_:1},8,["code"])]),_:1}),G(ie,null,{default:X(()=>[G(r,{title:"Grid",code:$(Cn)},{default:X(()=>[G(o)]),_:1},8,["code"])]),_:1}),G(ie,null,{default:X(()=>[G(r,{variant:"text",title:"Centered Slides Option 1",code:$(yn)},{default:X(()=>[G(p)]),_:1},8,["code"])]),_:1}),G(ie,null,{default:X(()=>[G(r,{title:"Centered Slides Option 2",code:$(Sn)},{default:X(()=>[G(u)]),_:1},8,["code"])]),_:1}),G(ie,null,{default:X(()=>[G(r,{title:"Fade",code:$(Tn)},{default:X(()=>[G(v)]),_:1},8,["code"])]),_:1}),G(ie,null,{default:X(()=>[G(r,{title:"Cube Effect",code:$(En)},{default:X(()=>[G(w)]),_:1},8,["code"])]),_:1}),G(ie,null,{default:X(()=>[G(r,{title:"Coverflow Effect",code:$(xn)},{default:X(()=>[G(a)]),_:1},8,["code"])]),_:1}),G(ie,null,{default:X(()=>[G(r,{title:"Autoplay",code:$(vn)},{default:X(()=>[G(l)]),_:1},8,["code"])]),_:1}),G(ie,null,{default:X(()=>[G(r,{title:"Gallery",code:$(Mn)},{default:X(()=>[G(h)]),_:1},8,["code"])]),_:1}),G(ie,null,{default:X(()=>[G(r,{title:"Lazy Loading",code:$(Pn)},{default:X(()=>[G(b)]),_:1},8,["code"])]),_:1}),G(ie,null,{default:X(()=>[G(r,{title:"Responsive Breakpoints",code:$(kn)},{default:X(()=>[G(g)]),_:1},8,["code"])]),_:1}),G(ie,null,{default:X(()=>[G(r,{title:"Virtual Slides",code:$($n)},{default:X(()=>[G(m)]),_:1},8,["code"])]),_:1})]),_:1})}}};export{Yn as default};
