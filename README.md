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


### 路由
平时设计一个NodeJs的路由步骤会比较繁琐，还好Koa框架给我们对路由进行了封装大部分的实现，并且async和await已经对异步回调进行的相关大的简化，给路由的书写带来了很大的方便。由于本次设计，我把其当成一个产品来设计，追求的是更低的耦合从而实现更加容易的可扩展性。
这个时候，设计模式登场。由于JavaScript的装饰器是新的标准，并且大体上是和Python是类似的


### webpack

## 硬件控制部分
### LED亮度调节模块


### 温度检测存储展示模块


### 摄像头云台控制人脸跟踪模块

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