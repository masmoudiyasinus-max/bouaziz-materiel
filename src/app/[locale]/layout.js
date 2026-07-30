import "../globals.css";
import { Plus_Jakarta_Sans, Tajawal } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { I18nProvider } from "@/context/I18nContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary } from "@/dictionaries";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-tajawal",
});

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isAr = locale === "ar";
  
  return {
    title: {
      default: isAr ? "بوعزيز للمعدات الزراعية — معدات زراعية تونس" : "Bouaziz Matériel Agricole et d'élevage — Équipements Agricoles Tunisie",
      template: isAr ? "%s | بوعزيز للمعدات الزراعية" : "%s | Bouaziz Matériel Agricole",
    },
    description: isAr 
      ? "المتخصص الأول في تونس لمعدات تربية الدواجن والآلات الزراعية. فقاسات، معالف، آلات زراعية، موازين والمزيد. توصيل لجميع الولايات."
      : "Le spécialiste N°1 en équipements agricoles et avicoles en Tunisie. Couveuses, mangeoires, machines agricoles, balances et plus. Livraison nationale.",
    keywords: isAr 
      ? ["معدات زراعية تونس", "معدات فلاحية", "تربية الدواجن", "فقاسة بيض", "آلات زراعية صفاقس", "بوعزيز للمعدات"]
      : ["matériel agricole tunisie", "équipement avicole", "couveuse automatique", "élevage volaille tunisie", "machine agricole sfax", "bouaziz matériel"],
    authors: [{ name: isAr ? "بوعزيز للمعدات الزراعية" : "Bouaziz Matériel Agricole" }],
    openGraph: {
      title: isAr ? "بوعزيز للمعدات الزراعية" : "Bouaziz Matériel Agricole et d'élevage",
      description: isAr ? "المتخصص الأول في تونس لمعدات تربية الدواجن والآلات الزراعية" : "Le spécialiste N°1 en équipements agricoles et avicoles en Tunisie",
      url: "https://bouazizmaterielagricole.tn",
      siteName: isAr ? "بوعزيز للمعدات الزراعية" : "Bouaziz Matériel Agricole",
      locale: isAr ? "ar_TN" : "fr_TN",
      type: "website",
    },
    manifest: "/manifest.json",
    themeColor: "#153e2b",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: isAr ? "بوعزيز للمعدات" : "Bouaziz Agri",
    },
  };
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${jakarta.variable} ${tajawal.variable}`}>
      <body>
        <I18nProvider locale={locale} dict={dict}>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
