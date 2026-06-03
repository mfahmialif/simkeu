import{aq as p,E as j,q as s,p as V}from"./vuetify-BC4vKTOI.js";import{d as F,k as x,ac as r,a2 as u,u as c,j as b,a3 as i,a1 as S,F as N,at as U,U as t,J as k,af as m,m as e,ch as L,ab as l}from"./app-core-BBiCCfYH.js";const A={__name:"DemoFileInputLoading",setup(d){const o=F(),n=F(!0);return x(o,()=>{n.value=!o.value[0]}),(_,a)=>(u(),r(p,{modelValue:c(o),"onUpdate:modelValue":a[0]||(a[0]=f=>b(o)?o.value=f:null),loading:c(n),color:"primary",label:"File input"},null,8,["modelValue","loading"]))}},B={__name:"DemoFileInputSelectionSlot",setup(d){const o=F([]);return(n,_)=>(u(),r(p,{modelValue:c(o),"onUpdate:modelValue":_[0]||(_[0]=a=>b(o)?o.value=a:null),multiple:"",placeholder:"Upload your documents",label:"File input","prepend-icon":"ri-attachment-line"},{selection:i(({fileNames:a})=>[(u(!0),S(N,null,U(a,f=>(u(),r(j,{key:f,label:"",size:"small",variant:"outlined",color:"primary",class:"me-2"},{default:i(()=>[t(k(f),1)]),_:2},1024))),128))]),_:1},8,["modelValue"]))}},P={__name:"DemoFileInputValidation",setup(d){const o=[n=>!n||!n.length||n[0].size<1e6||"Avatar size should be less than 1 MB!"];return(n,_)=>(u(),r(p,{rules:o,label:"Avatar",accept:"image/png, image/jpeg, image/bmp",placeholder:"Pick an avatar","prepend-icon":"ri-camera-2-line"}))}},R={};function M(d,o){return u(),r(p,{"show-size":"",label:"File input"})}const T=m(R,[["render",M]]),O={};function q(d,o){return u(),r(p,{label:"File input","prepend-icon":"ri-camera-line"})}const E=m(O,[["render",q]]),Y={};function J(d,o){return u(),r(p,{multiple:"",label:"File input"})}const W=m(Y,[["render",J]]),G={};function H(d,o){return u(),r(p,{"show-size":"",counter:"",multiple:"",label:"File input"})}const K=m(G,[["render",H]]),Q={};function X(d,o){return u(),r(p,{chips:"",label:"File input w/ chips"})}const Z=m(Q,[["render",X]]),ee={};function le(d,o){return u(),r(p,{accept:"image/*",label:"File input"})}const te=m(ee,[["render",le]]),ne={};function ie(d,o){return u(),r(V,null,{default:i(()=>[e(s,{cols:"12",sm:"6"},{default:i(()=>[e(p,{label:"Outlined"})]),_:1}),e(s,{cols:"12",sm:"6"},{default:i(()=>[e(p,{label:"Filled",variant:"filled"})]),_:1}),e(s,{cols:"12",sm:"6"},{default:i(()=>[e(p,{label:"Solo",variant:"solo"})]),_:1}),e(s,{cols:"12",sm:"6"},{default:i(()=>[e(p,{label:"Plain",variant:"plain"})]),_:1}),e(s,{cols:"12",sm:"6"},{default:i(()=>[e(p,{label:"Underlined",variant:"underlined"})]),_:1})]),_:1})}const oe=m(ne,[["render",ie]]),ae={};function se(d,o){return u(),r(p,{label:"File input",density:"compact"})}const pe=m(ae,[["render",se]]),ce={};function ue(d,o){return u(),r(p,{label:"File input"})}const re=m(ce,[["render",ue]]),de={ts:`<template>
  <VFileInput
    accept="image/*"
    label="File input"
  />
</template>
`,js:`<template>
  <VFileInput
    accept="image/*"
    label="File input"
  />
</template>
`},me={ts:`<template>
  <VFileInput label="File input" />
</template>
`,js:`<template>
  <VFileInput label="File input" />
</template>
`},_e={ts:`<template>
  <VFileInput
    chips
    label="File input w/ chips"
  />
</template>
`,js:`<template>
  <VFileInput
    chips
    label="File input w/ chips"
  />
</template>
`},fe={ts:`<template>
  <VFileInput
    show-size
    counter
    multiple
    label="File input"
  />
</template>
`,js:`<template>
  <VFileInput
    show-size
    counter
    multiple
    label="File input"
  />
</template>
`},Fe={ts:`<template>
  <VFileInput
    label="File input"
    density="compact"
  />
</template>
`,js:`<template>
  <VFileInput
    label="File input"
    density="compact"
  />
</template>
`},Ve={ts:`<script setup lang="ts">
const file = ref()
const loading = ref(true)

watch(file, () => {
  loading.value = !file.value[0]
})
<\/script>

<template>
  <VFileInput
    v-model="file"
    :loading="loading"
    color="primary"
    label="File input"
  />
</template>
`,js:`<script setup>
const file = ref()
const loading = ref(true)

watch(file, () => {
  loading.value = !file.value[0]
})
<\/script>

<template>
  <VFileInput
    v-model="file"
    :loading="loading"
    color="primary"
    label="File input"
  />
</template>
`},be={ts:`<template>
  <VFileInput
    multiple
    label="File input"
  />
</template>
`,js:`<template>
  <VFileInput
    multiple
    label="File input"
  />
</template>
`},he={ts:`<template>
  <VFileInput
    label="File input"
    prepend-icon="ri-camera-line"
  />
</template>
`,js:`<template>
  <VFileInput
    label="File input"
    prepend-icon="ri-camera-line"
  />
</template>
`},ge={ts:`<script lang="ts" setup>
const files = ref<File[]>([])
<\/script>

<template>
  <VFileInput
    v-model="files"
    multiple
    placeholder="Upload your documents"
    label="File input"
    prepend-icon="ri-attachment-line"
  >
    <template #selection="{ fileNames }">
      <template
        v-for="fileName in fileNames"
        :key="fileName"
      >
        <VChip
          label
          size="small"
          variant="outlined"
          color="primary"
          class="me-2"
        >
          {{ fileName }}
        </VChip>
      </template>
    </template>
  </VFileInput>
</template>
`,js:`<script setup>
const files = ref([])
<\/script>

<template>
  <VFileInput
    v-model="files"
    multiple
    placeholder="Upload your documents"
    label="File input"
    prepend-icon="ri-attachment-line"
  >
    <template #selection="{ fileNames }">
      <template
        v-for="fileName in fileNames"
        :key="fileName"
      >
        <VChip
          label
          size="small"
          variant="outlined"
          color="primary"
          class="me-2"
        >
          {{ fileName }}
        </VChip>
      </template>
    </template>
  </VFileInput>
</template>
`},Ie={ts:`<template>
  <VFileInput
    show-size
    label="File input"
  />
</template>
`,js:`<template>
  <VFileInput
    show-size
    label="File input"
  />
</template>
`},ve={ts:`<script lang="ts" setup>
const rules = [
  (fileList: FileList) => !fileList || !fileList.length || fileList[0].size < 1000000 || 'Avatar size should be less than 1 MB!',
]
<\/script>

<template>
  <VFileInput
    :rules="rules"
    label="Avatar"
    accept="image/png, image/jpeg, image/bmp"
    placeholder="Pick an avatar"
    prepend-icon="ri-camera-2-line"
  />
</template>
`,js:`<script setup>
const rules = [fileList => !fileList || !fileList.length || fileList[0].size < 1000000 || 'Avatar size should be less than 1 MB!']
<\/script>

<template>
  <VFileInput
    :rules="rules"
    label="Avatar"
    accept="image/png, image/jpeg, image/bmp"
    placeholder="Pick an avatar"
    prepend-icon="ri-camera-2-line"
  />
</template>
`},ye={ts:`<template>
  <VRow>
    <VCol
      cols="12"
      sm="6"
    >
      <VFileInput label="Outlined" />
    </VCol>

    <VCol
      cols="12"
      sm="6"
    >
      <VFileInput
        label="Filled"
        variant="filled"
      />
    </VCol>

    <VCol
      cols="12"
      sm="6"
    >
      <VFileInput
        label="Solo"
        variant="solo"
      />
    </VCol>

    <VCol
      cols="12"
      sm="6"
    >
      <VFileInput
        label="Plain"
        variant="plain"
      />
    </VCol>
    <VCol
      cols="12"
      sm="6"
    >
      <VFileInput
        label="Underlined"
        variant="underlined"
      />
    </VCol>
  </VRow>
</template>
`,js:`<template>
  <VRow>
    <VCol
      cols="12"
      sm="6"
    >
      <VFileInput label="Outlined" />
    </VCol>

    <VCol
      cols="12"
      sm="6"
    >
      <VFileInput
        label="Filled"
        variant="filled"
      />
    </VCol>

    <VCol
      cols="12"
      sm="6"
    >
      <VFileInput
        label="Solo"
        variant="solo"
      />
    </VCol>

    <VCol
      cols="12"
      sm="6"
    >
      <VFileInput
        label="Plain"
        variant="plain"
      />
    </VCol>
    <VCol
      cols="12"
      sm="6"
    >
      <VFileInput
        label="Underlined"
        variant="underlined"
      />
    </VCol>
  </VRow>
</template>
`},ze={__name:"file-input",setup(d){return(o,n)=>{const _=re,a=L,f=pe,h=oe,g=te,I=Z,v=K,y=W,C=E,w=T,z=P,$=B,D=A;return u(),r(V,{class:"match-height"},{default:i(()=>[e(s,{cols:"12",md:"6"},{default:i(()=>[e(a,{title:"Basic",code:c(me)},{default:i(()=>[n[0]||(n[0]=l("p",null,[t("The "),l("code",null,"v-file-input"),t(" component is used to selecting files.")],-1)),e(_)]),_:1,__:[0]},8,["code"])]),_:1}),e(s,{cols:"12",md:"6"},{default:i(()=>[e(a,{title:"Density",code:c(Fe)},{default:i(()=>[n[1]||(n[1]=l("p",null,[t("You can reduces the file input height with "),l("code",null,"density"),t(" prop. Available options are: "),l("code",null,"default"),t(", "),l("code",null,"comfortable"),t(", and "),l("code",null,"compact"),t(".")],-1)),e(f)]),_:1,__:[1]},8,["code"])]),_:1}),e(s,{cols:"12"},{default:i(()=>[e(a,{title:"Variant",code:c(ye)},{default:i(()=>[n[2]||(n[2]=l("p",null,[t("use "),l("code",null,"solo"),t(", "),l("code",null,"filled"),t(", "),l("code",null,"outlined"),t(", "),l("code",null,"plain"),t(" and "),l("code",null,"underlined"),t(" option of "),l("code",null,"variant"),t(" prop to change the look of file input.")],-1)),e(h)]),_:1,__:[2]},8,["code"])]),_:1}),e(s,{cols:"12",md:"6"},{default:i(()=>[e(a,{title:"Accept",code:c(de)},{default:i(()=>[n[3]||(n[3]=l("p",null,[l("code",null,"v-file-input"),t(" component can accept only specific media formats/file types if you want.")],-1)),e(g)]),_:1,__:[3]},8,["code"])]),_:1}),e(s,{cols:"12",md:"6"},{default:i(()=>[e(a,{title:"Chips",code:c(_e)},{default:i(()=>[n[4]||(n[4]=l("p",null,[t("Use "),l("code",null,"chip"),t(" prop to display the selected file as a chip.")],-1)),e(I)]),_:1,__:[4]},8,["code"])]),_:1}),e(s,{cols:"12",md:"6"},{default:i(()=>[e(a,{title:"Counter",code:c(fe)},{default:i(()=>[n[5]||(n[5]=l("p",null,[t("When using the "),l("code",null,"show-size"),t(" property along with "),l("code",null,"counter"),t(", the total number of files and size will be displayed under the input.")],-1)),e(v)]),_:1,__:[5]},8,["code"])]),_:1}),e(s,{cols:"12",md:"6"},{default:i(()=>[e(a,{title:"Multiple",code:c(be)},{default:i(()=>[n[6]||(n[6]=l("p",null,[t(" The "),l("code",null,"v-file-input"),t(" can contain multiple files at the same time when using the "),l("code",null,"multiple"),t(" prop. ")],-1)),e(y)]),_:1,__:[6]},8,["code"])]),_:1}),e(s,{cols:"12",md:"6"},{default:i(()=>[e(a,{title:"Prepend icon",code:c(he)},{default:i(()=>[n[7]||(n[7]=l("p",null,[t(" The "),l("code",null,"v-file-input"),t(" has a default "),l("code",null,"prepend-icon"),t(" that can be set on the component or adjusted globally. ")],-1)),e(C)]),_:1,__:[7]},8,["code"])]),_:1}),e(s,{cols:"12",md:"6"},{default:i(()=>[e(a,{title:"Show size",code:c(Ie)},{default:i(()=>[n[8]||(n[8]=l("p",null,[t("The displayed size of the selected file(s) can be configured with the "),l("code",null,"show-size"),t(" property.")],-1)),e(w)]),_:1,__:[8]},8,["code"])]),_:1}),e(s,{cols:"12",md:"6"},{default:i(()=>[e(a,{title:"Validation",code:c(ve)},{default:i(()=>[n[9]||(n[9]=l("p",null,[t("You can use the "),l("code",null,"rules"),t(" prop to create your own custom validation parameters.")],-1)),e(z)]),_:1,__:[9]},8,["code"])]),_:1}),e(s,{cols:"12",md:"6"},{default:i(()=>[e(a,{title:"Selection slot",code:c(ge)},{default:i(()=>[n[10]||(n[10]=l("p",null,[t("Using the "),l("code",null,"selection"),t(" slot, you can customize the appearance of your input selections.")],-1)),e($)]),_:1,__:[10]},8,["code"])]),_:1}),e(s,{cols:"12",md:"6"},{default:i(()=>[e(a,{title:"Loading",code:c(Ve)},{default:i(()=>[n[11]||(n[11]=l("p",null,[t("Use "),l("code",null,"loading"),t(" prop to displays linear progress bar.")],-1)),e(D)]),_:1,__:[11]},8,["code"])]),_:1})]),_:1})}}};export{ze as default};
