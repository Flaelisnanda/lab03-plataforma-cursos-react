import { useApp } from '../context/AppContext.jsx';

export function useData() {
  const { data, refresh, showToast } = useApp();
  return { ...data, refresh, showToast };
}

export function findById(list, id) {
  return list?.find(item => Number(item.id) === Number(id));
}

export function countBy(list, key, value) {
  return list?.filter(item => Number(item[key]) === Number(value)).length ?? 0;
}
