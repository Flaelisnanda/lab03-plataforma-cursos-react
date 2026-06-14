import { useState } from 'react';
import { BadgeCheck, ShieldCheck, ListChecks, Award, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useData, findById } from '../hooks/useData.js';
import { formatDate } from '../utils/validators.js';
import { gerarCertificado, verificarCertificado } from '../services/platformService.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import FormCard from '../components/ui/FormCard.jsx';
import DataCard from '../components/ui/DataCard.jsx';
import ErrorAlert from '../components/ui/ErrorAlert.jsx';

function baixarPDF(preview) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // Fundo branco
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, 'F');

  // Borda externa dupla
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(1.2);
  doc.rect(10, 10, W - 20, H - 20);
  doc.setLineWidth(0.4);
  doc.rect(13, 13, W - 26, H - 26);

  // Cabeçalho colorido
  doc.setFillColor(79, 70, 229);
  doc.rect(10, 10, W - 20, 22, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('LearnHub', W / 2, 23, { align: 'center' });

  // Título principal
  doc.setFontSize(26);
  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICADO DE CONCLUSÃO', W / 2, 52, { align: 'center' });

  // Linha decorativa
  doc.setDrawColor(199, 210, 254);
  doc.setLineWidth(0.5);
  doc.line(30, 57, W - 30, 57);

  // Texto "Certificamos que"
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Certificamos que', W / 2, 68, { align: 'center' });

  // Nome do aluno
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(preview.usuario?.nomeCompleto ?? '', W / 2, 82, { align: 'center' });

  // Texto "concluiu com êxito o curso"
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('concluiu com êxito o curso', W / 2, 93, { align: 'center' });

  // Nome do curso
  doc.setFontSize(17);
  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.text(preview.curso?.titulo ?? '', W / 2, 105, { align: 'center' });

  // Linha separadora
  doc.setDrawColor(199, 210, 254);
  doc.setLineWidth(0.4);
  doc.line(30, 113, W - 30, 113);

  // Código e data lado a lado
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.text('Código de Verificação', W / 2 - 45, 122, { align: 'center' });
  doc.text('Data de Emissão', W / 2 + 45, 122, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.text(preview.cert.codigoVerificacao, W / 2 - 45, 130, { align: 'center' });

  doc.setTextColor(15, 23, 42);
  doc.text(formatDate(preview.cert.dataEmissao), W / 2 + 45, 130, { align: 'center' });

  doc.save(`certificado-${preview.usuario?.nomeCompleto?.replace(/\s+/g, '-')}.pdf`);
}

export default function CertificadosPage() {
  const { certificados, usuarios, cursos, refresh, showToast } = useData();
  const [idUsuario, setIdUsuario] = useState('');
  const [idCurso, setIdCurso] = useState('');
  const [codigo, setCodigo] = useState('');
  const [errors, setErrors] = useState([]);
  const [preview, setPreview] = useState(null);
  const [verificacao, setVerificacao] = useState(null);

  const gerar = async () => {
    if (!idUsuario || !idCurso) { setErrors(['Selecione usuário e curso.']); return; }
    try {
      const cert = await gerarCertificado(Number(idUsuario), Number(idCurso));
      setPreview({ cert, usuario: findById(usuarios, idUsuario), curso: findById(cursos, idCurso) });
      setErrors([]);
      await refresh();
      showToast('Certificado gerado!');
    } catch (err) { setErrors([err.message]); }
  };

  const verificar = async () => {
    if (!codigo.trim()) { setVerificacao({ valid: false, msg: 'Informe o código.' }); return; }
    const cert = await verificarCertificado(codigo.trim());
    if (!cert) { setVerificacao({ valid: false, msg: 'Certificado inválido.' }); return; }
    setVerificacao({
      valid: true,
      usuario: findById(usuarios, cert.idUsuario)?.nomeCompleto,
      curso: findById(cursos, cert.idCurso)?.titulo,
      data: formatDate(cert.dataEmissao)
    });
  };

  return (
    <section>
      <PageHeader title="Certificados" subtitle="Emissão e verificação de certificados de conclusão" />
      <div className="row g-4">
        <div className="col-lg-5">
          <FormCard title="Gerar Certificado" Icon={BadgeCheck}>
            <ErrorAlert errors={errors} />
            <div className="mb-3"><label className="form-label">Usuário</label>
              <select className="form-select" value={idUsuario} onChange={e => setIdUsuario(e.target.value)}>
                <option value="">Selecione...</option>
                {usuarios?.map(u => <option key={u.id} value={u.id}>{u.nomeCompleto}</option>)}
              </select></div>
            <div className="mb-3"><label className="form-label">Curso</label>
              <select className="form-select" value={idCurso} onChange={e => setIdCurso(e.target.value)}>
                <option value="">Selecione...</option>
                {cursos?.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
              </select></div>
            <button className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2" onClick={gerar}>
              <Award size={16} />
              Gerar Certificado
            </button>
          </FormCard>
          <div className="mt-3">
            <FormCard title="Verificar Certificado" Icon={ShieldCheck}>
              <div className="input-group">
                <input className="form-control" placeholder="Código de verificação" value={codigo} onChange={e => setCodigo(e.target.value)} />
                <button className="btn btn-outline-primary" onClick={verificar}>Verificar</button>
              </div>
              {verificacao && (
                <div style={{
                  marginTop: 12, padding: '12px 14px', borderRadius: 8, fontSize: '0.875rem',
                  background: verificacao.valid ? '#f0fdf4' : '#fff1f2',
                  border: `1px solid ${verificacao.valid ? '#bbf7d0' : '#fecdd3'}`,
                  color: verificacao.valid ? '#166534' : '#9f1239'
                }}>
                  {verificacao.valid
                    ? <><strong>Válido!</strong><br />{verificacao.usuario} · {verificacao.curso} · {verificacao.data}</>
                    : verificacao.msg}
                </div>
              )}
            </FormCard>
          </div>
        </div>

        <div className="col-lg-7">
          {preview && (
            <>
              <div className="certificado-card text-center p-5 mb-3">
                <div style={{
                  width: 64, height: 64, background: '#fef3c7',
                  borderRadius: 16, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 20px'
                }}>
                  <Award size={32} color="#b45309" />
                </div>
                <h3 style={{ color: '#4f46e5', fontWeight: 800, letterSpacing: '-0.02em' }}>Certificado de Conclusão</h3>
                <p style={{ color: '#64748b', marginTop: 16, marginBottom: 4 }}>Certificamos que</p>
                <h4 style={{ fontWeight: 700 }}>{preview.usuario?.nomeCompleto}</h4>
                <p style={{ color: '#64748b', marginBottom: 4 }}>concluiu com êxito o curso</p>
                <h5 style={{ color: '#059669', fontWeight: 700 }}>{preview.curso?.titulo}</h5>
                <hr style={{ margin: '20px 0', borderColor: '#c7d2fe' }} />
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: 6 }}>Código de verificação</p>
                <code style={{ fontSize: '1rem', fontWeight: 700, color: '#4f46e5', letterSpacing: '0.05em' }}>{preview.cert.codigoVerificacao}</code>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: 12, marginBottom: 0 }}>Emitido em {formatDate(preview.cert.dataEmissao)}</p>
              </div>

              <button
                onClick={() => baixarPDF(preview)}
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                style={{ fontWeight: 600 }}
              >
                <Download size={16} />
                Baixar PDF
              </button>
            </>
          )}

          <div className={preview ? 'mt-3' : ''}>
            <DataCard title="Certificados Emitidos" Icon={ListChecks}>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>Aluno</th><th>Curso</th><th>Código</th><th>Emissão</th></tr></thead>
                  <tbody>
                    {certificados?.map(c => (
                      <tr key={c.id}>
                        <td className="fw-medium">{findById(usuarios, c.idUsuario)?.nomeCompleto}</td>
                        <td style={{ color: '#64748b' }}>{findById(cursos, c.idCurso)?.titulo}</td>
                        <td><code style={{ fontSize: '0.78rem', color: '#4f46e5' }}>{c.codigoVerificacao}</code></td>
                        <td style={{ color: '#94a3b8' }}>{formatDate(c.dataEmissao)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DataCard>
          </div>
        </div>
      </div>
    </section>
  );
}
