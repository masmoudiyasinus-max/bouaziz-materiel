"use client";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/context/I18nContext";
import { categories } from "@/data/categories";
import { Phone, Mail, MapPin, Clock, Truck } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  const { locale, t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        {/* Column 1: Brand */}
        <div className={styles.column}>
          <Link href={`/${locale}`} className={styles.footerLogo}>
            <Image src="/logo.svg" alt="Bouaziz" width={40} height={40} />
            <div>
              <div className={styles.footerLogoName}>Bouaziz</div>
              <div className={styles.footerLogoSub}>
                {t.footer?.subtitle || "Matériel Agricole et d'élevage"}
              </div>
            </div>
          </Link>
          <p className={styles.footerDesc}>
            {t.footer?.aboutText || "Le spécialiste N°1 en équipements agricoles et avicoles en Tunisie. Qualité, innovation et service après-vente garantis."}
          </p>
        </div>

        {/* Column 2: Categories */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>
            {t.footer?.categoriesTitle || "Catégories"}
          </h3>
          <ul className={styles.linkList}>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/${locale}/boutique/${cat.slug}`} className={styles.footerLink}>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Links */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>
            {t.footer?.linksTitle || "Liens utiles"}
          </h3>
          <ul className={styles.linkList}>
            <li><Link href={`/${locale}/boutique`} className={styles.footerLink}>{t.navigation?.boutique || "Boutique"}</Link></li>
            <li><Link href={`/${locale}/a-propos`} className={styles.footerLink}>{t.navigation?.about || "À propos"}</Link></li>
            <li><Link href={`/${locale}/contact`} className={styles.footerLink}>{t.navigation?.contact || "Contact"}</Link></li>
            <li><Link href={`/${locale}/faq`} className={styles.footerLink}>{t.navigation?.faq || "FAQ"}</Link></li>
            <li><Link href={`/${locale}/panier`} className={styles.footerLink}>{t.header?.cart || "Mon panier"}</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>
            {t.footer?.contactTitle || "Contact"}
          </h3>
          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <MapPin size={16} />
              <span>
                {t.footer?.address || "Route Hzamia km 11, Sfax, Tunisie"}
              </span>
            </div>
            <div className={styles.contactItem}>
              <Phone size={16} />
              <div>
                <a href="tel:+21621361673">+216 21 361 673</a>
                <br />
                <a href="tel:+21623461919">+216 23 461 919</a>
              </div>
            </div>
            <div className={styles.contactItem}>
              <Mail size={16} />
              <a href="mailto:contact@bouazizmaterielagricole.tn">contact@bouazizmaterielagricole.tn</a>
            </div>
            <div className={styles.contactItem}>
              <Clock size={16} />
              <span>
                {t.footer?.hours || "Lun-Dim: 08h00 - 18h00"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomBarInner}`}>
          <p>
            {locale === "ar" 
              ? `© ${new Date().getFullYear()} جميع الحقوق محفوظة لشركة بوعزيز للمعدات الزراعية.` 
              : `© ${new Date().getFullYear()} All rights reserved by Bouaziz matériel agricole et d'élevage.`}
          </p>
          <p className={styles.bottomBarShipping}>
            <Truck size={14} style={{ display: "inline", marginInlineEnd: 6, verticalAlign: "middle" }} />
            {locale === "ar" ? "توصيل لجميع أنحاء تونس — 8 دينار" : "Livraison dans toute la Tunisie — 8 DT"}
          </p>
        </div>
      </div>
    </footer>
  );
}
