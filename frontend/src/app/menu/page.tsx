'use client';

import { useState, useEffect } from 'react';

// Mock data (in a real app, this would come from API)
const mockCategories = [
  { id: 'cat1', name: 'Lanches' },
  { id: 'cat2', name: 'Bebidas' },
  { id: 'cat3', name: 'Acompanhamentos' },
];

const mockProducts = [
  { id: 'prod1', name: 'Hamburguer Clássico', description: 'Carne, queijo, salada', price: 25.00, categoryId: 'cat1', available: true },
  { id: 'prod2', name: 'Batata Frita Média', description: 'Porção média de batatas', price: 12.00, categoryId: 'cat3', available: true },
  { id: 'prod3', name: 'Refrigerante Lata', description: 'Coca-cola, Pepsi', price: 7.00, categoryId: 'cat2', available: true },
  { id: 'prod4', name: 'Suco Natural', description: 'Vários sabores', price: 10.00, categoryId: 'cat2', available: false },
];

export default function MenuPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [products, setProducts] = useState(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForm, setProductForm] = useState({ id: '', name: '', description: '', price: 0, categoryId: '', available: true });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ id: '', name: '' });

  const handleProductFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm({ ...productForm, [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value) });
  };

  const handleCategoryFormChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm({ ...categoryForm, [name]: value });
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setProductForm(product);
  };

  const handleClearProductForm = () => {
    setSelectedProduct(null);
    setProductForm({ id: '', name: '', description: '', price: 0, categoryId: '', available: true });
  };

  const handleSaveProduct = () => {
    if (selectedProduct) {
      setProducts(prev => prev.map(p => p.id === productForm.id ? productForm : p));
      console.log('Updating product:', productForm);
    } else {
      const newProduct = { ...productForm, id: `prod${Date.now()}` };
      setProducts(prev => [...prev, newProduct]);
      console.log('Creating product:', newProduct);
    }
    handleClearProductForm();
  };

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    console.log('Deleting product:', id);
    if (selectedProduct?.id === id) {
      handleClearProductForm();
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCategoryForm(category);
  };

  const handleClearCategoryForm = () => {
    setSelectedCategory(null);
    setCategoryForm({ id: '', name: '' });
  };

  const handleSaveCategory = () => {
    if (selectedCategory) {
      setCategories(prev => prev.map(c => c.id === categoryForm.id ? categoryForm : c));
      console.log('Updating category:', categoryForm);
    } else {
      const newCategory = { ...categoryForm, id: `cat${Date.now()}` };
      setCategories(prev => [...prev, newCategory]);
      console.log('Creating category:', newCategory);
    }
    handleClearCategoryForm();
  };

  const handleDeleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    // Also remove products in this category, or reassign them
    setProducts(prev => prev.filter(p => p.categoryId !== id));
    console.log('Deleting category:', id);
    if (selectedCategory?.id === id) {
      handleClearCategoryForm();
    }
  };


  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {/* Category Management */}
      <div style={{ flex: 1, paddingRight: '20px', borderRight: '1px solid #eee', overflowY: 'auto' }}>
        <h2>Categorias</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSaveCategory(); }} style={{ marginBottom: '20px' }}>
          <input type="text" name="name" value={categoryForm.name} onChange={handleCategoryFormChange} placeholder="Nome da Categoria" required style={{ width: 'calc(100% - 70px)', padding: '8px', marginRight: '5px' }} />
          <button type="submit" style={{ padding: '8px 10px', background: 'green', color: 'white', border: 'none', borderRadius: '4px' }}>
            {selectedCategory ? 'Salvar' : 'Adicionar'}
          </button>
          {selectedCategory && (
            <button type="button" onClick={handleClearCategoryForm} style={{ marginLeft: '5px', padding: '8px 10px', background: '#ccc', border: 'none', borderRadius: '4px' }}>
              Cancelar
            </button>
          )}
        </form>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {categories.map(cat => (
            <li
              key={cat.id}
              style={{ border: `1px solid ${selectedCategory?.id === cat.id ? 'blue' : '#ddd'}`, padding: '10px', marginBottom: '8px', borderRadius: '4px', cursor: 'pointer' }}
              onClick={() => handleSelectCategory(cat)}
            >
              {cat.name}
              <button onClick={() => handleDeleteCategory(cat.id)} style={{ float: 'right', background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px' }}>X</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Product Management */}
      <div style={{ flex: 2, paddingLeft: '20px', overflowY: 'auto' }}>
        <h2>Produtos do Cardápio</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSaveProduct(); }} style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Nome:</label>
            <input type="text" name="name" value={productForm.name} onChange={handleProductFormChange} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Descrição:</label>
            <textarea name="description" value={productForm.description} onChange={handleProductFormChange} style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Preço:</label>
            <input type="number" name="price" value={productForm.price} onChange={handleProductFormChange} step="0.01" required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Categoria:</label>
            <select name="categoryId" value={productForm.categoryId} onChange={handleProductFormChange} required style={{ width: '100%', padding: '8px' }}>
              <option value="">Selecionar Categoria</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: '10px' }}>Disponível:</label>
            <input type="checkbox" name="available" checked={productForm.available} onChange={handleProductFormChange} />
          </div>
          <button type="submit" style={{ padding: '10px 15px', background: 'blue', color: 'white', border: 'none', borderRadius: '4px' }}>
            {selectedProduct ? 'Salvar Alterações' : 'Adicionar Produto'}
          </button>
          {selectedProduct && (
            <button type="button" onClick={handleClearProductForm} style={{ marginLeft: '10px', padding: '10px 15px', background: '#ccc', border: 'none', borderRadius: '4px' }}>
              Cancelar
            </button>
          )}
        </form>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
          {products.map(product => (
            <li
              key={product.id}
              style={{
                border: `1px solid ${selectedProduct?.id === product.id ? 'blue' : '#ddd'}`,
                padding: '10px',
                marginBottom: '8px',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: product.available ? '#fff' : '#fce4ec', // Highlight if not available
              }}
              onClick={() => handleSelectProduct(product)}
            >
              <strong>{product.name}</strong> - R$ {product.price.toFixed(2)} ({categories.find(c => c.id === product.categoryId)?.name})
              {!product.available && <span style={{ color: 'red', marginLeft: '10px' }}>(Indisponível)</span>}
              <button onClick={() => handleDeleteProduct(product.id)} style={{ float: 'right', background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px' }}>X</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
