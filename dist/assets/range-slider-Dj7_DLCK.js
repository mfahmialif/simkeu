import{r as m,j as d,k as u,i as V,u as i,bI as _,l as r,p as s,q as R,at as h,au as p,H as a,P as n}from"./vuetify-52YUcx6A.js";import{_ as k}from"./AppCardCode-CZglAVp2.js";import"./vue3-perfect-scrollbar-Ch7g35tI.js";import"./index-C6UMdXCe.js";const D={__name:"DemoRangeSliderVertical",setup(c){const e=m([20,40]);return(t,l)=>(u(),d(_,{modelValue:i(e),"onUpdate:modelValue":l[0]||(l[0]=o=>V(e)?e.value=o:null),direction:"vertical"},null,8,["modelValue"]))}},w={__name:"DemoRangeSliderThumbLabel",setup(c){const e=["Winter","Spring","Summer","Fall"],t=["ri-snowy-line","ri-leaf-line","ri-fire-line","ri-drop-line"],l=m([1,2]);return(o,b)=>(u(),d(_,{modelValue:i(l),"onUpdate:modelValue":b[0]||(b[0]=f=>V(l)?l.value=f:null),tick:e,min:"0",max:"3",step:1,"show-ticks":"always","thumb-label":"","tick-size":"4"},{"thumb-label":r(({modelValue:f})=>[s(R,{icon:t[f]},null,8,["icon"])]),_:1},8,["modelValue"]))}},y={__name:"DemoRangeSliderStep",setup(c){const e=m([20,40]);return(t,l)=>(u(),d(_,{modelValue:i(e),"onUpdate:modelValue":l[0]||(l[0]=o=>V(e)?e.value=o:null),step:"10"},null,8,["modelValue"]))}},x={__name:"DemoRangeSliderColor",setup(c){const e=m([10,60]);return(t,l)=>(u(),d(_,{modelValue:i(e),"onUpdate:modelValue":l[0]||(l[0]=o=>V(e)?e.value=o:null),color:"success","track-color":"secondary"},null,8,["modelValue"]))}},j={__name:"DemoRangeSliderDisabled",setup(c){const e=m([30,60]);return(t,l)=>(u(),d(_,{modelValue:i(e),"onUpdate:modelValue":l[0]||(l[0]=o=>V(e)?e.value=o:null),disabled:"",label:"Disabled"},null,8,["modelValue"]))}},U={__name:"DemoRangeSliderBasic",setup(c){const e=m([10,60]);return(t,l)=>(u(),d(_,{modelValue:i(e),"onUpdate:modelValue":l[0]||(l[0]=o=>V(e)?e.value=o:null)},null,8,["modelValue"]))}},C={ts:`<script setup lang="ts">
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
`},I={ts:`<script lang="ts" setup>
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
`},Y={__name:"range-slider",setup(c){return(e,t)=>{const l=U,o=k,b=j,f=x,g=y,S=w,v=D;return u(),d(h,null,{default:r(()=>[s(p,{cols:"12",md:"6"},{default:r(()=>[s(o,{title:"Basic",code:i(C)},{default:r(()=>[t[0]||(t[0]=a("p",null,[n("The "),a("code",null,"v-slider"),n(" component is a better visualization of the number input.")],-1)),s(l)]),_:1,__:[0]},8,["code"])]),_:1}),s(p,{cols:"12",md:"6"},{default:r(()=>[s(o,{title:"Disabled",code:i(B)},{default:r(()=>[t[1]||(t[1]=a("p",null,[n("You cannot interact with "),a("code",null,"disabled"),n(" sliders.")],-1)),s(b)]),_:1,__:[1]},8,["code"])]),_:1}),s(p,{cols:"12",md:"6"},{default:r(()=>[s(o,{title:"Color",code:i($)},{default:r(()=>[t[2]||(t[2]=a("p",null,[n("Use "),a("code",null,"color"),n(" prop to the sets the slider color. "),a("code",null,"track-color"),n(" prop to sets the color of slider's unfilled track.")],-1)),s(f)]),_:1,__:[2]},8,["code"])]),_:1}),s(p,{cols:"12",md:"6"},{default:r(()=>[s(o,{title:"Step",code:i(T)},{default:r(()=>[t[3]||(t[3]=a("p",null,[a("code",null,"v-range-slider"),n(" can have steps other than 1. This can be helpful for some applications where you need to adjust values with more or less accuracy.")],-1)),s(g)]),_:1,__:[3]},8,["code"])]),_:1}),s(p,{cols:"12",md:"6"},{default:r(()=>[s(o,{title:"Thumb label",code:i(z)},{default:r(()=>[t[4]||(t[4]=a("p",null,[n(" Using the "),a("code",null,"tick-labels"),n(" prop along with the "),a("code",null,"thumb-label"),n(" slot, you can create a very customized solution. ")],-1)),s(S)]),_:1,__:[4]},8,["code"])]),_:1}),s(p,{cols:"12",md:"6"},{default:r(()=>[s(o,{title:"Vertical",code:i(I)},{default:r(()=>[t[5]||(t[5]=a("p",null,[n("You can use the "),a("code",null,"vertical"),n(" prop to switch sliders to a vertical orientation. If you need to change the height of the slider, use css.")],-1)),s(v)]),_:1,__:[5]},8,["code"])]),_:1})]),_:1})}}};export{Y as default};
