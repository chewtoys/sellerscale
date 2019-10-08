var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('nu-btn-group',{attrs:{"name":_vm.name,"place":_vm.place,"width":_vm.width,"height":_vm.height,"padding":_vm.padding}},[_c('nu-icon',{attrs:{"color":"minor","name":"dollar-sign","size":"1","border":"","radius":".5 0 0 .5","width":"2"}}),_c('nu-input',{staticClass:"mi-input-currency mi-input",class:{
    '-nu-no-overflow': true,
    '-error': _vm.status === 'error',
    '-success': _vm.status === 'success',
  },attrs:{"disabled":_vm.disabled}},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.amount),expression:"amount"}],ref:"root",staticStyle:{"text-align":"center","padding-left":"0","padding-right":"0"},attrs:{"id":_vm.id,"placeholder":_vm.placeholder,"autofocus":_vm.autofocus,"type":"tel"},domProps:{"value":(_vm.amount)},on:{"blur":_vm.onBlurHandler,"input":[function($event){if($event.target.composing){ return; }_vm.amount=$event.target.value},_vm.onInputHandler],"keydown":_vm.onKeyDownHandler,"focus":_vm.onFocusHandler}})])],1)}
var staticRenderFns = []

export { render, staticRenderFns }