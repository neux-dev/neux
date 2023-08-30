class t{_list={};on(t,e){if(t&&e){const n=this._list,o=[].concat(t);for(const t of o)n[t]||(n[t]=new Map),n[t].set(e,!1)}}once(t,e){if(t&&e){const n=this._list,o=[].concat(t);for(const t of o)n[t]||(n[t]=new Map),n[t].set(e,!0)}}off(t,e){if(t){const n=this._list,o=[].concat(t);for(const t of o)n[t]&&(e?(n[t].delete(e),n[t].size||delete n[t]):(n[t].clear(),delete n[t]))}else this._list={}}emit(t,...e){const n=this._list;if("*"===t)for(const t in n)for(const[o,c]of n[t])o(...e),c&&this.off(t,o);else{const o=new Set([].concat(t));for(const t of o)if(n[t])for(const[o,c]of n[t])o(...e),c&&this.off(t,o)}}}function e(t){return void 0===t}function n(t){return"function"==typeof t}function o(t){return"string"==typeof t}function c(t){return Array.isArray(t)}function r(t){return"object"==typeof t&&null!==t&&(t.constructor===Object||t.constructor===Array)}function s(t,e){return r(t)&&Object.prototype.hasOwnProperty.call(t,e)}const i=Symbol("isProxy"),a=/^\$/,f={};function l(s,w=f){if(e(s))s={};else if(!r(s)||s[i])return s;const y=new t,g=new t,b=new t,v=new Proxy(s,{get:(t,e)=>e===i||("$"===e?function(t){return v["$"+t]}:"$$on"===e?function(...t){return y.on(...t)}:"$$once"===e?function(...t){return y.once(...t)}:"$$off"===e?function(...t){return y.off(...t)}:"$$emit"===e?function(...t){return y.emit(...t)}:"$$clone"===e?function(e=t){return h(e)}:"$$equal"===e?function(e,n=t){return m(e,n)}:"$$patch"===e?function(t,e=v){return $(w,t,e)}:"$$each"===e&&c(t)?function(e,o){return n(e)&&u(w,v,"#",e.bind(o)),t.map(e,o).filter((t=>t))}:(o(e)&&a.test(e)&&(e=e.slice(1),n(t[e])||u(w,v,e)),Reflect.get(t,e))),set:(t,e,s)=>{const i=h(t[e]),f=!(o(e)&&a.test(e));if(n(s)){s=d(w,v,e,s,g)}f&&r(s)&&(s=l(s,w),p(v,e,s,b));const u=!f||t[e]!==s||"length"===e&&c(t);if(!(!f||Reflect.set(t,e,s)))return!1;if(u){const n=[e,"*"];c(t)&&!isNaN(e)&&n.push("#");(async()=>{y.emit(n,s,i,e,v)})()}return!0},deleteProperty:(t,e)=>{const n=h(t[e]);if(!Reflect.deleteProperty(t,e))return!1;g.emit(e),b.emit(e);const o=[e,"*"];c(t)&&!isNaN(e)&&o.push("#");return(async()=>{y.emit(o,void 0,n,e,v)})(),!0}});for(const t in s){if(n(s[t])){const e=s[t],n=d(w,v,t,e,g);!(o(t)&&a.test(t))?s[t]=n:delete s[t]}if(r(s[t])){const e=l(s[t],w);s[t]=e,p(v,t,e,b)}}return v}function u(t,e,n,o){const c=t.value;if(!c)return;const r=c.get(e)||{};r[n]=o||null,c.set(e,r)}function d(t,n,o,c,r){return r.emit(o),function(t,e,n){if(t.value)throw Error("Collision in state binding");const o=t.value=new Map,c=e();delete t.value;for(const t of o){const[e,o]=t;for(const t in o)n(e,t,o[t])}return c}(t,(()=>c(n,o)),((t,s,i)=>{let a;a=i?(t,c,r,s)=>{isNaN(r)||(r=parseInt(r),e(c)||(c=i(c,r,s)),e(t)||(t=i(t,r,s)),n.$$emit(`#${o}`,t,c,r,s))}:()=>{const t=c(n,o);n[o]=t},t.$$on(s,a),r.once(o,(()=>t.$$off(s,a)))}))}function p(t,e,n,o){if(o.emit(e),!n[i])return;const c=(...n)=>{t.$$emit([e,"*"],...n,e)};n.$$on("*",c),o.once(e,(()=>n.$$off("*",c)))}function h(t){if(!r(t))return t;const e=c(t)?[]:{};for(const n in t)e[n]=h(t[n]);return e}function $(t,n,o){const i=c(o);for(const s in n)if(r(n[s]))if(r(o[s]))$(t,n[s],o[s]);else{const e=l(c(n[s])?[]:{},t);$(t,n[s],e),i?o.splice(parseInt(s),1,e):o[s]=e}else e(n[s])||(i?o.splice(parseInt(s),1,n[s]):o[s]=n[s]);if(i){const t=c(n)?n.length:0,e=o.length-t;e>0&&o.splice(t,e)}else for(const t in o)s(n,t)||delete o[t]}function m(t,e){if(r(t)&&r(e)){for(const n in e)if(!s(t,n))return!1;for(const n in t)if(!m(t[n],e[n]))return!1}else if(t!==e)return!1;return!0}function w(t,e){const{target:n,context:o}=e||{},c=y(t,o);if(c){const t=function(t){const{MutationObserver:e,CustomEvent:n,Node:o}=window,c=o.ELEMENT_NODE,r=new e((function(t){const e=(t,o)=>{const c=t.children;for(let t=0;t<c.length;t++)e(c[t],o);const r=new n(o);t.dispatchEvent(r)};for(const o of t)if("childList"===o.type)o.addedNodes.forEach((t=>{t.nodeType===c&&e(t,"mounted")})),o.removedNodes.forEach((t=>{t.nodeType===c&&e(t,"removed")}));else if("attributes"===o.type){const t=o.target,e=o.attributeName,c=o.oldValue,r=t.getAttribute(e);if(c!==r){const o=new n("changed",{detail:{attributeName:e,oldValue:c,newValue:r}});t.dispatchEvent(o)}}}));return r.observe(t,{childList:!0,subtree:!0,attributeOldValue:!0}),r}(n||c);c.addEventListener("removed",(e=>{e.target===c&&t.disconnect()}),!1),n&&n.appendChild(c)}return c}function y(t,s,i){if(!r(t))return;const{document:a}=window;let f;if((t={...t}).view){if(f=t.view,delete t.view,n(f))return y(f(t),s,i);if(o(f)){const e=a.createElement("div");return e.innerHTML=f,t.view=e.firstChild,y(t,s,i)}}i||"SVG"!==`${t.tagName}`.toUpperCase()||(i="http://www.w3.org/2000/svg");const{tagName:u="DIV",namespaceURI:d=i,attributes:p,classList:h,on:$,children:m}=t;delete t.tagName,delete t.namespaceURI,delete t.attributes,delete t.classList,delete t.on,delete t.children,f||(f=d?a.createElementNS(d,u):a.createElement(u));const w=l({},s);f.addEventListener("removed",(()=>{w.$$off(),delete w["*"]}),!1);for(const t in $){const e=$[t];n(e)&&f.addEventListener(t,e)}for(const t in p){const e=p[t],o=e=>{f.setAttribute(t,e)};if(n(e)){const n=`$attributes.${t}`;w.$$on(n,o),w[n]=e}else o(e)}if(!e(h)){const t=t=>{c(t)&&(t=t.join(" ")),f.classList=t};if(n(h)){const e="$classList";w.$$on(e,t),w[e]=h}else t(h)}if(g(w,f,t),!e(m)){const t="$children",o=t=>{if(f.innerHTML="",!e(t)){const e=[].concat(t);for(const t of e){const e=y(t,s,d);e&&f.appendChild(e)}}},c=(t,n,o)=>{if(e(t)){const t=f.children[o];t&&f.removeChild(t)}else if(e(n)){const e=y(t,s,d);e&&f.appendChild(e)}else{const e=f.children[o],n=y(t,s,d);n&&e&&f.replaceChild(n,e)}};n(m)?(w.$$on(t,o),w.$$on("#"+t,c),w[t]=m):o(m)}return f}function g(t,o,c,...s){for(const i in c){const a=c[i],f=n=>{if(r(n)){const e=o[i];e&&g(t,e,n,...s,i)}else e(n)||(o[i]=n)};if(n(a)){const e="$"+[].concat(s,i).join(".");t.$$on(e,f),t[e]=a}else f(a)}}function b(t,e){const{lang:n=navigator.language,fallback:c="en",context:s}=e||{};function i(e,n,s){if(o(n)&&(s=n,n=null),s||(s=a.$lang),s&&t[s]||(s=c),!s)return e;let i=`${e}`.split(".").reduce(((t,e)=>r(t)?t[e]:""),t[s]);for(const t in n){const e=new RegExp(`%{${t}}`,"g");i=i.replace(e,n[t])}return i}const a=l({lang:t[n]?n:c,locales:Object.keys(t),t:()=>i},s);return Object.seal(a),a}function v(t,e){const{home:n,context:o}=e||{},{location:c,addEventListener:r}=window;function i(){if((!c.hash||"#"===c.hash)&&n)return c.hash=n;const{path:e,query:o}=N(c.hash);a.query||(a.query={});for(const t in a.query)s(o,t)||delete a.query[t];for(const t in o)a.query[t]!==o[t]&&(a.query[t]=o[t]);for(const n in t){const o=t[n],c=e.match(o);a.params[n]=c&&c[1]}a.path=e}const a=l({path:"",params:{},query:{},navigate:()=>E},o);return Object.seal(a),i(),a.$$on("*",(()=>{E(a.path,a.query)})),r("hashchange",(()=>i())),a}function E(t,e){const{location:n}=window;if(r(t)&&(e=t,t=null),!o(t)){const{path:e}=N(n.hash);t=e}n.hash=function(t,e){const n=[];for(const t in e)n.push(`${t}=${e[t]}`);let o=t?`#${t}`:"#";n.length&&(o+=`?${n.join("&")}`);return o}(t,e)}function N(t){const e={},n=/[?&]([^=]+)=([^&]*)/g;let o=n.exec(t);const{decodeURIComponent:c}=window;for(;o;){e[c(o[1])]=c(o[2]),o=n.exec(t)}return{path:c((/^#([^?]+)/.exec(t)||[])[1]||""),query:e}}function j(t){const{url:e="/api/rpc",method:n="POST",headers:o={},mode:c,credentials:s}=t,i={};Object.seal(i);return new Proxy(i,{get:(t,i)=>async function(t){const a={};if(t instanceof File||t instanceof Blob){const e=new FormData;e.append("file",t),t=e}else r(t)?(a["Content-Type"]="application/json",t=JSON.stringify(t)):t=`${t}`;const f=await fetch(`${e}/${i}`,{method:n,mode:c,credentials:s,headers:Object.defineProperties(a,{...Object.getOwnPropertyDescriptors(o)}),body:t});if(!f.ok)throw Error(f.statusText);const l=f.headers.get("content-type")||"";return/^application\/json/.test(l)?await f.json():/^application\/octet-stream/.test(l)?await f.blob():await f.text()}})}function O(t,e,n){const{slippage:o}=n||{};let c;const s=async(...n)=>{const o=c,s=t.$$clone();return c=await e(s,o,...n),r(c)&&t.$$patch(c),c};let i;return"number"==typeof o?async function(...t){return new Promise((e=>{clearTimeout(i),i=setTimeout((async()=>e(await s(...t))),i?o:0)}))}:s}export{b as createL10n,j as createRPC,v as createRouter,l as createState,O as createSync,w as createView};
