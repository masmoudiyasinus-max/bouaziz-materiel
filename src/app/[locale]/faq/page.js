"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, Phone } from "lucide-react";
import styles from "./faq.module.css";

import { useI18n } from "@/context/I18nContext";

export default function FaqPage() {
  const { locale, t, isAr } = useI18n();
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? -1 : i);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb}><Link href={`/${locale}`}>{t.navigation?.home}</Link><span>/</span><span>{t.navigation?.faq}</span></nav>

        <div className="section-header" style={{ textAlign: "left" }}>
          <h1 className="section-title">{t.faq?.title} <span className="text-gradient">{t.faq?.titleHighlight}</span></h1>
          <p className="section-subtitle">{t.faq?.desc}</p>
        </div>

        <div className={styles.faqList}>
          {t.faq?.list?.map((faq, i) => (
            <div key={i} className={`${styles.faqItem} ${openIndex === i ? styles.open : ""}`}>
              <button className={styles.faqQuestion} onClick={() => toggle(i)}>
                <HelpCircle size={20} className={styles.faqIcon} />
                <span>{faq.q}</span>
                <ChevronDown size={18} className={styles.chevron} />
              </button>
              {openIndex === i && (
                <div className={styles.faqAnswer}>
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <h3>{t.faq?.notFound}</h3>
          <p>{t.faq?.contactUs}</p>
          <div className={styles.ctaActions}>
            <Link href={`/${locale}/contact`} className="btn btn-primary btn-lg">{t.faq?.contactBtn}</Link>
            <a href="tel:+21621361673" className="btn btn-secondary btn-lg" dir="ltr">
              <Phone size={18} /> +216 21 361 673
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
