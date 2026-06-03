import{d as p,ac as l,a2 as u,j as b,u as a,cm as v,cn as f,co as I,cp as R,cq as y,by as j,a3 as n,m as o,ch as W}from"./app-core-BBiCCfYH.js";import{p as $,q as d}from"./vuetify-BC4vKTOI.js";const g="/assets/background-1-BsufcZNu.jpg",C="/assets/background-2-Iej3vnSa.jpg",k="/assets/background-3-ChOOOPlx.jpg",w={__name:"DemoCustomInputCustomCheckboxesWithImage",setup(m){const i=[{bgImage:g,value:"basic"},{bgImage:C,value:"premium"},{bgImage:k,value:"enterprise"}],e=p(["basic"]);return(r,t)=>{const s=v;return u(),l(s,{"selected-checkbox":a(e),"onUpdate:selectedCheckbox":t[0]||(t[0]=c=>b(e)?e.value=c:null),"checkbox-content":i,"grid-column":{sm:"4",cols:"12"}},null,8,["selected-checkbox"])}}},S={__name:"DemoCustomInputCustomRadiosWithImage",setup(m){const i=[{bgImage:g,value:"basic"},{bgImage:C,value:"premium"},{bgImage:k,value:"enterprise"}],e=p("basic");return(r,t)=>{const s=f;return u(),l(s,{"selected-radio":a(e),"onUpdate:selectedRadio":t[0]||(t[0]=c=>b(e)?e.value=c:null),"radio-content":i,"grid-column":{sm:"4",cols:"12"}},null,8,["selected-radio"])}}},D={__name:"DemoCustomInputCustomCheckboxesWithIcon",setup(m){const i=[{title:"Backup",desc:"Backup every file from your project.",value:"backup",icon:"ri-server-line"},{title:"Encrypt",desc:"Translate your data to encrypted text.",value:"encrypt",icon:"ri-shield-line"},{title:"Site Lock",desc:"Security tool to protect your website.",value:"site-lock",icon:"ri-lock-line"}],e=p(["backup"]);return(r,t)=>{const s=I;return u(),l(s,{"selected-checkbox":a(e),"onUpdate:selectedCheckbox":t[0]||(t[0]=c=>b(e)?e.value=c:null),"checkbox-content":i,"grid-column":{sm:"4",cols:"12"}},null,8,["selected-checkbox"])}}},B={__name:"DemoCustomInputCustomRadiosWithIcon",setup(m){const i=[{title:"Starter",desc:"A simple start for everyone.",value:"starter",icon:"ri-rocket-line"},{title:"Standard",desc:"For small to medium businesses.",value:"standard",icon:"ri-user-line"},{title:"Enterprise",desc:"Solution for big organizations.",value:"enterprise",icon:"ri-vip-crown-line"}],e=p("starter");return(r,t)=>{const s=R;return u(),l(s,{"selected-radio":a(e),"onUpdate:selectedRadio":t[0]||(t[0]=c=>b(e)?e.value=c:null),"radio-content":i,"grid-column":{sm:"4",cols:"12"}},null,8,["selected-radio"])}}},G={__name:"DemoCustomInputCustomCheckboxes",setup(m){const i=[{title:"Discount",subtitle:"20%",desc:"Wow! Get 20% off on your next purchase!",value:"discount"},{title:"Updates",subtitle:"Free",desc:"Get Updates regarding related products.",value:"updates"}],e=p(["discount"]);return(r,t)=>{const s=y;return u(),l(s,{"selected-checkbox":a(e),"onUpdate:selectedCheckbox":t[0]||(t[0]=c=>b(e)?e.value=c:null),"checkbox-content":i,"grid-column":{sm:"6",cols:"12"}},null,8,["selected-checkbox"])}}},U={__name:"DemoCustomInputCustomRadios",setup(m){const i=[{title:"Basic",desc:"Get 2 projects with 2 team members.",value:"basic",subtitle:"$1.00"},{title:"Premium",subtitle:"$5.00",desc:"Get 8 projects with 8 team members.",value:"premium"}],e=p("basic");return(r,t)=>{const s=j;return u(),l(s,{"selected-radio":a(e),"onUpdate:selectedRadio":t[0]||(t[0]=c=>b(e)?e.value=c:null),"radio-content":i,"grid-column":{sm:"6",cols:"12"}},null,8,["selected-radio"])}}},E={ts:`<script setup lang="ts">
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
`},F={ts:`<script setup lang="ts">
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
`},A={ts:`<script setup lang="ts">
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
`},P={ts:`<script setup lang="ts">
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
`},z={ts:`<script setup lang="ts">
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
`},L={ts:`<script setup lang="ts">
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
`},V={__name:"custom-input",setup(m){return(i,e)=>{const r=U,t=W,s=G,c=B,h=D,_=S,x=w;return u(),l($,null,{default:n(()=>[o(d,{cols:"12",md:"6"},{default:n(()=>[o(t,{title:"Custom Radios",code:a(P)},{default:n(()=>[o(r)]),_:1},8,["code"])]),_:1}),o(d,{cols:"12",md:"6"},{default:n(()=>[o(t,{title:"Custom Checkboxes",code:a(E)},{default:n(()=>[o(s)]),_:1},8,["code"])]),_:1}),o(d,{cols:"12",md:"6"},{default:n(()=>[o(t,{title:"Custom Radios With Icon",code:a(z)},{default:n(()=>[o(c)]),_:1},8,["code"])]),_:1}),o(d,{cols:"12",md:"6"},{default:n(()=>[o(t,{title:"Custom Checkboxes With Icon",code:a(F)},{default:n(()=>[o(h)]),_:1},8,["code"])]),_:1}),o(d,{cols:"12",md:"6"},{default:n(()=>[o(t,{title:"Custom Radios With Image",code:a(L)},{default:n(()=>[o(_)]),_:1},8,["code"])]),_:1}),o(d,{cols:"12",md:"6"},{default:n(()=>[o(t,{title:"Custom Checkboxes With Image",code:a(A)},{default:n(()=>[o(x)]),_:1},8,["code"])]),_:1})]),_:1})}}};export{V as default};
