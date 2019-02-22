//获取当前时间
function setNowTime() {
    let yearEle = document.querySelector(".top .year");
    let monthEle = document.querySelector(".top .month");
    let todayEle = document.querySelector(".top .today");
    let hoursEle = document.querySelector(".top .you .time .hours");
    let minutesEle = document.querySelector(".top .you .time .minutes");
    let secondsEle = document.querySelector(".top .you .time .seconds");
    set();
    setInterval(set, 1000);
	//设置当前时间
    function set() {
        let nowTime = new Date();
        let year = nowTime.getFullYear();
        let month = nowTime.getMonth() + 1;
        let today = nowTime.getDate();
        let hours = nowTime.getHours();
        let minutes = nowTime.getMinutes();
        let seconds = nowTime.getSeconds();
        yearEle.innerText = year;
        monthEle.innerText = month;
        todayEle.innerText = today;
        hoursEle.innerText = zero(hours);
        minutesEle.innerText =zero(minutes);
        secondsEle.innerText = zero(seconds);
    }
}
//补0
function zero(nums) {
    return nums >= 10 ? nums : "0" + nums;
}
setNowTime();


//设备警告轮播
let leftn = 0;
let lefttime;
function lstart() {
    lefttime = setInterval(function () {
        leftn++;
        if(leftn === 110){
            leftn = 0
        }
        $(".box1").css("top",-leftn)

    },100)
}
function lstop(){
    clearInterval(lefttime)
}
lstart();
$(".bigbox1").hover(lstop,lstart);

//车辆轮播
let centern = 0;
let centertime;
function cstart() {
    centertime = setInterval(function () {
        centern++;
        if(centern === 580){
            centern = 0
        }
        $(".bottom .center .Cbottom ul").css("left",-centern)

    },100)
}
function cstop(){
    clearInterval(centertime)
}
cstart();
$(".bottom .center .Cbottom").hover(cstop,cstart);

//昨日运营情况轮播
let rightN = 0;
let rightTime;
function rstart() {
    rightTime = setInterval(function () {
        rightN++;
        if(rightN === 110){
            rightN = 0
        }
        $(".bottom .right .Ybottom .box2 ul").css("top",-rightN);
    },100)
}
function rstop(){
    clearInterval(rightTime);
}
rstart();
$(".bottom .right .Ybottom .box2").hover(rstop,rstart);





let BaASE_URL = "http://show.maiboparking.com"
//每一个模块的地址信息
let config = {
	todayIncorme:BaASE_URL+"/index/platform/income_comparison",
	stopLength:BaASE_URL+"/index/platform/parking_length",
	getAllPark:BaASE_URL+"/index/platform/get_country_parking",//获取所有停车场的信息
	getOneParkInfo: BaASE_URL + "/index/platform/get_parking_info",  //获取某个停车场的详细信息
	getWarning: BaASE_URL + "/index/platform/device_warning" //获取设备警告信息
}
let updataTime = 2000;
let stop = {
	//今日收入
	todayIncorme:function(){
		let oldData = {
			"code":1,
			"data":{
				"t_number":"960,712", //今日收入
				"y_number":682620,    //昨日收入
				"ratio":"0.94"        ,//同比昨日(%) 
			}
		}                       //旧数据
		render();
		setInterval(render,updataTime);
		function render(){
			$.ajax({
				url:config["todayIncorme"],
				success:function(data){
					if(data.code===1){
						setPage(data.data);
					}else{
						setPage(oldData)
					}
				},
				error:function(){
					setPage(oldData.data)
				}
			});
		}
		function setPage(data){
			$(".bottom .left .Ztop .LEFT .title2").text(data["t_number"]);
			$(".bottom .left .Ztop .RIGHT .title4").text(data.ratio);
			if(data.ratio>=0){
				$(".bottom .left .Ztop .RIGHT img").attr("src","img/up.png");
			}else{
				$(".bottom .left .Ztop .RIGHT img").attr("src","img/down.png");
			}
		}
		return this;
	},
	//停车时长
	stopLength:function(){
		let pipBox = $(".bottom .left .Zcenter .biao1box");
		let myEcharts = echarts.init(pipBox[0]);
		let oldData = {
			"code":1,
			"data":[
				{"name":"30分钟以内","total":8640,"ratio":16.69},
				{"name":"30-60分钟","total":6420,"ratio":12.4},
				{"name":"1-2小时","total":13200,"ratio":25.49},
				{"name":"2-4小时","total":15810,"ratio":30.53},
				{"name":"4小时以上","total":7710,"ratio":14.89}
			]
		};
		let option = {
			color:[
				'green',
				'yellow',
				'red',
				'purple',
				'blue'
			],
			tooltip: {
				trigger: 'item',
				formatter: "时长:{b} <br/>总计:{c} <br/>占比:{d}"
			},
			series: [
				{
					name:'访问来源',
					type:'pie',
					radius: ['50%', '70%'],
					avoidLabelOverlap: false,
					label: {
						normal: {
							show: true,
							position: 'outside',
							fontSize:14
						},
						emphasis: {
							show: true,
							textStyle: {
								fontSize: 14
							}
						}
					},
					labelLine: {
						normal: {
							show: true
						}
					},
					data:getData(oldData)
				}
			]
		}
		myEcharts.setOption(option);
		//把数据格式转化成需要设置的结构
		function getData(data){
			let d = [];
			data.data.forEach(function(val){
				d.push({
					name:val.name,
					value:val.total
				})
			})
			return d;
		}
		render();
		setInterval(render,updataTime);
		function render(){
			$.ajax({
				url:config["stopLength"],
				success:function(data){
					if(data.code===1){
						option.series[0].data = getData(data);
					}else{
						option.series[0].data = getData(oldData);
					}
					myEcharts.setOption(option);
				},
				error:function(){
					option.series[0].data = getData(oldData);
					myEcharts.setOption(option);
				}
			});
		}
		return this;
	},
	//地图设置
	map:function(){
		let map = $(".bottom .center .Ctop");
		let myEcharts = echarts.init(map[0]);
		let convertData = function (data) {
			let d = [];
			data.forEach(function(val){
				d.push({
					name:val.name,
					value:[val["baidumap_longitude"]*1,val["baidumap_latitude"]*1,val["park_id"]]
				})
			})
			return d;
		};

		let option = {
			tooltip: {
				triggerOn: "none",
				trigger: 'item',
				//设置提示文本框
				formatter: function (params) {
					return `
						<div style="width:200px;height:200px;background: rgba(0,0,0,0.2);border:1px solid #4affd2; border-radius: 10px;">
							<p style="color:#4affd2;font-size:20px;margin-top:20px;margin-left:20px;">${params.data.name}</p>
							<p style="color:#fff;font-size:14px;margin-top:10px;margin-left:20px;">今日收入</p>
							<p style="color:red;font-size:22px;margin-top:10px;margin-left:50px;">${params.data.info["total_money"]}</p>
							<div style="width:100px;height:50px;background: #18233b;margin: 0 auto;text-align: center;margin-top:10px;">
								<div style="width:50px;height:50px;background: #18233b;border-right: 1px solid #4affd2;float: left;box-sizing: border-box;">
									<div style="width: 49px;font-size: 10px;">总车位</div>
									<div style="width: 49px;color: #4affd2;font-size: 20px;">${params.data.info["total_seat"]}</div>
								</div>
								<div style="width:50px;height:50px;background: #18233b;float: left;">
									<div style="width: 49px;font-size: 10px;">空余</div>
									<div style="width: 49px;color: #4affd2;font-size: 20px;">${params.data.info["surplus_seat"]}</div>
								</div>
							</div>
							<span style="font-size: 12px;margin-left: 30px">本日进场 ${params.data.info["in_number"]}</span>
							<span style="font-size: 12px;">本日出场 ${params.data.info["out_number"]}</span>
						</div>
					`;
				}
			},
			geo: {
				zoom:1.2,
				map: 'china',
				label: {
					emphasis: {
						show: true,
						fontSize:14,
						color:"#ffffff"
					}
				},
				itemStyle: {
					normal: {
						areaColor: '#194e7c',
						borderColor: '#111'
					},
					emphasis: {
						areaColor: '#64bdda'
					}
				}
			},
			series: [
				{	name: 'pm2.5',
					type: 'scatter',
					coordinateSystem: 'geo',
					data:[],					
					symbolSize: 10,
					label: {
						normal: {
							show: false
						},
						emphasis: {
							show: true,
							position:"right",
							formatter:"{b}",
							fontSize:14
						}
					},
					itemStyle: {
						emphasis: {
							borderColor: '#fff',
							borderWidth: 1
						}
					}
				},
				//波纹效果
				{	name: 'Top 5',
					type: 'effectScatter',
					symbolSize: 17,
					coordinateSystem: 'geo',
					data:[],
					showEffectOn: 'render',
					rippleEffect: {
						brushType: 'stroke'
					},
					hoverAnimation: true,
					label: {
						normal: {
							formatter: '{b}',
							position: 'right',
							show: true
						}
					},
					itemStyle: {
						normal: {
							color: '#4affd2',
							shadowBlur: 10,
							shadowColor: '#333'
						}
					},
					zlevel: 1
				}
			]
		}
		myEcharts.setOption(option);
		render();
		//获取数据
		function render() {
			$.ajax({
				url: config["getAllPark"],
				success: function (data) {
					if (data.code === 1) {
						option.series[0].data = convertData(data.data);
						option.series[1].data = [convertData(data.data)[0]];
						myEcharts.setOption(option);
						option.series[0].data.forEach(function (val) {
							$.ajax({
								url: config["getOneParkInfo"],
								data: {
									park_id: val.value[2]
								},
								success: function (data) {
									if (data.code === 1) {
										val.info = data.data;
									}
								}
							});
						});
					}
				}
			});
		}
		let index = 0;
		 //设置波纹自动跳转
		setInterval(function (){

			if(index>option.series[0].data.length-1){
				index = 0;
			}
			 //设置波纹的数据
			option.series[1].data = [option.series[0].data[index]];
			myEcharts.setOption(option);
			 //触发波纹的提示框
			myEcharts.dispatchAction({
				type:"showTip",
                seriesIndex:"1",
                name:option.series[0].data[index].name
			});
			index++;
		},updataTime);
		return this;
	},
	//停车收费排行榜1
	TCSF1:function(){
		let stop1 = $(".bottom .right .Ycenter .biao2box");
		let myEcharts = echarts.init(stop1[0]);
		let option = {
			color:[
				'rgb(255,251,190)',
				'rgb(255,189,61)'
			],
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b}: {c} ({d}%)"
			},
			legend: {
				// orient: 'vertical',
				// top: 'middle',
				bottom: 10,
				left: 'center',
				itemWidth:6,
				data:['现金缴费','电子缴费']
			},
			series: [
				{
					name:'缴费',
					type:'pie',
					radius: ['40%', '60%'],
					avoidLabelOverlap: false,
					label: {
						normal: {
							show: false,
							position: 'center'
						},
						emphasis: {
							show: true,
							textStyle: {
								fontSize: '16',
								fontWeight: '100'
							}
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data:[
						{value:100, name:'现金缴费',selected:true},
						{value:1000, name:'电子缴费'},
					]
				}
			]
		}
		myEcharts.setOption(option);
		return this;
	},
	//停车收费排行榜2
	TCSF2:function(){
		let stop2 = $(".bottom .right .Ycenter .biao3box");
		let myEcharts = echarts.init(stop2[0]);
		let option = {
			color:[
				'rgb(184,227,255)',
				'rgb(0,156,255)'
			],
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b}: {c} ({d}%)"
			},
			legend: {
				// orient: 'vertical',
				// top: 'middle',
				bottom: 10,
				left: 'center',
				itemWidth:6,
				data:['提前缴费','出口缴费']
			},
			series: [
				{
					name:'缴费',
					type:'pie',
					radius: ['40%', '60%'],
					avoidLabelOverlap: false,
					label: {
						normal: {
							show: false,
							position: 'center'
						},
						emphasis: {
							show: true,
							textStyle: {
								fontSize: '14',
								fontWeight: '100'
							}
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data:[
						{value:100, name:'提前缴费',selected:true},
						{value:1000, name:'出口缴费'},
					]
				}
			]
		}
		myEcharts.setOption(option);
		return this;
	},
	//设备警告
	deviceWarning: function () {
		setInterval(render,updataTime);
		render();
		function render() {
			$.ajax({
				url:config["getWarning"],
				success:function (data) {
					let str = "";
					if(data.code===1){
						data.data.forEach(function (val) {
							str+=`
								<div class="red ${val.status===0?'red':'blue'} style="margin-top:5px;">
									<div class="top1">
										<div class="person">
											<span>&nbsp;&nbsp;${val["status_name"]}&nbsp;&nbsp;</span>
											<span>巡逻人员:${val["patrol_name"]}</span>
										</div>
										<div class="shijian">${val["time"]}</div>
									</div>
									<div class="bottom1">
										<div class="wenzi1">${val["park_name"]}</div>
										<div class="wenzi2">${val["error"]}</div>
									</div>
								</div>
                            `;
						});
					}
					$(".bottom .left .Zbottom .bigbox1 .box1").html(str).html(str);
				}
			});
		}
	}
};
stop.todayIncorme().stopLength().map().TCSF1().TCSF2().deviceWarning();