var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(_vm.label === false ? 'div' : 'label',{tag:"component",staticClass:"mi-checkbox",class:{
    '-cell': _vm.cell,
    '-disabled': _vm.disabled,
  },style:(("--checkbox-size: " + _vm.sizeRem + ";")),on:{"click":_vm.onClick,"keydown":_vm.onKeyDown}},[_c('input',{staticClass:"mi-checkbox-input",attrs:{"id":_vm.id,"type":"checkbox","disabled":_vm.disabled},domProps:{"checked":_vm.value},on:{"change":_vm.toggleValue}}),_c('span',{staticClass:"mi-checkbox-checkmark"},[(_vm.value === true)?_c('nu-icon',{staticClass:"mi-checkbox-icon -checked",attrs:{"name":_vm.icon ? _vm.icon : 'check',"size":_vm.size}}):_vm._e(),(_vm.value === false)?_c('nu-icon',{staticClass:"mi-checkbox-icon -unchecked",attrs:{"name":_vm.icon ? _vm.icon : 'check',"size":_vm.size}}):_vm._e(),(_vm.value == null)?_c('nu-icon',{staticClass:"mi-checkbox-icon -intermediate",attrs:{"name":"minus","size":_vm.size}}):_vm._e()],1),(_vm.label)?_c('span',{staticClass:"mi-checkbox-label"},[_vm._v(_vm._s(_vm.label))]):_vm._e()])}
var staticRenderFns = []

export { render, staticRenderFns }