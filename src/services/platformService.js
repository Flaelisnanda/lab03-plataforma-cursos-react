import api from './api.js';

const getAll = (resource) => api.get(`/${resource}`);
const getById = (resource, id) => api.get(`/${resource}/${id}`);
const create = (resource, data) => api.post(`/${resource}`, data);
const update = (resource, id, data) => api.put(`/${resource}/${id}`, data);
const remove = (resource, id) => api.delete(`/${resource}/${id}`);

export async function fetchAllData() {
  const [
    usuarios, categorias, cursos, modulos, aulas, matriculas,
    progressoAulas, avaliacoes, trilhas, trilhasCursos,
    certificados, planos, assinaturas, pagamentos
  ] = await Promise.all([
    getAll('usuarios'), getAll('categorias'), getAll('cursos'), getAll('modulos'),
    getAll('aulas'), getAll('matriculas'), getAll('progressoAulas'), getAll('avaliacoes'),
    getAll('trilhas'), getAll('trilhasCursos'), getAll('certificados'),
    getAll('planos'), getAll('assinaturas'), getAll('pagamentos')
  ]);

  return {
    usuarios, categorias, cursos, modulos, aulas, matriculas,
    progressoAulas, avaliacoes, trilhas, trilhasCursos,
    certificados, planos, assinaturas, pagamentos
  };
}

// --- Usuários ---
export const createUsuario = (data) => create('usuarios', data);
export const getUsuarios = () => getAll('usuarios');

// --- Categorias ---
export const createCategoria = (data) => create('categorias', data);
export const getCategorias = () => getAll('categorias');

// --- Cursos ---
export const createCurso = (data) => create('cursos', { ...data, totalAulas: 0, totalHoras: 0 });
export const updateCurso = (id, data) => update('cursos', id, data);
export const getCursos = () => getAll('cursos');

export async function updateCursoTotals(idCurso) {
  const [modulos, aulas, curso] = await Promise.all([
    getAll('modulos'), getAll('aulas'), getById('cursos', idCurso)
  ]);
  const mods = modulos.filter(m => Number(m.idCurso) === Number(idCurso));
  let totalAulas = 0, totalMinutos = 0;
  mods.forEach(mod => {
    const aulasMod = aulas.filter(a => Number(a.idModulo) === Number(mod.id));
    totalAulas += aulasMod.length;
    totalMinutos += aulasMod.reduce((s, a) => s + a.duracaoMinutos, 0);
  });
  return update('cursos', idCurso, {
    ...curso,
    totalAulas,
    totalHoras: Math.round((totalMinutos / 60) * 10) / 10
  });
}

// --- Módulos ---
export const createModulo = async (data) => {
  const modulo = await create('modulos', data);
  await updateCursoTotals(data.idCurso);
  return modulo;
};

// --- Aulas ---
export const createAula = async (data) => {
  const aula = await create('aulas', data);
  const modulos = await getAll('modulos');
  const modulo = modulos.find(m => m.id === data.idModulo);
  if (modulo) await updateCursoTotals(modulo.idCurso);
  return aula;
};

// --- Matrículas ---
export const createMatricula = async (data) => {
  const matriculas = await getAll('matriculas');
  if (matriculas.some(m => Number(m.idUsuario) === Number(data.idUsuario) && Number(m.idCurso) === Number(data.idCurso))) {
    throw new Error('Usuário já matriculado neste curso.');
  }
  return create('matriculas', data);
};

// --- Progresso ---
export const marcarAulaConcluida = async (idUsuario, idAula) => {
  const progresso = await getAll('progressoAulas');
  const existing = progresso.find(p => Number(p.idUsuario) === Number(idUsuario) && Number(p.idAula) === Number(idAula));
  const hoje = new Date().toISOString().split('T')[0];

  if (existing) {
    return update('progressoAulas', existing.id, { ...existing, status: 'Concluído', dataConclusao: hoje });
  }
  return create('progressoAulas', { idUsuario, idAula, dataConclusao: hoje, status: 'Concluído' });
};

export async function calcularProgressoCurso(idUsuario, idCurso) {
  const [modulos, aulas, progresso] = await Promise.all([
    getAll('modulos'), getAll('aulas'), getAll('progressoAulas')
  ]);
  const mods = modulos.filter(m => Number(m.idCurso) === Number(idCurso));
  const aulasCurso = mods.flatMap(m => aulas.filter(a => Number(a.idModulo) === Number(m.id)));
  if (aulasCurso.length === 0) return 0;
  const concluidas = progresso.filter(
    p => Number(p.idUsuario) === Number(idUsuario) && p.status === 'Concluído' && aulasCurso.some(a => Number(a.id) === Number(p.idAula))
  ).length;
  return Math.round((concluidas / aulasCurso.length) * 100);
}

// --- Trilhas ---
export const createTrilha = (data) => create('trilhas', data);

export const addCursoATrilha = async (idTrilha, idCurso, ordem) => {
  const links = await getAll('trilhasCursos');
  if (links.some(tc => Number(tc.idTrilha) === Number(idTrilha) && Number(tc.idCurso) === Number(idCurso))) {
    throw new Error('Este curso já está na trilha.');
  }
  return create('trilhasCursos', { idTrilha, idCurso, ordem });
};

// --- Certificados ---
export async function gerarCertificado(idUsuario, idCurso) {
  const pct = await calcularProgressoCurso(idUsuario, idCurso);
  if (pct < 100) throw new Error(`Curso incompleto (${pct}%). Conclua todas as aulas.`);

  const certificados = await getAll('certificados');
  if (certificados.some(c => Number(c.idUsuario) === Number(idUsuario) && Number(c.idCurso) === Number(idCurso))) {
    throw new Error('Certificado já emitido para este curso.');
  }

  const codigo = 'CERT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const dataEmissao = new Date().toISOString().split('T')[0];
  const cert = await create('certificados', { idUsuario, idCurso, idTrilha: null, codigoVerificacao: codigo, dataEmissao });

  const matriculas = await getAll('matriculas');
  const mat = matriculas.find(m => Number(m.idUsuario) === Number(idUsuario) && Number(m.idCurso) === Number(idCurso));
  if (mat) await update('matriculas', mat.id, { ...mat, dataConclusao: dataEmissao });

  return cert;
}

export async function verificarCertificado(codigo) {
  const certs = await getAll('certificados');
  return certs.find(c => c.codigoVerificacao === codigo) || null;
}

// --- Planos ---
export const createPlano = (data) => create('planos', data);

// --- Checkout ---
export async function processarCheckout(idUsuario, idPlano, metodoPagamento) {
  const plano = await getById('planos', idPlano);
  const hoje = new Date();
  const dataInicio = hoje.toISOString().split('T')[0];
  const dataFim = new Date(hoje);
  dataFim.setMonth(dataFim.getMonth() + plano.duracaoMeses);

  const assinatura = await create('assinaturas', {
    idUsuario, idPlano, dataInicio, dataFim: dataFim.toISOString().split('T')[0]
  });

  const pagamento = await create('pagamentos', {
    idAssinatura: assinatura.id,
    valorPago: plano.preco,
    dataPagamento: dataInicio,
    metodoPagamento,
    idTransacaoGateway: 'TXN-' + Date.now() + '-' + Math.random().toString(36).substring(2, 10).toUpperCase()
  });

  return { assinatura, pagamento, plano };
}
