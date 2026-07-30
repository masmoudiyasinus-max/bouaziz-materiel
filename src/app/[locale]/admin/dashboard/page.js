"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter, useParams } from "next/navigation";
import styles from "./dashboard.module.css";
import { LogOut, RefreshCw, Edit2, Save, X } from "lucide-react";

export default function AdminDashboard() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingVarIndex, setEditingVarIndex] = useState(null);
  const [editPrice, setEditPrice] = useState(0);
  const router = useRouter();
  const params = useParams();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "mock-project-id") {
        console.warn("Firebase not properly configured yet");
        setCatalog([]);
        setLoading(false);
        return;
      }
      
      const querySnapshot = await getDocs(collection(db, "catalog"));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setCatalog(items);
    } catch (error) {
      console.error("Error fetching catalog", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push(`/${params.locale || "fr"}/admin/login`);
  };

  const handleMigrate = async () => {
    if (confirm("Voulez-vous migrer les données du fichier local vers la base de données ? Cela remplacera la base existante.")) {
      setMigrating(true);
      try {
        const res = await fetch("/api/admin/migrate", { method: "POST" });
        if (res.ok) {
          alert("Migration réussie !");
          fetchProducts();
        } else {
          alert("Erreur lors de la migration.");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setMigrating(false);
      }
    }
  };

  const startEdit = (catId, varIndex, currentPrice) => {
    setEditingCatId(catId);
    setEditingVarIndex(varIndex);
    setEditPrice(currentPrice);
  };

  const saveEdit = async (catId, varIndex) => {
    try {
      // Find the category
      const category = catalog.find(c => c.id === catId);
      if (!category) return;
      
      // Update variant array
      const updatedVariants = [...category.variants];
      updatedVariants[varIndex].price = Number(editPrice);
      
      const categoryRef = doc(db, "catalog", catId);
      await updateDoc(categoryRef, { variants: updatedVariants });
      
      setCatalog(catalog.map(c => c.id === catId ? { ...c, variants: updatedVariants } : c));
      setEditingCatId(null);
      setEditingVarIndex(null);
    } catch (err) {
      console.error("Error updating price", err);
      alert("Erreur de sauvegarde");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Tableau de bord Administrateur</h1>
        <div className={styles.headerActions}>
          <button onClick={handleMigrate} disabled={migrating} className={styles.btnSecondary}>
            <RefreshCw size={16} /> {migrating ? "Migration..." : "Migrer Data Locale"}
          </button>
          <button onClick={handleLogout} className={styles.btnLogout}>
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {loading ? (
          <p>Chargement du catalogue...</p>
        ) : catalog.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Aucun produit dans la base de données Firebase.</p>
            <p>Veuillez configurer vos clés Firebase puis cliquer sur "Migrer Data Locale".</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            {catalog.map((cat) => (
              <div key={cat.id} style={{marginBottom: "30px"}}>
                <h2 style={{fontSize: "1.2rem", padding: "10px", background: "#f3f4f6"}}>{cat.name}</h2>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Modèle / Variante (FR)</th>
                      <th>Prix (DT)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.variants.map((v, idx) => (
                      <tr key={idx}>
                        <td>{v.title}</td>
                        <td>
                          {editingCatId === cat.id && editingVarIndex === idx ? (
                            <input 
                              type="number" 
                              value={editPrice} 
                              onChange={(e) => setEditPrice(e.target.value)}
                              className={styles.editInput}
                            />
                          ) : (
                            <span className={styles.priceTag}>{v.price.toFixed(2)} DT</span>
                          )}
                        </td>
                        <td>
                          {editingCatId === cat.id && editingVarIndex === idx ? (
                            <div className={styles.actionRow}>
                              <button onClick={() => saveEdit(cat.id, idx)} className={styles.btnSave}><Save size={16}/></button>
                              <button onClick={() => {setEditingCatId(null); setEditingVarIndex(null);}} className={styles.btnCancel}><X size={16}/></button>
                            </div>
                          ) : (
                            <button onClick={() => startEdit(cat.id, idx, v.price)} className={styles.btnEdit}><Edit2 size={16}/></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
