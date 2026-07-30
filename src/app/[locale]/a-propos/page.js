import Link from "next/link";
import { Award, Users, Truck, Wrench, Star, Target, ArrowRight, ArrowLeft, Factory, Store, Package } from "lucide-react";
import { getDictionary } from "@/dictionaries";
import styles from "./about.module.css";

export const metadata = {
  title: "À propos",
  description: "Découvrez Bouaziz Matériel Agricole et d'élevage — Le spécialiste N°1 en équipements agricoles et avicoles en Tunisie depuis Sfax.",
};

export default async function AboutPage({ params }) {
  const { locale } = await params;
  const t = await getDictionary(locale);
  const isAr = locale === "ar";
  
  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb}><Link href={`/${locale}`}>{t.navigation?.home || "Accueil"}</Link><span>/</span><span>{t.navigation?.about || "À propos"}</span></nav>

        {/* Hero */}
        <section className={styles.aboutHero}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              {t.about?.heroTitle || "Bouaziz Matériel Agricole et d'élevage"}
            </h1>
            <p className={styles.tagline}>
              {locale === "ar" ? "« المتخصص رقم 1 في المعدات الزراعية وتربية الدواجن في تونس »" : "« Le spécialiste N°1 en équipements agricoles et avicoles en Tunisie »"}
            </p>
            <p className={styles.heroDesc}>
              {locale === "ar" ? "منذ مقرنا في صفاقس، نرافق الفلاحين ومربي الماشية التونسيين بمعدات ذات جودة احترافية. من التصنيع إلى التوزيع، نتحكم في السلسلة بأكملها لنقدم لكم أفضل المنتجات بأفضل الأسعار." : "Depuis notre siège à Sfax, nous accompagnons les agriculteurs et éleveurs tunisiens avec des équipements de qualité professionnelle. De la fabrication à la distribution, nous maîtrisons l'ensemble de la chaîne pour vous offrir les meilleurs produits au meilleur prix."}
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className={styles.missionSection}>
          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <Target size={32} />
              <h3>{locale === "ar" ? "مهمتنا" : "Notre Mission"}</h3>
              <p>{locale === "ar" ? "توفير معدات مبتكرة وموثوقة للفلاحين ومربي الماشية التونسيين بأسعار مناسبة لتحديث مزارعهم وتحسين إنتاجيتهم." : "Fournir aux agriculteurs et éleveurs tunisiens des équipements innovants, fiables et accessibles pour moderniser leurs exploitations et améliorer leur productivité."}</p>
            </div>
            <div className={styles.missionCard}>
              <Star size={32} />
              <h3>{locale === "ar" ? "رؤيتنا" : "Notre Vision"}</h3>
              <p>{locale === "ar" ? "أن نصبح المرجع الأساسي للمعدات الزراعية وتربية الدواجن في تونس والمغرب العربي بفضل الابتكار وجودة الخدمة." : "Devenir la référence incontournable en matière d'équipements agricoles et avicoles en Tunisie et au Maghreb, grâce à l'innovation et la qualité de service."}</p>
            </div>
          </div>
        </section>

        {/* Activités */}
        <section className={styles.section}>
          <h2 className="section-title">{locale === "ar" ? "أنشطتنا" : "Nos activités"}</h2>
          <p className={styles.sectionDesc}>
            {locale === "ar" ? "يغطي نشاطنا التصنيع والبيع وتوزيع المعدات الزراعية ومستلزمات الإنتاج الحيواني، وخاصة تجهيز حظائر الدواجن، بالجملة والتفصيل." : "Notre activité couvre la fabrication, la vente et la distribution de matériel agricole et de fournitures pour la production animale, en particulier l'équipement de hangars et d'élevages avicoles, en gros et au détail."}
          </p>
          <div className={styles.activitiesGrid}>
            <div className={styles.activityCard}>
              <div className={styles.uspIcon}>
                <Factory size={28} />
              </div>
              <h3>{locale === "ar" ? "التصنيع" : "Fabrication"}</h3>
              <p>{locale === "ar" ? "تصميم وتصنيع محلي للمعدات تحت علامتنا التجارية AGR METAL LUXE / Bouaziz" : "Conception et fabrication locale d'équipements sous notre marque AGR METAL LUXE / Bouaziz"}</p>
            </div>
            <div className={styles.activityCard}>
              <div className={styles.uspIcon}>
                <Store size={28} />
              </div>
              <h3>{locale === "ar" ? "التوزيع" : "Distribution"}</h3>
              <p>{locale === "ar" ? "استيراد وتوزيع العلامات التجارية العالمية مثل: River, Philips, OMSA, Cifarelli, ELICOM" : "Importation et distribution de marques internationales : River, Philips, OMSA, Cifarelli, ELICOM"}</p>
            </div>
            <div className={styles.activityCard}>
              <div className={styles.uspIcon}>
                <Wrench size={28} />
              </div>
              <h3>{locale === "ar" ? "الخدمات" : "Service"}</h3>
              <p>{locale === "ar" ? "تركيب وتشغيل وصيانة معدات الدواجن والزراعة" : "Installation, mise en service et maintenance des équipements avicoles et agricoles"}</p>
            </div>
            <div className={styles.activityCard}>
              <div className={styles.uspIcon}>
                <Package size={28} />
              </div>
              <h3>{locale === "ar" ? "البيع عبر الإنترنت" : "Vente en Ligne"}</h3>
              <p>{locale === "ar" ? "متجر إلكتروني مع توصيل يشمل جميع الولايات الـ 24" : "Boutique en ligne avec livraison dans les 24 gouvernorats tunisiens"}</p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statNum}>+500</span>
              <span className={styles.statLabel}>{locale === "ar" ? "منتج متوفر" : "Produits disponibles"}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum}>+128K</span>
              <span className={styles.statLabel}>{locale === "ar" ? "متابع فيسبوك" : "Abonnés Facebook"}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum}>+74K</span>
              <span className={styles.statLabel}>{locale === "ar" ? "متابع تيك توك" : "Abonnés TikTok"}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum}>5/5</span>
              <span className={styles.statLabel}>{locale === "ar" ? "تقييم جوجل ماب" : "Note Google Maps"}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum}>24</span>
              <span className={styles.statLabel}>{locale === "ar" ? "ولاية نغطيها" : "Gouvernorats desservis"}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum}>7/7</span>
              <span className={styles.statLabel}>{locale === "ar" ? "أيام العمل" : "Jours d'ouverture"}</span>
            </div>
          </div>
        </section>

        {/* USPs */}
        <section className={styles.section}>
          <h2 className="section-title">{locale === "ar" ? "امتيازاتنا" : "Nos avantages"}</h2>
          <div className={styles.uspsGrid}>
            <div className={styles.uspCard}>
              <div className={styles.uspIcon}><Award size={28} /></div>
              <h3>{locale === "ar" ? "أتمتة كاملة" : "Automatisation Complète"}</h3>
              <p>{locale === "ar" ? "فقاسات أوتوماتيكية وأنظمة ذكية لتغذية وسقي الدواجن من أحدث جيل." : "Couveuses automatiques, systèmes d'alimentation et d'abreuvement intelligents de dernière génération."}</p>
            </div>
            <div className={styles.uspCard}>
              <div className={styles.uspIcon}><Star size={28} /></div>
              <h3>{locale === "ar" ? "السرعة والجودة" : "Rapidité & Qualité"}</h3>
              <p>{locale === "ar" ? "تنفيذ سريع للطلبات مع جودة لا تشوبها شائبة ومضمونة من قبل عملائنا." : "Exécution rapide de vos commandes avec une qualité de produit irréprochable, validée par nos clients."}</p>
            </div>
            <div className={styles.uspCard}>
              <div className={styles.uspIcon}><Wrench size={28} /></div>
              <h3>{locale === "ar" ? "خدمة ما بعد البيع والدعم" : "SAV & Support"}</h3>
              <p>{locale === "ar" ? "خدمة تفاعلية سريعة ودعم تقني مباشر لحماية استثماراتك." : "Service après-vente réactif et support technique direct pour accompagner votre investissement."}</p>
            </div>
            <div className={styles.uspCard}>
              <div className={styles.uspIcon}><Truck size={28} /></div>
              <h3>{locale === "ar" ? "توصيل وطني" : "Livraison Nationale"}</h3>
              <p>{locale === "ar" ? "توصيل مضمون لجميع ولايات الجمهورية بسعر ثابت قدره 8 دنانير فقط." : "Expédition garantie vers tous les gouvernorats tunisiens à un prix fixe de 8 DT seulement."}</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <h2>{locale === "ar" ? "مستعد للعمل معنا؟" : "Prêt à travailler avec nous ?"}</h2>
          <p>{locale === "ar" ? "اتصل بنا للحصول على عرض سعر مخصص أو تفضل بزيارة معرضنا في صفاقس" : "Contactez-nous pour un devis personnalisé ou visitez notre showroom à Sfax"}</p>
          <div className={styles.ctaActions}>
            <Link href={`/${locale}/boutique`} className="btn btn-gold btn-lg">{locale === "ar" ? "اكتشف منتجاتنا" : "Découvrir nos produits"} {isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}</Link>
            <Link href={`/${locale}/contact`} className="btn btn-secondary btn-lg">{locale === "ar" ? "اتصل بنا" : "Nous contacter"}</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
