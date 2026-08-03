"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/I18nContext";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  Phone,
  ChevronDown,
} from "lucide-react";
import styles from "./Header.module.css";

export default function Header({ initialCategories = [] }) {
  const { locale, t, isAr } = useI18n();
  const { totalItems } = useCart();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuTimeout = useRef(null);
  const scrollRef = useRef(false);

  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      // Hysteresis: scroll down past 80px to activate, scroll up past 20px to deactivate
      if (!scrollRef.current && y > 80) {
        scrollRef.current = true;
        setIsScrolled(true);
      } else if (scrollRef.current && y < 20) {
        scrollRef.current = false;
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMegaMenuEnter = () => {
    clearTimeout(megaMenuTimeout.current);
    setIsMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeout.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 200);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Hide header on admin pages
  if (pathname && pathname.includes('/admin')) return null;

  const toggleLanguage = () => {
    const newLocale = locale === "fr" ? "ar" : "fr";
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = newPath;
  };

  return (
    <>
      {/* Top Bar — hidden on homepage to prevent layout shift */}
      {!isHomePage && (
        <div className={styles.topBar}>
          <div className={`container ${styles.topBarInner}`}>
            <div className={styles.topBarLeft}>
              <Phone size={14} />
              <span>+216 21 361 673</span>
              <span className={styles.topBarDivider}>|</span>
              <span>Lun-Dim: 08h-18h</span>
            </div>
            <div className={styles.topBarRight}>
              <span>Livraison dans toute la Tunisie — 8 DT</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header
        className={`${styles.header} ${isTransparent ? styles.headerTransparent : isScrolled ? styles.headerScrolled : styles.headerSolid}`}
      >
        <div className={`container ${styles.headerInner}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Image
              src="/logo.svg"
              alt="Bouaziz Matériel Agricole"
              width={48}
              height={48}
              className={`${styles.logoImg} ${isTransparent ? styles.logoWhite : ""}`}
            />
            <div className={styles.logoText}>
              <span className={`${styles.logoName} ${isTransparent ? styles.textWhite : ""}`}>
                Bouaziz
              </span>
              <span className={`${styles.logoSub} ${isTransparent ? styles.textWhiteMuted : ""}`}>
                Matériel Agricole
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.desktopNav}>
            <Link href={`/${locale}`} className={`${styles.navLink} ${isTransparent ? styles.navLinkWhite : ""}`}>
              {t.navigation?.home || "Accueil"}
            </Link>

            <div
              className={styles.navDropdown}
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
            >
              <Link href={`/${locale}/boutique`} className={`${styles.navLink} ${isTransparent ? styles.navLinkWhite : ""}`}>
                {t.navigation?.boutique || "Boutique"} <ChevronDown size={16} />
              </Link>

              {isMegaMenuOpen && (
                <div className={styles.megaMenu}>
                  <div className={styles.megaMenuGrid}>
                    {initialCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/${locale}/boutique/${cat.slug}`}
                        className={styles.megaMenuItem}
                        onClick={() => setIsMegaMenuOpen(false)}
                      >
                        <span className={styles.megaMenuName}>{isAr ? (cat.nameAr || cat.name) : cat.name}</span>
                        <span className={styles.megaMenuCount}>
                          {cat.productCount} {t.panier?.items || "produits"}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className={styles.megaMenuFooter}>
                    <Link
                      href={`/${locale}/boutique`}
                      className="btn btn-primary btn-sm"
                      onClick={() => setIsMegaMenuOpen(false)}
                    >
                      {t.boutique?.title2 ? `${t.boutique.title1} ${t.boutique.title2}` : "Voir tout le catalogue"}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href={`/${locale}/a-propos`} className={`${styles.navLink} ${isTransparent ? styles.navLinkWhite : ""}`}>
              {t.navigation?.about || "À propos"}
            </Link>
            <Link href={`/${locale}/contact`} className={`${styles.navLink} ${isTransparent ? styles.navLinkWhite : ""}`}>
              {t.navigation?.contact || "Contact"}
            </Link>
            <Link href={`/${locale}/faq`} className={`${styles.navLink} ${isTransparent ? styles.navLinkWhite : ""}`}>
              {t.navigation?.faq || "FAQ"}
            </Link>
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              onClick={toggleLanguage}
              className={`${styles.actionBtn} ${isTransparent ? styles.actionBtnWhite : ""}`}
              title={locale === "fr" ? "العربية" : "Français"}
            >
              {locale === "fr" ? "AR" : "FR"}
            </button>
            <Link
              href={`/${locale}/boutique`}
              className={`${styles.actionBtn} ${isTransparent ? styles.actionBtnWhite : ""}`}
              title="Rechercher"
            >
              <Search size={20} />
            </Link>
            <Link
              href={`/${locale}/panier`}
              className={`${styles.cartBtn} ${isTransparent ? styles.actionBtnWhite : ""}`}
              title={t.header?.cart || "Panier"}
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems}</span>
              )}
            </Link>
            <button
              className={`${styles.mobileToggle} ${isTransparent ? styles.actionBtnWhite : ""}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setIsMobileMenuOpen(false)}>
          <nav className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <Link href={`/${locale}`} className={styles.mobileLink} onClick={() => setIsMobileMenuOpen(false)}>
              {t.navigation?.home || "Accueil"}
            </Link>
            <Link href={`/${locale}/boutique`} className={styles.mobileLink} onClick={() => setIsMobileMenuOpen(false)}>
              {t.navigation?.boutique || "Boutique"}
            </Link>
            <div className={styles.mobileCats}>
              {initialCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/boutique/${cat.slug}`}
                  className={styles.mobileCatLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {isAr ? (cat.nameAr || cat.name) : cat.name}
                </Link>
              ))}
            </div>
            <Link href={`/${locale}/a-propos`} className={styles.mobileLink} onClick={() => setIsMobileMenuOpen(false)}>
              {t.navigation?.about || "À propos"}
            </Link>
            <Link href={`/${locale}/contact`} className={styles.mobileLink} onClick={() => setIsMobileMenuOpen(false)}>
              {t.navigation?.contact || "Contact"}
            </Link>
            <Link href={`/${locale}/faq`} className={styles.mobileLink} onClick={() => setIsMobileMenuOpen(false)}>
              {t.navigation?.faq || "FAQ"}
            </Link>
            <div className={styles.mobileContact}>
              <Phone size={16} />
              <a href="tel:+21621361673">+216 21 361 673</a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
