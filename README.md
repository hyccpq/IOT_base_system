#IoT_project

> 物联网目前最大的价值在于能够充分利用计算机或智能设备的强劲的性能优势来完成一系列对人类有利的智能应用。软硬件的结合，对应现代各种各样智能设备普及加上更聪明的交互方式的实现，这样的物联网产品会越来越多的受到人们的喜爱。可以说物联网是现代各个行业间根据各个行业的特点相互结合出现的产物。
# 绪论(900)
## 物联网背景以及JavaScript开发意义

## 物联网现状

## 论文组织结构

# 相关技术(1500)

## NodeJs

## Websocket

## JhonnyFive

## Vue

## MongoDB

# 系统的分析设计(6000)

## 后台
### 函数式编程形式加载中间件
这里用到ramda函数库，这个库让JavaScript能够拥有近乎完全的函数式编程的能力。Koa加载中间件的过程用传统方式完成会有些麻烦，并且在一些时候会因为加载顺序等一些情况对整个后台产生影响，在这里由于函数式编程能够保证其运行结果的稳定以及大量简洁，所以在这里就用函数式来完成。
```JavaScript
const app = new Koa()
const MIDDLEWARE = ['bodyparser', 'logs', 'router', 'webpack-dev']
const useMiddleware = app => {
	R.map(
		R.compose(
			R.forEachObjIndexed(
				initWith => initWith(app)
			),
			require,
			name => resolve(__dirname, `./middlewares/${name}`)
		)
	)(MIDDLEWARE)
}
useMiddleware(app)
```
其中，这里只需要数组里面存放需要加载中间件的文件名即可，每当每次扩展增加中间件的时候仅仅只需添加一个中间件的文件在这个文件内部来写逻辑，并且在数组中添加上这个中间件即可在执行时候完成加载。原理是先通过R.map遍历取出数组MIDDLEWARE里面需要加载的中间件，然后，compose指的是对函数进行组合，后面的函数的输出作为前一个函数的输入。这里的几个步骤就是先拼接每一个中间件文件路径，然后传递到CMD规范的模块加载函数中，接着对每个中间件内部的子模块进行遍历传入Koa的实例对象，并且执行完成所需全部中间件的加载。


### 子进程
由于JavaScript的历史遗留问题，使得它在不使用一些开源社区的包之类的模块不能进行多线程并行，所以当它多个服务同时运作的时候，一遇上一点问题整个程序都将会崩溃。
所以在这里就把硬件部分的操作放在了子进程里面进行，这样做就能够直接将控制器与服务分离，两者间完全无耦合，硬件控制可自由扩展，并且服务的修改也不需要对控制器进行修改。
JavaScript对多进程的实现方式有多种，在进程不是很多的情况，并且考虑到进程间通信的资源消耗问题。在这里就选择了process.fork()方式建立子进程，fork建立的子进程只能运行node实例，并且在建立的时候会单独建立一个IPC通信通道，能够有效的降低通信间的性能消耗。不过，由于通信通道是有自己的内存以及自己的V8引擎的实例，而且为了保证服务的健壮性，异常也是独立于父进程的，需要额外的内存资源。因为本设计不需要大量的进程，只要确保控制器和服务分离即可，并且需要进行通信，使用fork方式即为最佳。
```JavaScript
import cp from 'child_process'
import { resolve } from 'path'
export default class Child_process {
	constructor (url){
		this.script = resolve(__dirname, url)
		this.child = cp.fork(this.script)
		
		let invoked = false
		
		this.child.on('error', err => {
			if(invoked)return
			invoked = true
			console.log(err)
		})
		
		this.child.on('exit', code => {
			if(invoked)return
			invoked = true
			let err = code === 0 ? null : new Error('exit code' + code)
			console.log(err);
		})
	}
	receive(callback){
		this.child.on('message', callback)
	}
}

```
于是，在这便对子进程部分进行了封装，并且能够让其在遇上错误时候这个子进程能够安全退出，不影响到服务的进行，不会对硬件进行损坏。侦听错误'exit'事件，退出'exit'事件，遇上问题的时候，在日志保存，以便查看改进。建立一个接受子进程发来消息的方法，侦听消息'message'事件，拿到对应回调，进行服务中需要的操作，比如数据库存取，这个就很重要，因为数据库你需要在主进程中初始化，并且有一个统一的管理数据库在程序设计中是更为必要的。这样做能够尽可能的减少不必要的麻烦。
由于本设计中，历史温度需要存取数据库，所以在这里有必要进行进程通信。
```JavaScript
export const createProcess = () => {
	const Temp = mongoose.model('Temperature')
	let process = new Child_process('../controller/initControllers.js')
	
	process.receive(async data => {
		let temp = new Temp({ temperature:data })
		console.log(data)
		await temp.save()
	})
}
```
调用侦听消息'message'事件的方法，传入回调函数，在每一次收到子进程传递来的消息的时候，新建数据库文档，把其放入保存。


### 装饰器模式设计路由
平时设计一个NodeJs的路由步骤会比较繁琐，还好Koa框架给我们对路由进行了封装大部分的实现，并且async和await已经对异步回调进行的相关大的简化，给路由的书写带来了很大的方便。由于本次设计，我把其当成一个产品来设计，追求的是更低的耦合从而实现更加容易的可扩展性。
这个时候，设计模式登场。由于JavaScript的装饰器是新的标准，并且大体上是和Python是类似的，在Python做程序开发的时候经常用到装饰器来进行类或者方法的修饰，用来满足一些特定的功能，而并非继承重载，极大的降低耦合以及代码量的同时也能满足开放封闭原则，那这次的路由就用装饰器模式来完成它吧。
首先，先来分析一下需求，一般在设计这个路由的时候，我们会考虑到后台需要的api，然后是需要怎样的路由，这个路由下面需要哪些子路由，当中还有一些权限验证，登录密码比对等功能。
这次设计中路由较为容易，主要实现系统登录，登录后页面权限的验证，以及温度历史数据api等。为了方便今后扩展将功能进行拆分，每一步每一个功能设计成一个装饰器。
可以设计成一个主路由控制器就对应一个类，用来对这个类进行修饰，子路由就用相应的修饰器来修饰方法，需要进行权限验证等同样也用相应的修饰器对此方法进行修饰，这样一做层次结构就足够鲜明明了了。
```JavaScript
import { controller, get, post, auth, required } from '../lib/decorator'
import { getToken } from '../service/auth'
import { checkPassword } from '../service/admin'

@controller('/api/v0/user')
export class User {
	@post('/login')
	@required({
		body: ['username', 'password']
	})
	async loadControl (ctx, next) {
		
		const { username, password } = ctx.request.body
		console.log(username, password);
		const matchData = await checkPassword(username, password)
		
		if(matchData.match) {	
			ctx.body = {
				username,
				token: getToken(username),
				success: true
			}
		} else {
			ctx.body = {
				success: false,
				errcode: '用户名或者密码不正确'
			}
		}
	}
	@post('/check')
	@auth
	async check (ctx, next) {
		ctx.body = {
			success: true
		}
	}
}
```
这里用到了@controller(), @post(), @auth, @required()等多个修饰器，对应要实现，主路由控制，子路由方式，权限，那些字段是必要的等。
主控制器主要目的就是匹配主路由进入到相应的类中，然后根据相应的请求方法修饰穿透到子路由，比如@get修饰则就是以get方式获得，@post修饰则说明以post方式提交。
接着就是对应装饰器的实现过程。类的装饰器会传入一个target，这个target对应修饰的这个类本身，在接受到相应的路由匹配后，主控制器取得主路由，并且在这个时候把它放到原型上作为一个静态属性以提供访问。
```JavaScript
export const controller = path => target => (target.prototype[symbolPrefix] = path)
```
对方法的装饰器实现起来就稍微复杂一点，对方法修饰的装饰器会传入，需要区分网络请求，对不同的方式进行匹配存储，存储这里就用到ES6的map数据结构。
```JavaScript
const symbolPrefix = Symbol('prefix')
const routerMap = new Map()
const normalizePath = path => path.startsWith('/') ? path : `/${path}`
const router = conf => (target, key, descriptor) => {
	conf.path = normalizePath(conf.path)
	console.log(...conf)
	routerMap.set({
		target: target,
		...conf
	}, target[key])
}

export const get = path => router({
	method: 'get',
	path
})

export const post  = path => router({
	method: 'post',
	path
})
```
然后把路由匹配项都存入map数据结构中，里面用请求方法和路由拼接内容作为建，类里面提取出来的方法为值。往后要做的就是初始化整个路由，在初始化的时候我们需要在构造函数中拿到Koa实例对象app，路径，实例化Koa路由；另外添加个初始化方法，因为装饰器在编译的时候就已经发生，而不在运行的时候，所以在调用这个初始化方法的时候能够加载全部的路由类，拿到里面的各项路由配置。对其进行遍历，就能在这里轻松的进行路径拼接，加载，开始路由事件侦听。
```JavaScript
export class Route {
	constructor(app, apiPath){
		this.app = app
		this.apiPath = apiPath
		this.router = new Router()
	}
	
	init(){
		glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require)
		
		for(let [conf, controller] of routerMap) {
			const controllers = isArray(controller)
			let prefixPath = conf.target[symbolPrefix]
			if(prefixPath) prefixPath = normalizePath(prefixPath)
			const routerPath = prefixPath + conf.path
			this.router[conf.method](routerPath, ...controllers)
		}
		
		this.app.use(this.router.routes())
			.use(this.router.allowedMethods())
	}
}
```
这就完成了路由加载初始化模块的设计。为了安全性剩下的就是对权限的验证了，在路由请求的时候，要把未携带token或者不通过验证的token拦截，防止有人恶意对设备进行控制。这里对需要权限控制的子路由，也就是对应方法上面添加auth装饰器，把比对的中间方法放入到配置项的首项，当编译完成的时候，路由就会先针对这个比对的方法进行判断是否允许其穿透到下一层中去拿到需要的数据。


### webpack开发部分
近年来对于网站网页开发离不开一个叫前端工程化，自动化的话题。现代浏览器的功能越来越强，解释器效率也越来越高，但不能保证所有人都用同样的浏览器，兼容性问题便为前台页面开发者一直都需考虑的首要问题；网页需要通过http请求完成，对代码的压缩也是不可忽略的问题；由于JavaScript是加载脚本执行，对用户可见，别人能轻易看到你的代码，给很多不怀好意的人带来了许多可乘之机，代码混淆在这个时候就显得有一定存在的意义。
以上这些步骤在没有提出前端工程化和自动化之前，做起来蛮费事情的。随着近些年大前端时代的来临，再加上JavaScript的ES6，ES7的规范出现，这门语言也越来越完善，为了能够使用这些新规范，并且能够拥有很好的兼容性，打包环境就为此而生。例如Babel插件能够将ES6，ES7规范的代码编译为ES5的代码来对低版本进行兼容，当然CSS也有类似的插件，自动化完成这一套操作目前最受欢迎的就是webpack。
它不仅仅能解决代码兼容性问题，还能方便开发者。配置好热更新插件后，不需要重新运行程序不需要刷新浏览器，修改任何代码内容，页面马上就会做出更新等特性，对开发者提供了极大的便利，提高了开发的效率。所以在后台上搭建前端开发环境同样必不可少。
由于对前台开发时候，需要后台服务拿到相关数据，与后台建立相关通讯等，因此webpack需要和后端做个整合。npm分别安装webpack-dev-middleware以及webpack-hot-middleware。新建一个Koa中间件供由前面阐述的函数式加载中间件加载，在运行服务的时候，能够对网页进行编译打包，生成需要的静态页面。
```JavaScript
import dev from './dev/devMiddleware'
import hot from './dev/hotMiddleware'
import webpack from 'webpack'
import serve from 'koa-static'
import views from 'koa-views'
import { resolve } from 'path'
import webpackConfig from '../../front/build/webpack.dev.conf'

const compiler = webpack(webpackConfig)
const opt = {
	writeToDisk:true,
	logTime: true
}
export const webpackDev = app => {
	app.use(dev(compiler, opt))
	app.use(hot(compiler, opt))
	
	app.use(serve(resolve(__dirname, '../../front/dist')))
	app.use(views(resolve(__dirname, '../../front/dist')), {
		extensions: 'html'
	})

	app.use(async (ctx, next) => {
		await ctx.render('index.html')
	})
}
```
这个中间件最重要的是导入前面自己写好的webpackConfig，进入到这个中间件的时候用webpack加载配置，把加载好的生成的webpack对象以及开发热更新配置项传入devMiddleware中生成静态文件，同样以相同的方式传入热更新hotMiddleware模块，以流的方式渲染，它一直保持在后台进行，也就是侦听到文件更改，从而对开发页面对应打包文件进行渲染更改，实现修改实时更新。接着调用Koa-static把生成的静态文件生成静态资源服务，每当路由请求到未匹配的路由时候就路由穿透到这里，得到页面的静态资源，并且渲染HTML骨架，从这里将路由的控制权交由前端，页面渲染交由前端。

## 硬件控制部分
### 初始化johnny-Five
因为控制部分跑在子进程中，未配置babel进行编译，所以在这部分不采用ECMAmodules，霹雳五号与其他直接控制Arduino方式不同，需要包含以下三大元素
1. jhonny-Five库的引用
2. 创建board对象，通过它完成与Arduino的串口通信
3. 创建连接的回调函数

基本创建方式如下
```JavaScript
const Five = require('johnny-five')
const board = new Five.Board({port: "/dev/cu.usbmodem1421"})

board.on('ready', function () {
    //doSomething   
})
```
霹雳五号在运行时先会查找所给定的连接在USB串口的Arduino的控制板，其中POSIX系统必须指定GPIO串口名，否则会抛出异常。

JavaScript控制Arduino控制板需要编译上传StandardFirmate的C++模块。打开并且启用Arduino IDE中的'文件'=>'实例'=>'Firmata'=>'StandardFirmate',编译上传到Arduino控制板。

由于johnny-Five的使用采用的异步侦听回调的形式，如果层层回调，陷入回调地狱，会使得代码极其难以理解，并且耦合程度极高不易于复用，首先就得解决初始化的时候回调问题。
```JavaScript
const Five = require('johnny-five')
const board = new Five.Board({port: "/dev/cu.usbmodem1421"})
const ready = new Promise((resolve, reject) => {
	board.on('ready', function () {
		console.log('Arduino连接成功！'.bgBlue)
		resolve(this)
	})
})
module.exports = ready
```
因为在此处只需要一次并且在整个进程开始的时候初始化连接，对设备进行持续控制所以这里采用了JavaScript的Promise进行的异步封装，Promise有三个状态，分别为pending默认等待状态，fulfilled完成状态，rejected失败状态。当等待到结果，并且需要的内容完成的时候就会由pending进入到fulfilled状态，通过resolve返回下一步需要的结果，反之则进入rejected状态，结果或者异常由reject抛出。

每一个控制器应当对应一个js文件，初始化全部模块用一个async函数来实现，先等待前面Arduino连接情况，成功后加载创建控制器，分别传入建立连接的board对象以及jhonny-five库，这样能够实现各功能模块相互独立。增加新控制器的就只需在units文件夹中添加新的js文件即可在初始化的时候进行加载。
```JavaScript
;(async () => {
	try {
		const self = await ready
		glob.sync(resolve(__dirname, './units/*.js')).forEach(item => {
			require(item)(self, Five)
		})
	} catch (e) {
		throw new Error(e)
	}
})()
```

### LED亮度调节模块
调节LED亮度是通过调节pwm脉冲宽度来实现的，他是一只用数字的方式获得模拟信号的结果的技术。数字控制电路的通断来实现方波信号。这种信号模式能够通过通过通断就能够模拟全开5V到断开0V之间的电压。

这里霹雳五号已经帮我们封装好了，只需要把需要亮度的pwm交给霹雳五号，他就能调整LED的亮度。由于打算在一段时间能长时间使用，所以在LED与Arduino的pwm引脚之间串接一个220欧限流电阻。

通过霹雳五号控制LED整体上是非常容易的，我们考虑到客户端需要对设备控制的两个点分别为开关以及亮度的调节，所以就定义两个变量对pwm以及开关状态进行存储。为了确保收到前台来的通讯消息及时作出处理，我们得在通讯建立的时候传入回调函数来处理得到的状态，并且在这个时候对已经建立连接的前台给出相应的反馈(广播亮度和灯的开关情况)，以防止多用户同时调节亮度造成亮度不同步的严重问题。
这里进行亮度调节以及开关的通断则只需调用霹雳五号给出的api即可。
```JavaScript
module.exports = (self, Five) => {
	try {
		let pwm = 0,
			ledState = false
		let led = new Five.Led('11')
		let ledConf = { pwm, ledState }
		//建立socket连接，传入端口号，连接建立时候发送的消息，以及接受消息回调
		let socket = new SocketServer(2334, ledConf, receive)
		function receive(clientLedConf) {
			console.log(clientLedConf);
			if(clientLedConf.ledState) {
				if(!ledState) {
					led.on()
					ledState = true
				}
				pwm = parseInt(clientLedConf.pwm)
				led.brightness(pwm)
			} else {
				led.off()
				ledState = false
			}
			ledConf = {
				pwm,
				ledState
			}
			socket.boardcast(JSON.stringify(ledConf))
		}
	} catch (e) {
		console.log(e)
	}
}
```

### 温度检测存储展示模块
温度传感器选用DS18B20，这是一条总线的数字温度传感器，非常小巧，精度十分高(大部分的时候能够保证在±0.5°C)，在使用的过程中不需要任何外围的元器件。它直接提供了9位二进制温度数据。接线的时候需要一个上拉电阻，主要为了增强其稳定性防止干扰。
在霹雳五号中，也有对其的封装，最初调用的时候总是报错抛出异常，后面经过仔细的文档查阅发现还需要编译上传给Arduino一个开源的Firmata模块才能完成控制。因为原Arduino IDE中Firmata缺少此元器件通信方式。然后便去GitHub把ConfigurableFirmata克隆下来，用ide编译导入Arduino，再次测试能够正常温度检测。
```JavaScript
let timer
module.exports = async (self, Five) => {
	try {
		let T = { T : 'null' }
		let temp = new Five.Thermometer({
			controller: "DS18B20",
			pin: 2
		})
		let socket = new SocketServer(2333, T, false, false)
		temp.on('change', function () {
			T = {
				T: this.celsius
			}
			console.log('温度为', JSON.stringify(T))
			socket.boardcast(JSON.stringify(T))
		})
		timer = setInterval(function () {
			if(T.T < 50 && T.T > -20) {
				process.send(T.T)
			}
		}, 1000 * 30)
	} catch (e) {
		clearInterval(timer)
		console.log(e);
	}
}
```
在此同样通过霹雳五号api的形式先定义好设备，以及设变连接的数字接口，接着新建一个温度通信的socket接口。霹雳五号温度模块有一个'change'事件，能够侦听设备传来数据变化，一旦有数据变化就调用回调函数执行，然后从温度对象拿到温度数据直接装换为字符串向前台进行广播。以至于所有用户都能打开客户端的时候都能看到实时的温度情况。
这一部分还想进行对历史温度进行保存，让用户同时能够看到历史温度的比较。父进程的消息接受接口已经在前面进行介绍，每当接受到消息就会进行数据的存储，所以在这里我们只要考虑子进程给父进程发送温度消息即可。这为了演示，设置了30s进行一次通信，为了准确性防止在上电的时候等一些情况造成的测量较大误差，所以对温度测量范围作出了限制，并且，在温度控制模块抛出异常的时候及时中断定时器。尽量让数据结果更加精确可靠，防止给客户引起误导。

### 摄像头云台控制人脸跟踪模块
#### 人脸跟踪可行性分析
在设计这个模块之前，我思考了多个方案，最初方案就是通过前端web上调用HTML5的摄像头api获取到图像，然后把整个图像导入到canvas中用tracking.js来进行图像处理获取面部信息，通过webSocket传给后台，通知舵机进行跟踪。然而在图像识别阶段我就把这个方案给废除了，虽然能够正常识别到图像，当时毕竟计算在前台，浏览器的js效率不够加上客户端配置稍微差一些，就会引起画面肉眼可见的卡顿丢帧。这个时候会对坐标的计算产生一定的延迟，摄像头跟踪会出现不稳定的情况。
接着我就采取了第二个方案，第二个方案的目的是后台直接读取摄像头图像，利用opencv进行图像处理识别人像，直接把坐标信息交给舵机，前台的显示通过后台websocket进行推流，得到画面显示图像。这个方案很快也被否决了，原因就是后台读取USB摄像头接口没有找到合适的方式，第二个是因为视频压缩处理尚未掌握，不进行压缩的话前台显示效果也是很不理想。
最终选择了一个折中的方案，就是前台还是用HTML5的api获取图像，然后图像通过base64的形式经过websocket传给后台进行处理，再次将处理后得到的坐标信息分别交给舵机以及通过websocket交给前台。这样一来摄像头采集的图像能够在前台以一个高帧率来显示，并且通过给定一个定时器向后台传递图像，能够降低后台识别的次数，能够对资源消耗进行一定程度的降低。

#### 人脸识别模块封装
既然使用opencv进行识别，那就得先安装opencv由于我使用的是mac系统，直接终端中用brew进行安装
```bash
brew install opencv3
```
使用make命令对其进行编译，然后Git克隆安装在NodeJs上可调用的opencv的库，在package.json生产环境中添加"opencv": "git+https://github.com/peterbraden/node-opencv.git"之后npm i安装，等待编译安装完成，即可调用。
```JavaScript
const cv = require('opencv')
let frameObj = {}, func = () => {}
const facialRecognition = (filename, socket, cb) => {
	func = cb
	cv.readImage(filename, function (err, img) {
		if (err) throw err
		if (img.height() < 1 || img.width() < 1) throw new Error('图像尺寸为零！！！')
		img.detectObject(cv.FACE_CASCADE, {}, function (err, faces) {
			if (err) {
				clearInterval(timer)
				throw err
			}
			if (faces && faces.length > 0) {
				let face = faces[0]
				let left = face.x,
					top = face.y,
					width = face.width,
					height = face.height
				frameObj = {
					conf: { left, top, width, height },
					info: {
						left: left + 'px',
						top: top + 'px',
						width: width + 'px',
						height: height + 'px'
					},
					isShow: true
				}
			} else {
				frameObj = { conf: {}, isShow: false, info: {} }
			}
			socket.boardcast(JSON.stringify(frameObj))
		})
	})
}
var timer = setInterval(() => {
	func(frameObj)
}, 500)
module.exports = facialRecognition
```
首先接口需要导入图像的的文件路径，webSocket的实例对象，以及给舵机信号的回调函数

## 前台

### 前端路由

### 路由拦截

## 其他
### 数据库


### 网络通讯
websocket

# 系统运行结果(800)
## 服务端

## 客户端

# 总结以及对未来的展望(800)
## 总结

## 展望