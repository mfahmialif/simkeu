import{_ as v}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{j as u,a2 as k,k as l,l as n,G as _,N as I,a1 as y,au as b,a3 as R,p as c,ah as x,a4 as W,H as p,aH as j,a5 as $,P as G,Q as g,at as f,r as C,i as h,u as m,q as V,a6 as q}from"./vuetify-52YUcx6A.js";import{_ as A}from"./CustomRadiosWithImage-CjjW5_6W.js";import{_ as E}from"./CustomRadiosWithIcon-Cp0NLBDk.js";import{_ as F}from"./AppCardCode-CZglAVp2.js";import{_ as N}from"./CustomRadios-DVA5Efmk.js";import"./vue3-perfect-scrollbar-Ch7g35tI.js";import"./index-C6UMdXCe.js";const O=["src"],P={__name:"CustomCheckboxesWithImage",props:{selectedCheckbox:{type:Array,required:!0},checkboxContent:{type:Array,required:!0},gridColumn:{type:null,required:!1}},emits:["update:selectedCheckbox"],setup(i,{emit:a}){const e=i,d=a,o=t=>{typeof t!="boolean"&&t!==null&&d("update:selectedCheckbox",t)};return(t,r)=>e.checkboxContent&&e.selectedCheckbox?(l(),u(f,{key:0},{default:n(()=>[(l(!0),_(I,null,y(e.checkboxContent,s=>(l(),u(b,R({key:s.value,ref_for:!0},i.gridColumn),{default:n(()=>[c(x,{class:W(["custom-input custom-checkbox rounded-xl cursor-pointer w-100",e.selectedCheckbox.includes(s.value)?"active":""])},{default:n(()=>[p("div",null,[c(j,{id:`custom-checkbox-with-img-${s.value}`,"model-value":e.selectedCheckbox,value:s.value,"onUpdate:modelValue":o},null,8,["id","model-value","value"])]),p("img",{src:s.bgImage,alt:"bg-img",class:"custom-checkbox-image"},null,8,O)]),_:2},1032,["class"]),s.label||t.$slots.label?(l(),u(x,{key:0,for:`custom-checkbox-with-img-${s.value}`,class:"cursor-pointer"},{default:n(()=>[$(t.$slots,"label",{label:s.label},()=>[G(g(s.label),1)],!0)]),_:2},1032,["for"])):k("",!0)]),_:2},1040))),128))]),_:3})):k("",!0)}},z=v(P,[["__scopeId","data-v-168d8464"]]),S="/assets/background-1-BsufcZNu.jpg",w="/assets/background-2-Iej3vnSa.jpg",D="/assets/background-3-ChOOOPlx.jpg",L={__name:"DemoCustomInputCustomCheckboxesWithImage",setup(i){const a=[{bgImage:S,value:"basic"},{bgImage:w,value:"premium"},{bgImage:D,value:"enterprise"}],e=C(["basic"]);return(d,o)=>{const t=z;return l(),u(t,{"selected-checkbox":m(e),"onUpdate:selectedCheckbox":o[0]||(o[0]=r=>h(e)?e.value=r:null),"checkbox-content":a,"grid-column":{sm:"4",cols:"12"}},null,8,["selected-checkbox"])}}},T={__name:"DemoCustomInputCustomRadiosWithImage",setup(i){const a=[{bgImage:S,value:"basic"},{bgImage:w,value:"premium"},{bgImage:D,value:"enterprise"}],e=C("basic");return(d,o)=>{const t=A;return l(),u(t,{"selected-radio":m(e),"onUpdate:selectedRadio":o[0]||(o[0]=r=>h(e)?e.value=r:null),"radio-content":a,"grid-column":{sm:"4",cols:"12"}},null,8,["selected-radio"])}}},H={class:"d-flex flex-column align-center text-center gap-2"},Q={class:"cr-title text-base"},Z={class:"text-sm text-medium-emphasis clamp-text mb-0"},J={__name:"CustomCheckboxesWithIcon",props:{selectedCheckbox:{type:Array,required:!0},checkboxContent:{type:Array,required:!0},gridColumn:{type:null,required:!1}},emits:["update:selectedCheckbox"],setup(i,{emit:a}){const e=i,d=a,o=t=>{typeof t!="boolean"&&t!==null&&d("update:selectedCheckbox",t)};return(t,r)=>e.checkboxContent&&e.selectedCheckbox?(l(),u(f,{key:0},{default:n(()=>[(l(!0),_(I,null,y(e.checkboxContent,s=>(l(),u(b,R({key:s.title,ref_for:!0},i.gridColumn),{default:n(()=>[c(x,{class:W(["custom-input custom-checkbox-icon rounded-xl cursor-pointer",e.selectedCheckbox.includes(s.value)?"active":""])},{default:n(()=>[$(t.$slots,"default",{item:s},()=>[p("div",H,[c(V,{size:"28",icon:s.icon,class:"text-high-emphasis"},null,8,["icon"]),p("h6",Q,g(s.title),1),p("p",Z,g(s.desc),1)])],!0),p("div",null,[c(j,{"model-value":e.selectedCheckbox,value:s.value,"onUpdate:modelValue":o},null,8,["model-value","value"])])]),_:2},1032,["class"])]),_:2},1040))),128))]),_:3})):k("",!0)}},K=v(J,[["__scopeId","data-v-53e545cd"]]),M={__name:"DemoCustomInputCustomCheckboxesWithIcon",setup(i){const a=[{title:"Backup",desc:"Backup every file from your project.",value:"backup",icon:"ri-server-line"},{title:"Encrypt",desc:"Translate your data to encrypted text.",value:"encrypt",icon:"ri-shield-line"},{title:"Site Lock",desc:"Security tool to protect your website.",value:"site-lock",icon:"ri-lock-line"}],e=C(["backup"]);return(d,o)=>{const t=K;return l(),u(t,{"selected-checkbox":m(e),"onUpdate:selectedCheckbox":o[0]||(o[0]=r=>h(e)?e.value=r:null),"checkbox-content":a,"grid-column":{sm:"4",cols:"12"}},null,8,["selected-checkbox"])}}},X={__name:"DemoCustomInputCustomRadiosWithIcon",setup(i){const a=[{title:"Starter",desc:"A simple start for everyone.",value:"starter",icon:"ri-rocket-line"},{title:"Standard",desc:"For small to medium businesses.",value:"standard",icon:"ri-user-line"},{title:"Enterprise",desc:"Solution for big organizations.",value:"enterprise",icon:"ri-vip-crown-line"}],e=C("starter");return(d,o)=>{const t=E;return l(),u(t,{"selected-radio":m(e),"onUpdate:selectedRadio":o[0]||(o[0]=r=>h(e)?e.value=r:null),"radio-content":a,"grid-column":{sm:"4",cols:"12"}},null,8,["selected-radio"])}}},Y={class:"flex-grow-1"},ee={class:"d-flex align-center mb-2"},te={class:"cr-title text-base"},oe={key:0,class:"text-sm text-disabled"},se={class:"text-sm text-medium-emphasis mb-0"},ce={__name:"CustomCheckboxes",props:{selectedCheckbox:{type:Array,required:!0},checkboxContent:{type:Array,required:!0},gridColumn:{type:null,required:!1}},emits:["update:selectedCheckbox"],setup(i,{emit:a}){const e=i,d=a,o=t=>{typeof t!="boolean"&&t!==null&&d("update:selectedCheckbox",t)};return(t,r)=>e.checkboxContent&&e.selectedCheckbox?(l(),u(f,{key:0},{default:n(()=>[(l(!0),_(I,null,y(e.checkboxContent,s=>(l(),u(b,R({key:s.title,ref_for:!0},i.gridColumn),{default:n(()=>[c(x,{class:W(["custom-input custom-checkbox rounded-xl cursor-pointer",e.selectedCheckbox.includes(s.value)?"active":""])},{default:n(()=>[p("div",null,[c(j,{"model-value":e.selectedCheckbox,value:s.value,"onUpdate:modelValue":o},null,8,["model-value","value"])]),$(t.$slots,"default",{item:s},()=>[p("div",Y,[p("div",ee,[p("h6",te,g(s.title),1),c(q),s.subtitle?(l(),_("span",oe,g(s.subtitle),1)):k("",!0)]),p("p",se,g(s.desc),1)])],!0)]),_:2},1032,["class"])]),_:2},1040))),128))]),_:3})):k("",!0)}},ne=v(ce,[["__scopeId","data-v-9d245e14"]]),ae={__name:"DemoCustomInputCustomCheckboxes",setup(i){const a=[{title:"Discount",subtitle:"20%",desc:"Wow! Get 20% off on your next purchase!",value:"discount"},{title:"Updates",subtitle:"Free",desc:"Get Updates regarding related products.",value:"updates"}],e=C(["discount"]);return(d,o)=>{const t=ne;return l(),u(t,{"selected-checkbox":m(e),"onUpdate:selectedCheckbox":o[0]||(o[0]=r=>h(e)?e.value=r:null),"checkbox-content":a,"grid-column":{sm:"6",cols:"12"}},null,8,["selected-checkbox"])}}},le={__name:"DemoCustomInputCustomRadios",setup(i){const a=[{title:"Basic",desc:"Get 2 projects with 2 team members.",value:"basic",subtitle:"$1.00"},{title:"Premium",subtitle:"$5.00",desc:"Get 8 projects with 8 team members.",value:"premium"}],e=C("basic");return(d,o)=>{const t=N;return l(),u(t,{"selected-radio":m(e),"onUpdate:selectedRadio":o[0]||(o[0]=r=>h(e)?e.value=r:null),"radio-content":a,"grid-column":{sm:"6",cols:"12"}},null,8,["selected-radio"])}}},re={ts:`<script setup lang="ts">
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
`},ve={__name:"custom-input",setup(i){return(a,e)=>{const d=le,o=F,t=ae,r=X,s=M,U=T,B=L;return l(),u(f,null,{default:n(()=>[c(b,{cols:"12",md:"6"},{default:n(()=>[c(o,{title:"Custom Radios",code:m(de)},{default:n(()=>[c(d)]),_:1},8,["code"])]),_:1}),c(b,{cols:"12",md:"6"},{default:n(()=>[c(o,{title:"Custom Checkboxes",code:m(re)},{default:n(()=>[c(t)]),_:1},8,["code"])]),_:1}),c(b,{cols:"12",md:"6"},{default:n(()=>[c(o,{title:"Custom Radios With Icon",code:m(me)},{default:n(()=>[c(r)]),_:1},8,["code"])]),_:1}),c(b,{cols:"12",md:"6"},{default:n(()=>[c(o,{title:"Custom Checkboxes With Icon",code:m(ie)},{default:n(()=>[c(s)]),_:1},8,["code"])]),_:1}),c(b,{cols:"12",md:"6"},{default:n(()=>[c(o,{title:"Custom Radios With Image",code:m(pe)},{default:n(()=>[c(U)]),_:1},8,["code"])]),_:1}),c(b,{cols:"12",md:"6"},{default:n(()=>[c(o,{title:"Custom Checkboxes With Image",code:m(ue)},{default:n(()=>[c(B)]),_:1},8,["code"])]),_:1})]),_:1})}}};export{ve as default};
