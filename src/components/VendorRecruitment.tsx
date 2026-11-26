import React from 'react';
import { DollarSign, Award, TrendingUp, Briefcase } from 'lucide-react';
import { VendorApplication } from '../types';
import { RecruitmentChat } from './RecruitmentChat';

// "Trabaja con nosotros": el formulario se reemplazó por un chat con VictoriA (IA) que recoge los
// datos y los pasa a la Lic. Verónica Alderete. La prop se mantiene para no tocar App.tsx.
interface VendorRecruitmentProps {
  onRegisterVendor?: (vendor: Omit<VendorApplication, 'id' | 'estado' | 'fecha'>) => void;
}

export const VendorRecruitment: React.FC<VendorRecruitmentProps> = () => {
  return (
    <section id="vendedores" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Izquierda: propuesta de valor */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-emerald-400 text-xs font-bold">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              <span>Red de Asesores Inmobiliarios CADIS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Trabaja con nosotros <br />
              <span className="text-emerald-700">como Asesor CADIS</span>
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Vende mini quintas del <strong>Proyecto Río Bonito en Limoncito</strong> por tu cuenta, sin horario ni
              exclusividad. Conversa con VictoriA, nuestra asistente virtual, y te registramos.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="p-2 rounded-lg bg-emerald-100 shrink-0 mt-0.5">
                  <DollarSign className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Comisión del 5 % por venta</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Cobras USD 450 por cada mini quinta de USD 9.000, en un solo pago, cuando tu cliente completa su
                    cuota inicial del 30 %.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="p-2 rounded-lg bg-sky-100 shrink-0 mt-0.5">
                  <TrendingUp className="w-5 h-5 text-sky-700" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Cierre fácil con Crédito Directo</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Terrenos desde USD 9.000, cuota inicial en 3 meses sin interés y planes de 2 y 3 años: tus clientes
                    cierran más rápido.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="p-2 rounded-lg bg-amber-100 shrink-0 mt-0.5">
                  <Award className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Material oficial y visitas guiadas</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Te damos folletos, videos y el mapa en vivo, y coordinamos las visitas al predio. Tú no recibes
                    dinero de los clientes: todo pago va directo a CADIS.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Derecha: chat con VictoriA */}
          <div className="lg:col-span-6">
            <RecruitmentChat />
          </div>
        </div>
      </div>
    </section>
  );
};
