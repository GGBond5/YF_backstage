<template>
	<div :id="id" class="sk-echart-contain"></div>
</template>

<script>
	export default {
		name:"YfEcharts",
		data(){
			return {
				myChart:null
			}
		},
		props:{
			id:{
				type:String,
				default:"sk-echart-main"
			},
			loading:{
				type:Boolean,
				default:false
			},
			options:{		//传echarts的options配置项
				type:Object,
				default(){
					return {
						title:{text:""},
						tooltip:{},
						xAxis:{},
						series:[]
					}
				}
			}
		},
		watch:{
			options:{		//当options发生改变时，重新渲染echarts图
				deep:true,
				handler(){
					this.$nextTick(function(){
						this.render();
					});
				}
			}
		},
		mounted(){
			let vm = this;
			vm.$nextTick(function(){
				vm.render();
			})
			window.addEventListener("resize", () => {
				vm.resize();
			});
		},
		methods:{
			render(){		//渲染echarts图，分为第一次渲染被调用和后续数据更新后被调用
				let vm = this,firstRender = true;
				if(vm.myChart){			//判断是否已存在echarts图，存在则销毁，不存在则初始化新的echarts图
					firstRender = false;
					vm.myChart.clear();
				}else{
					vm.myChart = vm.$echarts.init(document.getElementById(vm.id),{},{locale:'ZH'})
				}
				vm.myChart.setOption(vm.options);		//渲染echarts
				if(firstRender){		//只有第一次创建echarts图时监听以下事件
					vm.myChart.getZr().on("mouseup",function(evt){		//监听“空白处”的事件
						if(evt.target&&evt.target.cursor ==="ew-resize"){
							vm.$emit("dragEnd",evt);
						}
					});
					vm.myChart.on("dataZoom",function(zoom){		//数据区域缩放时触发
						vm.$emit("dataZoom",zoom);
					});
					vm.myChart.on("legendselectchanged",function(data){			//切换图例开关时触发
						vm.$emit("legendselectchanged",data);
					});
				}
			},
			setOption(obj){
				if(this.myChart)this.myChart.setOption(obj);
			},
			showLoading(){
				if(this.myChart){
					this.myChart.showLoading({			//实现加载中效果
						text : '加载中...',
						color:"#00ddff",
						textColor: '#ffffff',
						maskColor : 'transparent' 
					});
				}
			},
			hideLoading(){				
				if(this.myChart){
					this.myChart.hideLoading();			
				}
			},
			resize(){
				if(this.myChart){
					if(this.loading&&!this.$store.state.dlgShow)return false;
					this.$nextTick(function(){
						this.myChart.resize();
					})
				}
			},
			exportChart(file){
				if(this.myChart){
					let params = {
						type: "png",
						backgroundColor:"#060b21"
					};
					if(file)Object.assign(params,file); 
					let dataUrl = this.myChart.getDataURL(params);
					//console.log(dataUrl);
					let aTag = document.createElement("a");
					aTag.href = dataUrl;
					aTag.download = (file&&file.name?file.name:("trend_"+this.$moment().valueOf()))+".png";
					document.body.appendChild(aTag);
					aTag.click();
					document.body.removeChild(aTag);
				}
			}
		},
		beforeDestroy() {
			if(this.myChart)this.myChart.clear();
		}
	}
</script>

<style scoped>
	.sk-echart-contain{
		width:100%;
		height:100%;
	}
</style>
