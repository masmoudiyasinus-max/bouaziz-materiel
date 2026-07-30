import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Globe, ExternalLink, Send } from "lucide-react";
import { getDictionary } from "@/dictionaries";
import styles from "./contact.module.css";

export const metadata = {
  title: "Contact",
  description: "Contactez Bouaziz Matériel Agricole — Sfax, Tunisie. Ventes, support technique et réclamations.",
};

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const t = await getDictionary(locale);
  
  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb}><Link href={`/${locale}`}>{t.navigation?.home || "Accueil"}</Link><span>/</span><span>{t.navigation?.contact || "Contact"}</span></nav>

        <div className="section-header" style={{ textAlign: "left" }}>
          <h1 className="section-title">{t.contact?.title || "Contactez"}-<span className="text-gradient">{t.contact?.titleHighlight || "nous"}</span></h1>
          <p className="section-subtitle">{t.contact?.desc || "Notre équipe est à votre disposition 7 jours sur 7"}</p>
        </div>

        <div className={styles.layout}>
          {/* Contact Info */}
          <div className={styles.infoColumn}>
            <div className={styles.contactCard}>
              <div className={styles.cardIcon}><Phone size={24} /></div>
              <div>
                <h3>Ventes & Commandes</h3>
                <div className={styles.contactDetail}>
                  <strong>Amine :</strong> <a href="tel:+21621361673">+216 21 361 673</a>
                </div>
                <div className={styles.contactDetail}>
                  <strong>Rawaa :</strong> <a href="tel:+21623461919">+216 23 461 919</a>
                </div>
              </div>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.cardIcon}><Phone size={24} /></div>
              <div>
                <h3>Support & Réclamations</h3>
                <div className={styles.contactDetail}>
                  <a href="tel:+21654750481">+216 54 750 481</a>
                </div>
                <div className={styles.contactDetail}>
                  <a href="tel:+21622700546">+216 22 700 546</a>
                </div>
              </div>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.cardIcon}><Mail size={24} /></div>
              <div>
                <h3>Email</h3>
                <div className={styles.contactDetail}>
                  <a href="mailto:contact@bouazizmaterielagricole.tn">contact@bouazizmaterielagricole.tn</a>
                </div>
                <div className={styles.contactDetail}>
                  <a href="mailto:agrometaluxe@gmail.com">agrometaluxe@gmail.com</a>
                </div>
              </div>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.cardIcon}><MapPin size={24} /></div>
              <div>
                <h3>{locale === "ar" ? "العنوان" : "Adresse"}</h3>
                <p>{t.footer?.address || "Route Hzamia (Centre) km 11, entre la route des fours et la route de l'Aïn, Sfax, Tunisie"}</p>
                <span className={styles.subInfo}>{locale === "ar" ? "≈ 22 دقيقة من وسط مدينة صفاقس" : "≈ 22 min du centre-ville de Sfax"}</span>
              </div>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.cardIcon}><Clock size={24} /></div>
              <div>
                <h3>{locale === "ar" ? "أوقات العمل" : "Horaires"}</h3>
                <p>{locale === "ar" ? "الإثنين – الأحد" : "Lundi – Dimanche"}</p>
                <p><strong>{locale === "ar" ? "08:00 — 18:00" : "08h00 — 18h00"}</strong></p>
              </div>
            </div>

            <div className={styles.socialRow}>
              <a href="https://www.facebook.com/bouazizmaterielagricole" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <Globe size={18} /> {locale === "ar" ? "فيسبوك — +128 ألف متابع" : "Facebook — 128K+ abonnés"}
              </a>
              <a href="https://www.tiktok.com/@bouazizmaterielagricole" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <ExternalLink size={18} /> {locale === "ar" ? "تيك توك — +74 ألف متابع" : "TikTok — 74K+ abonnés"}
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className={styles.formColumn}>
            <form className={styles.form}>
              <h3 className={styles.formTitle}>{t.contact?.formTitle || "Envoyez-nous un message"}</h3>
              <div className="input-group">
                <label htmlFor="contact-name">{t.contact?.name || "Nom complet *"}</label>
                <input id="contact-name" className="input-field" placeholder={locale === "ar" ? "الاسم واللقب" : "Votre nom et prénom"} />
              </div>
              <div className="input-group">
                <label htmlFor="contact-email">{t.contact?.email || "Email *"}</label>
                <input id="contact-email" type="email" className="input-field" placeholder="votre@email.com" dir="ltr" />
              </div>
              <div className="input-group">
                <label htmlFor="contact-phone">{t.commande?.phone || "Téléphone *"}</label>
                <input id="contact-phone" type="tel" className="input-field" placeholder="+216 XX XXX XXX" dir="ltr" />
              </div>
              <div className="input-group">
                <label htmlFor="contact-subject">{t.contact?.subject || "Sujet *"}</label>
                <select id="contact-subject" className="input-field">
                  <option value="">{t.commande?.select || "Sélectionner un sujet..."}</option>
                  <option value="commande">{locale === "ar" ? "سؤال عن طلب" : "Question sur une commande"}</option>
                  <option value="produit">{locale === "ar" ? "معلومة عن منتج" : "Information sur un produit"}</option>
                  <option value="devis">{locale === "ar" ? "طلب عرض سعر" : "Demande de devis"}</option>
                  <option value="sav">{locale === "ar" ? "خدمة ما بعد البيع" : "Service après-vente"}</option>
                  <option value="autre">{locale === "ar" ? "أخرى" : "Autre"}</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="contact-message">{t.contact?.message || "Message *"}</label>
                <textarea id="contact-message" className="input-field" rows={5} placeholder={locale === "ar" ? "رسالتك..." : "Votre message..."} />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }}>
                <Send size={18} /> {t.contact?.sendBtn || "Envoyer le message"}
              </button>
            </form>
          </div>
        </div>

        {/* Google Maps */}
        <div className={styles.mapSection}>
          <h3 className={styles.mapTitle}>{t.contact?.findUs || "Notre emplacement"}</h3>
          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.0!2d10.7!3d34.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zQk9VQVpJWg!5e0!3m2!1sfr!2stn!4v1"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: "var(--radius-lg)" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bouaziz Matériel Agricole — Sfax"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
