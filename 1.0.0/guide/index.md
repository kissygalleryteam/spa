## 综述

Spa是svg path animation的简称，spajs可以用来做svg路径动画效果。


## 初始化组件

```html
<img src="">
<svg id="iphone" width="1000" height="600" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1000 600" fill="none" stroke="#fff">...</svg>
```

```javascript
S.use('kg/spa/1.0.0/index', function (S, Spa) {
     var spa = new Spa('iphone');
     spa.render();
})
``````

## API说明
