import{f as P,l as E,J as w,a5 as W,ay as $,a as L,E as o,e as M,as as z,p as A,q as C}from"./vuetify-BC4vKTOI.js";import{d as m,a0 as j,ac as f,a2 as c,a3 as r,m as e,U as l,aB as B,aC as T,j as x,u as s,af as b,a1 as h,ab as n,aV as J,aW as N,aX as U,aq as F,ai as _,ch as R}from"./app-core-BBiCCfYH.js";const Y={__name:"DemoChipExpandable",setup(V){const i=m(!1);return(a,d)=>{const p=j("IconBtn");return c(),f(M,{modelValue:s(i),"onUpdate:modelValue":d[1]||(d[1]=u=>x(i)?i.value=u:null),transition:"scale-transition"},{activator:r(({props:u})=>[e(o,B(T(u)),{default:r(()=>d[2]||(d[2]=[l(" VueJS ")])),_:2,__:[2]},1040)]),default:r(()=>[e(P,null,{default:r(()=>[e(E,null,{append:r(()=>[e($,{class:"ms-1"},{default:r(()=>[e(p,{onClick:d[0]||(d[0]=u=>i.value=!1)},{default:r(()=>[e(L,{size:"20",icon:"ri-close-line"})]),_:1})]),_:1})]),default:r(()=>[e(w,null,{default:r(()=>d[3]||(d[3]=[l("VueJS")])),_:1,__:[3]}),e(W,null,{default:r(()=>d[4]||(d[4]=[l("The Progressive JavaScript Framework")])),_:1,__:[4]})]),_:1})]),_:1})]),_:1},8,["modelValue"])}}},q={__name:"DemoChipInSelects",setup(V){const i=m(["Programming","Playing games","Sleeping"]),a=m(["Streaming","Eating","Programming","Playing games","Sleeping"]);return(d,p)=>(c(),f(z,{modelValue:s(i),"onUpdate:modelValue":p[0]||(p[0]=u=>x(i)?i.value=u:null),chips:"",clearable:"",multiple:"","closable-chips":"","clear-icon":"ri-close-circle-line",items:s(a),label:"Your favorite hobbies","prepend-icon":"ri-filter-3-line"},null,8,["modelValue","items"]))}},O={},X={class:"demo-space-x"};function G(V,i){return c(),h("div",X,[e(o,{size:"x-small"},{default:r(()=>i[0]||(i[0]=[l(" x-small chip ")])),_:1,__:[0]}),e(o,{size:"small"},{default:r(()=>i[1]||(i[1]=[l(" small chip ")])),_:1,__:[1]}),e(o,null,{default:r(()=>i[2]||(i[2]=[l("Default")])),_:1,__:[2]}),e(o,{size:"large"},{default:r(()=>i[3]||(i[3]=[l(" large chip ")])),_:1,__:[3]}),e(o,{size:"x-large"},{default:r(()=>i[4]||(i[4]=[l(" x-large chip ")])),_:1,__:[4]})])}const H=b(O,[["render",G]]),K={class:"demo-space-x"},Q={__name:"DemoChipWithAvatar",setup(V){return(i,a)=>(c(),h("div",K,[e(o,{"prepend-avatar":s(J)},{default:r(()=>a[0]||(a[0]=[n("span",null,"Chip",-1)])),_:1,__:[0]},8,["prepend-avatar"]),e(o,{"prepend-avatar":s(N)},{default:r(()=>a[1]||(a[1]=[n("span",null,"Darcy Nooser",-1)])),_:1,__:[1]},8,["prepend-avatar"]),e(o,{"prepend-avatar":s(U)},{default:r(()=>a[2]||(a[2]=[n("span",null,"Felicia Risker",-1)])),_:1,__:[2]},8,["prepend-avatar"]),e(o,{"prepend-avatar":s(F)},{default:r(()=>a[3]||(a[3]=[n("span",null,"Minnie Mostly",-1)])),_:1,__:[3]},8,["prepend-avatar"])]))}},Z={},ii={class:"demo-space-x"};function ei(V,i){return c(),h("div",ii,[e(o,{"prepend-icon":"ri-user-line"},{default:r(()=>i[0]||(i[0]=[l(" Account ")])),_:1,__:[0]}),e(o,{color:"primary","prepend-icon":"ri-star-line"},{default:r(()=>i[1]||(i[1]=[l(" Premium ")])),_:1,__:[1]}),e(o,{color:"secondary","prepend-icon":"ri-cake-line"},{default:r(()=>i[2]||(i[2]=[l(" 1 Year ")])),_:1,__:[2]}),e(o,{color:"success","prepend-icon":"ri-notification-line"},{default:r(()=>i[3]||(i[3]=[l(" Notification ")])),_:1,__:[3]}),e(o,{color:"info","prepend-icon":"ri-message-line"},{default:r(()=>i[4]||(i[4]=[l(" Message ")])),_:1,__:[4]}),e(o,{color:"warning","prepend-icon":"ri-error-warning-line"},{default:r(()=>i[5]||(i[5]=[l(" Warning ")])),_:1,__:[5]}),e(o,{color:"error","prepend-icon":"ri-error-warning-line"},{default:r(()=>i[6]||(i[6]=[l(" Error ")])),_:1,__:[6]})])}const ri=b(Z,[["render",ei]]),li={class:"demo-space-x"},oi={__name:"DemoChipClosable",setup(V){const i=m(!0),a=m(!0),d=m(!0),p=m(!0),u=m(!0),g=m(!0),y=m(!0);return(S,t)=>(c(),h("div",li,[s(i)?(c(),f(o,{key:0,closable:"","onClick:close":t[0]||(t[0]=v=>i.value=!s(i))},{default:r(()=>t[7]||(t[7]=[l(" Default ")])),_:1,__:[7]})):_("",!0),s(a)?(c(),f(o,{key:1,closable:"",color:"primary","onClick:close":t[1]||(t[1]=v=>a.value=!s(a))},{default:r(()=>t[8]||(t[8]=[l(" Primary ")])),_:1,__:[8]})):_("",!0),s(d)?(c(),f(o,{key:2,closable:"",color:"secondary","onClick:close":t[2]||(t[2]=v=>d.value=!s(d))},{default:r(()=>t[9]||(t[9]=[l(" Secondary ")])),_:1,__:[9]})):_("",!0),s(p)?(c(),f(o,{key:3,closable:"",color:"success","onClick:close":t[3]||(t[3]=v=>p.value=!s(p))},{default:r(()=>t[10]||(t[10]=[l(" Success ")])),_:1,__:[10]})):_("",!0),s(u)?(c(),f(o,{key:4,closable:"",color:"info","onClick:close":t[4]||(t[4]=v=>u.value=!s(u))},{default:r(()=>t[11]||(t[11]=[l(" Info ")])),_:1,__:[11]})):_("",!0),s(g)?(c(),f(o,{key:5,closable:"",color:"warning","onClick:close":t[5]||(t[5]=v=>g.value=!s(g))},{default:r(()=>t[12]||(t[12]=[l(" Warning ")])),_:1,__:[12]})):_("",!0),s(y)?(c(),f(o,{key:6,closable:"",color:"error","onClick:close":t[6]||(t[6]=v=>y.value=!s(y))},{default:r(()=>t[13]||(t[13]=[l(" Error ")])),_:1,__:[13]})):_("",!0)]))}},ai={},si={class:"demo-space-x"};function ti(V,i){return c(),h("div",si,[e(o,{label:""},{default:r(()=>i[0]||(i[0]=[l(" Default ")])),_:1,__:[0]}),e(o,{label:"",color:"primary"},{default:r(()=>i[1]||(i[1]=[l(" Primary ")])),_:1,__:[1]}),e(o,{label:"",color:"secondary"},{default:r(()=>i[2]||(i[2]=[l(" Secondary ")])),_:1,__:[2]}),e(o,{label:"",color:"success"},{default:r(()=>i[3]||(i[3]=[l(" Success ")])),_:1,__:[3]}),e(o,{label:"",color:"info"},{default:r(()=>i[4]||(i[4]=[l(" Info ")])),_:1,__:[4]}),e(o,{label:"",color:"warning"},{default:r(()=>i[5]||(i[5]=[l(" Warning ")])),_:1,__:[5]}),e(o,{label:"",color:"error"},{default:r(()=>i[6]||(i[6]=[l(" Error ")])),_:1,__:[6]})])}const ni=b(ai,[["render",ti]]),pi={},ci={class:"demo-space-x"};function di(V,i){return c(),h("div",ci,[e(o,{variant:"outlined"},{default:r(()=>i[0]||(i[0]=[l(" Default ")])),_:1,__:[0]}),e(o,{color:"primary",variant:"outlined"},{default:r(()=>i[1]||(i[1]=[l(" Primary ")])),_:1,__:[1]}),e(o,{color:"secondary",variant:"outlined"},{default:r(()=>i[2]||(i[2]=[l(" Secondary ")])),_:1,__:[2]}),e(o,{color:"success",variant:"outlined"},{default:r(()=>i[3]||(i[3]=[l(" Success ")])),_:1,__:[3]}),e(o,{color:"info",variant:"outlined"},{default:r(()=>i[4]||(i[4]=[l(" Info ")])),_:1,__:[4]}),e(o,{color:"warning",variant:"outlined"},{default:r(()=>i[5]||(i[5]=[l(" Warning ")])),_:1,__:[5]}),e(o,{color:"error",variant:"outlined"},{default:r(()=>i[6]||(i[6]=[l(" Error ")])),_:1,__:[6]})])}const ui=b(pi,[["render",di]]),Vi={},Ci={class:"demo-space-x"};function mi(V,i){return c(),h("div",Ci,[e(o,{variant:"elevated"},{default:r(()=>i[0]||(i[0]=[l(" Default ")])),_:1,__:[0]}),e(o,{color:"primary",variant:"elevated"},{default:r(()=>i[1]||(i[1]=[l(" Primary ")])),_:1,__:[1]}),e(o,{color:"secondary",variant:"elevated"},{default:r(()=>i[2]||(i[2]=[l(" Secondary ")])),_:1,__:[2]}),e(o,{color:"success",variant:"elevated"},{default:r(()=>i[3]||(i[3]=[l(" Success ")])),_:1,__:[3]}),e(o,{color:"info",variant:"elevated"},{default:r(()=>i[4]||(i[4]=[l(" Info ")])),_:1,__:[4]}),e(o,{color:"warning",variant:"elevated"},{default:r(()=>i[5]||(i[5]=[l(" Warning ")])),_:1,__:[5]}),e(o,{color:"error",variant:"elevated"},{default:r(()=>i[6]||(i[6]=[l(" Error ")])),_:1,__:[6]})])}const fi=b(Vi,[["render",mi]]),vi={},hi={class:"demo-space-x"};function _i(V,i){return c(),h("div",hi,[e(o,null,{default:r(()=>i[0]||(i[0]=[l(" Default ")])),_:1,__:[0]}),e(o,{color:"primary"},{default:r(()=>i[1]||(i[1]=[l(" Primary ")])),_:1,__:[1]}),e(o,{color:"secondary"},{default:r(()=>i[2]||(i[2]=[l(" Secondary ")])),_:1,__:[2]}),e(o,{color:"success"},{default:r(()=>i[3]||(i[3]=[l(" Success ")])),_:1,__:[3]}),e(o,{color:"info"},{default:r(()=>i[4]||(i[4]=[l(" Info ")])),_:1,__:[4]}),e(o,{color:"warning"},{default:r(()=>i[5]||(i[5]=[l(" Warning ")])),_:1,__:[5]}),e(o,{color:"error"},{default:r(()=>i[6]||(i[6]=[l(" Error ")])),_:1,__:[6]})])}const bi=b(vi,[["render",_i]]),gi={ts:`<script lang="ts" setup>
const isDefaultChipVisible = ref(true)
const isPrimaryChipVisible = ref(true)
const isSecondaryChipVisible = ref(true)
const isSuccessChipVisible = ref(true)
const isInfoChipVisible = ref(true)
const isWarningChipVisible = ref(true)
const isErrorChipVisible = ref(true)
<\/script>

<template>
  <div class="demo-space-x">
    <VChip
      v-if="isDefaultChipVisible"
      closable
      @click:close="isDefaultChipVisible = !isDefaultChipVisible"
    >
      Default
    </VChip>

    <VChip
      v-if="isPrimaryChipVisible"
      closable
      color="primary"
      @click:close="isPrimaryChipVisible = !isPrimaryChipVisible"
    >
      Primary
    </VChip>

    <VChip
      v-if="isSecondaryChipVisible"
      closable
      color="secondary"
      @click:close="isSecondaryChipVisible = !isSecondaryChipVisible"
    >
      Secondary
    </VChip>

    <VChip
      v-if="isSuccessChipVisible"
      closable
      color="success"
      @click:close="isSuccessChipVisible = !isSuccessChipVisible"
    >
      Success
    </VChip>

    <VChip
      v-if="isInfoChipVisible"
      closable
      color="info"
      @click:close="isInfoChipVisible = !isInfoChipVisible"
    >
      Info
    </VChip>

    <VChip
      v-if="isWarningChipVisible"
      closable
      color="warning"
      @click:close="isWarningChipVisible = !isWarningChipVisible"
    >
      Warning
    </VChip>

    <VChip
      v-if="isErrorChipVisible"
      closable
      color="error"
      @click:close="isErrorChipVisible = !isErrorChipVisible"
    >
      Error
    </VChip>
  </div>
</template>
`,js:`<script setup>
const isDefaultChipVisible = ref(true)
const isPrimaryChipVisible = ref(true)
const isSecondaryChipVisible = ref(true)
const isSuccessChipVisible = ref(true)
const isInfoChipVisible = ref(true)
const isWarningChipVisible = ref(true)
const isErrorChipVisible = ref(true)
<\/script>

<template>
  <div class="demo-space-x">
    <VChip
      v-if="isDefaultChipVisible"
      closable
      @click:close="isDefaultChipVisible = !isDefaultChipVisible"
    >
      Default
    </VChip>

    <VChip
      v-if="isPrimaryChipVisible"
      closable
      color="primary"
      @click:close="isPrimaryChipVisible = !isPrimaryChipVisible"
    >
      Primary
    </VChip>

    <VChip
      v-if="isSecondaryChipVisible"
      closable
      color="secondary"
      @click:close="isSecondaryChipVisible = !isSecondaryChipVisible"
    >
      Secondary
    </VChip>

    <VChip
      v-if="isSuccessChipVisible"
      closable
      color="success"
      @click:close="isSuccessChipVisible = !isSuccessChipVisible"
    >
      Success
    </VChip>

    <VChip
      v-if="isInfoChipVisible"
      closable
      color="info"
      @click:close="isInfoChipVisible = !isInfoChipVisible"
    >
      Info
    </VChip>

    <VChip
      v-if="isWarningChipVisible"
      closable
      color="warning"
      @click:close="isWarningChipVisible = !isWarningChipVisible"
    >
      Warning
    </VChip>

    <VChip
      v-if="isErrorChipVisible"
      closable
      color="error"
      @click:close="isErrorChipVisible = !isErrorChipVisible"
    >
      Error
    </VChip>
  </div>
</template>
`},yi={ts:`<template>
  <div class="demo-space-x">
    <VChip>
      Default
    </VChip>

    <VChip color="primary">
      Primary
    </VChip>

    <VChip color="secondary">
      Secondary
    </VChip>

    <VChip color="success">
      Success
    </VChip>

    <VChip color="info">
      Info
    </VChip>

    <VChip color="warning">
      Warning
    </VChip>

    <VChip color="error">
      Error
    </VChip>
  </div>
</template>
`,js:`<template>
  <div class="demo-space-x">
    <VChip>
      Default
    </VChip>

    <VChip color="primary">
      Primary
    </VChip>

    <VChip color="secondary">
      Secondary
    </VChip>

    <VChip color="success">
      Success
    </VChip>

    <VChip color="info">
      Info
    </VChip>

    <VChip color="warning">
      Warning
    </VChip>

    <VChip color="error">
      Error
    </VChip>
  </div>
</template>
`},Si={ts:`<template>
  <div class="demo-space-x">
    <VChip variant="elevated">
      Default
    </VChip>

    <VChip
      color="primary"
      variant="elevated"
    >
      Primary
    </VChip>

    <VChip
      color="secondary"
      variant="elevated"
    >
      Secondary
    </VChip>

    <VChip
      color="success"
      variant="elevated"
    >
      Success
    </VChip>

    <VChip
      color="info"
      variant="elevated"
    >
      Info
    </VChip>

    <VChip
      color="warning"
      variant="elevated"
    >
      Warning
    </VChip>

    <VChip
      color="error"
      variant="elevated"
    >
      Error
    </VChip>
  </div>
</template>
`,js:`<template>
  <div class="demo-space-x">
    <VChip variant="elevated">
      Default
    </VChip>

    <VChip
      color="primary"
      variant="elevated"
    >
      Primary
    </VChip>

    <VChip
      color="secondary"
      variant="elevated"
    >
      Secondary
    </VChip>

    <VChip
      color="success"
      variant="elevated"
    >
      Success
    </VChip>

    <VChip
      color="info"
      variant="elevated"
    >
      Info
    </VChip>

    <VChip
      color="warning"
      variant="elevated"
    >
      Warning
    </VChip>

    <VChip
      color="error"
      variant="elevated"
    >
      Error
    </VChip>
  </div>
</template>
`},xi={ts:`<script lang="ts" setup>
const isMenuVisible = ref(false)
<\/script>

<template>
  <VMenu
    v-model="isMenuVisible"
    transition="scale-transition"
  >
    <!-- v-menu activator -->
    <template #activator="{ props }">
      <VChip v-bind="props">
        VueJS
      </VChip>
    </template>

    <!-- v-menu list -->
    <VList>
      <VListItem>
        <VListItemTitle>VueJS</VListItemTitle>
        <VListItemSubtitle>The Progressive JavaScript Framework</VListItemSubtitle>

        <template #append>
          <VListItemAction class="ms-1">
            <IconBtn @click="isMenuVisible = false">
              <VIcon
                size="20"
                icon="ri-close-line"
              />
            </IconBtn>
          </VListItemAction>
        </template>
      </VListItem>
    </VList>
  </VMenu>
</template>
`,js:`<script setup>
const isMenuVisible = ref(false)
<\/script>

<template>
  <VMenu
    v-model="isMenuVisible"
    transition="scale-transition"
  >
    <!-- v-menu activator -->
    <template #activator="{ props }">
      <VChip v-bind="props">
        VueJS
      </VChip>
    </template>

    <!-- v-menu list -->
    <VList>
      <VListItem>
        <VListItemTitle>VueJS</VListItemTitle>
        <VListItemSubtitle>The Progressive JavaScript Framework</VListItemSubtitle>

        <template #append>
          <VListItemAction class="ms-1">
            <IconBtn @click="isMenuVisible = false">
              <VIcon
                size="20"
                icon="ri-close-line"
              />
            </IconBtn>
          </VListItemAction>
        </template>
      </VListItem>
    </VList>
  </VMenu>
</template>
`},Ii={ts:`<script lang="ts" setup>
const chips = ref(['Programming', 'Playing games', 'Sleeping'])
const items = ref(['Streaming', 'Eating', 'Programming', 'Playing games', 'Sleeping'])
<\/script>

<template>
  <VCombobox
    v-model="chips"
    chips
    clearable
    multiple
    closable-chips
    clear-icon="ri-close-circle-line"
    :items="items"
    label="Your favorite hobbies"
    prepend-icon="ri-filter-3-line"
  />
</template>
`,js:`<script setup>
const chips = ref([
  'Programming',
  'Playing games',
  'Sleeping',
])

const items = ref([
  'Streaming',
  'Eating',
  'Programming',
  'Playing games',
  'Sleeping',
])
<\/script>

<template>
  <VCombobox
    v-model="chips"
    chips
    clearable
    multiple
    closable-chips
    clear-icon="ri-close-circle-line"
    :items="items"
    label="Your favorite hobbies"
    prepend-icon="ri-filter-3-line"
  />
</template>
`},ki={ts:`<template>
  <div class="demo-space-x">
    <VChip label>
      Default
    </VChip>

    <VChip
      label
      color="primary"
    >
      Primary
    </VChip>

    <VChip
      label
      color="secondary"
    >
      Secondary
    </VChip>

    <VChip
      label
      color="success"
    >
      Success
    </VChip>

    <VChip
      label
      color="info"
    >
      Info
    </VChip>

    <VChip
      label
      color="warning"
    >
      Warning
    </VChip>

    <VChip
      label
      color="error"
    >
      Error
    </VChip>
  </div>
</template>
`,js:`<template>
  <div class="demo-space-x">
    <VChip label>
      Default
    </VChip>

    <VChip
      label
      color="primary"
    >
      Primary
    </VChip>

    <VChip
      label
      color="secondary"
    >
      Secondary
    </VChip>

    <VChip
      label
      color="success"
    >
      Success
    </VChip>

    <VChip
      label
      color="info"
    >
      Info
    </VChip>

    <VChip
      label
      color="warning"
    >
      Warning
    </VChip>

    <VChip
      label
      color="error"
    >
      Error
    </VChip>
  </div>
</template>
`},Di={ts:`<template>
  <div class="demo-space-x">
    <VChip variant="outlined">
      Default
    </VChip>

    <VChip
      color="primary"
      variant="outlined"
    >
      Primary
    </VChip>

    <VChip
      color="secondary"
      variant="outlined"
    >
      Secondary
    </VChip>

    <VChip
      color="success"
      variant="outlined"
    >
      Success
    </VChip>

    <VChip
      color="info"
      variant="outlined"
    >
      Info
    </VChip>

    <VChip
      color="warning"
      variant="outlined"
    >
      Warning
    </VChip>

    <VChip
      color="error"
      variant="outlined"
    >
      Error
    </VChip>
  </div>
</template>
`,js:`<template>
  <div class="demo-space-x">
    <VChip variant="outlined">
      Default
    </VChip>

    <VChip
      color="primary"
      variant="outlined"
    >
      Primary
    </VChip>

    <VChip
      color="secondary"
      variant="outlined"
    >
      Secondary
    </VChip>

    <VChip
      color="success"
      variant="outlined"
    >
      Success
    </VChip>

    <VChip
      color="info"
      variant="outlined"
    >
      Info
    </VChip>

    <VChip
      color="warning"
      variant="outlined"
    >
      Warning
    </VChip>

    <VChip
      color="error"
      variant="outlined"
    >
      Error
    </VChip>
  </div>
</template>
`},Pi={ts:`<template>
  <div class="demo-space-x">
    <VChip size="x-small">
      x-small chip
    </VChip>

    <VChip size="small">
      small chip
    </VChip>

    <VChip>Default</VChip>

    <VChip size="large">
      large chip
    </VChip>

    <VChip size="x-large">
      x-large chip
    </VChip>
  </div>
</template>
`,js:`<template>
  <div class="demo-space-x">
    <VChip size="x-small">
      x-small chip
    </VChip>

    <VChip size="small">
      small chip
    </VChip>

    <VChip>Default</VChip>

    <VChip size="large">
      large chip
    </VChip>

    <VChip size="x-large">
      x-large chip
    </VChip>
  </div>
</template>
`},Ei={ts:`<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
<\/script>

<template>
  <div class="demo-space-x">
    <VChip :prepend-avatar="avatar1">
      <span>Chip</span>
    </VChip>

    <VChip :prepend-avatar="avatar2">
      <span>Darcy Nooser</span>
    </VChip>

    <VChip :prepend-avatar="avatar3">
      <span>Felicia Risker</span>
    </VChip>

    <VChip :prepend-avatar="avatar4">
      <span>Minnie Mostly</span>
    </VChip>
  </div>
</template>
`,js:`<script setup>
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
<\/script>

<template>
  <div class="demo-space-x">
    <VChip :prepend-avatar="avatar1">
      <span>Chip</span>
    </VChip>

    <VChip :prepend-avatar="avatar2">
      <span>Darcy Nooser</span>
    </VChip>

    <VChip :prepend-avatar="avatar3">
      <span>Felicia Risker</span>
    </VChip>

    <VChip :prepend-avatar="avatar4">
      <span>Minnie Mostly</span>
    </VChip>
  </div>
</template>
`},wi={ts:`<template>
  <div class="demo-space-x">
    <VChip prepend-icon="ri-user-line">
      Account
    </VChip>

    <VChip
      color="primary"
      prepend-icon="ri-star-line"
    >
      Premium
    </VChip>

    <VChip
      color="secondary"
      prepend-icon="ri-cake-line"
    >
      1 Year
    </VChip>

    <VChip
      color="success"
      prepend-icon="ri-notification-line"
    >
      Notification
    </VChip>

    <VChip
      color="info"
      prepend-icon="ri-message-line"
    >
      Message
    </VChip>

    <VChip
      color="warning"
      prepend-icon="ri-error-warning-line"
    >
      Warning
    </VChip>

    <VChip
      color="error"
      prepend-icon="ri-error-warning-line"
    >
      Error
    </VChip>
  </div>
</template>
`,js:`<template>
  <div class="demo-space-x">
    <VChip prepend-icon="ri-user-line">
      Account
    </VChip>

    <VChip
      color="primary"
      prepend-icon="ri-star-line"
    >
      Premium
    </VChip>

    <VChip
      color="secondary"
      prepend-icon="ri-cake-line"
    >
      1 Year
    </VChip>

    <VChip
      color="success"
      prepend-icon="ri-notification-line"
    >
      Notification
    </VChip>

    <VChip
      color="info"
      prepend-icon="ri-message-line"
    >
      Message
    </VChip>

    <VChip
      color="warning"
      prepend-icon="ri-error-warning-line"
    >
      Warning
    </VChip>

    <VChip
      color="error"
      prepend-icon="ri-error-warning-line"
    >
      Error
    </VChip>
  </div>
</template>
`},Li={__name:"chip",setup(V){return(i,a)=>{const d=bi,p=R,u=fi,g=ui,y=ni,S=oi,t=ri,v=Q,I=H,k=q,D=Y;return c(),f(A,{class:"match-height"},{default:r(()=>[e(C,{cols:"12",md:"6"},{default:r(()=>[e(p,{title:"Color",code:s(yi)},{default:r(()=>[a[0]||(a[0]=n("p",null,[l(" Use "),n("code",null,"color"),l(" prop to change the background color of chips. ")],-1)),e(d)]),_:1,__:[0]},8,["code"])]),_:1}),e(C,{cols:"12",md:"6"},{default:r(()=>[e(p,{title:"Elevated",code:s(Si)},{default:r(()=>[a[1]||(a[1]=n("p",null,[l("Use "),n("code",null,"elevated"),l(" variant option to create filled chips.")],-1)),e(u)]),_:1,__:[1]},8,["code"])]),_:1}),e(C,{cols:"12",md:"6"},{default:r(()=>[e(p,{title:"Outlined",code:s(Di)},{default:r(()=>[a[2]||(a[2]=n("p",null,[l(" Use "),n("code",null,"outlined"),l(" variant option to create outline border chips. ")],-1)),e(g)]),_:1,__:[2]},8,["code"])]),_:1}),e(C,{cols:"12",md:"6"},{default:r(()=>[e(p,{title:"Label",code:s(ki)},{default:r(()=>[a[3]||(a[3]=n("p",null,[l(" Label chips use the "),n("code",null,"v-card"),l(" border-radius. Use "),n("code",null,"label"),l(" prop to create label chips. ")],-1)),e(y)]),_:1,__:[3]},8,["code"])]),_:1}),e(C,{cols:"12",md:"6"},{default:r(()=>[e(p,{title:"Closable",code:s(gi)},{default:r(()=>[a[4]||(a[4]=n("p",null,[l("Closable chips can be controlled with a "),n("code",null,"v-model"),l(".")],-1)),e(S)]),_:1,__:[4]},8,["code"])]),_:1}),e(C,{cols:"12",md:"6"},{default:r(()=>[e(p,{title:"With Icon",code:s(wi)},{default:r(()=>[a[5]||(a[5]=n("p",null," Chips can use text or any icon available in the Material Icons font library. ",-1)),e(t)]),_:1,__:[5]},8,["code"])]),_:1}),e(C,{cols:"12",md:"6"},{default:r(()=>[e(p,{title:"With Avatar",code:s(Ei)},{default:r(()=>[a[6]||(a[6]=n("p",null,[l(" Use "),n("code",null,"pill"),l(" prop to remove the "),n("code",null,"v-avatar"),l(" padding. ")],-1)),e(v)]),_:1,__:[6]},8,["code"])]),_:1}),e(C,{cols:"12",md:"6"},{default:r(()=>[e(p,{title:"Sizes",code:s(Pi)},{default:r(()=>[a[7]||(a[7]=n("p",null,[l(" The "),n("code",null,"v-chip"),l(" component can have various sizes from "),n("code",null,"x-small"),l(" to "),n("code",null,"x-large"),l(". ")],-1)),e(I)]),_:1,__:[7]},8,["code"])]),_:1}),e(C,{cols:"12",md:"6"},{default:r(()=>[e(p,{title:"In Selects",code:s(Ii)},{default:r(()=>[a[8]||(a[8]=n("p",null,[l(" Selects can use "),n("code",null,"chips"),l(" to display the selected data. Try adding your own tags below. ")],-1)),e(k)]),_:1,__:[8]},8,["code"])]),_:1}),e(C,{cols:"12",md:"6"},{default:r(()=>[e(p,{title:"Expandable",code:s(xi)},{default:r(()=>[a[9]||(a[9]=n("p",null,[l(" Chips can be combined with "),n("code",null,"v-menu"),l(" to enable a specific set of actions for a chip. ")],-1)),e(D)]),_:1,__:[9]},8,["code"])]),_:1})]),_:1})}}};export{Li as default};
