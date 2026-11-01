import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RioBonitoSection } from './components/RioBonitoSection';
import { CreditSimulator } from './components/CreditSimulator';
import { PropertiesGallery } from './components/PropertiesGallery';
import { VendorRecruitment } from './components/VendorRecruitment';
import { NewsletterAndContact } from './components/NewsletterAndContact';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { ReferenceMapsSection } from './components/ReferenceMapsSection';
import { WhatsAppFloatingWidget } from './components/WhatsAppFloatingWidget';

import {
  INITIAL_PROPERTIES,
  INITIAL_SIMULATIONS,
  INITIAL_VENDORS,
  INITIAL_SUBSCRIBERS,
  INITIAL_RESERVATIONS,
  INITIAL_CHAT_INTERACTIONS
} from './data/initialData';

import {
  Property,
  CreditSimulation,
  VendorApplication,
  NewsletterSubscriber,
  ContactMessage,
  LotReservationRequest,
  ChatInteractionLog
} from './types';

import { CheckCircle2, X } from 'lucide-react';
import { 
  triggerSimulationEmailNotification, 
  triggerVendorEmailNotification, 
  getEmailNotificationConfig 
} from './utils/emailNotificationManager';

export default function App() {
  // Global State
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [simulations, setSimulations] = useState<CreditSimulation[]>(INITIAL_SIMULATIONS);
  const [vendors, setVendors] = useState<VendorApplication[]>(INITIAL_VENDORS);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(INITIAL_SUBSCRIBERS);
  const [reservations, setReservations] = useState<LotReservationRequest[]>(INITIAL_RESERVATIONS);
  const [chatInteractions, setChatInteractions] = useState<ChatInteractionLog[]>(INITIAL_CHAT_INTERACTIONS);

  // Admin Dashboard Modal State
  const [adminOpen, setAdminOpen] = useState(false);

  // Selected Lot for direct simulation preload
  const [selectedLotPrice, setSelectedLotPrice] = useState<number>(9000);
  const [selectedLotNumber, setSelectedLotNumber] = useState<string>('Lote RB-01');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -110;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Handler: Scroll directly to a specific property card in the gallery from the visual map
  const handleScrollToProperty = (propertyId: string) => {
    const cardElement = document.getElementById(`property-card-${propertyId}`);
    if (cardElement) {
      const yOffset = -110;
      const y = cardElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // Highlight the target property card with a prominent feedback ring
      cardElement.classList.add('ring-4', 'ring-emerald-500', 'shadow-2xl', 'scale-[1.02]');
      setTimeout(() => {
        cardElement.classList.remove('ring-4', 'ring-emerald-500', 'shadow-2xl', 'scale-[1.02]');
      }, 2500);
    } else {
      scrollToSection('propiedades');
    }
  };

  // Handler: Select Property from Gallery to simulate
  const handleSelectPropertyForSimulation = (prop: Property) => {
    setSelectedLotPrice(prop.precio);
    setSelectedLotNumber(prop.loteNumero);
    showToast(`Lote ${prop.loteNumero} cargado en el simulador ($${prop.precio.toLocaleString()} USD)`);
    scrollToSection('simulador');
  };

  // Handler: Save Simulation from Lead Form
  const handleSaveSimulation = (simulationData: Omit<CreditSimulation, 'id' | 'fecha' | 'estado'>) => {
    const newSimulation: CreditSimulation = {
      ...simulationData,
      id: `sim-${Date.now()}`,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
      estado: 'nuevo'
    };

    setSimulations((prev) => [newSimulation, ...prev]);

    // Email Notification Trigger for Developer / Admin
    const emailConfig = getEmailNotificationConfig();
    if (emailConfig.notifyOnSimulation) {
      triggerSimulationEmailNotification(newSimulation);
      showToast(`¡Simulación guardada! Reporte enviado al correo del administrador (${emailConfig.recipientEmail}).`);
    } else {
      showToast('¡Simulación registrada en el Panel de Administración!');
    }
  };

  // Handler: Save Lot Reservation Request (from interactive map: reservar/comprar/agendar_visita)
  const handleSaveReservation = (data: Omit<LotReservationRequest, 'id' | 'fecha' | 'estado'>) => {
    const newReservation: LotReservationRequest = {
      ...data,
      id: `res-${Date.now()}`,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
      estado: 'pendiente'
    };

    setReservations((prev) => [newReservation, ...prev]);
    showToast(`¡Solicitud registrada para ${data.loteNumero}! Te contactaremos por WhatsApp.`);
  };

  // Handler: Log a completed guided-chat qualifying interaction
  const handleLogChatInteraction = (data: Omit<ChatInteractionLog, 'id' | 'fecha' | 'estado'>) => {
    const newInteraction: ChatInteractionLog = {
      ...data,
      id: `chat-${Date.now()}`,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
      estado: 'nuevo'
    };

    setChatInteractions((prev) => [newInteraction, ...prev]);
  };

  // Handler: Register Vendor Application
  const handleRegisterVendor = (vendorData: Omit<VendorApplication, 'id' | 'estado' | 'fecha'>) => {
    const newVendor: VendorApplication = {
      ...vendorData,
      id: `vend-${Date.now()}`,
      estado: 'pendiente',
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setVendors((prev) => [newVendor, ...prev]);

    // Email Notification Trigger for Developer / Admin
    const emailConfig = getEmailNotificationConfig();
    if (emailConfig.notifyOnVendorApplication) {
      triggerVendorEmailNotification(newVendor);
      showToast(`¡Postulación recibida! Ficha enviada al correo del administrador (${emailConfig.recipientEmail}).`);
    } else {
      showToast('¡Postulación de vendedor recibida! Evaluándose en el Panel Admin.');
    }
  };

  // Handler: Newsletter Subscription
  const handleSubscribeNewsletter = (email: string) => {
    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email,
      fecha: new Date().toISOString().substring(0, 10)
    };
    setSubscribers((prev) => [newSub, ...prev]);
    showToast('¡Gracias por suscribirte al boletín de ofertas!');
  };

  // Handler: Contact Message
  const handleSendContactMessage = (msg: Omit<ContactMessage, 'id' | 'fecha'>) => {
    showToast('¡Mensaje enviado a CADIS! Un asesor te responderá pronto.');
  };

  // Admin Handlers
  const handleUpdateSimulationStatus = (id: string, newStatus: CreditSimulation['estado']) => {
    setSimulations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, estado: newStatus } : s))
    );
  };

  const handleUpdateVendorStatus = (id: string, newStatus: VendorApplication['estado']) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, estado: newStatus } : v))
    );
    showToast(`Estado de vendedor actualizado a "${newStatus}".`);
  };

  const handleUpdateReservationStatus = (id: string, newStatus: LotReservationRequest['estado']) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: newStatus } : r))
    );
  };

  const handleAddProperty = (newProp: Property) => {
    setProperties((prev) => [newProp, ...prev]);
    showToast(`Nueva propiedad "${newProp.titulo}" agregada.`);
  };

  const handleTogglePropertyStatus = (id: string, newStatus: Property['estado']) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              estado: newStatus,
              disponible: newStatus === 'disponible'
            }
          : p
      )
    );
  };

  const handleDeleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    showToast('Propiedad eliminada del catálogo.');
  };

  const handleUpdateProperty = (updatedProperty: Property) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === updatedProperty.id ? updatedProperty : p))
    );
    showToast(`Lote ${updatedProperty.loteNumero} actualizado correctamente.`);
  };

  const handleBulkImportProperties = (importedProperties: Property[], mode: 'append' | 'replace' = 'append') => {
    if (mode === 'replace') {
      setProperties(importedProperties);
      showToast(`Catálogo reemplazado exitosamente: ${importedProperties.length} propiedades importadas.`);
    } else {
      setProperties((prev) => {
        // Map by normalized loteNumero
        const existingMap = new Map<string, Property>();
        prev.forEach((p) => {
          existingMap.set(p.loteNumero.toLowerCase().trim(), p);
        });

        // Insert or update with imported properties
        importedProperties.forEach((newP) => {
          const key = newP.loteNumero.toLowerCase().trim();
          existingMap.set(key, newP);
        });

        return Array.from(existingMap.values());
      });
      showToast(`Importación exitosa: ${importedProperties.length} propiedades procesadas.`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 animate-in slide-in-from-top-3 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* A. Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* B. Hero Section (Promoción Principal: Proyecto "Río Bonito") */}
        <Hero
          properties={properties}
          onGoToSimulator={() => scrollToSection('simulador')}
          onGoToProperties={() => scrollToSection('propiedades')}
        />

        {/* Destacado: Proyecto Río Bonito en Limoncito */}
        <RioBonitoSection
          properties={properties}
          onScrollToProperty={handleScrollToProperty}
          onGoToSimulator={() => scrollToSection('simulador')}
          onSaveReservation={handleSaveReservation}
        />

        {/* Mapas de Referencia, Satélite y Cómo Llegar (Fácilmente Reemplazable) */}
        <ReferenceMapsSection />

        {/* C. Simulador de Crédito Directo (flujo guiado, sin IA) */}
        <CreditSimulator
          onSaveSimulation={handleSaveSimulation}
          selectedLotPrice={selectedLotPrice}
          selectedLotNumber={selectedLotNumber}
        />

        {/* D. Galería y Mapeo de Áreas (Sección de Propiedades) */}
        <PropertiesGallery
          properties={properties}
          onSelectPropertyForSimulation={handleSelectPropertyForSimulation}
        />

        {/* E. Módulo "Regístrate como Vendedor / Agente CADIS" */}
        <VendorRecruitment
          onRegisterVendor={handleRegisterVendor}
        />

        {/* F. Boletín de Novedades y Contacto */}
        <NewsletterAndContact
          onSubscribeNewsletter={handleSubscribeNewsletter}
          onSendContactMessage={handleSendContactMessage}
        />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setAdminOpen(true)} />

      {/* G. Panel de Administración Modal */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        properties={properties}
        simulations={simulations}
        vendors={vendors}
        subscribers={subscribers}
        reservations={reservations}
        chatInteractions={chatInteractions}
        onUpdateSimulationStatus={handleUpdateSimulationStatus}
        onUpdateVendorStatus={handleUpdateVendorStatus}
        onUpdateReservationStatus={handleUpdateReservationStatus}
        onAddProperty={handleAddProperty}
        onUpdateProperty={handleUpdateProperty}
        onBulkImportProperties={handleBulkImportProperties}
        onTogglePropertyStatus={handleTogglePropertyStatus}
        onDeleteProperty={handleDeleteProperty}
      />

      {/* WhatsApp Floating Interactive Fast-Track Widget with Automated Response System */}
      <WhatsAppFloatingWidget
        selectedLotNumber={selectedLotNumber}
        selectedLotPrice={selectedLotPrice}
        selectedProperty={properties.find((p) => p.loteNumero === selectedLotNumber) || null}
        onLogChatInteraction={handleLogChatInteraction}
      />
    </div>
  );
}
