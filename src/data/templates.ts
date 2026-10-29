import { DecisionAnalysis } from '../types/decision';

export interface DecisionTemplate {
  id: string;
  title: string;
  category: string;
  context: string;
  timeHorizon: string;
  options: string[];
  priorityCriteria: string[];
  sampleAnalysis: DecisionAnalysis;
}

export const DECISION_TEMPLATES: DecisionTemplate[] = [
  {
    id: 'empleo-vs-startup',
    title: '¿Quedarme en un empleo corporativo sénior o co-fundar una startup tecnológica?',
    category: 'Carrera Profesional',
    context: 'Llevo 6 años como Tech Lead en una multinacional con salario de 85.000€, contrato indefinido y buena conciliación. Un ex-compañero me ofrece entrar como CTO cofundador en una startup B2B SaaS con 6 meses de runway y 15% de equity.',
    timeHorizon: 'Medio plazo (3-5 años)',
    options: ['Continuar en la Multinacional', 'Cofundar la Startup como CTO'],
    priorityCriteria: ['Crecimiento patrimonial', 'Calidad de vida y estrés', 'Aprendizaje exponencial', 'Riesgo financiero'],
    sampleAnalysis: {
      id: 'demo-carrera-startup',
      title: '¿Quedarme en un empleo corporativo sénior o co-fundar una startup tecnológica?',
      context: 'Llevo 6 años como Tech Lead en una multinacional con salario de 85.000€, contrato indefinido y buena conciliación. Un ex-compañero me ofrece entrar como CTO cofundador en una startup B2B SaaS con 6 meses de runway y 15% de equity.',
      timeHorizon: 'Medio plazo (3-5 años)',
      priorityCriteria: ['Crecimiento patrimonial', 'Calidad de vida y estrés', 'Aprendizaje exponencial', 'Riesgo financiero'],
      createdAt: '2026-10-25T14:30:00.000Z',
      status: 'pending',
      summary: 'Dilema clásico entre la asimetría positiva de alto riesgo/alta recompensa (startup) frente a la seguridad predecible y la conservación de capital (corporativo). La variable oculta no es el salario, sino tu tolerancia al agotamiento y el coste de oportunidad vital.',
      options: [
        {
          name: 'Continuar en la Multinacional',
          tagline: 'Seguridad financiera predecible y estabilidad de vida',
          pros: [
            { id: 'p1', point: 'Ingresos consolidados y capacidad de ahorro inmediata', weight: 5, rationale: '85.000€ brutos anuales permiten inversión pasiva sostenida sin angustia de liquidez.' },
            { id: 'p2', point: 'Horario acotado y preservación de salud mental', weight: 4, rationale: 'Jornadas de 40 horas que protegen el tiempo personal, relaciones y desconexión cognitiva.' },
            { id: 'p3', point: 'Baja probabilidad de quiebra personal o laboral', weight: 4, rationale: 'La multinacional tiene solidez demostrada en balances y menor volatilidad macro.' }
          ],
          cons: [
            { id: 'c1', point: 'Estancamiento en la curva de aprendizaje técnico', weight: 4, mitigation: 'Liderar proyectos piloto internos o certificarse en arquitecturas de nueva generación.' },
            { id: 'c2', point: 'Riesgo de arrepentimiento futuro ("¿Qué hubiera pasado?")', weight: 5, mitigation: 'Invertir como business angel o mentor en startups sin asumir dedicación a tiempo completo.' },
            { id: 'c3', point: 'Techo salarial lineal sin potencial multiplicador', weight: 3, mitigation: 'Negociar bonos por objetivos y planes de stock options corporativas.' }
          ],
          swot: {
            strengths: ['Reputación de marca corporativa', 'Respaldo financiero y prestaciones sociales', 'Red de contactos internos ya consolidada'],
            weaknesses: ['Burocracia en la toma de decisiones', 'Ritmo de innovación lento por política interna', 'Pérdida paulatina de agilidad técnica'],
            opportunities: ['Ascenso a dirección de ingeniería a 2 años', 'Transferencia internacional si se desea movilidad', 'Apalancamiento de capital en inversiones paralelas'],
            threats: ['Reestructuraciones corporativas globales imprevistas', 'Obsolescencia si la empresa ralentiza adopción tecnológica']
          }
        },
        {
          name: 'Cofundar la Startup como CTO',
          tagline: 'Asimetría positiva, aprendizaje acelerado y propiedad real',
          pros: [
            { id: 'p4', point: 'Curva de aprendizaje 10x en liderazgo y producto', weight: 5, rationale: 'Construir desde cero obliga a dominar arquitectura, negocio, contratación y ventas técnicas.' },
            { id: 'p5', point: 'Participación societaria (15% equity) con potencial multiplicador', weight: 5, rationale: 'Si la empresa alcanza una valoración de 20M€, la participación representa un salto de patrimonio neto.' },
            { id: 'p6', point: 'Autonomía absoluta en decisiones técnicas y cultura', weight: 4, rationale: 'Sin comités ni aprobación de terceros para definir el stack y la visión de ingeniería.' }
          ],
          cons: [
            { id: 'c4', point: 'Runway muy corto (6 meses) con alto riesgo de caja', weight: 5, mitigation: 'Exigir un pacto de socios donde se fije un sueldo mínimo de supervivencia y cláusulas de salida claras.' },
            { id: 'c5', point: 'Carga de estrés extrema y riesgo de burnout', weight: 4, mitigation: 'Definir límites no negociables desde el día 1 con el CEO y rutinas de ejercicio diarias.' },
            { id: 'c6', point: 'Coste de oportunidad salarial de al menos 50.000€ el primer año', weight: 4, mitigation: 'Calcular fondo de emergencia personal que cubra 12 meses de gastos antes de dar el salto.' }
          ],
          swot: {
            strengths: ['Velocidad de ejecución sin fricciones', 'Alineamiento total de incentivos con el equity', 'Pasión y compromiso fundacional'],
            weaknesses: ['Dependencia extrema del levantamiento de la siguiente ronda', 'Falta de estructura de soporte y RRHH', 'Vulnerabilidad ante fallos de tracción inicial'],
            opportunities: ['Crear un producto de referencia en el nicho B2B SaaS', 'Posicionamiento como CTO fundador en el ecosistema emprendedor', 'Construir un equipo técnico a medida con estándares modernos'],
            threats: ['Endurecimiento del mercado de capital riesgo (venture capital)', 'Desavenencias tempranas entre cofundadores en el pacto de socios']
          }
        }
      ],
      comparisonTable: {
        criteria: [
          {
            id: 'cr1',
            name: 'Potencial Financiero Máximo',
            category: 'Finanzas',
            defaultWeight: 5,
            scores: [
              { optionName: 'Continuar en la Multinacional', score: 6, comment: 'Crecimiento predecible del 5-8% anual con bonus' },
              { optionName: 'Cofundar la Startup como CTO', score: 9.5, comment: 'Retorno asimétrico exponencial en caso de exit' }
            ]
          },
          {
            id: 'cr2',
            name: 'Tranquilidad y Calidad de Vida',
            category: 'Bienestar',
            defaultWeight: 4,
            scores: [
              { optionName: 'Continuar en la Multinacional', score: 8.5, comment: 'Horario previsible, desconexión en fines de semana' },
              { optionName: 'Cofundar la Startup como CTO', score: 3.5, comment: 'Disponibilidad casi 24/7 y presión constante por métricas' }
            ]
          },
          {
            id: 'cr3',
            name: 'Aceleración de Habilidades',
            category: 'Crecimiento',
            defaultWeight: 4,
            scores: [
              { optionName: 'Continuar en la Multinacional', score: 5, comment: 'Especialización en procesos a gran escala' },
              { optionName: 'Cofundar la Startup como CTO', score: 9.5, comment: 'Máster intensivo en negocio, código y producto simultáneo' }
            ]
          },
          {
            id: 'cr4',
            name: 'Reversibilidad de la Decisión',
            category: 'Riesgo',
            defaultWeight: 5,
            scores: [
              { optionName: 'Continuar en la Multinacional', score: 6.5, comment: 'Fácil quedarse, pero la oportunidad con este cofundador caduca' },
              { optionName: 'Cofundar la Startup como CTO', score: 8, comment: 'Un perfil sénior con experiencia de CTO siempre es re-contratable en el mercado corporativo' }
            ]
          },
          {
            id: 'cr5',
            name: 'Control sobre el Destino Profesional',
            category: 'Autonomía',
            defaultWeight: 3,
            scores: [
              { optionName: 'Continuar en la Multinacional', score: 4.5, comment: 'Sujeto a decisiones de la matriz corporativa' },
              { optionName: 'Cofundar la Startup como CTO', score: 9, comment: 'Tú defines prioridades, estrategia y código' }
            ]
          }
        ]
      },
      tiebreakerVerdict: {
        recommendedOption: 'Cofundar la Startup como CTO',
        confidenceScore: 84,
        headline: 'La alta reversibilidad profesional neutraliza el riesgo financiero.',
        coreRationale: 'El mercado de ingeniería de software valora extraordinariamente a un Tech Lead que ha fundado y liderado como CTO, incluso si la startup no triunfa. Por tanto, tu riesgo a la baja está acotado (puedes volver a un puesto corporativo sénior en menos de 90 días), mientras que tu beneficio al alza —patrimonial, de red y de aprendizaje— es infinitamente mayor. Quedarte en el empleo tiene un riesgo oculto: el arrepentimiento por inacción.',
        decisiveTiebreakerFactor: '¿Tienes ahorros personales para subsistir 12 meses sin percibir salario completo? Si la respuesta es SÍ, la decisión racional e irrepetible es la Startup.',
        devilsAdvocate: 'Si la startup quiebra a los 6 meses por no cerrar la ronda Seed, habrás sacrificado 40.000€ de sueldo y acumulado agotamiento. Contramedida: pon como condición innegociable cerrar una nota convertible puente de al menos 100k€ antes de presentar tu baja formal.',
        tenTenTenRule: {
          in10Minutes: 'Sentirás un vértigo intenso y dudas agudas al redactar la renuncia.',
          in10Months: 'Estarás en plena batalla de tracción; cansadísimo, pero con una agudeza mental y motivación que nunca tuviste en la multinacional.',
          in10Years: 'Independientemente del resultado financiero, recordarás este salto como el punto de inflexión donde tomaste las riendas de tu carrera.'
        },
        actionPlan: [
          { step: 1, title: 'Auditoría de finanzas personales', detail: 'Verificar que dispones de 12 meses de colchón de gastos mínimos fijos.', deadline: 'Próximas 24 horas' },
          { step: 2, title: 'Borrador de Pacto de Socios (Term Sheet)', detail: 'Exigir 15% de equity con vesting a 4 años, 1 año de cliff y cláusula de aceleración por venta.', deadline: 'Próximos 3 días' },
          { step: 3, title: 'Entrevista con los inversores actuales', detail: 'Reunirte con quien financia los 6 meses de runway para evaluar su apetito de follow-on.', deadline: 'Próxima semana' }
        ]
      }
    }
  },
  {
    id: 'vivienda-comprar-vs-alquilar',
    title: '¿Comprar un piso de 320.000€ con hipoteca a 30 años o seguir alquilando e invirtiendo en indexados?',
    category: 'Finanzas Personales',
    context: 'Tenemos 75.000€ ahorrados. El alquiler actual es de 1.100€/mes. El piso deseado cuesta 320.000€ + gastos (32.000€). La cuota de hipoteca fija calculada rondaría los 1.050€/mes más IBI y comunidad.',
    timeHorizon: 'Largo plazo (10+ años)',
    options: ['Comprar la Vivienda', 'Seguir Alquilando e Invertir en Fondos Indexados'],
    priorityCriteria: ['Tranquilidad psicológica', 'Liquidez y flexibilidad', 'Rentabilidad total esperada', 'Protección contra inflación'],
    sampleAnalysis: {
      id: 'demo-vivienda',
      title: '¿Comprar un piso de 320.000€ con hipoteca a 30 años o seguir alquilando e invirtiendo en indexados?',
      context: 'Tenemos 75.000€ ahorrados. El alquiler actual es de 1.100€/mes. El piso deseado cuesta 320.000€ + gastos (32.000€). La cuota de hipoteca fija calculada rondaría los 1.050€/mes más IBI y comunidad.',
      timeHorizon: 'Largo plazo (10+ años)',
      priorityCriteria: ['Tranquilidad psicológica', 'Liquidez y flexibilidad', 'Rentabilidad total esperada', 'Protección contra inflación'],
      createdAt: '2026-10-26T10:15:00.000Z',
      status: 'pending',
      summary: 'Una confrontación entre la estabilidad emocional de la propiedad y el apalancamiento hipotecario frente a la liquidez pura, la libertad geográfica y el interés compuesto del mercado bursátil global.',
      options: [
        {
          name: 'Comprar la Vivienda',
          tagline: 'Hogar asegurado, apalancamiento a tipo fijo y ahorro forzoso',
          pros: [
            { id: 'pv1', point: 'Inmunidad frente a subidas abusivas del alquiler o desahucios al vencer contrato', weight: 5, rationale: 'Nadie puede rescindir tu derecho a habitar la vivienda, garantizando estabilidad.' },
            { id: 'pv2', point: 'Apalancamiento financiero positivo con inflación', weight: 4, rationale: 'Una deuda a tipo fijo se devalúa en términos reales con la inflación mientras el inmueble tiende a retener valor.' },
            { id: 'pv3', point: 'Libertad absoluta para reformar y adaptar el espacio a tu gusto', weight: 4, rationale: 'Capacidad de inversión en confort y eficiencia sin pedir permiso a un arrendador.' }
          ],
          cons: [
            { id: 'cv1', point: 'Costes de transacción irrecuperables (impuestos + notaría ~10%)', weight: 5, mitigation: 'Exclusivamente viable si la intención de permanencia supera los 7-8 años.' },
            { id: 'cv2', point: 'Gastos ocultos perpetuos: IBI, comunidad y derramas imprevistas', weight: 4, mitigation: 'Añadir un 1.5% del valor del inmueble al año como provisión de mantenimiento.' },
            { id: 'cv3', point: 'Iliquidez total y pérdida de flexibilidad geográfica ante cambios laborales', weight: 4, mitigation: 'Comprar en una zona de alta demanda donde sea viable alquilarlo si surge mudanza.' }
          ],
          swot: {
            strengths: ['Activo tangible', 'Fija el coste habitacional durante 30 años', 'Patrimonio transmisible'],
            weaknesses: ['Concentración de patrimonio en un único activo físico y localización', 'Consumo del 90% de los ahorros líquidos actuales'],
            opportunities: ['Posible plusvalía por desarrollo urbanístico de la zona', 'Rehipotecar o amortizar anticipadamente si bajan los costes'],
            threats: ['Deterioro del barrio o problemas comunitarios no anticipados', 'Riesgo de derramas estructurales costosas']
          }
        },
        {
          name: 'Seguir Alquilando e Invertir en Fondos Indexados',
          tagline: 'Máxima liquidez, diversificación mundial y cero ataduras',
          pros: [
            { id: 'pv4', point: 'Conservación íntegra de la liquidez (75.000€ invertidos y disponibles)', weight: 5, rationale: 'Un fondo MSCI World ofrece diversificación en miles de empresas sin ataduras de ladrillo.' },
            { id: 'pv5', point: 'Flexibilidad absoluta para mudarse si cambia el trabajo o la vida familiar', weight: 4, rationale: 'Basta con preavisar 30 días para cambiar de barrio, ciudad o país.' },
            { id: 'pv6', point: 'Cero quebraderos de cabeza por reparaciones de caldera, tejados o IBI', weight: 3, rationale: 'Toda avería estructural corresponde legalmente al propietario.' }
          ],
          cons: [
            { id: 'cv4', point: 'Sensación de provisionalidad e incertidumbre al término del contrato', weight: 4, mitigation: 'Negociar contratos de larga duración con propietarios institucionales o transparentes.' },
            { id: 'cv5', point: 'Riesgo de no invertir religiosamente la diferencia y gastarla en consumo', weight: 5, mitigation: 'Automatizar transferencia de ahorro indexado el mismo día de cobro de nómina.' }
          ],
          swot: {
            strengths: ['Liquidez en 48 horas', 'Interés compuesto libre de fricción de mantenimiento físico'],
            weaknesses: ['Sin escudo frente a aumentos generalizados del alquiler en la ciudad'],
            opportunities: ['Aprovechar oportunidades de inversión globales en caídas de mercado'],
            threats: ['Mercado de alquiler tenso con escasez de oferta accesible']
          }
        }
      ],
      comparisonTable: {
        criteria: [
          {
            id: 'crv1',
            name: 'Paz Mental y Estabilidad Vital',
            category: 'Bienestar',
            defaultWeight: 5,
            scores: [
              { optionName: 'Comprar la Vivienda', score: 9, comment: 'Saber que es tu casa definitiva reduce el estrés habitacional' },
              { optionName: 'Seguir Alquilando e Invertir en Fondos Indexados', score: 5.5, comment: 'Dependencia del casero y revisiones periódicas' }
            ]
          },
          {
            id: 'crv2',
            name: 'Rentabilidad Financiera Neta Histórica',
            category: 'Finanzas',
            defaultWeight: 4,
            scores: [
              { optionName: 'Comprar la Vivienda', score: 6.5, comment: 'Retorno neto moderado tras impuestos y mantenimiento (~3-5% real)' },
              { optionName: 'Seguir Alquilando e Invertir en Fondos Indexados', score: 8.5, comment: 'Bolsa global históricamente ~7-8% anualizado a 15+ años' }
            ]
          },
          {
            id: 'crv3',
            name: 'Liquidez y Margen de Maniobra',
            category: 'Flexibilidad',
            defaultWeight: 4,
            scores: [
              { optionName: 'Comprar la Vivienda', score: 3, comment: 'Vender un piso tarda meses y acarrea gastos considerables' },
              { optionName: 'Seguir Alquilando e Invertir en Fondos Indexados', score: 9.5, comment: 'Fondos accesibles con un click en cualquier momento' }
            ]
          }
        ]
      },
      tiebreakerVerdict: {
        recommendedOption: 'Comprar la Vivienda',
        confidenceScore: 78,
        headline: 'El horizonte de más de 7 años y la cuota fija inclinan la balanza hacia la propiedad.',
        coreRationale: 'Cuando la cuota hipotecaria mensual (1.050€) es inferior al alquiler de mercado (1.100€) y tienes previsión de permanencia en la ciudad durante más de 7 años, el apalancamiento hipotecario a tipo fijo actúa como una cobertura excepcional contra la inflación inmobiliaria.',
        decisiveTiebreakerFactor: '¿Tienes garantizado con 85% de probabilidad que vivirás en esa misma ciudad los próximos 7 años? Si es SÍ, comprar es la opción superior.',
        devilsAdvocate: 'La compra absorbe casi el 100% de tu colchón de 75.000€ (entrada + gastos). Contramedida: No desembolses todo; asegura que te queden al menos 15.000€ en cuenta remunerada como fondo intocable de emergencia.',
        tenTenTenRule: {
          in10Minutes: 'Alivio por dejar de ver pisos y firmar la oferta.',
          in10Months: 'Satisfacción al decorar y adaptar tu vivienda propia.',
          in10Years: 'Habrás amortizado un tercio del préstamo a moneda más devaluada mientras tu patrimonio neto creció con el activo.'
        },
        actionPlan: [
          { step: 1, title: 'Presupuesto con gastos desglosados', detail: 'Calcular Notaría, ITP (Impuesto Transmisiones) y provisión exacta.', deadline: 'Hoy' },
          { step: 2, title: 'Pedir 3 ofertas vinculantes de hipoteca fija', detail: 'Comparar TIN y TAE sin productos vinculados abusivos.', deadline: '48 horas' },
          { step: 3, title: 'Revisión en el Registro de la Propiedad', detail: 'Solicitar nota simple para confirmar que la vivienda no tiene cargas ni embargos.', deadline: 'Esta semana' }
        ]
      }
    }
  }
];
