import { useState, useRef } from "react";

const STEPS = ["project", "details", "contact", "offerte"];

const projectTypes = [
  { id: "elektra", label: "Elektra & installatie", icon: "⚡" },
  { id: "loodgieterswerk", label: "Loodgieterswerk", icon: "🔧" },
  { id: "bouw", label: "Bouw & verbouw", icon: "🏗️" },
  { id: "hvac", label: "HVAC / klimaat", icon: "❄️" },
  { id: "schilderwerk", label: "Schilderwerk", icon: "🖌️" },
  { id: "vloeren", label: "Vloeren & afwerking", icon: "🪵" },
  { id: "dak", label: "Dakwerk", icon: "🏠" },
  { id: "overig", label: "Overig", icon: "⚙️" },
];

const urgencyOptions = [
  { id: "spoed", label: "Spoed (< 1 week)" },
  { id: "normaal", label: "Normaal (2-4 weken)" },
  { id: "flexibel", label: "Flexibel (> 1 maand)" },
];

const scaleSizes = [
  { id: "klein", label: "Klein", sub: "< €5.000" },
  { id: "middel", label: "Middel", sub: "€5k – €25k" },
  { id: "groot", label: "Groot", sub: "€25k – €100k" },
  { id: "xl", label: "XL", sub: "> €100k" },
];

export default function CalcApp() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    projectType: "",
    projectTypeLabel: "",
    description: "",
    location: "",
    urgency: "",
    scale: "",
    naam: "",
    bedrijf: "",
    email: "",
    telefoon: "",
  });
  const [offerte, setOfferte] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const offerteRef = useRef(null);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const canNext = () => {
    if (step === 0) return !!form.projectType;
    if (step === 1) return form.description.length > 10 && form.urgency && form.scale;
    if (step === 2) return form.naam && form.email;
    return false;
  };

  const generateOfferte = async () => {
    setLoading(true);
    setError("");
    try {
      const prompt = `Jij bent een professionele calculator van CalcAI, een AI-platform voor bouw- en installatiecalculaties in Nederland. 
Genereer een gedetailleerde, realistische offerte in het Nederlands op basis van de volgende klantgegevens:

- Type werk: ${form.projectTypeLabel}
- Projectomschrijving: ${form.description}
- Locatie: ${form.location || "niet opgegeven"}
- Urgentie: ${form.urgency}
- Geschatte projectschaal: ${form.scale}
- Klantnaam: ${form.naam}
- Bedrijf: ${form.bedrijf || "particulier"}

Maak een professionele offerte met:
1. Een korte introductie gericht aan de klant
2. Een gedetailleerde werkzaamhedenlijst met realistische prijzen (gebruik regels als: "Arbeidskosten: €X" / "Materialen: €X")
3. Een subtotaal, BTW (21%) en eindtotaal
4. Betalingsvoorwaarden (30% aanbetaling, 70% na oplevering)
5. Geldigheid: 30 dagen
6. Een professionele afsluiting

Gebruik markdown voor opmaak. Wees realistisch met prijzen voor de Nederlandse markt.`;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const text = data.result || "";
      setOfferte(text);
      setStep(3);
    } catch (e) {
      setError("Er ging iets mis. Probeer opnieuw.");
    }
    setLoading(false);
  };

  const renderMarkdown = (text) => {
    return text
      .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul class="md-ul">$1</ul>')
      .replace(/\n\n/g, '</p><p class="md-p">')
      .replace(/^(.+)$/gm, (line) => {
        if (line.startsWith('<')) return line;
        return line;
      });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0e0e0e",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      color: "#f0ece4",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Barlow+Condensed:wght@600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .app-grid {
          background-image: 
            linear-gradient(rgba(255,165,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,165,0,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .step-btn {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          color: #888;
          padding: 12px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          transition: all 0.2s;
          text-align: left;
        }
        .step-btn:hover { border-color: #f97316; color: #f0ece4; }
        .step-btn.active {
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-color: #f97316;
          color: white;
          font-weight: 600;
        }

        .primary-btn {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 6px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
        }
        .primary-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(249,115,22,0.4); }
        .primary-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

        .secondary-btn {
          background: transparent;
          color: #888;
          border: 1px solid #2a2a2a;
          padding: 14px 24px;
          border-radius: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .secondary-btn:hover { color: #f0ece4; border-color: #444; }

        .field-input {
          background: #141414;
          border: 1px solid #2a2a2a;
          color: #f0ece4;
          padding: 12px 16px;
          border-radius: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          width: 100%;
          transition: border-color 0.2s;
          outline: none;
        }
        .field-input:focus { border-color: #f97316; }
        .field-input::placeholder { color: #444; }

        textarea.field-input { resize: vertical; min-height: 100px; }

        .md-h1, .md-h2, .md-h3 { margin: 16px 0 8px; color: #f97316; }
        .md-h1 { font-size: 20px; font-family: 'Barlow Condensed', sans-serif; }
        .md-h2 { font-size: 17px; font-family: 'Barlow Condensed', sans-serif; }
        .md-h3 { font-size: 15px; }
        .md-p { margin: 8px 0; line-height: 1.7; color: #ccc; }
        .md-ul { margin: 8px 0 8px 20px; }
        .md-ul li { margin: 4px 0; color: #bbb; line-height: 1.6; }

        .pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .fade-in {
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .progress-bar {
          height: 3px;
          background: #1a1a1a;
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f97316, #ea580c);
          border-radius: 2px;
          transition: width 0.5s ease;
        }
      `}</style>

      <div className="app-grid" style={{ minHeight: "100vh" }}>
        {/* Header */}
        <header style={{
          borderBottom: "1px solid #1e1e1e",
          padding: "0 40px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "rgba(14,14,14,0.95)",
          backdropFilter: "blur(8px)",
          zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 32, height: 32,
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>⚡</div>
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: 1,
              color: "#f0ece4",
            }}>CALC<span style={{ color: "#f97316" }}>AI</span></span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {step < 3 && (
              <span style={{ color: "#555", fontSize: 13 }}>
                Stap {step + 1} van 3
              </span>
            )}
          </div>
        </header>

        {/* Progress */}
        {step < 3 && (
          <div className="progress-bar" style={{ borderRadius: 0 }}>
            <div className="progress-fill" style={{ width: `${((step + 1) / 3) * 100}%` }} />
          </div>
        )}

        {/* Main */}
        <main style={{
          maxWidth: 740,
          margin: "0 auto",
          padding: "60px 24px",
        }}>

          {/* STEP 0: Project type */}
          {step === 0 && (
            <div className="fade-in">
              <div style={{ marginBottom: 48 }}>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 3,
                  color: "#f97316",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}>Stap 1 — Project</div>
                <h1 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 52,
                  fontWeight: 800,
                  lineHeight: 1.05,
                  color: "#f0ece4",
                  letterSpacing: -1,
                }}>Wat voor<br /><span style={{ color: "#f97316" }}>werk</span> is het?</h1>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 40,
              }}>
                {projectTypes.map((pt) => (
                  <button
                    key={pt.id}
                    className="step-btn"
                    style={form.projectType === pt.id ? {
                      background: "linear-gradient(135deg, #f97316, #ea580c)",
                      borderColor: "#f97316",
                      color: "white",
                      fontWeight: 600,
                    } : {}}
                    onClick={() => {
                      update("projectType", pt.id);
                      update("projectTypeLabel", pt.label);
                    }}
                  >
                    <span style={{ marginRight: 10 }}>{pt.icon}</span>
                    {pt.label}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  className="primary-btn"
                  disabled={!canNext()}
                  onClick={() => setStep(1)}
                >
                  Volgende →
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Details */}
          {step === 1 && (
            <div className="fade-in">
              <div style={{ marginBottom: 48 }}>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 3,
                  color: "#f97316",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}>Stap 2 — Details</div>
                <h1 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 52,
                  fontWeight: 800,
                  lineHeight: 1.05,
                  color: "#f0ece4",
                  letterSpacing: -1,
                }}>Vertel ons<br /><span style={{ color: "#f97316" }}>meer</span></h1>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 40 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                    Projectomschrijving *
                  </label>
                  <textarea
                    className="field-input"
                    placeholder="Beschrijf het werk zo specifiek mogelijk: wat moet er gebeuren, hoeveel m², bijzonderheden..."
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                    Locatie (stad)
                  </label>
                  <input
                    className="field-input"
                    placeholder="bijv. Amsterdam"
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                    Urgentie *
                  </label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {urgencyOptions.map((u) => (
                      <button
                        key={u.id}
                        className="step-btn"
                        style={{
                          flex: 1,
                          ...(form.urgency === u.id ? {
                            background: "linear-gradient(135deg, #f97316, #ea580c)",
                            borderColor: "#f97316",
                            color: "white",
                            fontWeight: 600,
                          } : {}),
                        }}
                        onClick={() => update("urgency", u.id)}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                    Geschatte projectgrootte *
                  </label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {scaleSizes.map((s) => (
                      <button
                        key={s.id}
                        className="step-btn"
                        style={{
                          flex: 1,
                          ...(form.scale === s.id ? {
                            background: "linear-gradient(135deg, #f97316, #ea580c)",
                            borderColor: "#f97316",
                            color: "white",
                            fontWeight: 600,
                          } : {}),
                        }}
                        onClick={() => update("scale", s.id)}
                      >
                        <div style={{ fontWeight: 700 }}>{s.label}</div>
                        <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>{s.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button className="secondary-btn" onClick={() => setStep(0)}>← Terug</button>
                <button className="primary-btn" disabled={!canNext()} onClick={() => setStep(2)}>
                  Volgende →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Contact */}
          {step === 2 && (
            <div className="fade-in">
              <div style={{ marginBottom: 48 }}>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 3,
                  color: "#f97316",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}>Stap 3 — Jouw gegevens</div>
                <h1 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 52,
                  fontWeight: 800,
                  lineHeight: 1.05,
                  color: "#f0ece4",
                  letterSpacing: -1,
                }}>Bijna<br /><span style={{ color: "#f97316" }}>klaar</span></h1>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 40 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                      Naam *
                    </label>
                    <input
                      className="field-input"
                      placeholder="Jan de Vries"
                      value={form.naam}
                      onChange={(e) => update("naam", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                      Bedrijf
                    </label>
                    <input
                      className="field-input"
                      placeholder="De Vries BV (optioneel)"
                      value={form.bedrijf}
                      onChange={(e) => update("bedrijf", e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                      E-mail *
                    </label>
                    <input
                      className="field-input"
                      placeholder="jan@devries.nl"
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                      Telefoon
                    </label>
                    <input
                      className="field-input"
                      placeholder="06-12345678"
                      value={form.telefoon}
                      onChange={(e) => update("telefoon", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div style={{
                background: "#141414",
                border: "1px solid #1e1e1e",
                borderRadius: 10,
                padding: 24,
                marginBottom: 32,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
                  Samenvatting
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    ["Type werk", form.projectTypeLabel],
                    ["Locatie", form.location || "Niet opgegeven"],
                    ["Urgentie", urgencyOptions.find(u => u.id === form.urgency)?.label],
                    ["Schaal", scaleSizes.find(s => s.id === form.scale)?.label],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 11, color: "#555", marginBottom: 2 }}>{k}</div>
                      <div style={{ fontSize: 14, color: "#ccc" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{ color: "#ef4444", fontSize: 14, marginBottom: 16 }}>{error}</div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button className="secondary-btn" onClick={() => setStep(1)}>← Terug</button>
                <button
                  className="primary-btn"
                  disabled={!canNext() || loading}
                  onClick={generateOfferte}
                  style={{ minWidth: 200, position: "relative" }}
                >
                  {loading ? (
                    <span className="pulse">Offerte genereren...</span>
                  ) : (
                    "⚡ Genereer Offerte"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Offerte result */}
          {step === 3 && (
            <div className="fade-in" ref={offerteRef}>
              <div style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 40,
                gap: 16,
                flexWrap: "wrap",
              }}>
                <div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 3,
                    color: "#f97316",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}>✓ Offerte gereed</div>
                  <h1 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 44,
                    fontWeight: 800,
                    lineHeight: 1.05,
                    color: "#f0ece4",
                    letterSpacing: -1,
                  }}>Jouw<br /><span style={{ color: "#f97316" }}>offerte</span></h1>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button
                    className="secondary-btn"
                    onClick={() => {
                      setStep(0);
                      setForm({ projectType: "", projectTypeLabel: "", description: "", location: "", urgency: "", scale: "", naam: "", bedrijf: "", email: "", telefoon: "" });
                      setOfferte("");
                    }}
                  >
                    ↺ Nieuw
                  </button>
                  <button
                    className="primary-btn"
                    style={{ fontSize: 14, padding: "12px 20px" }}
                    onClick={() => window.print()}
                  >
                    ↓ Downloaden
                  </button>
                </div>
              </div>

              {/* Offerte card */}
              <div style={{
                background: "#111",
                border: "1px solid #222",
                borderRadius: 12,
                padding: "36px 40px",
                marginBottom: 32,
              }}>
                {/* Header */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  paddingBottom: 24,
                  borderBottom: "1px solid #1e1e1e",
                  marginBottom: 28,
                }}>
                  <div>
                    <div style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 800,
                      fontSize: 24,
                      color: "#f0ece4",
                      letterSpacing: 1,
                    }}>
                      CALC<span style={{ color: "#f97316" }}>AI</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
                      AI-calculaties voor bouw & installatie
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>Offertenummer</div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18, color: "#f97316" }}>
                      #{Math.floor(Math.random() * 9000) + 1000}-{new Date().getFullYear()}
                    </div>
                    <div style={{ fontSize: 12, color: "#555", marginTop: 8 }}>
                      {new Date().toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                  </div>
                </div>

                {/* Client info */}
                <div style={{
                  background: "#0e0e0e",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 28,
                  display: "flex",
                  gap: 32,
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Opgesteld voor</div>
                    <div style={{ fontWeight: 600, color: "#f0ece4" }}>{form.naam}</div>
                    {form.bedrijf && <div style={{ color: "#888", fontSize: 13 }}>{form.bedrijf}</div>}
                    <div style={{ color: "#666", fontSize: 13 }}>{form.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Type werk</div>
                    <div style={{ fontWeight: 600, color: "#f97316" }}>{form.projectTypeLabel}</div>
                    <div style={{ color: "#666", fontSize: 13 }}>{form.location}</div>
                  </div>
                </div>

                {/* AI Content */}
                <div style={{ lineHeight: 1.7, fontSize: 14 }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(offerte) }}
                />
              </div>

              {/* CTA */}
              <div style={{
                background: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(234,88,12,0.05))",
                border: "1px solid rgba(249,115,22,0.2)",
                borderRadius: 10,
                padding: "24px 28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: "#f0ece4", marginBottom: 4 }}>
                    Klaar om verder te gaan?
                  </div>
                  <div style={{ fontSize: 13, color: "#888" }}>
                    Upgrade naar Pro voor PDF-export, e-mailintegratie en klantportaal.
                  </div>
                </div>
                <button className="primary-btn" style={{ whiteSpace: "nowrap", fontSize: 14 }}>
                  Probeer Pro →
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
