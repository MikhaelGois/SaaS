'use client';

import { useState, useEffect } from 'react';

// Mock data (in a real app, this would come from API)
const mockIngredients = [
  { id: 'ing1', name: 'Alface', stock: 1000, unit: 'g', minStockAlert: 200 },
  { id: 'ing2', name: 'Tomate', stock: 500, unit: 'un', minStockAlert: 100 },
  { id: 'ing3', name: 'Carne Bovina', stock: 5000, unit: 'g', minStockAlert: 1000 },
  { id: 'ing4', name: 'Pão de Hambúrguer', stock: 50, unit: 'un', minStockAlert: 10 },
];

const mockProducts = [
  { id: 'prod1', name: 'Hamburguer Clássico', ingredients: [{ ingredientId: 'ing3', quantity: 150 }, { ingredientId: 'ing4', quantity: 1 }, { ingredientId: 'ing1', quantity: 20 }, { ingredientId: 'ing2', quantity: 30 }] },
  { id: 'prod2', name: 'Batata Frita Média', ingredients: [] }, // Assume oil is not tracked here
];

export default function StockPage() {
  const [ingredients, setIngredients] = useState(mockIngredients);
  const [products, setProducts] = useState(mockProducts);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [form, setForm] = useState({ id: '', name: '', stock: 0, unit: '', minStockAlert: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === 'number' ? parseFloat(value) : value });
  };

  const handleSelectIngredient = (ingredient) => {
    setSelectedIngredient(ingredient);
    setForm(ingredient);
  };

  const handleClearForm = () => {
    setSelectedIngredient(null);
    setForm({ id: '', name: '', stock: 0, unit: '', minStockAlert: 0 });
  };

  const handleSaveIngredient = () => {
    if (selectedIngredient) {
      // Update existing ingredient
      setIngredients(prev => prev.map(ing => ing.id === form.id ? form : ing));
      // In a real app, send PUT/PATCH request to backend
      console.log('Updating ingredient:', form);
    } else {
      // Create new ingredient
      const newIngredient = { ...form, id: `ing${Date.now()}` };
      setIngredients(prev => [...prev, newIngredient]);
      // In a real app, send POST request to backend
      console.log('Creating ingredient:', newIngredient);
    }
    handleClearForm();
  };

  const handleDeleteIngredient = (id) => {
    setIngredients(prev => prev.filter(ing => ing.id !== id));
    // In a real app, send DELETE request to backend
    console.log('Deleting ingredient:', id);
    if (selectedIngredient?.id === id) {
      handleClearForm();
    }
  };

  const handleUpdateProductIngredientQuantity = (productId, ingredientId, newQuantity) => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id === productId) {
          const updatedIngredients = product.ingredients.map(pi =>
            pi.ingredientId === ingredientId ? { ...pi, quantity: newQuantity } : pi
          );
          return { ...product, ingredients: updatedIngredients };
        }
        return product;
      })
    );
    // In a real app, send PATCH request to backend for product-ingredient
    console.log(`Updating product ${productId}, ingredient ${ingredientId} quantity to ${newQuantity}`);
  };

  const handleAddProductIngredient = (productId, ingredientId, quantity) => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id === productId) {
          const existing = product.ingredients.find(pi => pi.ingredientId === ingredientId);
          if (existing) {
            return {
                ...product,
                ingredients: product.ingredients.map(pi => pi.ingredientId === ingredientId ? {...pi, quantity: quantity} : pi)
            }
          }
          return { ...product, ingredients: [...product.ingredients, { ingredientId, quantity }] };
        }
        return product;
      })
    );
    // In a real app, send POST request to backend for product-ingredient
    console.log(`Adding ingredient ${ingredientId} to product ${productId} with quantity ${quantity}`);
  };

  const handleRemoveProductIngredient = (productId, ingredientId) => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id === productId) {
          return { ...product, ingredients: product.ingredients.filter(pi => pi.ingredientId !== ingredientId) };
        }
        return product;
      })
    );
    // In a real app, send DELETE request to backend for product-ingredient
    console.log(`Removing ingredient ${ingredientId} from product ${productId}`);
  };


  const filteredIngredients = ingredients.filter(ing =>
    ing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {/* Ingredient List */}
      <div style={{ flex: 1, paddingRight: '20px', borderRight: '1px solid #eee', overflowY: 'auto' }}>
        <h2>Ingredientes</h2>
        <input
          type="text"
          placeholder="Buscar ingredientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
        />
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredIngredients.map(ing => (
            <li
              key={ing.id}
              style={{
                border: `1px solid ${selectedIngredient?.id === ing.id ? 'blue' : '#ddd'}`,
                padding: '10px',
                marginBottom: '8px',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: ing.stock <= ing.minStockAlert ? '#ffebee' : '#fff', // Highlight low stock
              }}
              onClick={() => handleSelectIngredient(ing)}
            >
              <strong>{ing.name}</strong>: {ing.stock} {ing.unit} (Min: {ing.minStockAlert})
              <button onClick={() => handleDeleteIngredient(ing.id)} style={{ float: 'right', background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px' }}>X</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Ingredient Form */}
      <div style={{ flex: 1, padding: '0 20px', borderRight: '1px solid #eee' }}>
        <h2>{selectedIngredient ? 'Editar Ingrediente' : 'Adicionar Ingrediente'}</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSaveIngredient(); }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Nome:</label>
            <input type="text" name="name" value={form.name} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Estoque:</label>
            <input type="number" name="stock" value={form.stock} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Unidade:</label>
            <input type="text" name="unit" value={form.unit} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Alerta Mínimo:</label>
            <input type="number" name="minStockAlert" value={form.minStockAlert} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <button type="submit" style={{ padding: '10px 15px', background: 'blue', color: 'white', border: 'none', borderRadius: '4px' }}>
            {selectedIngredient ? 'Salvar Alterações' : 'Adicionar'}
          </button>
          {selectedIngredient && (
            <button type="button" onClick={handleClearForm} style={{ marginLeft: '10px', padding: '10px 15px', background: '#ccc', border: 'none', borderRadius: '4px' }}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      {/* Product-Ingredient Association */}
      <div style={{ flex: 1, paddingLeft: '20px', overflowY: 'auto' }}>
        <h2>Associação Produto-Ingrediente</h2>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
            <h3>{product.name}</h3>
            <ul>
              {product.ingredients.map(pi => {
                const ing = ingredients.find(i => i.id === pi.ingredientId);
                return (
                  <li key={pi.ingredientId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    {ing?.name} ({pi.quantity} {ing?.unit})
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={pi.quantity}
                            onChange={(e) => handleUpdateProductIngredientQuantity(product.id, pi.ingredientId, parseFloat(e.target.value))}
                            style={{ width: '60px', marginRight: '5px' }}
                        />
                        <button onClick={() => handleRemoveProductIngredient(product.id, pi.ingredientId)} style={{ background: 'red', color: 'white', border: 'none', padding: '3px 8px', borderRadius: '3px' }}>
                            Remover
                        </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div style={{ marginTop: '10px' }}>
                <select onChange={(e) => handleAddProductIngredient(product.id, e.target.value, 1)} style={{ padding: '5px', marginRight: '5px' }}>
                    <option value="">Adicionar Ingrediente...</option>
                    {ingredients.filter(ing => !product.ingredients.some(pi => pi.ingredientId === ing.id)).map(ing => (
                        <option key={ing.id} value={ing.id}>{ing.name}</option>
                    ))}
                </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
