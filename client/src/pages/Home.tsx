import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Service = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  price: number;
  duration: string;
};

const services: Service[] = [
  {
    id: "classic-cut",
    name: "Classic Cut",
    eyebrow: "The everyday sharp",
    description: "Consultation, tailored cut, neck clean-up and a finish that holds its shape.",
    price: 24,
    duration: "45 min",
  },
  {
    id: "skin-fade",
    name: "Skin Fade",
    eyebrow: "Close. Clean. Precise.",
    description: "A seamless fade with detail around the edges and a finish matched to your style.",
    price: 29,
    duration: "55 min",
  },
  {
    id: "beard-sculpt",
    name: "Beard Sculpt",
    eyebrow: "Shape with intention",
    description: "Hot towel, line-up, trim and conditioning for a beard that frames the face.",
    price: 16,
    duration: "25 min",
  },
  {
    id: "cut-and-beard",
    name: "Cut + Beard",
    eyebrow: "The full reset",
    description: "Our signature chair session: cut, beard sculpt, hot towel and styling finish.",
    price: 39,
    duration: "70 min",
  },
];

const contact = {
  email: "goldnaldo9@gmail.com",
  phone: "+421 915 189 681",
  phoneLink: "+421915189681",
  address: "Budatínska 23, Bratislava",
};

const hairServicePaymentLink = "https://buy.stripe.com/test_aFa3co5vk1bD2Jlf3veEo00";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service>(services[0]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    const paymentStatus = new URLSearchParams(window.location.search).get("payment");
    if (paymentStatus === "success") {
      toast.success("Deposit received. Your chair is reserved.");
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (paymentStatus === "cancelled") {
      toast("No worries — your booking is still here when you are ready.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const openBooking = (service = selectedService) => {
    setSelectedService(service);
    setBookingError("");
    setBookingSuccess(false);
    setBookingOpen(true);
  };

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const submitBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setBookingError("");
    setBookingSuccess(false);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          date: form.date,
          time: form.time,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        if (payload.code === "payment_not_configured") {
          setBookingSuccess(true);
          return;
        }
        throw new Error(payload.message || "We could not start checkout.");
      }

      toast("Opening secure deposit checkout in a new tab…");
      const checkoutWindow = window.open(payload.checkoutUrl, "_blank", "noopener,noreferrer");
      if (!checkoutWindow) window.location.href = payload.checkoutUrl;
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Something went wrong. Please call the shop.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="site-shell">
      <div className="announcement-bar">
        <span className="announcement-dot" />
        <span>Bratislava’s chair is ready for you</span>
        <span className="announcement-rule" />
        <a href={`tel:${contact.phoneLink}`}>Book by phone <ArrowUpRight size={13} /></a>
      </div>

      <header className="site-header">
        <a href="#top" className="wordmark" aria-label="Trimhaus home">
          <span className="monogram"><span>T</span><span>H</span></span>
          <span className="wordmark-copy"><strong>TRIM</strong><em>HAUS</em></span>
        </a>
        <nav className={`site-nav ${mobileOpen ? "is-open" : ""}`}>
          <button onClick={() => scrollTo("services")}>Services</button>
          <button onClick={() => scrollTo("the-chair")}>The chair</button>
          <button onClick={() => scrollTo("visit")}>Visit us</button>
          <Button className="nav-cta" onClick={() => openBooking()}><CalendarDays size={16} /> Book a chair</Button>
        </nav>
        <button className="mobile-menu" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="section-kicker"><span>01 /</span> Bratislava, Slovakia</div>
            <h1>Sharp looks.<br /><i>Good energy.</i></h1>
            <p className="hero-lede">A modern barbing salon for clean cuts, considered details, and a little more time in the chair.</p>
            <div className="hero-actions">
              <Button className="brass-button" onClick={() => openBooking()}><CalendarDays size={17} /> Reserve your chair</Button>
              <button className="text-link" onClick={() => scrollTo("services")}>Explore services <ArrowUpRight size={17} /></button>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack" aria-hidden="true"><span>G</span><span>M</span><span>J</span></div>
              <div><div className="stars"><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /></div><p>Trusted by 200+ good-looking people</p></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-wrap">
              <img src="/manus-storage/async-images/ylDhGXmoM0dDv0845xCkhv/image-1.webp" alt="Warmly lit modern barbershop interior" />
            </div>
            <div className="hero-note"><span>Station note</span><strong>Come as you are.<br />Leave a little sharper.</strong><span className="note-mark">✳</span></div>
            <div className="hero-side-label">Est. 2021 <span /> precision grooming</div>
          </div>
        </section>

        <section className="signal-strip" aria-label="Salon highlights">
          <div><span className="signal-index">01</span><strong>Walk-ins welcome</strong><small>when the chair allows</small></div>
          <div><span className="signal-index">02</span><strong>Easy online booking</strong><small>secure €10 deposit</small></div>
          <div><span className="signal-index">03</span><strong>Budatínska 23</strong><small>Bratislava · SK</small></div>
        </section>

        <section className="section-block services-section" id="services">
          <div className="section-heading split-heading"><div><div className="section-kicker"><span>02 /</span> The menu</div><h2>Good hair is<br /><i>always in season.</i></h2></div><p>Take the classic route, go close and clean, or make room for the full reset. Every service includes a proper consultation and a finish you can wear out.</p></div>
          <div className="services-rail">
            {services.map((service, index) => (
              <article className="service-card" key={service.id}>
                <div className="service-number">0{index + 1}</div>
                <div className="service-main"><div className="service-eyebrow">{service.eyebrow}</div><h3>{service.name}</h3><p>{service.description}</p></div>
                <div className="service-meta"><strong>{formatPrice(service.price)}</strong><span>{service.duration}</span><button onClick={() => openBooking(service)} aria-label={`Book ${service.name}`}>Book <ArrowUpRight size={15} /></button></div>
              </article>
            ))}
          </div>
          <div className="service-footnote"><span><Sparkles size={15} /> All services include a styling finish.</span><span>Prices include VAT.</span></div>
        </section>

        <section className="chair-section section-block" id="the-chair">
          <div className="chair-image"><img src="/manus-storage/async-images/ylDhGXmoM0dDv0845xCkhv/image-1.webp" alt="Barber chair and mirror detail" /></div>
          <div className="chair-copy"><div className="section-kicker"><span>03 /</span> The chair</div><h2>A little ritual<br /><i>goes a long way.</i></h2><p>Trimhaus is built around the belief that a haircut can be more than a quick errand. It can be the part of your week where the phone goes away, the conversation gets good, and the details get taken care of.</p><div className="quote-mark">“</div><blockquote>It’s not just a cut. It’s the reset between one thing and the next.</blockquote><div className="signature-line"><span>Trimhaus team</span><span className="signature">T H</span></div></div>
        </section>

        <section className="booking-band">
          <div><div className="section-kicker"><span>04 /</span> Your next good decision</div><h2>Ready when<br /><i>you are.</i></h2></div>
          <div className="booking-band-copy"><p>Pick a service, choose a time, and leave the rest to us. A small €10 deposit keeps your chair yours.</p><Button className="cream-button" onClick={() => openBooking()}>Book a chair <ArrowUpRight size={17} /></Button><a className="pay-service-link" href={hairServicePaymentLink} target="_blank" rel="noreferrer">Pay hair service <ArrowUpRight size={15} /></a><small>Secure checkout powered by Stripe</small></div>
        </section>

        <section className="visit-section section-block" id="visit">
          <div className="visit-copy"><div className="section-kicker"><span>05 /</span> Come through</div><h2>Find us<br /><i>in Bratislava.</i></h2><p>One address, one good chair, no unnecessary fuss. We’re easy to reach and even easier to settle into.</p><div className="contact-list"><a href={`tel:${contact.phoneLink}`}><span className="contact-icon"><Phone size={16} /></span><span><small>Call the shop</small><strong>{contact.phone}</strong></span></a><a href={`mailto:${contact.email}`}><span className="contact-icon"><Mail size={16} /></span><span><small>Email</small><strong>{contact.email}</strong></span></a><div><span className="contact-icon"><MapPin size={16} /></span><span><small>Find the chair</small><strong>{contact.address}</strong></span></div></div></div>
          <div className="visit-card"><div className="map-grid" aria-hidden="true" /><div className="map-pin"><MapPin size={24} /></div><div className="visit-card-copy"><span>TRIMHAUS / BRATISLAVA</span><strong>Budatínska<br />23</strong><a href="https://www.google.com/maps/search/?api=1&query=Budatinska+23+Bratislava" target="_blank" rel="noreferrer">Open in maps <ArrowUpRight size={15} /></a></div></div>
        </section>
      </main>

      <footer className="site-footer"><a href="#top" className="wordmark footer-wordmark"><span className="monogram"><span>T</span><span>H</span></span><span className="wordmark-copy"><strong>TRIM</strong><em>HAUS</em></span></a><p>Precision grooming, good energy.<br />Budatínska 23 · Bratislava</p><div className="footer-links"><a href={`mailto:${contact.email}`}><Mail size={15} /> Email</a><a href="#visit"><MapPin size={15} /> Visit</a><a href="#top"><Instagram size={15} /> Instagram</a></div><div className="footer-bottom"><span>© 2026 Trimhaus</span><span>Built for the good-looking</span></div></footer>

      {bookingOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOpen(false); }}><div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title"><button className="modal-close" onClick={() => setBookingOpen(false)} aria-label="Close booking form"><X size={20} /></button><div className="modal-kicker">Book a chair / {selectedService.duration}</div><h2 id="booking-title">Let’s get you<br /><i>looking sharp.</i></h2>{bookingSuccess ? <div className="booking-success"><div className="success-icon"><Check size={25} /></div><h3>You're on the list.</h3><p>We have your booking details. Payment checkout is being connected for this salon, so please call us on <a href={`tel:${contact.phoneLink}`}>{contact.phone}</a> to confirm your chair.</p><Button className="brass-button" onClick={() => setBookingOpen(false)}>Back to the site</Button></div> : <form onSubmit={submitBooking}><div className="selected-service"><div><span>Selected service</span><strong>{selectedService.name}</strong></div><button type="button" onClick={() => { setBookingOpen(false); scrollTo("services"); }}>Change <ChevronDown size={15} /></button><strong className="selected-price">{formatPrice(selectedService.price)}</strong></div><div className="form-grid"><label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label><label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@email.com" /></label><label>Phone<input required type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+421 …" /></label><label>Date<input required type="date" min={minDate} value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label><label>Preferred time<select required value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })}><option value="">Choose a time</option><option>09:00</option><option>10:30</option><option>12:00</option><option>13:30</option><option>15:00</option><option>16:30</option><option>18:00</option></select></label></div>{bookingError && <p className="booking-error">{bookingError}</p>}<div className="modal-submit"><Button type="submit" className="brass-button" disabled={isSubmitting}>{isSubmitting ? "Preparing checkout…" : <>Continue to €10 deposit <ArrowUpRight size={17} /></>}</Button><a className="modal-pay-link" href={hairServicePaymentLink} target="_blank" rel="noreferrer">Pay hair service directly <ArrowUpRight size={15} /></a><span><ShieldCheck size={15} /> Secure payment via Stripe</span></div></form>}</div></div>}
    </div>
  );
}
