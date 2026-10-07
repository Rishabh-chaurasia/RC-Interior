import { useRef, useState } from 'react';
import { contact, needs } from '../data/content.js';
import { Btn } from './ui.jsx';

function Field({ name, label, error, textarea, ...rest }) {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <label className={`field ${error ? 'is-error' : ''}`}>
      <Tag name={name} placeholder=" " {...rest} />
      <span>{label}</span>
    </label>
  );
}

/** Enquiry form. No backend: it opens WhatsApp (or the mail app) with the details pre-filled. */
function EnquiryForm() {
  const form = useRef(null);
  const [errors, setErrors] = useState({});
  const [note, setNote] = useState('');

  const read = () => {
    const d = new FormData(form.current);
    return {
      name: d.get('name').trim(), company: d.get('company').trim(), phone: d.get('phone').trim(),
      area: d.get('area').trim(), message: d.get('message').trim(), needs: d.getAll('need'),
    };
  };

  const validate = v => {
    const e = { name: !v.name, phone: v.phone.replace(/\D/g, '').length < 10 };
    setErrors(e);
    const ok = !e.name && !e.phone;
    setNote(ok ? '' : 'Please add your name and a 10-digit phone number.');
    return ok;
  };

  const message = v => [
    'Hi RC Interior, I would like to discuss a project.',
    '',
    `Name: ${v.name}`,
    v.company && `Company: ${v.company}`,
    `Phone: ${v.phone}`,
    v.needs.length && `Looking for: ${v.needs.join(', ')}`,
    v.area && `Area: ${v.area} sq ft`,
    v.message && `Notes: ${v.message}`,
  ].filter(Boolean).join('\n');

  const sendWhatsApp = e => {
    e.preventDefault();
    const v = read();
    if (!validate(v)) return;
    window.open(`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message(v))}`, '_blank', 'noopener');
    setNote('Opening WhatsApp… we usually reply the same working day.');
  };

  const sendEmail = () => {
    const v = read();
    if (!validate(v)) return;
    const subject = `Project enquiry – ${v.company || v.name}`;
    location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message(v))}`;
  };

  return (
    <form ref={form} className="form" noValidate onSubmit={sendWhatsApp}>
      <p className="kicker">Tell us about your space</p>
      <fieldset className="form__chips">
        <legend>I need</legend>
        {needs.map(n => (
          <label key={n.value}><input type="checkbox" name="need" value={n.value} /><span>{n.label}</span></label>
        ))}
      </fieldset>
      <div className="form__row">
        <Field name="name" label="Your name" autoComplete="name" required error={errors.name} />
        <Field name="company" label="Company" autoComplete="organization" />
      </div>
      <div className="form__row">
        <Field name="phone" label="Phone" type="tel" autoComplete="tel" required error={errors.phone} />
        <Field name="area" label="Area (sq ft)" inputMode="numeric" />
      </div>
      <Field name="message" label="Anything else?" textarea rows={3} />
      <div className="form__actions">
        <Btn type="submit">Send on WhatsApp</Btn>
        <button type="button" className="link-under" onClick={sendEmail}>or send by email</button>
      </div>
      <p className="form__note" role="status">{note}</p>
    </form>
  );
}

export default function Contact() {
  return (
    <section className="contact section" id="contact">
      <h2 className="contact__title" data-split>Let’s <em>discuss!</em></h2>
      <div className="contact__grid">
        <EnquiryForm />
        <aside className="info">
          <div className="info__block">
            <p className="kicker">Call</p>
            {contact.phones.map(p => <a key={p.href} href={p.href}>{p.label} <small>· {p.type}</small></a>)}
          </div>
          <div className="info__block">
            <p className="kicker">Write</p>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <a href={contact.website.href} target="_blank" rel="noopener">{contact.website.label}</a>
          </div>
          <div className="info__block">
            <p className="kicker">Visit</p>
            <address>{contact.address.map((l, i) => <span key={l}>{l}{i < contact.address.length - 1 && <br />}</span>)}</address>
          </div>
          <div className="map">
            <iframe title="RC Interior on Google Maps" src={contact.mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <a className="map__open" href={contact.mapLink} target="_blank" rel="noopener">Open in Google Maps <i aria-hidden="true">↗</i></a>
        </aside>
      </div>
    </section>
  );
}
