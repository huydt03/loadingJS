// @require DrhuyJs
// @require car.png
// @require wheel.png
// @return 
// 	show: function
// 	hide: function
// 	to: function(percent)
let Loading = (function(){

	let self = new Drhuy.EventHandle([
		'onShow', 'onHide', 'onTo'
	]);

	Drhuy.onStartAjax = function(){
		self.to(0);
	}

	Drhuy.onAfterAjax = function(status){
		self.to(100*(status.nAction+1)/status.nTotal);
	}

	let fRolling = 0.3;

	// add style
	document.write(`<style type="text/css">
	.loading{
		position: fixed;
		width: 100%;
		bottom: 0px;
		z-index: 9999;
	}

	.loading-Car{
		width: 40px;
		height: 22px;
		position: relative;
		z-index: 1;
		left: 0px;
		transition: left .5s;
	}
	.loading-Car-rolling{
		animation: car-rolling ${fRolling}s;
	}
	.loading-Car-Body{
		width: 100%;
		height: auto;
		animation: car-body-rolling .3s infinite;
	}
	.loading-Car-Wheel{
		position: absolute;
		top: 14px;
		width: 10px;
	}
	.loading-Car-Wheel-Front{
		left: 27px;
	}
	.loading-Car-Wheel-Back{
		left: 4px;
	}
	.loading-Car-Wheel-rolling{
		animation: car-wheel-rolling .1s infinite;
	}
	.loading-Road{
		position: absolute;
	    width: 100%;
	    height: 40%;
	    background-color: #e0e0e0;
	    bottom: -14%;
	    z-index: 0;
	    border: 1px solid gray;
	    border-left: 0px;
	    border-right: 0px;
	    transition: width .5s;
	}

	@keyframes car-rolling{
		0% {transform: rotate(0deg);}
		10% {transform: rotate(0deg);}
		40% {transform: rotate(30deg);}
		45% {transform: rotate(33deg);}
		50% {transform: rotate(36deg);}
		60% {transform: rotate(20deg);}
		100% {transform: rotate(0deg);}
	}

	@keyframes car-body-rolling{
		0% {height: 95%}
		100% {height: 100%}
	}

	@keyframes car-wheel-rolling{
		100% {transform: rotate(360deg)}
	}	
	</style>`);
	const PER_CAR_ROLLING = 10;

	const CLASS_CAR_ROLLING = 'loading-Car-rolling'

	let curPercent = 0;

	let car = Drhuy.fastCreateElement(`class=loading-Car`,[
				['img', 'src=car.png'],
				['img', 'src=wheel.png|class=loading-Car-Wheel loading-Car-Wheel-Front loading-Car-Wheel-rolling'],
				['img', 'src=wheel.png|class=loading-Car-Wheel loading-Car-Wheel-Back loading-Car-Wheel-rolling'],
			]);

	let road1 = Drhuy.fastCreateElement('class=loading-Road bg-info');

	let el = Drhuy.fastCreateElement('class=loading',[car, ['class=loading-Road'], road1]);

	let car_width;

	let autoScroll = null;

	self.to = async function(percent = 0){
		self.show();
		car.style.left = `${percent}%`;
		road1.style.width = `${percent}%`;
		if(percent == 100)
			car.style.left = `calc(${percent}% - ${car_width}px)`;
		let random_rolling = Math.random()*PER_CAR_ROLLING + PER_CAR_ROLLING;
		if((percent - curPercent) > random_rolling)
			car.classList.add(CLASS_CAR_ROLLING)
		else
			car.classList.remove(CLASS_CAR_ROLLING)
		curPercent = percent;
		self.fire('onTo', percent);

		if(autoScroll)
			clearInterval(autoScroll);
		autoScroll = setInterval(function(){self.to(percent+= 0.1)}, 100);

		if(percent >= 100){
			clearInterval(autoScroll);
			await setTimeout(self.hide, fRolling*1000)
		}
	}

	self.show = function(){
		document.getElementsByTagName('body')[0].appendChild(el);
		car_width = car.clientWidth;
		self.fire('onShow', el);
	}

	self.hide = function(){
		el.remove();
		self.fire('onHide', el);
	}
	
	return self; 
})();
