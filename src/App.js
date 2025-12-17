import React, { useEffect, useState } from "react";

export default function App() {
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem("products")) || []);
  const [form, setForm] = useState({ name: "", price: "", quantity: "" });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("inventory");

  const LOW_STOCK_LIMIT = 5;

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setProducts(products.map(p => p.id === editId ? { ...p, ...form } : p));
      setEditId(null);
    } else {
      setProducts([...products, { ...form, id: Date.now() }]);
    }
    setForm({ name: "", price: "", quantity: "" });
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, price: p.price, quantity: p.quantity });
    setEditId(p.id);
  };

  const handleDelete = (id) => setProducts(products.filter(p => p.id !== id));

  const stockIn = (id) => setProducts(products.map(p => p.id === id ? { ...p, quantity: Number(p.quantity) + 1 } : p));
  const stockOut = (id) => setProducts(products.map(p => p.id === id && p.quantity > 0 ? { ...p, quantity: Number(p.quantity) - 1 } : p));

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const lowStockProducts = products.filter(p => p.quantity < LOW_STOCK_LIMIT);

  return (
    <div className="app">
      <h1>📦 Inventory Management System</h1>

      <div className="cards">
        <div className="card blue" onClick={() => setPage("inventory")}>Total Products<span>{products.length}</span></div>
        <div className="card red" onClick={() => setPage("lowstock")}>Low Stock<span>{lowStockProducts.length}</span></div>
      </div>

      {page === "inventory" && (
        <React.Fragment>
          <form className="form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
            <button type="submit">{editId ? "Update" : "Add"}</button>
          </form>

          <input className="search" placeholder="🔍 Search product" value={search} onChange={e => setSearch(e.target.value)} />

          <table>
            <thead>
              <tr><th>Name</th><th>Price</th><th>Qty</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id} className={p.quantity < LOW_STOCK_LIMIT ? "low" : ""}>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.quantity}</td>
                  <td>
                    <button className="small" onClick={() => stockIn(p.id)}>+</button>
                    <button className="small" onClick={() => stockOut(p.id)}>-</button>
                    <button className="edit" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="delete" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </React.Fragment>
      )}

      {page === "lowstock" && (
        <React.Fragment>
          <button className="back" onClick={() => setPage("inventory")}>⬅ Back</button>
          <h2 style={{ color: "#fff" }}>⚠️ Low Stock Products</h2>
          <table>
            <thead>
              <tr><th>Name</th><th>Price</th><th>Qty</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {lowStockProducts.map(p => (
                <tr key={p.id} className="low">
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.quantity}</td>
                  <td><button className="small" onClick={() => stockIn(p.id)}>+</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </React.Fragment>
      )}
    </div>
  );
}