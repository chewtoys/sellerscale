import i18n from '@/i18n';

function getLabel(s) {
  if (i18n.te(`label.${s}`)) {
    return i18n.t(`label.${s}`);
  }

  return i18n.t(`form_field.product.${s}`);
}

export default function formula(prop, str) {
  return `<div class="formula mi-tooltip-spacer">
    <nu-badge>${getLabel(prop)}</nu-badge> = ${str.replace(/[a-z]+/gi, s => `<nu-badge>${getLabel(s)}</nu-badge>`)}
  </div>`;
}
