var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('nu-input',{staticClass:"mi-input-numeric mi-input",class:{
    '-error': _vm.status === 'error',
    '-success': _vm.status === 'success',
  },attrs:{"cell":_vm.cell,"place":_vm.place,"width":_vm.width,"height":_vm.height,"padding":_vm.padding,"disabled":_vm.disabled,"radius":_vm.radius,"name":_vm.name}},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.amount),expression:"amount"}],ref:"root",staticStyle:{"text-align":"center"},attrs:{"id":_vm.id,"placeholder":_vm.placeholder,"autofocus":_vm.autofocus,"type":"tel"},domProps:{"value":(_vm.amount)},on:{"blur":_vm.onBlurHandler,"input":[function($event){if($event.target.composing){ return; }_vm.amount=$event.target.value},_vm.onInputHandler],"keydown":_vm.onKeyDownHandler,"focus":_vm.onFocusHandler}})])}
var staticRenderFns = []

export { render, staticRenderFns }