import { useState } from "react";

const seguranca = [
  {
    icon: "🔐",
    label: "Encriptação",
    color: "#f43f5e",
    desc: "Dados em trânsito protegidos por HTTPS/TLS. Dados em repouso encriptados com AES-256 via Firestore. Informações sensíveis recebem camada adicional antes de serem salvas.",
    tools: [
      {
        label: "CryptoJS / Node.js Crypto",
        detail:
          "Biblioteca nativa do Node — gratuita. Encripta CPF, prontuário e dados hormonais antes de salvar no Firestore. Nem o banco vê o valor bruto.",
      },
      {
        label: "Google Cloud Secret Manager",
        detail:
          "Gerencia as chaves de encriptação com segurança. Gratuito até 6 acessos/mês — suficiente para o MVP.",
      },
      {
        label: "bcrypt",
        detail:
          "Padrão da indústria para hash de senhas. Biblioteca gratuita no Node. Senhas nunca são salvas em texto puro.",
      },
    ],
  },
  {
    icon: "🛡️",
    label: "Controle de Acesso",
    color: "#f97316",
    desc: "Autenticação via Firebase Auth com tokens JWT. Permissões separadas por perfil — nutricionista acessa só sua carteira, paciente vê apenas seus dados.",
    tools: [
      {
        label: "Firebase Security Rules",
        detail:
          "Regras declarativas no Firestore. Nutricionista X só lê documentos onde nutricionistaId == X. Paciente Y acessa apenas seus próprios dados. Gratuito e nativo.",
      },
      {
        label: "Custom Claims (Firebase Auth)",
        detail:
          "Adiciona perfil ao token JWT: { role: 'nutricionista' } ou { role: 'paciente' }. O sistema inteiro usa isso pra decidir o que mostrar e o que bloquear.",
      },
      {
        label: "Firebase Admin SDK",
        detail:
          "Valida o token JWT em cada requisição no backend Node antes de processar qualquer dado. Revogação instantânea pelo console se necessário.",
      },
    ],
  },
  {
    icon: "👁️",
    label: "Auditoria & Rastreabilidade",
    color: "#eab308",
    desc: "Log completo de quem acessou, o quê e quando. Alertas automáticos de acesso suspeito. Histórico de alterações para fins clínicos e jurídicos.",
    tools: [
      {
        label: "Firebase Firestore — coleção de logs",
        detail:
          "Cada ação relevante grava um documento com: usuário, ação, timestamp, IP e dado acessado. Gratuito dentro da cota do Spark.",
      },
      {
        label: "Firebase Cloud Functions",
        detail:
          "Trigger automático que detecta padrões anômalos (ex: mesmo usuário acessando 50 pacientes em 2 minutos) e alerta o admin via FCM.",
      },
      {
        label: "Google Cloud Logging",
        detail:
          "Integrado nativamente ao Firebase. Armazena e consulta logs de infraestrutura. Gratuito até 50GB/mês.",
      },
      {
        label: "Firestore — subcoleção de versões",
        detail:
          "Cada alteração nos dados do paciente salva a versão anterior numa subcoleção 'historico'. Permite reconstruir o estado em qualquer ponto no tempo.",
      },
    ],
  },
  {
    icon: "🗑️",
    label: "Retenção & Exclusão",
    color: "#22c55e",
    desc: "Política clara de retenção automática. Direito ao esquecimento garantido — exclusão completa e auditada a pedido do paciente, conforme LGPD Art. 18.",
    tools: [
      {
        label: "Firestore TTL (Time To Live)",
        detail:
          "Recurso nativo do Firestore que deleta documentos automaticamente após período definido. Ex: dados de pacientes inativos há 5 anos removidos automaticamente. Gratuito.",
      },
      {
        label: "Firebase Cloud Functions — exclusão em cascata",
        detail:
          "Ao receber solicitação do paciente, função dedicada deleta todos os seus dados: perfil, histórico de dieta, logs e dados hormonais. Tudo de uma vez, auditado.",
      },
      {
        label: "Firebase Auth — remoção de conta",
        detail:
          "Deleta a conta de autenticação junto com os dados, impedindo qualquer reacesso futuro.",
      },
      {
        label: "Google Cloud Storage — backup 30 dias",
        detail:
          "Arquivo encriptado dos dados do paciente gerado antes da exclusão, retido por 30 dias em bucket privado. Proteção contra exclusão acidental ou contestação posterior.",
      },
    ],
  },
];

const infra = {
  lgpd: {
    label: "LGPD & Compliance Jurídico",
    tool: "AWS KMS / SSL Let's Encrypt",
    cost: "Baixo custo — Free Tier com limites",
    detail:
      "Camada jurídica e de conformidade. Cobre consentimento do titular, base legal para tratamento de dados sensíveis de saúde, política de privacidade e direitos do paciente. O Free Tier da AWS mudou em 2025 — novos usuários recebem US$ 100 em créditos por 6 meses.",
  },
  fontes: [
    {
      label: "WhatsApp do Paciente",
      tool: "WhatsApp Business API + Bot (Z-API / Typebot)",
      cost: "Baixo custo variável por mensagem",
      detail:
        "Entrada de dados via bot automatizado. Baixa fricção para o paciente — ele já usa o WhatsApp. Z-API é uma alternativa brasileira mais acessível que Twilio. Typebot oferece plano gratuito com até 200 chats/mês.",
    },
    {
      label: "Planilha do Nutricionista",
      tool: "Google Sheets API",
      cost: "Grátis",
      detail:
        "O nutricionista mantém o hábito atual; o sistema lê os dados sem mudar a rotina dele. Limite de 300 requisições de leitura por minuto — mais que suficiente para o MVP.",
    },
    {
      label: "Base USDA / TACO",
      tool: "USDA FoodData Central API + TACO API (codivatech)",
      cost: "Grátis",
      detail:
        "USDA FoodData Central: gratuita, oficial, verificada pelo governo americano. TACO: API RESTful da UNICAMP via codivatech.com ou importação direta do JSON/CSV no GitHub — gratuito.",
    },
  ],
  entradas: [
    {
      label: "Dados / Hormonal",
      tool: "React Hook Form + Node + Firebase + Interface",
      cost: "Grátis → Blaze ao escalar",
      detail:
        "Formulário inteligente via app/web. React Hook Form captura e valida os campos, Node processa, Firebase armazena em tempo real. Plano Spark gratuito cobre o MVP.",
    },
    {
      label: "Wearables",
      tool: "Terra API — Sandbox",
      cost: "Gratuito no MVP",
      detail:
        "Sandbox gratuito para desenvolvimento e testes. Integração futura com Apple Watch, Garmin e Oura quando escalar.",
    },
    {
      label: "Stress / Subjetivo",
      tool: "Firebase Messaging (FCM) + formulário in-app",
      cost: "Grátis",
      detail:
        "Notificação push 100% gratuita via FCM. Paciente responde escala 1–5 diretamente no app. Variável-chave que revela padrões invisíveis na dieta e sono.",
    },
  ],
  processamento: [
    {
      label: "Engine de IA",
      tool: "OpenAI API — modelo mini",
      cost: "~R$ 8 / mês por 1M tokens",
      detail:
        "US$ 0,15 por milhão de tokens de entrada e US$ 0,60 por milhão de saída. Para um MVP com dezenas de pacientes, o custo mensal fica abaixo de R$ 8.",
    },
    {
      label: "Backend Serverless",
      tool: "Firebase Cloud Functions",
      cost: "Grátis → pay-as-you-go ao escalar",
      detail:
        "Plano Spark inclui 2 milhões de invocações/mês, 50.000 leituras Firestore/dia, 20.000 escritas/dia, 1GB de storage e 10.000 autenticações/mês.",
    },
  ],
  saidas: [
    {
      label: "Dashboard BI",
      tool: "Looker Studio",
      cost: "Grátis",
      detail:
        "100% gratuito. Conecta direto com Google Sheets e Firebase/Firestore. Dashboards dinâmicos compartilhados por link — o nutricionista acessa no navegador sem instalar nada.",
    },
    {
      label: "Relatórios PDF",
      tool: "WeasyPrint (Python)",
      cost: "Grátis",
      detail:
        "Converte HTML do relatório diretamente em PDF. Gratuito, open source, sem dependência externa.",
    },
  ],
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function Arrow() {
  return (
    <div
      style={{
        textAlign: "center",
        margin: "0.2rem 0",
        fontSize: "1.1rem",
        color: "#334155",
      }}
    >
      ▼
    </div>
  );
}

function Section({ label, color, children }) {
  const rgb = hexToRgb(color);
  return (
    <div
      style={{
        border: `1px solid rgba(${rgb},0.3)`,
        borderRadius: 12,
        padding: "1rem",
        background: `rgba(${rgb},0.02)`,
      }}
    >
      <div
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.25em",
          color,
          fontWeight: 700,
          marginBottom: "0.8rem",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span style={{ flex: 1, height: 1, background: `rgba(${rgb},0.3)` }} />
        {label}
        <span style={{ flex: 1, height: 1, background: `rgba(${rgb},0.3)` }} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "0.7rem",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Card({ item, color }) {
  const [open, setOpen] = useState(false);
  const rgb = hexToRgb(color);
  return (
    <div
      onClick={() => setOpen((v) => !v)}
      style={{
        background: open ? `rgba(${rgb},0.13)` : `rgba(${rgb},0.05)`,
        border: `1px solid rgba(${rgb},${open ? 0.7 : 0.22})`,
        borderRadius: 8,
        padding: "0.85rem",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!open) e.currentTarget.style.borderColor = `rgba(${rgb},0.55)`;
      }}
      onMouseLeave={(e) => {
        if (!open) e.currentTarget.style.borderColor = `rgba(${rgb},0.22)`;
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#fff",
          marginBottom: "0.25rem",
        }}
      >
        {item.label}
      </div>
      <div
        style={{
          fontSize: "0.65rem",
          color,
          fontWeight: 700,
          marginBottom: "0.2rem",
        }}
      >
        {item.tool}
      </div>
      {!open && (
        <div
          style={{ fontSize: "0.58rem", color: "#fbbf24", marginTop: "0.2rem" }}
        >
          💰 {item.cost}
        </div>
      )}
      {open && (
        <div
          style={{
            marginTop: "0.65rem",
            paddingTop: "0.6rem",
            borderTop: `1px solid rgba(${rgb},0.2)`,
          }}
        >
          <div
            style={{
              fontSize: "0.6rem",
              color: "#fbbf24",
              marginBottom: "0.4rem",
            }}
          >
            💰 {item.cost}
          </div>
          <div
            style={{ fontSize: "0.6rem", color: "#cbd5e1", lineHeight: 1.6 }}
          >
            {item.detail}
          </div>
        </div>
      )}
    </div>
  );
}

function SecCard({ item }) {
  const [open, setOpen] = useState(false);
  const rgb = hexToRgb(item.color);

  return (
    <div
      style={{
        background: `rgba(${rgb},0.04)`,
        border: `1px solid rgba(${rgb},0.2)`,
        borderRadius: 8,
        padding: "0.9rem",
        transition: "all 0.2s",
      }}
    >
      <div style={{ fontSize: "1.3rem", marginBottom: "0.3rem" }}>
        {item.icon}
      </div>
      <div
        style={{
          fontSize: "0.73rem",
          fontWeight: 700,
          color: item.color,
          marginBottom: "0.35rem",
        }}
      >
        {item.label}
      </div>
      <div
        style={{
          fontSize: "0.6rem",
          color: "#94a3b8",
          lineHeight: 1.5,
          marginBottom: "0.6rem",
        }}
      >
        {item.desc}
      </div>

      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          cursor: "pointer",
          padding: "0.25rem 0.5rem",
          borderRadius: 4,
          background: `rgba(${rgb},0.1)`,
          border: `1px solid rgba(${rgb},0.2)`,
          marginBottom: open ? "0.6rem" : 0,
        }}
      >
        <span
          style={{
            fontSize: "0.55rem",
            color: item.color,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {open ? "▲ ocultar" : "▼ ver ferramentas"}
        </span>
      </div>

      {open && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}
        >
          {item.tools.map((t, i) => (
            <div
              key={i}
              style={{
                background: `rgba(${rgb},0.08)`,
                border: `1px solid rgba(${rgb},0.22)`,
                borderRadius: 6,
                padding: "0.6rem 0.7rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: item.color,
                  marginBottom: "0.2rem",
                }}
              >
                {t.label}
              </div>
              <div
                style={{
                  fontSize: "0.58rem",
                  color: "#cbd5e1",
                  lineHeight: 1.5,
                }}
              >
                {t.detail}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [lgpdOpen, setLgpdOpen] = useState(false);
  const [secOpen, setSecOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080c14",
        fontFamily: "'Courier New', monospace",
        color: "#e2e8f0",
        padding: "2rem 1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: "#00e5ff",
              marginBottom: "0.4rem",
              textTransform: "uppercase",
            }}
          >
            l.AI Soluções — ARQUITETURA DE SOFTWARE
          </div>
          <h1
            style={{
              fontSize: "clamp(1.3rem, 4vw, 1.9rem)",
              fontWeight: 700,
              margin: 0,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            Stack de Baixo Custo
          </h1>
          <div
            style={{
              width: 50,
              height: 2,
              background: "linear-gradient(90deg, #00e5ff, #69ff47)",
              margin: "0.7rem auto 0",
            }}
          />
        </div>

        {/* Badges */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "0.2rem",
          }}
        >
          <div
            onClick={() => setSecOpen((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: secOpen
                ? "rgba(244,63,94,0.12)"
                : "rgba(244,63,94,0.05)",
              border: "1px solid rgba(244,63,94,0.35)",
              borderRadius: 8,
              padding: "0.45rem 0.8rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: "0.9rem" }}>🔐</span>
            <span
              style={{
                fontSize: "0.6rem",
                color: "#f43f5e",
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              SEGURANÇA DE DADOS
            </span>
          </div>
          <div
            onClick={() => setLgpdOpen((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: lgpdOpen
                ? "rgba(34,197,94,0.12)"
                : "rgba(34,197,94,0.05)",
              border: "1px solid rgba(34,197,94,0.35)",
              borderRadius: 8,
              padding: "0.45rem 0.8rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: "0.9rem" }}>⚖️</span>
            <span
              style={{
                fontSize: "0.6rem",
                color: "#22c55e",
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              LGPD · COMPLIANCE JURÍDICO
            </span>
          </div>
        </div>

        {/* Segurança expandida */}
        {secOpen && (
          <div
            style={{
              border: "1px solid rgba(244,63,94,0.3)",
              borderRadius: 12,
              padding: "1rem",
              background: "rgba(244,63,94,0.02)",
              marginBottom: "0.2rem",
            }}
          >
            <div
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                color: "#f43f5e",
                fontWeight: 700,
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.8rem",
              }}
            >
              <span
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(244,63,94,0.3)",
                }}
              />
              CAMADA DE SEGURANÇA — PROTEÇÃO DOS DADOS DOS USUÁRIOS
              <span
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(244,63,94,0.3)",
                }}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "0.7rem",
              }}
            >
              {seguranca.map((item, i) => (
                <SecCard key={i} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* LGPD expandida */}
        {lgpdOpen && (
          <div
            style={{
              background: "rgba(34,197,94,0.07)",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: 10,
              padding: "0.9rem 1rem",
              fontSize: "0.65rem",
              color: "#cbd5e1",
              lineHeight: 1.7,
              marginBottom: "0.2rem",
            }}
          >
            <strong style={{ color: "#22c55e" }}>{infra.lgpd.label}</strong>
            <br />
            {infra.lgpd.detail}
            <br />
            <span style={{ color: "#fbbf24" }}>💰 {infra.lgpd.cost}</span>
          </div>
        )}

        <Section label="1. Fontes de Alimentação" color="#ff6bff">
          {infra.fontes.map((f, i) => (
            <Card key={i} item={f} color="#ff6bff" />
          ))}
        </Section>
        <Arrow />
        <Section label="2. Entrada de Dados" color="#00e5ff">
          {infra.entradas.map((f, i) => (
            <Card key={i} item={f} color="#00e5ff" />
          ))}
        </Section>
        <Arrow />
        <Section label="3. Processamento — Cérebro IA" color="#a78bfa">
          {infra.processamento.map((f, i) => (
            <Card key={i} item={f} color="#a78bfa" />
          ))}
        </Section>
        <Arrow />
        <Section label="4. Saída & Dashboards" color="#69ff47">
          {infra.saidas.map((f, i) => (
            <Card key={i} item={f} color="#69ff47" />
          ))}
        </Section>

        {/* PROJEÇÃO */}
        <div
          style={{
            marginTop: "0.8rem",
            padding: "1.2rem 1.5rem",
            borderRadius: 12,
            background: "rgba(251,191,36,0.04)",
            border: "1px dashed rgba(251,191,36,0.35)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              color: "#fbbf24",
              fontWeight: 700,
              marginBottom: "0.7rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{ flex: 1, height: 1, background: "rgba(251,191,36,0.2)" }}
            />
            PROJEÇÃO FINANCEIRA
            <span
              style={{ flex: 1, height: 1, background: "rgba(251,191,36,0.2)" }}
            />
          </div>
          <div style={{ fontSize: "0.85rem", color: "#fff", lineHeight: 1.7 }}>
            Com mensalidade estimada entre{" "}
            <span style={{ color: "#fbbf24", fontWeight: 700 }}>
              R$ 50 a R$ 100
            </span>{" "}
            por paciente monitorado, o custo total das ferramentas representa{" "}
            <span style={{ color: "#22c55e", fontWeight: 700 }}>
              menos de 10% da receita
            </span>
            .
          </div>
          <div
            style={{
              fontSize: "0.58rem",
              color: "#64748b",
              marginTop: "0.7rem",
              fontStyle: "italic",
            }}
          >
            Alta margem operacional — modelo escalável desde o MVP.
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.55rem",
            color: "#1e293b",
            letterSpacing: "0.2em",
          }}
        >
          l.AI SOLUÇÕES © 2026 — ARQUITETURA PROPRIETÁRIA
        </div>
      </div>
    </div>
  );
}
