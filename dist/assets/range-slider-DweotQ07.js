import{aF as m,a as R,p as h,q as p}from"./vuetify-BC4vKTOI.js";import{d as V,ac as d,a2 as c,j as _,u as i,a3 as n,m as t,ch as D,ab as o,U as r}from"./app-core-BBiCCfYH.js";const k={__name:"DemoRangeSliderVertical",setup(u){const e=V([20,40]);return(s,l)=>(c(),d(m,{modelValue:i(e),"onUpdate:modelValue":l[0]||(l[0]=a=>_(e)?e.value=a:null),direction:"vertical"},null,8,["modelValue"]))}},w={__name:"DemoRangeSliderThumbLabel",setup(u){const e=["Winter","Spring","Summer","Fall"],s=["ri-snowy-line","ri-leaf-line","ri-fire-line","ri-drop-line"],l=V([1,2]);return(a,b)=>(c(),d(m,{modelValue:i(l),"onUpdate:modelValue":b[0]||(b[0]=f=>_(l)?l.value=f:null),tick:e,min:"0",max:"3",step:1,"show-ticks":"always","thumb-label":"","tick-size":"4"},{"thumb-label":n(({modelValue:f})=>[t(R,{icon:s[f]},null,8,["icon"])]),_:1},8,["modelValue"]))}},y={__name:"DemoRangeSliderStep",setup(u){const e=V([20,40]);return(s,l)=>(c(),d(m,{modelValue:i(e),"onUpdate:modelValue":l[0]||(l[0]=a=>_(e)?e.value=a:null),step:"10"},null,8,["modelValue"]))}},x={__name:"DemoRangeSliderColor",setup(u){const e=V([10,60]);return(s,l)=>(c(),d(m,{modelValue:i(e),"onUpdate:modelValue":l[0]||(l[0]=a=>_(e)?e.value=a:null),color:"success","track-color":"secondary"},null,8,["modelValue"]))}},U={__name:"DemoRangeSliderDisabled",setup(u){const e=V([30,60]);return(s,l)=>(c(),d(m,{modelValue:i(e),"onUpdate:modelValue":l[0]||(l[0]=a=>_(e)?e.value=a:null),disabled:"",label:"Disabled"},null,8,["modelValue"]))}},j={__name:"DemoRangeSliderBasic",setup(u){const e=V([10,60]);return(s,l)=>(c(),d(m,{modelValue:i(e),"onUpdate:modelValue":l[0]||(l[0]=a=>_(e)?e.value=a:null)},null,8,["modelValue"]))}},C={ts:`<script setup lang="ts">
const sliderValues = ref([10, 60])
<\/script>

<template>
  <VRangeSlider v-model="sliderValues" />
</template>
`,js:`<script setup>
const sliderValues = ref([
  10,
  60,
])
<\/script>

<template>
  <VRangeSlider v-model="sliderValues" />
</template>
`},$={ts:`<script lang="ts" setup>
const sliderValues = ref([10, 60])
<\/script>

<template>
  <VRangeSlider
    v-model="sliderValues"
    color="success"
    track-color="secondary"
  />
</template>
`,js:`<script setup>
const sliderValues = ref([
  10,
  60,
])
<\/script>

<template>
  <VRangeSlider
    v-model="sliderValues"
    color="success"
    track-color="secondary"
  />
</template>
`},B={ts:`<script lang="ts" setup>
const slidersValues = ref([30, 60])
<\/script>

<template>
  <VRangeSlider
    v-model="slidersValues"
    disabled
    label="Disabled"
  />
</template>
`,js:`<script setup>
const slidersValues = ref([
  30,
  60,
])
<\/script>

<template>
  <VRangeSlider
    v-model="slidersValues"
    disabled
    label="Disabled"
  />
</template>
`},T={ts:`<script lang="ts" setup>
const sliderValues = ref([20, 40])
<\/script>

<template>
  <VRangeSlider
    v-model="sliderValues"
    step="10"
  />
</template>
`,js:`<script setup>
const sliderValues = ref([
  20,
  40,
])
<\/script>

<template>
  <VRangeSlider
    v-model="sliderValues"
    step="10"
  />
</template>
`},z={ts:`<script lang="ts" setup>
const seasons = ['Winter', 'Spring', 'Summer', 'Fall']
const icons = ['ri-snowy-line', 'ri-leaf-line', 'ri-fire-line', 'ri-drop-line']
const sliderValues = ref([1, 2])
<\/script>

<template>
  <VRangeSlider
    v-model="sliderValues"
    :tick="seasons"
    min="0"
    max="3"
    :step="1"
    show-ticks="always"
    thumb-label
    tick-size="4"
  >
    <template #thumb-label="{ modelValue }">
      <VIcon :icon="icons[modelValue]" />
    </template>
  </VRangeSlider>
</template>
`,js:`<script setup>
const seasons = [
  'Winter',
  'Spring',
  'Summer',
  'Fall',
]

const icons = [
  'ri-snowy-line',
  'ri-leaf-line',
  'ri-fire-line',
  'ri-drop-line',
]

const sliderValues = ref([
  1,
  2,
])
<\/script>

<template>
  <VRangeSlider
    v-model="sliderValues"
    :tick="seasons"
    min="0"
    max="3"
    :step="1"
    show-ticks="always"
    thumb-label
    tick-size="4"
  >
    <template #thumb-label="{ modelValue }">
      <VIcon :icon="icons[modelValue]" />
    </template>
  </VRangeSlider>
</template>
`},F={ts:`<script lang="ts" setup>
const sliderValues = ref([20, 40])
<\/script>

<template>
  <VRangeSlider
    v-model="sliderValues"
    direction="vertical"
  />
</template>
`,js:`<script setup>
const sliderValues = ref([
  20,
  40,
])
<\/script>

<template>
  <VRangeSlider
    v-model="sliderValues"
    direction="vertical"
  />
</template>
`},N={__name:"range-slider",setup(u){return(e,s)=>{const l=j,a=D,b=U,f=x,g=y,S=w,v=k;return c(),d(h,null,{default:n(()=>[t(p,{cols:"12",md:"6"},{default:n(()=>[t(a,{title:"Basic",code:i(C)},{default:n(()=>[s[0]||(s[0]=o("p",null,[r("The "),o("code",null,"v-slider"),r(" component is a better visualization of the number input.")],-1)),t(l)]),_:1,__:[0]},8,["code"])]),_:1}),t(p,{cols:"12",md:"6"},{default:n(()=>[t(a,{title:"Disabled",code:i(B)},{default:n(()=>[s[1]||(s[1]=o("p",null,[r("You cannot interact with "),o("code",null,"disabled"),r(" sliders.")],-1)),t(b)]),_:1,__:[1]},8,["code"])]),_:1}),t(p,{cols:"12",md:"6"},{default:n(()=>[t(a,{title:"Color",code:i($)},{default:n(()=>[s[2]||(s[2]=o("p",null,[r("Use "),o("code",null,"color"),r(" prop to the sets the slider color. "),o("code",null,"track-color"),r(" prop to sets the color of slider's unfilled track.")],-1)),t(f)]),_:1,__:[2]},8,["code"])]),_:1}),t(p,{cols:"12",md:"6"},{default:n(()=>[t(a,{title:"Step",code:i(T)},{default:n(()=>[s[3]||(s[3]=o("p",null,[o("code",null,"v-range-slider"),r(" can have steps other than 1. This can be helpful for some applications where you need to adjust values with more or less accuracy.")],-1)),t(g)]),_:1,__:[3]},8,["code"])]),_:1}),t(p,{cols:"12",md:"6"},{default:n(()=>[t(a,{title:"Thumb label",code:i(z)},{default:n(()=>[s[4]||(s[4]=o("p",null,[r(" Using the "),o("code",null,"tick-labels"),r(" prop along with the "),o("code",null,"thumb-label"),r(" slot, you can create a very customized solution. ")],-1)),t(S)]),_:1,__:[4]},8,["code"])]),_:1}),t(p,{cols:"12",md:"6"},{default:n(()=>[t(a,{title:"Vertical",code:i(F)},{default:n(()=>[s[5]||(s[5]=o("p",null,[r("You can use the "),o("code",null,"vertical"),r(" prop to switch sliders to a vertical orientation. If you need to change the height of the slider, use css.")],-1)),t(v)]),_:1,__:[5]},8,["code"])]),_:1})]),_:1})}}};export{N as default};
