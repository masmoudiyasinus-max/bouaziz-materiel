"use client";
import Link from "next/link";
import { useI18n } from "@/context/I18nContext";
import { useCart } from "@/context/CartContext";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft, Package } from "lucide-react";
import styles from "./panier.module.css";

export default function PanierPage() {
  const { locale, t } = useI18n();
  const { items, updateQuantity, removeFromCart, subtotal, shippingCost, total, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <ShoppingBag size={64} />
        <h2>{t.panier?.emptyTitle}</h2>
        <p>{t.panier?.emptySub}</p>
        <Link href={`/${locale}/boutique`} className="btn btn-primary btn-lg">
          {t.panier?.discoverBtn} {locale === "ar" ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link href={`/${locale}`}>{t.navigation?.home}</Link><span>/</span><span>{t.navigation?.cart}</span>
        </nav>

        <h1 className={styles.title}>
          {t.panier?.myCart}
          <span className={styles.titleCount}>({totalItems} {t.panier?.items})</span>
        </h1>

        <div className={styles.layout}>
          {/* Cart Items */}
          <div className={styles.itemsList}>
            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemImage}>
                  <Package size={24} />
                </div>
                <div className={styles.itemInfo}>
                  <Link href={`/${locale}/produit/${item.slug}`} className={styles.itemName}>{item.name}</Link>
                  <span className={styles.itemPrice}>
                    {item.price === 0 ? (isAr ? "حسب الطلب" : "Sur devis") : `${item.price.toFixed(2)} DT`}
                  </span>
                </div>
                <div className={styles.itemQuantity}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className={styles.qtyBtn} type="button" aria-label="Decrease">
                    &#8722;
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={styles.qtyBtn} type="button" aria-label="Increase">
                    &#43;
                  </button>
                </div>
                <span className={styles.itemTotal}>
                  {item.price === 0 ? (isAr ? "حسب الطلب" : "Sur devis") : `${(item.price * item.quantity).toFixed(2)} DT`}
                </span>
                <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <h3 className={styles.summaryTitle}>{t.panier?.summary}</h3>
            <div className={styles.summaryRow}>
              <span>{t.panier?.subtotal}</span>
              <span>{subtotal.toFixed(2)} DT</span>
            </div>
            <div className={styles.summaryRow}>
              <span>{t.panier?.shipping}</span>
              <span>{shippingCost.toFixed(2)} DT</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>{t.panier?.total}</span>
              <span>{total.toFixed(2)} DT</span>
            </div>
            <Link href={`/${locale}/commande`} className="btn btn-gold btn-lg" style={{ width: "100%", marginTop: "16px" }}>
              {t.panier?.checkoutBtn} {locale === "ar" ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </Link>
            <Link href={`/${locale}/boutique`} className={styles.continueShopping}>
              {locale === "ar" ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {t.panier?.continueBtn}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
