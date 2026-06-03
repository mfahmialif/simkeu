import{af as _,a1 as g,a2 as m,m as e,d as f,j as V,u as n,a3 as s,ab as r,J as P,ac as L,y as k,x as B,k as $,ch as M,U as t}from"./app-core-BBiCCfYH.js";import{Z as a,p as x,q as v}from"./vuetify-BC4vKTOI.js";const I={},D={class:"demo-space-y"};function U(p,l){return m(),g("div",D,[e(a,{"model-value":"75",striped:""}),e(a,{color:"success","model-value":"55",striped:""}),e(a,{color:"warning","model-value":"35",striped:""})])}const j=_(I,[["render",U]]),R={class:"demo-space-y"},T={__name:"DemoProgressLinearSlots",setup(p){const l=f(20),o=f(33),i=f(78);return(u,c)=>(m(),g("div",R,[e(a,{modelValue:n(i),"onUpdate:modelValue":c[0]||(c[0]=d=>V(i)?i.value=d:null),height:"8"},null,8,["modelValue"]),e(a,{modelValue:n(l),"onUpdate:modelValue":c[1]||(c[1]=d=>V(l)?l.value=d:null),height:"20"},{default:s(({value:d})=>[r("span",null,P(Math.ceil(d))+"%",1)]),_:1},8,["modelValue"]),e(a,{modelValue:n(o),"onUpdate:modelValue":c[2]||(c[2]=d=>V(o)?o.value=d:null),height:"20"},{default:s(()=>[r("span",null,P(Math.ceil(n(o)))+"%",1)]),_:1},8,["modelValue"])]))}},C={},S={class:"demo-space-y"};function N(p,l){return m(),g("div",S,[e(a,{"model-value":"78",height:"8",rounded:""}),e(a,{"model-value":"20",height:"20",rounded:""}),e(a,{"model-value":"33",height:"20",rounded:""})])}const q=_(C,[["render",N]]),A={};function E(p,l){return m(),L(a,{indeterminate:"",reverse:""})}const J=_(A,[["render",E]]),Y={};function Z(p,l){return m(),L(a,{indeterminate:""})}const z=_(Y,[["render",Z]]),F={class:"demo-space-y"},G={__name:"DemoProgressLinearBuffering",setup(p){const l=f(10),o=f(20),i=f(),u=()=>{clearInterval(i.value),i.value=setInterval(()=>{l.value+=Math.random()*10+5,o.value+=Math.random()*10+6},2e3)};return k(u),B(()=>{clearInterval(i.value)}),$(l,()=>{if(l.value<100)return!1;l.value=0,o.value=10,u()}),(c,d)=>(m(),g("div",F,[e(a,{modelValue:n(l),"onUpdate:modelValue":d[0]||(d[0]=h=>V(l)?l.value=h:null),height:"8","buffer-value":n(o)},null,8,["modelValue","buffer-value"])]))}},H={},K={class:"demo-space-y"};function O(p,l){return m(),g("div",K,[e(a,{"model-value":"15"}),e(a,{"model-value":"30",color:"secondary"}),e(a,{"model-value":"45",color:"success"})])}const Q=_(H,[["render",O]]),W={ts:`<script setup lang="ts">
const modelValue = ref(10)
const bufferValue = ref(20)
const interval = ref()

const startBuffer = () => {
  clearInterval(interval.value)

  interval.value = setInterval(() => {
    modelValue.value += Math.random() * (15 - 5) + 5
    bufferValue.value += Math.random() * (15 - 5) + 6
  }, 2000)
}

onMounted(startBuffer)

onBeforeUnmount(() => {
  clearInterval(interval.value)
})

watch(modelValue, () => {
  if (modelValue.value < 100)
    return false

  modelValue.value = 0
  bufferValue.value = 10
  startBuffer()
})
<\/script>

<template>
  <div class="demo-space-y">
    <VProgressLinear
      v-model="modelValue"
      height="8"
      :buffer-value="bufferValue"
    />
  </div>
</template>
`,js:`<script setup>
const modelValue = ref(10)
const bufferValue = ref(20)
const interval = ref()

const startBuffer = () => {
  clearInterval(interval.value)
  interval.value = setInterval(() => {
    modelValue.value += Math.random() * (15 - 5) + 5
    bufferValue.value += Math.random() * (15 - 5) + 6
  }, 2000)
}

onMounted(startBuffer)
onBeforeUnmount(() => {
  clearInterval(interval.value)
})
watch(modelValue, () => {
  if (modelValue.value < 100)
    return false
  modelValue.value = 0
  bufferValue.value = 10
  startBuffer()
})
<\/script>

<template>
  <div class="demo-space-y">
    <VProgressLinear
      v-model="modelValue"
      height="8"
      :buffer-value="bufferValue"
    />
  </div>
</template>
`},X={ts:`<template>
  <div class="demo-space-y">
    <VProgressLinear model-value="15" />

    <VProgressLinear
      model-value="30"
      color="secondary"
    />

    <VProgressLinear
      model-value="45"
      color="success"
    />
  </div>
</template>
`,js:`<template>
  <div class="demo-space-y">
    <VProgressLinear model-value="15" />

    <VProgressLinear
      model-value="30"
      color="secondary"
    />

    <VProgressLinear
      model-value="45"
      color="success"
    />
  </div>
</template>
`},ee={ts:`<template>
  <VProgressLinear indeterminate />
</template>
`,js:`<template>
  <VProgressLinear indeterminate />
</template>
`},oe={ts:`<template>
  <VProgressLinear
    indeterminate
    reverse
  />
</template>
`,js:`<template>
  <VProgressLinear
    indeterminate
    reverse
  />
</template>
`},re={ts:`<template>
  <div class="demo-space-y">
    <VProgressLinear
      model-value="78"
      height="8"
      rounded
    />

    <VProgressLinear
      model-value="20"
      height="20"
      rounded
    />

    <VProgressLinear
      model-value="33"
      height="20"
      rounded
    />
  </div>
</template>
`,js:`<template>
  <div class="demo-space-y">
    <VProgressLinear
      model-value="78"
      height="8"
      rounded
    />

    <VProgressLinear
      model-value="20"
      height="20"
      rounded
    />

    <VProgressLinear
      model-value="33"
      height="20"
      rounded
    />
  </div>
</template>
`},le={ts:`<script setup lang="ts">
const skill = ref(20)
const knowledge = ref(33)
const power = ref(78)
<\/script>

<template>
  <div class="demo-space-y">
    <VProgressLinear
      v-model="power"
      height="8"
    />

    <VProgressLinear
      v-model="skill"
      height="20"
    >
      <template #default="{ value }">
        <span>{{ Math.ceil(value) }}%</span>
      </template>
    </VProgressLinear>

    <VProgressLinear
      v-model="knowledge"
      height="20"
    >
      <span>{{ Math.ceil(knowledge) }}%</span>
    </VProgressLinear>
  </div>
</template>
`,js:`<script setup>
const skill = ref(20)
const knowledge = ref(33)
const power = ref(78)
<\/script>

<template>
  <div class="demo-space-y">
    <VProgressLinear
      v-model="power"
      height="8"
    />

    <VProgressLinear
      v-model="skill"
      height="20"
    >
      <template #default="{ value }">
        <span>{{ Math.ceil(value) }}%</span>
      </template>
    </VProgressLinear>

    <VProgressLinear
      v-model="knowledge"
      height="20"
    >
      <span>{{ Math.ceil(knowledge) }}%</span>
    </VProgressLinear>
  </div>
</template>
`},se={ts:`<template>
  <div class="demo-space-y">
    <VProgressLinear
      model-value="75"
      striped
    />

    <VProgressLinear
      color="success"
      model-value="55"
      striped
    />

    <VProgressLinear
      color="warning"
      model-value="35"
      striped
    />
  </div>
</template>
`,js:`<template>
  <div class="demo-space-y">
    <VProgressLinear
      model-value="75"
      striped
    />

    <VProgressLinear
      color="success"
      model-value="55"
      striped
    />

    <VProgressLinear
      color="warning"
      model-value="35"
      striped
    />
  </div>
</template>
`},ne={__name:"progress-linear",setup(p){return(l,o)=>{const i=Q,u=M,c=G,d=z,h=J,y=q,b=T,w=j;return m(),L(x,{class:"match-height"},{default:s(()=>[e(v,{cols:"12",md:"6"},{default:s(()=>[e(u,{title:"Color",code:n(X)},{default:s(()=>[o[0]||(o[0]=r("p",null,[t("Use the props "),r("code",null,"color"),t(" and "),r("code",null,"background-color"),t(" to set colors.")],-1)),e(i)]),_:1,__:[0]},8,["code"])]),_:1}),e(v,{cols:"12",md:"6"},{default:s(()=>[e(u,{title:"Buffering",code:n(W)},{default:s(()=>[o[1]||(o[1]=r("p",null,[t("The primary value is controlled by "),r("code",null,"v-model"),t(", whereas the buffer is controlled by the "),r("code",null,"buffer-value"),t(" prop.")],-1)),e(c)]),_:1,__:[1]},8,["code"])]),_:1}),e(v,{cols:"12",md:"6"},{default:s(()=>[e(u,{title:"Indeterminate",code:n(ee)},{default:s(()=>[o[2]||(o[2]=r("p",null,[t("for continuously animating progress bar,use prop "),r("code",null,"indeterminate"),t(". This indicates continuous process. ")],-1)),e(d)]),_:1,__:[2]},8,["code"])]),_:1}),e(v,{cols:"12",md:"6"},{default:s(()=>[e(u,{title:"Reversed",code:n(oe)},{default:s(()=>[o[3]||(o[3]=r("p",null,[t("Use prop "),r("code",null,"reverse"),t(" to animate continuously in reverse direction. The component also has RTL support.")],-1)),e(h)]),_:1,__:[3]},8,["code"])]),_:1}),e(v,{cols:"12",md:"6"},{default:s(()=>[e(u,{title:"Rounded",code:n(re)},{default:s(()=>[o[4]||(o[4]=r("p",null,[t("The "),r("code",null," rounded "),t(" prop is used to apply a border radius to the v-progress-linear component.")],-1)),e(y)]),_:1,__:[4]},8,["code"])]),_:1}),e(v,{cols:"12",md:"6"},{default:s(()=>[e(u,{title:"Slots",code:n(le)},{default:s(()=>[o[5]||(o[5]=r("p",null,[t("we can bind user input using "),r("code",null,"v-model"),t(".You can also use the default slot for the same.")],-1)),e(b)]),_:1,__:[5]},8,["code"])]),_:1}),e(v,{cols:"12",md:"6"},{default:s(()=>[e(u,{title:"Striped",code:n(se)},{default:s(()=>[o[6]||(o[6]=r("p",null,[t(" The "),r("code",null,"striped"),t(" prop is used to apply striped background.")],-1)),e(w)]),_:1,__:[6]},8,["code"])]),_:1})]),_:1})}}};export{ne as default};
