import{_ as v}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{a as b,V as f}from"./VRow-ByDvHjdU.js";import{V as _}from"./form-C_EOo_VS.js";import{V as I}from"./VCheckbox-BQOjf-_0.js";import{f as u,l as k,o as r,e as n,c as x,F as y,i as R,q as W,b as c,x as j,d as p,z as $,t as B,v as g,r as C,aI as h,m,a1 as G}from"./index-Xnta81-C.js";import{_ as q}from"./CustomRadiosWithImage-BqZzUcAf.js";import{_ as A}from"./CustomRadiosWithIcon-CEBoDLHe.js";import{V as F}from"./VSpacer-B-QM8Y1F.js";import{_ as E}from"./AppCardCode-Cql4ot3u.js";import{_ as z}from"./CustomRadios-Vls_wqdW.js";/* empty css              */import"./VCheckboxBtn-DxQwtIM7.js";import"./VSelectionControl-D8VN37zL.js";import"./VInput-DL-1e1Pe.js";import"./VRadioGroup--_YXBNJb.js";import"./VAvatar-CNwPv5mj.js";import"./VImg-BvjFj37R.js";import"./vue3-perfect-scrollbar-C4_I5GX8.js";import"./VCard-Dh-39NTh.js";import"./VCardText-Cx9wtuh2.js";import"./VDivider-BZv2b_Ga.js";const O=["src"],L={__name:"CustomCheckboxesWithImage",props:{selectedCheckbox:{type:Array,required:!0},checkboxContent:{type:Array,required:!0},gridColumn:{type:null,required:!1}},emits:["update:selectedCheckbox"],setup(i,{emit:a}){const e=i,d=a,o=t=>{typeof t!="boolean"&&t!==null&&d("update:selectedCheckbox",t)};return(t,l)=>e.checkboxContent&&e.selectedCheckbox?(r(),u(f,{key:0},{default:n(()=>[(r(!0),x(y,null,R(e.checkboxContent,s=>(r(),u(b,W({key:s.value,ref_for:!0},i.gridColumn),{default:n(()=>[c(_,{class:j(["custom-input custom-checkbox rounded-xl cursor-pointer w-100",e.selectedCheckbox.includes(s.value)?"active":""])},{default:n(()=>[p("div",null,[c(I,{id:`custom-checkbox-with-img-${s.value}`,"model-value":e.selectedCheckbox,value:s.value,"onUpdate:modelValue":o},null,8,["id","model-value","value"])]),p("img",{src:s.bgImage,alt:"bg-img",class:"custom-checkbox-image"},null,8,O)]),_:2},1032,["class"]),s.label||t.$slots.label?(r(),u(_,{key:0,for:`custom-checkbox-with-img-${s.value}`,class:"cursor-pointer"},{default:n(()=>[$(t.$slots,"label",{label:s.label},()=>[B(g(s.label),1)],!0)]),_:2},1032,["for"])):k("",!0)]),_:2},1040))),128))]),_:3})):k("",!0)}},N=v(L,[["__scopeId","data-v-168d8464"]]),S="/assets/background-1-BsufcZNu.jpg",w="/assets/background-2-Iej3vnSa.jpg",V="/assets/background-3-ChOOOPlx.jpg",P={__name:"DemoCustomInputCustomCheckboxesWithImage",setup(i){const a=[{bgImage:S,value:"basic"},{bgImage:w,value:"premium"},{bgImage:V,value:"enterprise"}],e=C(["basic"]);return(d,o)=>{const t=N;return r(),u(t,{"selected-checkbox":m(e),"onUpdate:selectedCheckbox":o[0]||(o[0]=l=>h(e)?e.value=l:null),"checkbox-content":a,"grid-column":{sm:"4",cols:"12"}},null,8,["selected-checkbox"])}}},T={__name:"DemoCustomInputCustomRadiosWithImage",setup(i){const a=[{bgImage:S,value:"basic"},{bgImage:w,value:"premium"},{bgImage:V,value:"enterprise"}],e=C("basic");return(d,o)=>{const t=q;return r(),u(t,{"selected-radio":m(e),"onUpdate:selectedRadio":o[0]||(o[0]=l=>h(e)?e.value=l:null),"radio-content":a,"grid-column":{sm:"4",cols:"12"}},null,8,["selected-radio"])}}},Z={class:"d-flex flex-column align-center text-center gap-2"},H={class:"cr-title text-base"},J={class:"text-sm text-medium-emphasis clamp-text mb-0"},K={__name:"CustomCheckboxesWithIcon",props:{selectedCheckbox:{type:Array,required:!0},checkboxContent:{type:Array,required:!0},gridColumn:{type:null,required:!1}},emits:["update:selectedCheckbox"],setup(i,{emit:a}){const e=i,d=a,o=t=>{typeof t!="boolean"&&t!==null&&d("update:selectedCheckbox",t)};return(t,l)=>e.checkboxContent&&e.selectedCheckbox?(r(),u(f,{key:0},{default:n(()=>[(r(!0),x(y,null,R(e.checkboxContent,s=>(r(),u(b,W({key:s.title,ref_for:!0},i.gridColumn),{default:n(()=>[c(_,{class:j(["custom-input custom-checkbox-icon rounded-xl cursor-pointer",e.selectedCheckbox.includes(s.value)?"active":""])},{default:n(()=>[$(t.$slots,"default",{item:s},()=>[p("div",Z,[c(G,{size:"28",icon:s.icon,class:"text-high-emphasis"},null,8,["icon"]),p("h6",H,g(s.title),1),p("p",J,g(s.desc),1)])],!0),p("div",null,[c(I,{"model-value":e.selectedCheckbox,value:s.value,"onUpdate:modelValue":o},null,8,["model-value","value"])])]),_:2},1032,["class"])]),_:2},1040))),128))]),_:3})):k("",!0)}},M=v(K,[["__scopeId","data-v-53e545cd"]]),Q={__name:"DemoCustomInputCustomCheckboxesWithIcon",setup(i){const a=[{title:"Backup",desc:"Backup every file from your project.",value:"backup",icon:"ri-server-line"},{title:"Encrypt",desc:"Translate your data to encrypted text.",value:"encrypt",icon:"ri-shield-line"},{title:"Site Lock",desc:"Security tool to protect your website.",value:"site-lock",icon:"ri-lock-line"}],e=C(["backup"]);return(d,o)=>{const t=M;return r(),u(t,{"selected-checkbox":m(e),"onUpdate:selectedCheckbox":o[0]||(o[0]=l=>h(e)?e.value=l:null),"checkbox-content":a,"grid-column":{sm:"4",cols:"12"}},null,8,["selected-checkbox"])}}},X={__name:"DemoCustomInputCustomRadiosWithIcon",setup(i){const a=[{title:"Starter",desc:"A simple start for everyone.",value:"starter",icon:"ri-rocket-line"},{title:"Standard",desc:"For small to medium businesses.",value:"standard",icon:"ri-user-line"},{title:"Enterprise",desc:"Solution for big organizations.",value:"enterprise",icon:"ri-vip-crown-line"}],e=C("starter");return(d,o)=>{const t=A;return r(),u(t,{"selected-radio":m(e),"onUpdate:selectedRadio":o[0]||(o[0]=l=>h(e)?e.value=l:null),"radio-content":a,"grid-column":{sm:"4",cols:"12"}},null,8,["selected-radio"])}}},Y={class:"flex-grow-1"},ee={class:"d-flex align-center mb-2"},te={class:"cr-title text-base"},oe={key:0,class:"text-sm text-disabled"},se={class:"text-sm text-medium-emphasis mb-0"},ce={__name:"CustomCheckboxes",props:{selectedCheckbox:{type:Array,required:!0},checkboxContent:{type:Array,required:!0},gridColumn:{type:null,required:!1}},emits:["update:selectedCheckbox"],setup(i,{emit:a}){const e=i,d=a,o=t=>{typeof t!="boolean"&&t!==null&&d("update:selectedCheckbox",t)};return(t,l)=>e.checkboxContent&&e.selectedCheckbox?(r(),u(f,{key:0},{default:n(()=>[(r(!0),x(y,null,R(e.checkboxContent,s=>(r(),u(b,W({key:s.title,ref_for:!0},i.gridColumn),{default:n(()=>[c(_,{class:j(["custom-input custom-checkbox rounded-xl cursor-pointer",e.selectedCheckbox.includes(s.value)?"active":""])},{default:n(()=>[p("div",null,[c(I,{"model-value":e.selectedCheckbox,value:s.value,"onUpdate:modelValue":o},null,8,["model-value","value"])]),$(t.$slots,"default",{item:s},()=>[p("div",Y,[p("div",ee,[p("h6",te,g(s.title),1),c(F),s.subtitle?(r(),x("span",oe,g(s.subtitle),1)):k("",!0)]),p("p",se,g(s.desc),1)])],!0)]),_:2},1032,["class"])]),_:2},1040))),128))]),_:3})):k("",!0)}},ne=v(ce,[["__scopeId","data-v-9d245e14"]]),ae={__name:"DemoCustomInputCustomCheckboxes",setup(i){const a=[{title:"Discount",subtitle:"20%",desc:"Wow! Get 20% off on your next purchase!",value:"discount"},{title:"Updates",subtitle:"Free",desc:"Get Updates regarding related products.",value:"updates"}],e=C(["discount"]);return(d,o)=>{const t=ne;return r(),u(t,{"selected-checkbox":m(e),"onUpdate:selectedCheckbox":o[0]||(o[0]=l=>h(e)?e.value=l:null),"checkbox-content":a,"grid-column":{sm:"6",cols:"12"}},null,8,["selected-checkbox"])}}},re={__name:"DemoCustomInputCustomRadios",setup(i){const a=[{title:"Basic",desc:"Get 2 projects with 2 team members.",value:"basic",subtitle:"$1.00"},{title:"Premium",subtitle:"$5.00",desc:"Get 8 projects with 8 team members.",value:"premium"}],e=C("basic");return(d,o)=>{const t=z;return r(),u(t,{"selected-radio":m(e),"onUpdate:selectedRadio":o[0]||(o[0]=l=>h(e)?e.value=l:null),"radio-content":a,"grid-column":{sm:"6",cols:"12"}},null,8,["selected-radio"])}}},le={ts:`<script setup lang="ts">
import type { CustomInputContent } from '@core/types'

const checkboxContent: CustomInputContent[] = [
  {
    title: 'Discount',
    subtitle: '20%',
    desc: 'Wow! Get 20% off on your next purchase!',
    value: 'discount',
  },
  {
    title: 'Updates',
    subtitle: 'Free',
    desc: 'Get Updates regarding related products.',
    value: 'updates',
  },
]

const selectedCheckbox = ref(['discount'])
<\/script>

<template>
  <CustomCheckboxes
    v-model:selected-checkbox="selectedCheckbox"
    :checkbox-content="checkboxContent"
    :grid-column="{ sm: '6', cols: '12' }"
  />
</template>
`,js:`<script setup>
const checkboxContent = [
  {
    title: 'Discount',
    subtitle: '20%',
    desc: 'Wow! Get 20% off on your next purchase!',
    value: 'discount',
  },
  {
    title: 'Updates',
    subtitle: 'Free',
    desc: 'Get Updates regarding related products.',
    value: 'updates',
  },
]

const selectedCheckbox = ref(['discount'])
<\/script>

<template>
  <CustomCheckboxes
    v-model:selected-checkbox="selectedCheckbox"
    :checkbox-content="checkboxContent"
    :grid-column="{ sm: '6', cols: '12' }"
  />
</template>
`},ie={ts:`<script setup lang="ts">
import type { CustomInputContent } from '@core/types'

const checkboxContent: CustomInputContent[] = [
  {
    title: 'Backup',
    desc: 'Backup every file from your project.',
    value: 'backup',
    icon: 'ri-server-line',
  },
  {
    title: 'Encrypt',
    desc: 'Translate your data to encrypted text.',
    value: 'encrypt',
    icon: 'ri-shield-line',
  },
  {
    title: 'Site Lock',
    desc: 'Security tool to protect your website.',
    value: 'site-lock',
    icon: 'ri-lock-line',
  },
]

const selectedCheckbox = ref(['backup'])
<\/script>

<template>
  <CustomCheckboxesWithIcon
    v-model:selected-checkbox="selectedCheckbox"
    :checkbox-content="checkboxContent"
    :grid-column="{ sm: '4', cols: '12' }"
  />
</template>
`,js:`<script setup>
const checkboxContent = [
  {
    title: 'Backup',
    desc: 'Backup every file from your project.',
    value: 'backup',
    icon: 'ri-server-line',
  },
  {
    title: 'Encrypt',
    desc: 'Translate your data to encrypted text.',
    value: 'encrypt',
    icon: 'ri-shield-line',
  },
  {
    title: 'Site Lock',
    desc: 'Security tool to protect your website.',
    value: 'site-lock',
    icon: 'ri-lock-line',
  },
]

const selectedCheckbox = ref(['backup'])
<\/script>

<template>
  <CustomCheckboxesWithIcon
    v-model:selected-checkbox="selectedCheckbox"
    :checkbox-content="checkboxContent"
    :grid-column="{ sm: '4', cols: '12' }"
  />
</template>
`},ue={ts:`<script setup lang="ts">
import bg1 from '@images/pages/background-1.jpg'
import bg2 from '@images/pages/background-2.jpg'
import bg3 from '@images/pages/background-3.jpg'

const checkboxContent: { bgImage: string; value: string }[] = [
  {
    bgImage: bg1,
    value: 'basic',
  },
  {
    bgImage: bg2,
    value: 'premium',
  },
  {
    bgImage: bg3,
    value: 'enterprise',
  },
]

const selectedCheckbox = ref(['basic'])
<\/script>

<template>
  <CustomCheckboxesWithImage
    v-model:selected-checkbox="selectedCheckbox"
    :checkbox-content="checkboxContent"
    :grid-column="{ sm: '4', cols: '12' }"
  />
</template>
`,js:`<script setup>
import bg1 from '@images/pages/background-1.jpg'
import bg2 from '@images/pages/background-2.jpg'
import bg3 from '@images/pages/background-3.jpg'

const checkboxContent = [
  {
    bgImage: bg1,
    value: 'basic',
  },
  {
    bgImage: bg2,
    value: 'premium',
  },
  {
    bgImage: bg3,
    value: 'enterprise',
  },
]

const selectedCheckbox = ref(['basic'])
<\/script>

<template>
  <CustomCheckboxesWithImage
    v-model:selected-checkbox="selectedCheckbox"
    :checkbox-content="checkboxContent"
    :grid-column="{ sm: '4', cols: '12' }"
  />
</template>
`},de={ts:`<script setup lang="ts">
import type { CustomInputContent } from '@core/types'

const radioContent: CustomInputContent[] = [
  {
    title: 'Basic',
    desc: 'Get 2 projects with 2 team members.',
    value: 'basic',
    subtitle: '$1.00',
  },
  {
    title: 'Premium',
    subtitle: '$5.00',
    desc: 'Get 8 projects with 8 team members.',
    value: 'premium',
  },
]

const selectedRadio = ref('basic')
<\/script>

<template>
  <CustomRadios
    v-model:selected-radio="selectedRadio"
    :radio-content="radioContent"
    :grid-column="{ sm: '6', cols: '12' }"
  />
</template>
`,js:`<script setup>
const radioContent = [
  {
    title: 'Basic',
    desc: 'Get 2 projects with 2 team members.',
    value: 'basic',
    subtitle: '$1.00',
  },
  {
    title: 'Premium',
    subtitle: '$5.00',
    desc: 'Get 8 projects with 8 team members.',
    value: 'premium',
  },
]

const selectedRadio = ref('basic')
<\/script>

<template>
  <CustomRadios
    v-model:selected-radio="selectedRadio"
    :radio-content="radioContent"
    :grid-column="{ sm: '6', cols: '12' }"
  />
</template>
`},me={ts:`<script setup lang="ts">
import type { CustomInputContent } from '@core/types'

const radioContent: CustomInputContent[] = [
  {
    title: 'Starter',
    desc: 'A simple start for everyone.',
    value: 'starter',
    icon: 'ri-rocket-line',
  },
  {
    title: 'Standard',
    desc: 'For small to medium businesses.',
    value: 'standard',
    icon: 'ri-user-line',
  },
  {
    title: 'Enterprise',
    desc: 'Solution for big organizations.',
    value: 'enterprise',
    icon: 'ri-vip-crown-line',
  },
]

const selectedRadio = ref('starter')
<\/script>

<template>
  <CustomRadiosWithIcon
    v-model:selected-radio="selectedRadio"
    :radio-content="radioContent"
    :grid-column="{ sm: '4', cols: '12' }"
  />
</template>
`,js:`<script setup>
const radioContent = [
  {
    title: 'Starter',
    desc: 'A simple start for everyone.',
    value: 'starter',
    icon: 'ri-rocket-line',
  },
  {
    title: 'Standard',
    desc: 'For small to medium businesses.',
    value: 'standard',
    icon: 'ri-user-line',
  },
  {
    title: 'Enterprise',
    desc: 'Solution for big organizations.',
    value: 'enterprise',
    icon: 'ri-vip-crown-line',
  },
]

const selectedRadio = ref('starter')
<\/script>

<template>
  <CustomRadiosWithIcon
    v-model:selected-radio="selectedRadio"
    :radio-content="radioContent"
    :grid-column="{ sm: '4', cols: '12' }"
  />
</template>
`},pe={ts:`<script setup lang="ts">
import bg1 from '@images/pages/background-1.jpg'
import bg2 from '@images/pages/background-2.jpg'
import bg3 from '@images/pages/background-3.jpg'

const radioContent: { bgImage: string; value: string }[] = [
  {
    bgImage: bg1,
    value: 'basic',
  },
  {
    bgImage: bg2,
    value: 'premium',
  },
  {
    bgImage: bg3,
    value: 'enterprise',
  },
]

const selectedRadio = ref('basic')
<\/script>

<template>
  <CustomRadiosWithImage
    v-model:selected-radio="selectedRadio"
    :radio-content="radioContent"
    :grid-column="{ sm: '4', cols: '12' }"
  />
</template>
`,js:`<script setup>
import bg1 from '@images/pages/background-1.jpg'
import bg2 from '@images/pages/background-2.jpg'
import bg3 from '@images/pages/background-3.jpg'

const radioContent = [
  {
    bgImage: bg1,
    value: 'basic',
  },
  {
    bgImage: bg2,
    value: 'premium',
  },
  {
    bgImage: bg3,
    value: 'enterprise',
  },
]

const selectedRadio = ref('basic')
<\/script>

<template>
  <CustomRadiosWithImage
    v-model:selected-radio="selectedRadio"
    :radio-content="radioContent"
    :grid-column="{ sm: '4', cols: '12' }"
  />
</template>
`},Ge={__name:"custom-input",setup(i){return(a,e)=>{const d=re,o=E,t=ae,l=X,s=Q,D=T,U=P;return r(),u(f,null,{default:n(()=>[c(b,{cols:"12",md:"6"},{default:n(()=>[c(o,{title:"Custom Radios",code:m(de)},{default:n(()=>[c(d)]),_:1},8,["code"])]),_:1}),c(b,{cols:"12",md:"6"},{default:n(()=>[c(o,{title:"Custom Checkboxes",code:m(le)},{default:n(()=>[c(t)]),_:1},8,["code"])]),_:1}),c(b,{cols:"12",md:"6"},{default:n(()=>[c(o,{title:"Custom Radios With Icon",code:m(me)},{default:n(()=>[c(l)]),_:1},8,["code"])]),_:1}),c(b,{cols:"12",md:"6"},{default:n(()=>[c(o,{title:"Custom Checkboxes With Icon",code:m(ie)},{default:n(()=>[c(s)]),_:1},8,["code"])]),_:1}),c(b,{cols:"12",md:"6"},{default:n(()=>[c(o,{title:"Custom Radios With Image",code:m(pe)},{default:n(()=>[c(D)]),_:1},8,["code"])]),_:1}),c(b,{cols:"12",md:"6"},{default:n(()=>[c(o,{title:"Custom Checkboxes With Image",code:m(ue)},{default:n(()=>[c(U)]),_:1},8,["code"])]),_:1})]),_:1})}}};export{Ge as default};
