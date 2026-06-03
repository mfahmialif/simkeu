import{M as F,N as D,O as I,G as B,H as w}from"./index-C6UMdXCe.js";import{r as b,j as d,k as u,l as a,p as e,aa as O,H as s,Q as k,ao as x,i as f,u as n,aV as m,au as c,at as _,P as i}from"./vuetify-52YUcx6A.js";import{_ as y}from"./AppCardCode-CZglAVp2.js";import"./vue3-perfect-scrollbar-Ch7g35tI.js";const G={__name:"DemoSelectSelectionSlot",setup(S){const l=[{name:"Sandra Adams",avatar:F},{name:"Ali Connors",avatar:D},{name:"Trevor Hansen",avatar:I},{name:"Tucker Smith",avatar:B},{name:"Britta Holt",avatar:w}],t=b(["Sandra Adams"]);return(p,o)=>(u(),d(m,{modelValue:n(t),"onUpdate:modelValue":o[0]||(o[0]=r=>f(t)?t.value=r:null),items:l,"item-title":"name","item-value":"name",label:"Select Item",placeholder:"Select Item",multiple:"",clearable:"","clear-icon":"ri-close-line"},{selection:a(({item:r})=>[e(O,null,{prepend:a(()=>[e(x,{start:"",image:r.raw.avatar},null,8,["image"])]),default:a(()=>[s("span",null,k(r.title),1)]),_:2},1024)]),_:1},8,["modelValue"]))}},N={__name:"DemoSelectMultiple",setup(S){const l=b(["Alabama"]),t=["Alabama","Alaska","American Samoa","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Federated States of Micronesia","Florida","Georgia","Guam"];return(p,o)=>(u(),d(m,{modelValue:n(l),"onUpdate:modelValue":o[0]||(o[0]=r=>f(l)?l.value=r:null),items:t,"menu-props":{maxHeight:"400"},label:"Select",multiple:"","persistent-hint":"",placeholder:"Select State"},null,8,["modelValue"]))}},$={__name:"DemoSelectMenuProps",setup(S){const l=["Foo","Bar","Fizz","Buzz"];return(t,p)=>(u(),d(m,{items:l,"menu-props":{transition:"scroll-y-transition"},label:"Label",placeholder:"Select Item"}))}},j={__name:"DemoSelectChips",setup(S){const l=["foo","bar","fizz","buzz"],t=b(["foo","bar","fizz","buzz"]);return(p,o)=>(u(),d(m,{modelValue:n(t),"onUpdate:modelValue":o[0]||(o[0]=r=>f(t)?t.value=r:null),items:l,placeholder:"Select Item",label:"Chips",chips:"",multiple:""},null,8,["modelValue"]))}},T={__name:"DemoSelectIcons",setup(S){const l=b("Florida"),t=b("Texas"),p=["Alabama","Alaska","American Samoa","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Federated States of Micronesia","Florida","Georgia","Guam"];return(o,r)=>(u(),d(_,null,{default:a(()=>[e(c,{cols:"12"},{default:a(()=>[e(m,{modelValue:n(l),"onUpdate:modelValue":r[0]||(r[0]=v=>f(l)?l.value=v:null),items:p,label:"Select","prepend-icon":"ri-map-2-line","single-line":"",variant:"filled",placeholder:"Select State"},null,8,["modelValue"])]),_:1}),e(c,{cols:"12"},{default:a(()=>[e(m,{modelValue:n(t),"onUpdate:modelValue":r[1]||(r[1]=v=>f(t)?t.value=v:null),items:p,"append-icon":"ri-map-2-line",label:"Select","single-line":"",variant:"filled",placeholder:"Select State"},null,8,["modelValue"])]),_:1})]),_:1}))}},M={__name:"DemoSelectCustomTextAndValue",setup(S){const l=b({state:"Florida",abbr:"FL"}),t=[{state:"Florida",abbr:"FL"},{state:"Georgia",abbr:"GA"},{state:"Nebraska",abbr:"NE"},{state:"California",abbr:"CA"},{state:"New York",abbr:"NY"}];return(p,o)=>(u(),d(m,{modelValue:n(l),"onUpdate:modelValue":o[0]||(o[0]=r=>f(l)?l.value=r:null),hint:`${n(l).state}, ${n(l).abbr}`,items:t,"item-title":"state","item-value":"abbr",label:"Select","persistent-hint":"","return-object":"","single-line":"",placeholder:"Select State"},null,8,["modelValue","hint"]))}},U={__name:"DemoSelectVariant",setup(S){const l=["Foo","Bar","Fizz","Buzz"];return(t,p)=>(u(),d(_,null,{default:a(()=>[e(c,{cols:"12",sm:"6"},{default:a(()=>[e(m,{items:l,label:"Outlined",placeholder:"Select Item"})]),_:1}),e(c,{cols:"12",sm:"6"},{default:a(()=>[e(m,{items:l,label:"Filled",placeholder:"Select Item",variant:"filled"})]),_:1}),e(c,{cols:"12",sm:"6"},{default:a(()=>[e(m,{items:l,label:"Solo",placeholder:"Select Item",variant:"solo"})]),_:1}),e(c,{cols:"12",sm:"6"},{default:a(()=>[e(m,{items:l,label:"Plain",placeholder:"Select Item",variant:"plain"})]),_:1}),e(c,{cols:"12",sm:"6"},{default:a(()=>[e(m,{items:l,label:"Underlined",variant:"underlined",placeholder:"Select Item"})]),_:1})]),_:1}))}},H={__name:"DemoSelectDensity",setup(S){const l=["Foo","Bar","Fizz","Buzz"];return(t,p)=>(u(),d(m,{items:l,label:"Density",density:"compact",placeholder:"Select Item"}))}},R={__name:"DemoSelectBasic",setup(S){const l=["Foo","Bar","Fizz","Buzz"];return(t,p)=>(u(),d(m,{items:l,label:"Standard",placeholder:"Select Item",eager:""}))}},L={ts:`<script lang="ts" setup>
const items = ['Foo', 'Bar', 'Fizz', 'Buzz']
<\/script>

<template>
  <VSelect
    :items="items"
    label="Standard"
    placeholder="Select Item"
    eager
  />
</template>
`,js:`<script setup>
const items = [
  'Foo',
  'Bar',
  'Fizz',
  'Buzz',
]
<\/script>

<template>
  <VSelect
    :items="items"
    label="Standard"
    placeholder="Select Item"
    eager
  />
</template>
`},P={ts:`<script lang="ts" setup>
const items = ['foo', 'bar', 'fizz', 'buzz']
const selected = ref(['foo', 'bar', 'fizz', 'buzz'])
<\/script>

<template>
  <VSelect
    v-model="selected"
    :items="items"
    placeholder="Select Item"
    label="Chips"
    chips
    multiple
  />
</template>
`,js:`<script setup>
const items = [
  'foo',
  'bar',
  'fizz',
  'buzz',
]

const selected = ref([
  'foo',
  'bar',
  'fizz',
  'buzz',
])
<\/script>

<template>
  <VSelect
    v-model="selected"
    :items="items"
    placeholder="Select Item"
    label="Chips"
    chips
    multiple
  />
</template>
`},Y={ts:`<script lang="ts" setup>
const selectedOption = ref({ state: 'Florida', abbr: 'FL' })

const items = [
  { state: 'Florida', abbr: 'FL' },
  { state: 'Georgia', abbr: 'GA' },
  { state: 'Nebraska', abbr: 'NE' },
  { state: 'California', abbr: 'CA' },
  { state: 'New York', abbr: 'NY' },
]
<\/script>

<template>
  <VSelect
    v-model="selectedOption"
    :hint="\`\${selectedOption.state}, \${selectedOption.abbr}\`"
    :items="items"
    item-title="state"
    item-value="abbr"
    label="Select"
    persistent-hint
    return-object
    single-line
    placeholder="Select State"
  />
</template>
`,js:`<script setup>
const selectedOption = ref({
  state: 'Florida',
  abbr: 'FL',
})

const items = [
  {
    state: 'Florida',
    abbr: 'FL',
  },
  {
    state: 'Georgia',
    abbr: 'GA',
  },
  {
    state: 'Nebraska',
    abbr: 'NE',
  },
  {
    state: 'California',
    abbr: 'CA',
  },
  {
    state: 'New York',
    abbr: 'NY',
  },
]
<\/script>

<template>
  <VSelect
    v-model="selectedOption"
    :hint="\`\${selectedOption.state}, \${selectedOption.abbr}\`"
    :items="items"
    item-title="state"
    item-value="abbr"
    label="Select"
    persistent-hint
    return-object
    single-line
    placeholder="Select State"
  />
</template>
`},E={ts:`<script lang="ts" setup>
const items = ['Foo', 'Bar', 'Fizz', 'Buzz']
<\/script>

<template>
  <VSelect
    :items="items"
    label="Density"
    density="compact"
    placeholder="Select Item"
  />
</template>
`,js:`<script setup>
const items = [
  'Foo',
  'Bar',
  'Fizz',
  'Buzz',
]
<\/script>

<template>
  <VSelect
    :items="items"
    label="Density"
    density="compact"
    placeholder="Select Item"
  />
</template>
`},Q={ts:`<script lang="ts" setup>
const selectedOption1 = ref('Florida')
const selectedOption2 = ref('Texas')

const states = [
  'Alabama',
  'Alaska',
  'American Samoa',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District of Columbia',
  'Federated States of Micronesia',
  'Florida',
  'Georgia',
  'Guam',
]
<\/script>

<template>
  <VRow>
    <VCol cols="12">
      <VSelect
        v-model="selectedOption1"
        :items="states"
        label="Select"
        prepend-icon="ri-map-2-line"
        single-line
        variant="filled"
        placeholder="Select State"
      />
    </VCol>

    <VCol cols="12">
      <VSelect
        v-model="selectedOption2"
        :items="states"
        append-icon="ri-map-2-line"
        label="Select"
        single-line
        variant="filled"
        placeholder="Select State"
      />
    </VCol>
  </VRow>
</template>
`,js:`<script setup>
const selectedOption1 = ref('Florida')
const selectedOption2 = ref('Texas')

const states = [
  'Alabama',
  'Alaska',
  'American Samoa',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District of Columbia',
  'Federated States of Micronesia',
  'Florida',
  'Georgia',
  'Guam',
]
<\/script>

<template>
  <VRow>
    <VCol cols="12">
      <VSelect
        v-model="selectedOption1"
        :items="states"
        label="Select"
        prepend-icon="ri-map-2-line"
        single-line
        variant="filled"
        placeholder="Select State"
      />
    </VCol>

    <VCol cols="12">
      <VSelect
        v-model="selectedOption2"
        :items="states"
        append-icon="ri-map-2-line"
        label="Select"
        single-line
        variant="filled"
        placeholder="Select State"
      />
    </VCol>
  </VRow>
</template>
`},q={ts:`<script lang="ts" setup>
const items = ['Foo', 'Bar', 'Fizz', 'Buzz']
<\/script>

<template>
  <VSelect
    :items="items"
    :menu-props="{ transition: 'scroll-y-transition' }"
    label="Label"
    placeholder="Select Item"
  />
</template>
`,js:`<script setup>
const items = [
  'Foo',
  'Bar',
  'Fizz',
  'Buzz',
]
<\/script>

<template>
  <VSelect
    :items="items"
    :menu-props="{ transition: 'scroll-y-transition' }"
    label="Label"
    placeholder="Select Item"
  />
</template>
`},J={ts:`<script lang="ts" setup>
const selectedOptions = ref(['Alabama'])

const states = [
  'Alabama',
  'Alaska',
  'American Samoa',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District of Columbia',
  'Federated States of Micronesia',
  'Florida',
  'Georgia',
  'Guam',
]
<\/script>

<template>
  <VSelect
    v-model="selectedOptions"
    :items="states"
    :menu-props="{ maxHeight: '400' }"
    label="Select"
    multiple
    persistent-hint
    placeholder="Select State"
  />
</template>
`,js:`<script setup>
const selectedOptions = ref(['Alabama'])

const states = [
  'Alabama',
  'Alaska',
  'American Samoa',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District of Columbia',
  'Federated States of Micronesia',
  'Florida',
  'Georgia',
  'Guam',
]
<\/script>

<template>
  <VSelect
    v-model="selectedOptions"
    :items="states"
    :menu-props="{ maxHeight: '400' }"
    label="Select"
    multiple
    persistent-hint
    placeholder="Select State"
  />
</template>
`},K={ts:`<script lang="ts" setup>
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'

const items: { name: string; avatar: string }[] = [
  { name: 'Sandra Adams', avatar: avatar1 },
  { name: 'Ali Connors', avatar: avatar2 },
  { name: 'Trevor Hansen', avatar: avatar3 },
  { name: 'Tucker Smith', avatar: avatar4 },
  { name: 'Britta Holt', avatar: avatar5 },
]

const value = ref(['Sandra Adams'])
<\/script>

<template>
  <VSelect
    v-model="value"
    :items="items"
    item-title="name"
    item-value="name"
    label="Select Item"
    placeholder="Select Item"
    multiple
    clearable
    clear-icon="ri-close-line"
  >
    <template #selection="{ item }">
      <VChip>
        <template #prepend>
          <VAvatar
            start
            :image="item.raw.avatar"
          />
        </template>

        <span>{{ item.title }}</span>
      </VChip>
    </template>
  </VSelect>
</template>
`,js:`<script setup>
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'

const items = [
  {
    name: 'Sandra Adams',
    avatar: avatar1,
  },
  {
    name: 'Ali Connors',
    avatar: avatar2,
  },
  {
    name: 'Trevor Hansen',
    avatar: avatar3,
  },
  {
    name: 'Tucker Smith',
    avatar: avatar4,
  },
  {
    name: 'Britta Holt',
    avatar: avatar5,
  },
]

const value = ref(['Sandra Adams'])
<\/script>

<template>
  <VSelect
    v-model="value"
    :items="items"
    item-title="name"
    item-value="name"
    label="Select Item"
    placeholder="Select Item"
    multiple
    clearable
    clear-icon="ri-close-line"
  >
    <template #selection="{ item }">
      <VChip>
        <template #prepend>
          <VAvatar
            start
            :image="item.raw.avatar"
          />
        </template>

        <span>{{ item.title }}</span>
      </VChip>
    </template>
  </VSelect>
</template>
`},W={ts:`<script lang="ts" setup>
const items = ['Foo', 'Bar', 'Fizz', 'Buzz']
<\/script>

<template>
  <VRow>
    <VCol
      cols="12"
      sm="6"
    >
      <VSelect
        :items="items"
        label="Outlined"
        placeholder="Select Item"
      />
    </VCol>
    <VCol
      cols="12"
      sm="6"
    >
      <VSelect
        :items="items"
        label="Filled"
        placeholder="Select Item"
        variant="filled"
      />
    </VCol>

    <VCol
      cols="12"
      sm="6"
    >
      <VSelect
        :items="items"
        label="Solo"
        placeholder="Select Item"
        variant="solo"
      />
    </VCol>

    <VCol
      cols="12"
      sm="6"
    >
      <VSelect
        :items="items"
        label="Plain"
        placeholder="Select Item"
        variant="plain"
      />
    </VCol>

    <VCol
      cols="12"
      sm="6"
    >
      <VSelect
        :items="items"
        label="Underlined"
        variant="underlined"
        placeholder="Select Item"
      />
    </VCol>
  </VRow>
</template>
`,js:`<script setup>
const items = [
  'Foo',
  'Bar',
  'Fizz',
  'Buzz',
]
<\/script>

<template>
  <VRow>
    <VCol
      cols="12"
      sm="6"
    >
      <VSelect
        :items="items"
        label="Outlined"
        placeholder="Select Item"
      />
    </VCol>
    <VCol
      cols="12"
      sm="6"
    >
      <VSelect
        :items="items"
        label="Filled"
        placeholder="Select Item"
        variant="filled"
      />
    </VCol>

    <VCol
      cols="12"
      sm="6"
    >
      <VSelect
        :items="items"
        label="Solo"
        placeholder="Select Item"
        variant="solo"
      />
    </VCol>

    <VCol
      cols="12"
      sm="6"
    >
      <VSelect
        :items="items"
        label="Plain"
        placeholder="Select Item"
        variant="plain"
      />
    </VCol>

    <VCol
      cols="12"
      sm="6"
    >
      <VSelect
        :items="items"
        label="Underlined"
        variant="underlined"
        placeholder="Select Item"
      />
    </VCol>
  </VRow>
</template>
`},ae={__name:"select",setup(S){return(l,t)=>{const p=R,o=y,r=H,v=U,V=M,C=T,z=j,h=$,g=N,A=G;return u(),d(_,null,{default:a(()=>[e(c,{cols:"12",md:"6"},{default:a(()=>[e(o,{title:"Basic",code:n(L)},{default:a(()=>[t[0]||(t[0]=s("p",null,"Select fields components are used for collecting user provided information from a list of options.",-1)),e(p)]),_:1,__:[0]},8,["code"])]),_:1}),e(c,{cols:"12",md:"6"},{default:a(()=>[e(o,{title:"Density",code:n(E)},{default:a(()=>[t[1]||(t[1]=s("p",null,[i("You can use "),s("code",null,"density"),i(" prop to reduce the field height and lower max height of list items.")],-1)),e(r)]),_:1,__:[1]},8,["code"])]),_:1}),e(c,{cols:"12"},{default:a(()=>[e(o,{title:"Variant",code:n(W)},{default:a(()=>[t[2]||(t[2]=s("p",null,[i(" Use "),s("code",null,"filled"),i(", "),s("code",null,"outlined"),i(", "),s("code",null,"solo"),i(", "),s("code",null,"underlined"),i(" and "),s("code",null,"plain"),i(" options of "),s("code",null,"variant"),i(" prop to change appearance of select. ")],-1)),e(v)]),_:1,__:[2]},8,["code"])]),_:1}),e(c,{cols:"12",md:"6"},{default:a(()=>[e(o,{title:"Custom text and value",code:n(Y)},{default:a(()=>[t[3]||(t[3]=s("p",null,"You can specify the specific properties within your items array that correspond to the title and value fields. In this example we also use the return-object prop which will return the entire object of the selected item on selection.",-1)),e(V)]),_:1,__:[3]},8,["code"])]),_:1}),e(c,{cols:"12",md:"6"},{default:a(()=>[e(o,{title:"Icons",code:n(Q)},{default:a(()=>[t[4]||(t[4]=s("p",null,[i("Use a custom "),s("code",null,"prepend"),i(" or "),s("code",null,"appended"),i(" icon.")],-1)),e(C)]),_:1,__:[4]},8,["code"])]),_:1}),e(c,{cols:"12",md:"6"},{default:a(()=>[e(o,{title:"Chips",code:n(P)},{default:a(()=>[t[5]||(t[5]=s("p",null,[i("Use "),s("code",null,"chips"),i(" prop to make selected option as chip.")],-1)),e(z)]),_:1,__:[5]},8,["code"])]),_:1}),e(c,{cols:"12",md:"6"},{default:a(()=>[e(o,{title:"Menu Props",code:n(q)},{default:a(()=>[t[6]||(t[6]=s("p",null,[i("Custom props can be passed directly to "),s("code",null,"v-menu"),i(" using "),s("code",null,"menuProps"),i(" prop.")],-1)),e(h)]),_:1,__:[6]},8,["code"])]),_:1}),e(c,{cols:"12",md:"6"},{default:a(()=>[e(o,{title:"Multiple",code:n(J)},{default:a(()=>[t[7]||(t[7]=s("p",null,[i("Use "),s("code",null,"multiple"),i(" prop to select multiple option.")],-1)),e(g)]),_:1,__:[7]},8,["code"])]),_:1}),e(c,{cols:"12",md:"6"},{default:a(()=>[e(o,{title:"Selection slot",code:n(K)},{default:a(()=>[t[8]||(t[8]=s("p",null,[i("The "),s("code",null,"selection"),i(" slot can be used to customize the way selected values are shown in the input.")],-1)),e(A)]),_:1,__:[8]},8,["code"])]),_:1})]),_:1})}}};export{ae as default};
