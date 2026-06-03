import{_ as de}from"./CustomRadiosWithIcon-Bbux97GD.js";import{j as m,b as g,o as h,w as l,g as c,d as e,Q as ne,v as y,C as re,s as F,V as Z,E as v,G as a,y as _,ad as ee,h as i,u as s,aF as oe,ap as D,ab as T,O as S,N as R,_ as L,R as me,c as M,F as X,L as ae,U as ie,e as z,ae as le,f as te,am as Y,aY as G,aZ as O,x as N,M as ue,q as u,t as Ve,i as ce,al as pe,ak as K,aj as fe,a2 as be,a3 as Q,a_ as Ce}from"./vuetify-Dwmbz9tX.js";import{_ as ve}from"./index-BfLA9FeW.js";import{_ as ye}from"./InvoiceAddPaymentDrawer-Q8Bg3cvy.js";import{r as E,e as we}from"./ps4-joystick-lg-IZEkSHGo.js";import{_ as xe}from"./rating-DTOSp-lb.js";import"./useSkins-CCIMaHdj.js";import"./auth-v2-login-illustration-light1-CFjwDmNM.js";const Fe={class:"w-100 sticky-header overflow-hidden rounded-t"},he={class:"d-flex align-center gap-4 flex-wrap bg-custom-background pa-6"},_e={class:"d-flex align-center gap-4"},ge={class:"d-flex align-center gap-2 my-4"},ke={__name:"DemoFormLayoutFormSticky",setup(k){const b=[{title:"Standard",desc:"Delivery in 3-5 days.",value:"standard",icon:"ri-briefcase-line"},{title:"Express",desc:"Delivery within 2 days.",value:"express",icon:"ri-rocket-line"},{title:"Overnight",desc:"Delivery within a days.",value:"overnight",icon:"ri-vip-crown-line"}],f=[{code:"TAKEITALL",desc:"Apply this code to get 15% discount on orders above 20$."},{code:"FESTIVE10",desc:"Apply this code to get 10% discount on all orders."},{code:"MYSTERYDEAL",desc:"Apply this code to get discount between 10% - 50%."}],n=m({fullName:"",email:"",contactNumber:null,altContactNumber:null,address:"",pincode:null,Landmark:"",city:"",state:null,defaultAddress:!1,addressType:"home",deliveryType:"standard",promoCode:"",paymentMethod:"card",cardNumber:null,cardName:"",cardExDate:"",cardCvv:""});return(p,d)=>{const x=de;return h(),g(te,{class:"overflow-visible"},{default:l(()=>[c("div",Fe,[c("div",he,[e(ne,null,{default:l(()=>d[14]||(d[14]=[y("Sticky Action Bar")])),_:1,__:[14]}),e(re),c("div",null,[e(F,{variant:"tonal",class:"me-4"},{default:l(()=>d[15]||(d[15]=[y(" Back ")])),_:1,__:[15]}),e(F,null,{default:l(()=>d[16]||(d[16]=[y("Place Order")])),_:1,__:[16]})])])]),e(Z,null,{default:l(()=>[e(v,null,{default:l(()=>[e(a,{md:"8",cols:"12",class:"mx-auto"},{default:l(()=>[e(_,null,{default:l(()=>[d[22]||(d[22]=c("h2",{class:"text-lg font-weight-medium mb-6"}," 1. Delivery Address ",-1)),e(v,null,{default:l(()=>[e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(n).fullName,"onUpdate:modelValue":d[0]||(d[0]=o=>s(n).fullName=o),label:"Full Name",placeholder:"John Doe"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(n).email,"onUpdate:modelValue":d[1]||(d[1]=o=>s(n).email=o),label:"Email",placeholder:"john.doe",suffix:"@example.com"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(n).contactNumber,"onUpdate:modelValue":d[2]||(d[2]=o=>s(n).contactNumber=o),label:"Contact Number",placeholder:"658 123 4567",type:"number"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(n).altContactNumber,"onUpdate:modelValue":d[3]||(d[3]=o=>s(n).altContactNumber=o),label:"Alternate Number",placeholder:"658 123 4567",type:"number"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(oe,{modelValue:s(n).address,"onUpdate:modelValue":d[4]||(d[4]=o=>s(n).address=o),label:"Address",placeholder:"1456, Mall Road",rows:"2"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(n).pincode,"onUpdate:modelValue":d[5]||(d[5]=o=>s(n).pincode=o),label:"Pincode",placeholder:"658468",type:"number"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(n).Landmark,"onUpdate:modelValue":d[6]||(d[6]=o=>s(n).Landmark=o),label:"Landmark",placeholder:"Nr. Wall Street"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(n).city,"onUpdate:modelValue":d[7]||(d[7]=o=>s(n).city=o),label:"City",placeholder:"Jackson"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(D,{modelValue:s(n).state,"onUpdate:modelValue":d[8]||(d[8]=o=>s(n).state=o),label:"State",placeholder:"California",items:["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida"]},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(T,{modelValue:s(n).defaultAddress,"onUpdate:modelValue":d[9]||(d[9]=o=>s(n).defaultAddress=o),label:"Use this as default delivery address"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[d[17]||(d[17]=c("p",{class:"text-high-emphasis text-base mb-1"}," Address Type ",-1)),e(S,{modelValue:s(n).addressType,"onUpdate:modelValue":d[10]||(d[10]=o=>s(n).addressType=o),inline:""},{default:l(()=>[e(R,{label:"Home (All day delivery)",value:"home"}),e(R,{label:"Office (Delivery between 10 AM - 5 PM)",value:"work"})]),_:1},8,["modelValue"])]),_:1,__:[17]})]),_:1}),e(L,{class:"my-6"}),d[23]||(d[23]=c("h2",{class:"text-lg font-weight-medium mb-6"}," 2. Delivery Type ",-1)),e(x,{"selected-radio":s(n).deliveryType,"onUpdate:selectedRadio":d[11]||(d[11]=o=>s(n).deliveryType=o),"radio-content":b,"grid-column":{sm:"4",cols:"12"}},null,8,["selected-radio"]),e(L,{class:"my-6"}),d[24]||(d[24]=c("h2",{class:"text-lg font-weight-medium mb-6"}," 3. Apply Promo code ",-1)),c("div",_e,[e(i,{modelValue:s(n).promoCode,"onUpdate:modelValue":d[12]||(d[12]=o=>s(n).promoCode=o),density:"compact",placeholder:"TAKEITALL"},null,8,["modelValue"]),e(F,null,{default:l(()=>d[18]||(d[18]=[y("Apply")])),_:1,__:[18]})]),c("div",ge,[e(L,{style:{"border-style":"dashed"}}),d[19]||(d[19]=c("span",null,"OR",-1)),e(L,{style:{"border-style":"dashed"}})]),e(me,{class:"border rounded py-0",lines:"two"},{default:l(()=>[(h(),M(X,null,ae(f,(o,t)=>e(ie,{key:o.code,title:o.code,subtitle:o.desc,class:z(t!==0?"border-t":"")},{append:l(()=>[e(F,{variant:"outlined"},{default:l(()=>d[20]||(d[20]=[y(" Apply ")])),_:1,__:[20]})]),_:2},1032,["title","subtitle","class"])),64))]),_:1}),e(L,{class:"my-6"}),d[25]||(d[25]=c("h2",{class:"text-lg font-weight-medium mb-6"}," 4. Payment Method ",-1)),e(S,{modelValue:s(n).paymentMethod,"onUpdate:modelValue":d[13]||(d[13]=o=>s(n).paymentMethod=o),inline:"",class:"mb-4"},{default:l(()=>[e(R,{value:"card",label:"Credit/Debit/ATM Card"}),e(R,{value:"cash-on-delivery",label:"Cash On Delivery"})]),_:1},8,["modelValue"]),ee(e(v,null,{default:l(()=>[e(a,{cols:"12"},{default:l(()=>[e(i,{label:"Card Number",placeholder:"1356 3215 6548 7898"})]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{label:"Name",placeholder:"John Doe"})]),_:1}),e(a,{cols:"6",md:"3"},{default:l(()=>[e(i,{label:"Exp. Date",placeholder:"MM/YY"})]),_:1}),e(a,{cols:"6",md:"3"},{default:l(()=>[e(i,{label:"CVV Code",placeholder:"654"})]),_:1})]),_:1},512),[[le,s(n).paymentMethod==="card"]]),ee(c("div",null,d[21]||(d[21]=[c("p",null," Cash on delivery is a mode of payment where you make the payment after the goods/services are received. ",-1),c("p",null,"You can pay cash or make the payment via debit/credit card directly to the delivery person.",-1)]),512),[[le,s(n).paymentMethod==="cash-on-delivery"]])]),_:1,__:[22,23,24,25]})]),_:1})]),_:1})]),_:1})]),_:1})}}},Re=ve(ke,[["__scopeId","data-v-7fc14e5a"]]),Te={class:"me-1"},Ne={class:"d-flex gap-4"},Le={__name:"DemoFormLayoutCollapsible",setup(k){const b=["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii"],f=m("home"),n=m("standard"),p=m("credit-debit-card"),d=m(0),x=[{radioValue:"credit-debit-card",radioLabel:"Credit/Debit/ATM Card",icon:"ri-bank-card-line"},{radioValue:"cash-on-delivery",radioLabel:"Cash On Delivery",icon:"ri-question-line"}];return(o,t)=>(h(),g(pe,{modelValue:s(d),"onUpdate:modelValue":t[6]||(t[6]=r=>u(d)?d.value=r:null)},{default:l(()=>[e(Y,null,{default:l(()=>[e(G,null,{default:l(()=>t[7]||(t[7]=[y("Delivery Address")])),_:1,__:[7]}),e(O,null,{default:l(()=>[e(_,{class:"pt-4 pb-2",onSubmit:N(()=>{},["prevent"])},{default:l(()=>[e(v,null,{default:l(()=>[e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{label:"Full Name",placeholder:"John Doe"})]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{label:"Phone No",type:"number",placeholder:"+1 123 456 7890"})]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(oe,{label:"Address",placeholder:"1234 Main St, New York, NY 10001, USA",rows:"3"})]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{label:"Pincode",placeholder:"123456",type:"number"})]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{label:"Landmark",placeholder:"Near City Mall"})]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{label:"City",placeholder:"New York"})]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(D,{items:b,label:"State",placeholder:"Select State"})]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(ue,{class:"mb-3"},{default:l(()=>t[8]||(t[8]=[y(" Address Type ")])),_:1,__:[8]}),e(S,{modelValue:s(f),"onUpdate:modelValue":t[0]||(t[0]=r=>u(f)?f.value=r:null),inline:""},{default:l(()=>[c("div",null,[e(R,{label:"Home (All day delivery)",value:"home"}),e(R,{label:"Office (Delivery between 10 AM - 5 PM)",value:"office"})])]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(Y,null,{default:l(()=>[e(G,null,{default:l(()=>t[9]||(t[9]=[y("Delivery Options")])),_:1,__:[9]}),e(O,null,{default:l(()=>[e(S,{modelValue:s(n),"onUpdate:modelValue":t[4]||(t[4]=r=>u(n)?n.value=r:null),class:"delivery-options pt-4 pb-2"},{default:l(()=>[c("div",{class:z(["delivery-option d-flex rounded-t",s(n)==="standard"?"active":""]),onClick:t[1]||(t[1]=r=>n.value="standard")},[e(R,{inline:"",value:"standard",class:"mt-n4"}),t[10]||(t[10]=c("div",{class:"w-100"},[c("div",{class:"d-flex justify-space-between"},[c("h6",{class:"text-base font-weight-medium"}," Standard 3-5 Days "),c("span",{class:"text-sm text-disabled"}," Free ")]),c("div",{class:"text-sm text-medium-emphasis"}," Friday, 15 Nov - Monday, 18 Nov ")],-1))],2),c("div",{class:z(["delivery-option d-flex",s(n)==="express"?"active":""]),onClick:t[2]||(t[2]=r=>n.value="express")},[e(R,{inline:"",class:"mt-n4",value:"express"}),t[11]||(t[11]=c("div",{class:"w-100"},[c("div",{class:"d-flex justify-space-between"},[c("h5",{class:"text-base font-weight-medium"}," Express "),c("span",{class:"text-sm text-disabled"}," $5.00 ")]),c("div",{class:"text-sm text-medium-emphasis"}," Friday, 15 Nov - Sunday, 17 Nov ")],-1))],2),c("div",{class:z(["delivery-option d-flex rounded-b",s(n)==="overnight"?"active":""]),onClick:t[3]||(t[3]=r=>n.value="overnight")},[e(R,{inline:"",class:"mt-n4",value:"overnight"}),t[12]||(t[12]=c("div",{class:"w-100"},[c("div",{class:"d-flex justify-space-between"},[c("h6",{class:"text-base font-weight-medium"}," Overnight "),c("span",{class:"text-sm text-disabled"}," $10.00 ")]),c("div",{class:"text-sm text-medium-emphasis"}," Friday, 15 Nov - Saturday, 16 Nov ")],-1))],2)]),_:1},8,["modelValue"])]),_:1})]),_:1}),e(Y,null,{default:l(()=>[e(G,null,{default:l(()=>t[13]||(t[13]=[y("Payment Method")])),_:1,__:[13]}),e(O,null,{default:l(()=>[e(v,null,{default:l(()=>[e(a,{md:"6",cols:"12"},{default:l(()=>[e(_,{class:"pt-4 pb-2"},{default:l(()=>[e(v,null,{default:l(()=>[e(a,{cols:"12"},{default:l(()=>[c("div",null,[e(S,{modelValue:s(p),"onUpdate:modelValue":t[5]||(t[5]=r=>u(p)?p.value=r:null),inline:""},{default:l(()=>[c("div",null,[(h(),M(X,null,ae(x,r=>e(R,{key:r.radioValue,value:r.radioValue},{label:l(()=>[c("span",Te,Ve(r.radioLabel),1),e(ce,{size:"18",icon:r.icon},null,8,["icon"])]),_:2},1032,["value"])),64))])]),_:1},8,["modelValue"])])]),_:1})]),_:1}),s(p)==="credit-debit-card"?(h(),g(v,{key:0},{default:l(()=>[e(a,{cols:"12"},{default:l(()=>[e(i,{label:"Card Number",type:"number",placeholder:"1234 5678 9012 3456"})]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{label:"Name",placeholder:"john doe"})]),_:1}),e(a,{cols:"6",md:"3"},{default:l(()=>[e(i,{label:"Expiry Date",placeholder:"MM/YY"})]),_:1}),e(a,{cols:"6",md:"3"},{default:l(()=>[e(i,{label:"CVV Code",type:"number",max:"3",placeholder:"123"})]),_:1}),e(a,null,{default:l(()=>[c("div",Ne,[e(F,null,{default:l(()=>t[14]||(t[14]=[y("Place Order")])),_:1,__:[14]}),e(F,{color:"secondary",variant:"tonal"},{default:l(()=>t[15]||(t[15]=[y(" Cancel ")])),_:1,__:[15]})])]),_:1})]),_:1})):(h(),g(v,{key:1},{default:l(()=>[e(a,null,{default:l(()=>t[16]||(t[16]=[c("div",{class:"text-high-emphasis"}," Cash on Delivery is a type of payment method where the recipient make payment for the order at the time of delivery rather than in advance. ",-1)])),_:1,__:[16]})]),_:1}))]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]))}},Ie={__name:"DemoFormLayoutFormWithTabs",setup(k){const b=m("personal-info"),f=m(""),n=m(""),p=m(),d=m(""),x=m(),o=["USA","Canada","UK","Denmark","Germany","Iceland","Israel","Mexico"],t=["English","German","French","Spanish","Portuguese","Russian","Korean"],r=m(""),w=m(""),I=m(""),U=m(""),P=m(""),j=m(""),q=m(""),H=m(""),J=m(""),W=m(""),$=m([]),B=m(!1),A=m(!1);return(Ye,V)=>{const se=ye;return h(),M(X,null,[e(fe,{modelValue:s(b),"onUpdate:modelValue":V[0]||(V[0]=C=>u(b)?b.value=C:null)},{default:l(()=>[e(K,{value:"personal-info"},{default:l(()=>V[20]||(V[20]=[y(" Personal Info ")])),_:1,__:[20]}),e(K,{value:"account-details"},{default:l(()=>V[21]||(V[21]=[y(" Account Details ")])),_:1,__:[21]}),e(K,{value:"social-links"},{default:l(()=>V[22]||(V[22]=[y(" Social Links ")])),_:1,__:[22]})]),_:1},8,["modelValue"]),e(te,{flat:""},{default:l(()=>[e(Z,null,{default:l(()=>[e(be,{modelValue:s(b),"onUpdate:modelValue":V[19]||(V[19]=C=>u(b)?b.value=C:null),class:"disable-tab-transition"},{default:l(()=>[e(Q,{value:"personal-info"},{default:l(()=>[e(_,{class:"mt-2"},{default:l(()=>[e(v,null,{default:l(()=>[e(a,{md:"6",cols:"12"},{default:l(()=>[e(i,{modelValue:s(f),"onUpdate:modelValue":V[1]||(V[1]=C=>u(f)?f.value=C:null),label:"First name",placeholder:"John"},null,8,["modelValue"])]),_:1}),e(a,{md:"6",cols:"12"},{default:l(()=>[e(i,{modelValue:s(n),"onUpdate:modelValue":V[2]||(V[2]=C=>u(n)?n.value=C:null),label:"Last name",placeholder:"Doe"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(D,{modelValue:s(p),"onUpdate:modelValue":V[3]||(V[3]=C=>u(p)?p.value=C:null),items:o,label:"Country",placeholder:"Select Country"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(D,{modelValue:s($),"onUpdate:modelValue":V[4]||(V[4]=C=>u($)?$.value=C:null),items:t,multiple:"",chips:"",clearable:"",label:"Language",placeholder:"Select Language"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(se,{modelValue:s(d),"onUpdate:modelValue":V[5]||(V[5]=C=>u(d)?d.value=C:null),label:"Birth Date",placeholder:"Select Birth Date"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(x),"onUpdate:modelValue":V[6]||(V[6]=C=>u(x)?x.value=C:null),type:"number",label:"Phone No.",placeholder:"+1 123 456 7890"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1}),e(Q,{value:"account-details"},{default:l(()=>[e(_,{class:"mt-2"},{default:l(()=>[e(v,null,{default:l(()=>[e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(r),"onUpdate:modelValue":V[7]||(V[7]=C=>u(r)?r.value=C:null),label:"Username",placeholder:"Johndoe"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(w),"onUpdate:modelValue":V[8]||(V[8]=C=>u(w)?w.value=C:null),label:"Email",suffix:"@example.com",placeholder:"johndoe@email.com"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(I),"onUpdate:modelValue":V[9]||(V[9]=C=>u(I)?I.value=C:null),label:"Password",placeholder:"············",type:s(B)?"text":"password",autocomplete:"password","append-inner-icon":s(B)?"ri-eye-off-line":"ri-eye-line","onClick:appendInner":V[10]||(V[10]=C=>B.value=!s(B))},null,8,["modelValue","type","append-inner-icon"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(U),"onUpdate:modelValue":V[11]||(V[11]=C=>u(U)?U.value=C:null),label:"Confirm Password",autocomplete:"confirm-password",placeholder:"············",type:s(A)?"text":"password","append-inner-icon":s(A)?"ri-eye-off-line":"ri-eye-line","onClick:appendInner":V[12]||(V[12]=C=>A.value=!s(A))},null,8,["modelValue","type","append-inner-icon"])]),_:1})]),_:1})]),_:1})]),_:1}),e(Q,{value:"social-links"},{default:l(()=>[e(_,{class:"mt-2"},{default:l(()=>[e(v,null,{default:l(()=>[e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(P),"onUpdate:modelValue":V[13]||(V[13]=C=>u(P)?P.value=C:null),label:"Twitter",placeholder:"https://twitter.com/username"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(j),"onUpdate:modelValue":V[14]||(V[14]=C=>u(j)?j.value=C:null),label:"Facebook",placeholder:"https://facebook.com/username"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(q),"onUpdate:modelValue":V[15]||(V[15]=C=>u(q)?q.value=C:null),label:"Google+",placeholder:"https://plus.google.com/username"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(H),"onUpdate:modelValue":V[16]||(V[16]=C=>u(H)?H.value=C:null),label:"LinkedIn",placeholder:"https://linkedin.com/username"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(J),"onUpdate:modelValue":V[17]||(V[17]=C=>u(J)?J.value=C:null),label:"Instagram",placeholder:"https://instagram.com/username"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(W),"onUpdate:modelValue":V[18]||(V[18]=C=>u(W)?W.value=C:null),label:"Quora",placeholder:"https://quora.com/username"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1}),e(L),e(Z,{class:"d-flex gap-4"},{default:l(()=>[e(F,null,{default:l(()=>V[23]||(V[23]=[y("Submit")])),_:1,__:[23]}),e(F,{color:"secondary",variant:"tonal"},{default:l(()=>V[24]||(V[24]=[y(" Cancel ")])),_:1,__:[24]})]),_:1})]),_:1})],64)}}},Ue={__name:"DemoFormLayoutFormValidation",setup(k){const b=m(""),f=m(""),n=["Item 1","Item 2","Item 3","Item 4"],p=m(),d=m(!1),x=m();return(o,t)=>(h(),g(_,{ref_key:"form",ref:x,"lazy-validation":""},{default:l(()=>[e(v,null,{default:l(()=>[e(a,{cols:"12"},{default:l(()=>[e(i,{modelValue:s(b),"onUpdate:modelValue":t[0]||(t[0]=r=>u(b)?b.value=r:null),rules:["requiredValidator"in o?o.requiredValidator:s(E)],label:"Name",placeholder:"John Doe",required:""},null,8,["modelValue","rules"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(i,{modelValue:s(f),"onUpdate:modelValue":t[1]||(t[1]=r=>u(f)?f.value=r:null),rules:["emailValidator"in o?o.emailValidator:s(we),"requiredValidator"in o?o.requiredValidator:s(E)],label:"E-mail",placeholder:"johndoe@email.com",required:""},null,8,["modelValue","rules"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(D,{modelValue:s(p),"onUpdate:modelValue":t[2]||(t[2]=r=>u(p)?p.value=r:null),items:n,rules:["requiredValidator"in o?o.requiredValidator:s(E)],placeholder:"Select an Item",label:"Item",name:"select",require:""},null,8,["modelValue","rules"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(T,{modelValue:s(d),"onUpdate:modelValue":t[3]||(t[3]=r=>u(d)?d.value=r:null),rules:["requiredValidator"in o?o.requiredValidator:s(E)],label:"Do you agree?",required:""},null,8,["modelValue","rules"])]),_:1}),e(a,{cols:"12",class:"d-flex flex-wrap gap-4"},{default:l(()=>[e(F,{color:"success",onClick:t[4]||(t[4]=r=>{var w;return(w=s(x))==null?void 0:w.validate()})},{default:l(()=>t[7]||(t[7]=[y(" Validate ")])),_:1,__:[7]}),e(F,{color:"error",onClick:t[5]||(t[5]=r=>{var w;return(w=s(x))==null?void 0:w.reset()})},{default:l(()=>t[8]||(t[8]=[y(" Reset Form ")])),_:1,__:[8]}),e(F,{color:"warning",onClick:t[6]||(t[6]=r=>{var w;return(w=s(x))==null?void 0:w.resetValidation()})},{default:l(()=>t[9]||(t[9]=[y(" Reset Validation ")])),_:1,__:[9]})]),_:1})]),_:1})]),_:1},512))}},Pe={__name:"DemoFormLayoutFormHint",setup(k){const b=m(""),f=m(""),n=m(),p=m(!1),d=["foo","bar","fizz","buzz"],x=m([]);return(o,t)=>(h(),g(_,{onSubmit:N(()=>{},["prevent"])},{default:l(()=>[e(v,null,{default:l(()=>[e(a,{cols:"12"},{default:l(()=>[e(i,{modelValue:s(b),"onUpdate:modelValue":t[0]||(t[0]=r=>u(b)?b.value=r:null),label:"Username",placeholder:"Johndoe"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(i,{modelValue:s(f),"onUpdate:modelValue":t[1]||(t[1]=r=>u(f)?f.value=r:null),label:"Email",type:"email",placeholder:"johndoe@email.com"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(i,{modelValue:s(n),"onUpdate:modelValue":t[2]||(t[2]=r=>u(n)?n.value=r:null),label:"Password",autocomplete:"on",type:"password","persistent-hint":"",placeholder:"············",hint:"Your password must be 8-20 characters long."},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(Ce,{modelValue:s(x),"onUpdate:modelValue":t[3]||(t[3]=r=>u(x)?x.value=r:null),items:d,chips:"",multiple:"",label:"Autocomplete",placeholder:"Select"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(T,{modelValue:s(p),"onUpdate:modelValue":t[4]||(t[4]=r=>u(p)?p.value=r:null),label:"Remember me"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",class:"d-flex gap-4"},{default:l(()=>[e(F,{type:"submit"},{default:l(()=>t[5]||(t[5]=[y(" Submit ")])),_:1,__:[5]}),e(F,{color:"secondary",type:"reset",variant:"tonal"},{default:l(()=>t[6]||(t[6]=[y(" Reset ")])),_:1,__:[6]})]),_:1})]),_:1})]),_:1}))}},Se={__name:"DemoFormLayoutMultipleColumn",setup(k){const b=m(""),f=m(""),n=m(""),p=m(""),d=m(""),x=m(""),o=m(!1);return(t,r)=>(h(),g(_,{onSubmit:N(()=>{},["prevent"])},{default:l(()=>[e(v,null,{default:l(()=>[e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(b),"onUpdate:modelValue":r[0]||(r[0]=w=>u(b)?b.value=w:null),label:"First Name",placeholder:"John"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(f),"onUpdate:modelValue":r[1]||(r[1]=w=>u(f)?f.value=w:null),label:"Last Name",placeholder:"Doe"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(x),"onUpdate:modelValue":r[2]||(r[2]=w=>u(x)?x.value=w:null),label:"Email",placeholder:"johndoe@email.com"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(n),"onUpdate:modelValue":r[3]||(r[3]=w=>u(n)?n.value=w:null),label:"City",placeholder:"New York"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(p),"onUpdate:modelValue":r[4]||(r[4]=w=>u(p)?p.value=w:null),label:"Country",placeholder:"United States"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(i,{modelValue:s(d),"onUpdate:modelValue":r[5]||(r[5]=w=>u(d)?d.value=w:null),label:"Company",placeholder:"Pixinvent"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(T,{modelValue:s(o),"onUpdate:modelValue":r[6]||(r[6]=w=>u(o)?o.value=w:null),label:"Remember me"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",class:"d-flex gap-4"},{default:l(()=>[e(F,{type:"submit"},{default:l(()=>r[7]||(r[7]=[y(" Submit ")])),_:1,__:[7]}),e(F,{type:"reset",color:"secondary",variant:"tonal"},{default:l(()=>r[8]||(r[8]=[y(" Reset ")])),_:1,__:[8]})]),_:1})]),_:1})]),_:1}))}},De={__name:"DemoFormLayoutVerticalFormWithIcons",setup(k){const b=m(""),f=m(""),n=m(""),p=m(),d=m(!1);return(x,o)=>(h(),g(_,{onSubmit:o[5]||(o[5]=N(()=>{},["prevent"]))},{default:l(()=>[e(v,null,{default:l(()=>[e(a,{cols:"12"},{default:l(()=>[e(i,{modelValue:s(b),"onUpdate:modelValue":o[0]||(o[0]=t=>u(b)?b.value=t:null),"prepend-inner-icon":"ri-user-line",label:"First Name",placeholder:"John"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(i,{modelValue:s(f),"onUpdate:modelValue":o[1]||(o[1]=t=>u(f)?f.value=t:null),"prepend-inner-icon":"ri-mail-line",label:"Email",type:"email",placeholder:"johndoe@example.com"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(i,{modelValue:s(n),"onUpdate:modelValue":o[2]||(o[2]=t=>u(n)?n.value=t:null),"prepend-inner-icon":"ri-smartphone-line",label:"Mobile",placeholder:"+1 123 456 7890"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(i,{modelValue:s(p),"onUpdate:modelValue":o[3]||(o[3]=t=>u(p)?p.value=t:null),"prepend-inner-icon":"ri-lock-line",label:"Password",autocomplete:"on",type:"password",placeholder:"············"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(T,{modelValue:s(d),"onUpdate:modelValue":o[4]||(o[4]=t=>u(d)?d.value=t:null),label:"Remember me"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(F,{type:"submit",class:"me-4"},{default:l(()=>o[6]||(o[6]=[y(" Submit ")])),_:1,__:[6]}),e(F,{color:"secondary",type:"reset",variant:"tonal"},{default:l(()=>o[7]||(o[7]=[y(" Reset ")])),_:1,__:[7]})]),_:1})]),_:1})]),_:1}))}},Be={__name:"DemoFormLayoutVerticalForm",setup(k){const b=m(""),f=m(""),n=m(""),p=m(),d=m(!1);return(x,o)=>(h(),g(_,{onSubmit:N(()=>{},["prevent"])},{default:l(()=>[e(v,null,{default:l(()=>[e(a,{cols:"12"},{default:l(()=>[e(i,{modelValue:s(b),"onUpdate:modelValue":o[0]||(o[0]=t=>u(b)?b.value=t:null),label:"First Name",placeholder:"John"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(i,{modelValue:s(f),"onUpdate:modelValue":o[1]||(o[1]=t=>u(f)?f.value=t:null),label:"Email",type:"email",placeholder:"johndoe@example.com"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(i,{modelValue:s(n),"onUpdate:modelValue":o[2]||(o[2]=t=>u(n)?n.value=t:null),label:"Mobile",placeholder:"+1 123 456 7890",type:"number"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(i,{modelValue:s(p),"onUpdate:modelValue":o[3]||(o[3]=t=>u(p)?p.value=t:null),label:"Password",autocomplete:"on",type:"password",placeholder:"············"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(T,{modelValue:s(d),"onUpdate:modelValue":o[4]||(o[4]=t=>u(d)?d.value=t:null),label:"Remember me"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12",class:"d-flex gap-4"},{default:l(()=>[e(F,{type:"submit"},{default:l(()=>o[5]||(o[5]=[y(" Submit ")])),_:1,__:[5]}),e(F,{type:"reset",color:"secondary",variant:"tonal"},{default:l(()=>o[6]||(o[6]=[y(" Reset ")])),_:1,__:[6]})]),_:1})]),_:1})]),_:1}))}},Ae={__name:"DemoFormLayoutHorizontalFormWithIcons",setup(k){const b=m(""),f=m(""),n=m(),p=m(),d=m(!1);return(x,o)=>(h(),g(_,{onSubmit:N(()=>{},["prevent"])},{default:l(()=>[e(v,null,{default:l(()=>[e(a,{cols:"12"},{default:l(()=>[e(v,{"no-gutters":""},{default:l(()=>[e(a,{cols:"12",md:"3"},{default:l(()=>o[5]||(o[5]=[c("label",{for:"firstNameHorizontalIcons"},"First Name",-1)])),_:1,__:[5]}),e(a,{cols:"12",md:"9"},{default:l(()=>[e(i,{id:"firstNameHorizontalIcons",modelValue:s(b),"onUpdate:modelValue":o[0]||(o[0]=t=>u(b)?b.value=t:null),"prepend-inner-icon":"ri-user-line",placeholder:"John","persistent-placeholder":""},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(v,{"no-gutters":""},{default:l(()=>[e(a,{cols:"12",md:"3"},{default:l(()=>o[6]||(o[6]=[c("label",{for:"emailHorizontalIcons"},"Email",-1)])),_:1,__:[6]}),e(a,{cols:"12",md:"9"},{default:l(()=>[e(i,{id:"emailHorizontalIcons",modelValue:s(f),"onUpdate:modelValue":o[1]||(o[1]=t=>u(f)?f.value=t:null),"prepend-inner-icon":"ri-mail-line",placeholder:"johndoe@email.com","persistent-placeholder":""},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(v,{"no-gutters":""},{default:l(()=>[e(a,{cols:"12",md:"3"},{default:l(()=>o[7]||(o[7]=[c("label",{for:"mobileHorizontalIcons"},"Mobile",-1)])),_:1,__:[7]}),e(a,{cols:"12",md:"9"},{default:l(()=>[e(i,{id:"mobileHorizontalIcons",modelValue:s(n),"onUpdate:modelValue":o[2]||(o[2]=t=>u(n)?n.value=t:null),type:"number","prepend-inner-icon":"ri-smartphone-line",placeholder:"+1 123 456 7890","persistent-placeholder":""},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(v,{"no-gutters":""},{default:l(()=>[e(a,{cols:"12",md:"3"},{default:l(()=>o[8]||(o[8]=[c("label",{for:"passwordHorizontalIcons"},"Password",-1)])),_:1,__:[8]}),e(a,{cols:"12",md:"9"},{default:l(()=>[e(i,{id:"passwordHorizontalIcons",modelValue:s(p),"onUpdate:modelValue":o[3]||(o[3]=t=>u(p)?p.value=t:null),"prepend-inner-icon":"ri-lock-line",autocomplete:"on",type:"password",placeholder:"············","persistent-placeholder":""},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(v,{"no-gutters":""},{default:l(()=>[e(a,{cols:"12",md:"3"}),e(a,{cols:"12",md:"9"},{default:l(()=>[e(T,{modelValue:s(d),"onUpdate:modelValue":o[4]||(o[4]=t=>u(d)?d.value=t:null),label:"Remember me"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(v,{"no-gutters":""},{default:l(()=>[e(a,{cols:"12",md:"3"}),e(a,{cols:"12",md:"9"},{default:l(()=>[e(F,{type:"submit",class:"me-4"},{default:l(()=>o[9]||(o[9]=[y(" Submit ")])),_:1,__:[9]}),e(F,{color:"secondary",variant:"tonal",type:"reset"},{default:l(()=>o[10]||(o[10]=[y(" Reset ")])),_:1,__:[10]})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}},Ee={__name:"DemoFormLayoutHorizontalForm",setup(k){const b=m(""),f=m(""),n=m(),p=m(),d=m(!1);return(x,o)=>(h(),g(_,{onSubmit:N(()=>{},["prevent"])},{default:l(()=>[e(v,null,{default:l(()=>[e(a,{cols:"12"},{default:l(()=>[e(v,{"no-gutters":""},{default:l(()=>[e(a,{cols:"12",md:"3"},{default:l(()=>o[5]||(o[5]=[c("label",{for:"firstName"},"First Name",-1)])),_:1,__:[5]}),e(a,{cols:"12",md:"9"},{default:l(()=>[e(i,{id:"firstName",modelValue:s(b),"onUpdate:modelValue":o[0]||(o[0]=t=>u(b)?b.value=t:null),placeholder:"John","persistent-placeholder":""},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(v,{"no-gutters":""},{default:l(()=>[e(a,{cols:"12",md:"3"},{default:l(()=>o[6]||(o[6]=[c("label",{for:"email"},"Email",-1)])),_:1,__:[6]}),e(a,{cols:"12",md:"9"},{default:l(()=>[e(i,{id:"email",modelValue:s(f),"onUpdate:modelValue":o[1]||(o[1]=t=>u(f)?f.value=t:null),placeholder:"johndoe@email.com","persistent-placeholder":""},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(v,{"no-gutters":""},{default:l(()=>[e(a,{cols:"12",md:"3"},{default:l(()=>o[7]||(o[7]=[c("label",{for:"mobile"},"Mobile",-1)])),_:1,__:[7]}),e(a,{cols:"12",md:"9"},{default:l(()=>[e(i,{id:"mobile",modelValue:s(n),"onUpdate:modelValue":o[2]||(o[2]=t=>u(n)?n.value=t:null),type:"number",placeholder:"+1 123 456 7890","persistent-placeholder":""},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(v,{"no-gutters":""},{default:l(()=>[e(a,{cols:"12",md:"3"},{default:l(()=>o[8]||(o[8]=[c("label",{for:"password"},"Password",-1)])),_:1,__:[8]}),e(a,{cols:"12",md:"9"},{default:l(()=>[e(i,{id:"password",modelValue:s(p),"onUpdate:modelValue":o[3]||(o[3]=t=>u(p)?p.value=t:null),autocomplete:"on",type:"password",placeholder:"············","persistent-placeholder":""},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(v,{"no-gutters":""},{default:l(()=>[e(a,{cols:"12",md:"3"}),e(a,{cols:"12",md:"9"},{default:l(()=>[e(T,{modelValue:s(d),"onUpdate:modelValue":o[4]||(o[4]=t=>u(d)?d.value=t:null),label:"Remember me"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(v,{"no-gutters":""},{default:l(()=>[e(a,{cols:"12",md:"3"}),e(a,{cols:"12",md:"9"},{default:l(()=>[e(F,{type:"submit",class:"me-4"},{default:l(()=>o[9]||(o[9]=[y(" Submit ")])),_:1,__:[9]}),e(F,{color:"secondary",variant:"tonal",type:"reset"},{default:l(()=>o[10]||(o[10]=[y(" Reset ")])),_:1,__:[10]})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}},ze={ts:`<script lang="ts" setup>
const username = ref('')
const email = ref('')
const password = ref<string>()
const checkbox = ref(false)
const items = ['foo', 'bar', 'fizz', 'buzz'] as const
const values = ref<typeof items[number][]>([])
<\/script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <VCol cols="12">
        <!-- 👉 Username -->
        <VTextField
          v-model="username"
          label="Username"
          placeholder="Johndoe"
        />
      </VCol>

      <VCol cols="12">
        <!-- 👉 Email -->
        <VTextField
          v-model="email"
          label="Email"
          type="email"
          placeholder="johndoe@email.com"
        />
      </VCol>

      <VCol cols="12">
        <!-- 👉 Password -->
        <VTextField
          v-model="password"
          label="Password"
          autocomplete="on"
          type="password"
          persistent-hint
          placeholder="············"
          hint="Your password must be 8-20 characters long."
        />
      </VCol>

      <VCol cols="12">
        <!-- 👉 Autocomplete -->
        <VAutocomplete
          v-model="values"
          :items="items"
          chips
          multiple
          label="Autocomplete"
          placeholder="Select"
        />
      </VCol>

      <VCol cols="12">
        <!-- 👉 Checkbox -->
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <!-- 👉 submit and reset button -->
        <VBtn type="submit">
          Submit
        </VBtn>

        <VBtn
          color="secondary"
          type="reset"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,js:`<script setup>
const username = ref('')
const email = ref('')
const password = ref()
const checkbox = ref(false)

const items = [
  'foo',
  'bar',
  'fizz',
  'buzz',
]

const values = ref([])
<\/script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <VCol cols="12">
        <!-- 👉 Username -->
        <VTextField
          v-model="username"
          label="Username"
          placeholder="Johndoe"
        />
      </VCol>

      <VCol cols="12">
        <!-- 👉 Email -->
        <VTextField
          v-model="email"
          label="Email"
          type="email"
          placeholder="johndoe@email.com"
        />
      </VCol>

      <VCol cols="12">
        <!-- 👉 Password -->
        <VTextField
          v-model="password"
          label="Password"
          autocomplete="on"
          type="password"
          persistent-hint
          placeholder="············"
          hint="Your password must be 8-20 characters long."
        />
      </VCol>

      <VCol cols="12">
        <!-- 👉 Autocomplete -->
        <VAutocomplete
          v-model="values"
          :items="items"
          chips
          multiple
          label="Autocomplete"
          placeholder="Select"
        />
      </VCol>

      <VCol cols="12">
        <!-- 👉 Checkbox -->
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <!-- 👉 submit and reset button -->
        <VBtn type="submit">
          Submit
        </VBtn>

        <VBtn
          color="secondary"
          type="reset"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`},Me={ts:`<script lang="ts" setup>
import type { VForm } from 'vuetify/components/VForm'

const name = ref('')
const email = ref('')
const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'] as const
const select = ref<typeof items[number]>()
const checkbox = ref(false)
const form = ref<VForm>()
<\/script>

<template>
  <VForm
    ref="form"
    lazy-validation
  >
    <VRow>
      <VCol cols="12">
        <VTextField
          v-model="name"
          :rules="[requiredValidator]"
          label="Name"
          placeholder="John Doe"
          required
        />
      </VCol>

      <VCol cols="12">
        <VTextField
          v-model="email"
          :rules="[emailValidator, requiredValidator]"
          label="E-mail"
          placeholder="johndoe@email.com"
          required
        />
      </VCol>

      <VCol cols="12">
        <VSelect
          v-model="select"
          :items="items"
          :rules="[requiredValidator]"
          placeholder="Select an Item"
          label="Item"
          name="select"
          require
        />
      </VCol>

      <VCol cols="12">
        <VCheckbox
          v-model="checkbox"
          :rules="[requiredValidator]"
          label="Do you agree?"
          required
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex flex-wrap gap-4"
      >
        <VBtn
          color="success"
          @click="form?.validate()"
        >
          Validate
        </VBtn>

        <VBtn
          color="error"
          @click="form?.reset()"
        >
          Reset Form
        </VBtn>

        <VBtn
          color="warning"
          @click="form?.resetValidation()"
        >
          Reset Validation
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,js:`<script setup>
const name = ref('')
const email = ref('')

const items = [
  'Item 1',
  'Item 2',
  'Item 3',
  'Item 4',
]

const select = ref()
const checkbox = ref(false)
const form = ref()
<\/script>

<template>
  <VForm
    ref="form"
    lazy-validation
  >
    <VRow>
      <VCol cols="12">
        <VTextField
          v-model="name"
          :rules="[requiredValidator]"
          label="Name"
          placeholder="John Doe"
          required
        />
      </VCol>

      <VCol cols="12">
        <VTextField
          v-model="email"
          :rules="[emailValidator, requiredValidator]"
          label="E-mail"
          placeholder="johndoe@email.com"
          required
        />
      </VCol>

      <VCol cols="12">
        <VSelect
          v-model="select"
          :items="items"
          :rules="[requiredValidator]"
          placeholder="Select an Item"
          label="Item"
          name="select"
          require
        />
      </VCol>

      <VCol cols="12">
        <VCheckbox
          v-model="checkbox"
          :rules="[requiredValidator]"
          label="Do you agree?"
          required
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex flex-wrap gap-4"
      >
        <VBtn
          color="success"
          @click="form?.validate()"
        >
          Validate
        </VBtn>

        <VBtn
          color="error"
          @click="form?.reset()"
        >
          Reset Form
        </VBtn>

        <VBtn
          color="warning"
          @click="form?.resetValidation()"
        >
          Reset Validation
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`},je={ts:`<script lang="ts" setup>
const tab = ref('personal-info')
const firstName = ref('')
const lastName = ref('')
const country = ref()
const birthDate = ref('')
const phoneNo = ref<number>()
const countryList = ['USA', 'Canada', 'UK', 'Denmark', 'Germany', 'Iceland', 'Israel', 'Mexico']
const languageList = ['English', 'German', 'French', 'Spanish', 'Portuguese', 'Russian', 'Korean'] as const
const username = ref('')
const email = ref('')
const password = ref('')
const cPassword = ref('')
const twitterLink = ref('')
const facebookLink = ref('')
const googlePlusLink = ref('')
const linkedInLink = ref('')
const instagramLink = ref('')
const quoraLink = ref('')
const languages = ref<typeof languageList[number][]>([])
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)
<\/script>

<template>
  <VTabs v-model="tab">
    <VTab value="personal-info">
      Personal Info
    </VTab>
    <VTab value="account-details">
      Account Details
    </VTab>
    <VTab value="social-links">
      Social Links
    </VTab>
  </VTabs>

  <VCard flat>
    <VCardText>
      <VWindow
        v-model="tab"
        class="disable-tab-transition"
      >
        <VWindowItem value="personal-info">
          <VForm class="mt-2">
            <VRow>
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="firstName"
                  label="First name"
                  placeholder="John"
                />
              </VCol>

              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="lastName"
                  label="Last name"
                  placeholder="Doe"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="country"
                  :items="countryList"
                  label="Country"
                  placeholder="Select Country"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="languages"
                  :items="languageList"
                  multiple
                  chips
                  clearable
                  label="Language"
                  placeholder="Select Language"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppDateTimePicker
                  v-model="birthDate"
                  label="Birth Date"
                  placeholder="Select Birth Date"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="phoneNo"
                  type="number"
                  label="Phone No."
                  placeholder="+1 123 456 7890"
                />
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem value="account-details">
          <VForm class="mt-2">
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="username"
                  label="Username"
                  placeholder="Johndoe"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="email"
                  label="Email"
                  suffix="@example.com"
                  placeholder="johndoe@email.com"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="cPassword"
                  label="Confirm Password"
                  autocomplete="confirm-password"
                  placeholder="············"
                  :type="isCPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isCPasswordVisible = !isCPasswordVisible"
                />
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem value="social-links">
          <VForm class="mt-2">
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="twitterLink"
                  label="Twitter"
                  placeholder="https://twitter.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="facebookLink"
                  label="Facebook"
                  placeholder="https://facebook.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="googlePlusLink"
                  label="Google+"
                  placeholder="https://plus.google.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="linkedInLink"
                  label="LinkedIn"
                  placeholder="https://linkedin.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="instagramLink"
                  label="Instagram"
                  placeholder="https://instagram.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="quoraLink"
                  label="Quora"
                  placeholder="https://quora.com/username"
                />
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>
      </VWindow>
    </VCardText>

    <VDivider />

    <VCardText class="d-flex gap-4">
      <VBtn>Submit</VBtn>
      <VBtn
        color="secondary"
        variant="tonal"
      >
        Cancel
      </VBtn>
    </VCardText>
  </VCard>
</template>
`,js:`<script setup>
const tab = ref('personal-info')
const firstName = ref('')
const lastName = ref('')
const country = ref()
const birthDate = ref('')
const phoneNo = ref()

const countryList = [
  'USA',
  'Canada',
  'UK',
  'Denmark',
  'Germany',
  'Iceland',
  'Israel',
  'Mexico',
]

const languageList = [
  'English',
  'German',
  'French',
  'Spanish',
  'Portuguese',
  'Russian',
  'Korean',
]

const username = ref('')
const email = ref('')
const password = ref('')
const cPassword = ref('')
const twitterLink = ref('')
const facebookLink = ref('')
const googlePlusLink = ref('')
const linkedInLink = ref('')
const instagramLink = ref('')
const quoraLink = ref('')
const languages = ref([])
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)
<\/script>

<template>
  <VTabs v-model="tab">
    <VTab value="personal-info">
      Personal Info
    </VTab>
    <VTab value="account-details">
      Account Details
    </VTab>
    <VTab value="social-links">
      Social Links
    </VTab>
  </VTabs>

  <VCard flat>
    <VCardText>
      <VWindow
        v-model="tab"
        class="disable-tab-transition"
      >
        <VWindowItem value="personal-info">
          <VForm class="mt-2">
            <VRow>
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="firstName"
                  label="First name"
                  placeholder="John"
                />
              </VCol>

              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="lastName"
                  label="Last name"
                  placeholder="Doe"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="country"
                  :items="countryList"
                  label="Country"
                  placeholder="Select Country"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="languages"
                  :items="languageList"
                  multiple
                  chips
                  clearable
                  label="Language"
                  placeholder="Select Language"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppDateTimePicker
                  v-model="birthDate"
                  label="Birth Date"
                  placeholder="Select Birth Date"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="phoneNo"
                  type="number"
                  label="Phone No."
                  placeholder="+1 123 456 7890"
                />
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem value="account-details">
          <VForm class="mt-2">
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="username"
                  label="Username"
                  placeholder="Johndoe"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="email"
                  label="Email"
                  suffix="@example.com"
                  placeholder="johndoe@email.com"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="cPassword"
                  label="Confirm Password"
                  autocomplete="confirm-password"
                  placeholder="············"
                  :type="isCPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isCPasswordVisible = !isCPasswordVisible"
                />
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem value="social-links">
          <VForm class="mt-2">
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="twitterLink"
                  label="Twitter"
                  placeholder="https://twitter.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="facebookLink"
                  label="Facebook"
                  placeholder="https://facebook.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="googlePlusLink"
                  label="Google+"
                  placeholder="https://plus.google.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="linkedInLink"
                  label="LinkedIn"
                  placeholder="https://linkedin.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="instagramLink"
                  label="Instagram"
                  placeholder="https://instagram.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="quoraLink"
                  label="Quora"
                  placeholder="https://quora.com/username"
                />
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>
      </VWindow>
    </VCardText>

    <VDivider />

    <VCardText class="d-flex gap-4">
      <VBtn>Submit</VBtn>
      <VBtn
        color="secondary"
        variant="tonal"
      >
        Cancel
      </VBtn>
    </VCardText>
  </VCard>
</template>
`},qe={ts:`<script lang="ts" setup>
const firstName = ref('')
const email = ref('')
const mobile = ref<number>()
const password = ref<string>()
const checkbox = ref(false)
<\/script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 First Name -->
          <VCol
            cols="12"
            md="3"
          >
            <label for="firstName">First Name</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="firstName"
              v-model="firstName"
              placeholder="John"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 Email -->
          <VCol
            cols="12"
            md="3"
          >
            <label for="email">Email</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="email"
              v-model="email"
              placeholder="johndoe@email.com"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 Mobile -->
          <VCol
            cols="12"
            md="3"
          >
            <label for="mobile">Mobile</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="mobile"
              v-model="mobile"
              type="number"
              placeholder="+1 123 456 7890"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 Password -->
          <VCol
            cols="12"
            md="3"
          >
            <label for="password">Password</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="password"
              v-model="password"
              autocomplete="on"
              type="password"
              placeholder="············"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Remember me -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          />
          <VCol
            cols="12"
            md="9"
          >
            <VCheckbox
              v-model="checkbox"
              label="Remember me"
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 submit and reset button -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          />
          <VCol
            cols="12"
            md="9"
          >
            <VBtn
              type="submit"
              class="me-4"
            >
              Submit
            </VBtn>
            <VBtn
              color="secondary"
              variant="tonal"
              type="reset"
            >
              Reset
            </VBtn>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </VForm>
</template>
`,js:`<script setup>
const firstName = ref('')
const email = ref('')
const mobile = ref()
const password = ref()
const checkbox = ref(false)
<\/script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 First Name -->
          <VCol
            cols="12"
            md="3"
          >
            <label for="firstName">First Name</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="firstName"
              v-model="firstName"
              placeholder="John"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 Email -->
          <VCol
            cols="12"
            md="3"
          >
            <label for="email">Email</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="email"
              v-model="email"
              placeholder="johndoe@email.com"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 Mobile -->
          <VCol
            cols="12"
            md="3"
          >
            <label for="mobile">Mobile</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="mobile"
              v-model="mobile"
              type="number"
              placeholder="+1 123 456 7890"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 Password -->
          <VCol
            cols="12"
            md="3"
          >
            <label for="password">Password</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="password"
              v-model="password"
              autocomplete="on"
              type="password"
              placeholder="············"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Remember me -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          />
          <VCol
            cols="12"
            md="9"
          >
            <VCheckbox
              v-model="checkbox"
              label="Remember me"
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 submit and reset button -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          />
          <VCol
            cols="12"
            md="9"
          >
            <VBtn
              type="submit"
              class="me-4"
            >
              Submit
            </VBtn>
            <VBtn
              color="secondary"
              variant="tonal"
              type="reset"
            >
              Reset
            </VBtn>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </VForm>
</template>
`},He={ts:`<script lang="ts" setup>
const firstName = ref('')
const email = ref('')
const mobile = ref<number>()
const password = ref<string>()
const checkbox = ref(false)
<\/script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <!-- 👉 First Name -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          >
            <label for="firstNameHorizontalIcons">First Name</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="firstNameHorizontalIcons"
              v-model="firstName"
              prepend-inner-icon="ri-user-line"
              placeholder="John"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Email -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          >
            <label for="emailHorizontalIcons">Email</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="emailHorizontalIcons"
              v-model="email"
              prepend-inner-icon="ri-mail-line"
              placeholder="johndoe@email.com"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Mobile -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          >
            <label for="mobileHorizontalIcons">Mobile</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="mobileHorizontalIcons"
              v-model="mobile"
              type="number"
              prepend-inner-icon="ri-smartphone-line"
              placeholder="+1 123 456 7890"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Password -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          >
            <label for="passwordHorizontalIcons">Password</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="passwordHorizontalIcons"
              v-model="password"
              prepend-inner-icon="ri-lock-line"
              autocomplete="on"
              type="password"
              placeholder="············"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Checkbox -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          />
          <VCol
            cols="12"
            md="9"
          >
            <VCheckbox
              v-model="checkbox"
              label="Remember me"
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 submit and reset button -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          />
          <VCol
            cols="12"
            md="9"
          >
            <VBtn
              type="submit"
              class="me-4"
            >
              Submit
            </VBtn>
            <VBtn
              color="secondary"
              variant="tonal"
              type="reset"
            >
              Reset
            </VBtn>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </VForm>
</template>
`,js:`<script setup>
const firstName = ref('')
const email = ref('')
const mobile = ref()
const password = ref()
const checkbox = ref(false)
<\/script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <!-- 👉 First Name -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          >
            <label for="firstNameHorizontalIcons">First Name</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="firstNameHorizontalIcons"
              v-model="firstName"
              prepend-inner-icon="ri-user-line"
              placeholder="John"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Email -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          >
            <label for="emailHorizontalIcons">Email</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="emailHorizontalIcons"
              v-model="email"
              prepend-inner-icon="ri-mail-line"
              placeholder="johndoe@email.com"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Mobile -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          >
            <label for="mobileHorizontalIcons">Mobile</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="mobileHorizontalIcons"
              v-model="mobile"
              type="number"
              prepend-inner-icon="ri-smartphone-line"
              placeholder="+1 123 456 7890"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Password -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          >
            <label for="passwordHorizontalIcons">Password</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="passwordHorizontalIcons"
              v-model="password"
              prepend-inner-icon="ri-lock-line"
              autocomplete="on"
              type="password"
              placeholder="············"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Checkbox -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          />
          <VCol
            cols="12"
            md="9"
          >
            <VCheckbox
              v-model="checkbox"
              label="Remember me"
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 submit and reset button -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          />
          <VCol
            cols="12"
            md="9"
          >
            <VBtn
              type="submit"
              class="me-4"
            >
              Submit
            </VBtn>
            <VBtn
              color="secondary"
              variant="tonal"
              type="reset"
            >
              Reset
            </VBtn>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </VForm>
</template>
`},Je={ts:`<script lang="ts" setup>
const firstName = ref('')
const lastName = ref('')
const city = ref('')
const country = ref('')
const company = ref('')
const email = ref('')
const checkbox = ref(false)
<\/script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <!-- 👉 First Name -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="firstName"
          label="First Name"
          placeholder="John"
        />
      </VCol>

      <!-- 👉 Last Name -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="lastName"
          label="Last Name"
          placeholder="Doe"
        />
      </VCol>

      <!-- 👉 Email -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="email"
          label="Email"
          placeholder="johndoe@email.com"
        />
      </VCol>

      <!-- 👉 City -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="city"
          label="City"
          placeholder="New York"
        />
      </VCol>

      <!-- 👉 Country -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="country"
          label="Country"
          placeholder="United States"
        />
      </VCol>

      <!-- 👉 Company -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="company"
          label="Company"
          placeholder="Pixinvent"
        />
      </VCol>

      <!-- 👉 Remember me -->
      <VCol cols="12">
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <VBtn type="submit">
          Submit
        </VBtn>

        <VBtn
          type="reset"
          color="secondary"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,js:`<script setup>
const firstName = ref('')
const lastName = ref('')
const city = ref('')
const country = ref('')
const company = ref('')
const email = ref('')
const checkbox = ref(false)
<\/script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <!-- 👉 First Name -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="firstName"
          label="First Name"
          placeholder="John"
        />
      </VCol>

      <!-- 👉 Last Name -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="lastName"
          label="Last Name"
          placeholder="Doe"
        />
      </VCol>

      <!-- 👉 Email -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="email"
          label="Email"
          placeholder="johndoe@email.com"
        />
      </VCol>

      <!-- 👉 City -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="city"
          label="City"
          placeholder="New York"
        />
      </VCol>

      <!-- 👉 Country -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="country"
          label="Country"
          placeholder="United States"
        />
      </VCol>

      <!-- 👉 Company -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="company"
          label="Company"
          placeholder="Pixinvent"
        />
      </VCol>

      <!-- 👉 Remember me -->
      <VCol cols="12">
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <VBtn type="submit">
          Submit
        </VBtn>

        <VBtn
          type="reset"
          color="secondary"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`},We={ts:`<script lang="ts" setup>
const firstName = ref('')
const email = ref('')
const mobile = ref('')
const password = ref<string>()
const checkbox = ref(false)
<\/script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <VCol cols="12">
        <VTextField
          v-model="firstName"
          label="First Name"
          placeholder="John"
        />
      </VCol>

      <VCol cols="12">
        <VTextField
          v-model="email"
          label="Email"
          type="email"
          placeholder="johndoe@example.com"
        />
      </VCol>

      <VCol cols="12">
        <VTextField
          v-model="mobile"
          label="Mobile"
          placeholder="+1 123 456 7890"
          type="number"
        />
      </VCol>

      <VCol cols="12">
        <VTextField
          v-model="password"
          label="Password"
          autocomplete="on"
          type="password"
          placeholder="············"
        />
      </VCol>

      <VCol cols="12">
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <VBtn type="submit">
          Submit
        </VBtn>

        <VBtn
          type="reset"
          color="secondary"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,js:`<script setup>
const firstName = ref('')
const email = ref('')
const mobile = ref('')
const password = ref()
const checkbox = ref(false)
<\/script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <VCol cols="12">
        <VTextField
          v-model="firstName"
          label="First Name"
          placeholder="John"
        />
      </VCol>

      <VCol cols="12">
        <VTextField
          v-model="email"
          label="Email"
          type="email"
          placeholder="johndoe@example.com"
        />
      </VCol>

      <VCol cols="12">
        <VTextField
          v-model="mobile"
          label="Mobile"
          placeholder="+1 123 456 7890"
          type="number"
        />
      </VCol>

      <VCol cols="12">
        <VTextField
          v-model="password"
          label="Password"
          autocomplete="on"
          type="password"
          placeholder="············"
        />
      </VCol>

      <VCol cols="12">
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <VBtn type="submit">
          Submit
        </VBtn>

        <VBtn
          type="reset"
          color="secondary"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`},$e={ts:`<script lang="ts" setup>
const firstName = ref('')
const email = ref('')
const mobile = ref('')
const password = ref<string>()
const checkbox = ref(false)
<\/script>

<template>
  <VForm @submit.prevent>
    <VRow>
      <VCol cols="12">
        <VTextField
          v-model="firstName"
          prepend-inner-icon="ri-user-line"
          label="First Name"
          placeholder="John"
        />
      </VCol>

      <VCol cols="12">
        <VTextField
          v-model="email"
          prepend-inner-icon="ri-mail-line"
          label="Email"
          type="email"
          placeholder="johndoe@example.com"
        />
      </VCol>

      <VCol cols="12">
        <VTextField
          v-model="mobile"
          prepend-inner-icon="ri-smartphone-line"
          label="Mobile"
          placeholder="+1 123 456 7890"
        />
      </VCol>

      <VCol cols="12">
        <VTextField
          v-model="password"
          prepend-inner-icon="ri-lock-line"
          label="Password"
          autocomplete="on"
          type="password"
          placeholder="············"
        />
      </VCol>

      <VCol cols="12">
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <VCol cols="12">
        <VBtn
          type="submit"
          class="me-4"
        >
          Submit
        </VBtn>

        <VBtn
          color="secondary"
          type="reset"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,js:`<script setup>
const firstName = ref('')
const email = ref('')
const mobile = ref('')
const password = ref()
const checkbox = ref(false)
<\/script>

<template>
  <VForm @submit.prevent>
    <VRow>
      <VCol cols="12">
        <VTextField
          v-model="firstName"
          prepend-inner-icon="ri-user-line"
          label="First Name"
          placeholder="John"
        />
      </VCol>

      <VCol cols="12">
        <VTextField
          v-model="email"
          prepend-inner-icon="ri-mail-line"
          label="Email"
          type="email"
          placeholder="johndoe@example.com"
        />
      </VCol>

      <VCol cols="12">
        <VTextField
          v-model="mobile"
          prepend-inner-icon="ri-smartphone-line"
          label="Mobile"
          placeholder="+1 123 456 7890"
        />
      </VCol>

      <VCol cols="12">
        <VTextField
          v-model="password"
          prepend-inner-icon="ri-lock-line"
          label="Password"
          autocomplete="on"
          type="password"
          placeholder="············"
        />
      </VCol>

      <VCol cols="12">
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <VCol cols="12">
        <VBtn
          type="submit"
          class="me-4"
        >
          Submit
        </VBtn>

        <VBtn
          color="secondary"
          type="reset"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`},ol={__name:"form-layouts",setup(k){return(b,f)=>{const n=Ee,p=xe,d=Ae,x=Be,o=De,t=Se,r=Pe,w=Ue,I=Ie,U=Le,P=Re;return h(),M("div",null,[e(v,null,{default:l(()=>[e(a,{cols:"12",md:"6"},{default:l(()=>[e(p,{title:"Horizontal Form",code:s(qe)},{default:l(()=>[e(n)]),_:1},8,["code"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(p,{title:"Horizontal Form with Icons",code:s(He)},{default:l(()=>[e(d)]),_:1},8,["code"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(p,{title:"Vertical Form",code:s(We)},{default:l(()=>[e(x)]),_:1},8,["code"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(p,{title:"Vertical Form with Icons",code:s($e)},{default:l(()=>[e(o)]),_:1},8,["code"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[e(p,{title:"Multiple Column",code:s(Je)},{default:l(()=>[e(t)]),_:1},8,["code"])]),_:1})]),_:1}),e(v,{class:"match-height my-3"},{default:l(()=>[e(a,{cols:"12",md:"6"},{default:l(()=>[e(p,{title:"Form Hint",code:s(ze)},{default:l(()=>[e(r)]),_:1},8,["code"])]),_:1}),e(a,{cols:"12",md:"6"},{default:l(()=>[e(p,{title:"Form Validation",code:s(Me)},{default:l(()=>[e(w)]),_:1},8,["code"])]),_:1})]),_:1}),e(v,null,{default:l(()=>[e(a,{cols:"12"},{default:l(()=>[e(p,{title:"Form with Tabs","no-padding":"",code:s(je)},{default:l(()=>[e(I)]),_:1},8,["code"])]),_:1}),e(a,{cols:"12"},{default:l(()=>[f[0]||(f[0]=c("h4",{class:"text-h6 font-weight-medium mb-5"}," Collapsible Section ",-1)),e(U)]),_:1,__:[0]}),e(a,{cols:"12"},{default:l(()=>[f[1]||(f[1]=c("h4",{class:"text-h6 font-weight-medium mb-5"}," Sticky Section ",-1)),e(P)]),_:1,__:[1]})]),_:1})])}}};export{ol as default};
