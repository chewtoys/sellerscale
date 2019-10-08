var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('nu-input',{staticClass:"mi-input",class:{
    '-error': _vm.status === 'error',
    '-success': _vm.status === 'success',
  },attrs:{"cell":_vm.cell,"place":_vm.place,"width":_vm.width,"height":_vm.height,"padding":_vm.padding,"disabled":_vm.disabled,"name":_vm.name,"theme":_vm.theme,"radius":_vm.radius}},[_c('input',{ref:"root",attrs:{"id":_vm.id,"placeholder":_vm.placeholder,"autofocus":_vm.autofocus,"maxlength":_vm.maxLength,"list":_vm.list,"type":_vm.type},domProps:{"value":_vm.value},on:{"input":_vm.onChange,"blur":_vm.onBlur,"focus":_vm.onFocus}})])}
var staticRenderFns = []

export { render, staticRenderFns }