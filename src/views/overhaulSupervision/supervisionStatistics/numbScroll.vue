<template>
  <div class="work flex-vCenter" :class="{work2: type!=1}">
    <div class="item" v-if="long>=9">
      <span class="flex-center">{{numbArrNew[0]}}</span>
    </div>
    <div class="item" v-if="long>=8">
      <span class="flex-center">{{numbArrNew[1]}}</span>
    </div>
    <div class="item" v-if="long>=7">
      <span class="flex-center">{{numbArrNew[2]}}</span>
    </div>
    <div class="dor1" v-if="long>=7&&type==1">，</div>
    <div class="item" v-if="long>=6">
      <span class="flex-center">{{numbArrNew[3]}}</span>
    </div>
    <div class="item" v-if="long>=5">
      <span class="flex-center">{{numbArrNew[4]}}</span>
    </div>
    <div class="item" v-if="long>=4">
      <span class="flex-center">{{numbArrNew[5]}}</span>
    </div>
    <div class="dor1" v-if="long>=4&&type==1">，</div>
    <div class="item" v-if="long>=3">
      <span class="flex-center">{{numbArrNew[6]}}</span>
    </div>
    <div class="item" v-if="long>=2">
      <span class="flex-center">{{numbArrNew[7]}}</span>
    </div>
    <div class="item" v-if="long>=1">
      <span class="flex-center">{{numbArrNew[8]}}</span>
    </div>
    <div class="dor" v-if="precision>=1"></div>
    <div class="item" v-if="precision>=1">
      <span class="flex-center">{{numbArrNew[9]}}</span>
    </div>
    <div class="item" v-if="precision>=2">
      <span class="flex-center">{{numbArrNew[10]}}</span>
    </div>
    <div class="unit" v-if="unit">{{unit}}</div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      numb: this.value,
      numbArr: [0,0,0,0,0,0,0,0,0,0,0],
      numbArrNew: [0,0,0,0,0,0,0,0,0,0,0]
    }
  },
  props: {
    type: { type: Number, default: 1 },
    value: { type: Number, default: 0 },
    long: { type: Number, default: 0 },
    precision: { type: Number, default: 0 },
    unit: String
  },
  computed: {},
  watch:{
    'value': function(newValue){
      this.numb = newValue
      console.log(newValue)
    },
    'numb': function(newValue){
      this.splitNumb(newValue)
    }
  },
  created(){},
  mounted(){
    console.log(this.numb)
    this.splitNumb(this.numb)
    // this.timer = setInterval(()=>{
    //   if(this.precision){
    //     this.numb = this.numb + parseFloat(Math.random().toFixed(2))
    //   }else{
    //     this.numb = this.numb + parseInt(Math.random()*10)
    //   }
    //   // console.log(this.numb)
    // },2000)
  },
  methods: {
    splitNumb: function(numb){
      let _numbArrNew = [0,0,0,0,0,0,0,0,0,0,0]
      if(this.precision){
        let numbStr1 = numb.toFixed(2).split('.')
        let decimal = numbStr1[1].split('').reverse()
        decimal.forEach((item,index)=>{
          _numbArrNew[10-index] = parseInt(item)
        })
        let integer = numbStr1[0].split('').reverse()
        integer.forEach((item,index)=>{
          _numbArrNew[8-index] = parseInt(item)
        })
      }else{
        let integer = numb.toString().split('').reverse()
        integer.forEach((item,index)=>{                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
          _numbArrNew[8-index] = parseInt(item)
        })
      }
      this.numbArrNew = _numbArrNew
    },
  },
  beforeDestroy() {
    if(this.timer){clearInterval(this.timer)}
  }
};
</script>
 
<style scoped>
.work{width: 100%;height: 100%;padding: 9px 0;}
.item{width: 38px;height: 52px;position: relative;overflow: hidden;margin: 0 6px;box-shadow: 0px 0px 10px rgba(153, 153, 153, 0.35);border-radius: 5px;}
.item span{width: 100%;height: 100%;font-size: 40px;color: #454545;font-family: 'Alternate';justify-content: center;}
.dor{width: 6px;height: 6px;overflow: hidden;border-radius: 100%;background: #454545;margin-top: 40px;}
.dor1{font-size: 34px;color: #454545;font-family: 'Alternate';width: 10px;overflow: hidden;margin: 14px 0 0 -4px;}
.unit{font-size: 18px;color: #454545;font-weight: bold;margin: 25px 0 0 5px;}
</style>