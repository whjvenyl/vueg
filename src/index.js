let transition = {}
transition.install = (Vue, router, options = {}) => {
    let route, lastPath, transitionType, binding = {},
        op, // Configuration item
        instances, // When the component is activated to determine whether it belongs to the route, does not belong to no animation
        coord = { x: 0, y: 0 } //按下坐标

    _initOptions()

    Vue.directive('transition', {
        bind(el, _binding, vnode, oldVnode) {
            binding = _binding
        }
    })

    // Old components will be destroyed after the exit, so build a container, after the re-hanging in the destruction, as the "background"
    function setBackground() {
        // Components are not matched to the current approach routes, not processed

        // this.$el.classList.add('animated','fadeOut')

        let el = this.$el
        if (!el) //容错
            return

        let obj = this.$el.classList
        if (!obj)
            return

        let arr = []
        Object.keys(obj).forEach(item => {
            arr.push(obj[item])
        })
        let isInArr = false
        arr.map(item => {
                if (item === 'animated')
                    isInArr = true
            })
            // guard。。。
        if (!isInArr)
            return

        let bacgrEle = document.createElement('div')
        bacgrEle.id = 'vueg-background'
        let vm = instances.default
        if (vm) {

            // Get the component vueg configuration
            let vuegConfig = vm.$data.vuegConfig
            if (vuegConfig) {
                Object.keys(vuegConfig).forEach(key => {
                    op[key] = vuegConfig[key]
                })
            }

            // Disable transitions without setting background
            if (op.disable)
                return

            // Each time you reload vue will empty the mounted element, and every time you add it
            let vuegBac = document.getElementById('vueg-background')
                // Do not exist on the insert
            if (!vuegBac) {
                vm.$el.parentElement.appendChild(bacgrEle)
                vuegBac = bacgrEle
            }
            if (!op.isStackAnim) vuegBac.classList.add('stack-animation')

            vuegBac.innerHTML = ''
            vuegBac.classList = []
            vuegBac.appendChild(this.$el)
        }
    }
    Vue.mixin({
        mounted: addEffect,
        activated: addEffect,
        beforeDestroy: setBackground,
        deactivated: setBackground
    })

    router.beforeEach((to, from, next) => {
        route = to
        let toDepth = to.path.split('/').length
        let fromDepth = from.path.split('/').length
        if (to.path.charAt(to.path.length - 1) !== '/')
            toDepth += 1
        if (from.path.charAt(from.path.length - 1) !== '/')
            fromDepth += 1
        transitionType = toDepth > fromDepth ? 'forward' : 'back'

        // The same depth
        if (toDepth === fromDepth) {
            if (lastPath === to.path) {
                transitionType = 'back'
            } else {
                transitionType = 'forward'
            }
            // When the depth is the same, the animation is disabled
            if (op.sameDepthDisable)
                transitionType = ''

            lastPath = from.path
        }

        // First entry has no effect
        if (to.path === from.path && to.path === lastPath)
            transitionType = 'first'

        // Turn off the progressive animation for the first time
        if (op.firstEntryDisable)
            transitionType = ''

        //tabs转场控制
        if (from.name && to.name) {
            let fromIndex = op.tabs.findIndex(item => {
                    return item.name === from.name
                }),
                toIndex = op.tabs.findIndex(item => {
                    return item.name === to.name
                })
            if (!op.tabsDisable && fromIndex !== -1 && toIndex !== -1) {
                //启用tabs控制
                if (toIndex > fromIndex)
                    transitionType = 'forward'
                if (toIndex < fromIndex)
                    transitionType = 'back'
                if (toIndex === fromIndex)
                    transitionType = ''
            } else {
                //tabs禁用动画
                if (fromIndex !== -1 && toIndex !== -1)
                    transitionType = ''
            }
        }

        // Get the incoming component instances, {default: component}
        let matched = to.matched[0]
        if (matched && matched.instances) {
            instances = matched.instances
        } else
            instances = null
        next()
    })

    function isInRoute() {

        //对于嵌套路由，默认为关闭动画，需要在组件的data.vuegConfig中配置disable为false启用
        if (this.vuegConfig && this.vuegConfig.disable === false) {
            // this.$el.style.boxShadow = 'initial'
            return true
        }
        //router.afterEach后获得新页面的组件，组件渲染或激活后触发addEffect
        if (instances && instances.default && instances.default._uid !== this._uid)
            return false
        else return true
    }

    // Router.afterEach after getting the new page of the component, the component renders or activates after triggering the addEffect
    function addEffect(ins = this) {
        //不属于当前进场路由匹配到的组件，则无动画
        if (!isInRoute.call(ins))
            return
        if (!ins) //无参
            return
        if (binding.value === false)
            return
        if (!route)
            return
        let el = this.$el
        if (!el) //容错
            return
        if (!el.parentElement)
            return

        // To prevent the configuration of a component affect other components, each time to initialize the data
        _initOptions()

        //全局vueg配置
        Object.keys(options).forEach(key => {
            op[key] = options[key]
        })

        //组件vueg配置
        let vuegConfig = this.$data.vuegConfig

        if (vuegConfig) {
            Object.keys(vuegConfig).forEach(key => {
                op[key] = vuegConfig[key]
            })
        }

        // Disable transition animation configuration
        if (op.disable)
            transitionType = ''

        let oldEl = el;
        if (op.isStackAnim) {
          // if we're in stack mode, the back animation has the elements to animate reversed
          if (transitionType === 'back') {
            el = document.getElementById('vueg-background')
          }
        }
        el.classList.add('stack-animation')

        if (op.shadow)
            el.style.boxShadow = '0 3px 10px rgba(0, 0, 0, .156863), 0 3px 10px rgba(0, 0, 0, .227451)'

        // Sets the progressive display duration for the first time
        if (transitionType === 'first') {
            el.style.animationDuration = op.firstEntryDuration + 's'
            el.classList.add('fadeIn')
        }

        // Transition animation time
        if (transitionType)
            el.style.animationDuration = op.duration + 's'

        el.classList.add('animated')
        let coordAnim = ['touchPoint']
        let anim
        switch (transitionType) {
            case 'forward':
                anim = op.forwardAnim
                break
            case 'back':
                anim = op.backAnim
                break
            default:
                break
        }
        if (anim)
            el.classList.add(anim)

        //需要结合js获取触摸坐标的转场设置
        let style,
            head = document.head || document.getElementsByTagName('head')[0],
            cssText
        style = document.getElementById('vueg-style')
        if (!style) {
            style = document.createElement('style')
            style.type = 'text/css'
            style.id = 'vueg-style'
            head.appendChild(style)
        }
        if (coordAnim.findIndex(item => item === anim) !== -1) {
            switch (anim) {
                case 'touchPoint':
                    let centerPoint = {
                        x: document.documentElement.clientWidth / 2,
                        y: document.documentElement.clientHeight / 2
                    }
                    cssText = `.touchPoint{
                                max-height:${document.documentElement.clientHeight}px!important;
                                overflow:hidden;
                                animation-name:touchPoint;
                                position: relative;
                                animation-timing-function: linear;
                            }
                            @keyframes touchPoint {
                                from {
                                    opacity:0.5;
                                    transform: scale3d(0, 0, 0);
                                    left:${-centerPoint.x+coord.x}px;
                                    top:${-centerPoint.y+coord.y}px;
                                }
                                to{
                                    opacity:1;
                                    transform: scale3d(1, 1, 1);
                                    left:0;
                                    top:0;
                                }
                            }`
                    let textNode = document.createTextNode(cssText)
                    style.appendChild(textNode)
                    break
                default:
                    break
            }
        }

        // Remove the class after the animation is complete
        setTimeout(() => {
                oldEl.classList.add('animated')

                if (el && el.classList) {
                  el.classList.remove(op.forwardAnim, op.backAnim, 'stack-animation')
                }
                el.style.boxShadow = ''
                el.style.animationDuration = '0s'
                let vuegBac = document.getElementById('vueg-background')
                if (vuegBac) {
                    vuegBac.innerHTML = ''
                    vuegBac.classList = []
                    vuegBac.removeAttribute('style')
                }

                if (coordAnim.findIndex(item => item === anim) !== -1)
                    style.innerHTML = ''
            }, op.duration * 1000 + 300) // Plus 300 millisecond delay because sometimes the animation has not been completed to be removed
        setTimeout(() => {
            el.classList.remove('fadeIn')
        }, op.firstEntryDuration * 1000);
    }

    document.addEventListener('mousedown', getCoord)
    document.addEventListener('touchstart', getCoord)

    //获得按下坐标
    function getCoord(e) {
        if (e.type === 'mousedown') {
            coord.x = e.pageX
            coord.y = e.pageY
        } else {
            coord.x = e.touches[0].pageX
            coord.y = e.touches[0].pageY
        }

    }


    function _initOptions() {
        // default options
        op = {
            duration: '0.3', //动画时长
            firstEntryDisable: false, //值为true时禁用首次进入的渐进动画
            firstEntryDuration: '.6', // The first time you enter the progressive animation
            forwardAnim: 'fadeInRight', // Forward animation
            backAnim: 'fadeInLeft', // Back animation
            isStackAnim: false,
            sameDepthDisable: false, //url级别相同时禁用动画
            tabs: [], //name填写对应路由的name,以实现类似app中点击tab页面水平转场效果，如tab[1]到tab[0]，会使用forwardAnim动画，tab[1]到tab[2]，会使用backAnim动画
            tabsDisable: false, //值为true时，tabs间的转场没有动画
            disable: false, //禁用转场动画
            shadow: true //为false，转场时没有阴影层次效果
        }
    }

}
module.exports = transition
