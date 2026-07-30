"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/I18nContext";
import { governorates } from "@/data/governorates";
import { Check, ArrowLeft, Truck } from "lucide-react";
import styles from "./commande.module.css";

export default function CommandePage() {
  const { locale, t, isAr } = useI18n();
  const { items, subtotal, shippingCost, total, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [selectedGov, setSelectedGov] = useState("");
  const [form, setForm] = useState({ nom: "", prenom: "", telephone: "", gouvernorat: "", delegation: "", adresse: "" });

  const delegations = selectedGov ? governorates.find((g) => g.name === selectedGov)?.delegations || [] : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "gouvernorat") {
      setSelectedGov(value);
      setForm((prev) => ({ ...prev, gouvernorat: value, delegation: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    clearCart();
  };

  if (items.length === 0 && !submitted) {
    return (
      <div style={{ textAlign: "center", padding: "120px 20px" }}>
        <h2>{t.panier?.emptyTitle}</h2>
        <Link href={`/${locale}/boutique`} className="btn btn-primary" style={{ marginTop: "20px" }}>
          {t.panier?.discoverBtn}
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}><Check size={48} /></div>
        <h2>{t.commande?.successTitle}</h2>
        <p>{t.commande?.successDesc}</p>
        <div className={styles.successActions}>
          <Link href={`/${locale}`} className="btn btn-primary btn-lg">{t.commande?.backHome}</Link>
          <Link href={`/${locale}/boutique`} className="btn btn-secondary btn-lg">{t.panier?.continueBtn}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link href={`/${locale}`}>{t.navigation?.home}</Link><span>/</span>
          <Link href={`/${locale}/panier`}>{t.navigation?.cart}</Link><span>/</span>
          <span>{t.commande?.titleHighlight}</span>
        </nav>

        <h1 className={styles.title}>{t.commande?.title} <span className="text-gradient">{t.commande?.titleHighlight}</span></h1>

        <div className={styles.layout}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.formTitle}>{t.commande?.deliveryInfo}</h3>

            <div className={styles.row}>
              <div className="input-group">
                <label htmlFor="nom">{t.commande?.lastName}</label>
                <input id="nom" name="nom" className="input-field" required value={form.nom} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label htmlFor="prenom">{t.commande?.firstName}</label>
                <input id="prenom" name="prenom" className="input-field" required value={form.prenom} onChange={handleChange} />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="telephone">{t.commande?.phone}</label>
              <input id="telephone" name="telephone" className="input-field" required type="tel" value={form.telephone} onChange={handleChange} dir="ltr" placeholder="+216 XX XXX XXX" />
            </div>

            <div className={styles.row}>
              <div className="input-group">
                <label htmlFor="gouvernorat">{t.commande?.governorate}</label>
                <select id="gouvernorat" name="gouvernorat" className="input-field" required value={form.gouvernorat} onChange={handleChange}>
                  <option value="">{t.commande?.select}</option>
                  {governorates.map((g) => (
                    <option key={g.name} value={g.name}>{isAr ? (t.governorates?.[g.name] || g.name) : g.name}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="delegation">{t.commande?.delegation}</label>
                <select id="delegation" name="delegation" className="input-field" required value={form.delegation} onChange={handleChange} disabled={!selectedGov}>
                  <option value="">{t.commande?.select}</option>
                  {delegations.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="adresse">{t.commande?.address}</label>
              <textarea id="adresse" name="adresse" className="input-field" required rows={3} value={form.adresse} onChange={handleChange} placeholder={t.commande?.addressPlaceholder} />
            </div>

            <div className={styles.payment}>
              <Truck size={20} />
              <div>
                <strong>{t.commande?.cod}</strong>
                <span>{t.commande?.codSub}</span>
              </div>
            </div>

            <button type="submit" className="btn btn-gold btn-lg" style={{ width: "100%" }}>
              {t.commande?.confirmBtn}
            </button>
          </form>

          {/* Order Summary */}
          <div className={styles.summary}>
            <h3 className={styles.summaryTitle}>{t.commande?.orderSummary}</h3>
            <div className={styles.summaryItems}>
              {items.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <span className={styles.summaryItemName}>{item.name}</span>
                  <span className={styles.summaryItemQty}>×{item.quantity}</span>
                  <span>{item.price === 0 ? "—" : `${(item.price * item.quantity).toFixed(2)} DT`}</span>
                </div>
              ))}
            </div>
            <div className={styles.summaryRow}><span>{t.panier?.subtotal}</span><span>{subtotal.toFixed(2)} DT</span></div>
            <div className={styles.summaryRow}><span>{t.panier?.shipping}</span><span>{shippingCost.toFixed(2)} DT</span></div>
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}><span>{t.panier?.total}</span><span>{total.toFixed(2)} DT</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
