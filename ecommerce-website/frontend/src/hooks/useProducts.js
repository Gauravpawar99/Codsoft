import { useEffect, useState } from "react";
import api from "../api/axios"; 

export default function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/products"); 
        if (!alive) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        if (!alive) return;
        setProducts([]); 
      }
    })();
    return () => { alive = false; };
  }, []);

  return products;
}
