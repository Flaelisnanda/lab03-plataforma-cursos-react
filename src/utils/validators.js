export const Validators = {
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  isRequired(value) {
    if (value === null || value === undefined) return false;
    if (value === 0 || value === '0') return false;
    return String(value).trim() !== '';
  },

  isEmail(value) {
    return this.emailRegex.test(String(value).trim());
  },

  isDate(value) {
    if (!value) return false;
    return !isNaN(new Date(value).getTime());
  },

  isPositiveNumber(value) {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  },

  validateFields(fields) {
    const errors = [];
    fields.forEach(({ value, label, rules }) => {
      if (rules.includes('required') && !this.isRequired(value)) errors.push(`${label} é obrigatório.`);
      if (rules.includes('email') && this.isRequired(value) && !this.isEmail(value)) errors.push(`${label} deve ser um e-mail válido.`);
      if (rules.includes('date') && this.isRequired(value) && !this.isDate(value)) errors.push(`${label} deve ser uma data válida.`);
      if (rules.includes('positive') && this.isRequired(value) && !this.isPositiveNumber(value)) errors.push(`${label} deve ser um número positivo.`);
    });
    return errors;
  }
};

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}
