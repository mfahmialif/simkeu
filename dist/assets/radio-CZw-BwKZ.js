import{j as c,b as G,o as p,w as t,c as f,F as _,L as b,d as o,N as u,u as s,q as m,O as R,g as i,v as n,_ as y,E as L,G as V}from"./vuetify-Dwmbz9tX.js";import{_ as $}from"./rating-DTOSp-lb.js";import"./index-BfLA9FeW.js";const w={__name:"DemoRadioValidation",setup(v){const a=c(1),l=[d=>d!==3?!0:"Do not select the third one!"];return(d,e)=>(p(),G(R,{modelValue:s(a),"onUpdate:modelValue":e[0]||(e[0]=r=>m(a)?a.value=r:null),inline:"",rules:l},{default:t(()=>[(p(),f(_,null,b(3,r=>o(u,{key:r,error:s(a)===3,label:`Radio ${r}`,value:r},null,8,["error","label","value"])),64))]),_:1},8,["modelValue"]))}},C={__name:"DemoRadioIcon",setup(v){const a=c(1);return(l,d)=>(p(),G(R,{modelValue:s(a),"onUpdate:modelValue":d[0]||(d[0]=e=>m(a)?a.value=e:null),"false-icon":"ri-notification-off-line","true-icon":"ri-notification-3-line"},{default:t(()=>[(p(),f(_,null,b(2,e=>o(u,{key:e,label:`Radio ${e}`,value:e},null,8,["label","value"])),64))]),_:1},8,["modelValue"]))}},U={__name:"DemoRadioLabelSlot",setup(v){const a=c("DuckDuckGo");return(l,d)=>(p(),G(R,{modelValue:s(a),"onUpdate:modelValue":d[0]||(d[0]=e=>m(a)?a.value=e:null)},{label:t(()=>d[1]||(d[1]=[i("div",null,[n("Your favorite "),i("strong",null,"search engine")],-1)])),default:t(()=>[o(u,{value:"Google"},{label:t(()=>d[2]||(d[2]=[i("div",null,[n(" Of course it's "),i("span",{class:"text-success"}," Google ")],-1)])),_:1}),o(u,{value:"DuckDuckGo"},{label:t(()=>d[3]||(d[3]=[i("div",null,[n(" Definitely "),i("span",{class:"text-primary"}," DuckDuckGo ")],-1)])),_:1})]),_:1},8,["modelValue"]))}},S={__name:"DemoRadioDensity",setup(v){const a=c("radio-1"),l=c("radio-1");return(d,e)=>(p(),f(_,null,[o(R,{modelValue:s(a),"onUpdate:modelValue":e[0]||(e[0]=r=>m(a)?a.value=r:null)},{default:t(()=>[o(u,{label:"Option 1",value:"radio-1",density:"compact"}),o(u,{label:"Option 2",value:"radio-2",density:"compact"})]),_:1},8,["modelValue"]),o(y,{class:"my-3"}),o(R,{modelValue:s(l),"onUpdate:modelValue":e[1]||(e[1]=r=>m(l)?l.value=r:null),inline:""},{default:t(()=>[o(u,{label:"Option 1",value:"radio-1",density:"compact"}),o(u,{label:"Option 2",value:"radio-2",density:"compact"})]),_:1},8,["modelValue"])],64))}},j={__name:"DemoRadioInline",setup(v){const a=c("radio-1"),l=c("radio-1");return(d,e)=>(p(),f(_,null,[o(R,{modelValue:s(a),"onUpdate:modelValue":e[0]||(e[0]=r=>m(a)?a.value=r:null)},{default:t(()=>[o(u,{label:"Option 1",value:"radio-1"}),o(u,{label:"Option 2",value:"radio-2"})]),_:1},8,["modelValue"]),o(y,{class:"my-4"}),o(R,{modelValue:s(l),"onUpdate:modelValue":e[1]||(e[1]=r=>m(l)?l.value=r:null),inline:""},{default:t(()=>[o(u,{label:"Option 1",value:"radio-1"}),o(u,{label:"Option 2",value:"radio-2"})]),_:1},8,["modelValue"])],64))}},I={__name:"DemoRadioColors",setup(v){const a=c("primary"),l=["Primary","Secondary","Success","Info","Warning","Error"];return(d,e)=>(p(),G(R,{modelValue:s(a),"onUpdate:modelValue":e[0]||(e[0]=r=>m(a)?a.value=r:null),inline:""},{default:t(()=>[(p(),f(_,null,b(l,r=>o(u,{key:r,label:r,color:r.toLocaleLowerCase(),value:r.toLocaleLowerCase()},null,8,["label","color","value"])),64))]),_:1},8,["modelValue"]))}},B={class:""},E={__name:"DemoRadioBasic",setup(v){const a=c(1);return(l,d)=>(p(),f("div",B,[o(R,{modelValue:s(a),"onUpdate:modelValue":d[0]||(d[0]=e=>m(a)?a.value=e:null)},{default:t(()=>[(p(),f(_,null,b(2,e=>o(u,{key:e,label:`Radio ${e}`,value:e},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]))}},N={ts:`<script lang="ts" setup>
const radioGroup = ref(1)
<\/script>

<template>
  <div class="">
    <VRadioGroup v-model="radioGroup">
      <VRadio
        v-for="n in 2"
        :key="n"
        :label="\`Radio \${n}\`"
        :value="n"
      />
    </VRadioGroup>
  </div>
</template>
`,js:`<script setup>
const radioGroup = ref(1)
<\/script>

<template>
  <div class="">
    <VRadioGroup v-model="radioGroup">
      <VRadio
        v-for="n in 2"
        :key="n"
        :label="\`Radio \${n}\`"
        :value="n"
      />
    </VRadioGroup>
  </div>
</template>
`},A={ts:`<script lang="ts" setup>
const selectedRadio = ref('primary')
const colorsRadio = ['Primary', 'Secondary', 'Success', 'Info', 'Warning', 'Error']
<\/script>

<template>
  <VRadioGroup
    v-model="selectedRadio"
    inline
  >
    <VRadio
      v-for="radio in colorsRadio"
      :key="radio"
      :label="radio"
      :color="radio.toLocaleLowerCase()"
      :value="radio.toLocaleLowerCase()"
    />
  </VRadioGroup>
</template>
`,js:`<script setup>
const selectedRadio = ref('primary')

const colorsRadio = [
  'Primary',
  'Secondary',
  'Success',
  'Info',
  'Warning',
  'Error',
]
<\/script>

<template>
  <VRadioGroup
    v-model="selectedRadio"
    inline
  >
    <VRadio
      v-for="radio in colorsRadio"
      :key="radio"
      :label="radio"
      :color="radio.toLocaleLowerCase()"
      :value="radio.toLocaleLowerCase()"
    />
  </VRadioGroup>
</template>
`},F={ts:`<script lang="ts" setup>
const columnRadio = ref('radio-1')
const inlineRadio = ref('radio-1')
<\/script>

<template>
  <VRadioGroup v-model="columnRadio">
    <VRadio
      label="Option 1"
      value="radio-1"
      density="compact"
    />
    <VRadio
      label="Option 2"
      value="radio-2"
      density="compact"
    />
  </VRadioGroup>

  <VDivider class="my-3" />

  <VRadioGroup
    v-model="inlineRadio"
    inline
  >
    <VRadio
      label="Option 1"
      value="radio-1"
      density="compact"
    />
    <VRadio
      label="Option 2"
      value="radio-2"
      density="compact"
    />
  </VRadioGroup>
</template>
`,js:`<script setup>
const columnRadio = ref('radio-1')
const inlineRadio = ref('radio-1')
<\/script>

<template>
  <VRadioGroup v-model="columnRadio">
    <VRadio
      label="Option 1"
      value="radio-1"
      density="compact"
    />
    <VRadio
      label="Option 2"
      value="radio-2"
      density="compact"
    />
  </VRadioGroup>

  <VDivider class="my-3" />

  <VRadioGroup
    v-model="inlineRadio"
    inline
  >
    <VRadio
      label="Option 1"
      value="radio-1"
      density="compact"
    />
    <VRadio
      label="Option 2"
      value="radio-2"
      density="compact"
    />
  </VRadioGroup>
</template>
`},P={ts:`<script lang="ts" setup>
const radioGroup = ref(1)
<\/script>

<template>
  <VRadioGroup
    v-model="radioGroup"
    false-icon="ri-notification-off-line"
    true-icon="ri-notification-3-line"
  >
    <VRadio
      v-for="n in 2"
      :key="n"
      :label="\`Radio \${n}\`"
      :value="n"
    />
  </VRadioGroup>
</template>
`,js:`<script setup>
const radioGroup = ref(1)
<\/script>

<template>
  <VRadioGroup
    v-model="radioGroup"
    false-icon="ri-notification-off-line"
    true-icon="ri-notification-3-line"
  >
    <VRadio
      v-for="n in 2"
      :key="n"
      :label="\`Radio \${n}\`"
      :value="n"
    />
  </VRadioGroup>
</template>
`},T={ts:`<script lang="ts" setup>
const columnRadio = ref('radio-1')
const inlineRadio = ref('radio-1')
<\/script>

<template>
  <VRadioGroup v-model="columnRadio">
    <VRadio
      label="Option 1"
      value="radio-1"
    />
    <VRadio
      label="Option 2"
      value="radio-2"
    />
  </VRadioGroup>

  <VDivider class="my-4" />

  <VRadioGroup
    v-model="inlineRadio"
    inline
  >
    <VRadio
      label="Option 1"
      value="radio-1"
    />
    <VRadio
      label="Option 2"
      value="radio-2"
    />
  </VRadioGroup>
</template>
`,js:`<script setup>
const columnRadio = ref('radio-1')
const inlineRadio = ref('radio-1')
<\/script>

<template>
  <VRadioGroup v-model="columnRadio">
    <VRadio
      label="Option 1"
      value="radio-1"
    />
    <VRadio
      label="Option 2"
      value="radio-2"
    />
  </VRadioGroup>

  <VDivider class="my-4" />

  <VRadioGroup
    v-model="inlineRadio"
    inline
  >
    <VRadio
      label="Option 1"
      value="radio-1"
    />
    <VRadio
      label="Option 2"
      value="radio-2"
    />
  </VRadioGroup>
</template>
`},W={ts:`<script lang="ts" setup>
const radios = ref('DuckDuckGo')
<\/script>

<template>
  <VRadioGroup v-model="radios">
    <template #label>
      <div>Your favorite <strong>search engine</strong></div>
    </template>

    <VRadio value="Google">
      <template #label>
        <div>
          Of course it's <span class="text-success">
            Google
          </span>
        </div>
      </template>
    </VRadio>

    <VRadio value="DuckDuckGo">
      <template #label>
        <div>
          Definitely <span class="text-primary">
            DuckDuckGo
          </span>
        </div>
      </template>
    </VRadio>
  </VRadioGroup>
</template>
`,js:`<script setup>
const radios = ref('DuckDuckGo')
<\/script>

<template>
  <VRadioGroup v-model="radios">
    <template #label>
      <div>Your favorite <strong>search engine</strong></div>
    </template>

    <VRadio value="Google">
      <template #label>
        <div>
          Of course it's <span class="text-success">
            Google
          </span>
        </div>
      </template>
    </VRadio>

    <VRadio value="DuckDuckGo">
      <template #label>
        <div>
          Definitely <span class="text-primary">
            DuckDuckGo
          </span>
        </div>
      </template>
    </VRadio>
  </VRadioGroup>
</template>
`},Y={ts:`<script lang="ts" setup>
const radioGroup = ref(1)
const rules = [(value: number) => (value !== 3 ? true : 'Do not select the third one!')]
<\/script>

<template>
  <VRadioGroup
    v-model="radioGroup"
    inline
    :rules="rules"
  >
    <VRadio
      v-for="n in 3"
      :key="n"
      :error="radioGroup === 3 "
      :label="\`Radio \${n}\`"
      :value="n"
    />
  </VRadioGroup>
</template>
`,js:`<script setup>
const radioGroup = ref(1)
const rules = [value => value !== 3 ? true : 'Do not select the third one!']
<\/script>

<template>
  <VRadioGroup
    v-model="radioGroup"
    inline
    :rules="rules"
  >
    <VRadio
      v-for="n in 3"
      :key="n"
      :error="radioGroup === 3 "
      :label="\`Radio \${n}\`"
      :value="n"
    />
  </VRadioGroup>
</template>
`},z={__name:"radio",setup(v){return(a,l)=>{const d=E,e=$,r=I,D=j,g=S,k=U,O=C,x=w;return p(),G(L,{class:"match-height"},{default:t(()=>[o(V,{cols:"12",md:"6"},{default:t(()=>[o(e,{title:"Basic",code:s(N)},{default:t(()=>[l[0]||(l[0]=i("p",null,[n("The "),i("code",null,"v-radio"),n(" component is a simple radio button.")],-1)),o(d)]),_:1,__:[0]},8,["code"])]),_:1}),o(V,{cols:"12",md:"6"},{default:t(()=>[o(e,{title:"Colors",code:s(A)},{default:t(()=>[l[1]||(l[1]=i("p",null,[n("Radios can be colored by using any of the built-in colors and contextual names using the "),i("code",null,"color"),n(" prop.")],-1)),o(r)]),_:1,__:[1]},8,["code"])]),_:1}),o(V,{cols:"12",md:"6"},{default:t(()=>[o(e,{title:"Inline",code:s(T)},{default:t(()=>[l[2]||(l[2]=i("p",null,[n("Use "),i("code",null,"inline"),n(" prop to displays radio buttons in row.")],-1)),o(D)]),_:1,__:[2]},8,["code"])]),_:1}),o(V,{cols:"12",md:"6"},{default:t(()=>[o(e,{title:"Density",code:s(F)},{default:t(()=>[l[3]||(l[3]=i("p",null,[n("Use "),i("code",null,"density"),n(" prop to adjusts the spacing within the component. Available options are: "),i("code",null,"default"),n(", "),i("code",null,"comfortable"),n(", and "),i("code",null,"compact"),n(".")],-1)),o(g)]),_:1,__:[3]},8,["code"])]),_:1}),o(V,{cols:"12",md:"6"},{default:t(()=>[o(e,{title:"Label Slot",code:s(W)},{default:t(()=>[l[4]||(l[4]=i("p",null,[n("Radio Group labels can be defined in "),i("code",null,"label"),n(" slot - that will allow to use HTML content.")],-1)),o(k)]),_:1,__:[4]},8,["code"])]),_:1}),o(V,{cols:"12",md:"6"},{default:t(()=>[o(e,{title:"Icon",code:s(P)},{default:t(()=>[l[5]||(l[5]=i("p",null,[n("Use "),i("code",null,"false-icon"),n(" and "),i("code",null,"true-icon"),n(" prop to set icon on inactive and active state.")],-1)),o(O)]),_:1,__:[5]},8,["code"])]),_:1}),o(V,{cols:"12",md:"6"},{default:t(()=>[o(e,{title:"Validation",code:s(Y)},{default:t(()=>[l[6]||(l[6]=i("p",null,[n("Use "),i("code",null,"rules"),n(" prop to validate a radio. Accepts a mixed array of types "),i("code",null,"function"),n(", "),i("code",null,"boolean"),n(" and "),i("code",null,"string"),n(". Functions pass an input value as an argument and must return either "),i("code",null,"true"),n(" / "),i("code",null,"false"),n(" or a string containing an error message.")],-1)),o(x)]),_:1,__:[6]},8,["code"])]),_:1})]),_:1})}}};export{z as default};
